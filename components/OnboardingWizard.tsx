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
import { db } from '../services/databaseService';
import { User, UserStatus } from '../types';

interface OnboardingWizardProps {
  user: User;
  onComplete: () => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    phone: '',
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`,
    bio: ''
  });

  const steps = [
    { id: 1, label: 'Account Security', icon: Lock },
    { id: 2, label: 'Professional Profile', icon: UserCircle },
    { id: 3, label: 'Access Ready', icon: ShieldCheck },
  ];

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      try {
        setIsSubmitting(true);
        await db.completeOnboarding(user.id, {
          phone: formData.phone,
          avatar: formData.avatar,
          status: UserStatus.ACTIVE
        });
        onComplete();
      } catch (err) {
        console.error(err);
        alert('Failed to complete onboarding. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-4 z-50">
      <div className="max-w-xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-500">
        {/* Header with Progress */}
        <div className="bg-slate-50 p-8 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <Building2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Welcome, {user.name}</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Setup your workstation</p>
            </div>
          </div>
          
          <div className="flex justify-between relative max-w-xs mx-auto">
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
        <div className="p-10 flex-1 min-h-[300px]">
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
                 <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-indigo-50 flex items-center justify-center text-slate-300 relative group cursor-pointer overflow-hidden">
                    {formData.avatar ? <img src={formData.avatar} className="w-full h-full object-cover" /> : <Camera size={32} />}
                    <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 rounded-full transition-colors"></div>
                 </div>
                 <p className="text-[10px] font-bold text-indigo-600 mt-2 uppercase tracking-widest">Profile Picture Set</p>
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
                  <textarea 
                    rows={2} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none" 
                    placeholder="Short professional summary..."
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8 animate-in zoom-in-95">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={48} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">You're All Set!</h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-6">Your credentials have been verified. You have been assigned to the project workstation as a <strong>{user.role}</strong>.</p>
              
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Access Level</p>
                <p className="text-sm font-bold text-slate-800">{user.role.replace('_', ' ')}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <button 
            onClick={() => setStep(step - 1)}
            disabled={step === 1 || isSubmitting}
            className={`text-sm font-bold text-slate-400 hover:text-slate-600 disabled:opacity-0 transition-all`}
          >
            Back
          </button>
          <button 
            disabled={isSubmitting}
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95"
          >
            {isSubmitting ? 'Syncing...' : step === 3 ? "Enter BuildStream" : "Continue"}
            {step < 3 && !isSubmitting && <ChevronRight size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;