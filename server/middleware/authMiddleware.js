import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper: extract and verify JWT from Authorization header
const verifyToken = async (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return await User.findById(decoded.id).select('-password');
};

// Protect: require a valid logged-in user
export const protect = async (req, res, next) => {
    try {
        const user = await verifyToken(req);
        if (!user) return res.status(401).json({ success: false, message: 'Not authorized, no token' });
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Not authorized, token invalid' });
    }
};

// AdminProtect: must run after protect (req.user already set)
export const adminProtect = (req, res, next) => {
    if (req.user && req.user.role === 'admin') return next();
    res.status(403).json({ success: false, message: 'Access denied: admins only' });
};

// OptionalAuth: attach user if token is valid, continue as guest otherwise
export const optionalAuth = async (req, res, next) => {
    try {
        const user = await verifyToken(req);
        if (user) req.user = user;
    } catch (_) {
        // Invalid token — continue as guest
    }
    next();
};
