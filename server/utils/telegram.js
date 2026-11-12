/**
 * Telegram Order Alerts
 * Setup: Create a bot via @BotFather, get the token, then get your chat ID
 * via https://api.telegram.org/bot<TOKEN>/getUpdates after sending /start
 *
 * Add to server/.env:
 *   TELEGRAM_BOT_TOKEN=your_bot_token
 *   TELEGRAM_CHAT_ID=your_chat_id  (can be a group chat ID for the team)
 */

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

/** Send a message to the configured Telegram chat */
async function sendMessage(text) {
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const token  = process.env.TELEGRAM_BOT_TOKEN;

  if (!chatId || !token) {
    // Silently skip if not configured
    return;
  }

  const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id:    chatId,
      text,
      parse_mode: 'HTML',
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Telegram API error: ${err}`);
  }
}

/** New order alert sent to the admin/team */
export async function sendTelegramOrderAlert(order) {
  const itemLines = order.items
    .map(i => `  • ${i.name} ×${i.quantity} — ${(i.price * i.quantity).toFixed(2)} birr`)
    .join('\n');

  const text = [
    `🛍️ <b>New Order Received!</b>`,
    ``,
    `📋 <b>Order:</b> #${order.id.slice(-8).toUpperCase()}`,
    `👤 <b>Customer:</b> ${order.customerName}`,
    `📧 <b>Email:</b> ${order.email}`,
    order.phone ? `📱 <b>Phone:</b> ${order.phone}` : null,
    order.shippingAddress ? `📍 <b>Address:</b> ${order.shippingAddress}` : null,
    ``,
    `🛒 <b>Items:</b>`,
    itemLines,
    ``,
    `💰 <b>Total:</b> ${order.total.toFixed(2)} birr`,
    `💳 <b>Payment:</b> ${order.paymentMethod}`,
    `📊 <b>Status:</b> ${order.status}`,
    `🕐 <b>Time:</b> ${new Date(order.createdAt).toLocaleString('en-ET', { timeZone: 'Africa/Addis_Ababa' })}`,
  ].filter(Boolean).join('\n');

  await sendMessage(text);
}

/** Status change alert */
export async function sendTelegramStatusAlert(order) {
  const statusEmoji = {
    pending:    '⏳',
    processing: '🔄',
    completed:  '✅',
    cancelled:  '❌',
  };

  const text = [
    `${statusEmoji[order.status] || '📦'} <b>Order Status Updated</b>`,
    ``,
    `📋 <b>Order:</b> #${order.id.slice(-8).toUpperCase()}`,
    `👤 <b>Customer:</b> ${order.customerName}`,
    `💰 <b>Total:</b> ${order.total.toFixed(2)} birr`,
    `📊 <b>New Status:</b> <b>${order.status.toUpperCase()}</b>`,
  ].join('\n');

  await sendMessage(text);
}

/** Daily sales report (call via a cron job or admin dashboard button) */
export async function sendTelegramDailyReport({ totalOrders, totalSales, todayOrders, todaySales, statusCounts }) {
  const today = new Date().toLocaleDateString('en-ET', {
    timeZone: 'Africa/Addis_Ababa', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const statusLines = Object.entries(statusCounts || {})
    .map(([s, c]) => `  • ${s}: ${c}`)
    .join('\n');

  const text = [
    `📊 <b>Daily Sales Report</b>`,
    `📅 ${today}`,
    ``,
    `<b>Today:</b>`,
    `  🛒 Orders: ${todayOrders}`,
    `  💰 Revenue: ${Number(todaySales).toFixed(2)} birr`,
    ``,
    `<b>All Time:</b>`,
    `  🛒 Orders: ${totalOrders}`,
    `  💰 Revenue: ${Number(totalSales).toFixed(2)} birr`,
    ``,
    `<b>By Status:</b>`,
    statusLines || '  No data',
  ].join('\n');

  await sendMessage(text);
}
