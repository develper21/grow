export type Regulator = 'SEBI' | 'AMFI' | 'RBI' | 'IRDAI';
export type DataCategory = 'kyc' | 'transactions' | 'communications' | 'analytics';
export type ConsentStatus = 'granted' | 'withdrawn' | 'expired';

export interface RetentionPolicy {
  id: string;
  regulator: Regulator;
  dataCategory: DataCategory;
  retentionPeriodMonths: number;
  legalReference: string;
  updatedAt: string;
}

export interface ConsentRecord {
  id: string;
  user: string;
  grantedAt: string;
  status: ConsentStatus;
  scopes: string[];
  documentUrl: string;
}

export interface AuditArtifact {
  id: string;
  name: string;
  description: string;
  lastGeneratedAt: string;
  type: 'kyc' | 'transactions' | 'communications';
  format: 'csv' | 'pdf' | 'zip';
}

export interface DisasterRecoveryTask {
  id: string;
  name: string;
  owner: string;
  cadence: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  status: 'pending' | 'completed' | 'blocked';
  notes?: string;
}
