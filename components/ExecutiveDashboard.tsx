
import React from 'react';
import { Site } from '../types';
import { FileText, Download, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

// Define the interface for props to fix type errors in App.tsx
interface ExecutiveDashboardProps {
  sites: Site[];
}

// Updated component to use ExecutiveDashboardProps
const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ sites }) => {
  return (
    <div className="space-y-8">
      {/* Summary Section */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Portfolio Performance Summary</h3>
          <p className="text-slate-500 leading-relaxed">
            Overall portfolio health is <span className="text-emerald-600 font-bold">Good</span>. 
            Two sites are ahead of schedule, while Riverfront Plaza is experiencing minor delays in phase 2. 
            Total budget utilization is at 42% against a plan of 45%.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-100">
              <FileText size={18} /> Generate PDF Report
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-200 transition-colors">
              <Download size={18} /> Export Excel
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 shrink-0">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center w-32">
            <p className="text-2xl font-black text-indigo-600">{sites.length}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Active Sites</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center w-32">
            <p className="text-2xl font-black text-emerald-600">148</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Days Left</p>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sites.map(site => (
          <div key={site.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="h-32 bg-slate-100 relative overflow-hidden">
               <img src={`https://picsum.photos/seed/${site.id}/400/200`} className="w-full h-full object-cover" alt={site.name} />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
               <div className="absolute bottom-4 left-4 text-white">
                 <h4 className="font-bold text-lg">{site.name}</h4>
                 <p className="text-xs opacity-80">{site.location}</p>
               </div>
               <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-slate-800 shadow-sm flex items-center gap-1">
                 {site.progress > 80 ? <CheckCircle size={10} className="text-emerald-500" /> : <TrendingUp size={10} className="text-indigo-500" />}
                 {site.progress > 80 ? 'Near Completion' : 'In Progress'}
               </div>
            </div>

            <div className="p-6 space-y-6 flex-1 flex flex-col">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Project Completion</span>
                  <span className="text-xs font-bold text-indigo-600">{site.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full rounded-full" 
                    style={{ width: `${site.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Budget</p>
                  <p className="text-sm font-bold text-slate-800">${(site.budget / 1000000).toFixed(1)}M</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Actual Spent</p>
                  <p className="text-sm font-bold text-slate-800">${(site.spent / 1000000).toFixed(1)}M</p>
                </div>
              </div>

              <div className="pt-2 mt-auto">
                <button className="w-full py-2.5 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors uppercase tracking-widest">
                  View Detailed Financials
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Add New Project Card */}
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-slate-400 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer group min-h-[300px]">
           <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <AlertCircle size={24} />
           </div>
           <p className="font-bold text-slate-600">Add New Project</p>
           <p className="text-xs text-slate-400 mt-1">Initiate planning & budgeting</p>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
