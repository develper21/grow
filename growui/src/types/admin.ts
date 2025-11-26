export type UserRole = 'viewer' | 'analyst' | 'manager' | 'admin';
export type Permission = 'view_portfolio' | 'manage_users' | 'manage_content' | 'view_logs' | 'feature_toggle' | 'moderation';
export type FlagSeverity = 'low' | 'medium' | 'high';
export type ModerationStatus = 'open' | 'reviewing' | 'resolved';
export type AlertChannel = 'email' | 'slack';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  status: 'active' | 'suspended';
  lastSeen: string;
}

export interface RoleDefinition {
  role: UserRole;
  permissions: Permission[];
  description: string;
}

export interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  owner: string;
  lastUpdated: string;
}

export interface ModerationCase {
  id: string;
  accountId: string;
  type: 'kyc_exception' | 'suspicious_activity';
  status: ModerationStatus;
  createdAt: string;
  flaggedBy: string;
  notes: string[];
  severity: FlagSeverity;
}

export interface ActivityLogEntry {
  id: string;
  actor: string;
  action: string;
  resource: string;
  createdAt: string;
  metadata?: Record<string, string | number>;
}

export interface AlertWorkflow {
  id: string;
  name: string;
  channel: AlertChannel;
  condition: string;
  recipients: string[];
  active: boolean;
}
