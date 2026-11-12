import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const verifyToken = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findOne({ id: decoded.id });
  if (!user) return null;
  // Don't expose hashed password downstream
  const { password: _pw, ...safeUser } = user;
  return safeUser;
};

// Require a valid logged-in user
export const protect = async (req, res, next) => {
  try {
    const user = await verifyToken(req);
    if (!user)
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Not authorized, token invalid' });
  }
};

// Must run after protect — checks for admin role
export const adminProtect = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  res.status(403).json({ success: false, message: 'Access denied: admins only' });
};

// Attach user if token is valid, continue as guest otherwise
export const optionalAuth = async (req, res, next) => {
  try {
    const user = await verifyToken(req);
    if (user) req.user = user;
  } catch (_) {
    // Invalid token — treat as guest
  }
  next();
};
