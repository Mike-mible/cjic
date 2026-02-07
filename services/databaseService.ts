import { supabase } from './supabaseClient';
import { Site, SiteLog, SafetyReport, User, UserRole, UserStatus } from '../types';

// Fix: Renamed foreman_name to foremanName to match the SiteLog interface required property
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
    const { data, error } = await supabase.from('users').select('*').order('name');
    if (error) throw error;
    return data.map(mapUserToCamel);
  },

  async inviteUser(userData: { name: string; email: string; role: UserRole; siteId: string }) {
    const { data, error } = await supabase.from('users').insert([{ ...userData, status: 'INVITED', last_active: 'Never' }]).select();
    if (error) throw error;
    return mapUserToCamel(data[0]);
  },

  async completeOnboarding(userId: string, updates: { phone: string; avatar?: string; status: UserStatus }) {
    const { data, error } = await supabase.from('users').update({ ...updates, last_active: 'Just Now' }).eq('id', userId).select();
    if (error) throw error;
    return mapUserToCamel(data[0]);
  },

  async bootstrapSystem(siteData: { name: string; location: string }, userData: { name: string; email: string }) {
    // 1. Create first site
    const { data: site, error: siteError } = await supabase.from('sites').insert([siteData]).select();
    if (siteError) throw siteError;

    // 2. Create first Super Admin
    const { data: user, error: userError } = await supabase.from('users').insert([{
      name: userData.name,
      email: userData.email,
      role: 'SUPER_ADMIN',
      site_id: site[0].id,
      status: 'ACTIVE',
      last_active: 'Now (Founding Admin)'
    }]).select();
    if (userError) throw userError;

    return { site: site[0], user: mapUserToCamel(user[0]) };
  }
};