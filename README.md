<div align="center">

# ⚡ QUIK

### Hyperlocal Commerce Platform — Connect Customers with Local Retailers in Real Time

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-grey?style=for-the-badge&logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.10-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</div>

---

## 📖 About QUIK

**QUIK** is a full-stack hyperlocal commerce platform that bridges the gap between local retailers and nearby customers. Retailers can list their inventory and manage orders, while customers can browse products, add items to their cart, and place orders from local shops — all in one seamless experience.

---

## ✨ Features

### 🛍️ Customer
- Browse and search products from local retailers
- Add to cart & manage quantities
- Secure checkout and order placement
- Track order status in real time

### 🏪 Retailer
- Dashboard with sales overview
- Inventory management (add, update, remove products)
- Order management with status updates
- Shop profile with location support

### 🔐 Platform
- JWT-based authentication
- Role-based access control (`CUSTOMER` / `RETAILER`)
- Input validation with Zod + express-validator
- RESTful API with structured JSON responses

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 18, Tailwind CSS, Zustand, React Hook Form |
| **Backend** | Node.js, Express 4, JWT, bcryptjs |
| **Database** | PostgreSQL + Prisma ORM |
| **Validation** | Zod, express-validator |
| **HTTP Client** | Axios |
| **Icons** | Lucide React |

---

## 📁 Project Structure

```
Quik/
└── quik-platform/
    ├── backend/
    │   ├── prisma/
    │   │   ├── schema.prisma       # Database schema
    │   │   └── seed.js             # Seed data
    │   └── src/
    │       ├── config/             # DB & env config
    │       ├── controllers/        # Route handlers
    │       ├── middleware/         # Auth & role guards
    │       ├── models/             # Data models
    │       ├── routes/             # API routes
    │       ├── services/           # Business logic
    │       ├── utils/              # Helpers
    │       └── server.js           # Entry point
    └── frontend/
        └── src/
            ├── app/
            │   ├── auth/           # Login & Signup pages
            │   ├── customer/       # Home, Search, Cart, Checkout
            │   └── retailer/       # Dashboard, Inventory, Orders
            ├── components/         # Reusable UI components
            ├── services/           # API service layer
            ├── store/              # Zustand state management
            └── styles/             # Global CSS
```

---

## 🗄️ Database Schema

```
User ─── Retailer ─── Product ─┬─ CartItem
  │                              └─ OrderItem
  └─── Order ──────────────────── OrderItem
```

**Models:** `User`, `Retailer`, `Product`, `CartItem`, `Order`, `OrderItem`

**Enums:** `Role (CUSTOMER | RETAILER)`, `OrderStatus (PENDING | CONFIRMED | SHIPPED | DELIVERED | CANCELLED)`

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [PostgreSQL](https://www.postgresql.org/) running locally
- npm or yarn

---

### 1. Clone the Repository

```bash
git clone https://github.com/muwelanurup-web/QUIK.git
cd QUIK/quik-platform
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/quik_db"
JWT_SECRET="your_super_secret_key"
PORT=5000
FRONTEND_URL="http://localhost:3000"
```

Run database migrations and seed:

```bash
npm run prisma:migrate
npm run seed
```

Start the backend server:

```bash
npm run dev
```

> Backend runs at `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

> Frontend runs at `http://localhost:3000`

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/health` | Health check | ❌ |
| `POST` | `/api/auth/signup` | Register user | ❌ |
| `POST` | `/api/auth/login` | Login & get JWT | ❌ |
| `GET` | `/api/products` | List all products | ❌ |
| `POST` | `/api/products` | Create product | ✅ Retailer |
| `PUT` | `/api/products/:id` | Update product | ✅ Retailer |
| `DELETE` | `/api/products/:id` | Delete product | ✅ Retailer |
| `GET` | `/api/cart` | Get cart items | ✅ Customer |
| `POST` | `/api/cart` | Add to cart | ✅ Customer |
| `DELETE` | `/api/cart/:id` | Remove from cart | ✅ Customer |
| `GET` | `/api/orders` | Get orders | ✅ |
| `POST` | `/api/orders` | Place order | ✅ Customer |
| `PUT` | `/api/orders/:id` | Update order status | ✅ Retailer |
| `GET` | `/api/retailers` | List retailers | ❌ |

---

## 🧪 Testing the API

Use the health check to verify the backend is running:

```bash
curl http://localhost:5000/api/health
# → { "status": "ok", "timestamp": "..." }
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ by **muwelanurup-web**

⭐ Star this repo if you find it useful!

</div>
