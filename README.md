# NewsLens AI

A full-stack AI-powered news application built with the MERN stack. Aggregates articles across 6+ categories (technology, sports, business, health, entertainment, science) via the News API and uses Gemini AI to auto-generate concise summaries.

## Features

- Browse and filter articles by category, with keyword search and pagination
- AI-generated summaries so you can scan the key points without opening the full article
- Email/password auth with JWT
- Bookmark articles and revisit them later
- Articles refresh automatically on an hourly schedule

## Stack

- **Frontend:** React, React Router, Tailwind CSS, Vite
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **AI:** Google Gemini for article summarization
- **Data:** News API for article aggregation

## Getting started

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, NEWS_API_KEY, GEMINI_API_KEY, CLIENT_URL
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL
npm run dev
```

The backend runs on `http://localhost:5002` and the frontend on `http://localhost:5173` by default.
