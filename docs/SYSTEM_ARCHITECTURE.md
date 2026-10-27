# System Architecture - College Alumni Connect Portal

## 1. Multi-Tier Architectural Topology

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER (CLIENT)                     │
│  React 19 SPA • Tailwind CSS • Lucide Icons • Motion Transitions      │
│  - Directory Explorer, Mentorship Hub, Job Board, Event Registration   │
│  - Privacy Toggle: Masked vs Unmasked Direct Contact Information       │
│  - Institutional Admin Console & Quick Persona Demonstration Bar       │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ HTTP REST (JSON)
                                     │ Bearer Token / Session Headers
┌────────────────────────────────────▼───────────────────────────────────┐
│                    API CONTROLLER LAYER (EXPRESS.JS)                   │
│  - Express REST Router & Error Handling Middleware                     │
│  - Authentication Guard & Role-Based Access Control (RBAC)             │
│  - Convocation Eligibility Verification & Auto-Population Engine       │
│  - Change Audit Pipeline (Sensitive vs Non-Sensitive Diffing)          │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ SQL Queries / Drizzle ORM
                                     │ Connection Pool (SSL Enabled)
┌────────────────────────────────────▼───────────────────────────────────┐
│                    DATA PERSISTENCE LAYER (POSTGRESQL)                 │
│  - Cloud Database: Supabase / Neon / Google Cloud SQL / PostgreSQL 15+ │
│  - High-Speed In-Memory Relational Engine (Offline & Demo Mode)        │
│  - 10 Relational Tables with 1:1, 1:N, and N:M Integrity Constraints   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Design & Directory Organization

The repository is modularly decoupled into `client/` and `server/` directories:

```text
alumni-connect-portal/
├── client/                      # Frontend Application
│   ├── src/
│   │   ├── components/          # Reusable UI widgets
│   │   │   ├── admin/           # Administrative panels & moderation queues
│   │   │   ├── directory/       # Alumni cards, filters, and profile view
│   │   │   ├── layout/          # Navbar, Footer, and Role Switcher
│   │   │   └── viva/            # Architecture reference modal
│   │   ├── context/             # AuthContext and global state
│   │   ├── pages/               # Top-level route views
│   │   ├── services/            # API wrappers (`api.ts`)
│   │   └── types/               # Shared TypeScript models
│   ├── package.json             # Frontend dependencies
│   └── vite.config.ts           # Vite build configuration
│
├── server/                      # Backend REST API Service
│   ├── data/
│   │   └── seedData.ts          # Comprehensive relational database seeds
│   ├── db.ts                    # Relational database service & live sync
│   ├── test-db.ts               # Database health & connection tester
│   └── package.json             # Server dependencies
│
├── database/                    # SQL Definitions
│   ├── schema.sql               # MySQL/PostgreSQL schema definition
│   └── setup-live-db.sql        # Supabase-ready copy-paste script
│
├── docs/                        # Complete Project Documentation
└── package.json                 # Root monorepo orchestration
```

---

## 3. Role-Based Access Control (RBAC) Matrix

| Endpoint Route | HTTP Method | Public | Student | Alumni | Admin |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `/api/college/check-eligibility/:id` | GET | ✓ | ✓ | ✓ | ✓ |
| `/api/alumni` | GET | ✓ | ✓ | ✓ | ✓ |
| `/api/alumni/:id` | GET | ✓ | ✓ | ✓ | ✓ |
| `/api/events` | GET | ✓ | ✓ | ✓ | ✓ |
| `/api/alumni/activate` | POST | ✗ | ✓ | ✗ | ✗ |
| `/api/alumni/:id/update-request` | PUT | ✗ | ✗ | ✓ (Self) | ✓ |
| `/api/connections` | POST | ✗ | ✓ | ✓ | ✓ |
| `/api/mentorship/requests` | POST | ✗ | ✓ | ✓ | ✓ |
| `/api/jobs` | POST | ✗ | ✗ | ✓ | ✓ |
| `/api/admin/*` | ALL | ✗ | ✗ | ✗ | ✓ |
