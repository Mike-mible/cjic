
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
  // Authentication & Profile Synchronization
  async signup(userData: { name: string; email: string; password: string; role: UserRole }) {
    // 1. Supabase Auth Signup
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("Authentication service unreachable.");

    // 2. Role-Based Auto-Approval Logic
    const autoActiveRoles = [
      UserRole.PROJECT_MANAGER,
      UserRole.CONSTRUCTION_MANAGER,
      UserRole.ADMIN_MANAGER,
      UserRole.SITE_ENGINEER,
      UserRole.ARCHITECT,
      UserRole.ADMIN,
      UserRole.SUPER_ADMIN,
      UserRole.EXECUTIVE
    ];

    const initialStatus = autoActiveRoles.includes(userData.role) 
      ? UserStatus.ACTIVE 
      : UserStatus.PENDING;

    // 3. Create public.users profile
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
      .single();

    if (profileError) throw profileError;

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
      .single();

    if (error) return null;
    return mapUserToCamel(profile);
  },

  // Database Operations
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

  async getUsers() {
    const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data.map(mapUserToCamel);
  },

  async updateStatus(id: string, status: UserStatus) {
    const { data, error } = await supabase.from('users').update({ status }).eq('id', id).select().single();
    if (error) throw error;
    return mapUserToCamel(data);
  },

  async completeOnboarding(id: string, updates: Partial<User>) {
    const { data, error } = await supabase.from('users').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return mapUserToCamel(data);
  },

  async createSafetyReport(report: Partial<SafetyReport>) {
    const { data, error } = await supabase.from('safety_reports').insert([report]).select().single();
    if (error) throw error;
    return data as SafetyReport;
  },

  async bootstrapSystem(site: Partial<Site>, admin: Partial<User>) {
    const { data, error } = await supabase.from('sites').insert([site]).select().single();
    if (error) throw error;
    return data;
  }
};
