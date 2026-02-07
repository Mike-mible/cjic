
import React from 'react';
import { UserRole } from '../types';
import { 
  Users, 
  ClipboardList, 
  ShieldAlert, 
  CheckSquare, 
  BarChart3, 
  UserPlus, 
  Settings, 
  LogOut, 
  Bell,
  Building2,
  LayoutDashboard
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeRole, setActiveRole }) => {
  const allMenuItems = [
    { id: UserRole.ADMIN, label: 'User Management', icon: Users, roles: [UserRole.ADMIN] },
    { id: UserRole.FOREMAN, label: 'Daily Logging', icon: ClipboardList, roles: [UserRole.ADMIN, UserRole.FOREMAN] },
    { id: UserRole.SAFETY_OFFICER, label: 'Safety Reports', icon: ShieldAlert, roles: [UserRole.ADMIN, UserRole.SAFETY_OFFICER] },
    { id: UserRole.SUPERVISOR, label: 'Review Queue', icon: CheckSquare, roles: [UserRole.ADMIN, UserRole.SUPERVISOR] },
    { id: UserRole.MANAGER, label: 'Analytics', icon: BarChart3, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.ENGINEER] },
    { id: UserRole.ENGINEER, label: 'Report Center', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.ENGINEER, UserRole.MANAGER] },
  ];

  const filteredMenu = allMenuItems.filter(item => item.roles.includes(activeRole));

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Building2 className="text-indigo-400" />
            BuildStream <span className="text-indigo-400">Pro</span>
          </h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-4">Operations</div>
          {filteredMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveRole(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeRole === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
          
          <div className="pt-8 text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-4">System</div>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <Settings size={18} /> Settings
          </button>
        </nav>

        <div className="p-6 border-t border-slate-800">
           <div className="flex items-center gap-3 mb-6 px-1">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">JM</div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">James Miller</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{activeRole.replace('_', ' ')}</p>
              </div>
           </div>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-white transition-colors">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">
            {allMenuItems.find(i => i.id === activeRole)?.label || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">Systems Operational</span>
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-600 relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
