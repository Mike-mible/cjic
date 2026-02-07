import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { MATERIAL_STATS, PROGRESS_DATA } from '../constants';
import { generateSiteInsight } from '../services/geminiService';
import { TrendingUp, AlertTriangle, Users, Sparkles, Download, Filter } from 'lucide-react';
import { SiteLog, Site } from '../types';

interface PMAnalyticsProps {
  logs: SiteLog[];
  sites: Site[];
}

const PMAnalytics: React.FC<PMAnalyticsProps> = ({ logs, sites }) => {
  const [aiInsight, setAiInsight] = useState<string>('Analyzing latest reports...');
  const [isLoadingInsight, setIsLoadingInsight] = useState(true);

  useEffect(() => {
    const fetchInsight = async () => {
      if (logs.length === 0) {
        setAiInsight("No site logs available for analysis.");
        setIsLoadingInsight(false);
        return;
      }
      setIsLoadingInsight(true);
      const insight = await generateSiteInsight(logs);
      setAiInsight(insight || "Insight generation failed.");
      setIsLoadingInsight(false);
    };
    fetchInsight();
  }, [logs]);

  const totalWorkers = logs.reduce((acc, l) => acc + (l.workersCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Portfolio Progress', value: '54.2%', change: '+1.5%', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Active Personnel', value: totalWorkers.toString(), change: '+12', icon: Users, color: 'text-sky-600', bg: 'bg-sky-50' },
          { label: 'Pending Reviews', value: logs.filter(l => l.status === 'SUBMITTED').length.toString(), change: 'Urgent', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'Active Sites', value: sites.length.toString(), change: 'Stable', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{kpi.label}</p>
                <h4 className="text-2xl font-bold text-slate-900 mt-1">{kpi.value}</h4>
              </div>
              <div className={`p-2 rounded-xl ${kpi.bg} ${kpi.color}`}>
                <kpi.icon size={20} />
              </div>
            </div>
            <p className="text-xs mt-3 flex items-center gap-1">
              <span className={kpi.change.startsWith('+') ? 'text-emerald-600 font-bold' : kpi.change === 'Urgent' ? 'text-rose-600 font-bold' : 'text-slate-400'}>
                {kpi.change}
              </span>
              <span className="text-slate-400 font-medium">vs last month</span>
            </p>
          </div>
        ))}
      </div>

      {/* AI Insight Section */}
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles size={120} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0">
            <Sparkles size={32} className="text-indigo-200" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
              Gemini AI Project Insight
              <span className="text-[10px] bg-indigo-500/50 px-2 py-0.5 rounded uppercase tracking-widest border border-indigo-400/50">Pro AI</span>
            </h3>
            <p className="text-indigo-100 text-sm leading-relaxed max-w-3xl">
              {isLoadingInsight ? (
                <span className="animate-pulse">Synthesizing site reports and cross-referencing with schedules...</span>
              ) : aiInsight}
            </p>
          </div>
          <button className="px-4 py-2 bg-white text-indigo-900 rounded-lg text-sm font-bold shadow-lg hover:bg-indigo-50 transition-colors shrink-0">
            View Analysis
          </button>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Cumulative Progress Trends</h3>
            <div className="flex gap-2">
              <button className="p-1.5 text-slate-400 hover:text-slate-600"><Filter size={18} /></button>
              <button className="p-1.5 text-slate-400 hover:text-slate-600"><Download size={18} /></button>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PROGRESS_DATA}>
                <defs>
                  <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} unit="%" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="progress" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorProgress)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Material Allocation vs Usage</h3>
            <div className="text-xs font-medium text-slate-400 flex items-center gap-4">
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-slate-200 rounded-sm"></div> Allocated</span>
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-indigo-600 rounded-sm"></div> Consumed</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MATERIAL_STATS} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} width={70} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="allocated" fill="#f1f5f9" radius={[0, 4, 4, 0]} />
                <Bar dataKey="consumed" fill="#4f46e5" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PMAnalytics;