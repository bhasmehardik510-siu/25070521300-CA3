# Project Specification - College Alumni Connect Portal

## 1. Project Title & Academic Details
- **Project Title**: College Alumni Connect Portal
- **Category**: Full-Stack Web Application (University Engineering Flexi Project)
- **Primary Domain**: Institutional Data Management, Role-Based Access Control, Relational Systems

---

## 2. Problem Statement
Higher education institutions face significant challenges maintaining long-term, trustworthy communication with graduated alumni:
1. **Lack of Identity Verification**: Third-party social networks (LinkedIn, Facebook) lack official academic verification, allowing anyone to claim affiliation with a college.
2. **Fragmented Academic Records**: Student registration systems are decoupled from alumni portals, requiring redundant, error-prone manual data entry upon graduation.
3. **Privacy Vulnerabilities**: Alumni hesitate to share direct phone numbers and personal emails publicly due to spam and cold-outreach concerns.
4. **Inactive Engagement**: Students lack structured, verified channels to request 1-on-1 career mentorship or explore alumni-referred job opportunities.

---

## 3. Project Objectives
- **Objective 1**: Develop a unified digital gateway that uses official college convocation clearance as an identity verification anchor.
- **Objective 2**: Implement a strict 1:1 relational constraint between student academic records and alumni profiles to eliminate fraudulent registrations.
- **Objective 3**: Implement an administrative audit trail for sensitive career updates (promotions, company transitions, higher studies).
- **Objective 4**: Build a privacy-preserving contact exchange protocol where direct phone numbers and personal emails are disclosed only upon mutual consent.
- **Objective 5**: Provide institutional modules for alumni mentorship, verified job postings, college reunion events, and honors showcase.

---

## 4. System Scope & Stakeholder Personas

### Persona A: College Student (`STUDENT`)
- Views official convocation eligibility status.
- Once graduation status is `COMPLETE`, activates their permanent Alumni Profile.
- Explores verified alumni directory with filters for department, graduation year, company, and mentorship willingness.
- Sends connection invites and requests 1-on-1 mentorship sessions.
- Registers for university events and explores campus hiring opportunities.

### Persona B: Verified Alumnus (`ALUMNI`)
- Manages professional profile with verified college credentials pre-filled.
- Submits career updates (triggers admin audit if company or role changes).
- Configures mentorship availability (topics, max mentees capacity).
- Posts job openings with internal referral flags.
- Connects with fellow alumni and mentees in a mutual privacy vault.

### Persona C: College Dean / Alumni Officer (`ADMIN`)
- Oversees institutional dashboard with key metrics (alumni counts, pending verifications, active mentors).
- Reviews and moderates profile change requests with audit remarks.
- Manages convocation records and student graduation clearance statuses.
- Creates and manages official college reunions, webinars, and networking events.
- Moderates posted job listings and approved achievements.
