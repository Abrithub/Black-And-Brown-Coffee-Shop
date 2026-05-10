# Admin Account Setup Guide

## 🔐 How to Create Your First Admin Account

You have **3 options** to create your first admin account:

---

## Option 1: Use Seed Script (Recommended) ⭐

This is the easiest way to create a default admin account.

### Steps:

1. **Run the seed script:**
   ```bash
   cd server
   npm run seed:admin
   ```

2. **Default credentials will be created:**
   - Username: `admin`
   - Password: `admin123`
   - Email: `admin@coffeeshop.com`

3. **Login with these credentials:**
   - Go to your frontend
   - Click "Admin Login"
   - Enter username: `admin`
   - Enter password: `admin123`

4. **⚠️ IMPORTANT:** Change the password after first login!

---

## Option 2: Use API Endpoint (If No Admins Exist)

If no admin exists in the database, you can create one via API.

### Steps:

1. **Make sure backend is running:**
   ```bash
   cd server
   npm run dev
   ```

2. **Create first admin using API:**
   
   Using **Postman** or **curl**:
   ```bash
   curl -X POST http://localhost:5000/api/admin/register-first \
     -H "Content-Type: application/json" \
     -d '{
       "username": "admin",
       "password": "admin123",
       "email": "admin@coffeeshop.com",
       "fullName": "Admin User"
     }'
   ```

   Or using **Postman**:
   - Method: `POST`
   - URL: `http://localhost:5000/api/admin/register-first`
   - Body (JSON):
     ```json
     {
       "username": "admin",
       "password": "admin123",
       "email": "admin@coffeeshop.com",
       "fullName": "Admin User"
     }
     ```

3. **Login with the credentials you created**

---

## Option 3: Create Manually in MongoDB

You can also create an admin directly in MongoDB, but you'll need to hash the password manually.

### Steps:

1. **Connect to your MongoDB database**

2. **Create admin document:**
   ```javascript
   // In MongoDB shell or Compass
   use coffeeshop  // or your database name
   
   db.admins.insertOne({
     username: "admin",
     password: "$2a$10$...", // bcrypt hashed password
     email: "admin@coffeeshop.com",
     fullName: "Admin User",
     createdAt: new Date(),
     updatedAt: new Date()
   })
   ```

   **Note:** You need to hash the password using bcrypt. This is complex, so use Option 1 or 2 instead.

---

## 🔄 Creating Additional Admins

Once you have your first admin account, you can create more admins in two ways:

### Method 1: Via API (Requires Admin Token)

1. **Login as admin** to get your admin token

2. **Create new admin:**
   ```bash
   curl -X POST http://localhost:5000/api/admin/register \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
     -d '{
       "username": "newadmin",
       "password": "password123",
       "email": "newadmin@coffeeshop.com",
       "fullName": "New Admin"
     }'
   ```

### Method 2: Via Frontend (Future Feature)

You can add a "Create Admin" feature in the admin dashboard that calls the API.

---

## ✅ Testing Admin Login

After creating an admin account:

1. **Open your frontend** (usually `http://localhost:5174`)

2. **Click "Admin Login"** button in the navbar

3. **Enter credentials:**
   - Username: `admin` (or the username you created)
   - Password: `admin123` (or the password you created)

4. **Click "Sign In"**

5. **You should see:**
   - Modal closes
   - Admin Dashboard appears
   - You're logged in as admin

---

## 🐛 Troubleshooting

### "Invalid username or password"
- Check if admin exists in database
- Verify username is correct (case-insensitive)
- Verify password is correct
- Check backend console for errors

### "Admin already exists"
- If using seed script, an admin already exists
- Delete existing admin from database or use different credentials

### "Failed to connect to backend"
- Make sure backend server is running on port 5000
- Check if MongoDB is connected
- Check backend console for errors

### "No admin found"
- Run the seed script: `npm run seed:admin`
- Or create admin via API: `/api/admin/register-first`

---

## 📝 Default Admin Credentials (After Seed)

After running `npm run seed:admin`:

```
Username: admin
Password: admin123
Email: admin@coffeeshop.com
```

**⚠️ Change these credentials in production!**

---

## 🔒 Security Notes

1. **Change default password** after first login
2. **Use strong passwords** (min 6 characters, but recommend 12+)
3. **Don't share admin credentials**
4. **Use HTTPS in production**
5. **Limit admin registration** to trusted users only

---

## 🎯 Quick Start

**Fastest way to get started:**

```bash
# 1. Go to server directory
cd server

# 2. Create default admin
npm run seed:admin

# 3. Start backend (if not running)
npm run dev

# 4. Login with:
#    Username: admin
#    Password: admin123
```

That's it! You're ready to use the admin dashboard. 🎉


