import nodemailer from 'nodemailer';

// ── Transporter ──────────────────────────────────────────────────────────────
// Configure via environment variables.
// For Gmail: MAIL_SERVICE=gmail, MAIL_USER=you@gmail.com, MAIL_PASS=app-password
// For SMTP:  MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS
// If no mail env vars are set, the mailer logs a warning and skips sending.
const createTransporter = () => {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    return null; // No mail config — silently skip
  }

  if (process.env.MAIL_SERVICE) {
    return nodemailer.createTransport({
      service: process.env.MAIL_SERVICE, // e.g. 'gmail'
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  return nodemailer.createTransport({
    host:   process.env.MAIL_HOST || 'smtp.gmail.com',
    port:   Number(process.env.MAIL_PORT) || 587,
    secure: process.env.MAIL_PORT === '465',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
};

const FROM_NAME  = 'Black & Brown Coffee Shop';
const FROM_EMAIL = process.env.MAIL_USER || 'noreply@blackandbrown.coffee';

// ── Templates ────────────────────────────────────────────────────────────────
const orderSummaryHtml = (order) => {
  const rows = order.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:6px 8px;border-bottom:1px solid #3b2315">${i.name}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #3b2315;text-align:center">${i.quantity}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #3b2315;text-align:right">${(i.price * i.quantity).toFixed(2)} birr</td>
        </tr>`
    )
    .join('');

  return `
  <div style="font-family:Arial,sans-serif;background:#1a0f0a;color:#e5d5c5;max-width:600px;margin:0 auto;border-radius:12px;overflow:hidden">
    <div style="background:#2A1A10;padding:24px;text-align:center;border-bottom:2px solid #C19976">
      <h1 style="color:#C19976;margin:0;font-size:22px">☕ Black &amp; Brown Coffee Shop</h1>
    </div>
    <div style="padding:24px">
      <h2 style="color:#C19976">Order Confirmation</h2>
      <p>Hi <strong>${order.customerName}</strong>, your order has been received!</p>
      <p style="color:#aaa">Order ID: <code style="background:#2A1A10;padding:2px 6px;border-radius:4px">#${order.id.slice(-8).toUpperCase()}</code></p>

      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <thead>
          <tr style="background:#2A1A10;color:#C19976">
            <th style="padding:8px;text-align:left">Item</th>
            <th style="padding:8px">Qty</th>
            <th style="padding:8px;text-align:right">Price</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding:10px 8px;font-weight:bold;color:#C19976">Total</td>
            <td style="padding:10px 8px;text-align:right;font-weight:bold;color:#C19976">${order.total.toFixed(2)} birr</td>
          </tr>
        </tfoot>
      </table>

      <p><strong>Payment:</strong> ${order.paymentMethod}</p>
      ${order.shippingAddress ? `<p><strong>Delivery to:</strong> ${order.shippingAddress}</p>` : ''}
      <p style="color:#aaa;font-size:13px">We'll notify you when your order is ready. Thank you for choosing us!</p>
    </div>
    <div style="background:#2A1A10;padding:16px;text-align:center;color:#666;font-size:12px">
      © ${new Date().getFullYear()} Black &amp; Brown Coffee Shop
    </div>
  </div>`;
};

const statusUpdateHtml = (order) => {
  const statusMessages = {
    processing: { emoji: '🔄', text: 'Your order is being processed', color: '#3b82f6' },
    completed:  { emoji: '✅', text: 'Your order has been completed!', color: '#22c55e' },
    cancelled:  { emoji: '❌', text: 'Your order has been cancelled', color: '#ef4444' },
  };

  const info = statusMessages[order.status] || { emoji: '📦', text: `Order status: ${order.status}`, color: '#C19976' };

  return `
  <div style="font-family:Arial,sans-serif;background:#1a0f0a;color:#e5d5c5;max-width:600px;margin:0 auto;border-radius:12px;overflow:hidden">
    <div style="background:#2A1A10;padding:24px;text-align:center;border-bottom:2px solid #C19976">
      <h1 style="color:#C19976;margin:0;font-size:22px">☕ Black &amp; Brown Coffee Shop</h1>
    </div>
    <div style="padding:24px">
      <div style="text-align:center;padding:20px 0">
        <div style="font-size:48px">${info.emoji}</div>
        <h2 style="color:${info.color}">${info.text}</h2>
      </div>
      <p>Hi <strong>${order.customerName}</strong>,</p>
      <p>Your order <code style="background:#2A1A10;padding:2px 6px;border-radius:4px">#${order.id.slice(-8).toUpperCase()}</code> status has been updated to <strong style="color:${info.color}">${order.status.toUpperCase()}</strong>.</p>
      <p style="color:#aaa">Total: ${order.total.toFixed(2)} birr &nbsp;|&nbsp; Payment: ${order.paymentMethod}</p>
    </div>
    <div style="background:#2A1A10;padding:16px;text-align:center;color:#666;font-size:12px">
      © ${new Date().getFullYear()} Black &amp; Brown Coffee Shop
    </div>
  </div>`;
};

// ── Exported helpers ─────────────────────────────────────────────────────────
export const sendOrderConfirmation = async (order) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.info('ℹ️  Mail not configured — skipping order confirmation email');
    return;
  }
  await transporter.sendMail({
    from:    `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to:      order.email,
    subject: `✅ Order Confirmed — #${order.id.slice(-8).toUpperCase()} | Black & Brown Coffee`,
    html:    orderSummaryHtml(order),
  });
  console.log(`📧 Confirmation email sent to ${order.email}`);
};

export const sendStatusUpdate = async (order) => {
  const transporter = createTransporter();
  if (!transporter) return;
  await transporter.sendMail({
    from:    `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to:      order.email,
    subject: `Order Update — #${order.id.slice(-8).toUpperCase()} is now ${order.status} | Black & Brown`,
    html:    statusUpdateHtml(order),
  });
  console.log(`📧 Status update email sent to ${order.email}`);
};
