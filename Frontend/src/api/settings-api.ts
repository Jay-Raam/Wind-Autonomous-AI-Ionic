/**
 * Settings API Service
 * Handles user settings-related API calls
 */

import { httpClient } from './http-client';
import { UserSettings } from '../types/index';

export const settingsApi = {
  async getSettings(): Promise<UserSettings> {
    return httpClient.get<UserSettings>('/settings');
  },

  async updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    return httpClient.put<UserSettings>('/settings', settings);
  },
};
