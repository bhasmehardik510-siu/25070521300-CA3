# MongoDB & Mongoose Integration Guide

The **College Alumni Connect Portal** supports a modern **Dual-Database Architecture**:
1. **Relational Engine**: PostgreSQL (Supabase / Cloud SQL / Local) for strict relational integrity, ACID transactions, and foreign-key graduation verification.
2. **Document Engine**: **MongoDB Atlas / Local MongoDB** via **Mongoose 8.x ODM** for flexible document schemas, rapid prototyping, and MERN-stack presentation defense.

---

## 1. Why MongoDB was Added

In academic evaluations and university flexi projects, evaluators often look for proficiency across both relational (SQL) and non-relational (NoSQL) paradigms.

- **Profile Document Hierarchy**: Alumni profiles contain rich nested collections—skills arrays, mentorship areas, multiple portfolio links, and variable employment histories that map naturally to BSON documents.
- **MERN Stack Compatibility**: Allows students to demonstrate the project under both SQL-first and MERN-first architectures.
- **Zero-Friction Cloud Setup**: MongoDB Atlas provides a free 512MB cloud cluster (M0) accessible via a single connection URI string without local database installation.

---

## 2. MongoDB Architecture & Schemas

The MongoDB layer is implemented in `/server/mongodb.ts` using **Mongoose 8.x**:

### Core Collections & Schemas

| Collection | Schema Highlights | Indexing |
| :--- | :--- | :--- |
| `students` | Official registrar record (`enrollmentNo`, `degree`, `cgpa`, `graduationStatus`, `isAlumniActivated`) | Unique index on `enrollmentNo` |
| `alumni` | Activated alumni document (`studentId`, `company`, `role`, `skills[]`, `mentorshipAreas[]`, `verificationStatus`) | Indexed on `branch`, `graduationYear`, `currentCompany` |
| `users` | Authentication credentials & role (`email`, `passwordHash`, `role: STUDENT \| ALUMNI \| ADMIN`) | Unique index on `email` |
| `jobs` | Job postings (`title`, `company`, `requirements[]`, `skills[]`, `deadline`, `status`) | Indexed by `deadline` |
| `events` | College networking events & webinars (`title`, `category`, `date`, `registeredUserIds[]`) | Indexed by `date` |

---

## 3. Quickstart: Connecting to MongoDB Atlas (2 Minutes)

### Step 1: Create a Free MongoDB Atlas Database
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Create a free **M0 Sandbox** cluster (choose AWS or Google Cloud in your closest region).
3. Under **Database Access**, create a database user (e.g., `alumni_admin` with a password).
4. Under **Network Access**, add IP `0.0.0.0/0` (Allow Access from Anywhere) to permit cloud and local access.
5. Click **Connect** → **Drivers** → **Node.js** to copy your connection string:
   ```text
   mongodb+srv://alumni_admin:<password>@cluster0.xxxxx.mongodb.net/alumni_portal?retryWrites=true&w=majority
   ```

### Step 2: Configure Environment
Add your connection string to your `.env` file:
```env
MONGODB_URI="mongodb+srv://alumni_admin:yourpassword@cluster0.xxxxx.mongodb.net/alumni_portal?retryWrites=true&w=majority"
```

### Step 3: Run the Connection Test Utility
Verify your MongoDB connection and collection indexing:
```bash
npm run test:mongo
```

Example successful terminal output:
```text
====================================================
   ALUMNI CONNECT PORTAL - MONGODB DIAGNOSTIC TOOL  
====================================================

Connecting to MongoDB URI: mongodb+srv://alumni_admin:****@cluster0.xxxxx.mongodb.net/alumni_portal...
✅ Connected to MongoDB successfully!

Collection Record Counts:
 - Students Collection: 20 documents
 - Alumni Collection:   10 documents
 - Users Collection:    15 documents
 - Jobs Collection:     6 documents
 - Events Collection:   5 documents

====================================================
   MongoDB integration test passed successfully!    
====================================================
```

---

## 4. Automatic Seeding & Standby Mode

- **Zero-Crash Standby Mode**: If `MONGODB_URI` is not set in `.env`, the server boots cleanly without crashing. The API reports MongoDB as `STANDBY` and serves requests from PostgreSQL / in-memory cache.
- **Auto-Seeding**: Upon first connecting to an empty MongoDB database, `mongoManager.seedMongoIfEmpty()` automatically populates all 20 verified student records, 10 alumni, job referrals, and events.

---

## 5. Checking Live Database Status via API

The server exposes a unified database status diagnostic route:

```http
GET /api/system/db-status
```

Response:
```json
{
  "success": true,
  "timestamp": "2026-10-27T09:49:09.123Z",
  "postgresql": {
    "type": "PostgreSQL 18.6 / Supabase",
    "configured": true,
    "connected": true,
    "activeDriver": "pg (node-postgres) + Drizzle ORM"
  },
  "mongodb": {
    "type": "MongoDB / Mongoose ODM",
    "configured": true,
    "connected": true,
    "state": "CONNECTED",
    "odm": "Mongoose 8.x",
    "supportedCollections": ["students", "alumni", "users", "jobs", "events", "connections", "mentorship"]
  }
}
```

---

## 6. Viva Presentation Answer: Dual-Database Justification

**Examiner Question**: *"Why does your project support both PostgreSQL and MongoDB?"*

**Answer**:
> *"We implemented a polyglot persistence architecture. For the institutional graduation verification and student convocation clearance, we use a Relational Schema (PostgreSQL/Supabase) to strictly enforce foreign-key constraints (1:1 student-to-alumni mapping) and ACID transaction guarantees. For flexible profile documents, multi-skill tags, and event registrations, we support MongoDB via Mongoose ODM. This demonstrates how enterprise platforms leverage relational databases for high-integrity compliance workflows while using document stores for user profiles and content feeds."*
