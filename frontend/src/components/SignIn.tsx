import { useState } from 'react';
import { Eye, EyeOff, Building2 } from 'lucide-react';
import { useAuth } from '../hooks';

interface SignInProps {
  onSwitchToSignUp: () => void;
  onSignIn: () => void;
}

export function SignIn({ onSwitchToSignUp, onSignIn }: SignInProps) {
  const { login, isLoading, error: authError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ loginId?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { loginId?: string; password?: string } = {};

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
      // Call API login
      await login({
        email: loginId,
        password: password,
      });
      
      // Navigate to dashboard on success
      onSignIn();
    } catch (err) {
      // Error is already handled in useAuth hook
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[460px]">
        {/* Auth Card */}
        <div
          className="bg-white rounded-2xl p-14 shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
          style={{ 
            borderRadius: '18px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)' 
          }}
        >
          {/* Logo & Brand */}
          <div className="flex flex-col items-center mb-12">
            <div 
              className="w-24 h-24 bg-gradient-to-br from-[#4B2A6A] to-[#B39CD0] rounded-xl flex items-center justify-center mb-6"
              style={{ boxShadow: '0 4px 12px rgba(75, 42, 106, 0.2)' }}
            >
              <Building2 className="w-14 h-14 text-white" />
            </div>
            <h2 className="text-[#1F1B2E]" style={{ fontSize: '28px', fontWeight: 600, letterSpacing: '-0.01em' }}>
              Dayflow
            </h2>
            <p className="text-[#6E6A7C] mt-2" style={{ fontSize: '21px', fontWeight: 400 }}>
              Human Resource Management System
            </p>
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-[#1F1B2E] mb-4" style={{ fontSize: '42px', fontWeight: 600, letterSpacing: '-0.02em' }}>
              Welcome back
            </h1>
            <p className="text-[#6E6A7C]" style={{ fontSize: '24px', opacity: 0.85 }}>
              Sign in to manage your workday
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Login ID Field */}
            <div>
              <label
                htmlFor="loginId"
                className="block text-[#1F1B2E] mb-3 transition-all duration-200"
                style={{
                  fontSize: '22px',
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
                className="w-full px-8 py-5 border rounded-xl bg-white transition-all duration-200 outline-none"
                style={{
                  fontSize: '24px',
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
                <p className="mt-2 text-[#D64545]" style={{ fontSize: '21px' }}>
                  {errors.loginId}
                </p>
              )}
              {!errors.loginId && (
                <p className="mt-2 text-[#6E6A7C]" style={{ fontSize: '21px', opacity: 0.75 }}>
                  Login ID is provided by your organization
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-[#1F1B2E] mb-3 transition-all duration-200"
                style={{
                  fontSize: '22px',
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
                  className="w-full px-8 py-5 pr-20 border rounded-xl bg-white transition-all duration-200 outline-none"
                  style={{
                    fontSize: '24px',
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
                  className="absolute right-7 top-1/2 -translate-y-1/2 text-[#6E6A7C] hover:text-[#2AB7CA] transition-colors"
                  tabIndex={-1}
                  style={{ opacity: 0.6 }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
                >
                  {showPassword ? (
                    <EyeOff className="w-9 h-9" />
                  ) : (
                    <Eye className="w-9 h-9" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-[#D64545]" style={{ fontSize: '21px' }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* API Error Message */}
            {authError && (
              <div className="p-5 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-[#D64545]" style={{ fontSize: '21px' }}>
                  {authError}
                </p>
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#4B2A6A] text-white rounded-xl h-20 transition-all duration-200 hover:bg-[#3E2158] active:scale-[0.98] mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                fontSize: '24px',
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
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Sign Up Link */}
            <div className="text-center pt-3">
              <p className="text-[#6E6A7C]" style={{ fontSize: '24px' }}>
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
