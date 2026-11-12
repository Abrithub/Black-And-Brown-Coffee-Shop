import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const formatAdmin = (user) => ({
  id:    user.id,
  name:  user.name,
  email: user.email,
  role:  user.role,
});

// POST /api/admin/login
export const login = async (req, res) => {
  try {
    const { username, email, emailOrUsername, password } = req.body;
    const identifier = (emailOrUsername ?? username ?? email ?? '').toString().trim();

    if (!identifier || !password)
      return res.status(400).json({ success: false, message: 'Username/email and password are required' });

    const user = await User.findOne({
      email: identifier.toLowerCase(),
      name:  identifier,
    });

    if (!user || user.role !== 'admin' || !(await User.matchPassword(user, password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials or not an admin' });

    res.json({ success: true, admin: formatAdmin(user), token: generateToken(user.id) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/admin/register  (requires existing admin token)
export const register = async (req, res) => {
  try {
    const { username, name, fullName, email, password } = req.body;
    const adminName = (username ?? name ?? fullName ?? '').toString().trim();

    if (!adminName || !email || !password)
      return res.status(400).json({ success: false, message: 'All fields are required' });

    if (password.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ success: false, message: 'Email already registered' });

    const admin = await User.create({ name: adminName, email, password, role: 'admin' });
    res.status(201).json({ success: true, admin: formatAdmin(admin), token: generateToken(admin.id) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/admin/register-first  (public — only if no admin exists yet)
export const registerFirstAdmin = async (req, res) => {
  try {
    const adminCount = await User.count({ role: 'admin' });
    if (adminCount > 0)
      return res.status(400).json({ success: false, message: 'An admin account already exists' });

    const { username, name, fullName, email, password } = req.body;
    const adminName = (username ?? name ?? fullName ?? '').toString().trim();

    if (!adminName || !email || !password)
      return res.status(400).json({ success: false, message: 'All fields are required' });

    if (password.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });

    const admin = await User.create({ name: adminName, email, password, role: 'admin' });
    res.status(201).json({ success: true, admin: formatAdmin(admin) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/me
export const getMe = async (req, res) => {
  res.json({ success: true, admin: req.user });
};
