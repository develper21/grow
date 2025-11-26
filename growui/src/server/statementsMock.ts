import { randomUUID } from 'crypto';
import {
  CapitalGainsReport,
  CapitalGainLot,
  StatementAuditLogEntry,
  StatementRequest,
  TaxInsightCard,
  TaxInsightsPayload,
} from '@/types/statements';

const now = new Date();

const sampleStatement = (overrides: Partial<StatementRequest> = {}): StatementRequest => ({
  id: randomUUID(),
  requestedAt: new Date(now.getTime() - 1000 * 60 * 5).toISOString(),
  requestedBy: 'narvin@grow.in',
  frequency: 'monthly',
  periodLabel: 'Oct 2025',
  periodStart: new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString(),
  periodEnd: new Date(now.getFullYear(), now.getMonth(), 0).toISOString(),
  format: 'pdf',
  deliveryChannels: ['email', 'in_app'],
  status: 'ready',
  downloadUrl: '/downloads/statements/oct-2025.pdf',
  deliveredAt: new Date(now.getTime() - 1000 * 60 * 2).toISOString(),
  ...overrides,
});

export const statementRequests: StatementRequest[] = [
  sampleStatement(),
  sampleStatement({
    frequency: 'quarterly',
    periodLabel: 'Q2 FY25',
    periodStart: new Date(now.getFullYear(), now.getMonth() - 3, 1).toISOString(),
    periodEnd: new Date(now.getFullYear(), now.getMonth(), 0).toISOString(),
    status: 'processing',
    downloadUrl: undefined,
    deliveredAt: undefined,
  }),
  sampleStatement({
    frequency: 'fy',
    periodLabel: 'FY24',
    periodStart: new Date(now.getFullYear() - 1, 3, 1).toISOString(),
    periodEnd: new Date(now.getFullYear(), 2, 31).toISOString(),
    status: 'failed',
    failureReason: 'Email delivery bounced',
    deliveryChannels: ['email'],
  }),
];

const capitalGainLot = (overrides: Partial<CapitalGainLot> = {}): CapitalGainLot => ({
  id: randomUUID(),
  schemeCode: '120503',
  schemeName: 'Grow Equity Opportunities Fund',
  assetClass: 'equity',
  folio: 'FOLIO12345',
  units: 120.5,
  purchaseDate: new Date(now.getFullYear() - 2, now.getMonth(), now.getDate()).toISOString(),
  purchaseValue: 250000,
  saleDate: new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).toISOString(),
  saleValue: 315000,
  gain: 65000,
  gainType: 'long_term',
  holdingPeriodDays: 610,
  ...overrides,
});

export const capitalGainLots: CapitalGainLot[] = [
  capitalGainLot(),
  capitalGainLot({
    schemeCode: '118746',
    schemeName: 'Grow Short Term Debt Fund',
    assetClass: 'debt',
    units: 500,
    purchaseValue: 100000,
    saleValue: 108500,
    gain: 8500,
    gainType: 'short_term',
    holdingPeriodDays: 90,
  }),
  capitalGainLot({
    schemeCode: '134211',
    schemeName: 'Grow Gold ETF',
    assetClass: 'gold',
    units: 35,
    purchaseValue: 150000,
    saleValue: 162000,
    gain: 12000,
    gainType: 'long_term',
    holdingPeriodDays: 400,
  }),
];

export const capitalGainsReport: CapitalGainsReport = {
  financialYear: 'FY25',
  generatedAt: now.toISOString(),
  summary: {
    shortTermGain: capitalGainLots.filter((lot) => lot.gainType === 'short_term').reduce((sum, lot) => sum + lot.gain, 0),
    longTermGain: capitalGainLots.filter((lot) => lot.gainType === 'long_term').reduce((sum, lot) => sum + lot.gain, 0),
    totalGain: capitalGainLots.reduce((sum, lot) => sum + lot.gain, 0),
  },
  lots: capitalGainLots,
  breakdown: [
    {
      assetClass: 'equity',
      shortTermGain: 0,
      longTermGain: capitalGainLots
        .filter((lot) => lot.assetClass === 'equity' && lot.gainType === 'long_term')
        .reduce((sum, lot) => sum + lot.gain, 0),
    },
    {
      assetClass: 'debt',
      shortTermGain: capitalGainLots
        .filter((lot) => lot.assetClass === 'debt' && lot.gainType === 'short_term')
        .reduce((sum, lot) => sum + lot.gain, 0),
      longTermGain: 0,
    },
    {
      assetClass: 'gold',
      shortTermGain: 0,
      longTermGain: capitalGainLots
        .filter((lot) => lot.assetClass === 'gold' && lot.gainType === 'long_term')
        .reduce((sum, lot) => sum + lot.gain, 0),
    },
  ],
};

export const getStatementRequests = () => statementRequests;
export const getStatementById = (id: string) => statementRequests.find((request) => request.id === id);
export const getStatementAuditLog = () => statementAuditLog;
export const getCapitalGainsReport = () => capitalGainsReport;
export const getTaxInsights = () => taxInsights;

export const statementAuditLog: StatementAuditLogEntry[] = [
  {
    id: randomUUID(),
    action: 'requested',
    actor: 'narvin@grow.in',
    channel: 'in_app',
    referenceId: statementRequests[0].id,
    timestamp: statementRequests[0].requestedAt,
    metadata: { period: statementRequests[0].periodLabel },
  },
  {
    id: randomUUID(),
    action: 'emailed',
    actor: 'system',
    channel: 'email',
    referenceId: statementRequests[0].id,
    timestamp: statementRequests[0].deliveredAt ?? new Date().toISOString(),
    metadata: { template: 'statement-ready' },
  },
  {
    id: randomUUID(),
    action: 'failed',
    actor: 'system',
    channel: 'email',
    referenceId: statementRequests[2].id,
    timestamp: new Date().toISOString(),
    metadata: { reason: 'Email bounce', code: '550' },
  },
];

export const taxInsightCards: TaxInsightCard[] = [
  {
    id: 'elss-gap',
    title: 'Boost ELSS contributions',
    body: 'Invest another ₹25,000 before 31 Mar to maximize Section 80C limit.',
    severity: 'warning',
    metricLabel: 'Remaining limit',
    metricValue: '₹25,000',
    ctaLabel: 'Start SIP',
    ctaHref: '/transactions/new?type=sip&scheme=ELSS001',
  },
  {
    id: 'rebalance',
    title: 'Rebalance debt allocation',
    body: 'Debt holdings exceeded ideal allocation by 6%. Consider shifting to hybrid funds.',
    severity: 'info',
  },
  {
    id: 'tax-saver',
    title: 'Projected tax savings',
    body: 'Your current ELSS plan could save ~₹39,000 this FY.',
    severity: 'success',
    metricLabel: 'Projected savings',
    metricValue: '₹39,000',
  },
];

export const taxInsights: TaxInsightsPayload = {
  elssUtilization: {
    financialYear: 'FY25',
    sectionLimit: 150000,
    investedToDate: 110000,
    remainingLimit: 40000,
    projectedTaxSavings: 39000,
    recommendedFunds: [
      { schemeCode: 'ELSS001', schemeName: 'Grow Tax Saver Fund', suggestedSip: 5000 },
      { schemeCode: 'ELSS002', schemeName: 'Grow ELSS Advantage', suggestedSip: 4000 },
    ],
  },
  cards: taxInsightCards,
};

export interface StatementGenerationResult {
  request: StatementRequest;
  auditEntries: StatementAuditLogEntry[];
}

export const triggerStatementGeneration = (
  payload: Omit<StatementRequest, 'id' | 'requestedAt' | 'status' | 'downloadUrl' | 'deliveredAt'>
): StatementGenerationResult => {
  const request: StatementRequest = {
    ...payload,
    id: randomUUID(),
    requestedAt: new Date().toISOString(),
    status: 'queued',
  };
  const auditEntries: StatementAuditLogEntry[] = [
    {
      id: randomUUID(),
      action: 'requested',
      actor: payload.requestedBy ?? 'narvin@grow.in',
      channel: 'in_app',
      referenceId: request.id,
      timestamp: request.requestedAt,
    },
  ];
  statementRequests.unshift(request);
  statementAuditLog.unshift(...auditEntries);
  return { request, auditEntries };
};

export const simulateEmailDelivery = (requestId: string) => {
  const request = statementRequests.find((item) => item.id === requestId);
  if (!request) return;
  request.status = 'ready';
  request.downloadUrl = `/downloads/statements/${requestId}.pdf`;
  request.deliveredAt = new Date().toISOString();
  statementAuditLog.push({
    id: randomUUID(),
    action: 'emailed',
    actor: 'system',
    channel: 'email',
    referenceId: request.id,
    timestamp: request.deliveredAt,
    metadata: { template: 'statement-ready' },
  });
};
