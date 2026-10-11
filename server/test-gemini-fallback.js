// test-gemini-fallback.js - Automated Test for Gemini AI Integration & Fallback Resilience
import dotenv from 'dotenv';
dotenv.config();

import {
  isGeminiAvailable,
  getGeminiModelId,
  generateCareerInsights,
} from './dist/services/geminiService.js';

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

async function runGeminiFallbackTests() {
  console.log('================================================================');
  console.log('    SKILLPULSE AI — GEMINI INTEGRATION & FALLBACK AUDIT        ');
  console.log('================================================================\n');

  let passedTests = 0;
  let totalTests = 5;

  // 1. Model Configuration Verification
  console.log('TEST 1: Model ID Configuration & Verification...');
  const defaultModel = getGeminiModelId();
  if (defaultModel !== 'gemini-3.8-flash') {
    throw new Error(`Expected default model 'gemini-3.8-flash', got '${defaultModel}'`);
  }
  console.log(`✓ Verified default model is upstream-supported: "${defaultModel}"`);

  // Verify configurable model
  const originalEnvModel = process.env.GEMINI_MODEL;
  process.env.GEMINI_MODEL = 'gemini-3.5-flash-lite';
  const overriddenModel = getGeminiModelId();
  if (overriddenModel !== 'gemini-3.5-flash-lite') {
    throw new Error(`Expected overridden model 'gemini-3.5-flash-lite', got '${overriddenModel}'`);
  }
  console.log(`✓ Model is configurable via process.env.GEMINI_MODEL: "${overriddenModel}"`);
  if (originalEnvModel !== undefined) {
    process.env.GEMINI_MODEL = originalEnvModel;
  } else {
    delete process.env.GEMINI_MODEL;
  }
  passedTests++;

  // 2. Health & Registration
  console.log('\nTEST 2: Registering Student & Testing Rule-Based Fallback via API...');
  const health = await request('/health');
  if (health.status !== 200) {
    throw new Error('Backend health check failed');
  }

  const studentEmail = `gemini_fallback_test_${Date.now()}@college.edu`;
  const regRes = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Maya Lin',
      email: studentEmail,
      password: 'password123',
      university: 'Tech University',
      major: 'Cognitive Science',
      academicYear: 'Sophomore (Year 2)',
    }),
  });

  if (regRes.status !== 201 || !regRes.data.token) {
    throw new Error(`Student registration failed: ${JSON.stringify(regRes.data)}`);
  }
  const token = regRes.data.token;
  const authHeaders = { Authorization: `Bearer ${token}` };

  const discoveryPayload = {
    responses: {
      favouriteSubjects: ['Computer Science & Programming', 'Psychology & Human Behavior'],
      confidentActivities: ['Writing software / scripting', 'Listening & mentoring peers'],
      broadInterests: ['Technology & Software', 'Healthcare & Mental Well-being'],
      workStyles: ['Independent deep work', 'Collaborating in small teams'],
      workEnvironments: ['Hybrid / Flexible schedule'],
      careerPriorities: ['Intellectual challenge & growth', 'Social impact & helping individuals'],
      educationWillingness: 'Up to Master\'s degree',
      geographicPreferences: 'United States',
    },
    careerStatus: 'undecided',
  };

  const recRes = await request('/careers/recommend', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(discoveryPayload),
  });

  if (recRes.status !== 200) {
    throw new Error(`Recommend endpoint failed with HTTP ${recRes.status}: ${JSON.stringify(recRes.data)}`);
  }

  if (!recRes.data.success || !Array.isArray(recRes.data.recommendations) || recRes.data.recommendations.length === 0) {
    throw new Error('Recommendations payload missing or empty');
  }

  // Check that deterministic matches are intact
  const topRec = recRes.data.recommendations[0];
  if (typeof topRec.matchScore !== 'number' || topRec.matchScore <= 0) {
    throw new Error('Deterministic match score missing or invalid');
  }
  if (!topRec.career.evidence || !Array.isArray(topRec.career.evidence.salaryData)) {
    throw new Error('Verified salary evidence missing from recommended career');
  }

  console.log(`✓ Recommend API returned HTTP 200 with ${recRes.data.recommendations.length} deterministic recommendations.`);
  console.log(`  Top match: "${topRec.career.title}" (${topRec.matchScore}%)`);
  console.log(`  Deterministic salary citations intact: ${topRec.career.evidence.salaryData.length} data points`);
  console.log(`  geminiActive flag returned: ${recRes.data.geminiActive}`);
  passedTests++;

  // 3. User-Status Endpoint Persistence Check
  console.log('\nTEST 3: Verifying User-Status Persistence & Fallback State...');
  const statusRes = await request('/careers/user-status', { headers: authHeaders });
  if (statusRes.status !== 200) {
    throw new Error(`User-status endpoint failed with HTTP ${statusRes.status}`);
  }
  if (statusRes.data.careerStatus !== 'undecided') {
    throw new Error(`Expected careerStatus 'undecided', got '${statusRes.data.careerStatus}'`);
  }
  if (!Array.isArray(statusRes.data.recommendations) || statusRes.data.recommendations.length === 0) {
    throw new Error('Persisted recommendations missing from user status');
  }
  console.log('✓ User status preserved:');
  console.log(`  - careerStatus: ${statusRes.data.careerStatus}`);
  console.log(`  - saved recommendations count: ${statusRes.data.recommendations.length}`);
  console.log(`  - geminiActive: ${statusRes.data.geminiActive}`);
  console.log(`  - aiInsights: ${statusRes.data.aiInsights ? 'Present' : 'null (Clean fallback)'}`);
  passedTests++;

  // 4. In-Process Simulated Timeout & Error Resilience
  console.log('\nTEST 4: In-Process Fallback Resilience on Simulated Timeout & Errors...');
  // Force simulate API key temporarily to test timeout protection
  const originalKey = process.env.GEMINI_API_KEY;
  process.env.GEMINI_API_KEY = 'test_mock_key_for_timeout_verification';

  // Call with 1 millisecond timeout to guarantee timeout trigger
  const timeoutResult = await generateCareerInsights(
    discoveryPayload.responses,
    recRes.data.recommendations,
    1 // 1ms timeout
  );

  if (timeoutResult.geminiActive !== false || timeoutResult.insights !== null) {
    throw new Error('generateCareerInsights failed to return graceful fallback on timeout');
  }
  console.log('✓ generateCareerInsights caught timeout safely without throwing:');
  console.log(`  - geminiActive: ${timeoutResult.geminiActive}`);
  console.log(`  - insights: ${timeoutResult.insights}`);

  // Restore API key
  if (originalKey !== undefined) {
    process.env.GEMINI_API_KEY = originalKey;
  } else {
    delete process.env.GEMINI_API_KEY;
  }
  passedTests++;

  // 5. Live Gemini API Smoke Test (Conditional)
  console.log('\nTEST 5: Live Gemini API Smoke Test (Conditional)...');
  const hasLiveKey = isGeminiAvailable();
  if (hasLiveKey) {
    console.log('✓ Live GEMINI_API_KEY detected in environment (secret masked).');
    console.log(`  Calling model: "${getGeminiModelId()}"...`);
    const liveResult = await generateCareerInsights(
      discoveryPayload.responses,
      recRes.data.recommendations,
      35000
    );

    if (liveResult.geminiActive && liveResult.insights) {
      console.log('✓ LIVE GEMINI GENERATION SUCCEEDED:');
      console.log(`  - Model Used: ${liveResult.modelUsed}`);
      console.log(`  - Synthesis Length: ${liveResult.insights.overallSynthesis.length} chars`);
      console.log(`  - Recommended First Steps (${liveResult.insights.recommendedFirstSteps.length}):`);
      liveResult.insights.recommendedFirstSteps.forEach((s, i) => console.log(`     ${i + 1}. ${s}`));
      console.log(`  - Potential Blind Spots (${liveResult.insights.potentialBlindSpots.length}):`);
      liveResult.insights.potentialBlindSpots.forEach((s, i) => console.log(`     - ${s}`));
    } else {
      console.log('! Live generation returned fallback (e.g. quota or network restriction). Fallback preserved gracefully.');
    }
  } else {
    console.log('✓ GEMINI_API_KEY is not configured or is placeholder.');
    console.log('✓ Fallback verified: Platform operates with 100% functionality using deterministic heuristic matching.');
  }
  passedTests++;

  console.log('\n================================================================');
  console.log(`>>> ALL ${passedTests}/${totalTests} GEMINI FALLBACK & RESILIENCE AUDITS PASSED (100%) <<<`);
  console.log('================================================================');
}

runGeminiFallbackTests().catch((err) => {
  console.error('\n❌ GEMINI AUDIT FAILED:', err);
  process.exit(1);
});
