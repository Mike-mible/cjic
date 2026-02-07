import React from 'react';
import { Clock, ShieldAlert, LogOut, MessageCircle } from 'lucide-react';

interface PendingApprovalProps {
  onLogout: () => void;
}

const PendingApproval: React.FC<PendingApprovalProps> = ({ onLogout }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden p-10 text-center animate-in zoom-in-95 duration-700">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-amber-100 rounded-full scale-110 animate-pulse"></div>
          <div className="relative w-20 h-20 bg-amber-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-amber-200">
            <Clock size={40} className="animate-[spin_10s_linear_infinite]" />
          </div>
        </div>

        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">Security Screening</h2>
        
        <div className="space-y-4 mb-8">
          <p className="text-slate-600 text-sm leading-relaxed">
            Your professional profile has been successfully recorded. Due to high-security protocols for field roles, your account is now <strong>Awaiting Site Admin Approval</strong>.
          </p>
          
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3 text-left">
            <ShieldAlert className="text-amber-600 shrink-0 mt-0.5" size={18} />
            <p className="text-[11px] text-slate-500 font-medium">
              You will gain full access to site logs, safety reports, and team analytics once verified by the project head. This usually takes less than 2 hours during business shifts.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors">
            <MessageCircle size={16} /> Contact Regional Support
          </button>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-3 bg-white text-rose-600 border border-rose-100 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-rose-50 transition-colors"
          >
            <LogOut size={16} /> Exit Station
          </button>
        </div>

        <p className="mt-8 text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">BuildStream Global Security v4.2</p>
      </div>
    </div>
  );
};

export default PendingApproval;