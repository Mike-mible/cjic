
import React from 'react';
import { UserRole, User } from '../types';
import { 
  Users, 
  ClipboardList, 
  ShieldAlert, 
  CheckSquare, 
  BarChart3, 
  Settings, 
  LogOut, 
  Bell,
  Building2,
  LayoutDashboard,
  HardHat,
  LineChart,
  FileText
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  user: User;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeRole, setActiveRole, user, onLogout }) => {
  const allMenuItems = [
    { 
      id: UserRole.ADMIN, 
      label: 'System Control', 
      icon: Settings, 
      roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
      description: 'Manage users and sites'
    },
    { 
      id: UserRole.PROJECT_MANAGER, 
      label: 'Portfolio Analytics', 
      icon: LineChart, 
      roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.EXECUTIVE, UserRole.CONSTRUCTION_MANAGER],
      description: 'Budget vs Progress'
    },
    { 
      id: UserRole.SITE_ENGINEER, 
      label: 'Engineering Hub', 
      icon: CheckSquare, 
      roles: [UserRole.ADMIN, UserRole.SITE_ENGINEER, UserRole.SITE_SUPERVISOR, UserRole.ARCHITECT],
      description: 'Review site data'
    },
    { 
      id: UserRole.FOREMAN, 
      label: 'Site Operations', 
      icon: ClipboardList, 
      roles: [UserRole.ADMIN, UserRole.FOREMAN, UserRole.SITE_SUPERVISOR],
      description: 'Submit daily logs'
    },
    { 
      id: UserRole.SAFETY_OFFICER, 
      label: 'Safety Station', 
      icon: ShieldAlert, 
      roles: [UserRole.ADMIN, UserRole.SAFETY_OFFICER],
      description: 'Compliance & Audits'
    },
    { 
      id: UserRole.EXECUTIVE, 
      label: 'Executive Summary', 
      icon: FileText, 
      roles: [UserRole.ADMIN, UserRole.EXECUTIVE],
      description: 'ROI Overview'
    },
  ];

  const filteredMenu = allMenuItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar */}
      <aside className="w-80 bg-slate-900 text-white flex flex-col hidden md:flex shrink-0 border-r border-slate-800">
        <div className="p-10">
          <h1 className="text-xl font-black flex items-center gap-2 tracking-tighter">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-900/50">
              <Building2 className="text-white" size={24} />
            </div>
            BUILDSTREAM <span className="text-indigo-400">PRO</span>
          </h1>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-4 mb-4">Command Center</div>
          {filteredMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveRole(item.id)}
              className={`w-full flex items-start gap-4 px-5 py-4 rounded-[1.5rem] transition-all group ${
                activeRole === item.id 
                  ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-900/60' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={22} className={activeRole === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'} />
              <div className="text-left">
                <p className="text-sm font-black leading-none mb-1.5 uppercase tracking-tight">{item.label}</p>
                <p className={`text-[10px] font-bold leading-none uppercase tracking-widest ${activeRole === item.id ? 'text-indigo-200' : 'text-slate-600'}`}>
                  {item.description}
                </p>
              </div>
            </button>
          ))}
        </nav>

        <div className="p-8 mt-auto">
          <div className="bg-slate-800/40 rounded-[2rem] p-6 border border-slate-800/60 backdrop-blur-sm">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center font-black text-lg text-white shadow-xl shadow-indigo-900/40 border border-white/10">
                  {user.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-black truncate text-white uppercase tracking-tight">{user.name}</p>
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-tight">{user.role.replace('_', ' ')}</p>
                </div>
             </div>
             <button 
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-700 hover:bg-rose-600/20 hover:text-rose-400 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-transparent hover:border-rose-900/30"
             >
                <LogOut size={16} /> Disconnect Session
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-24 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0">
          <div>
            <h2 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Station Telemetry</h2>
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">
              {allMenuItems.find(i => i.id === activeRole)?.label || 'Intelligence Hub'}
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex flex-col items-end px-6 border-r border-slate-100">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1.5">Encryption Level</p>
               <div className="flex items-center gap-2">
                 <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-200"></span>
                 <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">TLS 1.3 Active</p>
               </div>
            </div>
            
            <button className="p-3.5 bg-slate-50 text-slate-400 hover:text-indigo-600 border border-slate-200 rounded-2xl relative transition-all hover:scale-105 active:scale-95 group">
              <Bell size={22} className="group-hover:rotate-12 transition-transform" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 bg-slate-50/50 scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
