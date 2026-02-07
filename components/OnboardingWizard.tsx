
import React, { useState } from 'react';
import { 
  Building2, 
  Lock, 
  UserCircle, 
  CheckCircle2, 
  ChevronRight, 
  Camera,
  MapPin,
  ShieldCheck
} from 'lucide-react';
import { SITES } from '../constants';

interface OnboardingWizardProps {
  onComplete: () => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    password: '',
    phone: '',
    siteId: '1',
    bio: ''
  });

  const steps = [
    { id: 1, label: 'Account Security', icon: Lock },
    { id: 2, label: 'Professional Profile', icon: UserCircle },
    { id: 3, label: 'Site Assignment', icon: MapPin },
    { id: 4, label: 'Access Ready', icon: ShieldCheck },
  ];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else onComplete();
  };

  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center p-4 z-50">
      <div className="max-w-xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">
        {/* Header with Progress */}
        <div className="bg-slate-50 p-8 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <Building2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Welcome to BuildStream</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Setup your workstation</p>
            </div>
          </div>
          
          <div className="flex justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
            {steps.map((s) => (
              <div 
                key={s.id} 
                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  step >= s.id ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-300'
                }`}
              >
                {step > s.id ? <CheckCircle2 size={20} /> : <s.icon size={20} />}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-black uppercase tracking-tighter text-slate-400">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-10 flex-1">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Secure Your Account</h3>
                <p className="text-sm text-slate-500 mb-6">Choose a strong password to protect your site data and submissions.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">New Password</label>
                    <input 
                      type="password" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Confirm Password</label>
                    <input type="password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none" placeholder="••••••••" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-lg font-bold text-slate-900">Complete Your Profile</h3>
              <div className="flex flex-col items-center mb-8">
                 <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-indigo-50 flex items-center justify-center text-slate-300 relative group cursor-pointer">
                    <Camera size={32} />
                    <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 rounded-full transition-colors"></div>
                 </div>
                 <p className="text-[10px] font-bold text-indigo-600 mt-2 uppercase tracking-widest">Upload Photo</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Phone Number</label>
                  <input 
                    type="tel" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Bio / Summary</label>
                  <textarea rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none" placeholder="Senior site foreman with 10 years experience..."></textarea>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-lg font-bold text-slate-900">Confirm Site Assignment</h3>
              <p className="text-sm text-slate-500">The administrator has mapped you to the following project. Please verify.</p>
              <div className="space-y-3 mt-6">
                {SITES.map((site) => (
                  <button 
                    key={site.id}
                    onClick={() => setFormData({...formData, siteId: site.id})}
                    className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${
                      formData.siteId === site.id ? 'bg-indigo-50 border-indigo-600' : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-left">
                      <p className={`text-sm font-bold ${formData.siteId === site.id ? 'text-indigo-900' : 'text-slate-800'}`}>{site.name}</p>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">{site.location}</p>
                    </div>
                    {formData.siteId === site.id && <CheckCircle2 size={20} className="text-indigo-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-8 animate-in zoom-in-95">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={48} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">You're All Set!</h3>
              <p className="text-slate-500 max-w-sm mx-auto">Your account is active. You can now start submitting site reports and collaborating with your team.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <button 
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className={`text-sm font-bold text-slate-400 hover:text-slate-600 disabled:opacity-0 transition-all`}
          >
            Back
          </button>
          <button 
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95"
          >
            {step === 4 ? "Enter BuildStream" : "Continue"}
            {step < 4 && <ChevronRight size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
