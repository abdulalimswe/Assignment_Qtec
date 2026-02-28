# QuickHire – Backend API

RESTful API for the QuickHire job board application, built with **Node.js**, **Express**, and **MongoDB**.

---

## Tech Stack

| Layer      | Technology                  |
|------------|-----------------------------|
| Runtime    | Node.js >= 18               |
| Framework  | Express 4                   |
| Database   | MongoDB + Mongoose           |
| Validation | express-validator            |
| Security   | Helmet, CORS, express-rate-limit |
| Logging    | Morgan                       |

---

## Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── jobController.js       # Job CRUD logic
│   │   └── applicationController.js
│   ├── models/
│   │   ├── Job.js
│   │   └── Application.js
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
- MongoDB running locally **or** a MongoDB Atlas connection string

### Installation

```bash
# 1. Navigate to the backend folder
cd backend

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env

# 4. Edit .env and fill in your values (see Environment Variables section)
```

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
MONGO_URI=mongodb://localhost:27017/quickhire
NODE_ENV=development
```

| Variable   | Description                                      | Default                              |
|------------|--------------------------------------------------|--------------------------------------|
| `PORT`     | Port the server listens on                       | `5000`                               |
| `MONGO_URI`| MongoDB connection string                        | `mongodb://localhost:27017/quickhire`|
| `NODE_ENV` | Environment (`development` / `production`)       | `development`                        |

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
| `search`   | string | Full-text search on title/company/location |
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
  "jobId": "<MongoDB ObjectId of the job>",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "resumeLink": "https://drive.google.com/resume",
  "coverNote": "I am very interested in this role..."
}
```

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

### Job

| Field       | Type   | Required |
|-------------|--------|----------|
| title       | String | Yes      |
| company     | String | Yes      |
| location    | String | Yes      |
| category    | String | Yes      |
| description | String | Yes      |
| createdAt   | Date   | Auto     |
| updatedAt   | Date   | Auto     |

### Application

| Field      | Type     | Required |
|------------|----------|----------|
| job        | ObjectId | Yes      |
| name       | String   | Yes      |
| email      | String   | Yes      |
| resumeLink | String   | Yes      |
| coverNote  | String   | No       |
| createdAt  | Date     | Auto     |
| updatedAt  | Date     | Auto     |
