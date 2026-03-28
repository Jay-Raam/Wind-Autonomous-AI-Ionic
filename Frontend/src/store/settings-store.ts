/**
 * Settings Store (Zustand)
 * Manages user settings state
 */

import { create } from 'zustand';
import { UserSettings, AiModel } from '../types/index';
import { settingsApi } from '../api/settings-api';
import { storageUtils } from '../utils/storage';

interface SettingsState {
  settings: UserSettings | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadSettings: () => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  setAiModel: (model: AiModel) => Promise<void>;
  setTemperature: (temperature: number) => Promise<void>;
  setRequireToolApproval: (required: boolean) => Promise<void>;
  setAutonomousMode: (enabled: boolean) => Promise<void>;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export const useSettingsStore = create<SettingsState>((set: any, get: any) => ({
  settings: null,
  isLoading: false,
  error: null,

  loadSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const settings = await settingsApi.getSettings();
      await storageUtils.cacheSettings(settings);
      set({ settings, isLoading: false });
    } catch (error) {
      // Try to load from cache
      const cached = await storageUtils.getCachedSettings();
      if (cached) {
        set({ settings: cached, isLoading: false });
      } else {
        const message = error instanceof Error ? error.message : 'Failed to load settings';
        set({ error: message, isLoading: false });
      }
    }
  },

  updateSettings: async (updates: Partial<UserSettings>) => {
    set({ isLoading: true, error: null });
    try {
      const currentSettings = get().settings;
      const newSettings = { ...currentSettings, ...updates } as UserSettings;
      
      const updated = await settingsApi.updateSettings(updates);
      await storageUtils.cacheSettings(updated);
      set({ settings: updated, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update settings';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  setAiModel: async (model: AiModel) => {
    return get().updateSettings({ aiModel: model });
  },

  setTemperature: async (temperature: number) => {
    return get().updateSettings({ temperature });
  },

  setRequireToolApproval: async (required: boolean) => {
    return get().updateSettings({ requireToolApproval: required });
  },

  setAutonomousMode: async (enabled: boolean) => {
    return get().updateSettings({ autonomousMode: enabled });
  },

  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
  reset: () => set({
    settings: null,
    isLoading: false,
    error: null,
  }),
}));
