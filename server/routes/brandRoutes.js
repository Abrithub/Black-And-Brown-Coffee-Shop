import express from 'express';
import { getBrand, updateBrand, sendDailyReport } from '../controllers/brandController.js';
import { protect, adminProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/',             getBrand);                              // public
router.put('/',             protect, adminProtect, updateBrand);   // admin only
router.post('/daily-report',protect, adminProtect, sendDailyReport); // manual trigger

export default router;
