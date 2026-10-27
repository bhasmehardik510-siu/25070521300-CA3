/**
 * MongoDB Atlas & Local Connection Test Utility
 * 
 * Usage:
 *   npm run test:mongo
 * or
 *   MONGODB_URI="mongodb+srv://user:pass@cluster0.mongodb.net/alumni_portal" npm run test:mongo
 */

import mongoose from 'mongoose';
import {
  mongoManager,
  MongoStudent,
  MongoAlumni,
  MongoUser,
  MongoJob,
  MongoEvent,
  MongoAchievement,
  MongoProfileChange,
  MongoConnection,
  MongoMentorship,
} from './mongodb.ts';

async function testMongo() {
  console.log('================================================================');
  console.log('   ALUMNI CONNECT PORTAL - MONGODB COMPASS DIAGNOSTIC TOOL      ');
  console.log('================================================================\n');

  const uri = process.env.MONGODB_URI || process.env.MONGO_URL;
  if (uri) {
    const maskedUri = uri.replace(/:([^@]+)@/, ':****@');
    console.log(`📡 Connecting to user configured MongoDB URI: ${maskedUri}...`);
  } else {
    console.log('ℹ️  No remote MONGODB_URI set in .env. Initializing port 27017 for MongoDB Compass...');
  }

  const success = await mongoManager.connect();
  if (!success) {
    console.error('❌ MongoDB Connection failed.');
    process.exit(1);
  }

  console.log('✅ Connected to MongoDB successfully via Mongoose!\n');

  try {
    const studentCount = await MongoStudent.countDocuments();
    const alumniCount = await MongoAlumni.countDocuments();
    const userCount = await MongoUser.countDocuments();
    const jobCount = await MongoJob.countDocuments();
    const eventCount = await MongoEvent.countDocuments();
    const achCount = await MongoAchievement.countDocuments();
    const pcCount = await MongoProfileChange.countDocuments();
    const connCount = await MongoConnection.countDocuments();
    const mentorCount = await MongoMentorship.countDocuments();

    console.log('📊 Active MongoDB Collections in "alumni_connect":');
    console.log(` - users:                 ${userCount} documents (Auth Credentials)`);
    console.log(` - students:              ${studentCount} documents`);
    console.log(` - alumni:                ${alumniCount} documents`);
    console.log(` - jobs:                  ${jobCount} documents`);
    console.log(` - events:                ${eventCount} documents`);
    console.log(` - achievements:          ${achCount} documents`);
    console.log(` - profilechangerequests: ${pcCount} documents`);
    console.log(` - connections:           ${connCount} documents`);
    console.log(` - mentorshiprequests:    ${mentorCount} documents`);

    console.log('\n================================================================');
    console.log('🎉 MongoDB test PASSED! Open MongoDB Compass and connect to:');
    console.log('   mongodb://127.0.0.1:27017/alumni_connect');
    console.log('================================================================');
    process.exit(0);
  } catch (err: any) {
    console.error('Error querying MongoDB collections:', err.message);
    process.exit(1);
  }
}

testMongo();
