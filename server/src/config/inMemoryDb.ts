import bcrypt from 'bcryptjs';
import { RawCareerData, CAREERS_CATALOG } from '../data/careersCatalog.js';
import type { DiscoveryResponses } from '../services/careerMatcher.js';

export type CareerStatus = 'decided' | 'comparing' | 'undecided';

export interface CareerFeedbackItem {
  status: 'shortlisted' | 'interesting' | 'exploring' | 'not_suitable';
  notes?: string;
  updatedAt: string;
}

export interface MemoryUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  avatarUrl: string;
  university: string;
  major: string;
  academicYear: string;
  targetRole: string;
  careerStatus: CareerStatus;
  selectedCareerId?: string;
  customCareerRole?: string;
  onboardingCompleted: boolean;
  discoveryResponses?: DiscoveryResponses;
  savedCareerIds: string[];
  careerFeedback: Record<string, CareerFeedbackItem>;
  aiInsights?: any;
  modelUsed?: string;
  bio: string;
  streakDays: number;
  totalHoursLearned: number;
  overallMasteryPercent: number;
  completedGoalsCount: number;
}

export interface MemorySkill {
  id: string;
  userId: string;
  name: string;
  category: string;
  level: string;
  progressPercent: number;
  hoursSpent: number;
  targetHours: number;
  lastPracticed: string;
  verifiedProjectsCount: number;
  tags: string[];
  color: string;
  badgeText?: string;
}

export interface MemoryGoal {
  id: string;
  userId: string;
  title: string;
  category: string;
  dueDate: string;
  completed: boolean;
  priority: string;
  hoursEstimate: number;
}

export interface MemoryActivity {
  id: string;
  userId: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  skillName: string;
  xpEarned: number;
}

// In-Memory Data Store (Active when MongoDB is not connected)
class InMemoryDatabase {
  users: Map<string, MemoryUser> = new Map();
  skills: Map<string, MemorySkill> = new Map();
  goals: Map<string, MemoryGoal> = new Map();
  activities: Map<string, MemoryActivity> = new Map();
  careers: Map<string, RawCareerData> = new Map();
  customCareers: Map<string, { id: string; title: string; domain: string; suggestedBy: string }> = new Map();

  constructor() {
    this.seedCareers();
    this.seedDefaultUser();
  }

  private seedCareers() {
    for (const career of CAREERS_CATALOG) {
      this.careers.set(career.careerId, career);
    }
  }

  private async seedDefaultUser() {
    const demoId = 'std_demo_alex';
    const passwordHash = await bcrypt.hash('student123', 10);

    const demoUser: MemoryUser = {
      id: demoId,
      name: 'Alex Chen',
      email: 'alex.chen@university.edu',
      passwordHash,
      avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
      university: 'University of Washington',
      major: 'Computer Science & Software Engineering',
      academicYear: 'Sophomore (Year 2)',
      targetRole: 'Full-Stack Software Engineer',
      careerStatus: 'decided',
      selectedCareerId: 'full-stack-software-engineer',
      onboardingCompleted: true,
      savedCareerIds: ['full-stack-software-engineer', 'data-scientist'],
      careerFeedback: {
        'full-stack-software-engineer': {
          status: 'shortlisted',
          notes: 'Strong alignment with React and TypeScript competencies',
          updatedAt: new Date().toISOString(),
        },
      },
      bio: 'Second-year CS student diving deep into full-stack systems, clean code, and practical machine learning architectures.',
      streakDays: 14,
      totalHoursLearned: 186.5,
      overallMasteryPercent: 74,
      completedGoalsCount: 38,
    };

    this.users.set(demoId, demoUser);
    this.seedUserSkillsAndGoals(demoId);
  }

  seedUserSkillsAndGoals(userId: string) {
    const initialSkills = [
      {
        name: 'React & Modern Frontend',
        category: 'Frontend',
        level: 'Advanced',
        progressPercent: 82,
        hoursSpent: 48,
        targetHours: 60,
        lastPracticed: '2 hours ago',
        verifiedProjectsCount: 4,
        tags: ['Hooks', 'Tailwind CSS', 'Vite', 'State Management'],
        color: '#6366F1',
        badgeText: 'Top Performer',
      },
      {
        name: 'TypeScript & Type Systems',
        category: 'Frontend',
        level: 'Intermediate',
        progressPercent: 75,
        hoursSpent: 36,
        targetHours: 50,
        lastPracticed: 'Yesterday',
        verifiedProjectsCount: 3,
        tags: ['Generics', 'Utility Types', 'Strict Typing'],
        color: '#8B5CF6',
      },
      {
        name: 'Data Structures & Algorithms',
        category: 'Computer Science Core',
        level: 'Intermediate',
        progressPercent: 68,
        hoursSpent: 52,
        targetHours: 80,
        lastPracticed: '3 days ago',
        verifiedProjectsCount: 2,
        tags: ['Binary Trees', 'Dynamic Programming', 'Graph BFS/DFS'],
        color: '#3B82F6',
        badgeText: 'Exam Prep Focus',
      },
      {
        name: 'Python for AI & Data Science',
        category: 'AI & Machine Learning',
        level: 'Intermediate',
        progressPercent: 60,
        hoursSpent: 32,
        targetHours: 60,
        lastPracticed: '4 days ago',
        verifiedProjectsCount: 2,
        tags: ['NumPy', 'Pandas', 'Prompt Engineering', 'LangChain basics'],
        color: '#10B981',
      },
      {
        name: 'Node.js & REST APIs',
        category: 'Backend',
        level: 'Intermediate',
        progressPercent: 58,
        hoursSpent: 26,
        targetHours: 50,
        lastPracticed: '5 days ago',
        verifiedProjectsCount: 1,
        tags: ['Express', 'Middleware', 'REST', 'JWT Auth'],
        color: '#F59E0B',
      },
      {
        name: 'Git, GitHub & CI/CD',
        category: 'Cloud & DevOps',
        level: 'Advanced',
        progressPercent: 88,
        hoursSpent: 22,
        targetHours: 25,
        lastPracticed: '1 day ago',
        verifiedProjectsCount: 5,
        tags: ['Branching Strategies', 'GitHub Actions', 'Rebase'],
        color: '#EC4899',
        badgeText: 'Proficient',
      },
    ];

    initialSkills.forEach((s, idx) => {
      const id = `mem_skill_${userId}_${idx}`;
      this.skills.set(id, { id, userId, ...s });
    });

    const initialGoals = [
      {
        title: 'Build responsive collapsible sidebar in React & Tailwind',
        category: 'Frontend',
        dueDate: 'Oct 12',
        completed: true,
        priority: 'High',
        hoursEstimate: 4,
      },
      {
        title: 'Solve 5 LeetCode Medium problems on Binary Search Trees',
        category: 'Computer Science Core',
        dueDate: 'Oct 13',
        completed: true,
        priority: 'High',
        hoursEstimate: 3,
      },
      {
        title: 'Complete TypeScript strict typing refactor for API service layer',
        category: 'Frontend',
        dueDate: 'Oct 14',
        completed: false,
        priority: 'Medium',
        hoursEstimate: 2.5,
      },
      {
        title: 'Implement Node.js + Express backend with MongoDB persistence',
        category: 'Backend',
        dueDate: 'Oct 15',
        completed: false,
        priority: 'High',
        hoursEstimate: 4,
      },
      {
        title: 'Read Google Gemini API documentation for upcoming AI prompts',
        category: 'AI & Machine Learning',
        dueDate: 'Oct 16',
        completed: false,
        priority: 'Low',
        hoursEstimate: 1.5,
      },
    ];

    initialGoals.forEach((g, idx) => {
      const id = `mem_goal_${userId}_${idx}`;
      this.goals.set(id, { id, userId, ...g });
    });

    const initialActivities = [
      {
        type: 'code_practice',
        title: 'Built full-stack Express REST APIs and Auth',
        description: 'Configured User, Skill, Goal, and Activity endpoints with JWT authentication',
        timestamp: 'Just now',
        skillName: 'Node.js & REST APIs',
        xpEarned: 150,
      },
      {
        type: 'algorithm_solved',
        title: 'Solved "Lowest Common Ancestor in BST"',
        description: 'Achieved O(h) time complexity with recursive binary tree traversal',
        timestamp: '5 hours ago',
        skillName: 'Data Structures & Algorithms',
        xpEarned: 150,
      },
    ];

    initialActivities.forEach((a, idx) => {
      const id = `mem_act_${userId}_${idx}`;
      this.activities.set(id, { id, userId, ...a });
    });
  }
}

export const inMemoryDb = new InMemoryDatabase();
