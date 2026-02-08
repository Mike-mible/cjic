
import React, { useState, useEffect, useCallback } from 'react';
import { UserRole, Site, SiteLog, User, UserStatus } from './types';
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
import { db } from './services/databaseService';
import { supabase } from './services/supabaseClient';
import { Loader2, X, AlertCircle, RefreshCw, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('signup');

  const [sites, setSites] = useState<Site[]>([]);
  const [logs, setLogs] = useState<SiteLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setDataLoading(true);
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
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setIsInitializing(false);
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        setProfile(null);
        setAuthView('login');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = useCallback(async () => {
    if (!session?.user) return;
    setProfileLoading(true);
    try {
      const p = await db.getCurrentUserProfile();
      setProfile(p);
      if (p?.status === UserStatus.ACTIVE) fetchData();
    } catch (err) {
      console.error("Profile Load Error:", err);
    } finally {
      setProfileLoading(false);
    }
  }, [session, fetchData]);

  useEffect(() => {
    if (session && !profile && !profileLoading) {
      loadProfile();
    }
  }, [session, profile, profileLoading, loadProfile]);

  const handleLogout = async () => {
    await db.logout();
    setSession(null);
    setProfile(null);
  };

  const handleAuthSuccess = (user: User) => {
    // Inject user directly to bypass loading screen delay
    setProfile(user);
    if (user.status === UserStatus.ACTIVE) fetchData();
  };

  // 1. Initial Launch
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
        <Loader2 className="text-indigo-500 animate-spin mb-4" size={48} />
        <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Deploying BuildStream...</p>
      </div>
    );
  }

  // 2. Auth Flow
  if (!session) {
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

  // 3. Loading State
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
        <div className="bg-slate-800 p-10 rounded-[2.5rem] border border-slate-700 flex flex-col items-center gap-6 shadow-2xl">
          <Loader2 className="text-indigo-400 animate-spin" size={40} />
          <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Retrieving Site Profile...</p>
        </div>
      </div>
    );
  }

  // 4. Error: Session exists but Profile is missing from DB
  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-white p-12 rounded-[3rem] text-center max-w-sm shadow-2xl">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
          <h2 className="text-xl font-black uppercase text-slate-900 mb-2">Profile Not Found</h2>
          <p className="text-slate-500 text-sm mb-8 font-medium italic">We verified your login, but your professional record is missing from our site database.</p>
          <div className="space-y-3">
            <button onClick={loadProfile} className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white font-bold rounded-2xl text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all">
              <RefreshCw size={16} /> Retry Connection
            </button>
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-4 bg-slate-100 text-slate-900 font-bold rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5. Approval State
  if (profile.status === UserStatus.PENDING) {
    return <PendingApproval onLogout={handleLogout} />;
  }

  // 6. Access Revoked State
  if (profile.status === UserStatus.REJECTED || profile.status === UserStatus.SUSPENDED) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-white p-12 rounded-[3rem] text-center max-w-sm shadow-2xl">
          <X className="w-16 h-16 bg-rose-500 text-white rounded-full p-4 mx-auto mb-6 shadow-xl shadow-rose-100" />
          <h2 className="text-xl font-black uppercase text-slate-900 mb-2 tracking-tight">Access Revoked</h2>
          <p className="text-slate-500 text-sm mb-8 font-medium italic leading-relaxed">System administration has restricted your access to this site station.</p>
          <button onClick={handleLogout} className="w-full py-4 bg-slate-100 text-slate-900 font-bold rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">Disconnect Identity</button>
        </div>
      </div>
    );
  }

  // 7. Success: Dashboard View
  return (
    <Layout activeRole={profile.role} setActiveRole={() => {}} user={profile} onLogout={handleLogout}>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
        {dataLoading && (
          <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-indigo-600 animate-pulse bg-indigo-50 w-fit px-3 py-1.5 rounded-full border border-indigo-100">
            <Loader2 size={12} className="animate-spin" /> REFRESHING STATION DATA...
          </div>
        )}
        
        {(() => {
          switch (profile.role) {
            case UserRole.ADMIN:
            case UserRole.SUPER_ADMIN:
              return <AdminUserManagement initialUsers={users} sites={sites} onRefresh={fetchData} />;
            case UserRole.PROJECT_MANAGER:
            case UserRole.CONSTRUCTION_MANAGER:
            case UserRole.ADMIN_MANAGER:
            case UserRole.EXECUTIVE:
              return <ExecutiveDashboard sites={sites} />;
            case UserRole.SITE_ENGINEER:
            case UserRole.ARCHITECT:
              return <EngineerDashboard logs={logs} sites={sites} onReview={async (id, s, f) => {
                await db.updateSiteLogStatus(id, s, f);
                fetchData();
              }} />;
            case UserRole.FOREMAN:
            case UserRole.SITE_SUPERVISOR:
              return <SiteLogForm onSubmit={async (log) => {
                await db.createSiteLog(log);
                alert("Daily log submitted.");
                fetchData();
              }} sites={sites} />;
            case UserRole.SAFETY_OFFICER:
              return <SafetyReportForm onSubmit={async (rep) => {
                await db.createSafetyReport(rep);
                alert("Safety report submitted.");
                fetchData();
              }} sites={sites} />;
            default:
              return <PMAnalytics logs={logs} sites={sites} />;
          }
        })()}
      </div>
    </Layout>
  );
};

export default App;
