
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  ADMIN_MANAGER = 'ADMIN_MANAGER',
  FOREMAN = 'FOREMAN',
  SAFETY_OFFICER = 'SAFETY_OFFICER',
  SITE_SUPERVISOR = 'SITE_SUPERVISOR',
  SITE_ENGINEER = 'SITE_ENGINEER',
  ARCHITECT = 'ARCHITECT',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  CONSTRUCTION_MANAGER = 'CONSTRUCTION_MANAGER',
  EXECUTIVE = 'EXECUTIVE'
}

export enum LogStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FINALIZED = 'FINALIZED'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
  DEACTIVATED = 'DEACTIVATED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: UserRole;
  siteId: string;
  status: UserStatus;
  lastActive: string;
  avatar?: string;
}

export interface SiteLog {
  id: string;
  date: string;
  shift: 'Day' | 'Night';
  siteId: string;
  blockName: string;
  foremanName: string;
  status: LogStatus;
  workersCount: number;
  workCompleted: string;
  materialUsage: { item: string; quantity: string; unit: string }[];
  equipmentUsage: { item: string; hours: number }[];
  incidents: string;
  photos: string[];
  timestamp: string;
  engineerFeedback?: string;
}

export interface SafetyReport {
  id: string;
  date: string;
  siteId: string;
  hazardLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  ppeCompliance: boolean;
  observations: string;
  actionRequired: string;
  photos: string[];
}

export interface Site {
  id: string;
  name: string;
  location: string;
  progress: number;
  budget: number;
  spent: number;
}
