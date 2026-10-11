import { apiClient } from './apiClient';
import type { RecentActivity } from '../types/activity';
export const activityService = {
  async getActivities(): Promise<RecentActivity[]> {
    const res = await apiClient.get<RecentActivity[]>('/activities');
    if (res.success && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  },
};
