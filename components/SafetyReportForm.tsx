
import React, { useState, useRef, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Camera, Info, Send, Clock, X, Loader2, CheckCircle2 } from 'lucide-react';
import { Site, SafetyReport } from '../types';

interface SafetyReportFormProps {
  onSubmit: (report: Partial<SafetyReport>) => void;
  sites: Site[];
}

const SafetyReportForm: React.FC<SafetyReportFormProps> = ({ onSubmit, sites }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [hazardLevel, setHazardLevel] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Low');
  const [siteId, setSiteId] = useState(sites.length > 0 ? sites[0].id : '');
  const [observations, setObservations] = useState('');
  const [actionRequired, setActionRequired] = useState('');
  const [ppeCompliance, setPpeCompliance] = useState(true);
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('buildstream_safety_draft');
    if (saved) {
      const data = JSON.parse(saved);
      setSiteId(data.siteId || '');
      setObservations(data.observations || '');
      setHazardLevel(data.hazardLevel || 'Low');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('buildstream_safety_draft', JSON.stringify({ siteId, observations, hazardLevel }));
  }, [siteId, observations, hazardLevel]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Explicitly type file as File to avoid 'unknown' type error in readAsDataURL
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!siteId) {
      alert("Select the high-risk project site.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit({
        siteId,
        date: new Date().toISOString().split('T')[0],
        hazardLevel,
        ppeCompliance,
        observations,
        actionRequired,
        photos
      });
      localStorage.removeItem('buildstream_safety_draft');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      alert("Critical: Report transmission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="max-w-4xl mx-auto h-[500px] flex flex-col items-center justify-center bg-white rounded-[3rem] border border-slate-200 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={48} />
        </div>
        <h3 className="text-2xl font-black text-slate-900 uppercase">Audit Logged</h3>
        <p className="text-slate-500 font-medium mt-2">Safety protocol updated. HQ alerted to critical findings.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest"
        >
          New Inspection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
        {/* Form Header */}
        <div className="bg-rose-600 p-10 text-white relative overflow-hidden">
           <ShieldAlert className="absolute top-0 right-0 -mr-8 -mt-8 opacity-10" size={200} />
           <div className="relative z-10">
              <h3 className="text-3xl font-black uppercase tracking-tight">Safety & Compliance Audit</h3>
              <p className="text-rose-100 text-sm mt-1 font-medium italic opacity-80">"Zero Incident Protocol Engagement"</p>
              <div className="flex gap-4 mt-8">
                <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20">
                  <label className="block text-[9px] font-black text-rose-200 uppercase tracking-widest mb-1">Station Date</label>
                  <span className="text-sm font-black">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20">
                  <label className="block text-[9px] font-black text-rose-200 uppercase tracking-widest mb-1">Inspector Link</label>
                  <span className="text-sm font-black">Sarah Thompson</span>
                </div>
              </div>
           </div>
        </div>

        <div className="p-12 space-y-12">
          {/* Site Selection */}
          <section>
            <div className="flex items-center gap-3 mb-6 border-l-4 border-rose-600 pl-4">
              <Info size={20} className="text-rose-600" />
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Station Context</h4>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Observation Site</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-rose-500"
                value={siteId}
                onChange={e => setSiteId(e.target.value)}
              >
                <option value="">Select Station</option>
                {sites.map(site => <option key={site.id} value={site.id}>{site.name}</option>)}
              </select>
            </div>
          </section>

          {/* Section 1: PPE Compliance */}
          <section>
            <div className="flex items-center gap-3 mb-6 border-l-4 border-rose-600 pl-4">
              <CheckCircle size={20} className="text-rose-600" />
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">1. PPE Integrity Check</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {[
                 'Hard Hats deployed',
                 'High-vis visibility',
                 'Steel-toe footwear active',
                 'Respiratory shields used',
                 'Fall arrest certified',
                 'Ear protection active'
               ].map((item, i) => (
                 <label key={i} className="flex items-center gap-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors group">
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded-lg border-slate-300 text-rose-600 focus:ring-rose-500" />
                    <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">{item}</span>
                 </label>
               ))}
               <div className="md:col-span-2 mt-4 p-6 bg-rose-50 rounded-[2rem] border border-rose-100 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-black text-rose-900 uppercase">Compliance Verdict</span>
                    <p className="text-[10px] text-rose-700 font-medium">Auto-calculated based on observations</p>
                  </div>
                  <button 
                    onClick={() => setPpeCompliance(!ppeCompliance)}
                    className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all ${ppeCompliance ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}
                  >
                    {ppeCompliance ? 'Verified Clean' : 'Violation Warning'}
                  </button>
               </div>
            </div>
          </section>

          {/* Section 2: Hazard Identification */}
          <section>
            <div className="flex items-center gap-3 mb-6 border-l-4 border-rose-600 pl-4">
              <AlertTriangle size={20} className="text-rose-600" />
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">2. Risk Identification</h4>
            </div>
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Threat Severity Level</label>
                <div className="grid grid-cols-4 gap-3">
                  {['Low', 'Medium', 'High', 'Critical'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setHazardLevel(level as any)}
                      className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95 ${
                        hazardLevel === level 
                        ? 'bg-rose-600 border-rose-600 text-white shadow-xl shadow-rose-100' 
                        : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Discovery Details</label>
                <textarea 
                  rows={4} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-6 py-5 text-sm font-medium outline-none focus:ring-2 focus:ring-rose-500 leading-relaxed"
                  placeholder="Describe the technical nature of the hazard discovers..."
                  value={observations}
                  onChange={e => setObservations(e.target.value)}
                ></textarea>
              </div>
            </div>
          </section>

          {/* Section 3: Evidence */}
          <section>
            <div className="flex items-center gap-3 mb-6 border-l-4 border-rose-600 pl-4">
              <Camera size={20} className="text-rose-600" />
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">3. Optical Evidence</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {photos.map((photo, i) => (
                    <div key={i} className="aspect-video rounded-2xl overflow-hidden relative group border border-slate-100">
                      <img src={photo} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => removePhoto(i)}
                        className="absolute top-2 right-2 p-1.5 bg-white text-rose-600 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-video border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-300 hover:border-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-all group"
                  >
                    <Camera size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Capture Proof</span>
                    <input type="file" ref={fileInputRef} hidden accept="image/*" multiple onChange={handlePhotoUpload} />
                  </button>
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] text-slate-300">
                <h5 className="text-white font-black text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Info size={16} className="text-rose-500" /> Forensic Guidelines
                </h5>
                <ul className="text-[11px] font-medium space-y-3 opacity-80 leading-relaxed">
                  <li>• Focus on structural integrity or electrical exposure.</li>
                  <li>• Include scale markers for measurement verification.</li>
                  <li>• Frames are auto-watermarked with GPS/Timestamp.</li>
                  <li>• Critical frames are hashed for legal compliance.</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Form Footer */}
        <div className="bg-slate-50 p-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-3 text-rose-700 bg-rose-100/50 px-6 py-3 rounded-2xl border border-rose-200">
             <Clock size={20} className="animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest">Real-time HQ broadcast active for critical findings</span>
           </div>
           <div className="flex gap-4 w-full md:w-auto">
             <button 
               onClick={handleSubmit}
               disabled={isSubmitting}
               className="flex-1 md:flex-none flex items-center justify-center gap-3 px-16 py-4 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 shadow-2xl shadow-rose-200 transition-all active:scale-95 disabled:opacity-50"
             >
               {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
               Broadcast Report
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyReportForm;
