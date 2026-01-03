/**
 * Environment Configuration
 * Loads environment variables for the application
 */

export const config = {
  // API Base URL
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  
  // API Endpoints Base
  apiPrefix: '/api',
  
  // Authentication
  tokenKey: 'dayflow_auth_token',
  userKey: 'dayflow_user',
  
  // App Info
  appName: 'Dayflow',
  appVersion: '1.0.0',
} as const;

export default config;
