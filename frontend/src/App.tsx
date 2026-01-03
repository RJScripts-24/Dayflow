/**
 * App - Main application component with routing logic
 */

import { useState, useEffect } from 'react';
import { SignInPage } from './pages/SignInPage';
import { SignUp } from './components/SignUp';
import { DashboardPage } from './pages/DashboardPage';
import { Profile } from './components/Profile';
import { EmployeeProfile } from './components/EmployeeProfile';
import { SalaryDetailPage } from './pages/SalaryDetailPage';
import { USER_ROLES, type UserRole } from './utils/constants';
import { AuthService } from './services';

type PageType = 'signin' | 'signup' | 'dashboard' | 'profile' | 'employee-profile' | 'salary-detail';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('signin');
  const [userRole, setUserRole] = useState<UserRole>(USER_ROLES.EMPLOYEE);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [salaryViewParams, setSalaryViewParams] = useState<{
    employeeId: string;
    employeeName: string;
    month?: number;
    year?: number;
  } | null>(null);

  // Check authentication on mount and protect dashboard access
  useEffect(() => {
    const isAuthenticated = AuthService.isAuthenticated();
    const user = AuthService.getUser();
    
    if (!isAuthenticated || !user) {
      // Not authenticated, redirect to signin
      if (currentPage !== 'signin' && currentPage !== 'signup') {
        setCurrentPage('signin');
      }
    } else {
      // Authenticated, set user role
      setUserRole(user.role as UserRole);
    }
  }, [currentPage]);

  // Handle sign in with authentication check
  const handleSignIn = () => {
    console.log('App.handleSignIn called');
    const isAuthenticated = AuthService.isAuthenticated();
    const user = AuthService.getUser();
    console.log('App.handleSignIn check:', { isAuthenticated, hasUser: !!user, user });
    
    if (isAuthenticated && user) {
      console.log('App.handleSignIn: Setting user role and navigating to dashboard');
      setUserRole(user.role as UserRole);
      setCurrentPage('dashboard');
    } else {
      // Should not happen, but safety check
      console.error('Sign in callback called without valid authentication', { 
        isAuthenticated, 
        user,
        token: localStorage.getItem('dayflow_auth_token'),
        userStr: localStorage.getItem('dayflow_user')
      });
      alert('Authentication failed. Please check console for details and try again.');
    }
  };

  // Handle sign up with authentication check
  const handleSignUp = () => {
    const isAuthenticated = AuthService.isAuthenticated();
    const user = AuthService.getUser();
    
    if (isAuthenticated && user) {
      setUserRole(user.role as UserRole);
      setCurrentPage('dashboard');
    } else {
      // Should not happen, but safety check
      console.error('Sign up callback called without valid authentication');
    }
  };

  // Handle logout
  const handleLogout = () => {
    AuthService.clearAuth();
    setCurrentPage('signin');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {currentPage === 'signin' ? (
        <SignInPage 
          onSwitchToSignUp={() => setCurrentPage('signup')}
          onSignIn={handleSignIn}
        />
      ) : currentPage === 'signup' ? (
        <SignUp 
          onSwitchToSignIn={() => setCurrentPage('signin')}
          onSignUp={handleSignUp}
        />
      ) : currentPage === 'profile' ? (
        <Profile 
          onBack={() => setCurrentPage('dashboard')}
          onLogOut={handleLogout}
          userRole={userRole}
        />
      ) : currentPage === 'employee-profile' ? (
        <EmployeeProfile 
          onBack={() => setCurrentPage('dashboard')}
          userRole={userRole}
          employeeId={selectedEmployeeId}
        />
      ) : currentPage === 'salary-detail' ? (
        <SalaryDetailPage />
      ) : (
        <DashboardPage 
          onLogOut={handleLogout}
          onNavigateToProfile={() => setCurrentPage('profile')}
          onNavigateToEmployeeProfile={(employeeId: string) => {
            setSelectedEmployeeId(employeeId);
            setCurrentPage('employee-profile');
          }}
          onNavigateToSalaryDetail={(params: { employeeId: string; employeeName: string; month?: number; year?: number }) => {
            setSalaryViewParams(params);
            const searchParams = new URLSearchParams({
              employeeId: params.employeeId,
              employeeName: params.employeeName,
              ...(params.month && { month: params.month.toString() }),
              ...(params.year && { year: params.year.toString() })
            });
            window.history.pushState({}, '', `?page=salary-detail&${searchParams.toString()}`);
            setCurrentPage('salary-detail');
          }}
          userRole={userRole}
        />
      )}
    </div>
  );
}