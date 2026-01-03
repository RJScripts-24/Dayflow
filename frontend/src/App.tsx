import { useState } from 'react';
import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';
import { Dashboard } from './components/Dashboard';
import { Profile } from './components/Profile';
import { EmployeeProfile } from './components/EmployeeProfile';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'signin' | 'signup' | 'dashboard' | 'profile' | 'employee-profile'>('signin');
  const [userRole, setUserRole] = useState<'admin' | 'employee'>('employee');

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {currentPage === 'signin' ? (
        <SignIn 
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
        <Dashboard 
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