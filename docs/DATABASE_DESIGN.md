# Database Design & Relational Schema

## 1. Relational Integrity & Entity Relationship Model

The portal utilizes a normalized **Third Normal Form (3NF)** relational database schema.

```text
       ┌───────────────┐
       │   students    │
       │ (College DB)  │
       └───────┬───────┘
               │ 1:1 (Unique Foreign Key)
               ▼
       ┌───────────────┐                 1:N           ┌─────────────────────────┐
       │    alumni     ├──────────────────────────────►│ profile_change_requests │
       └───────┬───────┘                               └─────────────────────────┘
               │
               │ 1:N
               ├──────────────────────────────► [jobs]
               ├──────────────────────────────► [achievements]
               ├──────────────────────────────► [mentorship_requests]
               └──────────────────────────────► [connections (Mutual Vault)]
```

---

## 2. Table Dictionaries & Field Specifications

### 2.1 Table: `students` (College Registrar Registry)
Primary authority for academic convocation records.

| Field | Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(64) | PRIMARY KEY | Unique student identifier (`std-001`) |
| `enrollment_no` | VARCHAR(32) | UNIQUE, NOT NULL | College enrollment number (`SIT2027CSE001`) |
| `name` | VARCHAR(128) | NOT NULL | Full official student name |
| `branch` | VARCHAR(64) | NOT NULL | Academic department (CSE, ECE, ME, etc.) |
| `degree` | VARCHAR(32) | NOT NULL | Degree program (B.Tech, M.Tech, MCA, etc.) |
| `graduation_year`| INTEGER | NOT NULL | Year of convocation |
| `cgpa` | NUMERIC(4,2)| NOT NULL | Cumulative Grade Point Average |
| `graduation_status`| VARCHAR(32)| DEFAULT 'COMPLETE'| Status: `COMPLETE`, `IN_PROGRESS`, `BACKLOG_PENDING` |
| `is_alumni_activated`| BOOLEAN | DEFAULT FALSE | Flag indicating if alumni profile has been minted |
| `alumni_id` | VARCHAR(64) | NULLABLE | Foreign key to `alumni.id` upon activation |

### 2.2 Table: `alumni` (Verified Alumni Records)
Preserves immutable academic roots and tracks dynamic professional progression.

| Field | Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(64) | PRIMARY KEY | Unique alumni identifier (`alm-101`) |
| `user_id` | VARCHAR(64) | FK -> users(id) | Linked authentication account |
| `student_id` | VARCHAR(64) | UNIQUE, FK -> students(id) | Strict 1:1 anchor to academic registry |
| `enrollment_no` | VARCHAR(32) | NOT NULL | Auto-populated verified enrollment |
| `current_company`| VARCHAR(128)| NULLABLE | Current workplace organization |
| `job_role` | VARCHAR(128)| NULLABLE | Current professional designation |
| `experience_years`| INTEGER | DEFAULT 0 | Total years of industry experience |
| `verification_status`| VARCHAR(32)| DEFAULT 'APPROVED' | `APPROVED`, `PENDING`, `REJECTED` |
| `is_available_for_mentorship`| BOOLEAN | DEFAULT FALSE | Mentorship availability switch |
| `mentorship_areas`| TEXT[] | DEFAULT '{}' | Skills offered for coaching |

### 2.3 Table: `profile_change_requests` (Audit Log)
Guarantees institutional trust by auditing career promotions and role changes.

| Field | Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(64) | PRIMARY KEY | Change request identifier (`pcr-001`) |
| `alumni_id` | VARCHAR(64) | FK -> alumni(id) | Targeted alumni record |
| `current_company`| VARCHAR(128)| | Existing verified company |
| `proposed_company`| VARCHAR(128)| | Newly proposed company |
| `current_job_role`| VARCHAR(128)| | Existing verified role |
| `proposed_job_role`| VARCHAR(128)| | Newly proposed designation |
| `status` | VARCHAR(32) | DEFAULT 'PENDING' | `PENDING`, `APPROVED`, `REJECTED` |
| `admin_remarks` | TEXT | NULLABLE | Dean / Officer feedback remarks |
| `reviewed_by` | VARCHAR(128)| NULLABLE | Name of reviewing administrator |

### 2.4 Table: `connections` (Mutual Privacy Shield)
Prevents unsolicited contact harvesting by requiring mutual approval before phone numbers and personal emails are disclosed.

| Field | Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(64) | PRIMARY KEY | Connection identifier |
| `sender_id` | VARCHAR(64) | NOT NULL | Initiator user ID |
| `receiver_id` | VARCHAR(64) | NOT NULL | Recipient user ID |
| `status` | VARCHAR(32) | DEFAULT 'PENDING' | `PENDING`, `ACCEPTED`, `REJECTED` |
| `sender_shared_details`| JSONB | | Explicitly granted contact details |
| `receiver_shared_details`| JSONB | | Explicitly granted contact details |
| `private_messages`| JSONB | DEFAULT '[]' | Direct mutual communication history |

---

## 3. Database Indexes & Query Optimization

```sql
-- Indexes for low-latency directory lookups and search
CREATE INDEX idx_students_enrollment ON students(enrollment_no);
CREATE INDEX idx_alumni_branch ON alumni(branch);
CREATE INDEX idx_alumni_company ON alumni(current_company);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_connections_users ON connections(sender_id, receiver_id);
```
