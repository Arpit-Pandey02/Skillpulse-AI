import { Router, Response } from 'express';
import { Activity } from '../models/Activity.js';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { isDbConnected } from '../config/db.js';
import { inMemoryDb } from '../config/inMemoryDb.js';

export const activityRouter = Router();

activityRouter.use(authMiddleware);

// GET /api/activities - List recent activities
activityRouter.get('/', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (isDbConnected()) {
      const activities = await Activity.find({ userId })
        .sort({ createdAt: -1 })
        .limit(20);
      res.json({ success: true, count: activities.length, data: activities });
      return;
    }

    const activities = Array.from(inMemoryDb.activities.values())
      .filter((a) => a.userId === userId)
      .reverse()
      .slice(0, 20);

    res.json({ success: true, count: activities.length, data: activities });
  } catch (error) {
    console.error('[Get Activities Error]', error);
    res.status(500).json({ success: false, message: 'Failed to fetch activities.' });
  }
});
