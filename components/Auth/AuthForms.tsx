
import React, { useState } from 'react';
import { UserRole } from '../../types';
import { db } from '../../services/databaseService';
import { Building2, Mail, Lock, User, ChevronRight, AlertCircle } from 'lucide-react';

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
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-md border border-slate-100 animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-indigo-200">
          <Building2 size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Join BuildStream</h2>
        <p className="text-slate-500 text-sm mt-1 font-medium italic">Empowering Modern Construction</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-600 text-sm font-medium animate-in slide-in-from-top-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-slate-300" size={18} />
            <input required className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                   placeholder="e.g. Michael Chen" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Work Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-slate-300" size={18} />
            <input required type="email" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                   placeholder="m.chen@contractor.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-slate-300" size={18} />
            <input required type="password" minLength={6} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                   placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Your Professional Role</label>
          <select 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 appearance-none font-medium text-slate-700"
            value={formData.role}
            onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
          >
            <optgroup label="Instant Access">
              <option value={UserRole.MANAGER}>Project Manager</option>
              <option value={UserRole.ENGINEER}>Site Engineer / Architect</option>
              <option value={UserRole.ADMIN}>Administration Manager</option>
              <option value={UserRole.EXECUTIVE}>Executive Leadership</option>
            </optgroup>
            <optgroup label="Requires Approval">
              <option value={UserRole.FOREMAN}>Site Foreman</option>
              <option value={UserRole.SUPERVISOR}>Site Supervisor</option>
              <option value={UserRole.SAFETY_OFFICER}>Safety Officer</option>
            </optgroup>
          </select>
        </div>

        <button 
          disabled={loading}
          type="submit" 
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group active:scale-95 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Create Account"}
          {!loading && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
        </button>
      </form>

      <div className="mt-8 text-center pt-6 border-t border-slate-50">
        <p className="text-slate-400 text-xs font-medium">Already have an account?</p>
        <button onClick={onSwitch} className="text-indigo-600 text-sm font-bold mt-1 hover:underline">Log in to Station</button>
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
      const user = await db.login(email, password);
      onSuccess(user);
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-md border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
          <Building2 size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Welcome Back</h2>
        <p className="text-slate-500 text-sm mt-1 font-medium">Enter your credentials to access site data</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-600 text-sm font-medium animate-in slide-in-from-top-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Work Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-slate-300" size={18} />
            <input required type="email" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                   placeholder="m.chen@contractor.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-slate-300" size={18} />
            <input required type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                   value={password} onChange={e => setPassword(e.target.value)} />
          </div>
        </div>

        <button 
          disabled={loading}
          type="submit" 
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 group"
        >
          {loading ? "Authenticating..." : "Access Dashboard"}
          {!loading && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
        </button>
      </form>

      <div className="mt-8 text-center pt-6 border-t border-slate-50">
        <p className="text-slate-400 text-xs font-medium">New to BuildStream?</p>
        <button onClick={onSwitch} className="text-indigo-600 text-sm font-bold mt-1 hover:underline">Register New Profile</button>
      </div>
    </div>
  );
};
