import React, { useState } from 'react';
import { User, UserRole, UserStatus, Site } from '../types';
import { 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Clock, 
  Shield, 
  MapPin,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Edit3,
  Users,
  X,
  UserCheck,
  UserX
} from 'lucide-react';
import { db } from '../services/databaseService';

interface AdminUserManagementProps {
  initialUsers: User[];
  sites: Site[];
  onRefresh: () => Promise<void>;
}

const AdminUserManagement: React.FC<AdminUserManagementProps> = ({ initialUsers, sites, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tab, setTab] = useState<'all' | 'pending'>('all');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  
  const getStatusStyle = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case UserStatus.PENDING: return 'bg-amber-50 text-amber-700 border-amber-200';
      case UserStatus.REJECTED: return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  const handleAction = async (id: string, status: UserStatus) => {
    try {
      await db.updateStatus(id, status);
      await onRefresh();
    } catch (err) {
      console.error(err);
      alert("Status update failed");
    }
  };

  const filteredUsers = initialUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = tab === 'all' ? true : user.status === UserStatus.PENDING;
    return matchesSearch && matchesTab;
  });

  const pendingCount = initialUsers.filter(u => u.status === UserStatus.PENDING).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Workforce Station</h3>
          <p className="text-sm text-slate-500">Managing {initialUsers.length} total staff across site locations.</p>
        </div>
        <button 
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-100"
        >
          <UserPlus size={18} />
          Manual Registration
        </button>
      </div>

      <div className="flex gap-4 border-b border-slate-200">
        <button 
          onClick={() => setTab('all')}
          className={`pb-4 px-2 text-xs font-black uppercase tracking-widest transition-all ${tab === 'all' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Active Workforce
        </button>
        <button 
          onClick={() => setTab('pending')}
          className={`pb-4 px-2 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${tab === 'pending' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Approval Queue
          {pendingCount > 0 && <span className="bg-rose-500 text-white px-1.5 py-0.5 rounded-full text-[9px]">{pendingCount}</span>}
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Details</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Professional Role</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 overflow-hidden">
                      {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-tight">
                    <Shield size={12} className="text-indigo-400" />
                    {user.role.replace('_', ' ')}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-tight ${getStatusStyle(user.status)}`}>
                    {user.status === UserStatus.ACTIVE && <CheckCircle2 size={10} />}
                    {user.status === UserStatus.PENDING && <Clock size={10} />}
                    {user.status === UserStatus.REJECTED && <XCircle size={10} />}
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {user.status === UserStatus.PENDING ? (
                      <div className="flex gap-1">
                        <button 
                          onClick={() => handleAction(user.id, UserStatus.ACTIVE)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-[10px] font-black uppercase rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          <UserCheck size={14} /> Approve
                        </button>
                        <button 
                          onClick={() => handleAction(user.id, UserStatus.REJECTED)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-rose-600 border border-rose-100 text-[10px] font-black uppercase rounded-lg hover:bg-rose-50 transition-colors"
                        >
                          <UserX size={14} /> Reject
                        </button>
                      </div>
                    ) : (
                      <button className="p-2 text-slate-400 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100">
                        <MoreVertical size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic text-sm">No records found matching criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserManagement;