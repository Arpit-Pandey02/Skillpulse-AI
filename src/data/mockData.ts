/**
 * ==============================================================================
 * SAMPLE MOCK DATA FOR PHASE 1: PREMIUM UI FOUNDATION
 * ==============================================================================
 * 
 * NOTE FOR SENIOR DEVELOPER REVIEW & LEARNING:
 * In Phase 1, we do not connect directly to MongoDB or an Express backend yet.
 * Instead, we use this centralized, strictly typed mock dataset.
 * 
 * Key architectural benefit:
 * 1. UI components are built against stable TypeScript interfaces.
 * 2. When we build the backend in Phase 2, we just replace these mock getters
 *    with `fetch('/api/...')` without having to rewrite any UI layout or components!
 * ==============================================================================
 */

import type { StudentProfile, MetricStat } from '../types/student';
import type { Skill, SkillCategorySummary } from '../types/skill';
import type { WeeklyGoal, RecentActivity, DailyStudyRecord, RoadmapStep } from '../types/activity';

export const MOCK_STUDENT_PROFILE: StudentProfile = {
  id: 'std_alex_chen_2026',
  name: 'Alex Chen',
  handle: '@alexchen_dev',
  email: 'alex.chen@university.edu',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
  university: 'University of Washington',
  major: 'Computer Science & Software Engineering',
  academicYear: 'Sophomore (Year 2)',
  bio: 'Second-year CS student diving deep into full-stack systems, clean code, and practical machine learning architectures.',
  streakDays: 14,
  totalHoursLearned: 186.5,
  overallMasteryPercent: 74,
  completedGoalsCount: 38,
  targetRole: 'Full-Stack AI Software Engineer',
  joinedDate: 'September 2025',
};

export const MOCK_KEY_METRICS: MetricStat[] = [
  {
    id: 'metric_skills',
    title: 'Tracked Skills',
    value: 12,
    changePercent: 16.5,
    changePeriod: 'vs last month',
    trend: 'up',
    icon: 'Layers',
  },
  {
    id: 'metric_weekly_hours',
    title: 'Study Hours This Week',
    value: '22.5 hrs',
    changePercent: 12.0,
    changePeriod: 'target: 20 hrs',
    trend: 'up',
    icon: 'Clock',
  },
  {
    id: 'metric_streak',
    title: 'Active Daily Streak',
    value: '14 Days',
    changePercent: 100,
    changePeriod: 'personal best!',
    trend: 'up',
    icon: 'Flame',
  },
  {
    id: 'metric_mastery',
    title: 'Overall Readiness',
    value: '74%',
    changePercent: 4.8,
    changePeriod: 'vs last sprint',
    trend: 'up',
    icon: 'Sparkles',
  },
];

export const MOCK_ACTIVE_SKILLS: Skill[] = [
  {
    id: 'skill_react',
    name: 'React & Modern Frontend',
    category: 'Frontend',
    level: 'Advanced',
    progressPercent: 82,
    hoursSpent: 48,
    targetHours: 60,
    lastPracticed: '2 hours ago',
    verifiedProjectsCount: 4,
    tags: ['Hooks', 'Tailwind CSS', 'Vite', 'State Management'],
    color: '#6366F1', // Indigo
    badgeText: 'Top Performer',
  },
  {
    id: 'skill_ts',
    name: 'TypeScript & Type Systems',
    category: 'Frontend',
    level: 'Intermediate',
    progressPercent: 75,
    hoursSpent: 36,
    targetHours: 50,
    lastPracticed: 'Yesterday',
    verifiedProjectsCount: 3,
    tags: ['Generics', 'Utility Types', 'Strict Typing'],
    color: '#8B5CF6', // Violet
  },
  {
    id: 'skill_dsa',
    name: 'Data Structures & Algorithms',
    category: 'Computer Science Core',
    level: 'Intermediate',
    progressPercent: 68,
    hoursSpent: 52,
    targetHours: 80,
    lastPracticed: '3 days ago',
    verifiedProjectsCount: 2,
    tags: ['Binary Trees', 'Dynamic Programming', 'Graph BFS/DFS'],
    color: '#3B82F6', // Blue
    badgeText: 'Exam Prep Focus',
  },
  {
    id: 'skill_python_ai',
    name: 'Python for AI & Data Science',
    category: 'AI & Machine Learning',
    level: 'Intermediate',
    progressPercent: 60,
    hoursSpent: 32,
    targetHours: 60,
    lastPracticed: '4 days ago',
    verifiedProjectsCount: 2,
    tags: ['NumPy', 'Pandas', 'Prompt Engineering', 'LangChain basics'],
    color: '#10B981', // Emerald
  },
  {
    id: 'skill_node',
    name: 'Node.js & REST APIs',
    category: 'Backend',
    level: 'Intermediate',
    progressPercent: 58,
    hoursSpent: 26,
    targetHours: 50,
    lastPracticed: '5 days ago',
    verifiedProjectsCount: 1,
    tags: ['Express', 'Middleware', 'REST', 'JWT Auth'],
    color: '#F59E0B', // Amber
  },
  {
    id: 'skill_git',
    name: 'Git, GitHub & CI/CD',
    category: 'Cloud & DevOps',
    level: 'Advanced',
    progressPercent: 88,
    hoursSpent: 22,
    targetHours: 25,
    lastPracticed: '1 day ago',
    verifiedProjectsCount: 5,
    tags: ['Branching Strategies', 'GitHub Actions', 'Rebase'],
    color: '#EC4899', // Pink
    badgeText: 'Proficient',
  },
];

export const MOCK_CATEGORY_SUMMARIES: SkillCategorySummary[] = [
  { category: 'Frontend', skillCount: 3, averageMastery: 79, color: '#6366F1' },
  { category: 'Backend', skillCount: 2, averageMastery: 62, color: '#F59E0B' },
  { category: 'AI & Machine Learning', skillCount: 2, averageMastery: 58, color: '#10B981' },
  { category: 'Computer Science Core', skillCount: 3, averageMastery: 71, color: '#3B82F6' },
  { category: 'Cloud & DevOps', skillCount: 2, averageMastery: 84, color: '#EC4899' },
];

export const MOCK_DAILY_STUDY_RECORDS: DailyStudyRecord[] = [
  { day: 'Mon', fullDate: 'Oct 5', actualHours: 3.5, targetHours: 3.0, activeSkill: 'React Components' },
  { day: 'Tue', fullDate: 'Oct 6', actualHours: 4.0, targetHours: 3.0, activeSkill: 'Binary Trees (DSA)' },
  { day: 'Wed', fullDate: 'Oct 7', actualHours: 2.0, targetHours: 3.0, activeSkill: 'TypeScript Generics' },
  { day: 'Thu', fullDate: 'Oct 8', actualHours: 4.5, targetHours: 3.0, activeSkill: 'Python NumPy & Pandas' },
  { day: 'Fri', fullDate: 'Oct 9', actualHours: 3.0, targetHours: 3.0, activeSkill: 'Express REST Endpoints' },
  { day: 'Sat', fullDate: 'Oct 10', actualHours: 5.5, targetHours: 4.0, activeSkill: 'Student Tracker UI Build' },
  { day: 'Sun', fullDate: 'Today', actualHours: 2.5, targetHours: 4.0, activeSkill: 'Tailwind Design Tokens' },
];

export const MOCK_WEEKLY_GOALS: WeeklyGoal[] = [
  {
    id: 'goal_1',
    title: 'Build responsive collapsible sidebar in React & Tailwind',
    category: 'Frontend',
    dueDate: 'Oct 12',
    completed: true,
    priority: 'High',
    hoursEstimate: 4,
  },
  {
    id: 'goal_2',
    title: 'Solve 5 LeetCode Medium problems on Binary Search Trees',
    category: 'Computer Science Core',
    dueDate: 'Oct 13',
    completed: true,
    priority: 'High',
    hoursEstimate: 3,
  },
  {
    id: 'goal_3',
    title: 'Complete TypeScript strict typing refactor for mock data layer',
    category: 'Frontend',
    dueDate: 'Oct 14',
    completed: false,
    priority: 'Medium',
    hoursEstimate: 2.5,
  },
  {
    id: 'goal_4',
    title: 'Implement Recharts daily study analytics widget with tooltip',
    category: 'Frontend',
    dueDate: 'Oct 15',
    completed: false,
    priority: 'High',
    hoursEstimate: 3,
  },
  {
    id: 'goal_5',
    title: 'Read Google Gemini API documentation for upcoming Phase 3 AI prompts',
    category: 'AI & Machine Learning',
    dueDate: 'Oct 16',
    completed: false,
    priority: 'Low',
    hoursEstimate: 1.5,
  },
];

export const MOCK_RECENT_ACTIVITIES: RecentActivity[] = [
  {
    id: 'act_1',
    type: 'code_practice',
    title: 'Built accessible Modal & Drawer components',
    description: 'Added keyboard trap, Esc key listener, and backdrop click handler',
    timestamp: '2 hours ago',
    skillName: 'React & Modern Frontend',
    xpEarned: 120,
  },
  {
    id: 'act_2',
    type: 'algorithm_solved',
    title: 'Solved "Lowest Common Ancestor in BST"',
    description: 'Achieved O(h) time complexity with recursive binary tree traversal',
    timestamp: '5 hours ago',
    skillName: 'Data Structures & Algorithms',
    xpEarned: 150,
  },
  {
    id: 'act_3',
    type: 'project_milestone',
    title: 'Structured TypeScript contracts for Student Profile',
    description: 'Created strict interfaces for StudentProfile, Skill, and MetricStat',
    timestamp: 'Yesterday at 6:40 PM',
    skillName: 'TypeScript & Type Systems',
    xpEarned: 90,
  },
  {
    id: 'act_4',
    type: 'reading',
    title: 'Reviewed REST API best practices for Express',
    description: 'Studied HTTP status codes, pagination headers, and error middleware design',
    timestamp: '2 days ago',
    skillName: 'Node.js & REST APIs',
    xpEarned: 60,
  },
  {
    id: 'act_5',
    type: 'ai_review',
    title: 'AI Diagnostic Milestone Check',
    description: 'System identified strong progress in frontend layout and recommended DSA practice',
    timestamp: '3 days ago',
    skillName: 'AI Diagnostic Engine',
    xpEarned: 100,
  },
];

export const MOCK_ROADMAP_STEPS: RoadmapStep[] = [
  {
    id: 'step_1',
    stepNumber: 1,
    title: 'Foundations & CS Core',
    phase: 'Semester 1 - 2',
    description: 'Master Object-Oriented Programming, Memory Management, and Basic Data Structures (Arrays, Linked Lists, Stacks, Queues).',
    skills: ['C++ / Java Basics', 'Memory & Pointers', 'Big-O Complexity'],
    status: 'completed',
    estimatedWeeks: 8,
    progressPercent: 100,
  },
  {
    id: 'step_2',
    stepNumber: 2,
    title: 'Modern Web & Component Engineering',
    phase: 'Current Phase (Sophomore)',
    description: 'Build enterprise-grade single-page applications with React 19, TypeScript, Tailwind CSS, and state management.',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Recharts'],
    status: 'in-progress',
    estimatedWeeks: 6,
    progressPercent: 78,
  },
  {
    id: 'step_3',
    stepNumber: 3,
    title: 'Full-Stack Services & Persistence',
    phase: 'Upcoming Phase',
    description: 'Design robust backend REST architectures with Node.js, Express, MongoDB, and secure JWT authentication.',
    skills: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'REST API Design'],
    status: 'upcoming',
    estimatedWeeks: 8,
    progressPercent: 15,
  },
  {
    id: 'step_4',
    stepNumber: 4,
    title: 'AI Integration & Intelligent Agents',
    phase: 'Upcoming Milestone',
    description: 'Connect generative AI APIs to evaluate student skill gaps, recommend personalized study schedules, and analyze GitHub commits.',
    skills: ['Gemini API', 'Prompt Engineering', 'Structured JSON Output', 'Agent Workflows'],
    status: 'upcoming',
    estimatedWeeks: 6,
    progressPercent: 0,
  },
];
