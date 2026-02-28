# QuickHire — Frontend

React + TypeScript client for the QuickHire job board platform.

## Tech Stack

- **Vite** + SWC
- **React 18** + **TypeScript 5**
- **shadcn/ui** (Radix UI primitives + Tailwind CSS)
- **TanStack React Query v5** — server-state management
- **React Router v6** — client-side routing
- **React Hook Form** + **Zod** — form validation
- **Vitest** + Testing Library — unit tests

## Getting Started

```sh
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env and set VITE_API_URL to your backend URL

# 3. Start development server (http://localhost:8080)
npm run dev
```

## Environment Variables

| Variable       | Description                          | Default                        |
|----------------|--------------------------------------|--------------------------------|
| `VITE_API_URL` | Backend API base URL (include `/api`) | `http://localhost:5001/api`   |

## Available Scripts

| Script          | Description                        |
|-----------------|------------------------------------|
| `npm run dev`   | Start dev server on port 8080      |
| `npm run build` | Production build to `dist/`        |
| `npm run preview` | Preview production build         |
| `npm run lint`  | Run ESLint                         |
| `npm test`      | Run Vitest test suite              |

## Pages

| Route        | Description                              |
|--------------|------------------------------------------|
| `/`          | Home — hero, featured jobs, categories  |
| `/jobs`      | Browse & search jobs (server-side)       |
| `/jobs/:id`  | Job detail + application form            |
| `/admin`     | Admin panel — create & delete listings   |
