import { randomUUID } from 'crypto';
import { AuditArtifact, ConsentRecord, DisasterRecoveryTask, Regulator, RetentionPolicy } from '@/types/compliance';

const retentionPolicies: RetentionPolicy[] = [
  {
    id: 'RET-1',
    regulator: 'SEBI',
    dataCategory: 'kyc',
    retentionPeriodMonths: 120,
    legalReference: 'SEBI (KYC) Regulations 2011',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'RET-2',
    regulator: 'AMFI',
    dataCategory: 'transactions',
    retentionPeriodMonths: 84,
    legalReference: 'AMFI Circular 45/2022',
    updatedAt: new Date(Date.now() - 86400_000).toISOString(),
  },
  {
    id: 'RET-3',
    regulator: 'RBI',
    dataCategory: 'communications',
    retentionPeriodMonths: 36,
    legalReference: 'RBI Digital Lending Guidelines',
    updatedAt: new Date(Date.now() - 3 * 86400_000).toISOString(),
  },
];

const consentRecords: ConsentRecord[] = [
  {
    id: 'CONS-1001',
    user: 'customer@grow.in',
    grantedAt: new Date(Date.now() - 5 * 86400_000).toISOString(),
    status: 'granted',
    scopes: ['portfolio_insights', 'marketing_updates'],
    documentUrl: '/docs/consent/customer.pdf',
  },
  {
    id: 'CONS-1002',
    user: 'investor@example.com',
    grantedAt: new Date(Date.now() - 40 * 86400_000).toISOString(),
    status: 'withdrawn',
    scopes: ['marketing_updates'],
    documentUrl: '/docs/consent/investor.pdf',
  },
];

const auditArtifacts: AuditArtifact[] = [
  {
    id: 'AUD-1',
    name: 'KYC Snapshot',
    description: 'Latest verified KYC dataset for all active customers',
    lastGeneratedAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
    type: 'kyc',
    format: 'zip',
  },
  {
    id: 'AUD-2',
    name: 'Transaction Ledger',
    description: 'Consolidated MF transactions for regulators',
    lastGeneratedAt: new Date(Date.now() - 6 * 3600_000).toISOString(),
    type: 'transactions',
    format: 'csv',
  },
  {
    id: 'AUD-3',
    name: 'Communications Archive',
    description: 'Email/SMS communications for quarterly review',
    lastGeneratedAt: new Date(Date.now() - 86400_000).toISOString(),
    type: 'communications',
    format: 'pdf',
  },
];

const drChecklist: DisasterRecoveryTask[] = [
  {
    id: 'DR-1',
    name: 'Daily backup verification',
    owner: 'DevOps',
    cadence: 'daily',
    status: 'completed',
  },
  {
    id: 'DR-2',
    name: 'Quarterly failover drill',
    owner: 'SRE Team',
    cadence: 'quarterly',
    status: 'pending',
    notes: 'Scheduled for next month',
  },
  {
    id: 'DR-3',
    name: 'Annual BCP review',
    owner: 'Compliance',
    cadence: 'annual',
    status: 'blocked',
    notes: 'Waiting on legal sign-off',
  },
];

export const getRetentionPolicies = () => retentionPolicies;
export const updatePolicy = (id: string, period: number, regulator?: Regulator) => {
  const policy = retentionPolicies.find((item) => item.id === id);
  if (policy) {
    policy.retentionPeriodMonths = period;
    if (regulator) policy.regulator = regulator;
    policy.updatedAt = new Date().toISOString();
  }
  return policy;
};

export const getConsentRecords = () => consentRecords;
export const toggleConsentStatus = (id: string, status: ConsentRecord['status']) => {
  const consent = consentRecords.find((item) => item.id === id);
  if (consent) {
    consent.status = status;
  }
  return consent;
};

export const getAuditArtifacts = () => auditArtifacts;
export const regenerateArtifact = (id: string) => {
  const artifact = auditArtifacts.find((item) => item.id === id);
  if (artifact) {
    artifact.lastGeneratedAt = new Date().toISOString();
  }
  return artifact;
};

export const getDisasterRecoveryTasks = () => drChecklist;
export const updateDrTaskStatus = (id: string, status: DisasterRecoveryTask['status']) => {
  const task = drChecklist.find((item) => item.id === id);
  if (task) {
    task.status = status;
  }
  return task;
};

export const addRetentionPolicy = (policy: Omit<RetentionPolicy, 'id' | 'updatedAt'>) => {
  const created: RetentionPolicy = {
    ...policy,
    id: randomUUID(),
    updatedAt: new Date().toISOString(),
  };
  retentionPolicies.unshift(created);
  return created;
};
