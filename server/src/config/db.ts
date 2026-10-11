import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async (): Promise<boolean> => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/student_skills_tracker';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s if MongoDB not available
    });

    isConnected = true;
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    await ensureDefaultData();
    return true;
  } catch (error: any) {
    isConnected = false;
    const sanitizedUri = uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
    const sanitizedError = (error?.message || String(error)).replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
    console.warn(
      `[MongoDB Warning] Could not connect to MongoDB at "${sanitizedUri}".\n` +
      `Error: ${sanitizedError}\n` +
      `Tip for Senior Dev / Student: Check network connectivity, IP whitelist on MongoDB Atlas, or start local MongoDB.\n` +
      `The server will still run and gracefully handle requests.`
    );
    return false;
  }
};

const ensureDefaultData = async (): Promise<void> => {
  try {
    const { User } = await import('../models/User.js');
    const { Career } = await import('../models/Career.js');
    const { CAREERS_CATALOG } = await import('../data/careersCatalog.js');
    const { seedInitialUserData } = await import('../utils/seedNewUser.js');
    const bcrypt = (await import('bcryptjs')).default;

    // 1. Ensure careers catalog is seeded in MongoDB collection
    const careersCount = await Career.countDocuments();
    if (careersCount === 0) {
      await Career.insertMany(CAREERS_CATALOG);
      console.log(`[MongoDB] Initialized ${CAREERS_CATALOG.length} multi-domain careers in database.`);
    }

    // 2. Ensure demo student (Alex Chen) exists for 1-click evaluation
    const demoEmail = 'alex.chen@university.edu';
    const existingDemo = await User.findOne({ email: demoEmail });
    if (!existingDemo) {
      const passwordHash = await bcrypt.hash('student123', 10);
      const demoUser = await User.create({
        name: 'Alex Chen',
        email: demoEmail,
        passwordHash,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
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
            updatedAt: new Date(),
          },
        },
        bio: 'Second-year CS student diving deep into full-stack systems, clean code, and practical machine learning architectures.',
        streakDays: 14,
        totalHoursLearned: 186.5,
        overallMasteryPercent: 74,
        completedGoalsCount: 38,
      });

      await seedInitialUserData(demoUser._id as any);
      console.log(`[MongoDB] Initialized default demo student profile (${demoEmail}) in database.`);
    }
  } catch (err) {
    console.error('[MongoDB Warning] Could not ensure default collections:', err);
  }
};

export const isDbConnected = (): boolean => isConnected;
