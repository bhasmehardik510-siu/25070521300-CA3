# College Alumni Connect Portal
### Full-Stack Web Application — Engineering FLEXI Project (CA3)

[![Frontend](https://img.shields.io/badge/Frontend-client_%2F_React_19_%2B_Vite-blue)](https://react.dev/)
[![Backend](https://img.shields.io/badge/Backend-server_%2F_Node.js_%2B_Express-green)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-MongoDB_%2B_MongoDB_Compass-emerald)](https://www.mongodb.com/)
[![Coursework](https://img.shields.io/badge/Coursework-FLEXI_Project_CA3-purple)](#)

A verified, institutional alumni engagement web application developed as a **University Engineering FLEXI Project (CA3)**. 

The platform anchors every alumni identity directly to official college convocation clearance records (`graduation_status = COMPLETE`), eliminating duplicate or unverified profiles.

---

## 🏛️ System Architecture

The project is structured with a decoupled, professional architecture:
- **Frontend (`client/`)**: Client-side Single Page Application (SPA) built with **React 19**, **TypeScript**, and **Tailwind CSS**.
- **Backend (`server/`)**: Server-side REST API built with **Node.js**, **Express.js**, and **Mongoose 8.x**.
- **Database (`MongoDB`)**: Document database on standard port **`27017`**, visualizable with **MongoDB Compass**.

```text
25070521300-CA3/
├── client/                     # FRONTEND (React.js + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/         # Reusable UI widgets (cards, modals, badges)
│   │   ├── context/            # AuthContext & ToastContext providers
│   │   ├── pages/              # Views (Home, Directory, Profile, Jobs, Events, Admin)
│   │   ├── services/api.ts     # Client API connector with Bearer token interceptor
│   │   └── types/              # TypeScript interface definitions
│   ├── index.html              # Frontend HTML5 entry template
│   ├── vite.config.ts          # Vite build config
│   └── package.json            # Frontend dependency manifest
│
├── server/                     # BACKEND (Node.js + Express + Mongoose)
│   ├── data/seedData.ts        # Comprehensive academic registry & mock seed data
│   ├── db.ts                   # Relational query manager & real-time sync layer
│   ├── mongodb.ts              # Mongoose schemas, models, and MongoDB engine
│   ├── routes.ts               # Modular REST API endpoints (/api/auth, /api/alumni, etc.)
│   ├── test-mongo.ts           # Automated MongoDB & Compass test utility
│   ├── test-db.ts              # SQL connection verification utility
│   └── package.json            # Server package manifest
│
├── database/                   # Standalone SQL schema scripts (PostgreSQL & MySQL)
├── docs/                       # Project specifications, architecture & viva guide
├── .env.example                # Environment variables template
├── package.json                # Root orchestration manifest
├── server.ts                   # Unified fullstack entry server
└── README.md                   # Project documentation
```

---

## 💡 Core Features & Innovation

1. **Convocation-Anchored Verification Anchor**:
   - Eliminates fraudulent registrations by cross-verifying student enrollment against university clearance records.
   - Students with `graduation_status = IN_PROGRESS` or active backlogs are restricted from prematurely claiming alumni status.
2. **Administrative Career Audit Trail**:
   - Updates to sensitive career fields (Company, Job Role, Higher Studies) enter a dean moderation queue (`profilechangerequests`) before receiving an official verified badge.
3. **Privacy-Preserving Contact Shield**:
   - Personal phone numbers and private emails are shielded behind a mutual consent vault. Students and alumni only exchange private contact info after accepting connection invites.
4. **1-on-1 Mentorship Hub**:
   - Alumni mentors configure specific mentorship areas (Resume Review, Placement Prep, Higher Studies) with mentee capacity quotas.
5. **Campus Opportunities Board**:
   - Job openings and internships posted directly by verified alumni with referral flags.
6. **Campus Events & Reunions**:
   - Annual homecoming and webinar RSVP management with live attendance tracking stored directly in MongoDB.

---

## 🍃 MongoDB & MongoDB Compass Setup

All data is stored and retrieved in real time using **MongoDB** (database name: **`alumni_connect`**).

### Connecting with MongoDB Compass:
1. Open **MongoDB Compass** on your computer.
2. In the **New Connection** box, enter:
   ```text
   mongodb://127.0.0.1:27017/alumni_connect
   ```
3. Click **Connect**.
4. You will see the **`alumni_connect`** database with the following 9 collections:
   - **`users`**: Login credentials (email, hashed password, role: `STUDENT`, `ALUMNI`, `ADMIN`).
   - **`students`**: University academic registry records (CGPA, enrollment number, convocation status).
   - **`alumni`**: Verified alumni profiles (company, role, experience, skills, mentorship settings).
   - **`jobs`**: Job postings and alumni referrals.
   - **`events`**: Campus webinars, reunions, and registered attendee arrays.
   - **`achievements`**: Verified alumni accolades and honors.
   - **`profilechangerequests`**: Career changes pending admin audit.
   - **`connections`**: Networking requests and private contact notes.
   - **`mentorshiprequests`**: Mentorship applications and status tracking.

---

## 🚀 Running the Project

### Prerequisites:
- **Node.js** (v18 or higher) & **npm**

### Option A: Unified Full-Stack Mode (Recommended)
From the repository root directory:
```bash
# 1. Install root dependencies
npm install

# 2. Run fullstack development server (Frontend + Backend + MongoDB)
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

### Option B: Running Frontend (`client`) and Backend (`server`) Separately

#### 1. Start the Backend (`server`):
```bash
cd server
npm install
npm run dev
```
Backend will start on **`http://localhost:3000`** (or configured `PORT`).

#### 2. Start the Frontend (`client`):
In a separate terminal:
```bash
cd client
npm install
npm run dev
```
Frontend Vite client will start at **`http://localhost:5173`** (proxied to backend at port 3000).

---

## 🧪 Testing & Database Diagnostics

You can run the automated diagnostic script anytime to inspect collection counts in MongoDB:
```bash
npm run test:mongo
```

Example Output:
```text
================================================================
   ALUMNI CONNECT PORTAL - MONGODB COMPASS DIAGNOSTIC TOOL      
================================================================
🍃 [MongoDB Engine] LIVE & ACTIVE ON PORT 27017!
🍃 [MongoDB Compass Connection String]: mongodb://127.0.0.1:27017/alumni_connect
🍃 [Database Name]: alumni_connect

📊 Active MongoDB Collections in "alumni_connect":
 - users:                 16 documents (Auth Credentials)
 - students:              20 documents
 - alumni:                11 documents
 - jobs:                  6 documents
 - events:                5 documents
 - achievements:          5 documents
 - profilechangerequests: 1 documents
 - connections:           2 documents
 - mentorshiprequests:    2 documents

🎉 MongoDB test PASSED!
```

---

## 🔑 Pre-Seeded Demonstration Personas

The application includes an instant **Role Switcher** bar at the top of the interface:

| Persona | Role | Login Email | Password | Evaluation Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `ADMIN` | `admin@alumni.edu` | `admin123` | Institutional Dean overseeing verifications, audits & metrics |
| **Eligible Student** | `STUDENT` | `rahul.sharma@college.edu` | `student123` | Class of 2027 (Cleared for Alumni Activation) |
| **Ineligible Student** | `STUDENT` | `priya.verma@college.edu` | `student123` | 6th Semester (Convocation clearance pending) |
| **Verified Alumnus** | `ALUMNI` | `ananya.iyer@college.edu` | `alumni123` | Staff SDE at Google & Active Mentor |

---

## 📡 REST API Endpoints Summary

### Authentication (`server/routes.ts`)
- `POST /api/auth/register` — Register a new student/alumni account directly in MongoDB.
- `POST /api/auth/login` — Authenticate credentials against MongoDB and receive session token.
- `GET /api/auth/me` — Retrieve current authenticated session and linked profile.
- `POST /api/auth/logout` — Terminate session.

### Academic Verification & Alumni
- `GET /api/college/check-eligibility/:enrollmentNo` — Check graduation clearance.
- `POST /api/alumni/activate` — Upgrade eligible student to verified alumni.
- `GET /api/alumni` — Filtered alumni directory with privacy toggle.
- `GET /api/alumni/:id` — Public alumni details.
- `PUT /api/alumni/:id/update-request` — Submit career change for admin audit.

### Admin Dashboard & Audit
- `GET /api/admin/metrics` — Live KPI metrics (total alumni, students, events, jobs).
- `GET /api/admin/verifications` — Pending career change moderation queue.
- `PUT /api/admin/verifications/:id` — Approve/Reject profile change with remarks.

### Opportunities, Mentorship & Events
- `GET /api/jobs` & `POST /api/jobs` — Browse & post job referrals.
- `GET /api/events` & `POST /api/events/:id/register` — Campus event RSVP.
- `GET /api/mentorship/requests` & `POST /api/mentorship/requests` — Mentorship hub.
- `GET /api/system/db-status` — Real-time database diagnostic status.

---

## 🎓 Faculty Evaluation Walkthrough (Viva Presentation)

1. **Step 1: Check Eligibility Restriction**: Switch to **Ineligible (Priya)** -> click **Activate** -> System strictly blocks activation (`400 Bad Request`) due to active semester.
2. **Step 2: Complete Alumni Activation**: Switch to **Eligible (Rahul)** -> click **Activate** -> Academic credentials pre-filled; profile created in MongoDB and role upgraded to `ALUMNI`.
3. **Step 3: Trigger Career Audit**: Edit Rahul's profile to change company to *Google Cloud* -> System detects sensitive change and queues as `PENDING`.
4. **Step 4: Dean Moderation**: Switch to **Admin** -> Click **Verifications** -> Review diff and click **Approve** -> Status updates to `APPROVED` in MongoDB.
5. **Step 5: Inspect in MongoDB Compass**: Open MongoDB Compass -> view the updated documents in real time.

---

## 📜 Academic Declaration
Developed for university engineering coursework evaluation (**FLEXI Project CA3**).
All rights reserved.
