import express from 'express';
import { initializePayment, verifyPayment } from '../controllers/paymentController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/initialize', optionalAuth, initializePayment);
router.get('/verify/:txRef', verifyPayment);

export default router;
