
import React, { useState } from 'react';
import { MOCK_USERS, SITES } from '../constants';
import { User, UserRole, UserStatus } from '../types';
import { 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  Clock, 
  Shield, 
  MapPin,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Edit3,
  Users // Added missing icon import
} from 'lucide-react';

const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusStyle = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case UserStatus.INVITED: return 'bg-amber-50 text-amber-700 border-amber-200';
      case UserStatus.SUSPENDED: return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN: return <Shield size={14} className="text-indigo-600" />;
      case UserRole.SAFETY_OFFICER: return <AlertCircle size={14} className="text-rose-500" />;
      default: return <UserPlus size={14} className="text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Workforce Directory</h3>
          <p className="text-sm text-slate-500">Manage user access, roles, and site assignments across the portfolio.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-100">
          <UserPlus size={18} />
          Invite New User
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email, or role..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
            <Filter size={16} /> Filter Roles
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
            Site Assignments
          </button>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Details</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role & Site</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Active</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1"><Mail size={10} /> {user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                      {getRoleIcon(user.role)}
                      {user.role.replace('_', ' ')}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold uppercase">
                      <MapPin size={10} /> {SITES.find(s => s.id === user.siteId)?.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-tight ${getStatusStyle(user.status)}`}>
                    {user.status === UserStatus.ACTIVE && <CheckCircle2 size={10} />}
                    {user.status === UserStatus.INVITED && <Clock size={10} />}
                    {user.status === UserStatus.SUSPENDED && <XCircle size={10} />}
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-slate-500">
                  {user.lastActive}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Edit User">
                      <Edit3 size={16} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 transition-all">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Logs */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Users size={120} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-bold">Audit Trail: Workforce Activity</h4>
            <p className="text-slate-400 text-sm mt-1">Real-time log of administrative changes and user access events.</p>
          </div>
          <button className="px-4 py-2 bg-indigo-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-500 transition-colors">
            View Full Activity Log
          </button>
        </div>
        <div className="mt-6 space-y-3">
          {[
            { user: 'James Miller', action: 'Invited Robert Wilson', time: '10 mins ago' },
            { user: 'System', action: 'Daily report DSR-045 approved by Supervisor', time: '2 hours ago' },
            { user: 'James Miller', action: 'Suspended David Lee', time: '4 hours ago' },
          ].map((log, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0 text-[11px] font-medium">
              <span className="text-indigo-400">{log.user}</span>
              <span className="text-slate-300">{log.action}</span>
              <span className="text-slate-500 italic">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;
