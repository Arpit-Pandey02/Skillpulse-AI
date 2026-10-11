/**
 * Regression Test Suite for:
 * Bug 1: Unwanted pre-filled data after refresh (new student clean state, persistence of user selections, demo isolation)
 * Bug 2: Career search bar (case-insensitive, whitespace trimming, keyword search across fields, domain filtering, no-match, clear)
 */

const API_BASE = 'http://localhost:5000/api';

async function req(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

async function runTests() {
  console.log('====================================================');
  console.log('RUNNING SKILLPULSE AI BUG FIX REGRESSION AUDIT');
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

  // -------------------------------------------------------------------------
  // TEST GROUP 1: Career Search & Domain Filtering (Bug 2)
  // -------------------------------------------------------------------------
  console.log('--- TEST GROUP 1: Career Search & Filtering (Bug 2) ---');

  // 1.1 All Domains returns all 8 catalog careers
  const resAllDomains = await req('/careers?domain=All%20Domains');
  assert(resAllDomains.status === 200, 'GET /careers?domain=All Domains returns 200');
  assert(resAllDomains.data.count === 8, `GET /careers?domain=All Domains returns all 8 careers (got ${resAllDomains.data.count})`);

  // 1.2 "All" returns all 8 catalog careers
  const resAll = await req('/careers?domain=All');
  assert(resAll.data.count === 8, `GET /careers?domain=All returns all 8 careers (got ${resAll.data.count})`);

  // 1.3 Empty search returns all 8 catalog careers
  const resEmptySearch = await req('/careers?search=');
  assert(resEmptySearch.data.count === 8, `GET /careers?search= returns all 8 careers (got ${resEmptySearch.data.count})`);

  // 1.4 Whitespace search returns all 8 catalog careers
  const resWhitespaceSearch = await req('/careers?search=%20%20%20');
  assert(resWhitespaceSearch.data.count === 8, `GET /careers?search=   returns all 8 careers (got ${resWhitespaceSearch.data.count})`);

  // 1.5 Title match (case-insensitive + leading/trailing space)
  const resSearchSwe = await req('/careers?search=%20Software%20Engineer%20');
  assert(resSearchSwe.data.count >= 1, `Search " Software Engineer " finds role (got ${resSearchSwe.data.count})`);
  assert(resSearchSwe.data.data.some(c => c.careerId === 'full-stack-software-engineer'), 'Includes full-stack-software-engineer');

  // 1.6 Keyword match across description / activities / transferable subjects (e.g. "python")
  const resSearchPython = await req('/careers?search=python');
  assert(resSearchPython.data.count >= 1, `Search "python" finds Data Scientist role (got ${resSearchPython.data.count})`);
  assert(resSearchPython.data.data[0].careerId === 'data-scientist', 'Matches Data Scientist & Quantitative Analyst');

  // 1.7 Non-tech domain search (e.g. "psychologist", "clinical")
  const resSearchPsych = await req('/careers?search=psychologist');
  assert(resSearchPsych.data.count === 1, `Search "psychologist" finds Clinical Psychologist (got ${resSearchPsych.data.count})`);
  assert(resSearchPsych.data.data[0].careerId === 'clinical-psychologist', 'Correct career ID clinical-psychologist');

  // 1.8 Keyword in environment / key activities (e.g. "hospital", "robotics")
  const resSearchHospital = await req('/careers?search=hospital');
  assert(resSearchHospital.data.count >= 1, `Search "hospital" matches relevant healthcare careers (got ${resSearchHospital.data.count})`);

  const resSearchRobotics = await req('/careers?search=robotics');
  assert(resSearchRobotics.data.count === 1, `Search "robotics" matches Robotics & Embedded Systems Engineer (got ${resSearchRobotics.data.count})`);

  // 1.9 Domain specific filter (e.g. Healthcare & Life Sciences)
  const resHealthcare = await req('/careers?domain=Healthcare%20%26%20Life%20Sciences');
  assert(resHealthcare.data.count === 1, `Domain "Healthcare & Life Sciences" returns 1 career (got ${resHealthcare.data.count})`);
  assert(resHealthcare.data.data[0].careerId === 'clinical-psychologist', 'Returns Clinical Psychologist');

  // 1.10 No match search query
  const resNoMatch = await req('/careers?search=nonexistent_xyz_query_99999');
  assert(resNoMatch.status === 200, 'Search for non-existent term returns 200 OK');
  assert(resNoMatch.data.count === 0, `Returns count 0 for no matches (got ${resNoMatch.data.count})`);
  assert(Array.isArray(resNoMatch.data.data) && resNoMatch.data.data.length === 0, 'data is empty array');

  console.log('\n--- TEST GROUP 2: Unwanted Pre-filled Data & Clean State (Bug 1) ---');

  // 2.1 Register a brand-new student
  const freshEmail = `test_student_${Date.now()}@university.edu`;
  const registerRes = await req('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Priya Sharma',
      email: freshEmail,
      password: 'SecurePassword123!',
      university: 'State University',
      major: 'Undeclared',
      academicYear: 'Freshman',
    }),
  });

  assert(registerRes.status === 201, 'POST /auth/register returns 201 Created');
  assert(registerRes.data.token, 'Returns JWT token for fresh user');
  const freshToken = registerRes.data.token;
  const authHeaders = { Authorization: `Bearer ${freshToken}` };

  // 2.2 Verify fresh student has ZERO pre-filled skills
  const freshSkillsRes = await req('/skills', { headers: authHeaders });
  assert(freshSkillsRes.status === 200, 'GET /skills returns 200');
  assert(Array.isArray(freshSkillsRes.data.data), 'Skills data is an array');
  assert(freshSkillsRes.data.data.length === 0, `Fresh student has 0 pre-filled skills (got ${freshSkillsRes.data.data.length})`);

  // 2.3 Verify fresh student has ZERO pre-filled goals
  const freshGoalsRes = await req('/goals', { headers: authHeaders });
  assert(freshGoalsRes.status === 200, 'GET /goals returns 200');
  assert(Array.isArray(freshGoalsRes.data.data), 'Goals data is an array');
  assert(freshGoalsRes.data.data.length === 0, `Fresh student has 0 pre-filled goals (got ${freshGoalsRes.data.data.length})`);

  // 2.4 Verify fresh student has ZERO pre-filled activities
  const freshActivitiesRes = await req('/activities', { headers: authHeaders });
  assert(freshActivitiesRes.status === 200, 'GET /activities returns 200');
  assert(Array.isArray(freshActivitiesRes.data.data), 'Activities data is an array');
  assert(freshActivitiesRes.data.data.length === 0, `Fresh student has 0 pre-filled activities (got ${freshActivitiesRes.data.data.length})`);

  // 2.5 Verify fresh student career discovery status is clean
  const freshStatusRes = await req('/careers/user-status', { headers: authHeaders });
  assert(freshStatusRes.status === 200, 'GET /careers/user-status returns 200');
  assert(freshStatusRes.data.careerStatus === 'undecided', `Fresh student careerStatus is 'undecided' (got ${freshStatusRes.data.careerStatus})`);
  assert(freshStatusRes.data.selectedCareerId === null, 'selectedCareerId is null');
  assert(Array.isArray(freshStatusRes.data.savedCareerIds) && freshStatusRes.data.savedCareerIds.length === 0, 'savedCareerIds (shortlist) is empty []');
  assert(Object.keys(freshStatusRes.data.careerFeedback || {}).length === 0, 'careerFeedback is empty {}');
  assert(Object.keys(freshStatusRes.data.discoveryResponses || {}).length === 0, 'discoveryResponses is empty {}');
  assert(freshStatusRes.data.onboardingCompleted === false, 'onboardingCompleted is false');

  console.log('\n--- TEST GROUP 3: Persistence Across Sessions / Refreshes ---');

  // 3.1 Student explicitly saves selections: adds 1 skill, 1 goal, and shortlists 1 career
  const addSkillRes = await req('/skills', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      name: 'Python Data Structures',
      category: 'Computer Science Core',
      targetHours: 30,
      tags: ['Algorithms', 'Python'],
    }),
  });
  assert(addSkillRes.status === 201, 'Student successfully adds 1 skill');

  const addGoalRes = await req('/goals', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      title: 'Complete 3 Binary Search practice problems',
      category: 'Computer Science Core',
      dueDate: 'This Week',
      priority: 'High',
      hoursEstimate: 4,
    }),
  });
  assert(addGoalRes.status === 201, 'Student successfully adds 1 goal');

  const shortlistRes = await req('/careers/feedback', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      careerId: 'data-scientist',
      status: 'shortlisted',
    }),
  });
  assert(shortlistRes.status === 200, 'Student shortlists Data Scientist role');

  // 3.2 Simulate page refresh / new session: re-authenticate and fetch saved state
  console.log('Simulating session reload / page refresh...');
  const reloadLogin = await req('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: freshEmail,
      password: 'SecurePassword123!',
    }),
  });
  assert(reloadLogin.status === 200, 'Re-login successful after refresh');
  const reloadHeaders = { Authorization: `Bearer ${reloadLogin.data.token}` };

  // 3.3 Verify saved selections restore accurately upon refresh
  const reloadedSkills = await req('/skills', { headers: reloadHeaders });
  assert(reloadedSkills.data.data.length === 1, `Restores exactly 1 saved skill on refresh (got ${reloadedSkills.data.data.length})`);
  assert(reloadedSkills.data.data[0].name === 'Python Data Structures', 'Restores correct skill name');

  const reloadedGoals = await req('/goals', { headers: reloadHeaders });
  assert(reloadedGoals.data.data.length === 1, `Restores exactly 1 saved goal on refresh (got ${reloadedGoals.data.data.length})`);
  assert(reloadedGoals.data.data[0].title === 'Complete 3 Binary Search practice problems', 'Restores correct goal title');

  const reloadedStatus = await req('/careers/user-status', { headers: reloadHeaders });
  assert(reloadedStatus.data.savedCareerIds.length === 1, `Restores exactly 1 shortlisted career (got ${reloadedStatus.data.savedCareerIds.length})`);
  assert(reloadedStatus.data.savedCareerIds[0] === 'data-scientist', 'Restores correct shortlisted career ID data-scientist');

  console.log('\n--- TEST GROUP 4: Demo Account Data Isolation ---');

  // 4.1 Demo account (Alex Chen) still exists with legitimate pre-existing demo data intact
  const demoLogin = await req('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'alex.chen@university.edu',
      password: 'student123',
    }),
  });
  assert(demoLogin.status === 200, 'Demo account Alex Chen remains accessible');
  const demoHeaders = { Authorization: `Bearer ${demoLogin.data.token}` };

  const demoSkills = await req('/skills', { headers: demoHeaders });
  assert(demoSkills.data.data.length >= 3, `Demo account maintains its demo skills (${demoSkills.data.data.length} skills)`);

  const demoStatus = await req('/careers/user-status', { headers: demoHeaders });
  assert(demoStatus.data.savedCareerIds.length >= 1, `Demo account maintains its demo shortlists (${demoStatus.data.savedCareerIds.length} saved)`);

  console.log('\n====================================================');
  console.log(`ALL ${passed}/${total} BUG FIX REGRESSION TESTS PASSED!`);
  console.log('====================================================\n');
}

runTests().catch((err) => {
  console.error('\nTEST RUN FAILED:', err);
  process.exit(1);
});
