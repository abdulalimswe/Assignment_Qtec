# QuickHire – Backend API

RESTful API for the QuickHire job board application, built with **Node.js**, **Express**, and **PostgreSQL**.

---

## Tech Stack

| Layer      | Technology                  |
|------------|-----------------------------|
| Runtime    | Node.js >= 18               |
| Framework  | Express 4                   |
| Database   | PostgreSQL (pg driver)      |
| Validation | express-validator            |
| Security   | Helmet, CORS, express-rate-limit |
| Logging    | Morgan                       |

---

## Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js                  # PostgreSQL connection pool
│   │   └── initDb.js              # Table creation (runs on startup)
│   ├── controllers/
│   │   ├── jobController.js       # Job CRUD logic
│   │   └── applicationController.js
│   ├── models/
│   │   ├── Job.js                 # SQL query helpers for jobs
│   │   └── Application.js        # SQL query helpers for applications
│   ├── routes/
│   │   ├── jobRoutes.js
│   │   └── applicationRoutes.js
│   └── middleware/
│       ├── validate.js            # express-validator rule chains
│       └── errorHandler.js        # 404 + global error handler
├── app.js                         # Express app setup
├── server.js                      # Entry point
├── .env.example
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL server running locally or remotely

### Installation

```bash
# 1. Navigate to the backend folder
cd backend

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env

# 4. Edit .env and fill in your PostgreSQL credentials
```

### Database Setup

Create the database in PostgreSQL before starting the server:

```sql
CREATE DATABASE quickhire;
```

Tables (`jobs` and `applications`) are created automatically on first startup via `src/config/initDb.js`.

### Running the server

```bash
# Development (hot-reload via nodemon)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000`.

---

## Environment Variables

Create a `.env` file in `/backend` (copy from `.env.example`):

```env
PORT=5000
NODE_ENV=development

# PostgreSQL connection
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=quickhire
PG_USER=postgres
PG_PASSWORD=your_password
```

| Variable      | Description                                | Default       |
|---------------|--------------------------------------------|---------------|
| `PORT`        | Port the server listens on                 | `5000`        |
| `PG_HOST`     | PostgreSQL host                            | `localhost`   |
| `PG_PORT`     | PostgreSQL port                            | `5432`        |
| `PG_DATABASE` | Database name                              | `quickhire`   |
| `PG_USER`     | Database user                              | `postgres`    |
| `PG_PASSWORD` | Database password                          | *(empty)*     |
| `NODE_ENV`    | Environment (`development` / `production`) | `development` |

---

## API Reference

### Health Check

| Method | Endpoint  | Description        |
|--------|-----------|--------------------|
| GET    | /health   | Server status check|

---

### Jobs

| Method | Endpoint          | Access | Description               |
|--------|-------------------|--------|---------------------------|
| GET    | /api/jobs         | Public | List all jobs              |
| GET    | /api/jobs/:id     | Public | Get a single job           |
| POST   | /api/jobs         | Admin  | Create a job listing       |
| DELETE | /api/jobs/:id     | Admin  | Delete a job listing       |

#### GET /api/jobs – Query Parameters

| Param      | Type   | Description                            |
|------------|--------|----------------------------------------|
| `search`   | string | Search on title/company/location (ILIKE) |
| `category` | string | Filter by category (case-insensitive)  |
| `location` | string | Filter by location (case-insensitive)  |
| `page`     | number | Page number (default: 1)               |
| `limit`    | number | Results per page (default: 10)         |

#### POST /api/jobs – Request Body

```json
{
  "title": "Frontend Developer",
  "company": "Acme Corp",
  "location": "Dhaka, Bangladesh",
  "category": "Engineering",
  "description": "We are looking for a skilled frontend developer..."
}
```

---

### Applications

| Method | Endpoint                    | Access | Description                       |
|--------|-----------------------------|--------|-----------------------------------|
| POST   | /api/applications           | Public | Submit a job application          |
| GET    | /api/applications/:jobId    | Admin  | List applications for a job       |

#### POST /api/applications – Request Body

```json
{
  "jobId": 1,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "resumeLink": "https://drive.google.com/resume",
  "coverNote": "I am very interested in this role..."
}
```

> **Note:** `jobId` is now a **positive integer** (PostgreSQL `SERIAL` primary key), not a MongoDB ObjectId.

---

## Response Format

All endpoints return a consistent JSON shape:

**Success**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error**
```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": [{ "field": "email", "message": "Please provide a valid email address" }]
}
```

---

## Data Models

### jobs table

| Column      | Type         | Notes                  |
|-------------|--------------|------------------------|
| id          | SERIAL       | Primary key            |
| title       | VARCHAR(100) | Required               |
| company     | VARCHAR(100) | Required               |
| location    | VARCHAR(255) | Required               |
| category    | VARCHAR(100) | Required               |
| description | TEXT         | Required               |
| created_at  | TIMESTAMPTZ  | Auto (default NOW())   |
| updated_at  | TIMESTAMPTZ  | Auto (default NOW())   |

### applications table

| Column      | Type         | Notes                              |
|-------------|--------------|------------------------------------|
| id          | SERIAL       | Primary key                        |
| job_id      | INTEGER      | FK → jobs(id) ON DELETE CASCADE    |
| name        | VARCHAR(100) | Required                           |
| email       | VARCHAR(255) | Required                           |
| resume_link | TEXT         | Required                           |
| cover_note  | TEXT         | Optional (default empty string)    |
| created_at  | TIMESTAMPTZ  | Auto (default NOW())               |
| updated_at  | TIMESTAMPTZ  | Auto (default NOW())               |
