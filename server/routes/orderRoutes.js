import express from 'express';
import {
    createOrder,
    getAllOrders,
    getOrderById,
    getOrdersByCustomer,
    updateOrderStatus,
    updateOrder,
    deleteOrder,
    getOrderStats,
    getSalesReport,
} from '../controllers/orderController.js';
import { protect, adminProtect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin only — specific routes BEFORE parameterized
router.get('/stats/summary',    protect, adminProtect, getOrderStats);
router.get('/report/sales',     protect, adminProtect, getSalesReport);
router.get('/',                 protect, adminProtect, getAllOrders);

// Public (guest-friendly)
router.post('/', optionalAuth, createOrder);

// Customer — own orders
router.get('/customer/:customerId', protect, getOrdersByCustomer);

// Single order
router.get('/:id',              protect, getOrderById);

// Admin only
router.put('/:id/status',       protect, adminProtect, updateOrderStatus);
router.put('/:id',              protect, adminProtect, updateOrder);
router.delete('/:id',           protect, adminProtect, deleteOrder);

export default router;
