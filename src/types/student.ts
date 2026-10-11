export interface StudentProfile {
  id: string;
  name: string;
  handle: string;
  email: string;
  avatarUrl: string;
  university: string;
  major: string;
  academicYear: string;
  bio: string;
  streakDays: number;
  totalHoursLearned: number;
  overallMasteryPercent: number;
  completedGoalsCount: number;
  targetRole: string;
  joinedDate: string;
  careerStatus?: 'decided' | 'comparing' | 'undecided';
  selectedCareerId?: string | null;
  customCareerRole?: string | null;
  onboardingCompleted?: boolean;
  savedCareerIds?: string[];
  discoveryResponses?: Record<string, any>;
  careerFeedback?: Record<string, any>;
}

export interface MetricStat {
  id: string;
  title: string;
  value: string | number;
  changePercent: number;
  changePeriod: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}
