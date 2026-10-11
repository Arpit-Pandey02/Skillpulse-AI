export interface WeeklyGoal {
  id: string;
  title: string;
  category: string;
  dueDate: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
  hoursEstimate: number;
}

export type ActivityType = 
  | 'code_practice' 
  | 'project_milestone' 
  | 'algorithm_solved' 
  | 'reading' 
  | 'ai_review';

export interface RecentActivity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  skillName: string;
  xpEarned: number;
}

export interface DailyStudyRecord {
  day: string;
  fullDate: string;
  actualHours: number;
  targetHours: number;
  activeSkill: string;
}

export interface RoadmapStep {
  id: string;
  stepNumber: number;
  title: string;
  phase: string;
  description: string;
  skills: string[];
  status: 'completed' | 'in-progress' | 'upcoming';
  estimatedWeeks: number;
  progressPercent: number;
}
