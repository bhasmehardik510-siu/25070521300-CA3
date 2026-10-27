# Alumni Connect Portal - Technical Architecture & Viva Reference Guide

## 1. Project Overview & Core USP
**Project Title**: Alumni Connect Portal  
**Core USP**: *"Converting the existing one-time convocation/graduation process into a continuous, verified alumni relationship."*  
**Paradigm**: Instead of replacing the college's administrative convocation system, the portal utilizes official graduation clearance (`graduation_status = COMPLETE`) as the trusted identity verification anchor before issuing a verified Alumni identity.

---

## 2. Multi-Tier System Architecture

```text
+-------------------------------------------------------------------------+
|                           CLIENT LAYER                                  |
|  React 19 SPA + Tailwind CSS + Lucide Icons + Motion Layout Engine      |
+-------------------------------------------------------------------------+
                                    |
                            HTTP REST / JSON
                                    |
+-------------------------------------------------------------------------+
|                        API / CONTROLLER LAYER                           |
|  Express.js / Flask REST API (Modular Controllers & Route Handlers)    |
|  - Role-Based Access Control (RBAC: STUDENT, ALUMNI, ADMIN)            |
|  - Request Body Validation & Sanitization                               |
|  - Session Token / JWT Authorization Guard                              |
+-------------------------------------------------------------------------+
                                    |
+-------------------------------------------------------------------------+
|                        BUSINESS LOGIC SERVICE                           |
|  - Convocation Eligibility Checker & Auto-Population Engine             |
|  - Sensitive Profile Change Auditor (Pending Verification Queue)        |
|  - Mentorship Matching & Connection Graph Engine                        |
|  - Event RSVP & Capacity Manager                                        |
+-------------------------------------------------------------------------+
                                    |
+-------------------------------------------------------------------------+
|                         DATA PERSISTENCE LAYER                          |
|  MySQL 8.0 Relational Engine (InnoDB with Foreign Key Constraints)      |
|  - Tables: users, students, alumni, profile_change_requests, etc.       |
+-------------------------------------------------------------------------+
```

---

## 3. Core Relational Schema & Entity Relationships

1. **`students` -> `alumni` (1:1 Strictly Enforced)**:
   - `alumni.student_id` is a `UNIQUE FOREIGN KEY` pointing to `students.id`.
   - Prevents duplicate alumni identities for the same student enrollment number.
   - Preserves historical academic records (`cgpa`, `branch`, `degree`, `convocation_date`).

2. **`users` -> `students` / `alumni`**:
   - `users` table stores credentials and `role` (`STUDENT`, `ALUMNI`, `ADMIN`).
   - On alumni activation, user's role is atomically upgraded from `STUDENT` to `ALUMNI`.

3. **`alumni` -> `profile_change_requests` (1:N Audit Log)**:
   - When sensitive career fields (`current_company`, `job_role`, `higher_studies`) change, an entry is created in `profile_change_requests` with `status = PENDING`.
   - Admin approves or rejects with audit remarks.

4. **`users` <-> `users` (Connections 1:1 Pair)**:
   - `connections` table has `UNIQUE KEY (sender_id, receiver_id)` ensuring no duplicate pending invites.

---

## 4. End-to-End Demonstration Workflow (Viva Step-by-Step)

| Step | Persona | Action / Screen | Expected Result |
| :--- | :--- | :--- | :--- |
| **1** | Student | Login as Rahul Sharma (`rahul.sharma@college.edu`) | Displays Student Dashboard with Convocation clearance status. |
| **2** | Student | Click **"Activate Alumni Profile"** | Pre-populates verified branch (`CSE`), degree (`B.Tech`), graduation year (`2027`), and enrollment (`SIT2027CSE001`). |
| **3** | Student | Submit career onboarding (e.g. role, company) | Alumni Profile is created instantly with verified identity. |
| **4** | Alumni | Edit profile to update Company to *"Google Cloud"* | Status transitions to **"Pending Verification"** for admin review. |
| **5** | Admin | Switch to Admin (`admin@alumni.edu`) -> **Verifications** | Admin reviews diff, adds remarks, and clicks **Approve**. |
| **6** | Alumni | Return to Profile & Directory | Profile shows green **"✓ Verified Alumni"** badge. |
| **7** | Student | Search Directory -> Connect & Request Mentorship | Mentor receives notification and can accept request. |
| **8** | Alumni | Post Job / Opportunity | Job appears in Jobs portal with alumni referral tag. |
| **9** | User | Events Page -> Register for Alumni Gala | RSVP count increments live and seat is confirmed. |

---

## 5. Security & Authorization Matrix

- **Public Routes**: `/`, `/login`, `/activate` (Eligibility verification lookup).
- **Student Access**: Directory browsing, Send Connection, Request Mentorship, Register for Events. Cannot access Admin routes or post jobs without approval.
- **Alumni Access**: Edit profile (triggers verification), Post Jobs, Offer Mentorship, Submit Achievements, Connect.
- **Admin Access**: `/admin/*` endpoints strictly guarded with `requireAdmin` middleware. Access to Verification Queue, Student Registry toggle, Event creation, and Job moderation.
