# GitHub Setup & Deployment Guide

This guide explains how to initialize a Git repository, push to GitHub, and deploy the full-stack portal.

---

## 1. Pushing to GitHub

### Step 1: Initialize Git
In the root directory of the project:
```bash
git init
git add .
git commit -m "Initial commit: College Alumni Connect Portal (Flexi Project)"
```

### Step 2: Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new).
2. Name the repository (e.g. `alumni-connect-portal`).
3. Leave "Initialize this repository with a README" unchecked (since we already have one).
4. Click **Create repository**.

### Step 3: Link & Push
```bash
git remote add origin https://github.com/YOUR_USERNAME/alumni-connect-portal.git
git branch -M main
git push -u origin main
```

---

## 2. Project Directory Structure on GitHub

When pushed to GitHub, your repository will feature this clean, standard full-stack layout:

```text
├── client/              # React 19 Frontend SPA
│   ├── src/             # Pages, components, hooks, styles
│   ├── public/          # Static assets
│   ├── index.html       # HTML entry point
│   ├── vite.config.ts   # Vite configuration
│   └── package.json     # Frontend dependencies
│
├── server/              # Express.js REST API Backend
│   ├── data/            # Seed records
│   ├── db.ts            # Database engine & PostgreSQL synchronization
│   ├── test-db.ts       # Live database connection tester
│   └── package.json     # Server dependencies
│
├── database/            # SQL Schemas
│   ├── schema.sql       # MySQL schema
│   └── setup-live-db.sql# Supabase / PostgreSQL schema & seed
│
├── docs/                # Comprehensive Project Documentation
│   ├── README.md
│   ├── PROJECT_SPECIFICATION.md
│   ├── SYSTEM_ARCHITECTURE.md
│   ├── DATABASE_DESIGN.md
│   ├── API_DOCUMENTATION.md
│   ├── LIVE_DATABASE_SETUP.md
│   └── VIVA_PRESENTATION_GUIDE.md
│
├── .env.example         # Environment template
├── package.json         # Root monorepo orchestration
└── README.md            # Main GitHub presentation README
```

---

## 3. Running Locally from GitHub Clone

Anyone cloning your repository can run:

```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/alumni-connect-portal.git
cd alumni-connect-portal

# 2. Install all dependencies
npm install

# 3. Configure environment
cp .env.example .env
# (Optional) Add your Supabase DATABASE_URL in .env

# 4. Start Full-Stack App
npm run dev
```

The portal will be live at `http://localhost:3000`.

---

## 4. Production Deployment

### Option A: Render / Railway (Full-Stack in 1 Service)
1. Link your GitHub repository in [render.com](https://render.com) or [railway.app](https://railway.app).
2. Set Build Command: `npm install && npm run build`
3. Set Start Command: `npm run start`
4. In Environment Variables, set `DATABASE_URL` (from Supabase or Neon).

### Option B: Vercel (Frontend) + Render (Backend)
- Deploy `client/` folder to Vercel.
- Deploy `server/` folder to Render or Railway.
