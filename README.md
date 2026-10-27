# College Alumni Connect Portal
### Full-Stack Web Application — Engineering FLEXI Project (CA3)

[![Tech Stack](https://img.shields.io/badge/Stack-React_19_%2B_Node.js_%2B_Express-blue)](https://react.dev/)
[![Database](https://img.shields.io/badge/Database-MongoDB_%2B_MongoDB_Compass-green)](https://www.mongodb.com/)
[![ODM](https://img.shields.io/badge/ODM-Mongoose_8.x-brightgreen)](https://mongoosejs.com/)
[![Academic](https://img.shields.io/badge/Coursework-FLEXI_Project_CA3-purple)](#)

A production-grade, verified institutional alumni platform developed as a **Full-Stack Engineering Flexi Project**. The system solves long-term institutional engagement by anchoring alumni identities directly to official college convocation clearance records (`graduation_status = COMPLETE`), eliminating unverified and duplicate profiles.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | **HTML5, CSS3, JavaScript, React.js** | React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Motion animations |
| **Backend** | **Node.js + Express.js** | RESTful API architecture, JSON middleware, Bearer & header-based auth |
| **Database** | **MongoDB (MongoDB Compass)** | Document database with Mongoose 8.x ODM, live port 27017 synchronization |
| **Authentication** | **Dual Authentication** | Database-backed Email/Password credentials + Google OAuth via Firebase |

---

## 🌟 Key Functional Features

1. **Convocation-Anchored Verification**: Converts one-time graduation clearance into a permanent verified alumni profile. Active semester students and backlog candidates are restricted from prematurely activating alumni status until official convocation clearance.
2. **Administrative Career Audit Trail**: Sensitive professional updates (Company, Job Role, Higher Studies) enter an institutional moderation queue for dean approval before receiving a verified badge.
3. **Privacy-Preserving Contact Shield**: Personal phone numbers and personal emails are protected behind an interactive visibility toggle, shielding alumni from spam until mutual connection consent is granted.
4. **Alumni Mentorship Hub**: 1-on-1 placement coaching, resume evaluation, and career guidance with strict mentee capacity quotas.
5. **Campus Opportunity Board**: Jobs and internships posted directly by alumni with internal referral flags.
6. **Institutional Events & Reunions**: RSVP and capacity management for annual alumni meets and technical talks with real-time attendee tracking.
7. **Role-Based Access Control (RBAC)**: Distinct permissions for `STUDENT`, `ALUMNI`, and `ADMIN` users.

---

## 🍃 MongoDB & MongoDB Compass Integration

The application natively connects to **MongoDB** and stores all operational documents across 9 structured collections.

### MongoDB Compass Connection:
- **Host**: `127.0.0.1` (localhost)
- **Port**: `27017`
- **Database Name**: `alumni_connect`
- **Connection URI**:
  ```text
  mongodb://127.0.0.1:27017/alumni_connect
  ```

### Collections Overview:
1. `users` — Authentication credentials, hashed passwords, roles (`STUDENT`, `ALUMNI`, `ADMIN`).
2. `students` — Official academic registry records with CGPA, branch, and convocation status.
3. `alumni` — Verified alumni profiles, professional history, skills, and mentorship availability.
4. `jobs` — Campus opportunities, job descriptions, deadlines, and internal referral flags.
5. `events` — College reunions, webinars, capacity quotas, and registered attendee IDs.
6. `achievements` — Honors, patents, and career milestones submitted for verification.
7. `profilechangerequests` — Career change proposals pending admin audit.
8. `connections` — Networking requests, mutual consent privacy vault, and private messages.
9. `mentorshiprequests` — 1-on-1 coaching applications, topics, and mentor notes.

---

## 🚀 Quickstart Guide

### 1. Clone the Repository
```bash
git clone https://github.com/bhasmehardik510-siu/25070521300-CA3.git
cd 25070521300-CA3
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create a `.env` file in the project root (or copy `.env.example`):
```bash
cp .env.example .env
```
Default configuration:
```env
MONGODB_URI="mongodb://127.0.0.1:27017/alumni_connect"
PORT=3000
```

### 4. Run the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 5. Verify MongoDB Connection
Run the automated diagnostic suite to inspect all 9 collections in MongoDB:
```bash
npm run test:mongo
```

---

## 👥 Demonstration Accounts & Personas

Use the **Role Switcher** bar at the top of the interface or log in directly with these pre-seeded accounts:

| Persona | Role | Email | Password | Academic Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `ADMIN` | `admin@alumni.edu` | `admin123` | Alumni Affairs Dean with verification queue access |
| **Eligible Student** | `STUDENT` | `rahul.sharma@college.edu` | `student123` | Class of 2027 (Cleared for Alumni Activation) |
| **Ineligible Student** | `STUDENT` | `priya.verma@college.edu` | `student123` | 6th Semester (Convocation clearance pending) |
| **Verified Alumnus** | `ALUMNI` | `ananya.iyer@college.edu` | `alumni123` | Staff SDE at Google & Active Mentor |

---

## 📡 REST API Reference

### Authentication & Users
- `POST /api/auth/register` — Register a new student or alumni account in MongoDB.
- `POST /api/auth/login` — Authenticate credentials and receive session token.
- `GET /api/auth/me` — Retrieve active profile and permissions.
- `POST /api/auth/logout` — Terminate session.

### Academic Verification & Alumni
- `GET /api/college/check-eligibility/:enrollmentNo` — Verify convocation clearance.
- `POST /api/alumni/activate` — 1:1 upgrade from eligible student to alumni.
- `GET /api/alumni` — Filtered alumni directory with privacy toggle.
- `GET /api/alumni/:id` — Detailed public alumni profile.
- `PUT /api/alumni/:id/update-request` — Submit career changes for admin audit.

### Administration & Moderation
- `GET /api/admin/metrics` — Institutional dashboard KPIs.
- `GET /api/admin/verifications` — Pending career update audit queue.
- `PUT /api/admin/verifications/:id` — Approve or reject profile change with remarks.

### Opportunities, Mentorship & Events
- `GET /api/jobs` & `POST /api/jobs` — Job listings and referrals.
- `GET /api/events` & `POST /api/events/:id/register` — Campus reunion RSVP.
- `GET /api/mentorship/requests` & `POST /api/mentorship/requests` — Mentorship hub.
- `GET /api/system/db-status` — Real-time database diagnostic endpoint.

---

## 📂 Project Structure

```text
├── client/                     # React 19 Frontend components & views
├── server/                     # Node.js + Express Backend
│   ├── data/seedData.ts        # Initial academic and alumni datasets
│   ├── db.ts                   # Relational query manager & MongoDB synchronization
│   ├── mongodb.ts              # Mongoose schemas, models, and MongoDB Compass engine
│   ├── routes.ts               # Modular REST API endpoints
│   ├── test-db.ts              # PostgreSQL diagnostic tool
│   └── test-mongo.ts           # MongoDB Compass diagnostic tool
├── src/                        # Frontend source files
│   ├── components/             # Reusable UI components
│   ├── context/                # Authentication & toast state management
│   ├── pages/                  # Application views (Directory, Admin, Mentorship, Jobs, Events)
│   └── services/api.ts         # Axios/Fetch API client with token interceptors
├── database/                   # SQL schemas and setup scripts
├── docs/                       # Complete academic documentation suite
├── .env.example                # Environment variables template
├── package.json                # Project dependencies and npm scripts
├── server.ts                   # Application entry point (Vite + Express server)
└── tsconfig.json               # TypeScript compiler configuration
```

---

## 🎓 Faculty Evaluation & Viva Defense Matrix

| Viva Milestone | UI Action | Expected System Behavior |
| :--- | :--- | :--- |
| **1. Eligibility Enforcement** | Select Ineligible Student (`Priya`) -> Click Activate | System rejects activation (`400 Bad Request`); displays pending academic clearance message. |
| **2. Authentic Activation** | Select Eligible Student (`Rahul`) -> Complete Activation | Validates graduation status = `COMPLETE`, creates alumni record, updates role to `ALUMNI`, syncs to MongoDB. |
| **3. Career Audit Trail** | Edit profile to change company to *Google Cloud* | Detects sensitive field change, marks profile as `PENDING`, queues for dean moderation. |
| **4. Dean Moderation** | Switch to Admin -> Click Verifications -> Approve | Admin reviews diff, adds verification remark; profile status flips to `APPROVED`. |
| **5. MongoDB Compass Verification** | Open Compass -> `alumni_connect` -> `users` | Inspect newly created and modified documents live in MongoDB. |

---

## 📜 License & Academic Declaration
Developed for university engineering coursework evaluation (**FLEXI Project CA3**).
