
import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import Layout from './components/Layout';
import SiteLogForm from './components/SiteLogForm';
import EngineerDashboard from './components/EngineerDashboard';
import PMAnalytics from './components/PMAnalytics';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import AdminUserManagement from './components/AdminUserManagement';
import SafetyReportForm from './components/SafetyReportForm';
import OnboardingWizard from './components/OnboardingWizard';
import { supabase } from './services/supabaseClient';

const App: React.FC = () => {
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.ADMIN);
  // Set to true by default so the preview loads the dashboard immediately
  const [isOnboarded, setIsOnboarded] = useState(true);
  const [dbStatus, setDbStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Simple query to verify connection
        const { error } = await supabase.from('sites').select('id').limit(1);
        if (error) {
          console.warn("Supabase connection warning (Tables may not exist yet):", error.message);
          // We allow the app to continue in Demo Mode even if tables aren't created
        }
        setDbStatus('connected');
      } catch (err) {
        console.error("Supabase connection error:", err);
        setDbStatus('error');
      }
    };
    checkConnection();
  }, []);

  const renderView = () => {
    switch (activeRole) {
      case UserRole.ADMIN:
        return <AdminUserManagement />;
      case UserRole.FOREMAN:
        return <SiteLogForm onSubmit={(log) => console.log("Submitting log:", log)} />;
      case UserRole.SAFETY_OFFICER:
        return <SafetyReportForm />;
      case UserRole.SUPERVISOR:
      case UserRole.ENGINEER:
        return <EngineerDashboard />;
      case UserRole.MANAGER:
        return <PMAnalytics />;
      case UserRole.EXECUTIVE:
        return <ExecutiveDashboard />;
      default:
        return (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm max-w-md mx-auto mt-20">
            <p className="font-black uppercase tracking-widest text-sm text-slate-900">Module Locked</p>
            <p className="text-xs mt-2 font-medium text-slate-400">Please switch roles in the sidebar to access this section.</p>
          </div>
        );
    }
  };

  return (
    <>
      {dbStatus === 'error' && (
        <div className="fixed top-0 left-0 w-full bg-amber-500 text-white text-[10px] font-black py-1 px-4 z-[100] text-center uppercase tracking-widest shadow-lg">
          Demo Mode: Supabase connection failed or tables missing. Using mock data.
        </div>
      )}
      
      {!isOnboarded && <OnboardingWizard onComplete={() => setIsOnboarded(true)} />}
      
      <Layout activeRole={activeRole} setActiveRole={setActiveRole}>
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex gap-2">
              <button 
                onClick={() => setIsOnboarded(false)}
                className="text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded transition-colors uppercase border border-indigo-100"
              >
                Re-run Onboarding
              </button>
            </div>
          </div>
          {renderView()}
        </div>
      </Layout>
    </>
  );
};

export default App;
