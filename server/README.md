# Backend Server - Alumni Connect Portal

This is the Express.js REST API backend for the College Alumni Connect Portal.

## Architecture
- **Framework**: Express.js + TypeScript
- **Relational Database**: PostgreSQL (Supabase, Neon, Cloud SQL) via `pg` + Drizzle ORM
- **NoSQL Document Database**: MongoDB Atlas / Local MongoDB via **Mongoose 8.x**
- **Fallback Engine**: Resilient in-memory relational cache ensuring 100% demo uptime
- **Authentication**: Bearer Token & Role-Based Access Control (RBAC: `STUDENT`, `ALUMNI`, `ADMIN`)

## Folder Contents
```text
server/
├── data/
│   └── seedData.ts       # Rich dataset (20 students, 10 verified alumni, jobs, events)
├── db.ts                 # PostgreSQL repository layer & live synchronization
├── mongodb.ts            # Mongoose schemas, models, and MongoDB Atlas connection manager
├── routes.ts             # Modular Express Router containing all 20+ REST API endpoints
├── index.ts              # Standalone Express backend server entry point (Port 5000)
├── test-db.ts            # Diagnostic test tool for live PostgreSQL connection
├── test-mongo.ts         # Diagnostic test tool for live MongoDB Atlas connection
├── package.json          # Standalone server package manifest
└── README.md             # Backend documentation
```

## Running the Backend

### Standalone Backend Mode (Port 5000)
```bash
cd server
npm install
npm run dev
```

### Full-Stack Mode (Root)
From the repository root:
```bash
npm run dev
```

## Database Connection Diagnostics

### Test PostgreSQL (Supabase / Cloud SQL)
```bash
npm run test:db
```

### Test MongoDB (Atlas / Mongoose)
```bash
npm run test:mongo
```
