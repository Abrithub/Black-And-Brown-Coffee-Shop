import express from 'express';
import { initializePayment, verifyPayment, chapaWebhook } from '../controllers/paymentController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/initialize', optionalAuth, initializePayment);
router.get('/verify/:txRef', verifyPayment);
router.post('/webhook', chapaWebhook); // Chapa server-to-server callback

export default router;
