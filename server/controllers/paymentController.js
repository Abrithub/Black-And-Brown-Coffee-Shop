import Order from '../models/Order.js';
import { sendOrderConfirmation } from '../utils/mailer.js';

const CHAPA_SECRET  = process.env.CHAPA_SECRET_KEY;
const CHAPA_BASE    = 'https://api.chapa.co/v1';
const FRONTEND_URL  = process.env.FRONTEND_URL || 'http://localhost:5173';

// POST /api/payment/initialize
export const initializePayment = async (req, res) => {
  try {
    const { customerId, customerName, email, phone, items, shippingAddress } = req.body;

    if (!customerName || !email || !items?.length)
      return res.status(400).json({ success: false, message: 'Name, email and items are required' });

    // Calculate total server-side so the client can't tamper with prices
    const total = items.reduce((s, i) => s + Number(i.price) * Number(i.quantity), 0);
    if (total <= 0)
      return res.status(400).json({ success: false, message: 'Order total must be greater than 0' });

    // Create order first with pending payment status
    const order = await Order.create({
      customerId:      customerId || null,
      customerName,
      email:           email.toLowerCase(),
      phone:           phone || '',
      items,
      paymentMethod:   'Chapa',
      shippingAddress: shippingAddress || '',
      status:          'pending',
      paymentMeta:     { chapaStatus: 'initialized' },
    });

    const txRef = `BB-${order.id.replace(/-/g, '')}-${Date.now()}`;

    // Store txRef in paymentMeta
    await Order.updateById(order.id, {
      paymentMeta: { txRef, chapaStatus: 'initialized' },
    });

    // Call Chapa API
    const chapaRes = await fetch(`${CHAPA_BASE}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization:  `Bearer ${CHAPA_SECRET}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount:       total.toFixed(2),
        currency:     'ETB',
        email:        email.toLowerCase(),
        first_name:   customerName.split(' ')[0] || customerName,
        last_name:    customerName.split(' ').slice(1).join(' ') || '',
        phone_number: phone || '',
        tx_ref:       txRef,
        callback_url: `${process.env.SERVER_URL || 'http://localhost:5000'}/api/payment/webhook`,
        return_url:   `${FRONTEND_URL}/payment/success?orderId=${order.id}`,
        customization: {
          title:       'Black & Brown Coffee Shop',
          description: `Order #${order.id.slice(-6).toUpperCase()}`,
          logo:        `${FRONTEND_URL}/img/SmallSquareLogoJpg.jpg`,
        },
      }),
    });

    const chapaData = await chapaRes.json();

    if (chapaData.status !== 'success') {
      // Chapa failed — cancel the order so user can try again
      await Order.updateById(order.id, { status: 'cancelled', paymentMeta: { chapaStatus: 'failed' } });
      return res.status(400).json({
        success: false,
        message: chapaData.message || 'Payment initialization failed',
        orderId: order.id,
      });
    }

    res.json({
      success:     true,
      checkoutUrl: chapaData.data.checkout_url,
      orderId:     order.id,
      txRef,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/payment/verify/:txRef
export const verifyPayment = async (req, res) => {
  try {
    const { txRef } = req.params;

    const chapaRes = await fetch(`${CHAPA_BASE}/transaction/verify/${txRef}`, {
      headers: { Authorization: `Bearer ${CHAPA_SECRET}` },
    });
    const chapaData = await chapaRes.json();

    if (chapaData.status === 'success' && chapaData.data?.status === 'success') {
      const order = await Order.findByPaymentMeta('txRef', txRef);
      if (order) {
        const updated = await Order.updateById(order.id, {
          status:      'processing',
          paymentMeta: { ...order.paymentMeta, chapaStatus: 'paid', verifiedAt: new Date().toISOString() },
        });
        // Send confirmation email
        sendOrderConfirmation(updated).catch(err =>
          console.warn('⚠️  Confirmation email failed:', err.message)
        );
        return res.json({ success: true, status: 'paid', order: updated });
      }
    }

    res.json({ success: false, status: chapaData.data?.status || 'failed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/payment/webhook  (Chapa server-to-server callback)
export const chapaWebhook = async (req, res) => {
  try {
    // Chapa sends tx_ref in the body
    const { tx_ref, status } = req.body;
    if (!tx_ref) return res.sendStatus(400);

    if (status === 'success') {
      const order = await Order.findByPaymentMeta('txRef', tx_ref);
      if (order && order.status === 'pending') {
        await Order.updateById(order.id, {
          status:      'processing',
          paymentMeta: { ...order.paymentMeta, chapaStatus: 'paid', webhookAt: new Date().toISOString() },
        });
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.sendStatus(500);
  }
};
