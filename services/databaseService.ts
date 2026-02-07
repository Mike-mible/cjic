
import { supabase } from './supabaseClient';
import { Site, SiteLog, SafetyReport, User } from '../types';

export const db = {
  // Sites
  async getSites() {
    const { data, error } = await supabase.from('sites').select('*');
    if (error) throw error;
    return data as Site[];
  },

  // Site Logs
  async getSiteLogs() {
    const { data, error } = await supabase
      .from('site_logs')
      .select('*')
      .order('timestamp', { ascending: false });
    if (error) throw error;
    return data as SiteLog[];
  },

  async createSiteLog(log: Partial<SiteLog>) {
    // Map camelCase to snake_case if necessary, though SQL uses camelCase here for simplicity
    const { data, error } = await supabase
      .from('site_logs')
      .insert([{
        site_id: log.siteId,
        date: log.date,
        shift: log.shift,
        block_name: log.blockName,
        foreman_name: log.foremanName,
        status: log.status,
        workers_count: log.workersCount,
        work_completed: log.workCompleted,
        material_usage: log.materialUsage,
        equipment_usage: log.equipmentUsage,
        incidents: log.incidents,
        photos: log.photos,
        engineer_feedback: log.engineerFeedback
      }])
      .select();
    if (error) throw error;
    return data[0] as SiteLog;
  },

  async updateSiteLogStatus(id: string, status: string, feedback?: string) {
    const { data, error } = await supabase
      .from('site_logs')
      .update({ 
        status: status, 
        engineer_feedback: feedback 
      })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  // Safety Reports
  async getSafetyReports() {
    const { data, error } = await supabase.from('safety_reports').select('*');
    if (error) throw error;
    return data as SafetyReport[];
  },

  async createSafetyReport(report: Partial<SafetyReport>) {
    const { data, error } = await supabase
      .from('safety_reports')
      .insert([{
        site_id: report.siteId,
        date: report.date,
        hazard_level: report.hazardLevel,
        ppe_compliance: report.ppeCompliance,
        observations: report.observations,
        action_required: report.actionRequired,
        photos: report.photos
      }])
      .select();
    if (error) throw error;
    return data[0] as SafetyReport;
  },

  // Users
  async getUsers() {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    return data as User[];
  },

  async updateUserStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('users')
      .update({ status })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  // Seed Helper
  async seedInitialData(sites: Site[], users: User[]) {
    // Sites
    const { error: siteError } = await supabase.from('sites').upsert(sites.map(s => ({
      id: s.id.length > 10 ? s.id : undefined, // only use as ID if it looks like a UUID
      name: s.name,
      location: s.location,
      progress: s.progress,
      budget: s.budget,
      spent: s.spent
    })));
    
    if (siteError) console.error("Seeding sites error:", siteError);

    // Users
    const { error: userError } = await supabase.from('users').upsert(users.map(u => ({
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      status: u.status,
      last_active: u.lastActive,
      avatar: u.avatar
    })));

    if (userError) console.error("Seeding users error:", userError);
  }
};
