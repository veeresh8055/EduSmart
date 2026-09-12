# EduSmart

> A full-stack learning management system for discovering courses, purchasing access, learning through video modules, discussing lessons, and taking AI-generated quizzes.

## Live Demo

### [Open EduSmart →](https://edu-smart-six-pi.vercel.app/login)

>
---

## Overview

EduSmart is a role-aware LMS built around a straightforward learning journey:

1. Learners create an account or sign in.
2. They browse and search the course catalog.
3. Stripe Checkout unlocks paid courses.
4. Purchased courses provide video modules, module-specific comments, and learner-specific quizzes.
5. Administrators manage courses/modules and review business analytics from a protected dashboard.

The project separates a React client from an Express API and uses MongoDB for the core learning, purchase, and user data.

## Features

### Learners

- Secure cookie-based registration, login, and logout
- Searchable course catalog and detailed course pages
- Stripe Checkout for course purchases
- Personal purchased-course library
- Video-based module learning workspace
- Comments scoped to the selected course module
- AI-generated multiple-choice quizzes for modules
- Quiz results, answer review, explanations, and retakes

### Administrators

- Protected analytics dashboard
- Revenue, enrollment, user, and course metrics
- Daily revenue trend chart
- Create courses with Cloudinary-hosted thumbnails
- Create video modules with Cloudinary-hosted video uploads

## Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                           React frontend                         │
│ React Router · React Query · Zustand · Tailwind · Radix/shadcn   │
└───────────────────────────────┬─────────────────────────────────┘
                                │ Axios + HTTP-only cookie
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                           Express API                            │
│ JWT auth · role middleware · controllers · validation            │
└───────┬───────────────────┬────────────────────┬────────────────┘
        │                   │                    │
        ▼                   ▼                    ▼
    MongoDB Atlas       Cloudinary             Stripe
 users/courses/      thumbnails/videos      payments & sessions
 modules/orders/
 comments/quizzes
        │
        ▼
   Google Gemini
   quiz generation
```

### Request flow

- **Authentication:** the API signs a JWT after registration/login and sends it in an HTTP-only `token` cookie. Protected API routes verify that cookie and attach the authenticated user to `req.user`.
- **Authorization:** learner-owned course content is checked against `user.purchasedCourse`. Admin routes require the configured administrator email.
- **Server state:** React Query requests, caches, and invalidates API data. Zustand only holds small client-side selections such as the active user and selected module.
- **Payments:** the client requests a Stripe Checkout URL, redirects to Stripe, then confirms the completed checkout session with the API.

## Tech Stack

| Area | Technology |
| --- | --- |
| Client | React 19, Vite, React Router 7 |
| UI | Tailwind CSS 4, Radix UI/shadcn primitives, Lucide icons, Recharts, Sonner |
| Client data | TanStack React Query, Zustand, Axios, React Hook Form |
| API | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Security | JWT, HTTP-only cookies, bcryptjs, CORS |
| Files | Multer, Cloudinary |
| Payments | Stripe Checkout |
| AI | Google Gemini API |

## Project Structure

```text
EduSmart/
├── frontend/
│   ├── src/
│   │   ├── Api/          # Axios API functions
│   │   ├── hooks/        # React Query queries and mutations
│   │   ├── Store/        # Zustand client state
│   │   ├── Pages/        # Auth, learner, and admin screens
│   │   ├── components/   # Shared UI and layout components
│   │   └── Routes/       # Protected and admin route definitions
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/  # Request/business logic
│   │   ├── routes/       # Express route definitions
│   │   ├── models/       # Mongoose schemas
│   │   ├── middleware/   # Auth and upload middleware
│   │   └── config/       # Database, environment, Stripe, Cloudinary
│   └── index.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm
- MongoDB database (local or Atlas)
- Cloudinary account
- Stripe account/test keys
- Google Gemini API key

### 1. Clone and install

```bash
git clone <your-repository-url>
cd EduSmart

cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure environment variables

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_secret
ADMIN=admin@example.com
CLIENT_URL=http://localhost:5173

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

GEMINI_API_KEY=your_google_gemini_api_key
```

Create `frontend/.env`:

```env
VITE_BASE_URL=http://localhost:5000/api
```

Never commit `.env` files or live API keys.

### 3. Run locally

In one terminal:

```bash
cd backend
npm run dev
```

In another terminal:

```bash
cd frontend
npm run dev
```

Open the local Vite address shown in the terminal, normally `http://localhost:5173`.

## API Summary

All endpoints are prefixed with `/api`.

| Domain | Main endpoints |
| --- | --- |
| Auth | `POST /register`, `POST /login`, `POST /logout`, `GET /getUser` |
| Courses | `GET /course/getCourse`, `GET /course/getSingleCourse/:id`, `POST /course/createCourse` |
| Learning | `GET /course/getAllCoursePurchase`, `GET /course/purchasedCourse/:id`, `GET /module/getModule/:id` |
| Modules/comments | `POST /module/createModule`, `GET /module/comment/:id`, `POST /comment/createComment/:id` |
| Quizzes | `GET /quiz/checkQuiz/:moduleId`, `POST /quiz/generateQuiz`, `GET /quiz/getQuiz/:id` |
| Payments | `POST /payment/checkout`, `POST /payment/checkout-success` |
| Analytics | `GET /analytic/getAnalytic`, `GET /analytic/getDailyData` |

See [`backend/BACKEND_GUIDE.md`](backend/BACKEND_GUIDE.md) for controller and middleware details, and [`frontend/FRONTEND_DATA_GUIDE.md`](frontend/FRONTEND_DATA_GUIDE.md) for API, hook, and store details.

## Security and Access Model

- Passwords are hashed with bcrypt before storage.
- JWTs are stored in HTTP-only cookies rather than browser-accessible storage.
- Protected routes require a valid authenticated user.
- Admin APIs require the `ADMIN` account configured in the backend environment.
- Purchased-course, module, comment, and quiz data are access-checked on the server.
- Payment fulfillment verifies Stripe session payment status before recording an order.

## Scripts

| Directory | Command | Purpose |
| --- | --- | --- |
| `frontend` | `npm run dev` | Start Vite development server |
| `frontend` | `npm run lint` | Run ESLint |
| `frontend` | `npm run build` | Build production frontend assets |
| `backend` | `npm run dev` | Start API with nodemon |

## Deployment Notes

Deploy the frontend and backend independently. Set `VITE_BASE_URL` to the deployed API URL (including `/api`) and set backend `CLIENT_URL` to the deployed frontend URL. In production, use HTTPS and `NODE_ENV=production` so secure cross-site authentication cookies are configured correctly.

## Documentation

- [Backend controllers and middleware](backend/BACKEND_GUIDE.md)
- [Frontend API, hooks, and stores](frontend/FRONTEND_DATA_GUIDE.md)

---

Built as a full-stack learning platform with a learner-first experience and protected administration tools.
