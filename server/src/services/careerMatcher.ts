import { RawCareerData, CAREERS_CATALOG } from '../data/careersCatalog.js';

export interface DiscoveryResponses {
  favouriteSubjects?: string[];
  confidentActivities?: string[];
  broadInterests?: string[];
  workStyles?: string[];
  workEnvironments?: string[];
  careerPriorities?: string[];
  educationWillingness?: string;
  geographicPreferences?: string;
  notes?: string;
}

export interface CareerRecommendation {
  career: RawCareerData;
  matchScore: number; // 0 - 100
  matchTier: 'High Match' | 'Strong Match' | 'Notable Match';
  matchRationale: string[];
  existingTransferableSkills: string[];
  neededQualifications: string[];
  tradeoffs: string[];
  disclaimer: string;
}

export const matchCareersRuleBased = (
  responses: DiscoveryResponses,
  catalog: RawCareerData[] = CAREERS_CATALOG
): CareerRecommendation[] => {
  const subjects = (responses.favouriteSubjects || []).map((s) => s.toLowerCase());
  const activities = (responses.confidentActivities || []).map((a) => a.toLowerCase());
  const interests = (responses.broadInterests || []).map((i) => i.toLowerCase());
  const styles = (responses.workStyles || []).map((w) => w.toLowerCase());
  const envs = (responses.workEnvironments || []).map((e) => e.toLowerCase());
  const priorities = (responses.careerPriorities || []).map((p) => p.toLowerCase());
  const eduWillingness = (responses.educationWillingness || '').toLowerCase();

  const scoredCareers = catalog.map((career) => {
    let score = 20; // baseline exploratory floor
    const rationales: string[] = [];
    const existingSkills: string[] = [];

    // 1. Subject Overlap
    const matchingSubjects = career.transferableSubjects.filter((subj) =>
      subjects.some((s) => subj.toLowerCase().includes(s) || s.includes(subj.toLowerCase()))
    );
    if (matchingSubjects.length > 0) {
      score += Math.min(matchingSubjects.length * 12, 24);
      rationales.push(
        `Directly utilizes your stated interest in ${matchingSubjects.slice(0, 2).join(' and ')}.`
      );
      existingSkills.push(...matchingSubjects);
    }

    // 2. Broad Domain Interest Match
    const domainMatches = interests.some((interest) =>
      career.domain.toLowerCase().includes(interest) || interest.includes(career.domain.toLowerCase().split('&')[0].trim())
    );
    if (domainMatches) {
      score += 20;
      rationales.push(`Aligns directly with your interest in the ${career.domain} sector.`);
    }

    // 3. Work Style & Activity Alignment
    const matchingStyles = career.workStyleTags.filter((tag) =>
      styles.some((st) => tag.toLowerCase().includes(st) || st.includes(tag.toLowerCase())) ||
      activities.some((ac) => tag.toLowerCase().includes(ac) || ac.includes(tag.toLowerCase()))
    );
    if (matchingStyles.length > 0) {
      score += Math.min(matchingStyles.length * 10, 20);
      rationales.push(
        `Fits your preferred working style of ${matchingStyles.slice(0, 2).join(' & ')}.`
      );
    }

    // 4. Career Priorities Match
    const matchingPriorities = career.priorityTags.filter((tag) =>
      priorities.some((p) => tag.toLowerCase().includes(p) || p.includes(tag.toLowerCase()))
    );
    if (matchingPriorities.length > 0) {
      score += Math.min(matchingPriorities.length * 10, 20);
      rationales.push(
        `Supports your key priority for ${matchingPriorities[0]}.`
      );
    }

    // 5. Work Environment Match
    const matchingEnv = career.environmentTags.filter((env) =>
      envs.some((e) => env.toLowerCase().includes(e) || e.includes(env.toLowerCase()))
    );
    if (matchingEnv.length > 0) {
      score += 8;
      rationales.push(`Offers workplace settings matching your preferences (${matchingEnv[0]}).`);
    }

    // 6. Education Willingness Match
    if (eduWillingness && career.educationRequirement.willingnessMatch.includes(eduWillingness)) {
      score += 8;
    }

    // If few rationales triggered, provide a transparent general match explanation
    if (rationales.length === 0) {
      rationales.push(
        `Offers diverse career mobility and foundational opportunities in ${career.domain}.`
      );
    }

    // Normalize score to max 96% (reminding user that no match is a guaranteed 100% absolute)
    const normalizedScore = Math.min(Math.max(Math.round(score), 45), 96);

    let matchTier: 'High Match' | 'Strong Match' | 'Notable Match' = 'Notable Match';
    if (normalizedScore >= 80) matchTier = 'High Match';
    else if (normalizedScore >= 65) matchTier = 'Strong Match';

    return {
      career,
      matchScore: normalizedScore,
      matchTier,
      matchRationale: rationales,
      existingTransferableSkills: Array.from(new Set(existingSkills)),
      neededQualifications: career.educationRequirement.typicalMajors,
      tradeoffs: career.tradeoffsAndUncertainties,
      disclaimer:
        'Exploratory guidance based on your stated preferences. This is not a validated psychometric test or a guarantee of career success.',
    };
  });

  // Sort by match score descending
  return scoredCareers.sort((a, b) => b.matchScore - a.matchScore);
};
