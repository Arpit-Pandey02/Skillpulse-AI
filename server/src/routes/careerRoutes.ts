import { Router, Response } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { isDbConnected } from '../config/db.js';
import { inMemoryDb } from '../config/inMemoryDb.js';
import { Career } from '../models/Career.js';
import { User } from '../models/User.js';
import { CAREERS_CATALOG, CAREER_DOMAINS, RawCareerData } from '../data/careersCatalog.js';
import { matchCareersRuleBased, DiscoveryResponses } from '../services/careerMatcher.js';
import { generateCareerInsights } from '../services/geminiService.js';

export const careerRouter = Router();

// 1. GET /api/careers - List all careers with filtering and search
careerRouter.get('/', async (req, res): Promise<void> => {
  try {
    const { domain, search } = req.query;

    let careersList: RawCareerData[] = [];

    if (isDbConnected()) {
      const query: any = {};
      if (domain && domain !== 'All' && domain !== 'All Domains') {
        query.domain = domain;
      }
      if (search && String(search).trim()) {
        const qRegex = { $regex: String(search).trim(), $options: 'i' };
        query.$or = [
          { title: qRegex },
          { summary: qRegex },
          { domain: qRegex },
          { description: qRegex },
          { keyActivities: qRegex },
          { workStyleTags: qRegex },
          { environmentTags: qRegex },
          { transferableSubjects: qRegex },
          { priorityTags: qRegex },
        ];
      }
      const dbCareers = await Career.find(query);
      if (dbCareers.length > 0) {
        careersList = dbCareers.map((c) => ({
          careerId: c.careerId,
          title: c.title,
          domain: c.domain,
          summary: c.summary,
          description: c.description,
          keyActivities: c.keyActivities,
          workStyleTags: c.workStyleTags,
          environmentTags: c.environmentTags,
          priorityTags: c.priorityTags,
          educationRequirement: c.educationRequirement,
          transferableSubjects: c.transferableSubjects,
          entryPathways: c.entryPathways,
          tradeoffsAndUncertainties: c.tradeoffsAndUncertainties,
          practicalMiniProjects: c.practicalMiniProjects,
          evidence: c.evidence,
        }));
      } else {
        // Fallback to static catalog if DB collection empty
        careersList = CAREERS_CATALOG;
      }
    } else {
      careersList = Array.from(inMemoryDb.careers.values());
    }

    // Apply in-memory search/filtering if needed
    if (domain && domain !== 'All' && domain !== 'All Domains') {
      careersList = careersList.filter((c) =>
        c.domain.toLowerCase().includes(String(domain).trim().toLowerCase())
      );
    }

    if (search && String(search).trim()) {
      const q = String(search).trim().toLowerCase();
      careersList = careersList.filter((c) => {
        const textCorpus = [
          c.title,
          c.domain,
          c.summary,
          c.description,
          ...(c.keyActivities || []),
          ...(c.workStyleTags || []),
          ...(c.environmentTags || []),
          ...(c.transferableSubjects || []),
          ...(c.priorityTags || []),
        ].join(' ').toLowerCase();

        return textCorpus.includes(q);
      });
    }

    res.json({
      success: true,
      domains: CAREER_DOMAINS,
      count: careersList.length,
      data: careersList,
    });
  } catch (error) {
    console.error('[Get Careers Error]', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve careers catalog.' });
  }
});

// 2. GET /api/careers/user-status - Get current student's discovery state and saved careers
careerRouter.get('/user-status', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    let userState: any = null;

    if (isDbConnected()) {
      userState = await User.findById(userId).select('-passwordHash');
    } else {
      userState = inMemoryDb.users.get(userId || '');
    }

    if (!userState) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const discoveryResponses = userState.discoveryResponses || {};
    let recommendations: any[] = [];

    // If student has answered discovery questionnaire, calculate matches
    if (discoveryResponses && Object.keys(discoveryResponses).length > 0) {
      recommendations = matchCareersRuleBased(discoveryResponses, CAREERS_CATALOG);
    } else {
      // Default initial top overview
      recommendations = matchCareersRuleBased({}, CAREERS_CATALOG);
    }

    res.json({
      success: true,
      careerStatus: userState.careerStatus || 'undecided',
      selectedCareerId: userState.selectedCareerId || null,
      targetRole: userState.targetRole,
      customCareerRole: userState.customCareerRole || null,
      onboardingCompleted: userState.onboardingCompleted || false,
      discoveryResponses,
      savedCareerIds: userState.savedCareerIds || [],
      careerFeedback: userState.careerFeedback || {},
      recommendations,
      aiInsights: userState.aiInsights || null,
      geminiActive: Boolean(userState.aiInsights),
      modelUsed: userState.modelUsed || null,
    });
  } catch (error) {
    console.error('[Get Career User Status Error]', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve career discovery status.' });
  }
});

// 3. GET /api/careers/:id - Detailed profile for a single career
careerRouter.get('/:id', async (req, res): Promise<void> => {
  try {
    const id = String(req.params.id);

    let career: RawCareerData | null = null;

    if (isDbConnected()) {
      const dbCareer = await Career.findOne({ careerId: id });
      if (dbCareer) {
        career = {
          careerId: dbCareer.careerId,
          title: dbCareer.title,
          domain: dbCareer.domain,
          summary: dbCareer.summary,
          description: dbCareer.description,
          keyActivities: dbCareer.keyActivities,
          workStyleTags: dbCareer.workStyleTags,
          environmentTags: dbCareer.environmentTags,
          priorityTags: dbCareer.priorityTags,
          educationRequirement: dbCareer.educationRequirement,
          transferableSubjects: dbCareer.transferableSubjects,
          entryPathways: dbCareer.entryPathways,
          tradeoffsAndUncertainties: dbCareer.tradeoffsAndUncertainties,
          practicalMiniProjects: dbCareer.practicalMiniProjects,
          evidence: dbCareer.evidence,
        };
      }
    }

    if (!career) {
      career = inMemoryDb.careers.get(id) || CAREERS_CATALOG.find((c) => c.careerId === id) || null;
    }

    if (!career) {
      res.status(404).json({ success: false, message: 'Career role not found in catalog.' });
      return;
    }

    res.json({ success: true, data: career });
  } catch (error) {
    console.error('[Get Career Detail Error]', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve career profile.' });
  }
});

// 3. POST /api/careers/recommend - Rule-based matching for undecided students
careerRouter.post('/recommend', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const responses: DiscoveryResponses = req.body.responses || req.body;

    // Run transparent deterministic recommendation matching first
    const recommendations = matchCareersRuleBased(responses, CAREERS_CATALOG);

    // Save questionnaire responses and set careerStatus to 'undecided' (or 'comparing' if indicated)
    const careerStatus = req.body.careerStatus || 'undecided';

    // Attempt optional Gemini AI personalized synthesis (safe fallback if key missing or call fails)
    const geminiResult = await generateCareerInsights(responses, recommendations);

    if (isDbConnected()) {
      await User.findByIdAndUpdate(userId, {
        discoveryResponses: responses,
        careerStatus,
        onboardingCompleted: true,
        aiInsights: geminiResult.insights,
        modelUsed: geminiResult.modelUsed || null,
      });
    } else {
      const user = inMemoryDb.users.get(userId || '');
      if (user) {
        user.discoveryResponses = responses;
        user.careerStatus = careerStatus;
        user.onboardingCompleted = true;
        user.aiInsights = geminiResult.insights;
        user.modelUsed = geminiResult.modelUsed;
      }
    }

    res.json({
      success: true,
      geminiActive: geminiResult.geminiActive,
      modelUsed: geminiResult.modelUsed || null,
      aiInsights: geminiResult.insights,
      recommendationsCount: recommendations.length,
      data: recommendations,
      recommendations,
      disclaimer:
        'Career recommendations are exploratory guidance based on your stated preferences. This is not a scientifically validated personality test or a guarantee of career success.',
    });
  } catch (error) {
    console.error('[Career Recommendation Error]', error);
    res.status(500).json({ success: false, message: 'Failed to generate career recommendations.' });
  }
});

// 4. POST /api/careers/feedback - Shortlist, explore, mark interesting, or not suitable
careerRouter.post('/feedback', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { careerId, status, notes } = req.body;

    if (!careerId || !status) {
      res.status(400).json({ success: false, message: 'careerId and status are required.' });
      return;
    }

    const validStatuses = ['shortlisted', 'interesting', 'exploring', 'not_suitable'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid feedback status.' });
      return;
    }

    const feedbackEntry = {
      status,
      notes: notes || '',
      updatedAt: new Date(),
    };

    let updatedFeedback: Record<string, any> = {};
    let savedCareerIds: string[] = [];

    if (isDbConnected()) {
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found.' });
        return;
      }

      user.careerFeedback = user.careerFeedback || {};
      user.careerFeedback[careerId] = feedbackEntry;

      const savedSet = new Set(user.savedCareerIds || []);
      if (status === 'shortlisted' || status === 'exploring') {
        savedSet.add(careerId);
      } else if (status === 'not_suitable') {
        savedSet.delete(careerId);
      }
      user.savedCareerIds = Array.from(savedSet);

      user.markModified('careerFeedback');
      user.markModified('savedCareerIds');
      await user.save();

      updatedFeedback = user.careerFeedback;
      savedCareerIds = user.savedCareerIds;
    } else {
      const user = inMemoryDb.users.get(userId || '');
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found.' });
        return;
      }

      user.careerFeedback = user.careerFeedback || {};
      user.careerFeedback[careerId] = {
        status,
        notes: notes || '',
        updatedAt: new Date().toISOString(),
      };

      const savedSet = new Set(user.savedCareerIds || []);
      if (status === 'shortlisted' || status === 'exploring') {
        savedSet.add(careerId);
      } else if (status === 'not_suitable') {
        savedSet.delete(careerId);
      }
      user.savedCareerIds = Array.from(savedSet);

      updatedFeedback = user.careerFeedback;
      savedCareerIds = user.savedCareerIds;
    }

    res.json({
      success: true,
      message: `Career marked as ${status}.`,
      careerFeedback: updatedFeedback,
      savedCareerIds,
    });
  } catch (error) {
    console.error('[Career Feedback Error]', error);
    res.status(500).json({ success: false, message: 'Failed to record career feedback.' });
  }
});

// 5. POST /api/careers/select - Choose a career as the student's primary path
careerRouter.post('/select', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { careerId, customRoleTitle } = req.body;

    let targetRoleTitle = customRoleTitle;
    let selectedCareer: RawCareerData | undefined;

    if (careerId) {
      selectedCareer = CAREERS_CATALOG.find((c) => c.careerId === careerId);
      if (selectedCareer) {
        targetRoleTitle = selectedCareer.title;
      }
    }

    if (!targetRoleTitle) {
      res.status(400).json({ success: false, message: 'Either a valid careerId or customRoleTitle is required.' });
      return;
    }

    if (isDbConnected()) {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          selectedCareerId: careerId || undefined,
          targetRole: targetRoleTitle,
          careerStatus: 'decided',
          onboardingCompleted: true,
          customCareerRole: customRoleTitle || undefined,
        },
        { new: true }
      ).select('-passwordHash');

      res.json({
        success: true,
        message: `Target career path updated to "${targetRoleTitle}".`,
        user: updatedUser,
      });
      return;
    }

    // In-memory fallback
    const user = inMemoryDb.users.get(userId || '');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    user.selectedCareerId = careerId || undefined;
    user.targetRole = targetRoleTitle;
    user.careerStatus = 'decided';
    user.onboardingCompleted = true;
    user.customCareerRole = customRoleTitle || undefined;

    res.json({
      success: true,
      message: `Target career path updated to "${targetRoleTitle}".`,
      user,
    });
  } catch (error) {
    console.error('[Career Select Error]', error);
    res.status(500).json({ success: false, message: 'Failed to set target career.' });
  }
});

// 6. POST /api/careers/suggest-custom - Suggest an unlisted custom career role
careerRouter.post('/suggest-custom', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { title, domain, notes } = req.body;

    if (!title || !title.trim()) {
      res.status(400).json({ success: false, message: 'Role title is required.' });
      return;
    }

    const customEntry = {
      id: `custom_${Date.now()}`,
      title: title.trim(),
      domain: domain || 'Other / Emerging Fields',
      notes: notes || '',
      suggestedBy: userId || 'anonymous',
      createdAt: new Date().toISOString(),
    };

    inMemoryDb.customCareers.set(customEntry.id, customEntry);

    res.status(201).json({
      success: true,
      message: 'Custom career path recorded successfully.',
      customCareer: customEntry,
    });
  } catch (error) {
    console.error('[Suggest Custom Career Error]', error);
    res.status(500).json({ success: false, message: 'Failed to record custom career.' });
  }
});
