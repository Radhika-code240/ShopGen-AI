# RESTful API with Authentication and CRUD Operations

A secure and scalable RESTful API backend built with **Node.js**, **Express.js**, and **MongoDB Atlas**. This project demonstrates core backend engineering concepts including stateless **JWT authentication**, **bcrypt password hashing**, **Mongoose object modeling**, **CRUD operations**, custom authorization middleware, and structured MVC architecture.

---

## 🚀 Key Features

* **User Authentication & Authorization**:
  * User Registration with cryptographic password hashing using `bcrypt` (salt rounds = 10).
  * User Login returning signed **JSON Web Tokens (JWT)**.
  * Custom `authMiddleware` / `protect` middleware verifying tokens on private routes.
* **Database & CRUD Operations**:
  * Fully connected to **MongoDB Atlas** cloud database using **Mongoose ODM**.
  * Complete CRUD endpoints for Products, Cart management, and Order transactions.
  * Normalized relations between Users, Cart items, and Orders.
* **REST API Principles & Security**:
  * Standard HTTP methods (`GET`, `POST`, `PUT`, `DELETE`).
  * Explicit HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `500 Server Error`).
  * CORS-enabled for seamless frontend integration (React + Vite).
  * Environment configuration isolation via `dotenv`.

---

## 🛠️ Technology Stack

| Layer / Role | Technology | Description |
|---|---|---|
| **Runtime Environment** | Node.js | Asynchronous, event-driven JavaScript server runtime |
| **Backend Framework** | Express.js | Web application and REST API framework |
| **Database** | MongoDB Atlas | Cloud-hosted NoSQL Document Database |
| **Object Data Modeling** | Mongoose | Schema validation and business logic abstraction |
| **Authentication** | `jsonwebtoken` (JWT) | Stateless token-based user authorization |
| **Security / Encryption** | `bcrypt` | Secure one-way salt-hashed password storage |
| **Frontend Client** | React + Vite | Responsive SPA consuming backend REST endpoints |
| **API Testing Tool** | Postman | End-to-end API testing and validation |

---

## 📁 Project Architecture (MVC Structure)

```text
BE Project/
├── backend/
│   ├── controllers/
│   │   ├── authController.js       # User register & login logic
│   │   ├── productController.js    # Product CRUD operations
│   │   ├── cartController.js       # Cart management logic
│   │   ├── orderController.js      # Order creation & history
│   │   └── reviewController.js     # Product reviews management
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT verification & route protection
│   ├── models/
│   │   ├── User.js                 # User schema with hashed passwords
│   │   ├── Product.js              # Product schema with price & stock
│   │   ├── Cart.js                 # User cart schema
│   │   ├── Order.js                # Order transaction schema
│   │   └── Review.js               # Product review & rating schema
│   ├── routes/
│   │   ├── authRoutes.js           # /api/auth routes
│   │   ├── productRoutes.js        # /api/products routes
│   │   ├── cartRoutes.js           # /api/cart routes
│   │   └── orderRoutes.js          # /api/orders routes
│   ├── scripts/
│   │   └── seedProducts.js         # Automated MongoDB Atlas seeder
│   ├── .env                        # Environment variables (PORT, MONGO_URI, JWT_SECRET)
│   ├── package.json                # Dependencies and run scripts
│   └── server.js                   # Express server entry point & DB connection
├── src/                            # React + Vite Frontend Client
├── package.json
└── README.md                       # Project Documentation
```

---

## ⚙️ Installation & Setup Guide

### 1. Prerequisites
Ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v16 or higher)
* [Git](https://git-scm.com/)
* [Postman](https://www.postman.com/) (for API testing)

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd "BE Project"
```

### 3. Backend Setup
1. Navigate to the `backend` folder and install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Create or verify the `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ShopGenAiCluster?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key_2026
   ```

3. Seed Initial Products into MongoDB (Optional):
   ```bash
   npm run seed:products
   ```

4. Start the Backend Server:
   ```bash
   node server.js
   # Or with auto-reload (development mode):
   npm run dev
   ```
   *Expected Terminal Output:*
   ```text
   Server is running on port 5000
   MongoDB Connected
   ```

### 4. Frontend Setup (Optional)
In a separate terminal window from the root directory:
```bash
npm install
npm run dev
```

---

## 📡 API Reference & Endpoints

### 1. Authentication Endpoints (`/api/auth`)

#### Register a New User
* **Method**: `POST`
* **URL**: `http://localhost:5000/api/auth/register`
* **Access**: Public
* **Request Body**:
  ```json
  {
    "name": "Radhika Sharma",
    "email": "radhika@example.com",
    "password": "Password@123"
  }
  ```
* **Success Response (`201 Created`)**:
  ```json
  {
    "_id": "66f54a8b792e31e...",
    "name": "Radhika Sharma",
    "email": "radhika@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

#### User Login
* **Method**: `POST`
* **URL**: `http://localhost:5000/api/auth/login`
* **Access**: Public
* **Request Body**:
  ```json
  {
    "email": "radhika@example.com",
    "password": "Password@123"
  }
  ```
* **Success Response (`200 OK`)**:
  ```json
  {
    "_id": "66f54a8b792e31e...",
    "name": "Radhika Sharma",
    "email": "radhika@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

---

### 2. Product Endpoints (`/api/products`)

| Method | Endpoint | Access | Description | Status Code |
|---|---|---|---|---|
| `GET` | `/api/products` | Public | Get all products from database | `200 OK` |
| `GET` | `/api/products/:id` | Public | Get single product by MongoDB ID | `200 OK` |
| `POST` | `/api/products` | Public / Admin | Create a new product document | `201 Created` |

---

### 3. Cart Endpoints (`/api/cart`) — *Protected Route (Requires Bearer JWT)*

> **Note**: For all protected routes, include the JWT token in request headers:
> `Authorization: Bearer <your_jwt_token>`

#### Get User Cart
* **Method**: `GET`
* **URL**: `http://localhost:5000/api/cart`
* **Headers**: `Authorization: Bearer <token>`
* **Success Response (`200 OK`)**

#### Add Item to Cart
* **Method**: `POST`
* **URL**: `http://localhost:5000/api/cart`
* **Headers**: `Authorization: Bearer <token>`
* **Request Body**:
  ```json
  {
    "productId": "6a762d2d11d85b424b1b9b41",
    "quantity": 1
  }
  ```

---

### 4. Order Endpoints (`/api/orders`) — *Protected Route (Requires Bearer JWT)*

#### Create Order from Cart
* **Method**: `POST`
* **URL**: `http://localhost:5000/api/orders`
* **Headers**: `Authorization: Bearer <token>`
* **Request Body**:
  ```json
  {
    "shippingAddress": {
      "street": "123 Main Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001"
    }
  }
  ```
* **Success Response (`201 Created`)**

#### Get User Order History
* **Method**: `GET`
* **URL**: `http://localhost:5000/api/orders`
* **Headers**: `Authorization: Bearer <token>`
* **Success Response (`200 OK`)**

---

## 🧪 Testing with Postman

1. **Authentication Flow**:
   * Execute `POST /api/auth/register` or `POST /api/auth/login`.
   * Copy the returned `token`.
2. **Testing Protected Endpoints**:
   * In Postman, switch to the **Authorization** tab.
   * Select Type: **Bearer Token**.
   * Paste the copied JWT token into the Token field.
   * Send requests to `/api/cart` or `/api/orders`.
3. **Negative Test (Security Check)**:
   * Send a `GET /api/cart` request without token.
   * Verify receiving `401 Unauthorized` (`"Not authorized, no token"`).

---

## 🔒 Security Best Practices Implemented

* **Password Security**: Passwords never stored in plain text; hashed using `bcrypt` before database write.
* **Stateless Tokens**: JWTs signed with server secret key and expiration period.
* **Input Validation**: Mongoose schema validations prevent invalid or malformed data persistence.
* **Credential Isolation**: Database URIs and JWT secrets stored strictly in environment files (`.env`).
