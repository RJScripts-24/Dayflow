/**
 * App - Main application component with routing logic
 */

import { useState } from 'react';
import { SignInPage } from './pages/SignInPage';
import { SignUp } from './components/SignUp';
import { DashboardPage } from './pages/DashboardPage';
import { Profile } from './components/Profile';
import { EmployeeProfile } from './components/EmployeeProfile';
import { USER_ROLES, type UserRole } from './utils/constants';

type PageType = 'signin' | 'signup' | 'dashboard' | 'profile' | 'employee-profile';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('signin');
  const [userRole, setUserRole] = useState<UserRole>(USER_ROLES.EMPLOYEE);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {currentPage === 'signin' ? (
        <SignInPage 
          onSwitchToSignUp={() => setCurrentPage('signup')}
          onSignIn={() => setCurrentPage('dashboard')}
        />
      ) : currentPage === 'signup' ? (
        <SignUp 
          onSwitchToSignIn={() => setCurrentPage('signin')}
          onSignUp={() => setCurrentPage('dashboard')}
        />
      ) : currentPage === 'profile' ? (
        <Profile 
          onBack={() => setCurrentPage('dashboard')}
          onLogOut={() => setCurrentPage('signin')}
          userRole={userRole}
          onRoleChange={setUserRole}
        />
      ) : currentPage === 'employee-profile' ? (
        <EmployeeProfile 
          onBack={() => setCurrentPage('dashboard')}
          userRole={userRole}
        />
      ) : (
        <DashboardPage 
          onLogOut={() => setCurrentPage('signin')}
          onNavigateToProfile={() => setCurrentPage('profile')}
          onNavigateToEmployeeProfile={() => setCurrentPage('employee-profile')}
          userRole={userRole}
          onRoleChange={setUserRole}
        />
      )}
    </div>
  );
}