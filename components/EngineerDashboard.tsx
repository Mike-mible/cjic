import React, { useState } from 'react';
import { SiteLog, LogStatus, Site } from '../types';
import { CheckCircle2, XCircle, MessageSquare, ExternalLink, Calendar, MapPin, HardHat, Info, History } from 'lucide-react';

interface EngineerDashboardProps {
  logs: SiteLog[];
  sites: Site[];
  onReview: (id: string, status: LogStatus, feedback: string) => void;
}

const EngineerDashboard: React.FC<EngineerDashboardProps> = ({ logs, sites, onReview }) => {
  const [selectedLog, setSelectedLog] = useState<SiteLog | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getStatusStyle = (status: LogStatus) => {
    switch (status) {
      case LogStatus.SUBMITTED: return 'bg-amber-100 text-amber-700 border-amber-200';
      case LogStatus.APPROVED: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case LogStatus.REJECTED: return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleReview = async (status: LogStatus) => {
    if (selectedLog) {
      setIsSubmitting(true);
      try {
        await onReview(selectedLog.id, status, feedback);
        setSelectedLog(null);
        setFeedback('');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const submittedLogs = logs.filter(l => l.status === LogStatus.SUBMITTED);
  const totalReviewed = logs.filter(l => l.status === LogStatus.APPROVED || l.status === LogStatus.REJECTED).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Sidebar - Review List */}
      <div className="lg:col-span-4 space-y-6">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Incoming Reviews</h3>
           <div className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-indigo-100">
             {submittedLogs.length} New
           </div>
        </div>

        <div className="space-y-4">
          {logs.map(log => (
            <div 
              key={log.id} 
              onClick={() => setSelectedLog(log)}
              className={`p-6 rounded-[2rem] border transition-all cursor-pointer ${
                selectedLog?.id === log.id 
                  ? 'bg-white border-indigo-600 shadow-xl scale-[1.02]' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${log.status === LogStatus.SUBMITTED ? 'bg-amber-500 animate-pulse' : 'bg-slate-300'}`}></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: {log.id.slice(0, 8)}</span>
                </div>
                <span className={`text-[9px] px-2 py-1 rounded-lg border font-black uppercase tracking-widest ${getStatusStyle(log.status)}`}>
                  {log.status}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 mb-1">{sites.find(s => s.id === log.siteId)?.name}</h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5 mb-4">
                <MapPin size={10} /> {log.blockName || 'Main Sector'}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                 <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                   <HardHat size={14} className="text-indigo-400" /> {log.foremanName}
                 </div>
                 <div className="text-[10px] font-black text-slate-400 uppercase">
                   {log.date}
                 </div>
              </div>
            </div>
          ))}
          
          <div className="bg-slate-900 rounded-[2rem] p-6 text-white text-center">
             <div className="flex justify-center mb-3">
               <History size={24} className="text-indigo-400 opacity-50" />
             </div>
             <p className="text-xl font-black">{totalReviewed}</p>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Logs Validated Today</p>
          </div>
        </div>
      </div>

      {/* Main Panel - Review & Analytics */}
      <div className="lg:col-span-8">
        {selectedLog ? (
          <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-slate-900 p-10 text-white flex justify-between items-center">
               <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Technical Review</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-slate-400 text-sm font-bold">
                       <MapPin size={16} /> {sites.find(s => s.id === selectedLog.siteId)?.name}
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-sm font-bold">
                       <Calendar size={16} /> {selectedLog.date}
                    </div>
                  </div>
               </div>
               <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                 <CheckCircle2 size={32} className="text-indigo-400" />
               </div>
            </div>

            <div className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-6">
                    <div>
                      <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Site Progress Note</h5>
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 italic text-slate-700 leading-relaxed font-medium">
                        "{selectedLog.workCompleted}"
                      </div>
                    </div>
                    
                    <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6">
                       <div className="flex items-center gap-2 mb-3">
                          <Info size={18} className="text-rose-600" />
                          <h5 className="text-[10px] font-black text-rose-900 uppercase tracking-widest">Incidents Recorded</h5>
                       </div>
                       <p className="text-sm font-bold text-rose-800">{selectedLog.incidents || "No field incidents reported."}</p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Resource Verification</h5>
                    <div className="space-y-2">
                       {selectedLog.materialUsage.map((m, i) => (
                         <div key={i} className="flex justify-between items-center bg-white p-4 border border-slate-100 rounded-2xl">
                           <span className="text-sm font-bold text-slate-700">{m.item}</span>
                           <span className="text-sm font-black text-indigo-600">{m.quantity} {m.unit}</span>
                         </div>
                       ))}
                    </div>
                    
                    <div className="pt-4 border-t border-slate-50">
                       <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Equipment Hours</h6>
                       <div className="flex flex-wrap gap-2">
                          {selectedLog.equipmentUsage.map((e, i) => (
                            <div key={i} className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-2">
                               {e.item} <span className="bg-indigo-600 px-1.5 rounded-full">{e.hours}h</span>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

              <div>
                <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Engineer's Verdict & Feedback</h5>
                <textarea 
                  rows={4}
                  placeholder="Provide technical feedback or reasoning for rejection..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] p-6 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                />
              </div>
            </div>

            <div className="p-10 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row justify-end gap-4">
              <button 
                disabled={selectedLog.status !== LogStatus.SUBMITTED || isSubmitting}
                onClick={() => handleReview(LogStatus.REJECTED)}
                className="flex items-center justify-center gap-2 px-8 py-4 text-xs font-black uppercase tracking-widest text-rose-600 bg-white border border-rose-100 rounded-2xl hover:bg-rose-50 transition-all disabled:opacity-30"
              >
                <XCircle size={18} /> Request Correction
              </button>
              <button 
                disabled={selectedLog.status !== LogStatus.SUBMITTED || isSubmitting}
                onClick={() => handleReview(LogStatus.APPROVED)}
                className="flex items-center justify-center gap-2 px-12 py-4 text-xs font-black uppercase tracking-widest text-white bg-indigo-600 rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all disabled:opacity-30"
              >
                <CheckCircle2 size={18} /> Approve Submission
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-slate-400 bg-white border border-slate-200 border-dashed rounded-[3rem] p-12 text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <MessageSquare size={48} className="opacity-10" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Technical Review Station</h4>
            <p className="text-sm font-medium max-w-xs mx-auto">Select a site log from the review queue to begin technical verification and resource audit.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EngineerDashboard;