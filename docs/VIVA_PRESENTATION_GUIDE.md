# Faculty Viva Presentation & Defense Guide

This guide is structured for faculty evaluation, project defense, and live demonstration.

---

## 1. Quick Pitch (30-Second Elevator Pitch)
> "Good morning, respected professors. Our project is the **College Alumni Connect Portal**. While most alumni websites are disjointed from college administration, our innovation anchors every alumni profile to the institution's official convocation database. Only students with cleared graduation requirements (`graduation_status = COMPLETE`) can activate an alumni profile, eliminating duplicate and unverified accounts. Additionally, our platform features an administrative career audit pipeline, a mutual privacy-preserving contact vault, and integrated mentorship tracks."

---

## 2. Live Demo Script (Step-by-Step Viva Walkthrough)

| Phase | Persona | Action in UI | Faculty Talking Point |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Ineligible Student | Click **Ineligible (Priya)** on top switcher bar | Demonstrate that an active 6th-semester student cannot prematurely activate an alumni profile; the system enforces academic clearance. |
| **Phase 2** | Eligible Student | Click **Eligible Student (Rahul)** -> Go to **Activate** | Show automated pre-filling of verified data (CSE, B.Tech, 2027, CGPA 9.15) directly from the university registry. |
| **Phase 3** | Alumni Activation | Complete onboarding (Company: *Microsoft*, Role: *SDE*) | Profile is created and user role is upgraded atomically from `STUDENT` to `ALUMNI`. |
| **Phase 4** | Career Audit | Edit Profile -> Update company to *Google Cloud* | System detects sensitive career change and queues it for Admin verification rather than direct unverified publishing. |
| **Phase 5** | Admin Moderation | Switch to **Admin** -> Click **Verifications** | Admin reviews before/after diff, adds remarks (*"Verified via offer letter"*), and approves. Status flips to `✓ Verified Alumni`. |
| **Phase 6** | Contact Shield | Visit Directory -> Observe **ON/OFF Privacy Toggle** | Explain how personal phone numbers and direct emails are shielded to prevent cold-spamming unless mutual connection is established. |
| **Phase 7** | Mentorship | Visit **Mentorship Hub** -> Request session | Demonstrate 1-on-1 mentorship request with capacity quotas. |

---

## 3. Frequently Asked Questions (Viva Defense Q&A)

### Q1: Why not just use LinkedIn or existing social networks?
> **Answer**: Third-party networks lack official institutional verification. Anyone can self-report having graduated from an institution without administrative validation. Our platform ties directly into the college convocation database, ensuring 100% authentic academic credentials.

### Q2: How does the system handle database normalization?
> **Answer**: The database is structured in Third Normal Form (3NF). Historical student graduation records in `students` remain immutable, while dynamic professional data lives in `alumni`. A unique foreign key constraint (`alumni.student_id UNIQUE`) strictly enforces a 1:1 relationship, preventing duplicate alumni identities.

### Q3: What happens if an external SQL database is offline?
> **Answer**: The backend implements a resilient dual-mode architecture. When `DATABASE_URL` is configured, it synchronizes with live PostgreSQL (Supabase/Neon) over an SSL connection pool. If offline or running without internet, the system gracefully falls back to an in-memory relational dataset, guaranteeing zero crashes during live presentations.

### Q4: How is data privacy maintained between students and alumni?
> **Answer**: We implemented a Mutual Consent Shield. While public achievements and company information are discoverable in the directory, personal phone numbers and direct personal emails are masked until both parties establish a verified connection request.
