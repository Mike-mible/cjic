import { supabase } from './supabaseClient';
import { Site, SiteLog, SafetyReport, User } from '../types';

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

const mapSafetyToCamel = (report: any): SafetyReport => ({
  id: report.id,
  date: report.date,
  siteId: report.site_id,
  hazardLevel: report.hazard_level,
  ppeCompliance: report.ppe_compliance,
  observations: report.observations,
  actionRequired: report.action_required,
  photos: report.photos || []
});

export const db = {
  // Sites
  async getSites() {
    const { data, error } = await supabase.from('sites').select('*').order('name');
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
    return data.map(mapLogToCamel);
  },

  async createSiteLog(log: Partial<SiteLog>) {
    const { data, error } = await supabase
      .from('site_logs')
      .insert([{
        site_id: log.siteId,
        date: log.date,
        shift: log.shift,
        block_name: log.blockName,
        foreman_name: log.foremanName,
        status: log.status || 'SUBMITTED',
        workers_count: log.workersCount,
        work_completed: log.workCompleted,
        material_usage: log.materialUsage,
        equipment_usage: log.equipmentUsage,
        incidents: log.incidents,
        photos: log.photos
      }])
      .select();
    if (error) throw error;
    return mapLogToCamel(data[0]);
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
    return mapLogToCamel(data[0]);
  },

  // Safety Reports
  async getSafetyReports() {
    const { data, error } = await supabase.from('safety_reports').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data.map(mapSafetyToCamel);
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
    return mapSafetyToCamel(data[0]);
  },

  // Users
  async getUsers() {
    const { data, error } = await supabase.from('users').select('*').order('name');
    if (error) throw error;
    return data.map(mapUserToCamel);
  },

  async updateUserStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('users')
      .update({ status })
      .eq('id', id)
      .select();
    if (error) throw error;
    return mapUserToCamel(data[0]);
  }
};