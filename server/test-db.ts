import { pool, db } from '../src/db/index.ts';
import * as schema from '../src/db/schema.ts';

async function testDatabase() {
  console.log('----------------------------------------------------');
  console.log(' Alumni Connect Portal - Live Database Connection Test');
  console.log('----------------------------------------------------');

  const connectionString = process.env.DATABASE_URL;
  const host = process.env.SQL_HOST;

  if (!connectionString && !host) {
    console.log('ℹ️  No DATABASE_URL or SQL_HOST detected in environment.');
    console.log('ℹ️  The application is operating with high-performance in-memory relational seed data.');
    console.log('ℹ️  To connect to a live Supabase / PostgreSQL database, set DATABASE_URL in your .env file.');
    console.log('----------------------------------------------------');
    process.exit(0);
  }

  console.log(`🔌 Attempting connection to: ${connectionString ? 'DATABASE_URL (Remote / Cloud)' : host}...`);

  try {
    const client = await pool.connect();
    console.log('✅ Successfully established connection to PostgreSQL server!');

    const res = await client.query('SELECT NOW() as current_time, version() as pg_version;');
    console.log(`🕒 Server Time: ${res.rows[0].current_time}`);
    console.log(`📦 Engine: ${res.rows[0].pg_version.split(',')[0]}`);

    // Check table counts
    try {
      const studentCount = await db.select().from(schema.students);
      const alumniCount = await db.select().from(schema.alumni);
      const userCount = await db.select().from(schema.users);
      console.log(`📊 Current Live Data:`);
      console.log(`   - Students: ${studentCount.length}`);
      console.log(`   - Alumni:   ${alumniCount.length}`);
      console.log(`   - Users:    ${userCount.length}`);
    } catch (tblErr: any) {
      console.log(`⚠️  Tables not yet initialized: ${tblErr.message}`);
      console.log(`👉 Run the script in database/setup-live-db.sql on your PostgreSQL / Supabase SQL editor.`);
    }

    client.release();
    console.log('----------------------------------------------------');
    console.log('🎉 Live database test PASSED!');
    console.log('----------------------------------------------------');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Failed to connect to live database:');
    console.error(`   ${error.message}`);
    console.log('👉 Please check your credentials in .env and verify IP allowlist / SSL settings.');
    console.log('----------------------------------------------------');
    process.exit(1);
  }
}

testDatabase();
