# Vitto Loan Application Portal

A complete, production-ready full-stack loan application portal built for vitto.

## Tech Stack

- **Backend:** Node.js, Express, PostgreSQL
- **Frontend:** React (Vite), React Router, Axios, Pure CSS

## Local Setup Steps

### 1. Clone the repository

```bash
git clone <repository-url>
cd vitto-loan-portal
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and configure your database connection string:

```bash
cp .env.example .env
```

Ensure you update the `DATABASE_URL` in `.env` to match your local PostgreSQL credentials.

Run database migration:

```bash
psql $DATABASE_URL -f migrations/001_init.sql
```

Start the backend server in development mode:

```bash
npm run dev
```

### 3. Frontend Setup

In a new terminal window:

```bash
cd ../frontend
npm install
```

Create `.env` file and set the API base URL:

```bash
echo "VITE_API_BASE_URL=http://localhost:4000" > .env
```

_(Note: If you run locally, the vite proxy will handle requests automatically. Just set it for production)_

Start the frontend development server:

```bash
npm run dev
```

## Live URL

[Live](https://vitto-loan-portal.vercel.app/)

## API Endpoints
### Applications

- **POST `/api/applications`**: Create a new loan application.
  - Body: `{ name, mobile, amount, purpose, language }`
- **GET `/api/applications`**: Fetch all applications.
  - Query parameter (optional): `?status=pending|approved|rejected`
- **PATCH `/api/applications/:id/status`**: Update application status.
  - Body: `{ status: 'approved' | 'rejected' }`
- **GET `/api/summary`**: Get summary of applications (total, total amount, pending, approved, rejected).

## Deployment Notes

- **Backend:** Can be deployed to Render, Railway, or Heroku. Ensure `DATABASE_URL` and `FRONTEND_URL` environment variables are properly set. The database uses SSL in production (configured in `db.js`).
- **Frontend:** Can be deployed to Vercel, Netlify, or Cloudflare Pages. Set `VITE_API_BASE_URL` to the production backend URL during build.
- **Database:** Neon, Supabase, or AWS RDS are great choices for managed PostgreSQL.

## Known Issues

- None at the moment.

## Future Improvements

- Add authentication (JWT) for the dashboard so only admins can approve/reject.
- Implement pagination in the GET `/api/applications` endpoint and frontend table for large datasets.
- Add more comprehensive E2E and unit testing (Jest/Cypress).
- Implement rate limiting on the POST endpoint to prevent spam.
