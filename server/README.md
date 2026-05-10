# Coffee Shop Backend API

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the `server` directory with the following variables:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
```

**Important:**
- Replace `MONGO_URI` with your MongoDB Atlas connection string or local MongoDB URI
- Replace `JWT_SECRET` with a strong random string (for production, use: `openssl rand -base64 32`)

### 3. Run the Server
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "user": { "id": "...", "name": "...", "email": "...", "role": "customer" },
    "token": "jwt_token_here"
  }
  ```

#### Login User
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "emailOrUsername": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "user": { "id": "...", "name": "...", "email": "...", "role": "customer" },
    "token": "jwt_token_here"
  }
  ```

#### Get Current User (Protected)
- **GET** `/api/auth/me`
- **Headers:** `Authorization: Bearer <token>`

### Admin Routes (`/api/admin`)

#### Admin Login
- **POST** `/api/admin/login`
- **Body:**
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```

#### Register New Admin (Protected - Admin Only)
- **POST** `/api/admin/register`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Body:**
  ```json
  {
    "username": "newadmin",
    "password": "password123",
    "email": "admin@example.com",
    "fullName": "Admin Name"
  }
  ```

#### Get Current Admin (Protected)
- **GET** `/api/admin/me`
- **Headers:** `Authorization: Bearer <admin_token>`

### Coffee Routes (`/api/coffees`)

#### Get All Coffees
- **GET** `/api/coffees`

#### Create Coffee
- **POST** `/api/coffees`
- **Body:**
  ```json
  {
    "name": "Ethiopian Yirgacheffe",
    "origin": "Ethiopia",
    "price": 110,
    "description": "Floral and citrus notes",
    "image": "img/yirga.png",
    "category": "Coffee Beans",
    "rating": 4.9,
    "stock": 25,
    "featured": true
  }
  ```

#### Update Coffee
- **PUT** `/api/coffees/:id`

#### Delete Coffee
- **DELETE** `/api/coffees/:id`

### Order Routes (`/api/orders`)

#### Create Order
- **POST** `/api/orders`
- **Body:**
  ```json
  {
    "customerId": "user_id_optional",
    "customerName": "John Doe",
    "email": "john@example.com",
    "items": [
      {
        "name": "Ethiopian Yirgacheffe",
        "quantity": 2,
        "price": 110
      }
    ],
    "paymentMethod": "Card",
    "paymentMeta": { "last4": "1234" },
    "shippingAddress": "123 Main St",
    "phone": "+1234567890"
  }
  ```

#### Get All Orders (Admin Only)
- **GET** `/api/orders`
- **Headers:** `Authorization: Bearer <admin_token>`

#### Get Order by ID
- **GET** `/api/orders/:id`
- **Headers:** `Authorization: Bearer <token>`

#### Get Customer Orders
- **GET** `/api/orders/customer/:customerId`
- **Headers:** `Authorization: Bearer <token>`

#### Update Order Status (Admin Only)
- **PUT** `/api/orders/:id/status`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Body:**
  ```json
  {
    "status": "completed"
  }
  ```

#### Update Order (Admin Only)
- **PUT** `/api/orders/:id`
- **Headers:** `Authorization: Bearer <admin_token>`

#### Delete Order (Admin Only)
- **DELETE** `/api/orders/:id`
- **Headers:** `Authorization: Bearer <admin_token>`

#### Get Order Statistics (Admin Only)
- **GET** `/api/orders/stats/summary`
- **Headers:** `Authorization: Bearer <admin_token>`

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Models

### User
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required, min 6 chars, hashed)
- `role` (String, enum: ['customer', 'admin'], default: 'customer')

### Admin
- `username` (String, required, unique)
- `password` (String, required, min 6 chars, hashed)
- `email` (String, required, unique)
- `fullName` (String, required)

### Order
- `customerId` (ObjectId, ref: User, optional)
- `customerName` (String, required)
- `email` (String, required)
- `items` (Array of {name, quantity, price}, required)
- `total` (Number, auto-calculated)
- `status` (String, enum: ['pending', 'processing', 'completed', 'cancelled'])
- `paymentMethod` (String, enum: ['Card', 'Telebirr', 'CBE', 'Cash'])
- `paymentMeta` (Object, optional)
- `shippingAddress` (String, optional)
- `phone` (String, optional)

### Coffee
- `name` (String, required)
- `origin` (String, default: "Unknown")
- `price` (Number, required)
- `description` (String)
- `image` (String)
- `category` (String, enum)
- `rating` (Number, 0-5)
- `stock` (Number, min: 0)
- `featured` (Boolean)
- `weight` (String)
- `roastLevel` (String, enum)
- `flavorProfile` (Array of Strings)
- `material` (String)
- `capacity` (String)

## Error Handling

All endpoints return consistent error responses:
```json
{
  "success": false,
  "message": "Error message here"
}
```

Success responses:
```json
{
  "success": true,
  "message": "Success message",
  "data": {...}
}
```


