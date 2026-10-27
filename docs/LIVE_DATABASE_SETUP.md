# Live Database Setup Guide - Supabase & PostgreSQL

The College Alumni Connect Portal supports both **Live Cloud PostgreSQL** (Supabase, Neon, Cloud SQL) and an automatic high-speed **in-memory relational fallback**.

---

## Option 1: Supabase (Recommended - Free in 2 Minutes)

Supabase provides a free, production-ready PostgreSQL instance with an online SQL editor.

### Step 1: Create a Free Project
1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New Project** and choose a name (e.g. `alumni-connect-db`).
3. Set a strong database password.

### Step 2: Run the Schema Setup Script
1. In the Supabase sidebar, click **SQL Editor**.
2. Click **New query**.
3. Open the file `database/setup-live-db.sql` from this repository.
4. Copy the entire contents, paste it into the Supabase SQL Editor, and click **Run**.
5. All 10 relational tables, indexes, and initial constraints will be created instantly.

### Step 3: Copy Your Connection String
1. In Supabase, go to **Project Settings** -> **Database**.
2. Scroll to **Connection string** and select **URI** (or **NodeJS**).
3. Copy the URI. It will look like:
   ```text
   postgresql://postgres.[PROJECT_REF]:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
   ```
4. Replace `[YOUR-PASSWORD]` with your actual project database password.

### Step 4: Configure `.env`
In the root directory of your project, create or edit `.env`:
```bash
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"
DB_SSL="true"
```

### Step 5: Test Connection
Run the diagnostic script:
```bash
npm run test:db
```
You should see:
```text
✅ Successfully established connection to PostgreSQL server!
📊 Current Live Data:
   - Students: 5
   - Alumni:   10
   - Users:    15
🎉 Live database test PASSED!
```

---

## Option 2: Neon PostgreSQL Serverless

1. Sign up at [neon.tech](https://neon.tech).
2. Create a project and copy the connection string.
3. Paste the connection string into `.env`:
   ```bash
   DATABASE_URL="postgresql://username:password@ep-cool-cloud.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```
4. Run `npm run test:db`.

---

## Option 3: Local PostgreSQL (pgAdmin / Docker)

If you are running PostgreSQL on your local machine:
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/alumni_connect_db"
DB_SSL="false"
```
Execute the commands in `database/setup-live-db.sql` via `psql` or pgAdmin Query Tool.

---

## Zero-Config Fallback Mode
If no `DATABASE_URL` is configured in `.env`, the portal starts in **offline in-memory mode** using pre-seeded, verified college data. This ensures the project runs out of the box when cloned without crashing.
