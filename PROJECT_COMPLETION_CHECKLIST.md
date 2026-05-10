# Coffee Shop Project - Completion Checklist

## 🔴 Critical Issues to Fix

### 1. **Backend Authentication System** (HIGH PRIORITY)
- ❌ **Missing**: User model for customers and admins
- ❌ **Missing**: Authentication routes (`/api/auth/login`, `/api/auth/register`, `/api/admin/login`)
- ❌ **Missing**: Authentication controllers
- ❌ **Missing**: JWT token generation and verification middleware
- ❌ **Missing**: Password hashing (bcrypt)
- ❌ **Missing**: Admin model or role-based authentication

**Files to Create:**
- `server/models/User.js` - Customer user model
- `server/models/Admin.js` - Admin user model (or add role field to User)
- `server/controllers/authController.js` - Authentication logic
- `server/controllers/adminController.js` - Admin authentication
- `server/routes/authRoutes.js` - Customer auth routes
- `server/routes/adminRoutes.js` - Admin auth routes
- `server/middleware/authMiddleware.js` - JWT verification middleware

**Dependencies to Add:**
- `jsonwebtoken` - For JWT tokens
- `bcryptjs` - For password hashing

### 2. **Order Management System** (HIGH PRIORITY)
- ❌ **Missing**: Order model in database
- ❌ **Missing**: Order API endpoints (create, read, update, delete)
- ❌ **Missing**: Order controllers
- ❌ **Current Issue**: Orders stored only in localStorage (not persistent)

**Files to Create:**
- `server/models/Order.js` - Order schema
- `server/controllers/orderController.js` - Order CRUD operations
- `server/routes/orderRoutes.js` - Order API routes

### 3. **Frontend Dependencies** (MEDIUM PRIORITY)
- ❌ **Missing**: `axios` package (used but not installed)
- ❌ **Missing**: `react-router-dom` package (used but not installed)
- ❌ **Missing**: API base URL configuration

**Fix:**
- Add to `client/package.json`:
  - `axios`
  - `react-router-dom`
- Create `client/src/config/api.js` for API base URL

### 4. **Import Path Issues** (MEDIUM PRIORITY)
- ❌ **Issue**: Inconsistent import paths (`Context` vs `context`)
- Files with wrong imports:
  - `client/src/App.jsx` - imports from `./Context/AuthContext` (should be `./context/AuthContext`)
  - `client/src/Components/Auth/CustomerAuth.jsx` - imports from `../../Context/AuthContext`
  - `client/src/Components/Auth/AdminAuth.jsx` - imports from `../../Context/AuthContext`
  - `client/src/Components/Dashboard/AdminDashboard.jsx` - imports from `../../Context/AuthContext`
  - `client/src/Components/Navbar.jsx` - imports from `../Context/AuthContext`
  - `client/src/Components/Products.jsx` - imports from `../Context/AuthContext`

### 5. **Database Connection** (HIGH PRIORITY)
- ❌ **Issue**: `server/database/connectdb.js` is empty
- ❌ **Missing**: `.env` file with MongoDB connection string
- ❌ **Missing**: `.env.example` file for reference

**Fix:**
- Implement database connection in `connectdb.js`
- Create `.env` file (user should add their MongoDB URI)
- Create `.env.example` file

### 6. **Coffee Model Enhancement** (LOW PRIORITY)
- ⚠️ **Issue**: Coffee model missing fields used in frontend:
  - `image` - Product image path
  - `category` - Product category
  - `rating` - Product rating
  - `stock` - Inventory count
  - `featured` - Featured flag
  - Additional fields like `weight`, `roastLevel`, `flavorProfile`, etc.

### 7. **API Integration** (MEDIUM PRIORITY)
- ❌ **Issue**: Products are hardcoded in frontend components
- ❌ **Missing**: API calls to fetch products from backend
- Files to update:
  - `client/src/Components/Products.jsx` - Fetch from `/api/coffees`
  - `client/src/Components/Menu.jsx` - Fetch from `/api/coffees` or separate menu endpoint

### 8. **Authentication Context Issues** (MEDIUM PRIORITY)
- ❌ **Issue**: `login` and `register` functions in AuthContext are not `async` but use `await`
- ❌ **Issue**: Missing `isAdmin` check in AuthContext
- ❌ **Issue**: No token storage in localStorage
- ❌ **Issue**: No axios interceptor for adding auth tokens to requests

### 9. **Cart Context Enhancement** (LOW PRIORITY)
- ⚠️ **Missing**: Update quantity function (only add/remove)
- ⚠️ **Missing**: Cart persistence in localStorage
- ⚠️ **Missing**: Cart sync with backend (if user is logged in)

### 10. **Environment Configuration** (MEDIUM PRIORITY)
- ❌ **Missing**: `.env` file in server directory
- ❌ **Missing**: `.env.example` file
- ❌ **Missing**: JWT secret key configuration
- ❌ **Missing**: Port configuration

## 📋 Implementation Priority Order

### Phase 1: Critical Backend Setup
1. ✅ Fix database connection (`connectdb.js`)
2. ✅ Create User model
3. ✅ Create Order model
4. ✅ Enhance Coffee model with missing fields
5. ✅ Set up authentication system (JWT, bcrypt)
6. ✅ Create auth routes and controllers
7. ✅ Create order routes and controllers

### Phase 2: Frontend Fixes
1. ✅ Fix import paths (Context → context)
2. ✅ Install missing dependencies (axios, react-router-dom)
3. ✅ Set up API configuration
4. ✅ Fix AuthContext async issues
5. ✅ Add token storage and axios interceptors
6. ✅ Integrate API calls for products

### Phase 3: Integration & Testing
1. ✅ Connect frontend to backend APIs
2. ✅ Test authentication flow
3. ✅ Test order creation
4. ✅ Test admin dashboard
5. ✅ Add error handling

### Phase 4: Polish & Enhancement
1. ✅ Add cart persistence
2. ✅ Add loading states
3. ✅ Add error messages
4. ✅ Add form validation
5. ✅ Add environment variable examples

## 🛠️ Required Dependencies

### Server (`server/package.json`)
```json
{
  "dependencies": {
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3"
  }
}
```

### Client (`client/package.json`)
```json
{
  "dependencies": {
    "axios": "^1.6.0",
    "react-router-dom": "^6.20.0"
  }
}
```

## 📝 Environment Variables Needed

### Server `.env` file:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

## ✅ What's Already Working

- ✅ Frontend UI components (Home, Menu, Products, Cart, etc.)
- ✅ Basic Coffee CRUD API endpoints
- ✅ Cart context and functionality (frontend)
- ✅ Admin dashboard UI
- ✅ Order modal UI
- ✅ React Router setup
- ✅ Tailwind CSS styling
- ✅ Basic server structure

## 🎯 Summary

**Total Critical Issues**: 10
**High Priority**: 5
**Medium Priority**: 4
**Low Priority**: 1

The main blockers are:
1. **No authentication system** - Users can't actually log in
2. **No order persistence** - Orders only in localStorage
3. **Missing dependencies** - App won't run without axios and react-router-dom
4. **Import path errors** - App will crash on load
5. **No database connection** - Backend can't connect to MongoDB

Once these are fixed, the project will be functional. The remaining items are enhancements for better user experience and data persistence.


