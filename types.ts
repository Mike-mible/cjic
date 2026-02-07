
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  FOREMAN = 'FOREMAN',
  SAFETY_OFFICER = 'SAFETY_OFFICER',
  SUPERVISOR = 'SUPERVISOR',
  ENGINEER = 'ENGINEER',
  MANAGER = 'MANAGER',
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
  INVITED = 'INVITED',
  SUSPENDED = 'SUSPENDED',
  DEACTIVATED = 'DEACTIVATED'
}

export interface User {
  id: string;
  name: string;
  email: string;
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
