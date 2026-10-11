import { apiClient } from './apiClient';
import type { Skill } from '../types/skill';
export const skillService = {
  async getSkills(): Promise<Skill[]> {
    const res = await apiClient.get<Skill[]>('/skills');
    if (res.success && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  },

  async createSkill(data: Partial<Skill>): Promise<{ success: boolean; data?: Skill; message?: string }> {
    const res = await apiClient.post<Skill>('/skills', data);
    return {
      success: res.success,
      data: res.data,
      message: res.message,
    };
  },

  async logPractice(
    skillId: string,
    hours: number,
    notes?: string
  ): Promise<{ success: boolean; skill?: Skill; activity?: any; message?: string }> {
    const res = await apiClient.post(`/skills/${skillId}/practice`, {
      hours,
      notes,
    });
    return {
      success: res.success,
      skill: res.skill,
      activity: res.activity,
      message: res.message,
    };
  },

  async deleteSkill(skillId: string): Promise<boolean> {
    const res = await apiClient.delete(`/skills/${skillId}`);
    return res.success;
  },
};
