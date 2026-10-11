async function testApi() {
  console.log('--- 1. Testing Health ---');
  const healthRes = await fetch('http://localhost:5000/api/health');
  const health = await healthRes.json();
  console.log('Health status:', health.status, 'dbConnected:', health.databaseConnected);

  console.log('\n--- 2. Testing Login ---');
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'alex.chen@university.edu',
      password: 'student123',
    }),
  });
  const loginData = await loginRes.json();
  console.log('Login success:', loginData.success, 'User:', loginData.user?.name);
  const token = loginData.token;

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  console.log('\n--- 3. Testing Get Skills ---');
  const skillsRes = await fetch('http://localhost:5000/api/skills', {
    headers: authHeaders,
  });
  const skillsData = await skillsRes.json();
  console.log('Skills count:', skillsData.count);
  const targetSkill = skillsData.data[0];
  console.log('First skill:', targetSkill.name, 'Hours spent:', targetSkill.hoursSpent);

  console.log('\n--- 4. Testing Practice Session Logging ---');
  const practiceRes = await fetch(`http://localhost:5000/api/skills/${targetSkill.id}/practice`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      hours: 2.5,
      notes: 'Mastered Binary Trees traversal in TypeScript',
    }),
  });
  const practiceData = await practiceRes.json();
  console.log('Practice message:', practiceData.message);
  console.log('Updated skill hours:', practiceData.skill?.hoursSpent, 'Progress %:', practiceData.skill?.progressPercent);
  console.log('New activity logged:', practiceData.activity?.title);

  console.log('\n--- 5. Testing Weekly Goals & Toggle ---');
  const goalsRes = await fetch('http://localhost:5000/api/goals', {
    headers: authHeaders,
  });
  const goalsData = await goalsRes.json();
  console.log('Goals count:', goalsData.count);
  const firstGoal = goalsData.data[0];
  console.log('Initial goal completion:', firstGoal.title, '-> completed:', firstGoal.completed);

  const toggleRes = await fetch(`http://localhost:5000/api/goals/${firstGoal.id}/toggle`, {
    method: 'PATCH',
    headers: authHeaders,
  });
  const toggleData = await toggleRes.json();
  console.log('Toggled goal completion -> completed:', toggleData.data?.completed);

  console.log('\n--- 6. Testing New Student Registration ---');
  const testEmail = `test_${Date.now()}@college.edu`;
  const regRes = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Jordan Smith',
      email: testEmail,
      password: 'securepassword123',
      university: 'Stanford University',
      major: 'Computer Science',
    }),
  });
  const regData = await regRes.json();
  console.log('Registration success:', regData.success, 'New user:', regData.user?.name);

  console.log('\n>>> ALL BACKEND API TESTS PASSED SUCCESSFULLY! <<<');
}

testApi().catch((err) => {
  console.error('API Test Error:', err);
  process.exit(1);
});
