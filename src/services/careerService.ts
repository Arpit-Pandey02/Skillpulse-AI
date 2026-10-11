import { apiClient } from './apiClient';
import type {
  CareerProfile,
  CareerRecommendation,
  DiscoveryResponses,
  UserCareerStatus,
  CareerFeedbackEntry,
  CareerStatus,
} from '../types/career';

export const careerService = {
  /**
   * Fetch all career roles with optional domain or keyword filtering
   */
  async getCatalog(domain?: string, search?: string): Promise<{ data: CareerProfile[]; domains: string[] }> {
    const params = new URLSearchParams();
    if (domain && domain !== 'All Domains') params.append('domain', domain);
    if (search && search.trim()) params.append('search', search.trim());

    const qs = params.toString() ? `?${params.toString()}` : '';
    const res = await apiClient.get<CareerProfile[]>(`/careers${qs}`);
    if (res.success && res.data) {
      return {
        data: res.data,
        domains: (res as any).domains || [],
      };
    }
    return { data: [], domains: [] };
  },

  /**
   * Fetch complete evidence, requirements, and mini-projects for a career
   */
  async getCareerById(id: string): Promise<CareerProfile | null> {
    const res = await apiClient.get<CareerProfile>(`/careers/${id}`);
    if (res.success && res.data) {
      return res.data;
    }
    return null;
  },

  /**
   * Get student's current career status, saved careers, and recommendations
   */
  async getUserStatus(): Promise<UserCareerStatus | null> {
    const res = await apiClient.get<UserCareerStatus>('/careers/user-status');
    if (res.success) {
      return {
        careerStatus: (res as any).careerStatus || 'undecided',
        selectedCareerId: (res as any).selectedCareerId || null,
        targetRole: (res as any).targetRole,
        customCareerRole: (res as any).customCareerRole || null,
        onboardingCompleted: (res as any).onboardingCompleted || false,
        discoveryResponses: (res as any).discoveryResponses || {},
        savedCareerIds: (res as any).savedCareerIds || [],
        careerFeedback: (res as any).careerFeedback || {},
        recommendations: (res as any).recommendations || [],
        geminiActive: (res as any).geminiActive || false,
        aiInsights: (res as any).aiInsights || null,
        modelUsed: (res as any).modelUsed || null,
      };
    }
    return null;
  },

  /**
   * Submit questionnaire responses and retrieve rule-based match scores
   */
  async submitDiscovery(
    responses: DiscoveryResponses,
    careerStatus: CareerStatus = 'undecided'
  ): Promise<{
    recommendations: CareerRecommendation[];
    userStatus: any;
    geminiActive?: boolean;
    modelUsed?: string | null;
    aiInsights?: any;
  }> {
    const res = await apiClient.post('/careers/recommend', {
      responses,
      careerStatus,
    });
    return {
      recommendations: (res as any).data || (res as any).recommendations || [],
      userStatus: (res as any).userStatus || null,
      geminiActive: (res as any).geminiActive || false,
      modelUsed: (res as any).modelUsed || null,
      aiInsights: (res as any).aiInsights || null,
    };
  },

  /**
   * Update feedback state (shortlisted, exploring, interesting, not_suitable)
   */
  async updateFeedback(
    careerId: string,
    status: CareerFeedbackEntry['status'],
    notes?: string
  ): Promise<{ success: boolean; savedCareerIds: string[] }> {
    const res = await apiClient.post('/careers/feedback', {
      careerId,
      status,
      notes,
    });
    return {
      success: !!res.success,
      savedCareerIds: (res as any).savedCareerIds || [],
    };
  },

  /**
   * Choose a career role (catalog career or custom role entry)
   */
  async selectCareer(
    careerId?: string,
    customRole?: string
  ): Promise<{ success: boolean; user?: any; message?: string }> {
    const res = await apiClient.post('/careers/select', {
      careerId,
      customRole,
    });
    return {
      success: !!res.success,
      user: res.user,
      message: res.message,
    };
  },

  /**
   * Record a custom unlisted career role suggestion
   */
  async suggestCustomRole(
    title: string,
    domain?: string,
    notes?: string
  ): Promise<{ success: boolean; customCareer?: any }> {
    const res = await apiClient.post('/careers/suggest-custom', {
      title,
      domain,
      notes,
    });
    return {
      success: !!res.success,
      customCareer: (res as any).customCareer,
    };
  },
};
