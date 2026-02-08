
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
import { Loader2, X, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  // Authentication State
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('signup');

  // Application Data State
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

  // STEP 1 & 2: Check session on app load and listen for changes
  useEffect(() => {
    const checkInitialSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setIsInitializing(false);
    };

    checkInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // Reset view to login if session is lost
      if (!session) {
        setProfile(null);
        setAuthView('login');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // STEP 3: After session exists -> fetch user role/status
  useEffect(() => {
    if (!session?.user) return;

    const loadProfile = async () => {
      setProfileLoading(true);
      try {
        const p = await db.getCurrentUserProfile();
        setProfile(p);
        
        // If profile is active, start fetching app data immediately
        if (p?.status === UserStatus.ACTIVE) {
          fetchData();
        }
      } catch (err) {
        console.error("Profile Load Error:", err);
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [session, fetchData]);

  const handleLogout = async () => {
    await db.logout();
    setSession(null);
    setProfile(null);
  };

  const handleAuthSuccess = async () => {
    // Trigger manual profile sync after successful auth form submission
    const p = await db.getCurrentUserProfile();
    setProfile(p);
  };

  // STEP 4: Routing Logic (The Main Render)
  
  // 1. App Initializing (Auth Service Check)
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
        <Loader2 className="text-indigo-500 animate-spin mb-4" size={48} />
        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Verifying BuildStream Link...</p>
      </div>
    );
  }

  // 2. Unauthenticated (Sign In / Sign Up)
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

  // 3. Authenticated but Profile not yet fetched
  if (profileLoading || !profile) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
        <div className="bg-slate-800 p-8 rounded-[2rem] border border-slate-700 flex flex-col items-center gap-4">
          <Loader2 className="text-indigo-400 animate-spin" size={32} />
          <p className="text-slate-300 font-bold uppercase tracking-widest text-[10px]">Syncing User Profile...</p>
        </div>
      </div>
    );
  }

  // 4. Pending Approval Screen
  if (profile.status === UserStatus.PENDING) {
    return <PendingApproval onLogout={handleLogout} />;
  }

  // 5. Rejected / Suspended Screen
  if (profile.status === UserStatus.REJECTED || profile.status === UserStatus.SUSPENDED) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-white p-12 rounded-[3rem] text-center max-w-sm shadow-2xl">
          <X className="w-16 h-16 bg-rose-500 text-white rounded-full p-4 mx-auto mb-6 shadow-xl shadow-rose-100" />
          <h2 className="text-xl font-black uppercase text-slate-900 mb-2 tracking-tight">Access Revoked</h2>
          <p className="text-slate-500 text-sm mb-8 font-medium italic leading-relaxed">System administration has restricted your access to this site station.</p>
          <button onClick={handleLogout} className="w-full py-4 bg-slate-100 text-slate-900 font-bold rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95">Disconnect Identity</button>
        </div>
      </div>
    );
  }

  // 6. Role-Based Dashboard Routing
  const renderDashboard = () => {
    switch (profile.role) {
      // Admin Dashboards
      case UserRole.ADMIN:
      case UserRole.SUPER_ADMIN:
        return <AdminUserManagement initialUsers={users} sites={sites} onRefresh={fetchData} />;

      // Executive Dashboards (PM, CM, Admin Manager)
      case UserRole.PROJECT_MANAGER:
      case UserRole.CONSTRUCTION_MANAGER:
      case UserRole.ADMIN_MANAGER:
      case UserRole.EXECUTIVE:
        return <ExecutiveDashboard sites={sites} />;

      // Engineering Hub (Engineers & Architects)
      case UserRole.SITE_ENGINEER:
      case UserRole.ARCHITECT:
        return <EngineerDashboard logs={logs} sites={sites} onReview={async (id, s, f) => {
          await db.updateSiteLogStatus(id, s, f);
          fetchData();
        }} />;

      // Site Operations (Foremen, Supervisors)
      case UserRole.FOREMAN:
      case UserRole.SITE_SUPERVISOR:
        return <SiteLogForm onSubmit={async (log) => {
          await db.createSiteLog(log);
          alert("Daily log submitted.");
          fetchData();
        }} sites={sites} />;

      // Safety Station
      case UserRole.SAFETY_OFFICER:
        return <SafetyReportForm onSubmit={async (rep) => {
          await db.createSafetyReport(rep);
          alert("Safety report submitted.");
          fetchData();
        }} sites={sites} />;

      default:
        return <PMAnalytics logs={logs} sites={sites} />;
    }
  };

  return (
    <Layout 
      activeRole={profile.role} 
      setActiveRole={() => {}} // Tab switching can be handled locally or globally as needed
      user={profile}
      onLogout={handleLogout}
    >
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
        {dataLoading && (
          <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-indigo-600 animate-pulse bg-indigo-50 w-fit px-3 py-1.5 rounded-full border border-indigo-100">
            <Loader2 size={12} className="animate-spin" /> SYNCING STATION DATA...
          </div>
        )}
        {renderDashboard()}
      </div>
    </Layout>
  );
};

export default App;
