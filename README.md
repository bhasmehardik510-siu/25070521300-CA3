# College Alumni Connect Portal

A modern, verified institutional alumni platform built as a **University Engineering Flexi Project**.

The portal solves long-term institutional engagement by anchoring alumni identities directly to official college convocation clearance records (`graduation_status = COMPLETE`).

![Tech Stack](https://img.shields.io/badge/Stack-React_19_%2B_Express_%2B_PostgreSQL-blue)
![Database](https://img.shields.io/badge/Database-Supabase_%2F_PostgreSQL-emerald)
![License](https://img.shields.io/badge/Academic-Flexi_Project-purple)

---

## Key Features

- **Convocation-Anchored Verification**: Converts one-time graduation clearance into a permanent verified alumni profile. Ineligible students (e.g. active semesters, backlogs) are restricted until academic clearance.
- **Administrative Career Audit Trail**: Updates to sensitive fields (Company, Role, Higher Studies) enter an institutional moderation queue before receiving a verified badge.
- **Privacy-Preserving Contact Shield**: Personal phone numbers and personal emails are protected until mutual connection consent is granted. Features an interactive **ON / OFF Visibility Toggle** on profile views and directory cards.
- **Alumni Mentorship Hub**: 1-on-1 career coaching, placement preparation, and resume evaluation with mentee capacity quotas.
- **Campus Opportunity Board**: Jobs and internships posted directly by alumni with internal referral flags.
- **Institutional Events & Reunions**: RSVP and capacity management for annual alumni meets and technical talks.

---

## Repository Structure

```text
├── client/              # React 19 + TypeScript + Tailwind CSS Frontend
├── server/              # Express.js REST API + PostgreSQL Drizzle ORM
├── database/            # PostgreSQL & Supabase SQL Setup Scripts
├── docs/                # Academic & Technical Documentation Suite
├── .env.example         # Environment template
└── package.json         # Root orchestration
```

---

## Quickstart Guide

### 1. Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/alumni-connect-portal.git
cd alumni-connect-portal
npm install
```

### 2. Configure Environment (Optional for Live DB)
```bash
cp .env.example .env
```
To connect to a free **Supabase** or **Neon** database, paste your connection string into `DATABASE_URL`:
```bash
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
```
*(If left empty, the application automatically uses the preloaded in-memory relational seed data)*.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Verify Live Database
```bash
npm run test:db
```

---

## Complete Project Documentation

Detailed academic reports, ER diagrams, and setup instructions are available in the **[`/docs`](./docs)** folder:
- **[Project Specification](./docs/PROJECT_SPECIFICATION.md)**
- **[System Architecture](./docs/SYSTEM_ARCHITECTURE.md)**
- **[Database Design & ERD](./docs/DATABASE_DESIGN.md)**
- **[REST API Documentation](./docs/API_DOCUMENTATION.md)**
- **[Live Supabase Setup Guide](./docs/LIVE_DATABASE_SETUP.md)**
- **[GitHub Deployment Guide](./docs/GITHUB_SETUP_AND_DEPLOYMENT.md)**
- **[Faculty Viva Defense Guide](./docs/VIVA_PRESENTATION_GUIDE.md)**

---

## Default Demonstration Accounts

Use the **Role Switcher** bar at the top of the screen or login directly with these credentials:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@alumni.edu` | `admin123` | Alumni Affairs Dean with verification queue access |
| **Eligible Student** | `rahul.sharma@college.edu` | `student123` | Class of 2027 (Cleared for Alumni Activation) |
| **Ineligible Student** | `priya.verma@college.edu` | `student123` | 6th Semester (Convocation clearance pending) |
| **Verified Alumnus** | `ananya.iyer@college.edu` | `alumni123` | Staff SDE at Google & Active Mentor |

---

## License
Created for academic evaluation and engineering project coursework.
