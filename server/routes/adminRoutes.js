import express from 'express';
import { register, login, getMe, registerFirstAdmin } from '../controllers/adminController.js';
import { adminProtect, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/register-first', registerFirstAdmin); // Allow first admin registration if no admins exist

// Protected routes (admin only)
router.post('/register', protect, adminProtect, register); // Only existing admins can register new admins
router.get('/me', protect, adminProtect, getMe);

export default router;

