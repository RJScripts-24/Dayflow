import { useState, useRef } from 'react';
import { Eye, EyeOff, Building2, Upload, X } from 'lucide-react';
import { useAuth } from '../hooks';

interface SignUpProps {
  onSwitchToSignIn: () => void;
  onSignUp: () => void;
}

export function SignUp({ onSwitchToSignIn, onSignUp }: SignUpProps) {
  const { register, isLoading, error: authError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    companyName: '',
    logo: null as File | null,
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, logo: file });
      if (errors.logo) {
        setErrors({ ...errors, logo: '' });
      }
    }
  };

  const handleRemoveLogo = () => {
    setFormData({ ...formData, logo: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.companyName) newErrors.companyName = 'Company name is required';
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Split name into firstName and lastName
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || firstName;

      // Call API register - default role is employee but for signup it could be admin
      await register({
        firstName,
        lastName,
        email: formData.email,
        password: formData.password,
        role: 'admin', // First signup creates admin account
      });
      
      // Verify authentication before navigating
      const isAuth = await new Promise(resolve => {
        setTimeout(() => {
          const token = localStorage.getItem('dayflow_auth_token');
          const user = localStorage.getItem('dayflow_user');
          resolve(!!token && !!user);
        }, 100);
      });
      
      if (isAuth) {
        onSignUp();
      } else {
        console.error('Authentication verification failed after registration - token or user not found in localStorage');
      }
    } catch (err) {
      // Error is already handled in useAuth hook
      // Do NOT navigate to dashboard on error
      console.error('Registration failed:', err);
      // Don't call onSignUp() here - user should not navigate on failure
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[460px]">
        {/* Auth Card */}
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
              HR & Workforce Management
            </p>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-[#1F1B2E] mb-3" style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.02em' }}>
              Create your organization account
            </h1>
            <p className="text-[#6E6A7C]" style={{ fontSize: '14px', opacity: 0.85 }}>
              Set up HR access for your company
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1 - Organization */}
            <div className="space-y-4 pb-2">
              {/* Company Name */}
              <div>
                <label
                  htmlFor="companyName"
                  className="block text-[#1F1B2E] mb-2 transition-all duration-200"
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color:
                      focusedField === 'companyName' || formData.companyName
                        ? '#2AB7CA'
                        : '#1F1B2E',
                  }}
                >
                  Company Name
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  onFocus={() => setFocusedField('companyName')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-4 py-3 border rounded-xl bg-white transition-all duration-200 outline-none"
                  style={{
                    fontSize: '14px',
                    borderColor: errors.companyName
                      ? '#D64545'
                      : focusedField === 'companyName'
                      ? '#2AB7CA'
                      : '#E2E0EA',
                    boxShadow:
                      focusedField === 'companyName'
                        ? '0 0 0 3px rgba(42, 183, 202, 0.1)'
                        : 'none',
                  }}
                  placeholder="Enter company name"
                />
                {errors.companyName && (
                  <p className="mt-1.5 text-[#D64545]" style={{ fontSize: '12px' }}>
                    {errors.companyName}
                  </p>
                )}
              </div>

              {/* Upload Logo */}
              <div>
                <label className="block text-[#1F1B2E] mb-2" style={{ fontSize: '13px', fontWeight: 500 }}>
                  Company Logo
                </label>
                <div
                  className="relative border-2 border-dashed rounded-xl p-4 transition-all duration-200 cursor-pointer hover:border-[#2AB7CA] hover:bg-[#F7F6FB]"
                  style={{ borderColor: '#E2E0EA' }}
                  onClick={() => !formData.logo && fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  {formData.logo ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#F7F6FB] rounded-lg flex items-center justify-center">
                          <Upload className="w-5 h-5 text-[#2AB7CA]" />
                        </div>
                        <div>
                          <p className="text-[#1F1B2E]" style={{ fontSize: '14px', fontWeight: 500 }}>
                            {formData.logo.name}
                          </p>
                          <p className="text-[#6E6A7C]" style={{ fontSize: '12px' }}>
                            {(formData.logo.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveLogo();
                        }}
                        className="p-1 hover:bg-[#F7F6FB] rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-[#6E6A7C]" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-3">
                      <div className="w-10 h-10 bg-[#F7F6FB] rounded-lg flex items-center justify-center">
                        <Upload className="w-5 h-5 text-[#6E6A7C]" />
                      </div>
                      <div className="text-center">
                        <p className="text-[#1F1B2E]" style={{ fontSize: '14px', fontWeight: 500 }}>
                          Upload Logo
                        </p>
                        <p className="text-[#6E6A7C]" style={{ fontSize: '12px' }}>
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#E2E0EA]" style={{ opacity: 0.6 }} />

            {/* Section 2 - Admin Details */}
            <div className="space-y-4 pt-2">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-[#1F1B2E] mb-2 transition-all duration-200"
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: focusedField === 'name' || formData.name ? '#2AB7CA' : '#1F1B2E',
                  }}
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-4 py-3 border rounded-xl bg-white transition-all duration-200 outline-none"
                  style={{
                    fontSize: '14px',
                    borderColor: errors.name
                      ? '#D64545'
                      : focusedField === 'name'
                      ? '#2AB7CA'
                      : '#E2E0EA',
                    boxShadow:
                      focusedField === 'name' ? '0 0 0 3px rgba(42, 183, 202, 0.1)' : 'none',
                  }}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1.5 text-[#D64545]" style={{ fontSize: '12px' }}>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-[#1F1B2E] mb-2 transition-all duration-200"
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: focusedField === 'email' || formData.email ? '#2AB7CA' : '#1F1B2E',
                  }}
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-4 py-3 border rounded-xl bg-white transition-all duration-200 outline-none"
                  style={{
                    fontSize: '14px',
                    borderColor: errors.email
                      ? '#D64545'
                      : focusedField === 'email'
                      ? '#2AB7CA'
                      : '#E2E0EA',
                    boxShadow:
                      focusedField === 'email' ? '0 0 0 3px rgba(42, 183, 202, 0.1)' : 'none',
                  }}
                  placeholder="admin@company.com"
                />
                {errors.email && (
                  <p className="mt-1.5 text-[#D64545]" style={{ fontSize: '12px' }}>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-[#1F1B2E] mb-2 transition-all duration-200"
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: focusedField === 'phone' || formData.phone ? '#2AB7CA' : '#1F1B2E',
                  }}
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-4 py-3 border rounded-xl bg-white transition-all duration-200 outline-none"
                  style={{
                    fontSize: '14px',
                    borderColor: errors.phone
                      ? '#D64545'
                      : focusedField === 'phone'
                      ? '#2AB7CA'
                      : '#E2E0EA',
                    boxShadow:
                      focusedField === 'phone' ? '0 0 0 3px rgba(42, 183, 202, 0.1)' : 'none',
                  }}
                  placeholder="+1 (555) 000-0000"
                />
                {errors.phone && (
                  <p className="mt-1.5 text-[#D64545]" style={{ fontSize: '12px' }}>
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#E2E0EA]" style={{ opacity: 0.6 }} />

            {/* Section 3 - Security */}
            <div className="space-y-4 pt-2">
              <h3 className="text-[#1F1B2E]" style={{ fontSize: '13px', fontWeight: 600 }}>
                Security
              </h3>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-[#1F1B2E] mb-2 transition-all duration-200"
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color:
                      focusedField === 'password' || formData.password ? '#2AB7CA' : '#1F1B2E',
                  }}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
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
                    placeholder="Create a strong password"
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
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-[#D64545]" style={{ fontSize: '12px' }}>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-[#1F1B2E] mb-2 transition-all duration-200"
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color:
                      focusedField === 'confirmPassword' || formData.confirmPassword
                        ? '#2AB7CA'
                        : '#1F1B2E',
                  }}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-4 py-3 pr-12 border rounded-xl bg-white transition-all duration-200 outline-none"
                    style={{
                      fontSize: '14px',
                      borderColor: errors.confirmPassword
                        ? '#D64545'
                        : focusedField === 'confirmPassword'
                        ? '#2AB7CA'
                        : '#E2E0EA',
                      boxShadow:
                        focusedField === 'confirmPassword'
                          ? '0 0 0 3px rgba(42, 183, 202, 0.1)'
                          : 'none',
                    }}
                    placeholder="Re-enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6E6A7C] hover:text-[#2AB7CA] transition-colors"
                    tabIndex={-1}
                    style={{ opacity: 0.6 }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-[#D64545]" style={{ fontSize: '12px' }}>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Helper Text */}
              <div className="bg-[#F7F6FB] rounded-lg p-3">
                <p className="text-[#6E6A7C]" style={{ fontSize: '12px', lineHeight: '1.5' }}>
                  Password is auto-generated initially and can be changed after login
                </p>
              </div>
            </div>

            {/* Sign Up Button */}
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
              Sign Up
            </button>

            {/* Sign In Link */}
            <div className="text-center pt-2">
              <p className="text-[#6E6A7C]" style={{ fontSize: '14px' }}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToSignIn}
                  className="text-[#2AB7CA] hover:text-[#239BAA] transition-all duration-200 hover:underline underline-offset-2"
                  style={{ fontWeight: 500 }}
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}