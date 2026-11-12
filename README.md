# ☕ Black & Brown Coffee Shop

A full-stack, production-ready coffee shop web application with online ordering, Chapa payment integration, Telegram alerts, and a full admin dashboard.

![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20PostgreSQL-brown)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

### Customer
- 🛍️ Browse menu (Beverages) and shop products (Coffee Beans, Equipment, Accessories…)
- 🛒 Cart with delivery fee logic (free above 500 birr)
- 💳 Pay online via **Chapa** (Telebirr, CBE Birr, Bank Card) or Cash on Delivery
- 📧 Order confirmation email (Gmail / SMTP)
- 📦 Order history with real-time status tracking
- 🌐 **Amharic / English** language switcher
- 📱 **PWA** — installable on Android & iOS, works offline

### Admin
- 📊 Dashboard: Total Sales, Total Orders, Today's stats
- 🗂️ Orders tab: view all orders, update status, delete
- 🛒 Products tab: add / edit / delete products (reflected live on homepage)
- 📈 Analytics tab: weekly bar chart, monthly revenue line chart
- 🎨 **Branding tab**: edit shop name, tagline, contact info, social links, delivery fees
- 📥 **Reports tab**: export sales CSV by date range, send Telegram daily report

### Security
- 🔒 Helmet security headers
- 🚦 Rate limiting (100 req/15 min general, 20 req/15 min on auth endpoints)
- ✅ Server-side price verification (client can't tamper prices)
- 📦 Server-side stock validation and decrement
- 🔄 Stock restoration on order cancellation
- 🔑 JWT authentication with role-based access (user / admin)

### Notifications
- 📱 **Telegram** — instant alert on every new order + status changes + daily report button
- 📧 **Email** — branded HTML confirmation and status update emails

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- PostgreSQL 15+ (installed locally or on Railway/Supabase/Neon)
- Git

### 1. Clone
```bash
git clone https://github.com/Abrithub/Black-And-Brown-Coffee-Shop.git
cd Black-And-Brown-Coffee-Shop
```

### 2. Configure environment
Edit `server/.env`:
```env
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=coffeedb
PG_USER=postgres
PG_PASSWORD=your_password

JWT_SECRET=your_long_random_secret

CHAPA_SECRET_KEY=CHASECK_TEST-your_key
FRONTEND_URL=http://localhost:5173
SERVER_URL=http://localhost:5000

# Optional — email notifications
MAIL_SERVICE=gmail
MAIL_USER=you@gmail.com
MAIL_PASS=your_app_password

# Optional — Telegram alerts
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

### 3. Set up the database
```bash
# Windows PowerShell
$env:PGPASSWORD="your_password"; psql -U postgres -c "CREATE DATABASE coffeedb;"

cd server
npm install
node scripts/setupDb.js        # create tables
node scripts/setupBrandDb.js   # create branding table
node scripts/seedAdmin.js      # admin@coffeeshop.com / admin123
node scripts/seedProducts.js   # 12 shop products
node scripts/seedMenu.js       # 12 menu beverages
```

### 4. Start
```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm install && npm run dev
```

Open **http://localhost:5174**

---

## 🔑 Default Credentials

| Role  | Email                 | Password |
|-------|-----------------------|----------|
| Admin | admin@coffeeshop.com  | admin123 |

> ⚠️ Change the admin password immediately after first login.

---

## 📱 Telegram Setup (5 minutes)

1. Open Telegram, search for **@BotFather**
2. Send `/newbot` and follow the prompts → copy the **token**
3. Add the bot to your group chat (or use direct messages)
4. Visit `https://api.telegram.org/bot<TOKEN>/getUpdates` after sending `/start`
5. Copy the `chat_id` from the response
6. Add both to `server/.env` and restart the server

---

## 🌍 Amharic Support

The app ships with English and Amharic translations. Toggle with the **EN / አማ** button in the navbar. Add more strings in `client/src/context/LangContext.jsx`.

---

## 🏗️ Project Structure

```
├── client/                  # React + Vite frontend
│   ├── public/
│   │   ├── manifest.json    # PWA manifest
│   │   └── sw.js            # Service worker
│   └── src/
│       ├── Components/
│       │   ├── Dashboard/AdminDashboard.jsx
│       │   ├── Menu.jsx     # DB-driven beverages
│       │   ├── Products.jsx # DB-driven shop products
│       │   ├── Navbar.jsx
│       │   └── LangSwitcher.jsx
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   ├── CartContext.jsx
│       │   └── LangContext.jsx  # EN/Amharic translations
│       └── pages/
│           ├── CartOrder.jsx
│           ├── OrderHistory.jsx
│           └── PaymentSuccess.jsx
│
└── server/                  # Node.js + Express backend
    ├── controllers/         # Business logic
    ├── models/              # PostgreSQL query helpers
    ├── routes/              # Express routers
    ├── middleware/          # JWT auth
    ├── utils/
    │   ├── mailer.js        # Email notifications
    │   └── telegram.js      # Telegram alerts
    └── database/
        ├── schema.sql       # Main DB schema
        ├── schema_brand.sql # Branding settings table
        └── connectdb.js     # pg Pool
```

---

## 🔧 Maintenance

### Adding a new product category
1. Add the category to the `CHECK` constraint in `schema.sql`
2. Add it to `CATEGORIES` array in `AdminDashboard.jsx`
3. Add a filter case in `Products.jsx`

### Rotating JWT secret
Update `JWT_SECRET` in `server/.env` and restart — all existing sessions will log out automatically.

### Database backup
```bash
pg_dump -U postgres coffeedb > backup_$(date +%Y%m%d).sql
```

### Updating to production Chapa key
Replace `CHASECK_TEST-...` with your live `CHASECK-...` key in `server/.env`.

---

## 📦 Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 19, Vite 6, TailwindCSS 4        |
| Backend    | Node.js, Express 5                      |
| Database   | PostgreSQL 18 (pg pool, raw SQL)        |
| Auth       | JWT + bcryptjs                          |
| Payments   | Chapa (Telebirr, CBE, Card)             |
| Email      | Nodemailer (Gmail / SMTP)               |
| Alerts     | Telegram Bot API                        |
| Security   | Helmet, express-rate-limit              |
| PWA        | Web App Manifest + Service Worker       |
| i18n       | Custom context (EN + Amharic)           |

---

## 📄 License

MIT © Black & Brown Coffee Shop
