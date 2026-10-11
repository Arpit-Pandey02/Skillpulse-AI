// test-e2e.js - End-to-end Full Stack User Lifecycle & Data Persistence Test
const BASE_URL = 'http://localhost:5000/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  return { status: res.status, data: await res.json() };
}

async function runE2ETests() {
  console.log('=== STARTING END-TO-END DATA PERSISTENCE VERIFICATION ===\n');

  // 1. Health Check
  console.log('Step 1: Checking Backend Health...');
  const health = await request('/health');
  if (health.status !== 200) throw new Error('Health check failed');
  console.log('✓ Backend Health OK:', health.data);

  // 2. User Registration (New Student)
  const uniqueId = Date.now();
  const studentEmail = `student_${uniqueId}@cs.university.edu`;
  console.log(`\nStep 2: Registering New Student (${studentEmail})...`);
  const regRes = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Maya Lin',
      email: studentEmail,
      password: 'password123',
      university: 'UC Berkeley',
      major: 'EECS',
      academicYear: 'Junior',
    }),
  });
  if (regRes.status !== 201 || !regRes.data.token) {
    throw new Error(`Registration failed: ${JSON.stringify(regRes.data)}`);
  }
  const token = regRes.data.token;
  console.log('✓ Registered successfully! Student token received.');
  console.log('  Student Profile:', regRes.data.user.name, '|', regRes.data.user.university);

  const authHeaders = { Authorization: `Bearer ${token}` };

  // 3. Verify Default Seeded Skills For New Student
  console.log('\nStep 3: Checking Auto-Seeded Skills for New Student...');
  const skillsRes = await request('/skills', { headers: authHeaders });
  if (skillsRes.status !== 200 || !Array.isArray(skillsRes.data.data)) {
    throw new Error('Failed to retrieve skills');
  }
  const initialSkillsCount = skillsRes.data.data.length;
  console.log(`✓ New student seeded with ${initialSkillsCount} default skills.`);

  // 4. Create a New Custom Skill
  console.log('\nStep 4: Adding New Custom Skill ("Distributed Systems & Raft")...');
  const newSkillRes = await request('/skills', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      name: 'Distributed Systems & Raft',
      category: 'Computer Science Core',
      level: 'Intermediate',
      targetHours: 60,
      tags: ['Consensus', 'RPC', 'Fault Tolerance'],
      color: '#8B5CF6',
    }),
  });
  if (newSkillRes.status !== 201 || !newSkillRes.data.data) {
    throw new Error(`Failed to create skill: ${JSON.stringify(newSkillRes.data)}`);
  }
  const createdSkill = newSkillRes.data.data;
  console.log('✓ Custom skill persisted successfully! ID:', createdSkill.id);

  // 5. Verify Skill Count Incremented
  const updatedSkillsRes = await request('/skills', { headers: authHeaders });
  if (updatedSkillsRes.data.data.length !== initialSkillsCount + 1) {
    throw new Error('Skill count did not increment after creation!');
  }
  console.log(`✓ Skill list confirmed updated: ${updatedSkillsRes.data.data.length} skills.`);

  // 6. Log Deliberate Practice Session on the New Skill
  console.log('\nStep 6: Logging 4.5 Hours Deliberate Practice on Custom Skill...');
  const practiceRes = await request(`/skills/${createdSkill.id}/practice`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      hours: 4.5,
      notes: 'Implemented leader election and heartbeat RPCs in Go',
    }),
  });
  if (practiceRes.status !== 200 || !practiceRes.data.skill) {
    throw new Error(`Failed to log practice session: ${JSON.stringify(practiceRes.data)}`);
  }
  console.log('✓ Practice session recorded!');
  console.log(`  Updated Hours: ${practiceRes.data.skill.hoursSpent}h / ${practiceRes.data.skill.targetHours}h`);
  console.log(`  Updated Mastery: ${practiceRes.data.skill.progressPercent}%`);

  // 7. Verify Activity Stream
  console.log('\nStep 7: Verifying Chronological Activity Feed...');
  const activitiesRes = await request('/activities', { headers: authHeaders });
  if (activitiesRes.status !== 200 || activitiesRes.data.data.length === 0) {
    throw new Error('Activity feed empty or failed to retrieve');
  }
  const latestActivity = activitiesRes.data.data[0];
  console.log('✓ Activity feed verified!');
  console.log(`  Latest Activity: "${latestActivity.title}" (+${latestActivity.xpEarned} XP)`);
  console.log(`  Description: "${latestActivity.description}"`);

  // 8. Add and Toggle Weekly Goal
  console.log('\nStep 8: Testing Goal Creation & Completion Toggle...');
  const newGoalRes = await request('/goals', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      title: 'Pass Raft leader election test suite',
      category: 'Computer Science Core',
      dueDate: 'Friday',
      priority: 'High',
      hoursEstimate: 5,
    }),
  });
  if (newGoalRes.status !== 201 || !newGoalRes.data.data) {
    throw new Error(`Failed to create goal: ${JSON.stringify(newGoalRes.data)}`);
  }
  const createdGoal = newGoalRes.data.data;
  console.log(`✓ Goal created: "${createdGoal.title}" (completed: ${createdGoal.completed})`);

  // Toggle Goal
  const toggleRes = await request(`/goals/${createdGoal.id}/toggle`, {
    method: 'PATCH',
    headers: authHeaders,
  });
  if (toggleRes.status !== 200 || !toggleRes.data.data.completed) {
    throw new Error('Goal toggle failed or completion status did not toggle to true');
  }
  console.log(`✓ Goal toggle verified: completed status is now ${toggleRes.data.data.completed}!`);

  // 9. Hard Session Re-fetch (Simulating Browser Refresh / Reload)
  console.log('\nStep 9: Simulating Browser Refresh (Re-fetching session data with JWT)...');
  const refreshUser = await request('/auth/me', { headers: authHeaders });
  const refreshSkills = await request('/skills', { headers: authHeaders });
  const refreshGoals = await request('/goals', { headers: authHeaders });
  const refreshActivities = await request('/activities', { headers: authHeaders });

  const persistedSkill = refreshSkills.data.data.find(s => s.id === createdSkill.id);
  const persistedGoal = refreshGoals.data.data.find(g => g.id === createdGoal.id);

  if (!persistedSkill || persistedSkill.hoursSpent !== 4.5) {
    throw new Error('Data persistence check failed: skill hours did not persist!');
  }
  if (!persistedGoal || !persistedGoal.completed) {
    throw new Error('Data persistence check failed: goal completed status did not persist!');
  }

  console.log('✓ PERSISTENCE AUDIT CONFIRMED:');
  console.log(`  - Student: ${refreshUser.data.user.name} (${refreshUser.data.user.email})`);
  console.log(`  - Persisted Skills: ${refreshSkills.data.data.length}`);
  console.log(`  - Custom Skill Hours: ${persistedSkill.hoursSpent}h (Mastery: ${persistedSkill.progressPercent}%)`);
  console.log(`  - Goal "${persistedGoal.title}" completed: ${persistedGoal.completed}`);
  console.log(`  - Activity Stream items: ${refreshActivities.data.data.length}`);

  console.log('\n======================================================');
  console.log('>>> ALL END-TO-END PERSISTENCE TESTS PASSED 100%! <<<');
  console.log('======================================================\n');
}

runE2ETests().catch(err => {
  console.error('\n❌ E2E TEST FAILED:', err);
  process.exit(1);
});
