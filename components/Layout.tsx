
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
      id: UserRole.MANAGER, 
      label: 'Portfolio Analytics', 
      icon: LineChart, 
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.EXECUTIVE],
      description: 'Budget vs Progress'
    },
    { 
      id: UserRole.ENGINEER, 
      label: 'Engineering Hub', 
      icon: CheckSquare, 
      // Fixed: Property 'ARCHITECT' does not exist on type 'typeof UserRole'.
      // Removed UserRole.ARCHITECT since it is not defined in types.ts.
      roles: [UserRole.ADMIN, UserRole.ENGINEER, UserRole.SUPERVISOR],
      description: 'Review site data'
    },
    { 
      id: UserRole.FOREMAN, 
      label: 'Site Operations', 
      icon: ClipboardList, 
      roles: [UserRole.ADMIN, UserRole.FOREMAN, UserRole.SUPERVISOR],
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
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col hidden md:flex shrink-0 border-r border-slate-800">
        <div className="p-8">
          <h1 className="text-xl font-black flex items-center gap-2 tracking-tighter">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Building2 className="text-white" size={20} />
            </div>
            BUILDSTREAM <span className="text-indigo-400">PRO</span>
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-4 mb-4">Command Center</div>
          {filteredMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveRole(item.id)}
              className={`w-full flex items-start gap-3 px-4 py-3 rounded-2xl transition-all group ${
                activeRole === item.id 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} className={activeRole === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'} />
              <div className="text-left">
                <p className="text-sm font-bold leading-none mb-1">{item.label}</p>
                <p className={`text-[10px] font-medium leading-none ${activeRole === item.id ? 'text-indigo-100' : 'text-slate-600'}`}>
                  {item.description}
                </p>
              </div>
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-slate-800/50 rounded-3xl p-5 border border-slate-700/50">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center font-black text-white shadow-lg">
                  {user.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{user.role.replace('_', ' ')}</p>
                </div>
             </div>
             <button 
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 py-2 bg-slate-700 hover:bg-rose-600/20 hover:text-rose-400 text-slate-300 rounded-xl text-xs font-bold transition-all"
             >
                <LogOut size={14} /> Sign Out
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Navigation</h2>
            <h1 className="text-lg font-bold text-slate-900">
              {allMenuItems.find(i => i.id === activeRole)?.label || 'Overview'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-4">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status</p>
               <div className="flex items-center gap-2">
                 <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                 <p className="text-xs font-bold text-slate-700">Live Station</p>
               </div>
            </div>
            
            <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-600 border border-slate-200 rounded-xl relative transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
