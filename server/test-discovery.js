// test-discovery.js - Automated Test for Career Discovery Architecture
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

async function runDiscoveryTests() {
  console.log('=== STARTING CAREER DISCOVERY ARCHITECTURE TESTS ===\n');

  // 1. Health Check
  console.log('1. Checking Server Health...');
  const health = await request('/health');
  if (health.status !== 200 || health.data.status !== 'ok') {
    throw new Error('Health check failed');
  }
  console.log('✓ Health status OK');

  // 2. Fetch Multi-Domain Career Catalog
  console.log('\n2. Fetching Multi-Domain Career Catalog...');
  const catalogRes = await request('/careers');
  if (catalogRes.status !== 200 || !Array.isArray(catalogRes.data.data)) {
    throw new Error('Failed to retrieve careers catalog');
  }
  console.log(`✓ Catalog loaded with ${catalogRes.data.data.length} careers across ${catalogRes.data.domains.length} domains.`);
  console.log('  Domains available:', catalogRes.data.domains.slice(0, 5).join(', '), '...');

  // 3. Register a New Student (Undecided Persona)
  const uniqueId = Date.now();
  const email = `undecided_student_${uniqueId}@college.edu`;
  console.log(`\n3. Registering New Student (${email})...`);
  const regRes = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Samira Patel',
      email,
      password: 'password123',
      university: 'State University',
      major: 'Undeclared / First Year',
      academicYear: 'Freshman (Year 1)',
    }),
  });
  if (regRes.status !== 201 || !regRes.data.token) {
    throw new Error(`Registration failed: ${JSON.stringify(regRes.data)}`);
  }
  const token = regRes.data.token;
  const authHeaders = { Authorization: `Bearer ${token}` };
  console.log('✓ Registration successful!');
  console.log('  Default career status:', regRes.data.user.careerStatus);

  // 4. Submit Skippable Career Discovery Questionnaire
  console.log('\n4. Submitting Career Discovery Questionnaire...');
  const discoveryResponses = {
    favouriteSubjects: ['Psychology & Human Behavior', 'Biology & Neuroscience', 'Logic & Law'],
    confidentActivities: ['Helping & mentoring people', 'Analyzing data & behaviors', 'Writing & Communications'],
    broadInterests: ['Healthcare & Life Sciences', 'Law, Policy & Public Service'],
    workStyles: ['Working with people', 'Deep Research', 'Analytical & Logic'],
    workEnvironments: ['Hospital / Medical Clinic', 'Private Practice Office'],
    careerPriorities: ['Social Impact & Helping Others', 'High Job Stability'],
    educationWillingness: 'masters_phd',
    geographicPreferences: 'Flexible',
  };

  const recommendRes = await request('/careers/recommend', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      responses: discoveryResponses,
      careerStatus: 'undecided',
    }),
  });
  if (recommendRes.status !== 200 || !Array.isArray(recommendRes.data.data)) {
    throw new Error(`Recommendation failed: ${JSON.stringify(recommendRes.data)}`);
  }
  const recommendations = recommendRes.data.data;
  console.log(`✓ Generated ${recommendations.length} rule-based career recommendations.`);
  console.log(`  Top Recommended Match: "${recommendations[0].career.title}" (${recommendations[0].matchScore}% - ${recommendations[0].matchTier})`);
  console.log(`  Top Rationale: "${recommendations[0].matchRationale[0]}"`);
  console.log(`  Disclaimer included: "${recommendations[0].disclaimer.slice(0, 40)}..."`);

  // Verify Clinical Psychologist ranked high for healthcare + psychology profile
  const psychologistMatch = recommendations.find(r => r.career.careerId === 'clinical-psychologist');
  if (!psychologistMatch || psychologistMatch.matchScore < 70) {
    throw new Error('Expected Clinical Psychologist to score high for healthcare/psychology inputs');
  }
  console.log(`✓ Rule-based matcher correctly weighted Clinical Psychologist at ${psychologistMatch.matchScore}%`);

  // 5. Test Shortlisting & Feedback on Careers
  console.log('\n5. Updating Career Status & Shortlist...');
  const feedbackRes1 = await request('/careers/feedback', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      careerId: 'clinical-psychologist',
      status: 'shortlisted',
      notes: 'Strong personal interest in behavioral therapy and research',
    }),
  });
  if (feedbackRes1.status !== 200 || !feedbackRes1.data.savedCareerIds.includes('clinical-psychologist')) {
    throw new Error('Shortlist feedback failed');
  }

  const feedbackRes2 = await request('/careers/feedback', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      careerId: 'tech-policy-analyst',
      status: 'exploring',
      notes: 'Interested in AI ethics and digital regulation aspects',
    }),
  });
  if (feedbackRes2.status !== 200 || !feedbackRes2.data.savedCareerIds.includes('tech-policy-analyst')) {
    throw new Error('Explore feedback failed');
  }
  console.log('✓ Successfully saved careers to shortlist:', feedbackRes2.data.savedCareerIds);

  // 6. Inspect Career Evidence & Geographic Labeling
  console.log('\n6. Inspecting Career Evidence & Geographic Integrity...');
  const detailRes = await request('/careers/clinical-psychologist');
  if (detailRes.status !== 200 || !detailRes.data.data) {
    throw new Error('Failed to retrieve career details');
  }
  const career = detailRes.data.data;
  const salaryUS = career.evidence.salaryData.find(s => s.geographicScope.includes('United States'));
  const salaryUK = career.evidence.salaryData.find(s => s.geographicScope.includes('United Kingdom'));

  if (!salaryUS || !salaryUK) {
    throw new Error('Career must include explicitly labeled geographic salary data');
  }
  console.log('✓ Verified Geographic Salary Labeling:');
  console.log(`  - ${salaryUS.geographicScope}: ${salaryUS.currency} $${salaryUS.median} median (${salaryUS.sourceName}, ${salaryUS.publicationYear})`);
  console.log(`  - ${salaryUK.geographicScope}: ${salaryUK.currency} £${salaryUK.median} median (${salaryUK.sourceName}, ${salaryUK.publicationYear})`);
  console.log(`  - Limitations Note: "${career.evidence.limitationsNote}"`);
  console.log(`  - Exploration Mini-Projects: ${career.practicalMiniProjects.length} activities provided.`);

  // 7. Suggest a Custom Career Role
  console.log('\n7. Suggesting Unlisted Custom Career Role...');
  const customRes = await request('/careers/suggest-custom', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      title: 'Bioinformatics Genomic Data Specialist',
      domain: 'Healthcare & Life Sciences',
      notes: 'Intersection of DNA sequencing, high-performance computing, and oncology research',
    }),
  });
  if (customRes.status !== 201 || !customRes.data.customCareer) {
    throw new Error('Failed to suggest custom career');
  }
  console.log(`✓ Custom career registered: "${customRes.data.customCareer.title}"`);

  // 8. Select Career as Primary Target Role
  console.log('\n8. Selecting Final Career Path ("Clinical Psychologist")...');
  const selectRes = await request('/careers/select', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      careerId: 'clinical-psychologist',
    }),
  });
  if (selectRes.status !== 200 || selectRes.data.user.careerStatus !== 'decided') {
    throw new Error('Career selection failed or status not updated to decided');
  }
  console.log(`✓ Career selection verified! Updated role: "${selectRes.data.user.targetRole}"`);
  console.log(`  Updated career status: ${selectRes.data.user.careerStatus}`);

  // 9. Session Persistence Audit (Re-fetching user-status with JWT)
  console.log('\n9. Session Persistence Check via /api/careers/user-status...');
  const statusRes = await request('/careers/user-status', { headers: authHeaders });
  if (statusRes.status !== 200) {
    throw new Error('Failed to retrieve user status');
  }
  console.log('✓ User Status Confirmed:');
  console.log(`  - Career Status: ${statusRes.data.careerStatus}`);
  console.log(`  - Target Role: ${statusRes.data.targetRole}`);
  console.log(`  - Selected Career ID: ${statusRes.data.selectedCareerId}`);
  console.log(`  - Shortlisted Careers: ${statusRes.data.savedCareerIds.length} items`);
  console.log(`  - Questionnaire Answers Preserved: ${Object.keys(statusRes.data.discoveryResponses).length} categories`);

  console.log('\n=============================================================');
  console.log('>>> ALL CAREER DISCOVERY TESTS PASSED WITH 100% SUCCESS! <<<');
  console.log('=============================================================\n');
}

runDiscoveryTests().catch((err) => {
  console.error('\n❌ TEST RUN FAILED:', err);
  process.exit(1);
});
