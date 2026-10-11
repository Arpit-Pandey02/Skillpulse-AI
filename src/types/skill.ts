export type SkillCategory = 
  | 'Frontend' 
  | 'Backend' 
  | 'AI & Machine Learning' 
  | 'Computer Science Core' 
  | 'Cloud & DevOps'
  | 'Database';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  progressPercent: number; // 0 - 100
  hoursSpent: number;
  targetHours: number;
  lastPracticed: string;
  verifiedProjectsCount: number;
  tags: string[];
  color: string;
  badgeText?: string;
}

export interface SkillCategorySummary {
  category: SkillCategory;
  skillCount: number;
  averageMastery: number;
  color: string;
}
