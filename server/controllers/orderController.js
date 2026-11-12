import Order from '../models/Order.js';
import Coffee from '../models/Coffee.js';
import { pool } from '../database/connectdb.js';
import { sendOrderConfirmation, sendStatusUpdate } from '../utils/mailer.js';
import { sendTelegramOrderAlert, sendTelegramStatusAlert } from '../utils/telegram.js';

// POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const {
      customerId, customerName, email, items,
      paymentMethod, paymentMeta, shippingAddress, phone,
    } = req.body;

    if (!customerName || !email || !items || !paymentMethod)
      return res.status(400).json({
        success: false,
        message: 'Please provide customer name, email, items, and payment method',
      });

    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ success: false, message: 'Items must be a non-empty array' });

    for (const item of items) {
      if (!item.name || !item.quantity || item.price === undefined)
        return res.status(400).json({ success: false, message: 'Each item must have name, quantity, and price' });
      if (item.quantity < 1 || item.quantity > 100)
        return res.status(400).json({ success: false, message: 'Item quantity must be between 1 and 100' });
    }

    // ── Server-side price & stock verification ───────────────────────────────
    const verifiedItems = [];
    for (const item of items) {
      if (item.coffeeId) {
        const product = await Coffee.findById(item.coffeeId);
        if (!product)
          return res.status(400).json({ success: false, message: `Product "${item.name}" no longer exists` });

        // Reject if client price doesn't match DB price (tamper protection)
        if (Math.abs(Number(item.price) - Number(product.price)) > 0.01)
          return res.status(400).json({
            success: false,
            message: `Price mismatch for "${product.name}". Please refresh and try again.`,
          });

        // Check stock
        if (product.stock !== null && product.stock < item.quantity)
          return res.status(400).json({
            success: false,
            message: `Only ${product.stock} units of "${product.name}" available`,
          });

        verifiedItems.push({ ...item, price: product.price, coffeeId: product.id });
      } else {
        // Guest item without coffeeId — allow but use client price (menu beverages)
        verifiedItems.push(item);
      }
    }
    // ────────────────────────────────────────────────────────────────────────

    const order = await Order.create({
      customerId:      customerId || null,
      customerName,
      email:           email.toLowerCase(),
      items:           verifiedItems,
      paymentMethod,
      paymentMeta:     paymentMeta || {},
      shippingAddress: shippingAddress || '',
      phone:           phone || '',
    });

    // Decrement stock for shop products (non-blocking, logged on failure)
    decrementStock(verifiedItems).catch(err =>
      console.warn('⚠️  Stock decrement failed:', err.message)
    );

    // Notifications (non-blocking)
    sendOrderConfirmation(order).catch(err =>
      console.warn('⚠️  Confirmation email failed:', err.message)
    );
    sendTelegramOrderAlert(order).catch(err =>
      console.warn('⚠️  Telegram alert failed:', err.message)
    );

    res.status(201).json({ success: true, message: 'Order created successfully', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

/** Decrement stock for items that have a coffeeId */
async function decrementStock(items) {
  for (const item of items) {
    if (!item.coffeeId) continue;
    await pool.query(
      `UPDATE coffees SET stock = GREATEST(stock - $1, 0) WHERE id = $2`,
      [item.quantity, item.coffeeId]
    );
  }
}

// GET /api/orders  (admin)
export const getAllOrders = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const orders = await Order.find(filter);
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// GET /api/orders/customer/:customerId
export const getOrdersByCustomer = async (req, res) => {
  try {
    // Only allow users to see their own orders (unless admin)
    if (req.user.role !== 'admin' && req.user.id !== req.params.customerId)
      return res.status(403).json({ success: false, message: 'Access denied' });

    const orders = await Order.find({ customerId: req.params.customerId });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// PUT /api/orders/:id/status  (admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status)
      return res.status(400).json({ success: false, message: 'Please provide status' });

    const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status))
      return res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(', ')}` });

    const existing = await Order.findById(req.params.id);
    if (!existing)
      return res.status(404).json({ success: false, message: 'Order not found' });

    // Restore stock if order is cancelled after being processing/completed
    if (status === 'cancelled' && ['processing', 'completed'].includes(existing.status)) {
      restoreStock(existing.items).catch(err =>
        console.warn('⚠️  Stock restore failed:', err.message)
      );
    }

    const order = await Order.updateById(req.params.id, { status });

    sendStatusUpdate(order).catch(err =>
      console.warn('⚠️  Status update email failed:', err.message)
    );
    sendTelegramStatusAlert(order).catch(err =>
      console.warn('⚠️  Telegram status alert failed:', err.message)
    );

    res.json({ success: true, message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

/** Restore stock when an order is cancelled */
async function restoreStock(items) {
  for (const item of items) {
    if (!item.coffeeId) continue;
    await pool.query(
      `UPDATE coffees SET stock = stock + $1 WHERE id = $2`,
      [item.quantity, item.coffeeId]
    );
  }
}

// PUT /api/orders/:id  (admin — full update)
export const updateOrder = async (req, res) => {
  try {
    const existing = await Order.findById(req.params.id);
    if (!existing)
      return res.status(404).json({ success: false, message: 'Order not found' });

    const allowed = ['customerName','email','paymentMethod','paymentMeta',
                     'shippingAddress','phone','status'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const order = await Order.updateById(req.params.id, updates);
    res.json({ success: true, message: 'Order updated successfully', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// DELETE /api/orders/:id  (admin)
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order)
      return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// GET /api/orders/stats/summary  (admin)
export const getOrderStats = async (req, res) => {
  try {
    const stats = await Order.getStats();
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// GET /api/orders/report/sales  (admin) — daily sales CSV
export const getSalesReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const fromDate = from ? new Date(from) : new Date(Date.now() - 30 * 86400000);
    const toDate   = to   ? new Date(to)   : new Date();

    const { rows } = await pool.query(
      `SELECT
         DATE(created_at) AS date,
         COUNT(*)         AS orders,
         SUM(total)       AS revenue,
         payment_method
       FROM orders
       WHERE created_at BETWEEN $1 AND $2
         AND status != 'cancelled'
       GROUP BY DATE(created_at), payment_method
       ORDER BY date DESC`,
      [fromDate, toDate]
    );

    // Build CSV
    const csv = [
      'Date,Orders,Revenue (birr),Payment Method',
      ...rows.map(r => `${r.date},${r.orders},${Number(r.revenue).toFixed(2)},${r.payment_method}`)
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="sales-report-${fromDate.toISOString().slice(0,10)}.csv"`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};
