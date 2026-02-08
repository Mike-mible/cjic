
import { supabase } from './supabaseClient';
import { Site, SiteLog, SafetyReport, User, UserRole, UserStatus } from '../types';

const mapLogToCamel = (log: any): SiteLog => ({
  id: log.id,
  date: log.date,
  shift: log.shift,
  siteId: log.site_id,
  blockName: log.block_name,
  foremanName: log.foreman_name,
  status: log.status,
  workersCount: log.workers_count,
  workCompleted: log.work_completed,
  materialUsage: log.material_usage || [],
  equipmentUsage: log.equipment_usage || [],
  incidents: log.incidents,
  photos: log.photos || [],
  timestamp: log.timestamp,
  engineerFeedback: log.engineer_feedback
});

const mapUserToCamel = (user: any): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  siteId: user.site_id,
  status: user.status,
  lastActive: user.last_active,
  avatar: user.avatar
});

export const db = {
  // Fix: Added bootstrapSystem method used in BootstrapSystem.tsx
  async bootstrapSystem(site: { name: string; location: string }, admin: { name: string; email: string }) {
    const { data: siteData, error: siteError } = await supabase
      .from('sites')
      .insert([{ 
        name: site.name, 
        location: site.location, 
        progress: 0, 
        budget: 0, 
        spent: 0 
      }])
      .select()
      .single();
    
    if (siteError) throw siteError;

    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([{
        name: admin.name,
        email: admin.email,
        role: UserRole.SUPER_ADMIN,
        status: UserStatus.ACTIVE,
        site_id: siteData.id,
        last_active: 'System Root'
      }])
      .select()
      .single();
      
    if (userError) throw userError;
    
    return { site: siteData, admin: mapUserToCamel(userData) };
  },

  async signup(userData: { name: string; email: string; password: string; role: UserRole }) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("Signup failed - Auth service unavailable");

    const autoApproveRoles = [
      UserRole.PROJECT_MANAGER,
      UserRole.CONSTRUCTION_MANAGER,
      UserRole.ADMIN_MANAGER,
      UserRole.SITE_ENGINEER,
      UserRole.ARCHITECT,
      UserRole.ADMIN,
      UserRole.SUPER_ADMIN,
      UserRole.EXECUTIVE
    ];
    
    const initialStatus = autoApproveRoles.includes(userData.role) 
      ? UserStatus.ACTIVE 
      : UserStatus.PENDING;

    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        status: initialStatus,
        last_active: 'Just Joined'
      }])
      .select()
      .maybeSingle(); // Use maybeSingle to avoid 406 errors on empty results

    if (profileError) throw profileError;
    if (!profileData) throw new Error("Profile creation failed in database.");

    return mapUserToCamel(profileData);
  },

  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data.user;
  },

  async logout() {
    await supabase.auth.signOut();
  },

  async getCurrentUserProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle(); // Better handling for missing profiles

    if (error || !profile) return null;
    return mapUserToCamel(profile);
  },

  // Fix: Added completeOnboarding method used in OnboardingWizard.tsx
  async completeOnboarding(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update({
        phone: updates.phone,
        avatar: updates.avatar,
        status: updates.status
      })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return mapUserToCamel(data);
  },

  async updateStatus(id: string, status: UserStatus) {
    const { data, error } = await supabase
      .from('users')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return mapUserToCamel(data);
  },

  async getUsers() {
    const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data.map(mapUserToCamel);
  },

  async getSites() {
    const { data, error } = await supabase.from('sites').select('*').order('name');
    if (error) throw error;
    return data as Site[];
  },

  async getSiteLogs() {
    const { data, error } = await supabase.from('site_logs').select('*').order('timestamp', { ascending: false });
    if (error) throw error;
    return data.map(mapLogToCamel);
  },

  async createSiteLog(log: Partial<SiteLog>) {
    const { data, error } = await supabase.from('site_logs').insert([log]).select().single();
    if (error) throw error;
    return mapLogToCamel(data);
  },

  async updateSiteLogStatus(id: string, status: string, feedback?: string) {
    const { data, error } = await supabase.from('site_logs').update({ status, engineer_feedback: feedback }).eq('id', id).select().single();
    if (error) throw error;
    return mapLogToCamel(data);
  },

  async createSafetyReport(report: Partial<SafetyReport>) {
    const { data, error } = await supabase.from('safety_reports').insert([report]).select().single();
    if (error) throw error;
    return data as SafetyReport;
  }
};
