import { randomUUID } from 'crypto';
import {
  ActivityLogEntry,
  AdminUser,
  AlertWorkflow,
  FeatureFlag,
  ModerationCase,
  RoleDefinition,
} from '@/types/admin';

const roleDefinitions: RoleDefinition[] = [
  {
    role: 'viewer',
    permissions: ['view_portfolio', 'view_logs'],
    description: 'Read-only access to analytics and logs.',
  },
  {
    role: 'analyst',
    permissions: ['view_portfolio', 'view_logs', 'moderation'],
    description: 'Analysts handle moderation queue and audit trails.',
  },
  {
    role: 'manager',
    permissions: ['view_portfolio', 'view_logs', 'moderation', 'feature_toggle', 'manage_content'],
    description: 'Growth managers with content and feature toggle access.',
  },
  {
    role: 'admin',
    permissions: ['view_portfolio', 'view_logs', 'moderation', 'feature_toggle', 'manage_content', 'manage_users'],
    description: 'Full access to admin console.',
  },
];

const adminUsers: AdminUser[] = [
  {
    id: 'USR-1001',
    name: 'Ananya Rao',
    email: 'ananya@grow.in',
    role: 'admin',
    permissions: roleDefinitions.find((r) => r.role === 'admin')!.permissions,
    status: 'active',
    lastSeen: new Date().toISOString(),
  },
  {
    id: 'USR-1002',
    name: 'Karthik Menon',
    email: 'karthik@grow.in',
    role: 'manager',
    permissions: roleDefinitions.find((r) => r.role === 'manager')!.permissions,
    status: 'active',
    lastSeen: new Date(Date.now() - 3600_000).toISOString(),
  },
  {
    id: 'USR-1003',
    name: 'Riya Patel',
    email: 'riya@grow.in',
    role: 'analyst',
    permissions: roleDefinitions.find((r) => r.role === 'analyst')!.permissions,
    status: 'suspended',
    lastSeen: new Date(Date.now() - 86_400_000).toISOString(),
  },
];

const featureFlags: FeatureFlag[] = [
  {
    key: 'landing.personalization',
    name: 'Landing personalization',
    description: 'Enable personalization tokens on campaign pages.',
    enabled: true,
    owner: 'Growth Platform',
    lastUpdated: new Date().toISOString(),
  },
  {
    key: 'portfolio.activity-feed-v2',
    name: 'Activity feed v2',
    description: 'Shows grouped activity timeline.',
    enabled: false,
    owner: 'Product Ops',
    lastUpdated: new Date(Date.now() - 7200_000).toISOString(),
  },
];

const moderationCases: ModerationCase[] = [
  {
    id: 'MOD-5001',
    accountId: 'ACC-01',
    type: 'kyc_exception',
    status: 'open',
    createdAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
    flaggedBy: 'system',
    notes: ['Address mismatch vs. PAN'],
    severity: 'medium',
  },
  {
    id: 'MOD-5002',
    accountId: 'ACC-55',
    type: 'suspicious_activity',
    status: 'reviewing',
    createdAt: new Date(Date.now() - 6 * 3600_000).toISOString(),
    flaggedBy: 'ananya@grow.in',
    notes: ['Multiple failed OTP attempts'],
    severity: 'high',
  },
];

const activityLogs: ActivityLogEntry[] = Array.from({ length: 12 }).map((_, index) => {
  const metadata: Record<string, string | number> = index % 2 === 0 ? { role: 'manager' } : { format: 'csv' };
  return {
    id: randomUUID(),
    actor: index % 2 === 0 ? 'ananya@grow.in' : 'system',
    action: index % 2 === 0 ? 'updated_role' : 'generated_report',
    resource: index % 2 === 0 ? 'USR-1002' : 'Audit report',
    createdAt: new Date(Date.now() - index * 1800_000).toISOString(),
    metadata,
  };
});

const alertWorkflows: AlertWorkflow[] = [
  {
    id: randomUUID(),
    name: 'KYC escalation',
    channel: 'email',
    condition: 'severity=high',
    recipients: ['ops@grow.in'],
    active: true,
  },
  {
    id: randomUUID(),
    name: 'Feature toggle updates',
    channel: 'slack',
    condition: 'owner=Growth Platform',
    recipients: ['#feature-flags'],
    active: true,
  },
];

export const getAdminUsers = () => adminUsers;
export const getRoleDefinitions = () => roleDefinitions;
export const updateAdminUser = (
  id: string,
  changes: Partial<Pick<AdminUser, 'role' | 'status' | 'permissions'>>
) => {
  const user = adminUsers.find((item) => item.id === id);
  if (user) {
    if (changes.role) {
      user.role = changes.role;
      user.permissions = roleDefinitions.find((r) => r.role === changes.role)?.permissions ?? user.permissions;
    }
    if (changes.status) {
      user.status = changes.status;
    }
    if (changes.permissions) {
      user.permissions = changes.permissions;
    }
    user.lastSeen = new Date().toISOString();
  }
  return user;
};
export const getFeatureFlags = () => featureFlags;
export const toggleFeatureFlag = (key: string, enabled: boolean) => {
  const flag = featureFlags.find((f) => f.key === key);
  if (flag) {
    flag.enabled = enabled;
    flag.lastUpdated = new Date().toISOString();
  }
  return flag;
};

export const getModerationCases = () => moderationCases;
export const updateModerationStatus = (id: string, status: ModerationCase['status']) => {
  const modCase = moderationCases.find((item) => item.id === id);
  if (modCase) {
    modCase.status = status;
    modCase.notes.push(`Status updated to ${status}`);
  }
  return modCase;
};

export const getActivityLogs = () => activityLogs;
export const getAlertWorkflows = () => alertWorkflows;
export const toggleAlertWorkflow = (id: string, active: boolean) => {
  const workflow = alertWorkflows.find((item) => item.id === id);
  if (workflow) {
    workflow.active = active;
  }
  return workflow;
};
