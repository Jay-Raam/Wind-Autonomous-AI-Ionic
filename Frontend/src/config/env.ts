/**
 * Environment Configuration
 * Handles development and production API endpoints
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const ENV = import.meta.env.MODE || 'development';

export const env = {
  API_BASE_URL,
  ENV,
  isDev: ENV === 'development',
  isProd: ENV === 'production',
  // Token keys
  ACCESS_TOKEN_KEY: 'access_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
} as const;

export default env;
