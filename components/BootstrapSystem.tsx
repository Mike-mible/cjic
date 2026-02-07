import React, { useState } from 'react';
import { Building2, ShieldCheck, Rocket, MapPin, Mail, User } from 'lucide-react';
import { db } from '../services/databaseService';

interface BootstrapSystemProps {
  onComplete: () => void;
}

const BootstrapSystem: React.FC<BootstrapSystemProps> = ({ onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    siteName: '',
    siteLocation: '',
    adminName: '',
    adminEmail: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await db.bootstrapSystem(
        { name: formData.siteName, location: formData.siteLocation },
        { name: formData.adminName, email: formData.adminEmail }
      );
      onComplete();
    } catch (err) {
      console.error(err);
      alert("Bootstrap failed. Check database connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-indigo-900 flex items-center justify-center p-4 z-[100] overflow-y-auto">
      <div className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-700 my-auto">
        <div className="bg-slate-900 p-10 text-white relative">
          <Rocket className="absolute top-0 right-0 p-10 opacity-10" size={200} />
          <div className="relative z-10">
            <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Initialize Foundation</h2>
            <p className="text-slate-400 font-medium">No system records found. You are deploying the primary node of BuildStream Pro.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Project Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2">1. Primary Site Details</h3>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Project Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 text-slate-300" size={18} />
                  <input required className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" 
                         placeholder="Skyline Towers" value={formData.siteName} onChange={e => setFormData({...formData, siteName: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Global Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-slate-300" size={18} />
                  <input required className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" 
                         placeholder="New York, NY" value={formData.siteLocation} onChange={e => setFormData({...formData, siteLocation: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Root Admin Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest border-b border-emerald-50 pb-2">2. Root Admin Account</h3>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-300" size={18} />
                  <input required className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                         placeholder="Chief Architect" value={formData.adminName} onChange={e => setFormData({...formData, adminName: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Login Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-300" size={18} />
                  <input required type="email" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                         placeholder="admin@buildstream.com" value={formData.adminEmail} onChange={e => setFormData({...formData, adminEmail: e.target.value})} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 flex items-center gap-4">
            <ShieldCheck className="text-indigo-600 shrink-0" size={32} />
            <p className="text-xs text-indigo-900 font-medium leading-relaxed">
              <strong>Security Protocol:</strong> Completing this step creates the root <code>SUPER_ADMIN</code>. 
              Subsequent access to this system will strictly require manual invitations by this account.
            </p>
          </div>

          <button 
            disabled={loading}
            type="submit" 
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Rocket size={20} />}
            Deploy System Foundation
          </button>
        </form>
      </div>
    </div>
  );
};

export default BootstrapSystem;