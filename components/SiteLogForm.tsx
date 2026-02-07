import React, { useState } from 'react';
import { Site, SiteLog, LogStatus } from '../types';
import { Plus, Trash2, Save, Send, Camera } from 'lucide-react';

interface SiteLogFormProps {
  onSubmit: (log: Partial<SiteLog>) => void;
  sites: Site[];
}

const SiteLogForm: React.FC<SiteLogFormProps> = ({ onSubmit, sites }) => {
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
    foremanName: 'Michael Chen' // Default for demo
  });

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

  const handleSubmit = () => {
    if (!formData.siteId) {
      alert("Please select a project site.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Daily Site Logging Form</h3>
          <span className="text-xs text-slate-500 uppercase font-medium">Drafting New Log</span>
        </div>
        
        <div className="p-6 space-y-8">
          {/* General Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Project Site</label>
              <select 
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.siteId}
                onChange={e => setFormData({ ...formData, siteId: e.target.value })}
              >
                <option value="">Select a Site</option>
                {sites.map(site => <option key={site.id} value={site.id}>{site.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Block / Section</label>
              <input 
                type="text" 
                placeholder="e.g. Block B, Sector 4"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.blockName}
                onChange={e => setFormData({ ...formData, blockName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Shift</label>
              <div className="flex gap-2">
                {['Day', 'Night'].map(s => (
                  <button 
                    key={s}
                    type="button"
                    onClick={() => setFormData({ ...formData, shift: s as any })}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg border ${
                      formData.shift === s ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'border-slate-300 text-slate-600 bg-white'
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Worker Headcount</label>
              <input 
                type="number" 
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.workersCount}
                onChange={e => setFormData({ ...formData, workersCount: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">Work Description Completed</label>
              <textarea 
                rows={3}
                placeholder="Detail the work done today..."
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.workCompleted}
                onChange={e => setFormData({ ...formData, workCompleted: e.target.value })}
              />
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Materials */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-slate-800 uppercase tracking-wide">Material Usage</label>
              <button 
                type="button"
                onClick={() => handleAddField('materialUsage')}
                className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800"
              >
                <Plus size={14} /> Add Material
              </button>
            </div>
            <div className="space-y-3">
              {formData.materialUsage?.map((m, idx) => (
                <div key={idx} className="flex gap-3">
                  <input 
                    placeholder="Material Name" 
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none"
                    value={m.item}
                    onChange={e => {
                      const list = [...(formData.materialUsage || [])];
                      list[idx].item = e.target.value;
                      setFormData({...formData, materialUsage: list});
                    }}
                  />
                  <input 
                    placeholder="Qty" 
                    className="w-24 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none"
                    value={m.quantity}
                    onChange={e => {
                      const list = [...(formData.materialUsage || [])];
                      list[idx].quantity = e.target.value;
                      setFormData({...formData, materialUsage: list});
                    }}
                  />
                  <input 
                    placeholder="Unit" 
                    className="w-24 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none"
                    value={m.unit}
                    onChange={e => {
                      const list = [...(formData.materialUsage || [])];
                      list[idx].unit = e.target.value;
                      setFormData({...formData, materialUsage: list});
                    }}
                  />
                  <button 
                    type="button"
                    onClick={() => handleRemoveField('materialUsage', idx)}
                    className="p-2 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Equipment */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-slate-800 uppercase tracking-wide">Equipment Usage</label>
              <button 
                type="button"
                onClick={() => handleAddField('equipmentUsage')}
                className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800"
              >
                <Plus size={14} /> Add Equipment
              </button>
            </div>
            <div className="space-y-3">
              {formData.equipmentUsage?.map((e_usage, idx) => (
                <div key={idx} className="flex gap-3">
                  <input 
                    placeholder="Equipment Type" 
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none"
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
                    className="w-32 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none"
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
                    className="p-2 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Media & Incidents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Incidents / Safety Observations</label>
              <textarea 
                rows={3}
                placeholder="Report any safety issues or accidents..."
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.incidents}
                onChange={e => setFormData({ ...formData, incidents: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Photos / Proof of Work</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-300 hover:text-indigo-400 transition-all cursor-pointer">
                <Camera size={32} className="mb-2" />
                <span className="text-sm font-medium">Click to upload or take photo</span>
                <input type="file" multiple className="hidden" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-4 flex gap-3 justify-end">
          <button type="button" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
            <Save size={16} /> Save Draft
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md"
          >
            <Send size={16} /> Submit for Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default SiteLogForm;