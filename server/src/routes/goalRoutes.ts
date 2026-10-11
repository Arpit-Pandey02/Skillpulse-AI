import { Router, Response } from 'express';
import { Goal } from '../models/Goal.js';
import { User } from '../models/User.js';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { isDbConnected } from '../config/db.js';
import { inMemoryDb } from '../config/inMemoryDb.js';

export const goalRouter = Router();

goalRouter.use(authMiddleware);

// GET /api/goals - List user's goals
goalRouter.get('/', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (isDbConnected()) {
      const goals = await Goal.find({ userId }).sort({ createdAt: -1 });
      res.json({ success: true, count: goals.length, data: goals });
      return;
    }

    const goals = Array.from(inMemoryDb.goals.values()).filter((g) => g.userId === userId);
    res.json({ success: true, count: goals.length, data: goals });
  } catch (error) {
    console.error('[Get Goals Error]', error);
    res.status(500).json({ success: false, message: 'Failed to fetch goals.' });
  }
});

// POST /api/goals - Create new weekly goal
goalRouter.post('/', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { title, category, dueDate, priority, hoursEstimate } = req.body;

    if (!title) {
      res.status(400).json({ success: false, message: 'Goal title is required.' });
      return;
    }

    if (isDbConnected()) {
      const goal = new Goal({
        userId,
        title: title.trim(),
        category: category || 'Frontend',
        dueDate: dueDate || 'This Week',
        priority: priority || 'Medium',
        hoursEstimate: Number(hoursEstimate) || 2,
        completed: false,
      });

      await goal.save();
      res.status(201).json({ success: true, data: goal });
      return;
    }

    const id = `mem_goal_${Date.now()}`;
    const newGoal = {
      id,
      userId: userId || 'std_demo_alex',
      title: title.trim(),
      category: category || 'Frontend',
      dueDate: dueDate || 'This Week',
      priority: priority || 'Medium',
      hoursEstimate: Number(hoursEstimate) || 2,
      completed: false,
    };

    inMemoryDb.goals.set(id, newGoal);
    res.status(201).json({ success: true, data: newGoal });
  } catch (error) {
    console.error('[Create Goal Error]', error);
    res.status(500).json({ success: false, message: 'Failed to create goal.' });
  }
});

// PATCH /api/goals/:id/toggle - Toggle goal completion
goalRouter.patch('/:id/toggle', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const goalId = String(req.params.id);

    if (isDbConnected()) {
      const goal = await Goal.findOne({ _id: goalId, userId });
      if (!goal) {
        res.status(404).json({ success: false, message: 'Goal not found.' });
        return;
      }

      goal.completed = !goal.completed;
      await goal.save();

      const completedCount = await Goal.countDocuments({ userId, completed: true });
      await User.findByIdAndUpdate(userId, { completedGoalsCount: completedCount });

      res.json({ success: true, data: goal });
      return;
    }

    const memGoal = inMemoryDb.goals.get(goalId);
    if (!memGoal || memGoal.userId !== userId) {
      res.status(404).json({ success: false, message: 'Goal not found.' });
      return;
    }

    memGoal.completed = !memGoal.completed;
    inMemoryDb.goals.set(goalId, memGoal);

    const user = inMemoryDb.users.get(userId || '');
    if (user) {
      const userGoals = Array.from(inMemoryDb.goals.values()).filter((g) => g.userId === userId);
      user.completedGoalsCount = userGoals.filter((g) => g.completed).length;
    }

    res.json({ success: true, data: memGoal });
  } catch (error) {
    console.error('[Toggle Goal Error]', error);
    res.status(500).json({ success: false, message: 'Failed to toggle goal.' });
  }
});

// DELETE /api/goals/:id - Delete goal
goalRouter.delete('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const goalId = String(req.params.id);

    if (isDbConnected()) {
      const goal = await Goal.findOneAndDelete({ _id: goalId, userId });
      if (!goal) {
        res.status(404).json({ success: false, message: 'Goal not found.' });
        return;
      }

      res.json({ success: true, message: 'Goal deleted successfully.' });
      return;
    }

    const memGoal = inMemoryDb.goals.get(goalId);
    if (!memGoal || memGoal.userId !== userId) {
      res.status(404).json({ success: false, message: 'Goal not found.' });
      return;
    }

    inMemoryDb.goals.delete(goalId);
    res.json({ success: true, message: 'Goal deleted successfully.' });
  } catch (error) {
    console.error('[Delete Goal Error]', error);
    res.status(500).json({ success: false, message: 'Failed to delete goal.' });
  }
});
