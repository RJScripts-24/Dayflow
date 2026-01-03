import { useState } from 'react';
import { Building2, Bell, User, LogOut, ArrowLeft, Edit2, Plus, Info, Eye, EyeOff } from 'lucide-react';

interface ProfileProps {
  onBack: () => void;
  onLogOut: () => void;
  userRole: 'admin' | 'employee';
  onRoleChange: (role: 'admin' | 'employee') => void;
}

type TabType = 'resume' | 'private-info' | 'salary-info' | 'security';

export function Profile({ onBack, onLogOut, userRole, onRoleChange }: ProfileProps) {
  const [activeTab, setActiveTab] = useState<TabType>('resume');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const isAdmin = userRole === 'admin';

  // Different profile data based on role
  const profileData = isAdmin
    ? {
        name: 'Michael Chen',
        loginId: 'michael.chen@dayflow.com',
        email: 'michael.chen@company.com',
        mobile: '+1 (555) 987-6543',
        company: 'Dayflow Inc.',
        department: 'Human Resources',
        manager: 'Robert Smith',
        location: 'San Francisco, CA',
        empCode: 'EMP-2019-001',
        about: 'HR Director with over 10 years of experience in talent management, employee relations, and organizational development. Passionate about building positive workplace cultures and developing high-performing teams.',
        loveAboutJob: 'I enjoy working directly with our team members, helping them grow in their careers, and creating policies that make our workplace better for everyone.',
        interests: 'Leadership development, organizational psychology, and mentoring. Outside work, I enjoy running marathons and volunteering at local community centers.',
        skills: ['HR Management', 'Leadership', 'Recruitment', 'Employee Relations', 'Policy Development', 'Coaching'],
      }
    : {
        name: 'Sarah Johnson',
        loginId: 'sarah.j@dayflow.com',
        email: 'sarah.johnson@company.com',
        mobile: '+1 (555) 123-4567',
        company: 'Dayflow Inc.',
        department: 'Engineering',
        manager: 'Michael Chen',
        location: 'San Francisco, CA',
        empCode: 'EMP-2020-001',
        about: 'Senior software engineer with over 8 years of experience building scalable web applications. Passionate about creating user-friendly interfaces and mentoring junior developers. Specializes in React, TypeScript, and modern frontend architecture patterns.',
        loveAboutJob: 'I enjoy the collaborative environment and the opportunity to work on challenging problems. The company culture encourages innovation and continuous learning, which aligns perfectly with my career goals.',
        interests: 'Outside of work, I enjoy hiking, photography, and contributing to open-source projects. I\'m also passionate about mentoring aspiring developers through local coding bootcamps and community events.',
        skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'GraphQL'],
      };

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      {/* Top Navigation Bar */}
      <nav 
        className="fixed top-0 left-0 right-0 z-50 bg-[#4B2A6A]"
        style={{ height: '64px', boxShadow: '0 2px 8px rgba(75, 42, 106, 0.12)' }}
      >
        <div className="h-full px-6 flex items-center justify-between">
          {/* Left: Logo & Company Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-[#4B2A6A]" />
            </div>
            <span className="text-white" style={{ fontSize: '16px', fontWeight: 600 }}>
              Dayflow
            </span>
          </div>

          {/* Center: Page Tabs */}
          <div className="flex items-center gap-8 ml-12">
            <button
              className="relative py-5 transition-all duration-200"
              style={{
                color: '#B39CD0',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              Employees
            </button>
            <button
              className="relative py-5 transition-all duration-200"
              style={{
                color: '#B39CD0',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              Attendance
            </button>
            <button
              className="relative py-5 transition-all duration-200"
              style={{
                color: '#B39CD0',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              Time Off
            </button>
          </div>

          {/* Right: Notification & User Avatar */}
          <div className="flex items-center gap-4">
            <button className="relative p-2">
              <Bell className="w-5 h-5 text-white" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D64545] rounded-full" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-10 h-10 bg-[#2AB7CA] rounded-full flex items-center justify-center hover:bg-[#239BAA] transition-colors"
              >
                <User className="w-5 h-5 text-white" />
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg overflow-hidden border border-[#E2E0EA]"
                  style={{ 
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                    animation: 'fadeInDown 150ms ease-out'
                  }}
                >
                  <button
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#F7F6FB] transition-colors text-left"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="w-4 h-4 text-[#2AB7CA]" />
                    <span className="text-[#1F1B2E]" style={{ fontSize: '14px', fontWeight: 500 }}>
                      My Profile
                    </span>
                  </button>
                  <button
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#F7F6FB] transition-colors text-left"
                    onClick={onLogOut}
                  >
                    <LogOut className="w-4 h-4 text-[#2AB7CA]" />
                    <span className="text-[#1F1B2E]" style={{ fontSize: '14px', fontWeight: 500 }}>
                      Log Out
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16 pb-8">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#2AB7CA] hover:text-[#239BAA] transition-colors mb-6"
            style={{ fontSize: '14px', fontWeight: 500 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Employees
          </button>

          {/* Profile Header Card */}
          <div
            className="bg-[#F7F6FB] rounded-xl p-6 mb-6 border border-[#E2E0EA]"
            style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}
          >
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center border border-[#E2E0EA]"
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  <User className="w-12 h-12 text-[#6E6A7C]" />
                </div>
                <button
                  className="absolute bottom-0 right-0 w-8 h-8 bg-[#2AB7CA] rounded-full flex items-center justify-center hover:bg-[#239BAA] transition-colors"
                  style={{ boxShadow: '0 2px 6px rgba(42, 183, 202, 0.3)' }}
                >
                  <Edit2 className="w-3.5 h-3.5 text-white" />
                </button>
              </div>

              {/* Employee Info - Left */}
              <div className="flex-1">
                <h1 className="text-[#1F1B2E] mb-3" style={{ fontSize: '24px', fontWeight: 600 }}>
                  {profileData.name}
                </h1>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[#6E6A7C]" style={{ fontSize: '13px', width: '80px' }}>Login ID</span>
                    <span className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>{profileData.loginId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#6E6A7C]" style={{ fontSize: '13px', width: '80px' }}>Email</span>
                    <span className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>{profileData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#6E6A7C]" style={{ fontSize: '13px', width: '80px' }}>Mobile</span>
                    <span className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>{profileData.mobile}</span>
                  </div>
                </div>
              </div>

              {/* Employee Info - Right */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[#6E6A7C]" style={{ fontSize: '13px', width: '90px' }}>Company</span>
                  <span className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>{profileData.company}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#6E6A7C]" style={{ fontSize: '13px', width: '90px' }}>Department</span>
                  <span className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>{profileData.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#6E6A7C]" style={{ fontSize: '13px', width: '90px' }}>Manager</span>
                  <span className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>{profileData.manager}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#6E6A7C]" style={{ fontSize: '13px', width: '90px' }}>Location</span>
                  <span className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>{profileData.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-[#F7F6FB] rounded-xl border border-[#E2E0EA] mb-6" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
            <div className="flex items-center gap-8 px-6 border-b border-[#E2E0EA]">
              <button
                onClick={() => setActiveTab('resume')}
                className="relative py-4 transition-all duration-200"
                style={{
                  color: activeTab === 'resume' ? '#4B2A6A' : '#6E6A7C',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                Resume
                {activeTab === 'resume' && (
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-[#2AB7CA]"
                    style={{ height: '2px' }}
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab('private-info')}
                className="relative py-4 transition-all duration-200"
                style={{
                  color: activeTab === 'private-info' ? '#4B2A6A' : '#6E6A7C',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                Private Info
                {activeTab === 'private-info' && (
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-[#2AB7CA]"
                    style={{ height: '2px' }}
                  />
                )}
              </button>
              {isAdmin && (
                <button
                  onClick={() => setActiveTab('salary-info')}
                  className="relative py-4 transition-all duration-200"
                  style={{
                    color: activeTab === 'salary-info' ? '#4B2A6A' : '#6E6A7C',
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  Salary Info
                  {activeTab === 'salary-info' && (
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-[#2AB7CA]"
                      style={{ height: '2px' }}
                    />
                  )}
                </button>
              )}
              {!isAdmin && (
                <button
                  onClick={() => setActiveTab('security')}
                  className="relative py-4 transition-all duration-200"
                  style={{
                    color: activeTab === 'security' ? '#4B2A6A' : '#6E6A7C',
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  Security
                  {activeTab === 'security' && (
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-[#2AB7CA]"
                      style={{ height: '2px' }}
                    />
                  )}
                </button>
              )}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'resume' && (
                <div 
                  key="resume-tab"
                  className="grid grid-cols-3 gap-6"
                  style={{ animation: 'fadeIn 140ms ease-out' }}
                >
                  {/* Left Column */}
                  <div className="col-span-2 space-y-6">
                    {/* About Card */}
                    <div className="bg-white rounded-xl p-5 border border-[#E3EDF5]" style={{ boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)' }}>
                      <h3 className="text-[#2C3E50] mb-3" style={{ fontSize: '16px', fontWeight: 600 }}>
                        About
                      </h3>
                      <p className="text-[#7F8C8D] leading-relaxed" style={{ fontSize: '14px' }}>
                        {profileData.about}
                      </p>
                    </div>

                    {/* What I love about my job */}
                    <div className="bg-white rounded-xl p-5 border border-[#E3EDF5]" style={{ boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)' }}>
                      <h3 className="text-[#2C3E50] mb-3" style={{ fontSize: '16px', fontWeight: 600 }}>
                        What I love about my job
                      </h3>
                      <p className="text-[#7F8C8D] leading-relaxed" style={{ fontSize: '14px' }}>
                        {profileData.loveAboutJob}
                      </p>
                    </div>

                    {/* Interests & Hobbies */}
                    <div className="bg-white rounded-xl p-5 border border-[#E3EDF5]" style={{ boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)' }}>
                      <h3 className="text-[#2C3E50] mb-3" style={{ fontSize: '16px', fontWeight: 600 }}>
                        My interests and hobbies
                      </h3>
                      <p className="text-[#7F8C8D] leading-relaxed" style={{ fontSize: '14px' }}>
                        {profileData.interests}
                      </p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Skills Card */}
                    <div className="bg-white rounded-xl p-5 border border-[#E3EDF5]" style={{ boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)' }}>
                      <h3 className="text-[#2C3E50] mb-4" style={{ fontSize: '16px', fontWeight: 600 }}>
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {profileData.skills.map((skill, index) => (
                          <span key={index} className="px-3 py-1.5 bg-[#EBF4FC] text-[#3282B8] rounded-lg" style={{ fontSize: '13px', fontWeight: 500 }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                      <button
                        className="px-4 py-2 border border-[#3282B8] text-[#3282B8] rounded-lg hover:bg-[#EBF4FC] transition-colors flex items-center gap-2"
                        style={{ fontSize: '13px', fontWeight: 500 }}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Skill
                      </button>
                    </div>

                    {/* Certifications Card */}
                    <div className="bg-white rounded-xl p-5 border border-[#E3EDF5]" style={{ boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)' }}>
                      <h3 className="text-[#2C3E50] mb-4" style={{ fontSize: '16px', fontWeight: 600 }}>
                        Certifications
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-[#1B262C]" style={{ fontSize: '14px', fontWeight: 500 }}>
                            AWS Certified Solutions Architect
                          </p>
                          <p className="text-[#7F8C8D]" style={{ fontSize: '12px' }}>
                            Amazon Web Services • 2023
                          </p>
                        </div>
                        <div>
                          <p className="text-[#1B262C]" style={{ fontSize: '14px', fontWeight: 500 }}>
                            Professional Scrum Master I
                          </p>
                          <p className="text-[#7F8C8D]" style={{ fontSize: '12px' }}>
                            Scrum.org • 2022
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'private-info' && (
                <div key="private-info-tab" style={{ animation: 'fadeIn 140ms ease-out' }}>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Left Column - Personal Information */}
                    <div className="bg-[#F7F6FB] rounded-xl p-5 border border-[#E2E0EA]">
                      <h3 className="text-[#1F1B2E] mb-5" style={{ fontSize: '16px', fontWeight: 600 }}>
                        Personal Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[#6E6A7C] mb-1.5" style={{ fontSize: '12px', fontWeight: 500 }}>
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            defaultValue="1990-03-15"
                            className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E0EA] text-[#1F1B2E] focus:outline-none focus:ring-2 focus:ring-[#2AB7CA] transition-all"
                            style={{ fontSize: '14px' }}
                          />
                        </div>
                        <div>
                          <label className="block text-[#6E6A7C] mb-1.5" style={{ fontSize: '12px', fontWeight: 500 }}>
                            Residing Address
                          </label>
                          <textarea
                            defaultValue="1234 Market Street, Apt 567, San Francisco, CA 94103"
                            rows={3}
                            className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E0EA] text-[#1F1B2E] focus:outline-none focus:ring-2 focus:ring-[#2AB7CA] transition-all resize-none"
                            style={{ fontSize: '14px' }}
                          />
                        </div>
                        <div>
                          <label className="block text-[#6E6A7C] mb-1.5" style={{ fontSize: '12px', fontWeight: 500 }}>
                            Nationality
                          </label>
                          <input
                            type="text"
                            defaultValue="United States"
                            className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E0EA] text-[#1F1B2E] focus:outline-none focus:ring-2 focus:ring-[#2AB7CA] transition-all"
                            style={{ fontSize: '14px' }}
                          />
                        </div>
                        <div>
                          <label className="block text-[#6E6A7C] mb-1.5" style={{ fontSize: '12px', fontWeight: 500 }}>
                            Personal Email
                          </label>
                          <input
                            type="email"
                            defaultValue="sarah.personal@email.com"
                            className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E0EA] text-[#1F1B2E] focus:outline-none focus:ring-2 focus:ring-[#2AB7CA] transition-all"
                            style={{ fontSize: '14px' }}
                          />
                        </div>
                        <div>
                          <label className="block text-[#6E6A7C] mb-1.5" style={{ fontSize: '12px', fontWeight: 500 }}>
                            Gender
                          </label>
                          <select
                            defaultValue="Female"
                            className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E0EA] text-[#1F1B2E] focus:outline-none focus:ring-2 focus:ring-[#2AB7CA] transition-all"
                            style={{ fontSize: '14px' }}
                          >
                            <option>Female</option>
                            <option>Male</option>
                            <option>Other</option>
                            <option>Prefer not to say</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[#6E6A7C] mb-1.5" style={{ fontSize: '12px', fontWeight: 500 }}>
                            Marital Status
                          </label>
                          <select
                            defaultValue="Single"
                            className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E0EA] text-[#1F1B2E] focus:outline-none focus:ring-2 focus:ring-[#2AB7CA] transition-all"
                            style={{ fontSize: '14px' }}
                          >
                            <option>Single</option>
                            <option>Married</option>
                            <option>Divorced</option>
                            <option>Widowed</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[#6E6A7C] mb-1.5" style={{ fontSize: '12px', fontWeight: 500 }}>
                            Date of Joining
                          </label>
                          <input
                            type="date"
                            defaultValue="2020-01-10"
                            className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E0EA] text-[#1F1B2E] focus:outline-none focus:ring-2 focus:ring-[#2AB7CA] transition-all"
                            style={{ fontSize: '14px' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Bank Details */}
                    <div className="bg-[#F7F6FB] rounded-xl p-5 border border-[#E2E0EA]">
                      <h3 className="text-[#1F1B2E] mb-5" style={{ fontSize: '16px', fontWeight: 600 }}>
                        Bank Details
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[#6E6A7C] mb-1.5" style={{ fontSize: '12px', fontWeight: 500 }}>
                            Account Number
                          </label>
                          <div className="relative">
                            <input
                              type={showAccountNumber ? 'text' : 'password'}
                              defaultValue="1234567890123456"
                              className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E0EA] text-[#1F1B2E] focus:outline-none focus:ring-2 focus:ring-[#2AB7CA] transition-all pr-10"
                              style={{ fontSize: '14px' }}
                            />
                            <button
                              onClick={() => setShowAccountNumber(!showAccountNumber)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E6A7C] hover:text-[#2AB7CA]"
                            >
                              {showAccountNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[#6E6A7C] mb-1.5" style={{ fontSize: '12px', fontWeight: 500 }}>
                            Bank Name
                          </label>
                          <input
                            type="text"
                            defaultValue="Wells Fargo Bank"
                            className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E0EA] text-[#1F1B2E] focus:outline-none focus:ring-2 focus:ring-[#2AB7CA] transition-all"
                            style={{ fontSize: '14px' }}
                          />
                        </div>
                        <div>
                          <label className="block text-[#6E6A7C] mb-1.5" style={{ fontSize: '12px', fontWeight: 500 }}>
                            IFSC Code
                          </label>
                          <input
                            type="text"
                            defaultValue="WFBIUS6S"
                            className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E0EA] text-[#1F1B2E] focus:outline-none focus:ring-2 focus:ring-[#2AB7CA] transition-all"
                            style={{ fontSize: '14px' }}
                          />
                        </div>
                        <div>
                          <label className="block text-[#6E6A7C] mb-1.5" style={{ fontSize: '12px', fontWeight: 500 }}>
                            PAN No
                          </label>
                          <input
                            type="text"
                            defaultValue="ABCDE1234F"
                            className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E0EA] text-[#1F1B2E] focus:outline-none focus:ring-2 focus:ring-[#2AB7CA] transition-all"
                            style={{ fontSize: '14px' }}
                          />
                        </div>
                        <div>
                          <label className="block text-[#6E6A7C] mb-1.5" style={{ fontSize: '12px', fontWeight: 500 }}>
                            UAN NO
                          </label>
                          <input
                            type="text"
                            defaultValue="123456789012"
                            className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E0EA] text-[#1F1B2E] focus:outline-none focus:ring-2 focus:ring-[#2AB7CA] transition-all"
                            style={{ fontSize: '14px' }}
                          />
                        </div>
                        <div>
                          <label className="block text-[#6E6A7C] mb-1.5" style={{ fontSize: '12px', fontWeight: 500 }}>
                            Emp Code
                          </label>
                          <input
                            type="text"
                            defaultValue={profileData.empCode}
                            disabled
                            className="w-full px-3 py-2 bg-[#F7F6FB] rounded-lg border border-[#E2E0EA] text-[#6E6A7C] cursor-not-allowed"
                            style={{ fontSize: '14px' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Changes Button */}
                  <div className="flex items-center justify-end gap-3">
                    <button
                      className="px-5 py-2.5 text-[#6E6A7C] hover:text-[#1F1B2E] transition-colors"
                      style={{ fontSize: '14px', fontWeight: 500 }}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-6 py-2.5 bg-[#4B2A6A] text-white rounded-lg hover:bg-[#3D2255] transition-colors"
                      style={{ fontSize: '14px', fontWeight: 500, boxShadow: '0 2px 4px rgba(75, 42, 106, 0.2)' }}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'salary-info' && isAdmin && (
                <div 
                  key="salary-info-tab"
                  className="space-y-6"
                  style={{ animation: 'fadeIn 140ms ease-out' }}
                >
                  {/* Salary Summary Section */}
                  <div className="bg-[#F7FAFD] rounded-xl p-5 border border-[#E3EDF5]">
                    <div className="grid grid-cols-4 gap-6">
                      <div>
                        <p className="text-[#7F8C8D] mb-1" style={{ fontSize: '12px', fontWeight: 500 }}>
                          Monthly Wage
                        </p>
                        <p className="text-[#1B262C]" style={{ fontSize: '20px', fontWeight: 600 }}>
                          $8,500
                        </p>
                        <p className="text-[#7F8C8D]" style={{ fontSize: '12px' }}>
                          / month
                        </p>
                      </div>
                      <div>
                        <p className="text-[#7F8C8D] mb-1" style={{ fontSize: '12px', fontWeight: 500 }}>
                          Yearly Wage
                        </p>
                        <p className="text-[#1B262C]" style={{ fontSize: '20px', fontWeight: 600 }}>
                          $102,000
                        </p>
                        <p className="text-[#7F8C8D]" style={{ fontSize: '12px' }}>
                          / yearly
                        </p>
                      </div>
                      <div>
                        <p className="text-[#7F8C8D] mb-1" style={{ fontSize: '12px', fontWeight: 500 }}>
                          Working days / week
                        </p>
                        <p className="text-[#1B262C]" style={{ fontSize: '20px', fontWeight: 600 }}>
                          5
                        </p>
                      </div>
                      <div>
                        <p className="text-[#7F8C8D] mb-1" style={{ fontSize: '12px', fontWeight: 500 }}>
                          Break time
                        </p>
                        <p className="text-[#1B262C]" style={{ fontSize: '20px', fontWeight: 600 }}>
                          1 hr
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Salary Components Table */}
                  <div className="bg-white rounded-xl border border-[#E3EDF5]" style={{ boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)' }}>
                    <div className="p-5 border-b border-[#E3EDF5]">
                      <h3 className="text-[#2C3E50]" style={{ fontSize: '16px', fontWeight: 600 }}>
                        Salary Components
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-[#E3EDF5]">
                            <th className="px-5 py-3 text-left text-[#7F8C8D]" style={{ fontSize: '12px', fontWeight: 500 }}>
                              Component Name
                            </th>
                            <th className="px-5 py-3 text-right text-[#7F8C8D]" style={{ fontSize: '12px', fontWeight: 500 }}>
                              Monthly Amount
                            </th>
                            <th className="px-5 py-3 text-right text-[#7F8C8D]" style={{ fontSize: '12px', fontWeight: 500 }}>
                              Percentage
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-[#E3EDF5]">
                            <td className="px-5 py-4 text-[#1B262C]" style={{ fontSize: '14px' }}>
                              Basic Salary
                            </td>
                            <td className="px-5 py-4 text-right text-[#1B262C]" style={{ fontSize: '14px', fontWeight: 500 }}>
                              $5,000.00
                            </td>
                            <td className="px-5 py-4 text-right text-[#7F8C8D]" style={{ fontSize: '14px' }}>
                              58.8%
                            </td>
                          </tr>
                          <tr className="border-b border-[#E3EDF5]">
                            <td className="px-5 py-4 text-[#1B262C]" style={{ fontSize: '14px' }}>
                              House Rent Allowance
                            </td>
                            <td className="px-5 py-4 text-right text-[#1B262C]" style={{ fontSize: '14px', fontWeight: 500 }}>
                              $1,600.00
                            </td>
                            <td className="px-5 py-4 text-right text-[#7F8C8D]" style={{ fontSize: '14px' }}>
                              18.8%
                            </td>
                          </tr>
                          <tr className="border-b border-[#E3EDF5]">
                            <td className="px-5 py-4 text-[#1B262C]" style={{ fontSize: '14px' }}>
                              Standard Allowance
                            </td>
                            <td className="px-5 py-4 text-right text-[#1B262C]" style={{ fontSize: '14px', fontWeight: 500 }}>
                              $850.00
                            </td>
                            <td className="px-5 py-4 text-right text-[#7F8C8D]" style={{ fontSize: '14px' }}>
                              10.0%
                            </td>
                          </tr>
                          <tr className="border-b border-[#E3EDF5]">
                            <td className="px-5 py-4 text-[#1B262C]" style={{ fontSize: '14px' }}>
                              Performance Bonus
                            </td>
                            <td className="px-5 py-4 text-right text-[#1B262C]" style={{ fontSize: '14px', fontWeight: 500 }}>
                              $600.00
                            </td>
                            <td className="px-5 py-4 text-right text-[#7F8C8D]" style={{ fontSize: '14px' }}>
                              7.1%
                            </td>
                          </tr>
                          <tr className="border-b border-[#E3EDF5]">
                            <td className="px-5 py-4 text-[#1B262C]" style={{ fontSize: '14px' }}>
                              Travel Allowance
                            </td>
                            <td className="px-5 py-4 text-right text-[#1B262C]" style={{ fontSize: '14px', fontWeight: 500 }}>
                              $300.00
                            </td>
                            <td className="px-5 py-4 text-right text-[#7F8C8D]" style={{ fontSize: '14px' }}>
                              3.5%
                            </td>
                          </tr>
                          <tr>
                            <td className="px-5 py-4 text-[#1B262C]" style={{ fontSize: '14px' }}>
                              Fixed Allowance
                            </td>
                            <td className="px-5 py-4 text-right text-[#1B262C]" style={{ fontSize: '14px', fontWeight: 500 }}>
                              $150.00
                            </td>
                            <td className="px-5 py-4 text-right text-[#7F8C8D]" style={{ fontSize: '14px' }}>
                              1.8%
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Provident Fund Section */}
                  <div className="bg-white rounded-xl p-5 border border-[#E3EDF5]" style={{ boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)' }}>
                    <h3 className="text-[#2C3E50] mb-4" style={{ fontSize: '16px', fontWeight: 600 }}>
                      Provident Fund (PF) Contribution
                    </h3>
                    <div className="grid grid-cols-2 gap-6 mb-3">
                      <div>
                        <p className="text-[#7F8C8D] mb-1" style={{ fontSize: '13px' }}>
                          Employee Contribution
                        </p>
                        <p className="text-[#1B262C]" style={{ fontSize: '18px', fontWeight: 600 }}>
                          $425.00
                        </p>
                        <p className="text-[#7F8C8D]" style={{ fontSize: '12px' }}>
                          / month • 5.0%
                        </p>
                      </div>
                      <div>
                        <p className="text-[#7F8C8D] mb-1" style={{ fontSize: '13px' }}>
                          Employer Contribution
                        </p>
                        <p className="text-[#1B262C]" style={{ fontSize: '18px', fontWeight: 600 }}>
                          $425.00
                        </p>
                        <p className="text-[#7F8C8D]" style={{ fontSize: '12px' }}>
                          / month • 5.0%
                        </p>
                      </div>
                    </div>
                    <p className="text-[#7F8C8D]" style={{ fontSize: '12px', lineHeight: '1.6' }}>
                      Provident Fund is a retirement savings scheme. Both employee and employer contribute equally, 
                      building a tax-advantaged retirement corpus.
                    </p>
                  </div>

                  {/* Tax Deductions */}
                  <div className="bg-white rounded-xl p-5 border border-[#E3EDF5]" style={{ boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)' }}>
                    <h3 className="text-[#2C3E50] mb-4" style={{ fontSize: '16px', fontWeight: 600 }}>
                      Tax Deductions
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[#1B262C]" style={{ fontSize: '14px' }}>
                          Professional Tax
                        </span>
                        <span className="text-[#1B262C]" style={{ fontSize: '14px', fontWeight: 500 }}>
                          $200.00
                        </span>
                      </div>
                      <p className="text-[#7F8C8D]" style={{ fontSize: '12px', lineHeight: '1.6' }}>
                        Professional tax is a state-level tax levied on salaried individuals. 
                        The amount is deducted monthly from gross salary.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && !isAdmin && (
                <div 
                  key="security-tab"
                  className="space-y-6"
                  style={{ animation: 'fadeIn 140ms ease-out' }}
                >
                  {/* Change Password */}
                  <div className="bg-[#F7F6FB] rounded-xl p-5 border border-[#E2E0EA]">
                    <h3 className="text-[#1F1B2E] mb-5" style={{ fontSize: '16px', fontWeight: 600 }}>
                      Change Password
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[#6E6A7C] mb-1.5" style={{ fontSize: '12px', fontWeight: 500 }}>
                          Current Password
                        </label>
                        <input
                          type="password"
                          placeholder="Enter current password"
                          className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E0EA] text-[#1F1B2E] focus:outline-none focus:ring-2 focus:ring-[#2AB7CA] transition-all"
                          style={{ fontSize: '14px' }}
                        />
                      </div>
                      <div>
                        <label className="block text-[#6E6A7C] mb-1.5" style={{ fontSize: '12px', fontWeight: 500 }}>
                          New Password
                        </label>
                        <input
                          type="password"
                          placeholder="Enter new password"
                          className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E0EA] text-[#1F1B2E] focus:outline-none focus:ring-2 focus:ring-[#2AB7CA] transition-all"
                          style={{ fontSize: '14px' }}
                        />
                      </div>
                      <div>
                        <label className="block text-[#6E6A7C] mb-1.5" style={{ fontSize: '12px', fontWeight: 500 }}>
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          placeholder="Re-enter new password"
                          className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2E0EA] text-[#1F1B2E] focus:outline-none focus:ring-2 focus:ring-[#2AB7CA] transition-all"
                          style={{ fontSize: '14px' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="bg-[#F7F6FB] rounded-xl p-5 border border-[#E2E0EA]">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-[#1F1B2E] mb-1" style={{ fontSize: '16px', fontWeight: 600 }}>
                          Two-Factor Authentication
                        </h3>
                        <p className="text-[#6E6A7C]" style={{ fontSize: '13px' }}>
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <button
                        className="px-4 py-2 bg-[#2AB7CA] text-white rounded-lg hover:bg-[#239BAA] transition-colors"
                        style={{ fontSize: '13px', fontWeight: 500 }}
                      >
                        Enable
                      </button>
                    </div>
                    <p className="text-[#6E6A7C]" style={{ fontSize: '12px', lineHeight: '1.6' }}>
                      Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to sign in.
                    </p>
                  </div>

                  {/* Active Sessions */}
                  <div className="bg-[#F7F6FB] rounded-xl p-5 border border-[#E2E0EA]">
                    <h3 className="text-[#1F1B2E] mb-4" style={{ fontSize: '16px', fontWeight: 600 }}>
                      Active Sessions
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-4 border border-[#E2E0EA]">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-[#1F1B2E] mb-1" style={{ fontSize: '14px', fontWeight: 500 }}>
                              Chrome on macOS
                            </p>
                            <p className="text-[#6E6A7C]" style={{ fontSize: '12px' }}>
                              San Francisco, CA • Last active: 2 hours ago
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-[#2E8B57] bg-opacity-10 text-[#2E8B57] rounded" style={{ fontSize: '11px', fontWeight: 500 }}>
                            Current
                          </span>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-[#E2E0EA]">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-[#1F1B2E] mb-1" style={{ fontSize: '14px', fontWeight: 500 }}>
                              Safari on iPhone
                            </p>
                            <p className="text-[#6E6A7C]" style={{ fontSize: '12px' }}>
                              San Francisco, CA • Last active: 1 day ago
                            </p>
                          </div>
                          <button
                            className="text-[#D64545] hover:underline"
                            style={{ fontSize: '12px', fontWeight: 500 }}
                          >
                            Revoke
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Changes Button */}
                  <div className="flex items-center justify-end gap-3">
                    <button
                      className="px-5 py-2.5 text-[#6E6A7C] hover:text-[#1F1B2E] transition-colors"
                      style={{ fontSize: '14px', fontWeight: 500 }}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-6 py-2.5 bg-[#4B2A6A] text-white rounded-lg hover:bg-[#3D2255] transition-colors"
                      style={{ fontSize: '14px', fontWeight: 500, boxShadow: '0 2px 4px rgba(75, 42, 106, 0.2)' }}
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}