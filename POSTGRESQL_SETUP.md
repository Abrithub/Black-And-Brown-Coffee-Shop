# PostgreSQL Setup Guide

## 1. Install PostgreSQL

Download from https://www.postgresql.org/download/windows/
- During install, set a password for the `postgres` user (remember it!)
- Default port: **5432**
- After install, restart your PC or open a new PowerShell window

## 2. Create the database

Open **pgAdmin** (installed with PostgreSQL) or run in PowerShell:

```powershell
$env:PATH += ";C:\Program Files\PostgreSQL\17\bin"
psql -U postgres -c "CREATE DATABASE coffeedb;"
```

## 3. Update your .env

Edit `server/.env` and set your password:

```
PG_PASSWORD=your_postgres_password_here
```

## 4. Install npm dependencies

In PowerShell, run from the server folder:

```powershell
$env:PATH += ";C:\Program Files\nodejs"
cd "C:\Users\USER\Desktop\CFS\Black-And-Brown-Coffee-Shop\server"
npm install
```

## 5. Run the database schema

```powershell
node scripts/setupDb.js
```

This creates all tables: `users`, `coffees`, `orders`, `order_items`

## 6. Seed initial data

```powershell
node scripts/seedAdmin.js    # creates admin@coffeeshop.com / admin123
node scripts/seedProducts.js # seeds 12 coffee products
```

## 7. Configure email (optional)

To enable order confirmation emails, add to `server/.env`:

```
MAIL_SERVICE=gmail
MAIL_USER=youremail@gmail.com
MAIL_PASS=your_gmail_app_password
```

For Gmail App Password: https://myaccount.google.com/apppasswords

## 8. Start the server

```powershell
npm run dev
```

## 9. Start the frontend (separate terminal)

```powershell
cd "C:\Users\USER\Desktop\CFS\Black-And-Brown-Coffee-Shop\client"
npm install
npm run dev
```

---

## What changed from MongoDB

| Before (MongoDB)        | After (PostgreSQL)                        |
|-------------------------|-------------------------------------------|
| Mongoose models         | Raw `pg` queries via model helpers        |
| `_id` (ObjectId)        | `id` (UUID)                               |
| `MONGO_URI` in .env     | `PG_HOST/PORT/DATABASE/USER/PASSWORD`     |
| No email notifications  | Nodemailer sends on order & status update |
| No order history page   | `/orders` page with filter tabs           |
| Chapa webhook missing   | `POST /api/payment/webhook` added         |
| Total calculated once   | Server always recalculates total          |
