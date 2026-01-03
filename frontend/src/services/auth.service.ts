/**
 * Authentication Service
 * Handles all auth-related API calls and token management
 */

import apiClient from './api.client';
import config from '../config/env';
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  User,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from '../types/api.types';

export class AuthService {
  /**
   * Register a new user
   */
  static async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>('/auth/register', data);
    
    // Save token and user to localStorage
    if (response.data.token) {
      this.setToken(response.data.token);
      this.setUser(response.data.user);
    }
    
    return response.data;
  }

  /**
   * Login user
   */
  static async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    
    // Save token and user to localStorage
    if (response.data.token) {
      this.setToken(response.data.token);
      this.setUser(response.data.user);
    }
    
    return response.data;
  }

  /**
   * Get current user info
   */
  static async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    
    // Update user in localStorage
    this.setUser(response.data);
    
    return response.data;
  }

  /**
   * Change password
   */
  static async changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    const response = await apiClient.put<ChangePasswordResponse>('/auth/change-password', data);
    return response.data;
  }

  /**
   * Logout user
   */
  static logout(): void {
    this.clearAuth();
    // Redirect to login page
    window.location.href = '/';
  }

  // ============================================================================
  // Token Management
  // ============================================================================

  /**
   * Save token to localStorage
   */
  static setToken(token: string): void {
    localStorage.setItem(config.tokenKey, token);
  }

  /**
   * Get token from localStorage
   */
  static getToken(): string | null {
    return localStorage.getItem(config.tokenKey);
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Save user to localStorage
   */
  static setUser(user: User): void {
    localStorage.setItem(config.userKey, JSON.stringify(user));
  }

  /**
   * Get user from localStorage
   */
  static getUser(): User | null {
    const userStr = localStorage.getItem(config.userKey);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr) as User;
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
      return null;
    }
  }

  /**
   * Clear all auth data
   */
  static clearAuth(): void {
    localStorage.removeItem(config.tokenKey);
    localStorage.removeItem(config.userKey);
  }
}

export default AuthService;
