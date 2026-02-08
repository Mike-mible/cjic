
import { Site, SiteLog, LogStatus, User, UserRole, UserStatus } from './types';

export const SITES: Site[] = [
  { id: '1', name: 'Skyline Towers', location: 'Downtown Metro', progress: 65, budget: 5000000, spent: 3200000 },
  { id: '2', name: 'Riverfront Plaza', location: 'East Bank', progress: 32, budget: 12000000, spent: 4500000 },
  { id: '3', name: 'Green Valley Villas', location: 'Suburban Hills', progress: 88, budget: 2500000, spent: 2100000 },
];

export const MOCK_USERS: User[] = [
  { id: 'U1', name: 'James Miller', email: 'james.m@buildstream.com', role: UserRole.ADMIN, siteId: '1', status: UserStatus.ACTIVE, lastActive: '2 mins ago' },
  { id: 'U2', name: 'Michael Chen', email: 'm.chen@buildstream.com', role: UserRole.FOREMAN, siteId: '1', status: UserStatus.ACTIVE, lastActive: '1 hour ago' },
  { id: 'U3', name: 'Sarah Thompson', email: 's.thompson@buildstream.com', role: UserRole.SAFETY_OFFICER, siteId: '2', status: UserStatus.ACTIVE, lastActive: '3 hours ago' },
  // Fixed: Property 'INVITED' does not exist on type 'typeof UserStatus'. Changed to PENDING.
  // Fixed: Property 'SUPERVISOR' does not exist on type 'typeof UserRole'. Changed to SITE_SUPERVISOR.
  { id: 'U4', name: 'Robert Wilson', email: 'r.wilson@buildstream.com', role: UserRole.SITE_SUPERVISOR, siteId: '1', status: UserStatus.PENDING, lastActive: 'Never' },
  // Fixed: Property 'MANAGER' does not exist on type 'typeof UserRole'. Changed to PROJECT_MANAGER.
  { id: 'U5', name: 'David Lee', email: 'd.lee@buildstream.com', role: UserRole.PROJECT_MANAGER, siteId: '3', status: UserStatus.SUSPENDED, lastActive: '2 days ago' },
];

export const MOCK_LOGS: SiteLog[] = [
  {
    id: 'LOG-001',
    date: '2024-05-15',
    shift: 'Day',
    siteId: '1',
    blockName: 'Tower A',
    foremanName: 'Michael Chen',
    status: LogStatus.SUBMITTED,
    workersCount: 45,
    workCompleted: 'Foundation pouring completed for Sector 1.',
    materialUsage: [{ item: 'Cement', quantity: '500', unit: 'bags' }],
    equipmentUsage: [{ item: 'Tower Crane', hours: 8 }],
    incidents: 'Slight delay (45 mins) due to concrete truck arrival window.',
    photos: ['https://picsum.photos/seed/const1/400/300'],
    timestamp: '2024-05-15 17:30:00'
  }
];

export const PROGRESS_DATA = [
  { month: 'Jan', progress: 10 },
  { month: 'Feb', progress: 25 },
  { month: 'Mar', progress: 40 },
  { month: 'Apr', progress: 55 },
  { month: 'May', progress: 64 },
];

export const MATERIAL_STATS = [
  { name: 'Cement', allocated: 1000, consumed: 850 },
  { name: 'Steel', allocated: 500, consumed: 480 },
  { name: 'Bricks', allocated: 5000, consumed: 4200 },
  { name: 'Sand', allocated: 2000, consumed: 1900 },
];
