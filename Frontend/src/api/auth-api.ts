/**
 * Auth API Service
 * Handles all authentication-related API calls
 */

import { httpClient } from './http-client';
import { User, AuthTokens } from '../types/index';

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  name: string;
  password: string;
}

export const authApi = {
  async register(input: RegisterInput): Promise<AuthTokens> {
    return httpClient.post<AuthTokens>('/auth/register', input);
  },

  async login(input: LoginInput): Promise<AuthTokens> {
    return httpClient.post<AuthTokens>('/auth/login', input);
  },

  async refresh(refreshToken: string): Promise<AuthTokens> {
    return httpClient.post<AuthTokens>('/auth/refresh', { refreshToken });
  },

  async getMe(): Promise<User> {
    return httpClient.get<User>('/auth/me');
  },

  async logout(): Promise<void> {
    await httpClient.post('/auth/logout', {});
  },
};
