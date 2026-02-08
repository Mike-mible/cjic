
import React, { useState } from 'react';
import { UserRole } from '../../types';
import { db } from '../../services/databaseService';
import { Building2, Mail, Lock, User, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';

interface AuthFormProps {
  onSuccess: (user: any) => void;
  onSwitch: () => void;
}

export const SignupForm: React.FC<AuthFormProps> = ({ onSuccess, onSwitch }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: UserRole.FOREMAN
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await db.signup(formData);
      onSuccess(user);
    } catch (err: any) {
      setError(err.message || "Signup failed. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-100 animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-indigo-100">
          <Building2 size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">BuildStream Pro</h2>
        <p className="text-slate-500 text-sm mt-1 font-medium italic">Create your field identity</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-xs font-bold animate-in slide-in-from-top-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Official Name</label>
          <div className="relative">
            <User className="absolute left-4 top-3.5 text-slate-300" size={18} />
            <input required className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium" 
                   placeholder="e.g. Robert Wilson" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Corporate Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-slate-300" size={18} />
            <input required type="email" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium" 
                   placeholder="robert.w@company.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-slate-300" size={18} />
            <input required type="password" minLength={6} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium" 
                   placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Project Assignment Role</label>
          <select 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 appearance-none font-bold text-slate-700"
            value={formData.role}
            onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
          >
            <option value={UserRole.FOREMAN}>Site Foreman (Pending Approval)</option>
            <option value={UserRole.SAFETY_OFFICER}>Safety Officer (Pending Approval)</option>
            <option value={UserRole.SUPERVISOR}>Site Supervisor (Pending Approval)</option>
            <option value={UserRole.ENGINEER}>Site Engineer (Auto-Active)</option>
            <option value={UserRole.MANAGER}>Project Manager (Auto-Active)</option>
            <option value={UserRole.EXECUTIVE}>Executive Director (Auto-Active)</option>
          </select>
        </div>

        <button 
          disabled={loading}
          type="submit" 
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center justify-center gap-2 group active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : "Initiate Onboarding"}
          {!loading && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
        </button>
      </form>

      <div className="mt-10 text-center pt-6 border-t border-slate-100">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Existing Personnel?</p>
        <button onClick={onSwitch} className="text-indigo-600 text-sm font-bold mt-1 hover:underline">Access Command Station</button>
      </div>
    </div>
  );
};

export const LoginForm: React.FC<AuthFormProps> = ({ onSuccess, onSwitch }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await db.login(email, password);
      // Success handled by Auth listener in App.tsx
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Identity unverified.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-slate-200">
          <Building2 size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Station Access</h2>
        <p className="text-slate-500 text-sm mt-1 font-medium italic">Verified Personnel Only</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-xs font-bold animate-in slide-in-from-top-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email Identifier</label>
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-slate-300" size={18} />
            <input required type="email" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium" 
                   placeholder="r.wilson@buildstream.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Secure Token</label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-slate-300" size={18} />
            <input required type="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium" 
                   value={password} onChange={e => setPassword(e.target.value)} />
          </div>
        </div>

        <button 
          disabled={loading}
          type="submit" 
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 group active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : "Validate & Connect"}
          {!loading && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
        </button>
      </form>

      <div className="mt-10 text-center pt-6 border-t border-slate-100">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">New Deployment?</p>
        <button onClick={onSwitch} className="text-indigo-600 text-sm font-bold mt-1 hover:underline">Register New Profile</button>
      </div>
    </div>
  );
};
