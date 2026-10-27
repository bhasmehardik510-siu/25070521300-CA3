# College Alumni Connect Portal - Documentation Suite

Welcome to the comprehensive technical and academic documentation for the **College Alumni Connect Portal** (University Engineering Flexi Project).

This project reimagines institutional alumni engagement by anchoring lifelong verified alumni profiles directly to official college graduation records and convocation clearance.

---

## Documentation Index

| Document | Description |
| :--- | :--- |
| **[1. Project Specification](./PROJECT_SPECIFICATION.md)** | Problem Statement, Objectives, Scope, and Convocation-anchored trust model. |
| **[2. System Architecture](./SYSTEM_ARCHITECTURE.md)** | Multi-tiered design, client SPA, Express REST API, and RBAC authorization matrix. |
| **[3. Database Design & Relational Schema](./DATABASE_DESIGN.md)** | Complete entity relationship diagram (ERD), tables dictionary, 3NF normalization, and foreign keys. |
| **[4. REST API Documentation](./API_DOCUMENTATION.md)** | Specification of all REST API endpoints with request/response payloads. |
| **[5. Live Database Setup Guide](./LIVE_DATABASE_SETUP.md)** | Setup instructions for Supabase, Neon, Cloud SQL, or Local PostgreSQL in 2 minutes. |
| **[6. GitHub Setup & Deployment](./GITHUB_SETUP_AND_DEPLOYMENT.md)** | Instructions for pushing to GitHub, repository layout, and deploying full-stack. |
| **[7. Viva Defense & Evaluation Guide](./VIVA_PRESENTATION_GUIDE.md)** | Walkthrough script for faculty review, viva Q&A, and technical defense. |

---

## Core Problem & Innovation Summary

### The Academic Challenge
Most college alumni portals suffer from one of two critical failures:
1. **Unverified Impersonation**: Allowing anyone with an email address to claim they are alumni without verifying whether they actually graduated or completed their degree.
2. **Post-Convocation Drop-off**: Colleges maintain accurate student databases during active semesters, but once convocation ends, communication channels (college emails) lapse, losing touch with alumni during their most valuable career years.

### The Engineering Solution
The **Alumni Connect Portal** solves this by establishing a **1:1 verified foreign-key linkage** between the official college registry (`students`) and the alumni directory (`alumni`):
- **Convocation Gate**: Only students marked as `COMPLETE` in official records can activate an alumni profile.
- **Auto-Population**: Graduation year, department, degree, and enrollment numbers are automatically pulled from verified registrar records.
- **Audit-Logged Career Updates**: Profile updates to sensitive fields (Company, Job Title, Higher Studies) enter an institutional moderation queue before receiving a verified badge.
- **Mutual Privacy Vault**: Contact details (personal email, phone) remain protected until both parties mutually accept a connection request.
