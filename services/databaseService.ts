
import { supabase } from './supabaseClient';
import { Site, SiteLog, SafetyReport, User, UserRole, UserStatus } from '../types';

// Fix: Changed property name from workers_count to workersCount to match SiteLog interface.
// Also removed explicit cast as SiteLog to allow TypeScript to verify the object structure correctly.
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
  // Authentication & Signup
  async signup(userData: { name: string; email: string; password: string; role: UserRole }) {
    // 1. Supabase Auth Signup
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("Signup failed - no user returned");

    // 2. Determine initial status based on role
    const instantRoles = [UserRole.MANAGER, UserRole.ENGINEER, UserRole.EXECUTIVE, UserRole.ADMIN, UserRole.SUPER_ADMIN];
    const initialStatus = instantRoles.includes(userData.role) ? UserStatus.ACTIVE : UserStatus.PENDING;

    // 3. Get default site for initial assignment
    const { data: sites } = await supabase.from('sites').select('id').limit(1);
    const siteId = sites?.[0]?.id || null;

    // 4. Create public profile record (Password is NOT stored here)
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id, // Link to Auth ID
        name: userData.name,
        email: userData.email,
        site_id: siteId,
        role: userData.role,
        status: initialStatus,
        last_active: initialStatus === UserStatus.ACTIVE ? 'Just Joined' : 'Awaiting Approval'
      }])
      .select();

    if (profileError) {
      // Cleanup auth user if profile creation fails
      console.error("Profile creation failed, cleanup required", profileError);
      throw profileError;
    }

    return mapUserToCamel(profileData[0]);
  },

  async login(email: string, password: string) {
    // 1. Authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("Login failed");

    // 2. Fetch public profile
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) throw profileError;
    
    // Update last active
    await supabase.from('users').update({ last_active: 'Recently Active' }).eq('id', authData.user.id);
    
    return mapUserToCamel(profileData);
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profileData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) return null;
    return mapUserToCamel(profileData);
  },

  async updateStatus(id: string, status: UserStatus) {
    const { data, error } = await supabase
      .from('users')
      .update({ status })
      .eq('id', id)
      .select();
    if (error) throw error;
    return mapUserToCamel(data[0]);
  },

  // Sites
  async getSites() {
    const { data, error } = await supabase.from('sites').select('*').order('name');
    if (error) throw error;
    return data as Site[];
  },

  // Logs
  async getSiteLogs() {
    const { data, error } = await supabase.from('site_logs').select('*').order('timestamp', { ascending: false });
    if (error) throw error;
    return data.map(mapLogToCamel);
  },

  async createSiteLog(log: Partial<SiteLog>) {
    const { data, error } = await supabase.from('site_logs').insert([log]).select();
    if (error) throw error;
    return mapLogToCamel(data[0]);
  },

  async updateSiteLogStatus(id: string, status: string, feedback?: string) {
    const { data, error } = await supabase.from('site_logs').update({ status, engineer_feedback: feedback }).eq('id', id).select();
    if (error) throw error;
    return mapLogToCamel(data[0]);
  },

  async getSafetyReports() {
    const { data, error } = await supabase.from('safety_reports').select('*');
    if (error) throw error;
    return data as SafetyReport[];
  },

  async createSafetyReport(report: Partial<SafetyReport>) {
    const { data, error } = await supabase.from('safety_reports').insert([report]).select();
    if (error) throw error;
    return data[0] as SafetyReport;
  },

  async getUsers() {
    const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data.map(mapUserToCamel);
  },

  async completeOnboarding(id: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update({
        phone: updates.phone,
        avatar: updates.avatar,
        status: updates.status,
        last_active: 'Recently Active'
      })
      .eq('id', id)
      .select();
    if (error) throw error;
    return mapUserToCamel(data[0]);
  },

  async bootstrapSystem(site: Partial<Site>, admin: Partial<User>) {
    // Note: Bootstrapping in a real auth world usually involves a pre-existing auth user
    // For this demo, we assume the sites table insert is the primary trigger.
    const { data: siteData, error: siteError } = await supabase
      .from('sites')
      .insert([{ 
        name: site.name, 
        location: site.location, 
        progress: 0, 
        budget: 0, 
        spent: 0 
      }])
      .select();
    if (siteError) throw siteError;

    // This part should be handled by a signup but we'll allow site creation
    return { site: siteData[0] };
  }
};
