import { apiClient } from './apiClient';
import type { WeeklyGoal } from '../types/activity';
export const goalService = {
  async getGoals(): Promise<WeeklyGoal[]> {
    const res = await apiClient.get<WeeklyGoal[]>('/goals');
    if (res.success && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  },

  async createGoal(data: Partial<WeeklyGoal>): Promise<{ success: boolean; data?: WeeklyGoal; message?: string }> {
    const res = await apiClient.post<WeeklyGoal>('/goals', data);
    return {
      success: res.success,
      data: res.data,
      message: res.message,
    };
  },

  async toggleGoal(goalId: string): Promise<{ success: boolean; data?: WeeklyGoal }> {
    const res = await apiClient.patch<WeeklyGoal>(`/goals/${goalId}/toggle`);
    return {
      success: res.success,
      data: res.data,
    };
  },

  async deleteGoal(goalId: string): Promise<boolean> {
    const res = await apiClient.delete(`/goals/${goalId}`);
    return res.success;
  },
};
