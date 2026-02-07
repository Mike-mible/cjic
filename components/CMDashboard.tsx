import React from 'react';
import { SiteLog, Site } from '../types';
import { HardHat, Activity, Users, Box, AlertTriangle, ChevronRight, Map, Zap } from 'lucide-react';

interface CMDashboardProps {
  logs: SiteLog[];
  sites: Site[];
}

const CMDashboard: React.FC<CMDashboardProps> = ({ logs, sites }) => {
  const totalLabor = logs.reduce((acc, l) => acc + (l.workersCount || 0), 0);
  const criticalIncidents = logs.filter(l => l.incidents && l.incidents.length > 0).length;

  return (
    <div className="space-y-8">
      {/* Site Command Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
           <Zap className="absolute top-0 right-0 p-12 text-indigo-500 opacity-20" size={240} />
           <div className="relative z-10">
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Operations Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Labor Force</p>
                  <p className="text-3xl font-black">{totalLabor}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Active Blocks</p>
                  <p className="text-3xl font-black">14</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Incident Rate</p>
                  <p className={`text-3xl font-black ${criticalIncidents > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {((criticalIncidents / logs.length) * 100 || 0).toFixed(1)}%
                  </p>
                </div>
              </div>
           </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-rose-50 rounded-xl text-rose-600">
               <AlertTriangle size={20} />
             </div>
             <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Urgent Bottlenecks</h4>
          </div>
          <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed">
            Cement supply at <span className="text-slate-900 font-bold">Skyline Towers</span> is critical. Projected to deplete in 48 hours.
          </p>
          <button className="w-full py-3 bg-slate-100 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors">
            Resolve Logistics
          </button>
        </div>
      </div>

      {/* Site Heatmap Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sites.map(site => (
          <div key={site.id} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:border-indigo-200 transition-all p-8 group">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="font-black text-slate-900 uppercase tracking-tight text-lg leading-none mb-1">{site.name}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{site.location}</p>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                <Map size={20} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold">
                 <span className="text-slate-500 uppercase">Current Load</span>
                 <span className="text-slate-900">78 Workers</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[78%]" />
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
                 <div className="flex items-center gap-2">
                   <Users size={14} className="text-slate-300" />
                   <span className="text-[10px] font-black text-slate-500 uppercase">12 Teams</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <Box size={14} className="text-slate-300" />
                   <span className="text-[10px] font-black text-slate-500 uppercase">92% Supply</span>
                 </div>
              </div>
            </div>

            <button className="w-full mt-6 flex items-center justify-between px-4 py-3 bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white rounded-xl transition-all">
              <span className="text-[10px] font-black uppercase tracking-widest">Site Drilldown</span>
              <ChevronRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CMDashboard;