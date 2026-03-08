# QuickHire – Job Board Application

A full-stack job board built with **React + TypeScript** (frontend) and **Node.js/Express** (backend).  
Users can browse and search jobs, view job details, apply for positions, and admins can post or delete listings.

---

## Tech Stack

| Layer     | Technology |
|-----------|-----------|
| Frontend  | React 18, TypeScript, Vite, Tailwind CSS, TanStack Query, React Router, Zod |
| Backend   | Node.js, Express, express-validator |
| Database  | JSON file store (local dev) / PostgreSQL (production) |
| Deployment| Vercel (frontend + backend) |

---

## Project Structure

```
Assignment_Qtec/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── pages/        # Route-level pages
│       ├── hooks/        # TanStack Query hooks
│       ├── services/     # API client
│       └── types/        # TypeScript types
└── backend/         # Express REST API
    └── src/
        ├── config/       # DB connection, init, seed
        ├── controllers/  # Route handlers
        ├── middleware/    # Validation, error handling
        ├── models/       # Data access layer
        └── routes/       # Express routers
```

---

## Local Setup

### Prerequisites
- Node.js ≥ 18

### 1. Clone the repo
```bash
git clone <repo-url>
cd Assignment_Qtec
```

### 2. Start the Backend
```bash
cd backend
cp .env.example .env    # edit if needed (defaults work out of the box)
npm install
npm run dev             # starts on http://localhost:5001
```

The backend auto-creates a `data/db.json` file and seeds 12 sample jobs on first run. No database installation required.

### 3. Start the Frontend
```bash
cd client
cp .env.example .env    # VITE_API_URL=http://localhost:5001/api
npm install
npm run dev             # starts on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Environment Variables

### Backend (`backend/.env`)
| Variable       | Default                | Description                              |
|----------------|------------------------|------------------------------------------|
| `PORT`         | `5001`                 | Port the API listens on                  |
| `NODE_ENV`     | `development`          | Environment mode                         |
| `DATABASE_URL` | *(unset)*              | PostgreSQL connection string (production)|
| `CORS_ORIGIN`  | `http://localhost:5173`| Allowed frontend origins (comma-separated)|

### Frontend (`client/.env`)
| Variable        | Default                        | Description          |
|-----------------|--------------------------------|----------------------|
| `VITE_API_URL`  | `http://localhost:5001/api`    | Backend API base URL |

---

## API Endpoints

### Jobs
| Method   | Endpoint          | Description                    |
|----------|-------------------|--------------------------------|
| `GET`    | `/api/jobs`       | List jobs (search, filter, paginate) |
| `GET`    | `/api/jobs/:id`   | Get single job                 |
| `POST`   | `/api/jobs`       | Create job (Admin)             |
| `DELETE` | `/api/jobs/:id`   | Delete job (Admin)             |

**Query params for `GET /api/jobs`:** `search`, `category`, `location`, `page`, `limit`

### Applications
| Method | Endpoint             | Description              |
|--------|----------------------|--------------------------|
| `POST` | `/api/applications`  | Submit job application   |

---

## Features

- ✅ Job listings page with search, category & location filters, pagination
- ✅ Job detail page with full description and Apply Now form
- ✅ Application form with validation (name, email, resume URL, cover note)
- ✅ Admin panel – create and delete job listings
- ✅ Loading skeletons and error states throughout
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Input validation on all API endpoints (express-validator)
- ✅ Clean API responses with consistent `{ success, data }` shape
- ✅ Zero-config local database (JSON file store, no PostgreSQL needed locally)
