import { pool } from '../database/connectdb.js';

const Coffee = {
  /** Get all coffees with optional filters */
  async find({ category, featured } = {}) {
    let query = 'SELECT * FROM coffees';
    const params = [];
    const conditions = [];

    if (category) {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }
    if (featured === true) {
      conditions.push('featured = TRUE');
    }

    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY created_at DESC';

    const { rows } = await pool.query(query, params);
    return rows.map(normalise);
  },

  /** Find one coffee by id */
  async findById(id) {
    const { rows } = await pool.query('SELECT * FROM coffees WHERE id = $1', [id]);
    return rows[0] ? normalise(rows[0]) : null;
  },

  /** Create a new coffee product */
  async create(data) {
    const {
      name, origin = 'Unknown', price, description, image,
      category = 'Beverage', rating = 0, stock = 0, featured = false,
      weight, roastLevel = '', flavorProfile = [], material, capacity,
    } = data;

    const { rows } = await pool.query(
      `INSERT INTO coffees
         (name,origin,price,description,image,category,rating,stock,featured,
          weight,roast_level,flavor_profile,material,capacity)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       RETURNING *`,
      [name, origin, price, description, image, category, rating, stock, featured,
       weight, roastLevel, flavorProfile, material, capacity]
    );
    return normalise(rows[0]);
  },

  /** Update a coffee, returns updated row or null */
  async findByIdAndUpdate(id, updates) {
    const allowed = [
      'name','origin','price','description','image','category',
      'rating','stock','featured','weight','roast_level','flavor_profile',
      'material','capacity',
    ];
    // Map camelCase keys to snake_case db columns
    const colMap = { roastLevel: 'roast_level', flavorProfile: 'flavor_profile' };

    const setClauses = [];
    const params = [];

    for (const [key, val] of Object.entries(updates)) {
      const col = colMap[key] || key;
      if (!allowed.includes(col)) continue;
      params.push(val);
      setClauses.push(`${col} = $${params.length}`);
    }

    if (!setClauses.length) return this.findById(id);

    params.push(id);
    const { rows } = await pool.query(
      `UPDATE coffees SET ${setClauses.join(', ')} WHERE id = $${params.length} RETURNING *`,
      params
    );
    return rows[0] ? normalise(rows[0]) : null;
  },

  /** Delete a coffee by id */
  async findByIdAndDelete(id) {
    const { rows } = await pool.query(
      'DELETE FROM coffees WHERE id = $1 RETURNING *', [id]
    );
    return rows[0] ? normalise(rows[0]) : null;
  },

  async countDocuments() {
    const { rows } = await pool.query('SELECT COUNT(*) FROM coffees');
    return Number(rows[0].count);
  },
};

/** Map snake_case columns → camelCase for API responses */
function normalise(row) {
  if (!row) return null;
  return {
    id:            row.id,
    name:          row.name,
    origin:        row.origin,
    price:         Number(row.price),
    description:   row.description,
    image:         row.image,
    category:      row.category,
    rating:        Number(row.rating),
    stock:         row.stock,
    featured:      row.featured,
    weight:        row.weight,
    roastLevel:    row.roast_level,
    flavorProfile: row.flavor_profile || [],
    material:      row.material,
    capacity:      row.capacity,
    createdAt:     row.created_at,
    updatedAt:     row.updated_at,
  };
}

export default Coffee;
