
import React, { useState, useRef, useEffect } from 'react';
import { Site, SiteLog, LogStatus } from '../types';
import { Plus, Trash2, Save, Send, Camera, X, CheckCircle2, Loader2 } from 'lucide-react';

interface SiteLogFormProps {
  onSubmit: (log: Partial<SiteLog>) => void;
  sites: Site[];
}

const SiteLogForm: React.FC<SiteLogFormProps> = ({ onSubmit, sites }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState<Partial<SiteLog>>({
    siteId: sites.length > 0 ? sites[0].id : '',
    date: new Date().toISOString().split('T')[0],
    shift: 'Day',
    blockName: '',
    workersCount: 0,
    workCompleted: '',
    materialUsage: [{ item: '', quantity: '', unit: 'units' }],
    equipmentUsage: [{ item: '', hours: 0 }],
    incidents: '',
    photos: [],
    foremanName: 'Michael Chen' 
  });

  // LocalStorage persistence for data safety
  useEffect(() => {
    const saved = localStorage.getItem('buildstream_log_draft');
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to recover draft");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('buildstream_log_draft', JSON.stringify(formData));
  }, [formData]);

  const handleAddField = (key: 'materialUsage' | 'equipmentUsage') => {
    if (key === 'materialUsage') {
      setFormData({ ...formData, materialUsage: [...(formData.materialUsage || []), { item: '', quantity: '', unit: 'units' }] });
    } else {
      setFormData({ ...formData, equipmentUsage: [...(formData.equipmentUsage || []), { item: '', hours: 0 }] });
    }
  };

  const handleRemoveField = (key: 'materialUsage' | 'equipmentUsage', index: number) => {
    const list = [...(formData[key] as any)];
    list.splice(index, 1);
    setFormData({ ...formData, [key]: list });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Explicitly type file as File to avoid 'unknown' type error in readAsDataURL
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          photos: [...(prev.photos || []), reader.result as string]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: (prev.photos || []).filter((_, i) => i !== index)
    }));
  };

  const handleAction = async (status: LogStatus) => {
    if (!formData.siteId) {
      alert("Please select a project site station.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit({ ...formData, status });
      if (status === LogStatus.SUBMITTED) {
        localStorage.removeItem('buildstream_log_draft');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        alert("Draft saved to station cloud.");
      }
    } catch (err) {
      alert("Transmission failed. Retrying...");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="max-w-4xl mx-auto h-[500px] flex flex-col items-center justify-center bg-white rounded-[3rem] border border-slate-200 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={48} />
        </div>
        <h3 className="text-2xl font-black text-slate-900 uppercase">Log Transmitted</h3>
        <p className="text-slate-500 font-medium mt-2">Submission is now in Engineering Review queue.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest"
        >
          Draft New Entry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
        <div className="bg-slate-900 px-8 py-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-black text-white uppercase tracking-tight text-lg">Daily Field Report</h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Station Protocol v2.4</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] text-indigo-400 uppercase font-black tracking-widest">Active Drafting</span>
          </div>
        </div>
        
        <div className="p-10 space-y-10">
          {/* General Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Project Site</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.siteId}
                onChange={e => setFormData({ ...formData, siteId: e.target.value })}
              >
                <option value="">Select Station</option>
                {sites.map(site => <option key={site.id} value={site.id}>{site.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Block / Section</label>
              <input 
                type="text" 
                placeholder="e.g. Sector 7G"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.blockName || ''}
                onChange={e => setFormData({ ...formData, blockName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Deployment Shift</label>
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                {['Day', 'Night'].map(s => (
                  <button 
                    key={s}
                    type="button"
                    onClick={() => setFormData({ ...formData, shift: s as any })}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                      formData.shift === s ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Workforce and Progress */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Personnel Count</label>
              <input 
                type="number" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.workersCount || 0}
                onChange={e => setFormData({ ...formData, workersCount: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Execution Summary</label>
              <textarea 
                rows={3}
                placeholder="Detail the technical milestones achieved during this shift..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                value={formData.workCompleted || ''}
                onChange={e => setFormData({ ...formData, workCompleted: e.target.value })}
              />
            </div>
          </div>

          {/* Materials & Equipment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Material Consumption</label>
                <button 
                  type="button"
                  onClick={() => handleAddField('materialUsage')}
                  className="flex items-center gap-1 text-[9px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors"
                >
                  <Plus size={12} /> Add Entry
                </button>
              </div>
              <div className="space-y-3">
                {formData.materialUsage?.map((m, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input 
                      placeholder="Item" 
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                      value={m.item}
                      onChange={e => {
                        const list = [...(formData.materialUsage || [])];
                        list[idx].item = e.target.value;
                        setFormData({...formData, materialUsage: list});
                      }}
                    />
                    <input 
                      placeholder="Qty" 
                      className="w-16 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-center outline-none"
                      value={m.quantity}
                      onChange={e => {
                        const list = [...(formData.materialUsage || [])];
                        list[idx].quantity = e.target.value;
                        setFormData({...formData, materialUsage: list});
                      }}
                    />
                    <button 
                      type="button"
                      onClick={() => handleRemoveField('materialUsage', idx)}
                      className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Equipment Deployment</label>
                <button 
                  type="button"
                  onClick={() => handleAddField('equipmentUsage')}
                  className="flex items-center gap-1 text-[9px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors"
                >
                  <Plus size={12} /> Add Entry
                </button>
              </div>
              <div className="space-y-3">
                {formData.equipmentUsage?.map((e_usage, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input 
                      placeholder="Equipment" 
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                      value={e_usage.item}
                      onChange={e => {
                        const list = [...(formData.equipmentUsage || [])];
                        list[idx].item = e.target.value;
                        setFormData({...formData, equipmentUsage: list});
                      }}
                    />
                    <input 
                      type="number"
                      placeholder="Hrs" 
                      className="w-16 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-center outline-none"
                      value={e_usage.hours}
                      onChange={e => {
                        const list = [...(formData.equipmentUsage || [])];
                        list[idx].hours = parseFloat(e.target.value) || 0;
                        setFormData({...formData, equipmentUsage: list});
                      }}
                    />
                    <button 
                      type="button"
                      onClick={() => handleRemoveField('equipmentUsage', idx)}
                      className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Media & Photos */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Visual Evidence</label>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {formData.photos?.map((photo, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden relative group border-2 border-slate-100">
                  <img src={photo} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => removePhoto(i)}
                    className="absolute top-2 right-2 p-1 bg-white/90 text-rose-600 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all group"
              >
                <Camera size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Add Photo</span>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  multiple 
                  accept="image/*" 
                  onChange={handlePhotoUpload} 
                  className="hidden" 
                />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-8 flex flex-col md:flex-row gap-4 justify-end border-t border-slate-100">
          <button 
            type="button" 
            disabled={isSubmitting}
            onClick={() => handleAction(LogStatus.DRAFT)}
            className="flex items-center justify-center gap-2 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-600 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
          >
            <Save size={16} /> Save Station Draft
          </button>
          <button 
            type="button"
            disabled={isSubmitting}
            onClick={() => handleAction(LogStatus.SUBMITTED)}
            className="flex items-center justify-center gap-2 px-12 py-4 text-[10px] font-black uppercase tracking-widest text-white bg-indigo-600 rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            Finalize Transmission
          </button>
        </div>
      </div>
    </div>
  );
};

export default SiteLogForm;
