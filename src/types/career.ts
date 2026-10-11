export interface ISalaryData {
  geographicScope: string;
  currency: string;
  min: number;
  median: number;
  max: number;
  period: string;
  sourceName: string;
  sourceUrl: string;
  publicationYear: number;
  socCodeOrStandard: string;
}

export interface IEmploymentOutlook {
  geographicScope: string;
  growthRateText: string;
  projectedOpeningsText: string;
  sourceName: string;
  sourceUrl: string;
  publicationYear: number;
}

export interface ISampleJobPosting {
  title: string;
  companyOrType: string;
  location: string;
  isIllustrativeDemo: boolean;
  sourceNote: string;
  sampleResponsibilities: string[];
}

export interface IOfficialBody {
  name: string;
  type: string;
  url: string;
  countryOrScope: string;
}

export interface IIndustryReport {
  title: string;
  publisher: string;
  year: number;
  keyInsight: string;
  citationUrl: string;
}

export interface ICareerEvidence {
  salaryData: ISalaryData[];
  employmentOutlook: IEmploymentOutlook;
  sampleRolesOrJobPostings: ISampleJobPosting[];
  officialBodiesAndCertifications: IOfficialBody[];
  industryReports: IIndustryReport[];
  limitationsNote: string;
}

export interface IMiniProject {
  title: string;
  description: string;
  duration: string;
  type: 'mini_project' | 'intro_lesson' | 'informational_interview';
}

export interface CareerProfile {
  careerId: string;
  title: string;
  domain: string;
  summary: string;
  description: string;
  keyActivities: string[];
  workStyleTags: string[];
  environmentTags: string[];
  priorityTags: string[];
  educationRequirement: {
    level: string;
    typicalMajors: string[];
    willingnessMatch: string[];
  };
  transferableSubjects: string[];
  entryPathways: string[];
  tradeoffsAndUncertainties: string[];
  practicalMiniProjects: IMiniProject[];
  evidence: ICareerEvidence;
}

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
  career: CareerProfile;
  matchScore: number;
  matchTier: 'High Match' | 'Strong Match' | 'Notable Match';
  matchRationale: string[];
  existingTransferableSkills: string[];
  neededQualifications: string[];
  tradeoffs: string[];
  disclaimer: string;
}

export type CareerStatus = 'decided' | 'comparing' | 'undecided';

export interface CareerFeedbackEntry {
  status: 'shortlisted' | 'exploring' | 'interesting' | 'not_suitable';
  notes?: string;
  updatedAt?: string;
}

export interface GeminiPersonalizedInsights {
  overallSynthesis: string;
  recommendedFirstSteps: string[];
  potentialBlindSpots: string[];
  modelUsed: string;
  generatedAt: string;
}

export interface UserCareerStatus {
  careerStatus: CareerStatus;
  selectedCareerId: string | null;
  targetRole?: string;
  customCareerRole?: string | null;
  onboardingCompleted: boolean;
  discoveryResponses: DiscoveryResponses;
  savedCareerIds: string[];
  careerFeedback: Record<string, CareerFeedbackEntry>;
  recommendations: CareerRecommendation[];
  geminiActive?: boolean;
  aiInsights?: GeminiPersonalizedInsights | null;
  modelUsed?: string | null;
}
