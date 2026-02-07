
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
} as SiteLog);

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
    // 1. Determine initial status based on role
    // Instant roles: Manager, Engineer, Executive, Admin
    const instantRoles = [UserRole.MANAGER, UserRole.ENGINEER, UserRole.EXECUTIVE, UserRole.ADMIN, UserRole.SUPER_ADMIN];
    const initialStatus = instantRoles.includes(userData.role) ? UserStatus.ACTIVE : UserStatus.PENDING;

    // 2. Get default site for initial assignment
    const { data: sites } = await supabase.from('sites').select('id').limit(1);
    const siteId = sites?.[0]?.id || null;

    // 3. Create user record
    const { data, error } = await supabase
      .from('users')
      .insert([{
        ...userData,
        site_id: siteId,
        status: initialStatus,
        last_active: initialStatus === UserStatus.ACTIVE ? 'Just Signed Up' : 'Awaiting Approval'
      }])
      .select();

    if (error) throw error;
    return mapUserToCamel(data[0]);
  },

  async login(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;
    return mapUserToCamel(data);
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

  // Fixed: Property 'completeOnboarding' does not exist on type db
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

  // Fixed: Property 'bootstrapSystem' does not exist on type db
  async bootstrapSystem(site: Partial<Site>, admin: Partial<User>) {
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

    const { data: adminData, error: adminError } = await supabase
      .from('users')
      .insert([{
        name: admin.name,
        email: admin.email,
        role: UserRole.SUPER_ADMIN,
        site_id: siteData[0].id,
        status: UserStatus.ACTIVE,
        last_active: 'Just Initialized'
      }])
      .select();
    if (adminError) throw adminError;
    
    return { site: siteData[0], admin: mapUserToCamel(adminData[0]) };
  }
};