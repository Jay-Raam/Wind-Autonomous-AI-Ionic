/**
 * Secure Storage Utilities
 * Handles token and user data persistence using Capacitor Storage
 */

import { Storage } from '@capacitor/storage';
import { AuthTokens } from '../types/index';
import { env } from '../config/env';

export const storageUtils = {
  // ============ Tokens ============
  async saveTokens(tokens: AuthTokens): Promise<void> {
    await Promise.all([
      Storage.set({
        key: env.ACCESS_TOKEN_KEY,
        value: tokens.accessToken,
      }),
      Storage.set({
        key: env.REFRESH_TOKEN_KEY,
        value: tokens.refreshToken,
      }),
    ]);
  },

  async getAccessToken(): Promise<string | null> {
    const result = await Storage.get({ key: env.ACCESS_TOKEN_KEY });
    return result.value;
  },

  async getRefreshToken(): Promise<string | null> {
    const result = await Storage.get({ key: env.REFRESH_TOKEN_KEY });
    return result.value;
  },

  async getTokens(): Promise<AuthTokens | null> {
    const [accessResult, refreshResult] = await Promise.all([
      Storage.get({ key: env.ACCESS_TOKEN_KEY }),
      Storage.get({ key: env.REFRESH_TOKEN_KEY }),
    ]);

    if (!accessResult.value || !refreshResult.value) {
      return null;
    }

    return {
      accessToken: accessResult.value,
      refreshToken: refreshResult.value,
    };
  },

  async clearTokens(): Promise<void> {
    await Promise.all([
      Storage.remove({ key: env.ACCESS_TOKEN_KEY }),
      Storage.remove({ key: env.REFRESH_TOKEN_KEY }),
    ]);
  },

  // ============ User Data ============
  async saveUser(user: any): Promise<void> {
    await Storage.set({
      key: 'user',
      value: JSON.stringify(user),
    });
  },

  async getUser(): Promise<any | null> {
    const result = await Storage.get({ key: 'user' });
    return result.value ? JSON.parse(result.value) : null;
  },

  async clearUser(): Promise<void> {
    await Storage.remove({ key: 'user' });
  },

  // ============ Settings Cache ============
  async cacheSettings(settings: any): Promise<void> {
    await Storage.set({
      key: 'user_settings',
      value: JSON.stringify(settings),
    });
  },

  async getCachedSettings(): Promise<any | null> {
    const result = await Storage.get({ key: 'user_settings' });
    return result.value ? JSON.parse(result.value) : null;
  },

  async clearCachedSettings(): Promise<void> {
    await Storage.remove({ key: 'user_settings' });
  },

  // ============ Clear All ============
  async clearAll(): Promise<void> {
    const keys = [
      env.ACCESS_TOKEN_KEY,
      env.REFRESH_TOKEN_KEY,
      'user',
      'user_settings',
    ];
    await Promise.all(keys.map((key) => Storage.remove({ key })));
  },
};
