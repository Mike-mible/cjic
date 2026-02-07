import React, { useState } from 'react';
import { SiteLog, LogStatus, Site } from '../types';
import { CheckCircle2, XCircle, MessageSquare, ExternalLink, Calendar, MapPin, HardHat } from 'lucide-react';

interface EngineerDashboardProps {
  logs: SiteLog[];
  sites: Site[];
  onReview: (id: string, status: LogStatus, feedback: string) => void;
}

const EngineerDashboard: React.FC<EngineerDashboardProps> = ({ logs, sites, onReview }) => {
  const [selectedLog, setSelectedLog] = useState<SiteLog | null>(null);
  const [feedback, setFeedback] = useState('');

  const getStatusStyle = (status: LogStatus) => {
    switch (status) {
      case LogStatus.SUBMITTED: return 'bg-amber-100 text-amber-700 border-amber-200';
      case LogStatus.APPROVED: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case LogStatus.REJECTED: return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleReview = (status: LogStatus) => {
    if (selectedLog) {
      onReview(selectedLog.id, status, feedback);
      setSelectedLog(null);
      setFeedback('');
    }
  };

  const submittedLogs = logs.filter(l => l.status === LogStatus.SUBMITTED);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Pending Reviews List */}
      <div className="lg:col-span-1 space-y-4">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider px-1">Review Queue ({submittedLogs.length})</h3>
        <div className="space-y-3">
          {logs.map(log => (
            <div 
              key={log.id} 
              onClick={() => setSelectedLog(log)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedLog?.id === log.id 
                  ? 'bg-white border-indigo-600 shadow-md scale-[1.02]' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">{log.id.slice(0, 8)}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${getStatusStyle(log.status)}`}>
                  {log.status}
                </span>
              </div>
              <h4 className="font-semibold text-slate-800 truncate">{sites.find(s => s.id === log.siteId)?.name}</h4>
              <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Calendar size={12} /> {log.date}</span>
                <span className="flex items-center gap-1"><HardHat size={12} /> {log.foremanName}</span>
              </div>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-center py-8 text-slate-400 border border-dashed border-slate-200 rounded-xl">
              No logs found for review.
            </div>
          )}
        </div>
      </div>

      {/* Detail & Action View */}
      <div className="lg:col-span-2">
        {selectedLog ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{sites.find(s => s.id === selectedLog.siteId)?.name} - {selectedLog.blockName}</h3>
                <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin size={14} /> {sites.find(s => s.id === selectedLog.siteId)?.location}
                </p>
              </div>
              <button className="p-2 text-slate-400 hover:text-indigo-600">
                <ExternalLink size={20} />
              </button>
            </div>

            <div className="p-6 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Work Completed</h5>
                  <p className="text-slate-700 leading-relaxed text-sm bg-slate-50 p-4 rounded-lg italic">
                    "{selectedLog.workCompleted}"
                  </p>
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Material & Resources</h5>
                  <div className="space-y-2">
                    {(selectedLog.materialUsage || []).map((m, i) => (
                      <div key={i} className="flex justify-between text-sm py-1 border-b border-slate-100 last:border-0">
                        <span className="text-slate-600">{m.item}</span>
                        <span className="font-medium text-slate-900">{m.quantity} {m.unit}</span>
                      </div>
                    ))}
                    <div className="pt-2">
                      <span className="text-xs text-slate-400 block mb-1">Equipment Used:</span>
                      {(selectedLog.equipmentUsage || []).map((e, i) => (
                        <span key={i} className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold mr-1 mb-1 uppercase">
                          {e.item} ({e.hours}h)
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Review & Comments</h5>
                <textarea 
                  rows={3}
                  placeholder="Enter your observations or rejection reasons..."
                  className="w-full border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                />
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                disabled={selectedLog.status !== LogStatus.SUBMITTED}
                onClick={() => handleReview(LogStatus.REJECTED)}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 disabled:opacity-50"
              >
                <XCircle size={18} /> Send back
              </button>
              <button 
                disabled={selectedLog.status !== LogStatus.SUBMITTED}
                onClick={() => handleReview(LogStatus.APPROVED)}
                className="flex items-center gap-2 px-8 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 disabled:opacity-50"
              >
                <CheckCircle2 size={18} /> Approve
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-white border border-slate-200 border-dashed rounded-2xl p-12">
            <MessageSquare size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">Select a log from the list to review</p>
            <p className="text-sm">Verify site data before final submission to Project Manager</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EngineerDashboard;