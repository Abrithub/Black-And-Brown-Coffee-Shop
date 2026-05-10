import express from 'express';
import {
    createOrder,
    getAllOrders,
    getOrderById,
    getOrdersByCustomer,
    updateOrderStatus,
    updateOrder,
    deleteOrder,
    getOrderStats
} from '../controllers/orderController.js';
import { protect, adminProtect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// IMPORTANT: specific routes must come before parameterized routes (:id)

// Admin only
router.get('/stats/summary', protect, adminProtect, getOrderStats);
router.get('/', protect, adminProtect, getAllOrders);

// Public (guest-friendly)
router.post('/', optionalAuth, createOrder);

// Protected (customer)
router.get('/customer/:customerId', protect, getOrdersByCustomer);

// Protected (single order)
router.get('/:id', protect, getOrderById);

// Admin only
router.put('/:id/status', protect, adminProtect, updateOrderStatus);
router.put('/:id', protect, adminProtect, updateOrder);
router.delete('/:id', protect, adminProtect, deleteOrder);

export default router;
