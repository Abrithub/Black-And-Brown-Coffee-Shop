import { pool } from '../database/connectdb.js';
import { sendTelegramDailyReport } from '../utils/telegram.js';
import Order from '../models/Order.js';

/** Convert flat rows to a key→value object */
const toObject = (rows) => rows.reduce((acc, r) => { acc[r.key] = r.value; return acc; }, {});

// GET /api/brand  — public
export const getBrand = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT key, value FROM brand_settings ORDER BY key');
    res.json({ success: true, brand: toObject(rows) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/brand  — admin
export const updateBrand = async (req, res) => {
  try {
    const updates = req.body; // { shop_name: '...', tagline: '...', ... }
    if (!updates || typeof updates !== 'object')
      return res.status(400).json({ success: false, message: 'Body must be a key-value object' });

    const allowedKeys = [
      'shop_name','tagline','phone','email','address',
      'instagram','telegram','facebook',
      'delivery_fee','free_delivery_min','currency','exchange_rate',
      'hero_tagline','about_text',
    ];

    for (const [key, value] of Object.entries(updates)) {
      if (!allowedKeys.includes(key)) continue;
      await pool.query(
        `INSERT INTO brand_settings (key, value)
         VALUES ($1, $2)
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
        [key, String(value)]
      );
    }

    const { rows } = await pool.query('SELECT key, value FROM brand_settings ORDER BY key');
    res.json({ success: true, brand: toObject(rows) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/brand/daily-report  — admin manual trigger
export const sendDailyReport = async (req, res) => {
  try {
    const stats = await Order.getStats();
    await sendTelegramDailyReport(stats);
    res.json({ success: true, message: 'Daily report sent to Telegram' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
