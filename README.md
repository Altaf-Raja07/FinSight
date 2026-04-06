# FinSight

A full-stack finance analytics platform with role-based access, transaction management, dashboard insights, audit logging, and CSV export.

## What This Project Actually Does

FinSight helps teams and individuals manage financial records and understand spending patterns.

At a high level, it provides:
- Secure authentication with role-based permissions (`ADMIN`, `ANALYST`, `VIEWER`)
- Transaction lifecycle management (create, read, update, soft-delete)
- Real-time dashboard metrics and analytics
- Statistical spending anomaly detection and smart insight generation
- Admin-only user management and audit trail visibility
- CSV export for reporting and external analysis

## Product Overview

The project is split into two applications:

- `backend/`: Node.js + Express + MongoDB REST API
- `frontend/`: Next.js (App Router) + TypeScript + Tailwind + shadcn/ui client

The frontend consumes backend endpoints at:
- `http://localhost:5000/api/v1` by default
- Configurable via `NEXT_PUBLIC_API_URL`

## Core Features

### Authentication and Authorization
- JWT-based auth (`/auth/register`, `/auth/login`, `/auth/me`)
- Token stored client-side and attached via Axios interceptor
- Access control by role:
  - `ADMIN`: full access, including users and audit logs
  - `ANALYST`: transactions + analytics + export
  - `VIEWER`: dashboard-level read access only

### Transactions
- Create/update/delete financial entries
- Soft-delete support via `isDeleted`
- Query support:
  - pagination (`page`, `limit`)
  - filters (`type`, `category`, date range)
  - full-text search (`search`)
  - sorting (`sortBy`, `sortOrder`)

### Dashboard and Analytics
- Summary metrics:
  - total income
  - total expense
  - net balance
  - transaction count
- Category breakdown for spend/income
- Monthly trends (income vs expense)
- Spending insights:
  - highest spending category
  - average daily spend
  - anomaly detection (2-sigma threshold)
- Smart insights:
  - generated from current vs previous month behavior
  - role-aware insight shaping

### Auditability and Export
- Audit log model and admin route for action tracking
- CSV export stream for transactions (memory-efficient cursor-based export)

### Security and Reliability
- `helmet` security headers
- `express-mongo-sanitize` for NoSQL injection prevention
- `xss-clean` for request sanitization
- Global and auth-specific rate limits
- Centralized error handling with custom `AppError`
- Winston structured logging (file + console)
- Graceful shutdown handling and process-level exception handlers

## Tech Stack

### Backend
- Node.js, Express
- MongoDB, Mongoose
- Joi validation
- JWT auth (`jsonwebtoken`)
- Rate limiting (`express-rate-limit`)
- Caching (`node-cache`)
- CSV export (`@fast-csv/format`)
- Logging (`winston`, `morgan`)
- Testing (`jest`, `supertest`)

### Frontend
- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- shadcn/ui + Radix primitives
- Axios client with auth interceptors
- Recharts for visualizations
- Sonner for toast notifications

## Repository Structure

```text
FinSight/
├── backend/
│   ├── app.js
│   ├── server.js
│   ├── Dockerfile
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── validations/
│   └── tests/
└── frontend/
    ├── app/
    │   ├── page.tsx
    │   ├── login/
    │   ├── register/
    │   └── dashboard/
    ├── components/
    ├── hooks/
    ├── lib/
    └── public/
```

## API Surface (Backend)

Base path: `/api/v1`

- Auth:
  - `POST /auth/register`
  - `POST /auth/login`
  - `GET /auth/me`

- Users (`ADMIN`):
  - `GET /users`
  - `GET /users/:id`
  - `PATCH /users/:id/status`

- Transactions (`ADMIN`, `ANALYST`):
  - `GET /transactions`
  - `GET /transactions/:id`
  - `POST /transactions`
  - `PATCH /transactions/:id`
  - `DELETE /transactions/:id` (soft delete)

- Dashboard:
  - `GET /dashboard/summary` (all authenticated roles)
  - `GET /dashboard/smart-insights` (all authenticated roles)
  - `GET /dashboard/category-breakdown` (`ADMIN`, `ANALYST`)
  - `GET /dashboard/monthly-trends` (`ADMIN`, `ANALYST`)
  - `GET /dashboard/spending-insights` (`ADMIN`, `ANALYST`)
  - `GET /dashboard/activity-feed` (`ADMIN`)

- Export:
  - `GET /export/transactions` (`ADMIN`, `ANALYST`)

- Audit:
  - `GET /audit-logs` (`ADMIN`)

- Health:
  - `GET /health`

## Role Matrix

| Capability | ADMIN | ANALYST | VIEWER |
|---|---:|---:|---:|
| Login/Register | Yes | Yes | Yes |
| View Dashboard Summary | Yes | Yes | Yes |
| View Smart Insights | Yes | Yes | Yes |
| View Advanced Analytics | Yes | Yes | No |
| Manage Transactions | Yes | Yes | No |
| Export CSV | Yes | Yes | No |
| User Management | Yes | No | No |
| Activity Feed | Yes | No | No |
| Audit Logs | Yes | No | No |

## Local Development

### 1) Start Backend

```powershell
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`.

### Backend Environment
Create `backend/.env` from `backend/.env.example` and set values:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/finsight
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
CACHE_TTL=300
```

### 2) Start Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

### Frontend Environment
Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### 3) Open the App
- Landing page: `http://localhost:3000`
- Login: `http://localhost:3000/login`
- Dashboard: `http://localhost:3000/dashboard`

## Testing

Run backend tests:

```powershell
cd backend
npm test
```

Included tests cover:
- auth service
- transaction service
- dashboard insight logic

## Docker (Backend)

A production Dockerfile is included for the backend.

```powershell
cd backend
docker build -t finsight-backend .
docker run -p 5000:5000 --env-file .env finsight-backend
```

## Important Notes

- The frontend branding in code currently uses `FinanceFlow` in several UI labels, while the repository/product name is `FinSight`.
- In `frontend/next.config.mjs`, TypeScript build errors are currently ignored (`ignoreBuildErrors: true`). This is convenient for fast iteration but should be tightened before production hardening.
- Backend CORS currently allows localhost frontend origins by default.

## Operational Flow (End-to-End)

1. User authenticates from frontend (`/login` or `/register`).
2. Backend returns JWT and user profile.
3. Frontend stores token and uses it for subsequent API calls.
4. Dashboard loads summary + insights (and analytics if role allows).
5. Transaction writes invalidate relevant cache keys.
6. Admin can manage users and inspect activity/audit endpoints.
7. Analysts/Admins can export filtered transaction data to CSV.

## License

MIT