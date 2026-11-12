# Black & Brown Coffee Shop — Project Completion Checklist
> Last updated: November 2026
> Stack: React + Vite (frontend) · Node.js + Express (backend) · PostgreSQL (database)

---

## ✅ COMPLETED — Backend

### Database
- ✅ PostgreSQL database (`coffeedb`) set up and running locally
- ✅ Full SQL schema with tables: `users`, `coffees`, `orders`, `order_items`
- ✅ UUID primary keys on all tables
- ✅ Indexes on `orders.customer_id`, `orders.status`, `coffees.category`, `coffees.featured`
- ✅ Auto-update `updated_at` triggers on all tables
- ✅ `pg` (node-postgres) pool connection with retry and error handling
- ✅ Environment variables: `PG_HOST`, `PG_PORT`, `PG_DATABASE`, `PG_USER`, `PG_PASSWORD`
- ✅ `scripts/setupDb.js` — one-command schema runner
- ✅ `scripts/seedAdmin.js` — seeds default admin account
- ✅ `scripts/seedProducts.js` — seeds 12 shop products
- ✅ `scripts/seedMenu.js` — seeds 12 Beverage menu items

### Authentication
- ✅ User registration (`POST /api/auth/register`) with bcrypt password hashing
- ✅ User login (`POST /api/auth/login`) — email or username
- ✅ Admin login (`POST /api/admin/login`)
- ✅ Admin registration (`POST /api/admin/register`) — existing admin only
- ✅ First-admin setup (`POST /api/admin/register-first`) — public, one-time
- ✅ `GET /api/auth/me` — restore session from token
- ✅ `GET /api/admin/me` — restore admin session
- ✅ JWT token generation (7-day expiry)
- ✅ `protect` middleware — requires valid JWT
- ✅ `adminProtect` middleware — requires admin role
- ✅ `optionalAuth` middleware — attaches user if token present, continues as guest

### Products / Coffees API
- ✅ `GET /api/coffees` — list all, supports `?category=` and `?featured=true`
- ✅ `GET /api/coffees/:id` — single product
- ✅ `POST /api/coffees` — create product (admin only)
- ✅ `PUT /api/coffees/:id` — update product (admin only)
- ✅ `DELETE /api/coffees/:id` — delete product (admin only)
- ✅ All fields: name, origin, price, description, image, category, rating, stock, featured, weight, roastLevel, flavorProfile, material, capacity

### Orders API
- ✅ `POST /api/orders` — create order (guest or logged-in)
- ✅ `GET /api/orders` — all orders (admin only), supports `?status=` filter
- ✅ `GET /api/orders/:id` — single order (protected)
- ✅ `GET /api/orders/customer/:customerId` — customer's own orders (protected)
- ✅ `PUT /api/orders/:id/status` — update status (admin only)
- ✅ `PUT /api/orders/:id` — full order update (admin only)
- ✅ `DELETE /api/orders/:id` — delete order (admin only)
- ✅ `GET /api/orders/stats/summary` — dashboard stats (admin only)
- ✅ Order total always recalculated server-side (tamper-proof)
- ✅ Order items stored in separate `order_items` table with cascade delete

### Payment
- ✅ `POST /api/payment/initialize` — create order + init Chapa checkout
- ✅ `GET /api/payment/verify/:txRef` — verify Chapa payment after redirect
- ✅ `POST /api/payment/webhook` — Chapa server-to-server callback
- ✅ Failed Chapa init cancels the order automatically
- ✅ txRef stored in `payment_meta` JSONB column

### Email Notifications
- ✅ `utils/mailer.js` — Nodemailer transporter (Gmail / SMTP)
- ✅ Order confirmation email sent on order creation (Cash + Chapa)
- ✅ Status update email sent when admin changes order status
- ✅ Graceful skip if mail env vars not configured
- ✅ Branded HTML email templates (coffee shop theme)

---

## ✅ COMPLETED — Frontend

### Authentication UI
- ✅ Login modal (email/password)
- ✅ Register modal (name, email, password)
- ✅ Admin login flow (auto-detects admin role)
- ✅ Session restored from localStorage on page load
- ✅ Logout clears both `userToken` and `adminToken`
- ✅ Auth-required actions prompt login modal

### Navbar
- ✅ Responsive (desktop + mobile hamburger menu)
- ✅ Shows logged-in user name and avatar initial
- ✅ "📦 Orders" button for logged-in customers
- ✅ Admin badge and QR Code button for admins
- ✅ Logout button

### Homepage Sections
- ✅ Hero section with background image
- ✅ Menu section — **fetches from `/api/coffees?category=Beverage`** (database-driven)
- ✅ Products section — **fetches from `/api/coffees`** (database-driven, hardcoded fallback if API down)
- ✅ Promotions section
- ✅ About Us section
- ✅ Contact section
- ✅ Footer

### Cart
- ✅ Cart sidebar (slide-in)
- ✅ Add to cart (requires login for shop products)
- ✅ Remove from cart
- ✅ Cart item count badge on navbar
- ✅ Cart total calculation
- ✅ "Place Order" triggers order modal

### Order Flow (Customer)
- ✅ Order form: name, email, phone, address
- ✅ Auto-fills from logged-in user
- ✅ Payment method selection: Chapa (online) or Cash (delivery)
- ✅ Chapa redirects to Chapa checkout
- ✅ Cash order placed directly with confirmation
- ✅ Cart cleared after successful order
- ✅ Delivery fee: free over 500 birr, 50 birr otherwise

### Payment Success Page
- ✅ `/payment/success` — verifies payment via `txRef`
- ✅ Shows spinner while verifying
- ✅ Shows order details on success
- ✅ Error state with retry link
- ✅ Uses `order.id` (UUID) correctly

### Order History Page (Customer)
- ✅ `/orders` — requires login, redirects if not authenticated
- ✅ Filter tabs: All / Pending / Processing / Completed / Cancelled
- ✅ Expandable order cards showing items, total, payment, address
- ✅ Status badges with color coding
- ✅ Empty state with "Shop Now" button

### Admin Dashboard
- ✅ **Orders tab**
  - ✅ Loads all orders from `/api/orders`
  - ✅ Filter by status (All / Pending / Processing / Completed / Cancelled)
  - ✅ Table: Order ID (UUID), customer name/email/phone, items, total, payment, status, date
  - ✅ Inline status update dropdown (calls `PUT /api/orders/:id/status`)
  - ✅ Delete order button
  - ✅ Auto-refreshes every 30 seconds
- ✅ **Products tab**
  - ✅ Loads all products from `/api/coffees`
  - ✅ Grid of product cards with image, name, category, price, stock level
  - ✅ "+ Add Product" button — inline form
  - ✅ "Edit" button — pre-fills form with product data
  - ✅ "Delete" button — with confirmation
  - ✅ All CRUD operations persist to PostgreSQL
  - ✅ Changes reflect immediately on the homepage (Menu + Products sections)
- ✅ **Analytics tab**
  - ✅ Status count cards (pending/processing/completed/cancelled)
  - ✅ Bar chart: orders per day (last 7 days)
  - ✅ Line chart: monthly revenue
- ✅ **Stats bar** (always visible): Total Sales, Total Orders, Today's Sales, Today's Orders
- ✅ QR Code button

---

## ⚠️ KNOWN ISSUES / PENDING

### Products Page
- ⚠️ `Products.jsx` still has 12 hardcoded fallback items — these show if the API fails or returns empty
- ⚠️ Admin-added products that are NOT `Beverage` category appear in Products section only, not Menu section (by design — Menu shows Beverage only)

### Menu Section
- ⚠️ Menu items only show if `Beverage` category items exist in the database
- ⚠️ Run `node scripts/seedMenu.js` to populate the menu with the 12 default drinks

### Email
- ⚠️ Email notifications are disabled until `MAIL_USER` and `MAIL_PASS` are set in `server/.env`
- ⚠️ Gmail requires an App Password (not your Gmail login password)

### Chapa Payment
- ⚠️ Currently using test key (`CHASECK_TEST-...`) — replace with live key for production
- ⚠️ Webhook URL must be publicly accessible for Chapa to call it (not localhost)

---

## 🚀 HOW TO RUN

### Terminal 1 — Backend:
```powershell
$env:PATH += ";C:\Program Files\nodejs"
cd "C:\Users\USER\Desktop\CFS\Black-And-Brown-Coffee-Shop\server"
npm run dev
```

### Terminal 2 — Frontend:
```powershell
$env:PATH += ";C:\Program Files\nodejs"
cd "C:\Users\USER\Desktop\CFS\Black-And-Brown-Coffee-Shop\client"
npm run dev
```

### Browser: http://localhost:5174

---

## 🔑 DEFAULT CREDENTIALS

| Role  | Email                   | Password  |
|-------|-------------------------|-----------|
| Admin | admin@coffeeshop.com    | admin123  |

> ⚠️ Change the admin password after first login!

---

## 🗄️ DATABASE SETUP (one-time)

```powershell
# 1. Create database
$env:PGPASSWORD="postgres"; psql -U postgres -c "CREATE DATABASE coffeedb;"

# 2. Create tables
node scripts/setupDb.js

# 3. Seed data
node scripts/seedAdmin.js
node scripts/seedProducts.js
node scripts/seedMenu.js
```

---

## 📁 PROJECT STRUCTURE

```
Black-And-Brown-Coffee-Shop/
├── client/                        # React + Vite frontend
│   └── src/
│       ├── Components/
│       │   ├── Dashboard/
│       │   │   └── AdminDashboard.jsx   # Admin orders + products + analytics
│       │   ├── Menu.jsx                 # DB-driven menu (Beverage category)
│       │   ├── Products.jsx             # DB-driven shop products
│       │   ├── Navbar.jsx               # Auth-aware navbar
│       │   └── ...
│       ├── pages/
│       │   ├── CartOrder.jsx            # Order checkout form
│       │   ├── OrderHistory.jsx         # Customer order history
│       │   └── PaymentSuccess.jsx       # Chapa payment result
│       ├── context/
│       │   ├── AuthContext.jsx          # Login/register/session
│       │   └── CartContext.jsx          # Cart state
│       └── utils/api.js                 # Axios instance + interceptors
│
└── server/                        # Node.js + Express backend
    ├── controllers/
    │   ├── authController.js            # Register/login
    │   ├── adminController.js           # Admin auth
    │   ├── coffeeController.js          # Product CRUD
    │   ├── orderController.js           # Order CRUD + stats
    │   └── paymentController.js         # Chapa integration
    ├── models/
    │   ├── User.js                      # pg query helpers
    │   ├── Coffee.js                    # pg query helpers
    │   └── Order.js                     # pg query helpers (with order_items)
    ├── routes/                          # Express routers
    ├── middleware/authMiddleware.js      # JWT protect/adminProtect/optionalAuth
    ├── utils/mailer.js                  # Nodemailer email utility
    ├── database/
    │   ├── connectdb.js                 # pg Pool connection
    │   └── schema.sql                   # Full PostgreSQL schema
    └── scripts/
        ├── setupDb.js                   # Run schema
        ├── seedAdmin.js                 # Seed admin user
        ├── seedProducts.js              # Seed shop products
        └── seedMenu.js                  # Seed menu beverages
```
