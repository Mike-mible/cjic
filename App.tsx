
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
import { supabase } from './services/supabaseClient';
import { X, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [authView, setAuthView] = useState<'login' | 'signup'>('signup');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<UserRole | null>(null);

  // App Data State
  const [sites, setSites] = useState<Site[]>([]);
  const [logs, setLogs] = useState<SiteLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

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
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Listen for Supabase Auth changes
  useEffect(() => {
    const initAuth = async () => {
      const profile = await db.getCurrentUserProfile();
      if (profile) {
        setCurrentUser(profile);
        setActiveTab(profile.role);
        if (profile.status === UserStatus.ACTIVE) {
          fetchData();
        }
      }
      setIsInitializing(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const profile = await db.getCurrentUserProfile();
        setCurrentUser(profile);
        if (profile) {
          setActiveTab(profile.role);
          if (profile.status === UserStatus.ACTIVE) fetchData();
        }
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setActiveTab(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchData]);

  const handleLogout = async () => {
    await db.logout();
    setCurrentUser(null);
    setAuthView('login');
  };

  const handleLogSubmit = async (logData: Partial<SiteLog>) => {
    await db.createSiteLog(logData);
    alert("Site log submitted for review.");
    fetchData();
  };

  const handleSafetySubmit = async (reportData: Partial<SafetyReport>) => {
    await db.createSafetyReport(reportData);
    alert("Safety audit recorded.");
    fetchData();
  };

  const handleLogReview = async (id: string, status: string, feedback: string) => {
    await db.updateSiteLogStatus(id, status, feedback);
    fetchData();
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

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="text-indigo-500 animate-spin" size={48} />
      </div>
    );
  }

  // 1. Unauthenticated
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
        {authView === 'login' ? (
          <LoginForm onSuccess={() => {}} onSwitch={() => setAuthView('signup')} />
        ) : (
          <SignupForm onSuccess={() => {}} onSwitch={() => setAuthView('login')} />
        )}
      </div>
    );
  }

  // 2. Pending Approval
  if (currentUser.status === UserStatus.PENDING) {
    return <PendingApproval onLogout={handleLogout} />;
  }

  // 3. Blocked / Rejected
  if (currentUser.status === UserStatus.REJECTED || currentUser.status === UserStatus.SUSPENDED) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-[3rem] text-center max-w-sm shadow-2xl">
          <div className="w-16 h-16 bg-rose-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <X size={32} />
          </div>
          <h2 className="text-xl font-black uppercase text-slate-900 mb-2 tracking-tight">Access Revoked</h2>
          <p className="text-slate-500 text-sm mb-8 font-medium">Your credentials have been deactivated by a System Administrator.</p>
          <button onClick={handleLogout} className="w-full py-3 bg-slate-100 text-slate-900 font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Sign Out</button>
        </div>
      </div>
    );
  }

  // 4. Main Dashboard
  return (
    <Layout 
      activeRole={activeTab as UserRole} 
      setActiveRole={(role) => setActiveTab(role as UserRole)}
      user={currentUser}
      onLogout={handleLogout}
    >
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
        {loading && (
          <div className="flex items-center gap-2 mb-4 text-xs font-bold text-indigo-600 animate-pulse">
            <Loader2 size={14} className="animate-spin" /> Syncing Real-time Site Data...
          </div>
        )}
        {renderActiveView()}
      </div>
    </Layout>
  );
};

export default App;
