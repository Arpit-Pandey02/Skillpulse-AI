import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const API_BASE = 'http://localhost:5000/api';

async function verify() {
  console.log('====================================================');
  console.log('SKILLPULSE AI — MONGODB ATLAS CONNECTION AUDIT');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  // 1. Backend Health Check
  console.log('1. Checking Backend Health Endpoint (/api/health)...');
  const healthRes = await fetch(`${API_BASE}/health`);
  const healthData = await healthRes.json();
  assert(healthRes.status === 200, 'Health check returns HTTP 200');
  assert(healthData.databaseConnected === true, 'databaseConnected flag is TRUE (not falling back to in-memory)');
  assert(healthData.status === 'ok', 'Server status is "ok"');

  // 2. Direct Mongoose Client Verification
  console.log('\n2. Verifying Direct MongoDB Atlas Connection...');
  const uri = process.env.MONGODB_URI;
  assert(Boolean(uri), 'MONGODB_URI is configured in server/.env');
  assert(uri.startsWith('mongodb+srv://') || uri.startsWith('mongodb://'), 'Valid MongoDB connection scheme detected');

  const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  assert(conn.connection.readyState === 1, 'Mongoose readyState is 1 (Connected)');
  console.log(`  Connected Host: ${conn.connection.host}`);
  console.log(`  Database Name: ${conn.connection.name}`);

  // 3. Database Ping & Collections Check
  console.log('\n3. Verifying Database Responsiveness & Collections...');
  const adminDb = conn.connection.db.admin();
  const pingResult = await adminDb.ping();
  assert(pingResult && pingResult.ok === 1, 'MongoDB Atlas admin ping succeeded (ok: 1)');

  const collections = await conn.connection.db.listCollections().toArray();
  const collectionNames = collections.map(c => c.name);
  console.log(`  Active Atlas Collections: [${collectionNames.join(', ')}]`);

  // 4. Persistence Layer Live Verification (Writing & Reading to Atlas)
  console.log('\n4. Verifying Real Database Persistence (Not In-Memory)...');
  const testEmail = `atlas_verify_${Date.now()}@university.edu`;
  
  // Register via live API
  const regRes = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Atlas Verification Student',
      email: testEmail,
      password: 'TestPassword123!',
      university: 'State University',
      major: 'Computer Science',
      academicYear: 'Sophomore',
    }),
  });
  const regData = await regRes.json();
  assert(regRes.status === 201, 'Student registered successfully via API');

  // Query directly from Atlas collection to prove it was written to MongoDB, NOT in-memory store
  const userInAtlas = await conn.connection.db.collection('users').findOne({ email: testEmail });
  assert(Boolean(userInAtlas), 'User document verified directly inside MongoDB Atlas "users" collection');
  assert(userInAtlas.name === 'Atlas Verification Student', 'Atlas document matches API payload');
  assert(Boolean(userInAtlas.passwordHash), 'Password was hashed and stored securely in Atlas');

  // Clean up test document
  await conn.connection.db.collection('users').deleteOne({ email: testEmail });
  console.log('  Cleaned up verification test document from Atlas.');

  await mongoose.disconnect();

  console.log('\n====================================================');
  console.log(`ALL ${passed}/${total} MONGODB ATLAS VERIFICATION CHECKS PASSED!`);
  console.log('====================================================\n');
}

verify().catch((err) => {
  const safeMsg = (err.message || String(err)).replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
  console.error('\nVERIFICATION FAILED:', safeMsg);
  process.exit(1);
});
