# Backend Server - Alumni Connect Portal

This is the Express.js REST API backend for the College Alumni Connect Portal.

## Architecture
- **Framework**: Express.js + TypeScript
- **Database Support**: Live PostgreSQL (Supabase, Neon, Cloud SQL) + In-Memory Relational Engine fallback
- **ORM / Query Layer**: Drizzle ORM + `pg` Node-Postgres Driver with SSL
- **Authentication**: Bearer Token & Role-Based Access Control (RBAC: `STUDENT`, `ALUMNI`, `ADMIN`)

## Folder Contents
```text
server/
├── data/
│   └── seedData.ts       # Rich relational seed data (students, verified alumni, jobs, events)
├── db.ts                 # Database repository layer with auto-sync to live PostgreSQL
├── test-db.ts            # Diagnostic script to test live database connection
├── package.json          # Standalone server package manifest
└── README.md             # Backend documentation
```

## Running Standalone
```bash
cd server
npm install
npm run dev
```

To test your live PostgreSQL connection:
```bash
npm run test:db
```
