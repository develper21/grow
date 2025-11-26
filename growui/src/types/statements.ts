export type StatementFrequency = 'monthly' | 'quarterly' | 'fy';
export type StatementFormat = 'pdf' | 'csv';
export type StatementStatus = 'queued' | 'processing' | 'ready' | 'failed';
export type StatementDeliveryChannel = 'email' | 'in_app';
export type CapitalGainType = 'short_term' | 'long_term';

export interface StatementRequest {
  id: string;
  requestedAt: string;
  requestedBy: string;
  frequency: StatementFrequency;
  periodLabel: string;
  periodStart: string;
  periodEnd: string;
  format: StatementFormat;
  deliveryChannels: StatementDeliveryChannel[];
  status: StatementStatus;
  downloadUrl?: string;
  deliveredAt?: string;
  failureReason?: string;
}

export interface CreateStatementPayload {
  frequency: StatementFrequency;
  periodStart: string;
  periodEnd: string;
  format: StatementFormat;
  deliveryChannels: StatementDeliveryChannel[];
  periodLabel?: string;
  requestedBy?: string;
}

export interface StatementAuditLogEntry {
  id: string;
  action: 'requested' | 'delivered' | 'failed' | 'emailed';
  actor: string;
  channel: StatementDeliveryChannel;
  referenceId: string;
  timestamp: string;
  metadata?: Record<string, string | number>;
}

export interface CapitalGainLot {
  id: string;
  schemeCode: string;
  schemeName: string;
  assetClass: 'equity' | 'debt' | 'hybrid' | 'gold';
  folio: string;
  units: number;
  purchaseDate: string;
  purchaseValue: number;
  saleDate: string;
  saleValue: number;
  gain: number;
  gainType: CapitalGainType;
  holdingPeriodDays: number;
}

export interface CapitalGainBreakdown {
  assetClass: string;
  shortTermGain: number;
  longTermGain: number;
}

export interface CapitalGainsReport {
  financialYear: string;
  generatedAt: string;
  summary: {
    shortTermGain: number;
    longTermGain: number;
    totalGain: number;
  };
  lots: CapitalGainLot[];
  breakdown: CapitalGainBreakdown[];
}

export type TaxInsightSeverity = 'info' | 'warning' | 'success';

export interface TaxInsightCard {
  id: string;
  title: string;
  body: string;
  severity: TaxInsightSeverity;
  metricLabel?: string;
  metricValue?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface RecommendedFund {
  schemeCode: string;
  schemeName: string;
  suggestedSip: number;
}

export interface ElssUtilizationSummary {
  financialYear: string;
  sectionLimit: number;
  investedToDate: number;
  remainingLimit: number;
  projectedTaxSavings: number;
  recommendedFunds: RecommendedFund[];
}

export interface TaxInsightsPayload {
  elssUtilization: ElssUtilizationSummary;
  cards: TaxInsightCard[];
}
