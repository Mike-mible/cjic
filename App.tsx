import React, { useState, useEffect, useCallback } from 'react';
import { UserRole, Site, SiteLog, User, SafetyReport, UserStatus } from './types';
import Layout from './components/Layout';
import SiteLogForm from './components/SiteLogForm';
import EngineerDashboard from './components/EngineerDashboard';
import PMAnalytics from './components/PMAnalytics';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import AdminUserManagement from './components/AdminUserManagement';
import SafetyReportForm from './components/SafetyReportForm';
import OnboardingWizard from './components/OnboardingWizard';
import BootstrapSystem from './components/BootstrapSystem';
import { db } from './services/databaseService';

const App: React.FC = () => {
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.ADMIN);
  const [dbStatus, setDbStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  
  // App State
  const [sites, setSites] = useState<Site[]>([]);
  const [logs, setLogs] = useState<SiteLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [safetyReports, setSafetyReports] = useState<SafetyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSystemEmpty, setIsSystemEmpty] = useState(false);

  // Current User Simulation
  const [currentUser, setCurrentUser] = useState<User | null>(null);

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

      // Check if system is empty
      if (usersData.length === 0) {
        setIsSystemEmpty(true);
        setDbStatus('connected');
        return;
      } else {
        setIsSystemEmpty(false);
      }
      
      if (usersData.length > 0 && !currentUser) {
        setCurrentUser(usersData[0]);
        setActiveRole(usersData[0].role);
      } else if (currentUser) {
        const refreshedUser = usersData.find(u => u.id === currentUser.id);
        if (refreshedUser) setCurrentUser(refreshedUser);
      }

      setDbStatus('connected');
    } catch (err) {
      console.error("Data Fetch Error:", err);
      setDbStatus('error');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogSubmit = async (logData: Partial<SiteLog>) => {
    try {
      await db.createSiteLog(logData);
      alert("Site log submitted successfully!");
      fetchData();
    } catch (err) {
      alert("Error submitting site log.");
      console.error(err);
    }
  };

  const handleSafetySubmit = async (reportData: Partial<SafetyReport>) => {
    try {
      await db.createSafetyReport(reportData);
      alert("Safety report submitted successfully!");
      fetchData();
    } catch (err) {
      alert("Error submitting safety report.");
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
      case UserRole.SUPER_ADMIN:
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
        return <div className="p-12 text-center">Module Restricted</div>;
    }
  };

  // Logic to show onboarding if user is INVITED
  const showOnboarding = currentUser?.status === UserStatus.INVITED;

  if (isSystemEmpty) {
    return <BootstrapSystem onComplete={fetchData} />;
  }

  return (
    <>
      {dbStatus === 'error' && (
        <div className="fixed top-0 left-0 w-full bg-amber-500 text-white text-[10px] font-black py-1 px-4 z-[100] text-center uppercase tracking-widest shadow-lg">
          Warning: Supabase connection failed. Apply SQL schema.
        </div>
      )}
      
      {showOnboarding && currentUser && (
        <OnboardingWizard user={currentUser} onComplete={fetchData} />
      )}
      
      <Layout activeRole={activeRole} setActiveRole={setActiveRole}>
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex gap-2">
              <button onClick={fetchData} className="text-[10px] font-bold text-slate-500 hover:bg-slate-100 px-2 py-1 rounded border border-slate-200 uppercase">
                Refresh
              </button>
            </div>
            <div className="flex gap-1 bg-white p-1 rounded-lg border border-slate-200">
              <select value={activeRole} onChange={(e) => setActiveRole(e.target.value as UserRole)} className="text-[10px] font-bold text-slate-600 outline-none uppercase px-2">
                {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
              </select>
            </div>
          </div>
          {renderView()}
        </div>
      </Layout>
    </>
  );
};

export default App;