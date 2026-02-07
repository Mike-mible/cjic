import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Camera, Info, Send, Clock } from 'lucide-react';
import { Site, SafetyReport } from '../types';

interface SafetyReportFormProps {
  onSubmit: (report: Partial<SafetyReport>) => void;
  sites: Site[];
}

const SafetyReportForm: React.FC<SafetyReportFormProps> = ({ onSubmit, sites }) => {
  const [hazardLevel, setHazardLevel] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Low');
  const [siteId, setSiteId] = useState(sites.length > 0 ? sites[0].id : '');
  const [observations, setObservations] = useState('');
  const [actionRequired, setActionRequired] = useState('');
  const [ppeCompliance, setPpeCompliance] = useState(true);

  const handleSubmit = () => {
    if (!siteId) {
      alert("Please select a project site.");
      return;
    }
    onSubmit({
      siteId,
      date: new Date().toISOString().split('T')[0],
      hazardLevel,
      ppeCompliance,
      observations,
      actionRequired,
      photos: []
    });
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-8">
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        {/* Form Header */}
        <div className="bg-rose-600 p-8 text-white relative overflow-hidden">
           <ShieldAlert className="absolute top-0 right-0 -mr-8 -mt-8 opacity-10" size={160} />
           <div className="relative z-10">
              <h3 className="text-2xl font-black uppercase tracking-tight">Safety & Compliance Audit</h3>
              <p className="text-rose-100 text-sm mt-1 font-medium italic opacity-80">"Safety is a choice you make today."</p>
              <div className="flex gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                  <label className="block text-[9px] font-bold text-rose-200 uppercase tracking-widest">Inspection Date</label>
                  <span className="text-sm font-black">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                  <label className="block text-[9px] font-bold text-rose-200 uppercase tracking-widest">Site Inspector</label>
                  <span className="text-sm font-black">Sarah Thompson</span>
                </div>
              </div>
           </div>
        </div>

        <div className="p-10 space-y-10">
          {/* Site Selection */}
          <section>
            <div className="flex items-center gap-3 mb-6 border-l-4 border-rose-600 pl-4">
              <Info size={20} className="text-rose-600" />
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Project Context</h4>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Selected Site</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500"
                value={siteId}
                onChange={e => setSiteId(e.target.value)}
              >
                <option value="">Select a Site</option>
                {sites.map(site => <option key={site.id} value={site.id}>{site.name}</option>)}
              </select>
            </div>
          </section>

          {/* Section 1: PPE Compliance */}
          <section>
            <div className="flex items-center gap-3 mb-6 border-l-4 border-rose-600 pl-4">
              <CheckCircle size={20} className="text-rose-600" />
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">1. PPE Compliance Check</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {[
                 'Hard Hats worn correctly',
                 'High-vis Vests visible',
                 'Steel-toe boots active',
                 'Eye protection used where required',
                 'Fall arrest systems inspected',
                 'Ear protection deployed in noise zones'
               ].map((item, i) => (
                 <label key={i} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500" />
                    <span className="text-sm font-bold text-slate-700">{item}</span>
                 </label>
               ))}
               <div className="md:col-span-2 mt-4 p-4 bg-rose-50 rounded-xl border border-rose-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-rose-900">Overall Team Compliance</span>
                  <button 
                    onClick={() => setPpeCompliance(!ppeCompliance)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase ${ppeCompliance ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}
                  >
                    {ppeCompliance ? 'Full Pass' : 'Violation Detected'}
                  </button>
               </div>
            </div>
          </section>

          {/* Section 2: Hazard Identification */}
          <section>
            <div className="flex items-center gap-3 mb-6 border-l-4 border-rose-600 pl-4">
              <AlertTriangle size={20} className="text-rose-600" />
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">2. Hazard Identification</h4>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Hazard Severity Level</label>
                <div className="grid grid-cols-4 gap-3">
                  {['Low', 'Medium', 'High', 'Critical'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setHazardLevel(level as any)}
                      className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        hazardLevel === level 
                        ? 'bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-200' 
                        : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Observation Details</label>
                <textarea 
                  rows={4} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Detail the safety hazard found, including precise location..."
                  value={observations}
                  onChange={e => setObservations(e.target.value)}
                ></textarea>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Recommended Corrective Action</label>
                <textarea 
                  rows={3} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="What must be done immediately to mitigate the risk?"
                  value={actionRequired}
                  onChange={e => setActionRequired(e.target.value)}
                ></textarea>
              </div>
            </div>
          </section>

          {/* Section 3: Evidence */}
          <section>
            <div className="flex items-center gap-3 mb-6 border-l-4 border-rose-600 pl-4">
              <Camera size={20} className="text-rose-600" />
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">3. Photographic Evidence</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="aspect-video border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-300 hover:border-rose-300 hover:text-rose-400 cursor-pointer transition-all">
                <Camera size={40} className="mb-2" />
                <span className="text-[10px] font-black uppercase tracking-widest">Upload Hazard Frame</span>
              </div>
              <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl">
                <h5 className="text-rose-900 font-bold text-sm mb-2 flex items-center gap-2">
                  <Info size={16} /> Guidelines
                </h5>
                <ul className="text-[11px] text-rose-800 space-y-2 opacity-80">
                  <li>• Ensure the hazard is clearly visible in the frame.</li>
                  <li>• Include a reference object for scale if necessary.</li>
                  <li>• Capture surroundings to help location identification.</li>
                  <li>• All photos are auto-stamped with GPS coordinates.</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Form Footer */}
        <div className="bg-slate-50 p-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-3 text-rose-700 bg-rose-50 px-4 py-2.5 rounded-2xl border border-rose-100">
             <Clock size={18} className="animate-pulse" />
             <span className="text-xs font-bold uppercase tracking-tight">Critical hazards trigger immediate SMS alerts to PM.</span>
           </div>
           <div className="flex gap-4 w-full md:w-auto">
             <button className="flex-1 md:flex-none px-8 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">
               Save Draft
             </button>
             <button 
               onClick={handleSubmit}
               className="flex-1 md:flex-none flex items-center justify-center gap-2 px-12 py-3 bg-rose-600 text-white rounded-2xl font-black text-sm hover:bg-rose-700 shadow-xl shadow-rose-200 transition-all"
             >
               <Send size={18} />
               Submit Report
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyReportForm;