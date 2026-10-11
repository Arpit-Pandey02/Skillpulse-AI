import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { seedInitialUserData } from '../utils/seedNewUser.js';
import { isDbConnected } from '../config/db.js';
import { inMemoryDb } from '../config/inMemoryDb.js';
import type { MemoryUser, CareerStatus } from '../config/inMemoryDb.js';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_skillpulse_dev_2026';

// Register a new student
authRouter.post('/register', async (req, res): Promise<void> => {
  try {
    const { name, email, password, university, major, academicYear, targetRole } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isDbConnected()) {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        res.status(409).json({ success: false, message: 'An account with this email already exists.' });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = new User({
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        university: university || 'University of Washington',
        major: major || 'Computer Science & Software Engineering',
        academicYear: academicYear || 'Sophomore (Year 2)',
        targetRole: targetRole || 'Full-Stack AI Software Engineer',
      });

      await user.save();
      // Fresh students start with empty skills and goals until they intentionally add or select them

      const token = jwt.sign(
        { userId: user._id.toString(), email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          university: user.university,
          major: user.major,
          academicYear: user.academicYear,
          targetRole: user.targetRole,
          streakDays: user.streakDays,
          bio: user.bio,
        },
      });
      return;
    }

    // In-memory fallback mode
    const existing = Array.from(inMemoryDb.users.values()).find((u) => u.email === cleanEmail);
    if (existing) {
      res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    const newId = `user_${Date.now()}`;
    const passwordHash = await bcrypt.hash(password, 10);
    const initialCareerStatus: CareerStatus = 'undecided';

    const memoryUser: MemoryUser = {
      id: newId,
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
      university: university || 'University of Washington',
      major: major || 'Computer Science & Software Engineering',
      academicYear: academicYear || 'Sophomore (Year 2)',
      targetRole: targetRole || 'Undecided / Exploring Careers',
      careerStatus: initialCareerStatus,
      onboardingCompleted: false,
      savedCareerIds: [],
      careerFeedback: {},
      bio: 'Student exploring careers and building verified competencies.',
      streakDays: 1,
      totalHoursLearned: 0,
      overallMasteryPercent: 0,
      completedGoalsCount: 0,
    };

    inMemoryDb.users.set(newId, memoryUser);
    // Fresh students start with empty skills and goals until they intentionally add or select them

    const token = jwt.sign({ userId: newId, email: cleanEmail }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      token,
      user: memoryUser,
    });
  } catch (error) {
    console.error('[Register Error]', error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});

// Log in existing student
authRouter.post('/login', async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isDbConnected()) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        res.status(401).json({ success: false, message: 'Invalid email or password.' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid email or password.' });
        return;
      }

      const token = jwt.sign(
        { userId: user._id.toString(), email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          university: user.university,
          major: user.major,
          academicYear: user.academicYear,
          targetRole: user.targetRole,
          streakDays: user.streakDays,
          bio: user.bio,
        },
      });
      return;
    }

    // In-memory fallback
    const memUser = Array.from(inMemoryDb.users.values()).find((u) => u.email === cleanEmail);
    if (!memUser) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, memUser.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = jwt.sign({ userId: memUser.id, email: memUser.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      success: true,
      token,
      user: memUser,
    });
  } catch (error) {
    console.error('[Login Error]', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// Get current student profile
authRouter.get('/me', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (isDbConnected()) {
      const user = await User.findById(userId).select('-passwordHash');
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found.' });
        return;
      }

      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          university: user.university,
          major: user.major,
          academicYear: user.academicYear,
          targetRole: user.targetRole,
          streakDays: user.streakDays,
          bio: user.bio,
          totalHoursLearned: user.totalHoursLearned,
          overallMasteryPercent: user.overallMasteryPercent,
        },
      });
      return;
    }

    // In-memory fallback
    const memUser = inMemoryDb.users.get(userId || '');
    if (!memUser) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    res.json({
      success: true,
      user: memUser,
    });
  } catch (error) {
    console.error('[/me Error]', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve profile.' });
  }
});
