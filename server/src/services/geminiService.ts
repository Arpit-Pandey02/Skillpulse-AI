import { GoogleGenAI } from '@google/genai';
import type { DiscoveryResponses, CareerRecommendation } from './careerMatcher.js';

export interface GeminiPersonalizedInsights {
  overallSynthesis: string;
  recommendedFirstSteps: string[];
  potentialBlindSpots: string[];
  modelUsed: string;
  generatedAt: string;
}

export interface GeminiServiceResult {
  geminiActive: boolean;
  insights: GeminiPersonalizedInsights | null;
  modelUsed?: string;
}

/**
 * Gets the configured model ID, defaulting to the verified stable 'gemini-3.8-flash'.
 */
export const getGeminiModelId = (): string => {
  return process.env.GEMINI_MODEL?.trim() || 'gemini-3.8-flash';
};

/**
 * Checks whether a valid Gemini API key is configured.
 */
export const isGeminiAvailable = (): boolean => {
  const key = process.env.GEMINI_API_KEY;
  return Boolean(key && key.trim().length > 0 && key !== 'your_gemini_api_key_here');
};

/**
 * Generates personalized qualitative career discovery insights using Gemini AI.
 *
 * CRITICAL SAFETY RULES:
 * 1. This function ONLY produces qualitative advice and collegiate next-steps.
 * 2. It NEVER modifies deterministic match scores, official statistics, or government salary data.
 * 3. If the key is missing, invalid, times out, or errors, it returns graceful fallback with geminiActive: false.
 */
export const generateCareerInsights = async (
  responses: DiscoveryResponses,
  topRecommendations: CareerRecommendation[],
  timeoutMs = parseInt(process.env.GEMINI_TIMEOUT_MS || '35000', 10)
): Promise<GeminiServiceResult> => {
  if (!isGeminiAvailable()) {
    return {
      geminiActive: false,
      insights: null,
    };
  }

  const modelId = getGeminiModelId();

  try {
    const apiKey = process.env.GEMINI_API_KEY!.trim();
    const ai = new GoogleGenAI({ apiKey });

    // Build focused prompt summarizing student input and deterministic top roles
    const topRolesSummary = topRecommendations.slice(0, 3).map((r) => ({
      title: r.career.title,
      domain: r.career.domain,
      matchScore: `${r.matchScore}%`,
      keyTransferableSkills: r.existingTransferableSkills.slice(0, 3),
      primaryTradeoff: r.tradeoffs[0] || 'Requires ongoing learning',
    }));

    const promptText = `
You are a senior collegiate career advisor providing personalized guidance for a college student.

STUDENT PROFILE (SELF-REPORTED):
- Favourite Subjects: ${(responses.favouriteSubjects || []).join(', ') || 'Not specified'}
- Confident Activities: ${(responses.confidentActivities || []).join(', ') || 'Not specified'}
- Broad Fields of Interest: ${(responses.broadInterests || []).join(', ') || 'Not specified'}
- Preferred Work Style: ${(responses.workStyles || []).join(', ') || 'Not specified'}
- Preferred Environment: ${(responses.workEnvironments || []).join(', ') || 'Not specified'}
- Career Priorities: ${(responses.careerPriorities || []).join(', ') || 'Not specified'}
- Education Willingness: ${responses.educationWillingness || 'Not specified'}
- Geographic Preference: ${responses.geographicPreferences || 'Not specified'}

DETERMINISTIC TOP CAREER MATCHES (GROUND TRUTH FROM VERIFIED CATALOG):
${JSON.stringify(topRolesSummary, null, 2)}

INSTRUCTIONS:
1. Provide an inspiring, candid, and personalized synthesis explaining how the student's unique combination of subjects and interests connects with these fields.
2. Recommend 3 concrete, low-stakes first steps the student can take this semester (e.g. course recommendations, student clubs, informational interview tips).
3. Identify 2 potential blind spots or trade-offs they should be aware of.
4. Output valid JSON ONLY matching the following schema. Do NOT wrap in markdown fences or commentary.

{
  "overallSynthesis": "A 2-3 paragraph personalized narrative analyzing their career orientation",
  "recommendedFirstSteps": ["Step 1...", "Step 2...", "Step 3..."],
  "potentialBlindSpots": ["Blind spot 1...", "Blind spot 2..."]
}
`.trim();

    // Enforce timeout using Promise.race with 1 retry on temporary 503 high demand spikes
    let response: any = null;
    let lastError: any = null;

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const apiCallPromise = ai.models.generateContent({
          model: modelId,
          contents: promptText,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Gemini API call timed out')), timeoutMs);
        });

        response = await Promise.race([apiCallPromise, timeoutPromise]);
        if (response) break;
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || '';
        if (attempt === 0 && (errMsg.includes('503') || errMsg.includes('high demand') || errMsg.includes('429'))) {
          console.warn('[Gemini Service] Upstream 503 high-demand spike detected, retrying in 2 seconds...');
          await new Promise((resolve) => setTimeout(resolve, 2000));
          continue;
        }
        throw err;
      }
    }

    if (!response && lastError) {
      throw lastError;
    }

    const responseText = response.text?.trim() || '';

    if (!responseText) {
      console.warn('[Gemini Service] Empty text returned from model.');
      return { geminiActive: false, insights: null };
    }

    // Parse structured JSON safely
    let parsed: any;
    try {
      // Remove possible markdown formatting if present
      const cleanJson = responseText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
      parsed = JSON.parse(cleanJson);
    } catch (parseError) {
      console.warn('[Gemini Service] Output was not valid JSON, falling back.');
      return { geminiActive: false, insights: null };
    }

    // Validate expected structure
    if (
      typeof parsed.overallSynthesis !== 'string' ||
      !Array.isArray(parsed.recommendedFirstSteps) ||
      !Array.isArray(parsed.potentialBlindSpots)
    ) {
      console.warn('[Gemini Service] Parsed JSON missing required schema fields, falling back.');
      return { geminiActive: false, insights: null };
    }

    return {
      geminiActive: true,
      modelUsed: modelId,
      insights: {
        overallSynthesis: parsed.overallSynthesis,
        recommendedFirstSteps: parsed.recommendedFirstSteps,
        potentialBlindSpots: parsed.potentialBlindSpots,
        modelUsed: modelId,
        generatedAt: new Date().toISOString(),
      },
    };
  } catch (error: any) {
    // Sanitized logging: never log authorization tokens, API keys, or raw request payloads
    console.warn(`[Gemini Service Fallback] Generation failed: ${error?.message || 'Unknown error'}. Operating in reliable rule-based fallback mode.`);
    return {
      geminiActive: false,
      insights: null,
    };
  }
};
