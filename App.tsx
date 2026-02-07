import React, { useState, useEffect, useCallback } from 'react';
import { UserRole, Site, SiteLog, User, SafetyReport } from './types';
import Layout from './components/Layout';
import SiteLogForm from './components/SiteLogForm';
import EngineerDashboard from './components/EngineerDashboard';
import PMAnalytics from './components/PMAnalytics';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import AdminUserManagement from './components/AdminUserManagement';
import SafetyReportForm from './components/SafetyReportForm';
import OnboardingWizard from './components/OnboardingWizard';
import { db } from './services/databaseService';
import { supabase } from './services/supabaseClient';

const App: React.FC = () => {
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.ADMIN);
  const [isOnboarded, setIsOnboarded] = useState(true);
  const [dbStatus, setDbStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  
  // App State
  const [sites, setSites] = useState<Site[]>([]);
  const [logs, setLogs] = useState<SiteLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [safetyReports, setSafetyReports] = useState<SafetyReport[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [sitesData, logsData, usersData, safetyData] = await Promise.all([
        db.getSites(),
        db.getSiteLogs(),
        db.getUsers(),
        db.getSafetyReports()
      ]);
      setSites(sitesData);
      setLogs(logsData);
      setUsers(usersData);
      setSafetyReports(safetyData);
      setDbStatus('connected');
    } catch (err) {
      console.error("Data Fetch Error:", err);
      setDbStatus('error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogSubmit = async (logData: Partial<SiteLog>) => {
    try {
      await db.createSiteLog(logData);
      alert("Site log submitted successfully!");
      fetchData();
    } catch (err) {
      alert("Error submitting site log. See console for details.");
      console.error(err);
    }
  };

  const handleSafetySubmit = async (reportData: Partial<SafetyReport>) => {
    try {
      await db.createSafetyReport(reportData);
      alert("Safety report submitted successfully!");
      fetchData();
    } catch (err) {
      alert("Error submitting safety report. See console for details.");
      console.error(err);
    }
  };

  const handleLogReview = async (id: string, status: string, feedback: string) => {
    try {
      await db.updateSiteLogStatus(id, status, feedback);
      fetchData();
    } catch (err) {
      alert("Error updating log status.");
      console.error(err);
    }
  };

  const renderView = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-medium">Syncing Project Data...</p>
        </div>
      );
    }

    switch (activeRole) {
      case UserRole.ADMIN:
        return <AdminUserManagement initialUsers={users} sites={sites} onRefresh={fetchData} />;
      case UserRole.FOREMAN:
        return <SiteLogForm onSubmit={handleLogSubmit} sites={sites} />;
      case UserRole.SAFETY_OFFICER:
        return <SafetyReportForm onSubmit={handleSafetySubmit} sites={sites} />;
      case UserRole.SUPERVISOR:
      case UserRole.ENGINEER:
        return <EngineerDashboard logs={logs} sites={sites} onReview={handleLogReview} />;
      case UserRole.MANAGER:
        return <PMAnalytics logs={logs} sites={sites} />;
      case UserRole.EXECUTIVE:
        return <ExecutiveDashboard sites={sites} />;
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
          Warning: Supabase connection failed or tables missing. Ensure SQL schema is applied.
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
              <button 
                onClick={fetchData}
                className="text-[10px] font-bold text-slate-500 hover:bg-slate-100 px-2 py-1 rounded transition-colors uppercase border border-slate-200"
              >
                Refresh Data
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