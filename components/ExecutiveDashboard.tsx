import React from 'react';
import { Site } from '../types';
import { FileText, Download, TrendingUp, AlertCircle, CheckCircle, Wallet, Target, Activity } from 'lucide-react';

interface ExecutiveDashboardProps {
  sites: Site[];
}

const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ sites }) => {
  const totalBudget = sites.reduce((acc, s) => acc + s.budget, 0);
  const totalSpent = sites.reduce((acc, s) => acc + s.spent, 0);
  const avgProgress = sites.reduce((acc, s) => acc + s.progress, 0) / sites.length;

  return (
    <div className="space-y-8">
      {/* Portfolio Strategic Summary */}
      <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1">
            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">Portfolio ROI Analysis</h3>
            <p className="text-slate-500 text-lg leading-relaxed font-medium italic">
              "Total portfolio health is currently <span className="text-emerald-600 font-bold">Stable</span>. Financial absorption is tracking 3% below target, indicating healthy capital preservation while maintaining schedule fidelity."
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black transition-all">
                <FileText size={16} /> Portfolio Audit PDF
              </button>
              <button className="flex items-center gap-2 px-8 py-3 bg-white text-slate-900 border border-slate-200 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                <Download size={16} /> Financial Raw Data
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full lg:w-auto">
            {[
              { label: 'Utilized Capital', value: `$${(totalSpent / 1000000).toFixed(1)}M`, icon: Wallet, color: 'text-indigo-600' },
              { label: 'Completion Target', value: `${avgProgress.toFixed(0)}%`, icon: Target, color: 'text-emerald-600' },
              { label: 'Risk Exposure', value: 'Low', icon: Activity, color: 'text-amber-600' },
            ].map((stat, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 text-center min-w-[160px]">
                <div className={`mx-auto mb-3 p-2 bg-white rounded-xl w-fit shadow-sm ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <p className="text-2xl font-black text-slate-900 mb-0.5">{stat.value}</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cross-Project Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sites.map(site => (
          <div key={site.id} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:border-indigo-600 transition-all">
            <div className="h-40 relative overflow-hidden">
               <img src={`https://picsum.photos/seed/${site.id}/600/400`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={site.name} />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
               <div className="absolute bottom-6 left-6 text-white">
                 <h4 className="font-black text-xl uppercase tracking-tight leading-none mb-1">{site.name}</h4>
                 <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">{site.location}</p>
               </div>
               <div className="absolute top-6 right-6">
                 {site.progress > 80 ? (
                   <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">Final Phase</div>
                 ) : (
                   <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">Execution</div>
                 )}
               </div>
            </div>

            <div className="p-8 space-y-8 flex-1 flex flex-col">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Progress</span>
                  <span className="text-xs font-black text-indigo-600">{site.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full transition-all duration-1000" style={{ width: `${site.progress}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 py-6 border-y border-slate-50">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total CapEx</p>
                  <p className="text-lg font-black text-slate-900">${(site.budget / 1000000).toFixed(1)}M</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Actual OpEx</p>
                  <p className="text-lg font-black text-slate-900">${(site.spent / 1000000).toFixed(1)}M</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 w-fit">
                 <CheckCircle size={14} />
                 <span className="text-[10px] font-black uppercase tracking-tight">On Budget</span>
              </div>

              <div className="pt-4 mt-auto">
                <button className="w-full py-3 text-[10px] font-black text-slate-500 border border-slate-200 rounded-2xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all uppercase tracking-[0.2em]">
                  Financial Deep-Dive
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* New Investment Card */}
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-10 text-center hover:bg-white hover:border-indigo-300 transition-all cursor-pointer group">
           <div className="w-16 h-16 rounded-3xl bg-white border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 shadow-sm transition-transform">
             <AlertCircle size={32} className="text-slate-300 group-hover:text-indigo-600" />
           </div>
           <h4 className="font-black text-slate-600 uppercase tracking-tight text-lg mb-1">Pipeline Project</h4>
           <p className="text-xs text-slate-400 font-medium max-w-[180px] mx-auto">Initialize planning, architectural review, and budget allocation.</p>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;