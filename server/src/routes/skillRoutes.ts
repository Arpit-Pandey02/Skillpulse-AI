import { Router, Response } from 'express';
import { Skill } from '../models/Skill.js';
import { Activity } from '../models/Activity.js';
import { User } from '../models/User.js';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { isDbConnected } from '../config/db.js';
import { inMemoryDb } from '../config/inMemoryDb.js';

export const skillRouter = Router();

skillRouter.use(authMiddleware);

// GET /api/skills - List user's skills
skillRouter.get('/', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (isDbConnected()) {
      const skills = await Skill.find({ userId }).sort({ updatedAt: -1 });
      res.json({ success: true, count: skills.length, data: skills });
      return;
    }

    const skills = Array.from(inMemoryDb.skills.values()).filter((s) => s.userId === userId);
    res.json({ success: true, count: skills.length, data: skills });
  } catch (error) {
    console.error('[Get Skills Error]', error);
    res.status(500).json({ success: false, message: 'Failed to fetch skills.' });
  }
});

// POST /api/skills - Add a new skill
skillRouter.post('/', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { name, category, level, targetHours, tags, color, badgeText } = req.body;

    if (!name || !category) {
      res.status(400).json({ success: false, message: 'Skill name and category are required.' });
      return;
    }

    const tagList = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map((t: string) => t.trim())
      : ['Foundations'];

    if (isDbConnected()) {
      const skill = new Skill({
        userId,
        name: name.trim(),
        category,
        level: level || 'Beginner',
        targetHours: parseInt(targetHours) || 40,
        hoursSpent: 0,
        progressPercent: 0,
        lastPracticed: 'Just added',
        verifiedProjectsCount: 0,
        tags: tagList,
        color: color || '#6366F1',
        badgeText: badgeText || undefined,
      });

      await skill.save();
      res.status(201).json({ success: true, data: skill });
      return;
    }

    const id = `mem_skill_${Date.now()}`;
    const newSkill = {
      id,
      userId: userId || 'std_demo_alex',
      name: name.trim(),
      category,
      level: level || 'Beginner',
      progressPercent: 0,
      hoursSpent: 0,
      targetHours: parseInt(targetHours) || 40,
      lastPracticed: 'Just added',
      verifiedProjectsCount: 0,
      tags: tagList,
      color: color || '#6366F1',
      badgeText,
    };

    inMemoryDb.skills.set(id, newSkill);
    res.status(201).json({ success: true, data: newSkill });
  } catch (error) {
    console.error('[Create Skill Error]', error);
    res.status(500).json({ success: false, message: 'Failed to create skill.' });
  }
});

// POST /api/skills/:id/practice - Log a practice session
skillRouter.post('/:id/practice', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const skillId = String(req.params.id);
    const { hours, notes } = req.body;
    const sessionHours = parseFloat(hours) || 1;

    if (isDbConnected()) {
      const skill = await Skill.findOne({ _id: skillId, userId });
      if (!skill) {
        res.status(404).json({ success: false, message: 'Skill not found.' });
        return;
      }

      const newHoursSpent = skill.hoursSpent + sessionHours;
      const newProgress = Math.min(Math.round((newHoursSpent / skill.targetHours) * 100), 100);

      skill.hoursSpent = newHoursSpent;
      skill.progressPercent = newProgress;
      skill.lastPracticed = 'Just now';
      await skill.save();

      const activity = new Activity({
        userId,
        type: 'code_practice',
        title: `Practiced ${skill.name} (${sessionHours} hrs)`,
        description: notes || `Deliberate practice on ${skill.tags.slice(0, 3).join(', ') || skill.category}`,
        timestamp: 'Just now',
        skillName: skill.name,
        xpEarned: Math.round(sessionHours * 50),
      });
      await activity.save();

      await User.findByIdAndUpdate(userId, {
        $inc: { totalHoursLearned: sessionHours },
      });

      res.json({
        success: true,
        message: 'Practice session logged successfully!',
        skill,
        activity,
      });
      return;
    }

    const memSkill = inMemoryDb.skills.get(skillId);
    if (!memSkill || memSkill.userId !== userId) {
      res.status(404).json({ success: false, message: 'Skill not found.' });
      return;
    }

    memSkill.hoursSpent += sessionHours;
    memSkill.progressPercent = Math.min(
      Math.round((memSkill.hoursSpent / memSkill.targetHours) * 100),
      100
    );
    memSkill.lastPracticed = 'Just now';
    inMemoryDb.skills.set(skillId, memSkill);

    const actId = `mem_act_${Date.now()}`;
    const newAct = {
      id: actId,
      userId: userId || 'std_demo_alex',
      type: 'code_practice',
      title: `Practiced ${memSkill.name} (${sessionHours} hrs)`,
      description: notes || `Deliberate practice session on ${memSkill.category}`,
      timestamp: 'Just now',
      skillName: memSkill.name,
      xpEarned: Math.round(sessionHours * 50),
    };
    inMemoryDb.activities.set(actId, newAct);

    const user = inMemoryDb.users.get(userId || '');
    if (user) {
      user.totalHoursLearned += sessionHours;
    }

    res.json({
      success: true,
      message: 'Practice session logged successfully!',
      skill: memSkill,
      activity: newAct,
    });
  } catch (error) {
    console.error('[Practice Session Error]', error);
    res.status(500).json({ success: false, message: 'Failed to log practice session.' });
  }
});

// DELETE /api/skills/:id
skillRouter.delete('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const skillId = String(req.params.id);

    if (isDbConnected()) {
      const skill = await Skill.findOneAndDelete({ _id: skillId, userId });
      if (!skill) {
        res.status(404).json({ success: false, message: 'Skill not found.' });
        return;
      }
      res.json({ success: true, message: 'Skill deleted successfully.' });
      return;
    }

    const memSkill = inMemoryDb.skills.get(skillId);
    if (!memSkill || memSkill.userId !== userId) {
      res.status(404).json({ success: false, message: 'Skill not found.' });
      return;
    }

    inMemoryDb.skills.delete(skillId);
    res.json({ success: true, message: 'Skill deleted successfully.' });
  } catch (error) {
    console.error('[Delete Skill Error]', error);
    res.status(500).json({ success: false, message: 'Failed to delete skill.' });
  }
});
