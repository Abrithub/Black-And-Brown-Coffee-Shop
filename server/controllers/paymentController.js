import Order from '../models/Order.js';

const CHAPA_SECRET = process.env.CHAPA_SECRET_KEY;
const CHAPA_BASE = 'https://api.chapa.co/v1';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// POST /api/payment/initialize
// Creates order + initializes Chapa payment, returns checkout URL
export const initializePayment = async (req, res) => {
    try {
        const {
            customerId, customerName, email, phone,
            items, shippingAddress,
        } = req.body;

        if (!customerName || !email || !items?.length) {
            return res.status(400).json({ success: false, message: 'Name, email and items are required' });
        }

        // Create order first with pending status
        const order = await Order.create({
            customerId: customerId || null,
            customerName,
            email: email.toLowerCase(),
            phone: phone || '',
            items,
            paymentMethod: 'Chapa',
            shippingAddress: shippingAddress || '',
            status: 'pending',
            paymentMeta: { chapaStatus: 'initialized' },
        });

        const txRef = `BB-${order._id}-${Date.now()}`;

        // Update order with tx_ref
        order.paymentMeta = { txRef, chapaStatus: 'initialized' };
        await order.save();

        // Initialize Chapa payment
        const chapaRes = await fetch(`${CHAPA_BASE}/transaction/initialize`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CHAPA_SECRET}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: order.total.toString(),
                currency: 'ETB',
                email: email.toLowerCase(),
                first_name: customerName.split(' ')[0] || customerName,
                last_name: customerName.split(' ').slice(1).join(' ') || '',
                phone_number: phone || '',
                tx_ref: txRef,
                callback_url: `${FRONTEND_URL}/payment/callback?orderId=${order._id}`,
                return_url: `${FRONTEND_URL}/payment/success?orderId=${order._id}`,
                customization: {
                    title: 'Black & Brown Coffee Shop',
                    description: `Order #${order._id.toString().slice(-6)}`,
                    logo: `${FRONTEND_URL}/img/SmallSquareLogoJpg.jpg`,
                },
            }),
        });

        const chapaData = await chapaRes.json();

        if (chapaData.status !== 'success') {
            // If Chapa fails, still allow cash fallback
            return res.status(400).json({
                success: false,
                message: chapaData.message || 'Payment initialization failed',
                orderId: order._id,
            });
        }

        res.json({
            success: true,
            checkoutUrl: chapaData.data.checkout_url,
            orderId: order._id,
            txRef,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/payment/verify/:txRef
// Verifies payment after redirect
export const verifyPayment = async (req, res) => {
    try {
        const { txRef } = req.params;

        const chapaRes = await fetch(`${CHAPA_BASE}/transaction/verify/${txRef}`, {
            headers: { 'Authorization': `Bearer ${CHAPA_SECRET}` },
        });

        const chapaData = await chapaRes.json();

        if (chapaData.status === 'success' && chapaData.data?.status === 'success') {
            // Find and update order
            const order = await Order.findOne({ 'paymentMeta.txRef': txRef });
            if (order) {
                order.status = 'processing';
                order.paymentMeta = { ...order.paymentMeta, chapaStatus: 'paid', verifiedAt: new Date() };
                await order.save();
            }
            return res.json({ success: true, status: 'paid', order });
        }

        res.json({ success: false, status: chapaData.data?.status || 'failed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
