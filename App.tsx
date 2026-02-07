import React, { useState, useEffect, useCallback } from 'react';
import { UserRole, Site, SiteLog, User, SafetyReport, UserStatus } from './types';
import Layout from './components/Layout';
import SiteLogForm from './components/SiteLogForm';
import EngineerDashboard from './components/EngineerDashboard';
import PMAnalytics from './components/PMAnalytics';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import CMDashboard from './components/CMDashboard';
import AdminUserManagement from './components/AdminUserManagement';
import SafetyReportForm from './components/SafetyReportForm';
import { SignupForm, LoginForm } from './components/Auth/AuthForms';
import PendingApproval from './components/Auth/PendingApproval';
import BootstrapSystem from './components/BootstrapSystem';
import OnboardingWizard from './components/OnboardingWizard';
import { db } from './services/databaseService';
import { X, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [dbStatus, setDbStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [authView, setAuthView] = useState<'login' | 'signup'>('signup');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<UserRole | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // App State
  const [sites, setSites] = useState<Site[]>([]);
  const [logs, setLogs] = useState<SiteLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [sitesData, logsData, usersData] = await Promise.all([
        db.getSites(),
        db.getSiteLogs(),
        db.getUsers()
      ]);
      
      setSites(sitesData);
      setLogs(logsData);
      setUsers(usersData);

      if (currentUser) {
        const refreshed = usersData.find(u => u.id === currentUser.id);
        if (refreshed) {
          setCurrentUser(refreshed);
          if (!activeTab) setActiveTab(refreshed.role);
          
          // Trigger onboarding if active but missing profile details
          if (refreshed.status === UserStatus.ACTIVE && !refreshed.phone) {
            setShowOnboarding(true);
          }
        }
      }

      setDbStatus('connected');
    } catch (err) {
      console.error("Data Fetch Error:", err);
      setDbStatus('error');
    } finally {
      setLoading(false);
    }
  }, [currentUser, activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setActiveTab(user.role);
    localStorage.setItem('buildstream_user_email', user.email);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab(null);
    setShowOnboarding(false);
    localStorage.removeItem('buildstream_user_email');
    setAuthView('login');
  };

  const handleLogSubmit = async (logData: Partial<SiteLog>) => {
    try {
      await db.createSiteLog(logData);
      alert("Daily site log has been pushed to the review queue.");
      fetchData();
    } catch (err) {
      alert("Error submitting site log.");
    }
  };

  const handleSafetySubmit = async (reportData: Partial<SafetyReport>) => {
    try {
      await db.createSafetyReport(reportData);
      alert("Safety audit recorded.");
      fetchData();
    } catch (err) {
      alert("Error submitting safety report.");
    }
  };

  const handleLogReview = async (id: string, status: string, feedback: string) => {
    try {
      await db.updateSiteLogStatus(id, status, feedback);
      fetchData();
    } catch (err) {
      alert("Error updating log status.");
    }
  };

  const renderActiveView = () => {
    if (!activeTab || !currentUser) return null;

    switch (activeTab) {
      case UserRole.ADMIN:
      case UserRole.SUPER_ADMIN:
        return <AdminUserManagement initialUsers={users} sites={sites} onRefresh={fetchData} />;
      case UserRole.FOREMAN:
        return <SiteLogForm onSubmit={handleLogSubmit} sites={sites} />;
      case UserRole.SAFETY_OFFICER:
        return <SafetyReportForm onSubmit={handleSafetySubmit} sites={sites} />;
      case UserRole.ENGINEER:
        return <EngineerDashboard logs={logs} sites={sites} onReview={handleLogReview} />;
      case UserRole.SUPERVISOR:
        return <CMDashboard logs={logs} sites={sites} />;
      case UserRole.MANAGER:
        return <PMAnalytics logs={logs} sites={sites} />;
      case UserRole.EXECUTIVE:
        return <ExecutiveDashboard sites={sites} />;
      default:
        return <PMAnalytics logs={logs} sites={sites} />;
    }
  };

  // 1. Initial Load
  if (dbStatus === 'connecting') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="text-indigo-500 animate-spin" size={48} />
      </div>
    );
  }

  // 2. Fresh System Bootstrap
  if (dbStatus === 'connected' && sites.length === 0) {
    return <BootstrapSystem onComplete={fetchData} />;
  }

  // 3. Unauthenticated View
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
        {authView === 'login' ? (
          <LoginForm onSuccess={handleAuthSuccess} onSwitch={() => setAuthView('signup')} />
        ) : (
          <SignupForm onSuccess={handleAuthSuccess} onSwitch={() => setAuthView('login')} />
        )}
      </div>
    );
  }

  // 4. Verification Check
  if (currentUser.status === UserStatus.PENDING) {
    return <PendingApproval onLogout={handleLogout} />;
  }

  if (currentUser.status === UserStatus.REJECTED) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-[3rem] text-center max-w-sm">
          <div className="w-16 h-16 bg-rose-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <X size={32} />
          </div>
          <h2 className="text-xl font-black uppercase text-slate-900 mb-2 tracking-tight">Access Blocked</h2>
          <p className="text-slate-500 text-sm mb-8 font-medium">Your registration was declined. Please contact your regional Project Manager for details.</p>
          <button onClick={handleLogout} className="px-6 py-2.5 bg-slate-100 text-slate-900 font-bold rounded-xl text-xs uppercase tracking-widest">Return to Login</button>
        </div>
      </div>
    );
  }

  // 5. Onboarding Overlay
  if (showOnboarding) {
    return <OnboardingWizard user={currentUser} onComplete={() => { setShowOnboarding(false); fetchData(); }} />;
  }

  // 6. Primary Dashboard
  return (
    <Layout 
      activeRole={activeTab as UserRole} 
      setActiveRole={(role) => setActiveTab(role as UserRole)}
      user={currentUser}
      onLogout={handleLogout}
    >
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
        {renderActiveView()}
      </div>
    </Layout>
  );
};

export default App;