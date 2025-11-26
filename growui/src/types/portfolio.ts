export type PortfolioTimeRange = '1M' | '3M' | '6M' | '1Y' | '3Y' | '5Y' | 'ALL';
export type AssetClass = 'equity' | 'debt' | 'gold' | 'hybrid';
export type ActivityType = 'buy' | 'sell' | 'sip' | 'dividend';
export type GoalStatus = 'on_track' | 'behind' | 'completed';

export interface PortfolioHolding {
  id: string;
  schemeCode: string;
  schemeName: string;
  assetClass: AssetClass;
  units: number;
  averageNav: number;
  currentNav: number;
  costPrice: number;
  currentValue: number;
  gain: number;
  gainPct: number;
}

export interface PortfolioTransaction {
  id: string;
  schemeCode: string;
  type: ActivityType;
  amount: number;
  units: number;
  nav: number;
  executedAt: string;
  accountId: string;
}

export interface PortfolioGoal {
  id: string;
  label: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  status: GoalStatus;
  milestonesCompleted: number;
  totalMilestones: number;
}

export interface PortfolioActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  amount: number;
  date: string;
  accountId: string;
  tags: string[];
}

export interface AllocationSlice {
  assetClass: AssetClass;
  value: number;
  percentage: number;
}

export interface PortfolioKpis {
  totalValue: number;
  investedCapital: number;
  totalGain: number;
  gainPct: number;
  xirr: number;
}

export interface PortfolioFilters {
  timeRange: PortfolioTimeRange;
  accountId?: string;
}

export interface PortfolioSnapshot {
  asOf: string;
  filters: PortfolioFilters;
  holdings: PortfolioHolding[];
  allocation: AllocationSlice[];
  goals: PortfolioGoal[];
  activities: PortfolioActivityItem[];
  transactions: PortfolioTransaction[];
  kpis: PortfolioKpis;
}

export interface PortfolioNavPoint {
  date: string;
  value: number;
}

export interface PortfolioExportResponse {
  format: 'csv' | 'pdf';
  filename: string;
  generatedAt: string;
}
