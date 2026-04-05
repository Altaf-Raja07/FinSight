# FinSight — Production-Grade Finance Dashboard Backend

[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-blue)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-green)](https://mongodb.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

A **production-ready REST API** for a Finance Dashboard featuring:
- 🔐 JWT Authentication + Role-Based Access Control (ADMIN / ANALYST / VIEWER)
- 💰 Full Transaction CRUD (soft-delete, pagination, full-text search)
- 📊 Advanced Analytics with MongoDB aggregation pipelines
- 🧠 Smart Insights with 2-sigma anomaly detection
- 📈 Monthly trends, category breakdowns, activity feed
- 📄 CSV Export (streaming, memory-efficient)
- 🏷️ Audit Logging on every mutation
- ⚡ In-memory caching with TTL + smart invalidation
- 🛡️ Rate limiting (global + strict auth limiter)
- 🧪 Unit tests (Jest)

---

## 📋 Table of Contents

- [Setup](#-setup)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Role Permissions](#-role-permissions)
- [Sample Requests](#-sample-requests)
- [Running Tests](#-running-tests)

---

## 🚀 Setup

### Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)

### Installation

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Copy and configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# 4. Start development server
npm run dev
```

Server starts at: `http://localhost:5000`

### Verify
```bash
curl http://localhost:5000/health
```

---

## 📁 Project Structure

```
backend/
├── app.js                    # Express app setup
├── server.js                 # HTTP server bootstrap
├── .env.example              # Environment template
├── src/
│   ├── config/
│   │   ├── db.js             # MongoDB connection
│   │   └── env.js            # Env config with validation
│   ├── models/
│   │   ├── User.js           # User model (RBAC, bcrypt)
│   │   ├── Transaction.js    # Transaction model (soft delete)
│   │   └── AuditLog.js       # Audit log model
│   ├── controllers/          # Thin request/response handlers
│   ├── services/             # All business logic
│   ├── routes/               # Route definitions
│   ├── middlewares/
│   │   ├── auth.js           # JWT verification
│   │   ├── rbac.js           # Role-based access control
│   │   ├── errorHandler.js   # Centralized error handler
│   │   ├── rateLimiter.js    # Rate limiting
│   │   └── auditLogger.js    # Audit log middleware
│   ├── utils/
│   │   ├── jwt.js            # Token sign/verify
│   │   ├── response.js       # Standardized responses
│   │   ├── cache.js          # node-cache wrapper
│   │   └── insights.js       # Smart insight generators
│   └── validations/          # Joi schemas
└── tests/                    # Jest unit tests
```

---

## 🔑 Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/finsight` |
| `JWT_SECRET` | JWT signing secret (change in production!) | — |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in ms | `900000` (15 min) |
| `RATE_LIMIT_MAX` | Max requests per window | `100` |
| `CACHE_TTL` | Dashboard cache TTL in seconds | `300` |

---

## 📡 API Reference

Base URL: `http://localhost:5000/api/v1`

### 🔓 Auth Routes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | ❌ Public | Register new user |
| `POST` | `/auth/login` | ❌ Public | Login, get JWT |
| `GET` | `/auth/me` | ✅ Any | Get current user profile |

### 👤 User Routes (ADMIN only)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/users` | ADMIN | List all users (paginated) |
| `GET` | `/users/:id` | ADMIN | Get user by ID |
| `PATCH` | `/users/:id/status` | ADMIN | Update user status |

### 💰 Transaction Routes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/transactions` | ADMIN, ANALYST | Create transaction |
| `GET` | `/transactions` | ADMIN, ANALYST | List with filters + search |
| `GET` | `/transactions/:id` | ADMIN, ANALYST | Get by ID |
| `PATCH` | `/transactions/:id` | ADMIN, ANALYST | Update |
| `DELETE` | `/transactions/:id` | ADMIN, ANALYST | Soft delete |

**Query Parameters for `GET /transactions`:**
- `page`, `limit` — Pagination
- `type` — `INCOME` or `EXPENSE`
- `category` — Filter by category (partial match)
- `startDate`, `endDate` — Date range (ISO format)
- `userId` — Filter by user (ADMIN only)
- `search` — Full-text search across note and category
- `sortBy` — `date`, `amount`, `createdAt`
- `sortOrder` — `asc` or `desc`

### 📊 Dashboard Routes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/dashboard/summary` | Any | Income, expense, net balance |
| `GET` | `/dashboard/category-breakdown` | ADMIN, ANALYST | Spend by category |
| `GET` | `/dashboard/monthly-trends` | ADMIN, ANALYST | 12-month income vs expense |
| `GET` | `/dashboard/spending-insights` | ADMIN, ANALYST | Avg daily spend, anomalies |
| `GET` | `/dashboard/smart-insights` | Any (role-shaped) | AI-style financial insights |
| `GET` | `/dashboard/activity-feed` | ADMIN | Recent transaction feed |

### 📄 Export Routes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/export/transactions` | ADMIN, ANALYST | Download CSV |

### 🗂️ Audit Log Routes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/audit-logs` | ADMIN | Paginated audit log |

### ❤️ Health Check

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | ❌ Public | System status |

---

## 🔐 Role Permissions

| Feature | ADMIN | ANALYST | VIEWER |
|---|:---:|:---:|:---:|
| Manage Users | ✅ | ❌ | ❌ |
| Create/Edit/Delete Transactions | ✅ | ✅ | ❌ |
| View Transactions | ✅ | ✅ (own only) | ❌ |
| Full Dashboard Analytics | ✅ | ✅ | Limited |
| Smart Insights | Full | Full | Summary only |
| Export CSV | ✅ | ✅ | ❌ |
| View Audit Logs | ✅ | ❌ | ❌ |
| Activity Feed | ✅ | ❌ | ❌ |

---

## 📮 Sample Requests

### Register
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Admin",
    "email": "alice@finsight.com",
    "password": "securepass123",
    "role": "ADMIN"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "alice@finsight.com", "password": "securepass123" }'
```

### Create Transaction
```bash
curl -X POST http://localhost:5000/api/v1/transactions \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1200,
    "type": "EXPENSE",
    "category": "Food",
    "date": "2024-11-15",
    "note": "Team lunch"
  }'
```

### Get Dashboard Summary
```bash
curl http://localhost:5000/api/v1/dashboard/summary \
  -H "Authorization: Bearer <TOKEN>"
```

### Get Smart Insights
```bash
curl http://localhost:5000/api/v1/dashboard/smart-insights \
  -H "Authorization: Bearer <TOKEN>"
```

### Export CSV
```bash
curl "http://localhost:5000/api/v1/export/transactions?type=EXPENSE&startDate=2024-01-01" \
  -H "Authorization: Bearer <TOKEN>" \
  -o transactions.csv
```

---

## 🧪 Running Tests

```bash
npm test
```

Test coverage:
- `auth.service.test.js` — Registration, login, error branches
- `transaction.service.test.js` — CRUD, ownership checks, soft delete
- `dashboard.service.test.js` — Anomaly detection, smart insight generation

---

## 🛠️ Advanced Features

### Caching Strategy
Dashboard endpoints are cached with a 5-minute TTL. Cache is automatically invalidated when transactions are created, updated, or deleted — ensuring data freshness without redundant DB queries.

### Anomaly Detection
Spending anomalies are detected using **statistical 2-sigma method**: any expense more than 2 standard deviations above the monthly mean is flagged as an anomaly.

### Soft Delete
Transactions are never permanently deleted. The `isDeleted` flag ensures:
- Deleted records are excluded from all queries and analytics
- Historical data can be recovered
- Audit trails remain complete

### Rate Limiting
- **General API**: 100 requests per 15 minutes per IP
- **Auth endpoints**: 10 requests per 15 minutes per IP (brute-force protection)

---

## 📌 Version

`v1.0.0` — Production-ready release
