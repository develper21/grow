import {
  AllocationSlice,
  PortfolioActivityItem,
  PortfolioExportResponse,
  PortfolioFilters,
  PortfolioGoal,
  PortfolioHolding,
  PortfolioKpis,
  PortfolioNavPoint,
  PortfolioSnapshot,
  PortfolioTimeRange,
  PortfolioTransaction,
} from '@/types/portfolio';

const baseHoldings: PortfolioHolding[] = [
  {
    id: 'HLD-001',
    schemeCode: '120503',
    schemeName: 'Grow Equity Opportunities Fund',
    assetClass: 'equity',
    units: 152.78,
    averageNav: 42.15,
    currentNav: 58.9,
    costPrice: 6434.82,
    currentValue: 9008.74,
    gain: 2573.92,
    gainPct: 40,
  },
  {
    id: 'HLD-002',
    schemeCode: '118746',
    schemeName: 'Grow Short Term Debt Fund',
    assetClass: 'debt',
    units: 823.5,
    averageNav: 12.4,
    currentNav: 13.1,
    costPrice: 10211.4,
    currentValue: 10787.85,
    gain: 576.45,
    gainPct: 5.6,
  },
  {
    id: 'HLD-003',
    schemeCode: '134211',
    schemeName: 'Grow Gold ETF',
    assetClass: 'gold',
    units: 32.1,
    averageNav: 44.9,
    currentNav: 51.72,
    costPrice: 1442.29,
    currentValue: 1660.07,
    gain: 217.78,
    gainPct: 15.1,
  },
];

const baseGoals: PortfolioGoal[] = [
  {
    id: 'GL-001',
    label: 'Child Education',
    targetAmount: 2500000,
    currentAmount: 1125000,
    targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 6)).toISOString(),
    status: 'on_track',
    milestonesCompleted: 6,
    totalMilestones: 12,
  },
  {
    id: 'GL-002',
    label: 'Retirement Corpus',
    targetAmount: 15000000,
    currentAmount: 5200000,
    targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 18)).toISOString(),
    status: 'behind',
    milestonesCompleted: 7,
    totalMilestones: 20,
  },
];

const baseActivities: PortfolioActivityItem[] = [
  {
    id: 'ACT-1001',
    type: 'sip',
    title: 'SIP executed in Grow Equity Opportunities Fund',
    description: '₹10,000 auto-debited via mandate MAND-001',
    amount: 10000,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    accountId: 'ACC-01',
    tags: ['auto', 'sip'],
  },
  {
    id: 'ACT-1002',
    type: 'dividend',
    title: 'Dividend received from Grow Short Term Debt Fund',
    description: '₹1,250 credited to primary bank account',
    amount: 1250,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    accountId: 'ACC-02',
    tags: ['income'],
  },
  {
    id: 'ACT-1003',
    type: 'buy',
    title: 'Lumpsum investment into Grow Gold ETF',
    description: '₹50,000 invested via netbanking',
    amount: 50000,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    accountId: 'ACC-01',
    tags: ['gold'],
  },
];

const baseTransactions: PortfolioTransaction[] = [
  {
    id: 'TX-001',
    schemeCode: '120503',
    type: 'sip',
    amount: 10000,
    units: 170.1,
    nav: 58.8,
    executedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    accountId: 'ACC-01',
  },
  {
    id: 'TX-002',
    schemeCode: '118746',
    type: 'dividend',
    amount: 1250,
    units: 0,
    nav: 0,
    executedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    accountId: 'ACC-02',
  },
  {
    id: 'TX-003',
    schemeCode: '134211',
    type: 'buy',
    amount: 50000,
    units: 966.18,
    nav: 51.76,
    executedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    accountId: 'ACC-01',
  },
];

const allocation: AllocationSlice[] = [
  { assetClass: 'equity', value: 1800000, percentage: 60 },
  { assetClass: 'debt', value: 900000, percentage: 30 },
  { assetClass: 'gold', value: 300000, percentage: 10 },
];

const kpis: PortfolioKpis = {
  totalValue: 3000000,
  investedCapital: 2300000,
  totalGain: 700000,
  gainPct: 30.4,
  xirr: 12.6,
};

const accountOptions = ['ACC-01', 'ACC-02'];

const rangeDays: Record<PortfolioTimeRange, number> = {
  '1M': 30,
  '3M': 90,
  '6M': 180,
  '1Y': 365,
  '3Y': 365 * 3,
  '5Y': 365 * 5,
  ALL: 365 * 7,
};

const generateNavSeries = (range: PortfolioTimeRange): PortfolioNavPoint[] => {
  const now = new Date();
  const points: PortfolioNavPoint[] = [];
  const days = rangeDays[range] ?? 180;
  for (let i = days; i >= 0; i -= Math.max(1, Math.floor(days / 60))) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const base = 2000000 + i * 5000;
    const noise = Math.sin(i / 15) * 35000;
    points.push({ date: date.toISOString().split('T')[0], value: base + noise });
  }
  return points;
};

const filterByAccount = <T extends { accountId?: string }>(items: T[], accountId?: string) => {
  if (!accountId) return items;
  return items.filter((item) => item.accountId === accountId);
};

const filterByRange = <T extends { date?: string; executedAt?: string }>(
  items: T[],
  range: PortfolioTimeRange
) => {
  if (range === 'ALL') return items;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - (rangeDays[range] ?? 180));
  return items.filter((item) => {
    const value = item.date ?? item.executedAt;
    if (!value) return true;
    return new Date(value).getTime() >= cutoff.getTime();
  });
};

export const getPortfolioSnapshot = (
  filters: PortfolioFilters
): PortfolioSnapshot & { navSeries: PortfolioNavPoint[] } => {
  const navSeries = generateNavSeries(filters.timeRange);
  const activities = filterByAccount(filterByRange(baseActivities, filters.timeRange), filters.accountId);
  const transactions = filterByAccount(filterByRange(baseTransactions, filters.timeRange), filters.accountId);
  return {
    asOf: new Date().toISOString(),
    filters,
    holdings: baseHoldings,
    allocation,
    goals: getPortfolioGoals(filters),
    activities,
    transactions,
    kpis,
    navSeries,
  };
};

export const getPortfolioAccounts = () => accountOptions;

export const getPortfolioNavSeries = (filters: PortfolioFilters) => generateNavSeries(filters.timeRange);

export const getPortfolioAllocation = () => allocation;

export const getPortfolioGoals = (filters: PortfolioFilters) => {
  if (!filters.accountId) return baseGoals;
  const seededGoals = baseGoals.map((goal, index) => ({
    ...goal,
    id: `${goal.id}-${filters.accountId}`,
    label: `${goal.label} (${filters.accountId})`,
    currentAmount: goal.currentAmount * (filters.accountId === 'ACC-01' ? 0.8 : 1.2),
  }));
  return seededGoals;
};

export const getPortfolioActivities = (filters: PortfolioFilters) =>
  filterByAccount(filterByRange(baseActivities, filters.timeRange), filters.accountId);

export const getPortfolioExport = (
  format: 'csv' | 'pdf',
  filters: PortfolioFilters
): PortfolioExportResponse => {
  const filename = `portfolio-${filters.timeRange.toLowerCase()}-${Date.now()}.${format}`;
  return {
    format,
    filename,
    generatedAt: new Date().toISOString(),
  };
};
