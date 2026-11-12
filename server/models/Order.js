import { pool } from '../database/connectdb.js';

/** Normalise a flat order row + its items into the shape controllers expect */
function normalise(row, items = []) {
  if (!row) return null;
  return {
    id:              row.id,
    customerId:      row.customer_id,
    customerName:    row.customer_name,
    email:           row.email,
    phone:           row.phone,
    shippingAddress: row.shipping_address,
    total:           Number(row.total),
    status:          row.status,
    paymentMethod:   row.payment_method,
    paymentMeta:     row.payment_meta || {},
    items:           items.map(i => ({
      id:       i.id,
      coffeeId: i.coffee_id,
      name:     i.name,
      quantity: i.quantity,
      price:    Number(i.price),
    })),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Load items for a list of order IDs in one query */
async function loadItems(orderIds) {
  if (!orderIds.length) return {};
  const { rows } = await pool.query(
    `SELECT * FROM order_items WHERE order_id = ANY($1)`,
    [orderIds]
  );
  return rows.reduce((acc, r) => {
    (acc[r.order_id] = acc[r.order_id] || []).push(r);
    return acc;
  }, {});
}

const Order = {
  /** Create a new order inside a transaction */
  async create({ customerId, customerName, email, phone, shippingAddress,
                  items, paymentMethod, paymentMeta, status = 'pending' }) {

    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { rows: [order] } = await client.query(
        `INSERT INTO orders
           (customer_id, customer_name, email, phone, shipping_address,
            total, status, payment_method, payment_meta)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         RETURNING *`,
        [customerId || null, customerName, email.toLowerCase(), phone || '',
         shippingAddress || '', total, status, paymentMethod, paymentMeta || {}]
      );

      const itemRows = [];
      for (const item of items) {
        const { rows: [r] } = await client.query(
          `INSERT INTO order_items (order_id, coffee_id, name, quantity, price)
           VALUES ($1,$2,$3,$4,$5) RETURNING *`,
          [order.id, item.coffeeId || null, item.name, item.quantity, item.price]
        );
        itemRows.push(r);
      }

      await client.query('COMMIT');
      return normalise(order, itemRows);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  /** Get all orders with their items */
  async find({ customerId, status } = {}) {
    let query = `SELECT o.*, u.name AS user_name, u.email AS user_email
                 FROM orders o
                 LEFT JOIN users u ON u.id = o.customer_id`;
    const params = [];
    const conditions = [];

    if (customerId) {
      params.push(customerId);
      conditions.push(`o.customer_id = $${params.length}`);
    }
    if (status) {
      params.push(status);
      conditions.push(`o.status = $${params.length}`);
    }

    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY o.created_at DESC';

    const { rows } = await pool.query(query, params);
    const itemMap = await loadItems(rows.map(r => r.id));
    return rows.map(r => normalise(r, itemMap[r.id] || []));
  },

  /** Find one order by id */
  async findById(id) {
    const { rows: [row] } = await pool.query(
      `SELECT o.*, u.name AS user_name, u.email AS user_email
       FROM orders o LEFT JOIN users u ON u.id = o.customer_id
       WHERE o.id = $1`,
      [id]
    );
    if (!row) return null;
    const { rows: items } = await pool.query(
      'SELECT * FROM order_items WHERE order_id = $1', [id]
    );
    return normalise(row, items);
  },

  /** Find one order by a JSONB payment_meta key */
  async findByPaymentMeta(key, value) {
    const { rows: [row] } = await pool.query(
      `SELECT * FROM orders WHERE payment_meta->>'${key}' = $1 LIMIT 1`,
      [value]
    );
    if (!row) return null;
    const { rows: items } = await pool.query(
      'SELECT * FROM order_items WHERE order_id = $1', [row.id]
    );
    return normalise(row, items);
  },

  /** Count all orders (optional status filter) */
  async countDocuments(filter = {}) {
    let query = 'SELECT COUNT(*) FROM orders';
    const params = [];
    const conditions = [];

    if (filter.status) {
      params.push(filter.status);
      conditions.push(`status = $${params.length}`);
    }
    if (filter.createdAt?.$gte) {
      params.push(filter.createdAt.$gte);
      conditions.push(`created_at >= $${params.length}`);
    }

    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    const { rows } = await pool.query(query, params);
    return Number(rows[0].count);
  },

  /** Update status or other fields on an order */
  async updateById(id, updates) {
    const colMap = {
      customerName:    'customer_name',
      email:           'email',
      phone:           'phone',
      shippingAddress: 'shipping_address',
      paymentMethod:   'payment_method',
      paymentMeta:     'payment_meta',
      status:          'status',
      total:           'total',
    };

    const setClauses = [];
    const params = [];

    for (const [key, val] of Object.entries(updates)) {
      const col = colMap[key] || key;
      params.push(val);
      setClauses.push(`${col} = $${params.length}`);
    }

    if (!setClauses.length) return this.findById(id);

    params.push(id);
    const { rows: [row] } = await pool.query(
      `UPDATE orders SET ${setClauses.join(', ')} WHERE id = $${params.length} RETURNING *`,
      params
    );
    if (!row) return null;
    const { rows: items } = await pool.query(
      'SELECT * FROM order_items WHERE order_id = $1', [id]
    );
    return normalise(row, items);
  },

  /** Delete an order (cascades to order_items) */
  async findByIdAndDelete(id) {
    const { rows: [row] } = await pool.query(
      'DELETE FROM orders WHERE id = $1 RETURNING *', [id]
    );
    return row ? normalise(row) : null;
  },

  /** Aggregate stats for admin dashboard */
  async getStats() {
    const totalOrders = await this.countDocuments();

    const { rows: [salesRow] } = await pool.query(
      'SELECT COALESCE(SUM(total),0) AS total FROM orders'
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await this.countDocuments({ createdAt: { $gte: today } });

    const { rows: [todaySalesRow] } = await pool.query(
      'SELECT COALESCE(SUM(total),0) AS total FROM orders WHERE created_at >= $1',
      [today]
    );

    const { rows: statusRows } = await pool.query(
      'SELECT status, COUNT(*) AS count FROM orders GROUP BY status'
    );

    return {
      totalOrders,
      totalSales:  Number(salesRow.total),
      todayOrders,
      todaySales:  Number(todaySalesRow.total),
      statusCounts: statusRows.reduce((acc, r) => {
        acc[r.status] = Number(r.count);
        return acc;
      }, {}),
    };
  },
};

export default Order;
