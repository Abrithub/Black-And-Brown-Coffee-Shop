import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }

        const exists = await User.findOne({ email: email.toLowerCase() });
        if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });

        const user = await User.create({ name, email: email.toLowerCase(), password });

        res.status(201).json({
            success: true,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/auth/login
export const login = async (req, res) => {
    try {
        const { email, emailOrUsername, password } = req.body;
        const identifier = (emailOrUsername ?? email ?? '').toString().trim();

        if (!identifier || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const user = await User.findOne({
            $or: [{ email: identifier.toLowerCase() }, { name: identifier }],
        });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        res.json({
            success: true,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
    res.json({ success: true, user: req.user });
};
