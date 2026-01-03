import { useState } from 'react';
import { ArrowLeft, Edit2, Plus } from 'lucide-react';

interface EmployeeProfileProps {
  onBack: () => void;
  userRole: 'admin' | 'employee';
  employeeData?: any; // In production, use proper type
}

type TabType = 'resume' | 'private-info' | 'salary-info';

export function EmployeeProfile({ onBack, userRole }: EmployeeProfileProps) {
  const [activeTab, setActiveTab] = useState<TabType>('resume');
  const isAdmin = userRole === 'admin';

  // Employee data - in production, this would come from props or API
  const employee = {
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
    certifications: [
      { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', year: '2023' },
      { name: 'Professional Scrum Master I', issuer: 'Scrum.org', year: '2022' },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
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
          style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)' }}
        >
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center border border-[#E2E0EA] bg-[#FFFFFF]"
              >
                <span className="text-[#6E6A7C]" style={{ fontSize: '28px', fontWeight: 600 }}>
                  {employee.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <button
                className="absolute bottom-0 right-0 w-7 h-7 bg-[#2AB7CA] rounded-full flex items-center justify-center hover:bg-[#239BAA] transition-colors"
                style={{ boxShadow: '0 2px 4px rgba(42, 183, 202, 0.2)' }}
              >
                <Edit2 className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            {/* Employee Info - Center */}
            <div className="flex-1">
              <h1 className="text-[#1F1B2E] mb-4" style={{ fontSize: '24px', fontWeight: 600 }}>
                {employee.name}
              </h1>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[#6E6A7C]" style={{ fontSize: '13px', width: '70px' }}>Login ID</span>
                  <span className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>{employee.loginId}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#6E6A7C]" style={{ fontSize: '13px', width: '80px' }}>Company</span>
                  <span className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>{employee.company}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#6E6A7C]" style={{ fontSize: '13px', width: '70px' }}>Email</span>
                  <span className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>{employee.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#6E6A7C]" style={{ fontSize: '13px', width: '80px' }}>Department</span>
                  <span className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>{employee.department}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#6E6A7C]" style={{ fontSize: '13px', width: '70px' }}>Mobile</span>
                  <span className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>{employee.mobile}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#6E6A7C]" style={{ fontSize: '13px', width: '80px' }}>Manager</span>
                  <span className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>{employee.manager}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#6E6A7C]" style={{ fontSize: '13px', width: '70px' }}></span>
                  <span className="text-[#1F1B2E]" style={{ fontSize: '14px' }}></span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#6E6A7C]" style={{ fontSize: '13px', width: '80px' }}>Location</span>
                  <span className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>{employee.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#F7F6FB] rounded-xl border border-[#E2E0EA] mb-6">
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
                  className="absolute bottom-0 left-0 right-0 bg-[#B39CD0]"
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
                  className="absolute bottom-0 left-0 right-0 bg-[#B39CD0]"
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
                    className="absolute bottom-0 left-0 right-0 bg-[#B39CD0]"
                    style={{ height: '2px' }}
                  />
                )}
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'resume' && (
              <div className="grid grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="col-span-2 space-y-6">
                  {/* About Card */}
                  <div className="bg-[#FFFFFF] rounded-xl p-5 border border-[#E2E0EA]">
                    <h3 className="text-[#1F1B2E] mb-3" style={{ fontSize: '16px', fontWeight: 600 }}>
                      About
                    </h3>
                    <p className="text-[#6E6A7C] leading-relaxed" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                      {employee.about}
                    </p>
                  </div>

                  {/* What I love about my job */}
                  <div className="bg-[#FFFFFF] rounded-xl p-5 border border-[#E2E0EA]">
                    <h3 className="text-[#1F1B2E] mb-3" style={{ fontSize: '16px', fontWeight: 600 }}>
                      What I love about my job
                    </h3>
                    <p className="text-[#6E6A7C] leading-relaxed" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                      {employee.loveAboutJob}
                    </p>
                  </div>

                  {/* Interests & Hobbies */}
                  <div className="bg-[#FFFFFF] rounded-xl p-5 border border-[#E2E0EA]">
                    <h3 className="text-[#1F1B2E] mb-3" style={{ fontSize: '16px', fontWeight: 600 }}>
                      My interests and hobbies
                    </h3>
                    <p className="text-[#6E6A7C] leading-relaxed" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                      {employee.interests}
                    </p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Skills Card */}
                  <div className="bg-[#FFFFFF] rounded-xl p-5 border border-[#E2E0EA]">
                    <h3 className="text-[#1F1B2E] mb-4" style={{ fontSize: '16px', fontWeight: 600 }}>
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {employee.skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1.5 bg-[#F7F6FB] text-[#4B2A6A] rounded-lg border border-[#E2E0EA]" 
                          style={{ fontSize: '13px', fontWeight: 500 }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <button
                      className="w-full px-4 py-2 border border-[#E2E0EA] text-[#6E6A7C] rounded-lg hover:border-[#2AB7CA] hover:text-[#2AB7CA] hover:bg-[#F7F6FB] transition-colors flex items-center justify-center gap-2"
                      style={{ fontSize: '13px', fontWeight: 500 }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Skill
                    </button>
                  </div>

                  {/* Certifications Card */}
                  <div className="bg-[#FFFFFF] rounded-xl p-5 border border-[#E2E0EA]">
                    <h3 className="text-[#1F1B2E] mb-4" style={{ fontSize: '16px', fontWeight: 600 }}>
                      Certifications
                    </h3>
                    <div className="space-y-4">
                      {employee.certifications.map((cert, index) => (
                        <div key={index} className="pb-4 border-b border-[#E2E0EA] last:border-0 last:pb-0">
                          <p className="text-[#1F1B2E] mb-1" style={{ fontSize: '14px', fontWeight: 500 }}>
                            {cert.name}
                          </p>
                          <p className="text-[#6E6A7C]" style={{ fontSize: '12px' }}>
                            {cert.issuer} • {cert.year}
                          </p>
                        </div>
                      ))}
                    </div>
                    <button
                      className="w-full mt-4 px-4 py-2 border border-[#E2E0EA] text-[#6E6A7C] rounded-lg hover:border-[#2AB7CA] hover:text-[#2AB7CA] hover:bg-[#F7F6FB] transition-colors flex items-center justify-center gap-2"
                      style={{ fontSize: '13px', fontWeight: 500 }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Certification
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'private-info' && (
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Personal Details */}
                  <div className="bg-[#FFFFFF] rounded-xl p-5 border border-[#E2E0EA]">
                    <h3 className="text-[#1F1B2E] mb-4" style={{ fontSize: '16px', fontWeight: 600 }}>
                      Personal Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[#6E6A7C] mb-1" style={{ fontSize: '12px', fontWeight: 500 }}>
                          Date of Birth
                        </p>
                        <p className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>
                          March 15, 1990
                        </p>
                      </div>
                      <div className="h-px bg-[#E2E0EA]" />
                      <div>
                        <p className="text-[#6E6A7C] mb-1" style={{ fontSize: '12px', fontWeight: 500 }}>
                          Residing Address
                        </p>
                        <p className="text-[#1F1B2E]" style={{ fontSize: '14px', lineHeight: '1.5' }}>
                          1234 Market Street, Apt 567<br />
                          San Francisco, CA 94103
                        </p>
                      </div>
                      <div className="h-px bg-[#E2E0EA]" />
                      <div>
                        <p className="text-[#6E6A7C] mb-1" style={{ fontSize: '12px', fontWeight: 500 }}>
                          Nationality
                        </p>
                        <p className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>
                          United States
                        </p>
                      </div>
                      <div className="h-px bg-[#E2E0EA]" />
                      <div>
                        <p className="text-[#6E6A7C] mb-1" style={{ fontSize: '12px', fontWeight: 500 }}>
                          Personal Email
                        </p>
                        <p className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>
                          sarah.personal@email.com
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Employment Details */}
                  <div className="bg-[#FFFFFF] rounded-xl p-5 border border-[#E2E0EA]">
                    <h3 className="text-[#1F1B2E] mb-4" style={{ fontSize: '16px', fontWeight: 600 }}>
                      Employment Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[#6E6A7C] mb-1" style={{ fontSize: '12px', fontWeight: 500 }}>
                          Date of Joining
                        </p>
                        <p className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>
                          January 10, 2020
                        </p>
                      </div>
                      <div className="h-px bg-[#E2E0EA]" />
                      <div>
                        <p className="text-[#6E6A7C] mb-1" style={{ fontSize: '12px', fontWeight: 500 }}>
                          Employee Code
                        </p>
                        <p className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>
                          {employee.empCode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Bank Details */}
                  <div className="bg-[#FFFFFF] rounded-xl p-5 border border-[#E2E0EA]">
                    <h3 className="text-[#1F1B2E] mb-4" style={{ fontSize: '16px', fontWeight: 600 }}>
                      Bank Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[#6E6A7C] mb-1" style={{ fontSize: '12px', fontWeight: 500 }}>
                          Account Number
                        </p>
                        <p className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>
                          ************3456
                        </p>
                      </div>
                      <div className="h-px bg-[#E2E0EA]" />
                      <div>
                        <p className="text-[#6E6A7C] mb-1" style={{ fontSize: '12px', fontWeight: 500 }}>
                          Bank Name
                        </p>
                        <p className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>
                          Wells Fargo Bank
                        </p>
                      </div>
                      <div className="h-px bg-[#E2E0EA]" />
                      <div>
                        <p className="text-[#6E6A7C] mb-1" style={{ fontSize: '12px', fontWeight: 500 }}>
                          IFSC Code
                        </p>
                        <p className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>
                          WFBIUS6S
                        </p>
                      </div>
                      <div className="h-px bg-[#E2E0EA]" />
                      <div>
                        <p className="text-[#6E6A7C] mb-1" style={{ fontSize: '12px', fontWeight: 500 }}>
                          PAN No
                        </p>
                        <p className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>
                          ABCDE1234F
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'salary-info' && isAdmin && (
              <div className="space-y-6">
                {/* Salary Summary Strip */}
                <div className="bg-[#F7F6FB] rounded-xl p-5 border border-[#E2E0EA]">
                  <div className="grid grid-cols-4 gap-6">
                    <div>
                      <p className="text-[#6E6A7C] mb-2" style={{ fontSize: '12px', fontWeight: 500 }}>
                        Month Wage
                      </p>
                      <p className="text-[#1F1B2E] mb-1" style={{ fontSize: '22px', fontWeight: 600 }}>
                        80000
                      </p>
                      <p className="text-[#6E6A7C]" style={{ fontSize: '12px' }}>
                        / month
                      </p>
                    </div>
                    <div>
                      <p className="text-[#6E6A7C] mb-2" style={{ fontSize: '12px', fontWeight: 500 }}>
                        Yearly wage
                      </p>
                      <p className="text-[#1F1B2E] mb-1" style={{ fontSize: '22px', fontWeight: 600 }}>
                        600000
                      </p>
                      <p className="text-[#6E6A7C]" style={{ fontSize: '12px' }}>
                        / Yearly
                      </p>
                    </div>
                    <div>
                      <p className="text-[#6E6A7C] mb-2" style={{ fontSize: '12px', fontWeight: 500 }}>
                        no of working days in a week
                      </p>
                      <p className="text-[#1F1B2E]" style={{ fontSize: '22px', fontWeight: 600 }}>
                        5
                      </p>
                    </div>
                    <div>
                      <p className="text-[#6E6A7C] mb-2" style={{ fontSize: '12px', fontWeight: 500 }}>
                        Break Time
                      </p>
                      <p className="text-[#1F1B2E]" style={{ fontSize: '22px', fontWeight: 600 }}>
                        1 <span style={{ fontSize: '14px', fontWeight: 400 }}>hrs</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Salary Components */}
                <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E0EA]">
                  <div className="px-5 py-4 border-b border-[#E2E0EA]">
                    <h3 className="text-[#1F1B2E]" style={{ fontSize: '16px', fontWeight: 600 }}>
                      Salary Components
                    </h3>
                  </div>
                  <div className="p-5">
                    <div className="space-y-0">
                      {[
                        { name: 'Basic Salary', amount: '25000', percent: '41.6%' },
                        { name: 'House Rent Allowance', amount: '12500', percent: '20.8%' },
                        { name: 'Standard Allowance', amount: '1600', percent: '2.6%' },
                        { name: 'Performance Bonus', amount: '10000', percent: '16.6%' },
                        { name: 'Leave Travel Allowance', amount: '6000', percent: '10.0%' },
                        { name: 'Fixed Allowance', amount: '4900', percent: '8.1%' },
                      ].map((component, index, arr) => (
                        <div key={index}>
                          <div className="flex items-center justify-between py-3">
                            <span className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>
                              {component.name}
                            </span>
                            <div className="flex items-center gap-8">
                              <span className="text-[#1F1B2E]" style={{ fontSize: '14px', fontWeight: 500, width: '80px', textAlign: 'right' }}>
                                ₹ {component.amount}
                              </span>
                              <span className="text-[#6E6A7C]" style={{ fontSize: '14px', width: '60px', textAlign: 'right' }}>
                                / month
                              </span>
                              <span className="text-[#6E6A7C]" style={{ fontSize: '14px', width: '50px', textAlign: 'right' }}>
                                {component.percent}
                              </span>
                            </div>
                          </div>
                          {index < arr.length - 1 && <div className="h-px bg-[#E2E0EA]" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Provident Fund */}
                <div className="bg-[#FFFFFF] rounded-xl p-5 border border-[#E2E0EA]">
                  <h3 className="text-[#1F1B2E] mb-4" style={{ fontSize: '16px', fontWeight: 600 }}>
                    Provident Fund [PF] Contribution
                  </h3>
                  <div className="grid grid-cols-2 gap-6 mb-4">
                    <div>
                      <p className="text-[#6E6A7C] mb-2" style={{ fontSize: '12px', fontWeight: 500 }}>
                        Employee
                      </p>
                      <p className="text-[#1F1B2E] mb-1" style={{ fontSize: '18px', fontWeight: 600 }}>
                        ₹ 3000.00
                      </p>
                      <p className="text-[#6E6A7C]" style={{ fontSize: '12px' }}>
                        / month • 5.0%
                      </p>
                    </div>
                    <div>
                      <p className="text-[#6E6A7C] mb-2" style={{ fontSize: '12px', fontWeight: 500 }}>
                        Employer
                      </p>
                      <p className="text-[#1F1B2E] mb-1" style={{ fontSize: '18px', fontWeight: 600 }}>
                        ₹ 3000.00
                      </p>
                      <p className="text-[#6E6A7C]" style={{ fontSize: '12px' }}>
                        / month • 5.0%
                      </p>
                    </div>
                  </div>
                  <p className="text-[#6E6A7C]" style={{ fontSize: '12px', lineHeight: '1.6' }}>
                    A small part of your salary is deducted by the employer every month and contributed to the PF account. 
                    Typically, both employee and employer contribute 12% of basic salary + dearness allowance to the EPF 
                    account.
                  </p>
                </div>

                {/* Tax Deductions */}
                <div className="bg-[#FFFFFF] rounded-xl p-5 border border-[#E2E0EA]">
                  <h3 className="text-[#1F1B2E] mb-4" style={{ fontSize: '16px', fontWeight: 600 }}>
                    Tax Deductions
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>
                          Professional Tax
                        </span>
                        <span className="text-[#1F1B2E]" style={{ fontSize: '14px', fontWeight: 500 }}>
                          ₹ 200.00 / month
                        </span>
                      </div>
                      <p className="text-[#6E6A7C]" style={{ fontSize: '12px', lineHeight: '1.6' }}>
                        Professional Tax deducted from the salary, the TDS will be deducted for the same.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
