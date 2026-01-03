/**
 * SignInPage - User authentication page
 */

import { useState } from 'react';
import { Eye, EyeOff, Building2 } from 'lucide-react';
import { useAuth } from '../hooks';

interface SignInPageProps {
  onSwitchToSignUp: () => void;
  onSignIn: () => void;
}

interface FormErrors {
  loginId?: string;
  password?: string;
}

export function SignInPage({ onSwitchToSignUp, onSignIn }: SignInPageProps) {
  const { login, isLoading, error: authError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    if (!loginId) {
      newErrors.loginId = 'Login ID is required';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      console.log('SignInPage: Starting login process...');
      
      // Call API login
      await login({
        email: loginId,
        password: password,
      });
      
      console.log('SignInPage: Login completed, checking localStorage...');
      
      // Verify authentication before navigating
      const isAuth = await new Promise(resolve => {
        setTimeout(() => {
          const token = localStorage.getItem('dayflow_auth_token');
          const user = localStorage.getItem('dayflow_user');
          console.log('SignInPage: Auth check -', { hasToken: !!token, hasUser: !!user });
          resolve(!!token && !!user);
        }, 100);
      });
      
      if (isAuth) {
        console.log('SignInPage: Authentication verified, calling onSignIn()');
        onSignIn();
      } else {
        console.error('SignInPage: Authentication verification failed - token or user not found in localStorage');
        // Show error to user
        alert('Login failed: Authentication could not be verified. Please try again.');
      }
    } catch (err) {
      // Error is already handled in useAuth hook
      // Do NOT navigate to dashboard on error
      console.error('SignInPage: Login failed with error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[460px]">
        <div
          className="bg-white rounded-2xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
          style={{ 
            borderRadius: '18px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)' 
          }}
        >
          {/* Logo & Brand */}
          <div className="flex flex-col items-center mb-10">
            <div 
              className="w-14 h-14 bg-gradient-to-br from-[#4B2A6A] to-[#B39CD0] rounded-xl flex items-center justify-center mb-3"
              style={{ boxShadow: '0 4px 12px rgba(75, 42, 106, 0.2)' }}
            >
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-[#1F1B2E]" style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '-0.01em' }}>
              Dayflow
            </h2>
            <p className="text-[#6E6A7C] mt-0.5" style={{ fontSize: '12px', fontWeight: 400 }}>
              Human Resource Management System
            </p>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-[#1F1B2E] mb-3" style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.02em' }}>
              Welcome back
            </h1>
            <p className="text-[#6E6A7C]" style={{ fontSize: '14px', opacity: 0.85 }}>
              Sign in to manage your workday
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Login ID Field */}
            <div>
              <label
                htmlFor="loginId"
                className="block text-[#1F1B2E] mb-2 transition-all duration-200"
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: focusedField === 'loginId' || loginId ? '#2AB7CA' : '#1F1B2E',
                }}
              >
                Login ID / Email
              </label>
              <input
                id="loginId"
                type="text"
                value={loginId}
                onChange={(e) => {
                  setLoginId(e.target.value);
                  if (errors.loginId) {
                    setErrors({ ...errors, loginId: undefined });
                  }
                }}
                onFocus={() => setFocusedField('loginId')}
                onBlur={() => setFocusedField(null)}
                className="w-full px-4 py-3 border rounded-xl bg-white transition-all duration-200 outline-none"
                style={{
                  fontSize: '14px',
                  borderColor: errors.loginId
                    ? '#D64545'
                    : focusedField === 'loginId'
                    ? '#2AB7CA'
                    : '#E2E0EA',
                  boxShadow:
                    focusedField === 'loginId'
                      ? '0 0 0 3px rgba(42, 183, 202, 0.1)'
                      : 'none',
                }}
                placeholder="Enter your login ID or email"
              />
              {errors.loginId && (
                <p className="mt-1.5 text-[#D64545]" style={{ fontSize: '12px' }}>
                  {errors.loginId}
                </p>
              )}
              {!errors.loginId && (
                <p className="mt-1.5 text-[#6E6A7C]" style={{ fontSize: '12px', opacity: 0.75 }}>
                  Login ID is provided by your organization
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-[#1F1B2E] mb-2 transition-all duration-200"
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: focusedField === 'password' || password ? '#2AB7CA' : '#1F1B2E',
                }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors({ ...errors, password: undefined });
                    }
                  }}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-4 py-3 pr-12 border rounded-xl bg-white transition-all duration-200 outline-none"
                  style={{
                    fontSize: '14px',
                    borderColor: errors.password
                      ? '#D64545'
                      : focusedField === 'password'
                      ? '#2AB7CA'
                      : '#E2E0EA',
                    boxShadow:
                      focusedField === 'password'
                        ? '0 0 0 3px rgba(42, 183, 202, 0.1)'
                        : 'none',
                  }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6E6A7C] hover:text-[#2AB7CA] transition-colors"
                  tabIndex={-1}
                  style={{ opacity: 0.6 }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-[#D64545]" style={{ fontSize: '12px' }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-[#4B2A6A] text-white rounded-xl h-12 transition-all duration-200 hover:bg-[#3E2158] active:scale-[0.98] mt-6"
              style={{
                fontSize: '14px',
                fontWeight: 500,
                boxShadow: '0 2px 8px rgba(75, 42, 106, 0.25), 0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(75, 42, 106, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(75, 42, 106, 0.25), 0 1px 3px rgba(0, 0, 0, 0.1)';
              }}
            >
              Sign In
            </button>

            {/* Sign Up Link */}
            <div className="text-center pt-2">
              <p className="text-[#6E6A7C]" style={{ fontSize: '14px' }}>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToSignUp}
                  className="text-[#2AB7CA] hover:text-[#239BAA] transition-all duration-200 hover:underline underline-offset-2"
                  style={{ fontWeight: 500 }}
                >
                  Sign Up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
