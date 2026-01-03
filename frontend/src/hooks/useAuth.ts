/**
 * useAuth Hook
 * Custom hook for managing authentication state
 */

import { useState, useEffect, useCallback } from 'react';
import { AuthService } from '../services';
import type { User, LoginRequest, RegisterRequest } from '../types/api.types';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize user from localStorage
  useEffect(() => {
    const savedUser = AuthService.getUser();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await AuthService.login(credentials);
      setUser(response.user);
      // Login successful - error will NOT be thrown
    } catch (err: any) {
      const errorMessage = err?.message || 'Invalid email or password';
      setError(errorMessage);
      // Re-throw error to prevent navigation in component
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (data: RegisterRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await AuthService.register(data);
      setUser(response.user);
      // Registration successful - error will NOT be thrown
    } catch (err: any) {
      const errorMessage = err?.message || 'Registration failed. User may already exist.';
      setError(errorMessage);
      // Re-throw error to prevent navigation in component
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    AuthService.logout();
    setUser(null);
    setError(null);
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const userData = await AuthService.getCurrentUser();
      setUser(userData);
    } catch (err: any) {
      console.error('Failed to refresh user:', err);
      // If token is invalid, logout
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshUser,
    clearError,
  };
}

export default useAuth;
