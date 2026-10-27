# REST API Documentation - College Alumni Connect Portal

Base URL: `http://localhost:3000/api`

---

## 1. Authentication & Session

### `POST /api/auth/login`
Authenticates a user and issues their profile and session token.
- **Request Body**:
  ```json
  {
    "email": "rahul.sharma@college.edu",
    "password": "student123"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "token": "usr-std-001",
    "user": {
      "id": "usr-std-001",
      "email": "rahul.sharma@college.edu",
      "role": "STUDENT",
      "name": "Rahul Sharma",
      "studentId": "std-001"
    },
    "student": {
      "id": "std-001",
      "enrollmentNo": "SIT2027CSE001",
      "graduationStatus": "COMPLETE"
    }
  }
  ```

### `GET /api/auth/me`
Retrieves current authenticated user's session and linked student/alumni records.
- **Headers**: `Authorization: Bearer <token>` or `x-user-id: <id>`

---

## 2. Convocation Eligibility & Alumni Activation

### `GET /api/college/check-eligibility/:enrollmentNo`
Verifies whether a student has completed graduation requirements for alumni onboarding.
- **Example**: `/api/college/check-eligibility/SIT2027CSE001`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "eligible": true,
    "graduationStatus": "COMPLETE",
    "student": {
      "id": "std-001",
      "enrollmentNo": "SIT2027CSE001",
      "name": "Rahul Sharma",
      "branch": "Computer Science & Engineering",
      "degree": "B.Tech",
      "graduationYear": 2027,
      "cgpa": 9.15
    }
  }
  ```

### `POST /api/alumni/activate`
Activates an official alumni profile for an eligible student.
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "studentId": "std-001",
    "currentCompany": "Microsoft",
    "jobRole": "Software Engineer",
    "industry": "Cloud Computing",
    "experienceYears": 1,
    "city": "Bengaluru",
    "skills": ["TypeScript", "Distributed Systems", "React"],
    "isAvailableForMentorship": true,
    "mentorshipAreas": ["System Design", "Campus Placement Prep"]
  }
  ```

---

## 3. Alumni Directory & Profile Updates

### `GET /api/alumni`
Returns paginated/filtered list of verified alumni.
- **Query Parameters**:
  - `q`: Search keyword (name, company, skills)
  - `branch`: Filter by department (e.g. `Computer Science & Engineering`)
  - `graduationYear`: Filter by batch year (e.g. `2024`)
  - `company`: Filter by employer
  - `mentorshipOnly`: `true` or `false`

### `GET /api/alumni/:id`
Retrieves full profile details, contact information, and achievements.

### `PUT /api/alumni/:id/update-request`
Submits an update. Sensitive fields (Company/Role) are automatically routed to the Admin Verification queue.

---

## 4. Networking & Privacy Shield

### `GET /api/connections`
Retrieves active and pending connection requests for the authenticated user.

### `POST /api/connections`
Sends a professional connection request with optional introductory note.

### `PUT /api/connections/:id`
Accepts (`ACCEPTED`) or declines (`REJECTED`) an invite.

### `POST /api/connections/:id/messages`
Exchanges encrypted notes inside the mutual connection vault once connected.

---

## 5. Mentorship & Careers

### `GET /api/mentorship/mentors`
Lists alumni available for 1-on-1 mentorship.

### `POST /api/mentorship/requests`
Student submits a mentorship request with topic and personalized message.

### `GET /api/jobs`
Lists verified jobs and internship opportunities posted by alumni and college administration.

### `POST /api/jobs`
Alumni or administrators post new opportunities.

---

## 6. Institutional Admin Console

### `GET /api/admin/metrics`
Institutional analytics: total alumni, verification counts, mentorship engagements.

### `GET /api/admin/verifications`
Lists pending profile update requests.

### `PUT /api/admin/verifications/:id`
Approves (`APPROVED`) or rejects (`REJECTED`) a career change request with official remarks.
