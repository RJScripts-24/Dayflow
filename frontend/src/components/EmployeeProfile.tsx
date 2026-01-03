import { useState, useEffect } from 'react';
import { ArrowLeft, Edit2, Plus, Download } from 'lucide-react';
import { PayrollService } from '../services/payroll.service';
import type { Payroll } from '../types/api.types';

interface EmployeeProfileProps {
  onBack: () => void;
  userRole: 'admin' | 'employee';
  employeeId?: string | null;
}

type TabType = 'resume' | 'private-info' | 'salary-info';

// Mock employee database - in production, this would come from API
const employeeDatabase: Record<string, any> = {
  '1': {
    name: 'Sarah Johnson',
    loginId: 'sarah.j@dayflow.com',
    email: 'sarah.johnson@company.com',
    mobile: '+1 (555) 123-4567',
    company: 'Dayflow Inc.',
    department: 'Engineering',
    role: 'Senior Developer',
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
    dob: 'March 15, 1990',
    address: '1234 Market Street, Apt 567\nSan Francisco, CA 94103',
    nationality: 'United States',
    personalEmail: 'sarah.personal@email.com',
    dateOfJoining: 'January 10, 2020',
    salary: {
      monthWage: '80000',
      yearlyWage: '960000',
      workingDays: '5',
      breakTime: '1',
      components: [
        { name: 'Basic Salary', amount: '45000', percent: '56.2%' },
        { name: 'House Rent Allowance', amount: '20000', percent: '25.0%' },
        { name: 'Performance Bonus', amount: '10000', percent: '12.5%' },
        { name: 'Fixed Allowance', amount: '5000', percent: '6.3%' },
      ],
    },
  },
  '2': {
    name: 'Michael Chen',
    loginId: 'michael.c@dayflow.com',
    email: 'michael.chen@company.com',
    mobile: '+1 (555) 234-5678',
    company: 'Dayflow Inc.',
    department: 'Product',
    role: 'Product Manager',
    manager: 'Robert Smith',
    location: 'San Francisco, CA',
    empCode: 'EMP-2019-012',
    about: 'Product Manager with 10+ years of experience in building and scaling SaaS products. Expert in user research, product strategy, and cross-functional team leadership. Passionate about creating products that solve real user problems.',
    loveAboutJob: 'I love working with talented teams to bring innovative ideas to life. The challenge of balancing user needs, business goals, and technical constraints keeps me engaged every day.',
    interests: 'Product design, behavioral psychology, and startup ecosystems. Outside work, I enjoy playing tennis, reading business books, and mentoring aspiring PMs.',
    skills: ['Product Strategy', 'User Research', 'Agile', 'Data Analysis', 'Roadmap Planning', 'Stakeholder Management'],
    certifications: [
      { name: 'Certified Scrum Product Owner', issuer: 'Scrum Alliance', year: '2022' },
      { name: 'Product Management Certification', issuer: 'Product School', year: '2021' },
    ],
    dob: 'July 22, 1987',
    address: '789 Pine Street, Unit 12\nSan Francisco, CA 94109',
    nationality: 'United States',
    personalEmail: 'michael.chen.personal@email.com',
    dateOfJoining: 'March 15, 2019',
    salary: {
      monthWage: '95000',
      yearlyWage: '1140000',
      workingDays: '5',
      breakTime: '1',
      components: [
        { name: 'Basic Salary', amount: '52000', percent: '54.7%' },
        { name: 'House Rent Allowance', amount: '24000', percent: '25.3%' },
        { name: 'Performance Bonus', amount: '15000', percent: '15.8%' },
        { name: 'Fixed Allowance', amount: '4000', percent: '4.2%' },
      ],
    },
  },
  '3': {
    name: 'Emily Rodriguez',
    loginId: 'emily.r@dayflow.com',
    email: 'emily.rodriguez@company.com',
    mobile: '+1 (555) 345-6789',
    company: 'Dayflow Inc.',
    department: 'Design',
    role: 'UX Designer',
    manager: 'Sarah Johnson',
    location: 'Los Angeles, CA',
    empCode: 'EMP-2021-005',
    about: 'UX Designer with 6 years of experience crafting intuitive and delightful user experiences. Specializes in user research, interaction design, and prototyping. Committed to creating accessible and inclusive designs.',
    loveAboutJob: 'I love the creative process of turning complex problems into simple, elegant solutions. Collaborating with users and seeing their positive reactions to our designs is incredibly rewarding.',
    interests: 'Design thinking, accessibility, and visual storytelling. I enjoy sketching, visiting art museums, and exploring new design tools in my free time.',
    skills: ['User Research', 'Wireframing', 'Prototyping', 'Figma', 'Adobe XD', 'Usability Testing'],
    certifications: [
      { name: 'Google UX Design Certificate', issuer: 'Google', year: '2023' },
      { name: 'Interaction Design Specialization', issuer: 'Coursera', year: '2021' },
    ],
    dob: 'November 8, 1993',
    address: '456 Ocean Avenue, Apt 89\nLos Angeles, CA 90291',
    nationality: 'United States',
    personalEmail: 'emily.rod.personal@email.com',
    dateOfJoining: 'June 1, 2021',
    salary: {
      monthWage: '72000',
      yearlyWage: '864000',
      workingDays: '5',
      breakTime: '1',
      components: [
        { name: 'Basic Salary', amount: '40000', percent: '55.6%' },
        { name: 'House Rent Allowance', amount: '18000', percent: '25.0%' },
        { name: 'Performance Bonus', amount: '10000', percent: '13.9%' },
        { name: 'Fixed Allowance', amount: '4000', percent: '5.5%' },
      ],
    },
  },
  // Add more employees as needed
};

export function EmployeeProfile({ onBack, userRole, employeeId }: EmployeeProfileProps) {
  const [activeTab, setActiveTab] = useState<TabType>('resume');
  const [payrollHistory, setPayrollHistory] = useState<Payroll[]>([]);
  const [isLoadingPayroll, setIsLoadingPayroll] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const isAdmin = userRole === 'admin';

  // Fetch payroll history when viewing salary info
  useEffect(() => {
    if (activeTab === 'salary-info' && employeeId) {
      fetchPayrollHistory();
    }
  }, [activeTab, employeeId]);

  const fetchPayrollHistory = async () => {
    if (!employeeId) return;
    
    setIsLoadingPayroll(true);
    try {
      const payrolls = await PayrollService.getPayrollByEmployee(employeeId);
      setPayrollHistory(payrolls);
    } catch (error) {
      console.error('Failed to fetch payroll history:', error);
    } finally {
      setIsLoadingPayroll(false);
    }
  };

  const handleDownloadSlip = async (payrollId: number, employeeName: string, month: number, year: number) => {
    setDownloadingId(payrollId);
    try {
      const blob = await PayrollService.downloadSalarySlip(payrollId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `SalarySlip_${employeeName.replace(/\s+/g, '_')}_${month}_${year}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download salary slip:', error);
      alert('Failed to download salary slip. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  // Get employee data from database or use default
  const employee = employeeId && employeeDatabase[employeeId] 
    ? employeeDatabase[employeeId]
    : {
        name: 'Unknown Employee',
        loginId: 'unknown@dayflow.com',
        email: 'unknown@company.com',
        mobile: '+1 (555) 000-0000',
        company: 'Dayflow Inc.',
        department: 'N/A',
        role: 'N/A',
        manager: 'N/A',
        location: 'N/A',
        empCode: 'N/A',
        about: 'No information available.',
        loveAboutJob: 'No information available.',
        interests: 'No information available.',
        skills: [],
        certifications: [],
        dob: 'N/A',
        address: 'N/A',
        nationality: 'N/A',
        personalEmail: 'N/A',
        dateOfJoining: 'N/A',
        salary: {
          monthWage: '0',
          yearlyWage: '0',
          workingDays: '0',
          breakTime: '0',
          components: [],
        },
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
                  {employee.name.split(' ').map((n: string) => n[0]).join('')}
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
                      {employee.skills.map((skill: string, index: number) => (
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
                      {employee.certifications.map((cert: any, index: number) => (
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
                          {employee.dob}
                        </p>
                      </div>
                      <div className="h-px bg-[#E2E0EA]" />
                      <div>
                        <p className="text-[#6E6A7C] mb-1" style={{ fontSize: '12px', fontWeight: 500 }}>
                          Residing Address
                        </p>
                        <p className="text-[#1F1B2E]" style={{ fontSize: '14px', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                          {employee.address}
                        </p>
                      </div>
                      <div className="h-px bg-[#E2E0EA]" />
                      <div>
                        <p className="text-[#6E6A7C] mb-1" style={{ fontSize: '12px', fontWeight: 500 }}>
                          Nationality
                        </p>
                        <p className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>
                          {employee.nationality}
                        </p>
                      </div>
                      <div className="h-px bg-[#E2E0EA]" />
                      <div>
                        <p className="text-[#6E6A7C] mb-1" style={{ fontSize: '12px', fontWeight: 500 }}>
                          Personal Email
                        </p>
                        <p className="text-[#1F1B2E]" style={{ fontSize: '14px' }}>
                          {employee.personalEmail}
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
                          {employee.dateOfJoining}
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
                        {employee.salary.monthWage}
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
                        {employee.salary.yearlyWage}
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
                        {employee.salary.workingDays}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#6E6A7C] mb-2" style={{ fontSize: '12px', fontWeight: 500 }}>
                        Break Time
                      </p>
                      <p className="text-[#1F1B2E]" style={{ fontSize: '22px', fontWeight: 600 }}>
                        {employee.salary.breakTime} <span style={{ fontSize: '14px', fontWeight: 400 }}>hrs</span>
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
                      {employee.salary.components.map((component: any, index: number, arr: any[]) => (
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

                {/* Payroll History */}
                <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E0EA]">
                  <div className="px-5 py-4 border-b border-[#E2E0EA]">
                    <h3 className="text-[#1F1B2E]" style={{ fontSize: '16px', fontWeight: 600 }}>
                      Payroll History
                    </h3>
                    <p className="text-[#6E6A7C] mt-1" style={{ fontSize: '12px' }}>
                      Your salary is automatically calculated based on attendance (check-in/check-out times)
                    </p>
                  </div>
                  <div className="p-5">
                    {isLoadingPayroll ? (
                      <div className="text-center py-8">
                        <p className="text-[#6E6A7C]" style={{ fontSize: '14px' }}>Loading payroll history...</p>
                      </div>
                    ) : payrollHistory.length > 0 ? (
                      <div className="space-y-3">
                        {payrollHistory.map((payroll) => (
                          <div
                            key={payroll.id}
                            className="flex items-center justify-between p-4 bg-[#F7F6FB] rounded-lg border border-[#E2E0EA] hover:border-[#4B2A6A] transition-colors"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-[#1F1B2E]" style={{ fontSize: '14px', fontWeight: 600 }}>
                                  {new Date(payroll.year, payroll.month - 1).toLocaleDateString('en-US', { 
                                    month: 'long', 
                                    year: 'numeric' 
                                  })}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  payroll.status === 'Processed' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {payroll.status}
                                </span>
                              </div>
                              <div className="flex items-center gap-6 text-[#6E6A7C]" style={{ fontSize: '12px' }}>
                                <span>Payable Days: {payroll.payableDays}/{payroll.totalDays}</span>
                                <span>Net Salary: <span className="font-semibold text-[#1F1B2E]">₹ {payroll.netSalary.toLocaleString()}</span></span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDownloadSlip(payroll.id, employee.name, payroll.month, payroll.year)}
                              disabled={downloadingId === payroll.id}
                              className="flex items-center gap-2 px-4 py-2 bg-[#4B2A6A] text-white rounded-lg hover:bg-[#3A1F54] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{ fontSize: '13px', fontWeight: 500 }}
                            >
                              {downloadingId === payroll.id ? (
                                <>Downloading...</>
                              ) : (
                                <>
                                  <Download className="w-4 h-4" />
                                  Download Slip
                                </>
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-[#6E6A7C]" style={{ fontSize: '14px' }}>
                          No payroll records found. Payroll will be generated after monthly processing.
                        </p>
                      </div>
                    )}
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
