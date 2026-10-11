import mongoose from 'mongoose';
import { Skill } from '../models/Skill.js';
import { Goal } from '../models/Goal.js';
import { Activity } from '../models/Activity.js';

export const seedInitialUserData = async (userId: mongoose.Types.ObjectId): Promise<void> => {
  try {
    // 1. Initial Skills
    await Skill.insertMany([
      {
        userId,
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
        userId,
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
        userId,
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
        userId,
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
        userId,
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
        userId,
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
    ]);

    // 2. Initial Weekly Goals
    await Goal.insertMany([
      {
        userId,
        title: 'Build responsive collapsible sidebar in React & Tailwind',
        category: 'Frontend',
        dueDate: 'Oct 12',
        completed: true,
        priority: 'High',
        hoursEstimate: 4,
      },
      {
        userId,
        title: 'Solve 5 LeetCode Medium problems on Binary Search Trees',
        category: 'Computer Science Core',
        dueDate: 'Oct 13',
        completed: true,
        priority: 'High',
        hoursEstimate: 3,
      },
      {
        userId,
        title: 'Complete TypeScript strict typing refactor for API service layer',
        category: 'Frontend',
        dueDate: 'Oct 14',
        completed: false,
        priority: 'Medium',
        hoursEstimate: 2.5,
      },
      {
        userId,
        title: 'Implement Node.js + Express backend with MongoDB persistence',
        category: 'Backend',
        dueDate: 'Oct 15',
        completed: false,
        priority: 'High',
        hoursEstimate: 4,
      },
      {
        userId,
        title: 'Read Google Gemini API documentation for upcoming AI prompts',
        category: 'AI & Machine Learning',
        dueDate: 'Oct 16',
        completed: false,
        priority: 'Low',
        hoursEstimate: 1.5,
      },
    ]);

    // 3. Initial Activities
    await Activity.insertMany([
      {
        userId,
        type: 'code_practice',
        title: 'Initialized MongoDB persistence architecture',
        description: 'Configured User, Skill, Goal, and Activity Mongoose collections',
        timestamp: 'Just now',
        skillName: 'Node.js & REST APIs',
        xpEarned: 150,
      },
      {
        userId,
        type: 'algorithm_solved',
        title: 'Solved "Lowest Common Ancestor in BST"',
        description: 'Achieved O(h) time complexity with recursive binary tree traversal',
        timestamp: '5 hours ago',
        skillName: 'Data Structures & Algorithms',
        xpEarned: 150,
      },
    ]);
  } catch (error) {
    console.error('[Seed Error] Failed to seed starter data for new user:', error);
  }
};
