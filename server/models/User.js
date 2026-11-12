import { pool } from '../database/connectdb.js';
import bcrypt from 'bcryptjs';

const User = {
  /** Find one user by id, email, or name */
  async findOne({ id, email, name } = {}) {
    let query, params;
    if (id) {
      query = 'SELECT * FROM users WHERE id = $1 LIMIT 1';
      params = [id];
    } else if (email && name) {
      query = 'SELECT * FROM users WHERE email = $1 OR name = $2 LIMIT 1';
      params = [email.toLowerCase(), name];
    } else if (email) {
      query = 'SELECT * FROM users WHERE email = $1 LIMIT 1';
      params = [email.toLowerCase()];
    } else if (name) {
      query = 'SELECT * FROM users WHERE name = $1 LIMIT 1';
      params = [name];
    } else {
      return null;
    }
    const { rows } = await pool.query(query, params);
    return rows[0] || null;
  },

  /** Create a new user (hashes password automatically) */
  async create({ name, email, password, role = 'user' }) {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at`,
      [name, email.toLowerCase(), hashed, role]
    );
    return rows[0];
  },

  /** Count users matching optional filter */
  async count({ role } = {}) {
    const q = role
      ? 'SELECT COUNT(*) FROM users WHERE role = $1'
      : 'SELECT COUNT(*) FROM users';
    const { rows } = await pool.query(q, role ? [role] : []);
    return Number(rows[0].count);
  },

  /** Compare plain password with stored hash */
  async matchPassword(user, plainPassword) {
    return bcrypt.compare(plainPassword, user.password);
  },
};

export default User;
