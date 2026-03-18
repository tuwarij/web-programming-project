# 🏃 FitTrack — Personal Health & Fitness Tracker

Full-stack web app built with React + Tailwind + Node.js/Express + PostgreSQL (Prisma ORM)

---

## 📁 Project Structure

```
fittrack/
├── backend/          ← Node.js + Express (MVC)
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── index.js
│   └── prisma/
│       └── schema.prisma
└── frontend/         ← React + Vite + Tailwind
    └── src/
        ├── context/
        ├── pages/
        ├── components/
        └── services/
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL (local or [Railway](https://railway.app))

---

### 1. Backend Setup

```bash
cd backend
npm install

# Copy and configure env
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET

# Run DB migrations
npx prisma migrate dev --name init
npx prisma generate

# Start dev server
npm run dev
# → http://localhost:5000
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install

# Start dev server
npm run dev
# → http://localhost:5173
```

---

## 🗄️ Database Schema

| Model       | Description                        |
|-------------|------------------------------------|
| User        | Auth + profile (height, weight, goal) |
| FoodLog     | Meal entries with macros           |
| WorkoutLog  | Exercise with duration & calories  |
| WeightLog   | Daily weight tracking              |

---

## 📡 API Endpoints

| Method | Endpoint               | Description         |
|--------|------------------------|---------------------|
| POST   | /api/auth/register     | Register            |
| POST   | /api/auth/login        | Login               |
| GET    | /api/auth/profile      | Get profile         |
| PUT    | /api/auth/profile      | Update profile      |
| GET    | /api/food?date=        | Get food logs       |
| POST   | /api/food              | Add food log        |
| DELETE | /api/food/:id          | Delete food log     |
| GET    | /api/workout?date=     | Get workout logs    |
| POST   | /api/workout           | Add workout         |
| DELETE | /api/workout/:id       | Delete workout      |
| GET    | /api/weight            | Get weight history  |
| POST   | /api/weight            | Log weight          |
| DELETE | /api/weight/:id        | Delete weight entry |
| GET    | /api/dashboard/summary | Weekly summary      |

---

## 🛠️ Tech Stack

- **Frontend:** React 18, React Router v6, Tailwind CSS, Recharts, date-fns
- **Backend:** Node.js, Express, Prisma ORM, JWT, bcryptjs
- **Database:** PostgreSQL

---

## 📅 2-Week Plan

**Week 1** — Backend + Auth + Core APIs + Basic Frontend  
**Week 2** — All Pages + Charts + Polish + Deploy (Vercel + Railway)
