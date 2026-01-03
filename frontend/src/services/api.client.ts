/**
 * API Client - Axios instance with interceptors
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import config from '../config/env';
import type { ApiErrorResponse } from '../types/api.types';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: `${config.apiBaseUrl}${config.apiPrefix}`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (requestConfig: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(config.tokenKey);
    
    if (token && requestConfig.headers) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    
    return requestConfig;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem(config.tokenKey);
          localStorage.removeItem(config.userKey);
          window.location.href = '/';
          break;
          
        case 403:
          // Forbidden
          console.error('Access forbidden:', data?.message || 'You do not have permission');
          break;
          
        case 404:
          // Not found
          console.error('Resource not found:', data?.message);
          break;
          
        case 500:
          // Server error
          console.error('Server error:', data?.message || 'Internal server error');
          break;
          
        default:
          console.error('API Error:', data?.message || 'An error occurred');
      }
      
      return Promise.reject({
        message: data?.message || data?.error || 'An error occurred',
        statusCode: status,
        error: data,
      });
    } else if (error.request) {
      // Request made but no response
      console.error('No response from server:', error.message);
      return Promise.reject({
        message: 'No response from server. Please check your connection.',
        error: error.message,
      });
    } else {
      // Something else happened
      console.error('Request error:', error.message);
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
        error: error.message,
      });
    }
  }
);

export default apiClient;
