import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { MATERIAL_STATS, PROGRESS_DATA } from '../constants';
import { generateSiteInsight } from '../services/geminiService';
import { TrendingUp, AlertTriangle, Users, Sparkles, Download, Filter, Target, Activity } from 'lucide-react';
import { SiteLog, Site } from '../types';

interface PMAnalyticsProps {
  logs: SiteLog[];
  sites: Site[];
}

const PMAnalytics: React.FC<PMAnalyticsProps> = ({ logs, sites }) => {
  const [aiInsight, setAiInsight] = useState<string>('Synthesizing site data...');
  const [isLoadingInsight, setIsLoadingInsight] = useState(true);

  useEffect(() => {
    const fetchInsight = async () => {
      if (logs.length === 0) {
        setAiInsight("No site data for analysis.");
        setIsLoadingInsight(false);
        return;
      }
      setIsLoadingInsight(true);
      const insight = await generateSiteInsight(logs);
      setAiInsight(insight || "Analysis currently unavailable.");
      setIsLoadingInsight(false);
    };
    fetchInsight();
  }, [logs]);

  const totalWorkers = logs.reduce((acc, l) => acc + (l.workersCount || 0), 0);
  const pendingLogs = logs.filter(l => l.status === 'SUBMITTED').length;

  return (
    <div className="space-y-8">
      {/* Portfolio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Portfolio Analytics</h1>
          <p className="text-sm text-slate-500 font-medium italic">Strategic overview of all active project sites</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
             <Download size={14} /> Export Dataset
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
             <Filter size={14} /> Advanced Filter
           </button>
        </div>
      </div>

      {/* Primary KPI Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Avg Progress', value: '54.2%', color: 'text-indigo-600', icon: Target, trend: '+1.2%', trendUp: true },
          { label: 'Workforce', value: totalWorkers.toString(), color: 'text-emerald-600', icon: Users, trend: '+12', trendUp: true },
          { label: 'Review Queue', value: pendingLogs.toString(), color: 'text-rose-600', icon: Activity, trend: 'Action Reqd', trendUp: false },
          { label: 'Cost Variance', value: '-$24K', color: 'text-amber-600', icon: TrendingUp, trend: 'Under Plan', trendUp: true },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative group hover:border-indigo-200 transition-all">
            <div className={`p-3 rounded-2xl bg-slate-50 ${kpi.color} w-fit mb-4 group-hover:bg-indigo-50 transition-colors`}>
              <kpi.icon size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{kpi.label}</p>
            <h4 className="text-3xl font-black text-slate-900 mt-1">{kpi.value}</h4>
            <div className={`mt-4 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg w-fit ${kpi.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              {kpi.trend}
            </div>
          </div>
        ))}
      </div>

      {/* AI Intelligence Block */}
      <div className="bg-indigo-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Sparkles size={240} />
        </div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
           <div className="lg:col-span-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-400/20 backdrop-blur-md p-2 rounded-xl border border-indigo-400/30">
                  <Sparkles size={20} className="text-indigo-200" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight">Gemini Strategy Engine</h3>
              </div>
              <p className="text-indigo-100 text-lg font-medium leading-relaxed italic">
                {isLoadingInsight ? (
                  <span className="animate-pulse">Analyzing labor distribution and logistical bottlenecks...</span>
                ) : `"${aiInsight}"`}
              </p>
           </div>
           <div className="lg:col-span-4 flex justify-end">
              <button className="px-8 py-4 bg-white text-indigo-900 font-black text-sm uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl active:scale-95">
                Deep Audit Report
              </button>
           </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2">
            <Activity size={18} className="text-indigo-600" />
            Temporal Project Health
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PROGRESS_DATA}>
                <defs>
                  <linearGradient id="colorProg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} unit="%" />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="progress" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorProg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
           <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2">
            <Target size={18} className="text-emerald-600" />
            Critical Resource Deviation
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MATERIAL_STATS} layout="vertical" barSize={12}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} width={80} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="allocated" fill="#f1f5f9" radius={[0, 4, 4, 0]} />
                <Bar dataKey="consumed" fill="#4f46e5" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest mt-4">Cement and Steel currently trending above projection (+4.2%)</p>
        </div>
      </div>
    </div>
  );
};

export default PMAnalytics;