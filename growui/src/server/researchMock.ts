import { randomUUID } from 'crypto';
import {
  AnalystNote,
  CompareFundMetric,
  CompareFundsResponse,
  FundCategory,
  FundScreenerFilters,
  FundSummary,
  MarketInsightItem,
  ModelPortfolio,
  RiskProfile,
  SavedScreen,
  ScreenerResultPayload,
  SearchIndexEntry,
  WatchlistEntry,
} from '@/types/research';

const fundCategories: FundCategory[] = ['large_cap', 'mid_cap', 'small_cap', 'multi_cap', 'debt', 'hybrid', 'index', 'sectoral'];
const riskProfiles: RiskProfile[] = ['low', 'moderate', 'moderately_high', 'high'];

const sampleFunds: FundSummary[] = Array.from({ length: 20 }).map((_, index) => {
  const category = fundCategories[index % fundCategories.length];
  const risk = riskProfiles[index % riskProfiles.length];
  const nav = 10 + index * 1.25;
  return {
    schemeCode: `FUND-${1000 + index}`,
    schemeName: `Grow ${category.replace('_', ' ')} Fund ${index + 1}`,
    amc: index % 2 === 0 ? 'Grow AMC' : 'Future AMC',
    category,
    risk,
    rating: 3 + (index % 3),
    nav,
    aum: 500 + index * 50,
    tags: ['popular', index % 2 === 0 ? 'tax_saver' : 'sip_ready'],
    returns: {
      oneYear: 8 + index,
      threeYear: 12 + index,
      fiveYear: 15 + index,
      ytd: 4 + index,
    },
    factors: {
      alpha: 2 + index * 0.1,
      beta: 0.9 + (index % 3) * 0.05,
      sharpe: 1 + index * 0.03,
      standardDeviation: 10 + index * 0.2,
      expenseRatio: 0.6 + (index % 4) * 0.1,
    },
  };
});

const savedScreens: SavedScreen[] = [
  {
    id: randomUUID(),
    name: 'Tax saver picks',
    description: 'ELSS funds with high consistency',
    filters: { categories: ['multi_cap', 'index'], minRating: 4 },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    pinned: true,
  },
  {
    id: randomUUID(),
    name: 'High alpha growth',
    filters: { riskLevels: ['moderately_high', 'high'], minRating: 4, tags: ['popular'] },
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    updatedAt: new Date(Date.now() - 5400000).toISOString(),
  },
];

const watchlist: WatchlistEntry[] = sampleFunds.slice(0, 4).map((fund, index) => ({
  id: randomUUID(),
  schemeCode: fund.schemeCode,
  schemeName: fund.schemeName,
  addedAt: new Date(Date.now() - index * 7200000).toISOString(),
  notes: index % 2 === 0 ? 'Track for SIP next quarter' : undefined,
  targetNav: index % 2 === 0 ? fund.nav - 0.5 : undefined,
  tags: index % 2 === 0 ? ['watch'] : [],
}));

const analystNotes: AnalystNote[] = Array.from({ length: 4 }).map((_, index) => ({
  id: randomUUID(),
  title: `Upgrade note ${index + 1}`,
  summary: 'Fund shows improving alpha and downside protection metrics.',
  analyst: index % 2 === 0 ? 'Aditi Shah' : 'Rahul Menon',
  ratingAction: index % 2 === 0 ? 'upgrade' : 'reiterate',
  publishedAt: new Date(Date.now() - index * 86400000).toISOString(),
  thesisHighlights: ['Improved rolling returns', 'Strong risk management', 'Reasonable valuations'],
  relatedSchemes: [sampleFunds[index].schemeCode],
  tags: ['featured', 'equity'],
}));

const modelPortfolios: ModelPortfolio[] = [
  {
    id: randomUUID(),
    name: 'Wealth Accumulator',
    riskProfile: 'moderately_high',
    objective: 'Maximize long-term growth with 70% equity tilt.',
    holdings: sampleFunds.slice(0, 5).map((fund, idx) => ({
      schemeCode: fund.schemeCode,
      schemeName: fund.schemeName,
      allocation: idx === 0 ? 30 : 14,
    })),
    rebalancedAt: new Date(Date.now() - 172800000).toISOString(),
    returns: {
      oneYear: 14.3,
      threeYear: 17.1,
      fiveYear: 18.4,
      ytd: 7.5,
    },
  },
  {
    id: randomUUID(),
    name: 'Income Shield',
    riskProfile: 'moderate',
    objective: 'Blend of debt and hybrid funds for stability.',
    holdings: sampleFunds.slice(5, 10).map((fund) => ({
      schemeCode: fund.schemeCode,
      schemeName: fund.schemeName,
      allocation: 20,
    })),
    rebalancedAt: new Date(Date.now() - 259200000).toISOString(),
    returns: {
      oneYear: 8.1,
      threeYear: 9.3,
      fiveYear: 10.4,
      ytd: 3.8,
    },
  },
];

const insightsFeed: MarketInsightItem[] = Array.from({ length: 6 }).map((_, idx) => ({
  id: randomUUID(),
  type: idx % 3 === 0 ? 'video' : idx % 3 === 1 ? 'article' : 'podcast',
  title: `Market pulse ${idx + 1}`,
  summary: 'Analysis on macro trends impacting multi-cap strategies.',
  url: 'https://grow.example.com/insight/' + (idx + 1),
  thumbnail: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=600&q=60',
  author: idx % 2 === 0 ? 'Editorial Desk' : 'Rohit Rao',
  publishedAt: new Date(Date.now() - idx * 43200000).toISOString(),
  tags: ['macro', 'strategy'],
  engagement: {
    reads: 500 + idx * 120,
    likes: 120 + idx * 20,
  },
}));

const searchIndex: SearchIndexEntry[] = [
  ...sampleFunds.slice(0, 5).map((fund) => ({
    id: fund.schemeCode,
    title: fund.schemeName,
    entityType: 'fund' as const,
    summary: `${fund.category} | NAV ₹${fund.nav}`,
    tags: fund.tags,
    url: `/funds/${fund.schemeCode}`,
    updatedAt: new Date().toISOString(),
  })),
  ...analystNotes.map((note) => ({
    id: note.id,
    title: note.title,
    entityType: 'note' as const,
    summary: note.summary,
    tags: note.tags,
    url: `/research/analyst/${note.id}`,
    updatedAt: note.publishedAt,
  })),
];

const applyFilters = (filters: FundScreenerFilters): FundSummary[] => {
  return sampleFunds.filter((fund) => {
    if (filters.categories?.length && !filters.categories.includes(fund.category)) return false;
    if (filters.riskLevels?.length && !filters.riskLevels.includes(fund.risk)) return false;
    if (filters.amcs?.length && !filters.amcs.includes(fund.amc)) return false;
    if (typeof filters.minRating === 'number' && fund.rating < filters.minRating) return false;
    if (typeof filters.maxExpenseRatio === 'number' && fund.factors.expenseRatio > filters.maxExpenseRatio) return false;
    if (filters.tags?.length && !filters.tags.some((tag) => fund.tags.includes(tag))) return false;
    if (filters.searchTerm && !fund.schemeName.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;
    return true;
  });
};

export const getScreenerResults = (filters: FundScreenerFilters): ScreenerResultPayload => {
  const filtered = applyFilters(filters);
  return { filters, results: filtered, total: filtered.length };
};

export const getSavedScreens = () => savedScreens;

export const saveScreen = (screen: Omit<SavedScreen, 'id' | 'createdAt' | 'updatedAt'>): SavedScreen => {
  const newScreen: SavedScreen = {
    ...screen,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  savedScreens.push(newScreen);
  return newScreen;
};

export const getWatchlist = () => watchlist;

export const toggleWatchlist = (schemeCode: string): WatchlistEntry => {
  const existingIndex = watchlist.findIndex((entry) => entry.schemeCode === schemeCode);
  if (existingIndex >= 0) {
    return watchlist[existingIndex];
  }
  const fund = sampleFunds.find((item) => item.schemeCode === schemeCode);
  const entry: WatchlistEntry = {
    id: randomUUID(),
    schemeCode,
    schemeName: fund?.schemeName ?? schemeCode,
    addedAt: new Date().toISOString(),
    tags: [],
  };
  watchlist.push(entry);
  return entry;
};

export const getAnalystNotes = () => analystNotes;
export const getModelPortfolios = () => modelPortfolios;
export const getMarketInsights = () => insightsFeed;

export const getCompareData = (baseCode: string, peerCodes: string[]): CompareFundsResponse | null => {
  const baseFund = sampleFunds.find((fund) => fund.schemeCode === baseCode);
  if (!baseFund) return null;
  const peers = peerCodes
    .map((code) => sampleFunds.find((fund) => fund.schemeCode === code))
    .filter(Boolean) as FundSummary[];

  const toMetric = (fund: FundSummary): CompareFundMetric => ({
    schemeCode: fund.schemeCode,
    schemeName: fund.schemeName,
    category: fund.category,
    risk: fund.risk,
    returns: fund.returns,
    alpha: fund.factors.alpha,
    beta: fund.factors.beta,
    sharpe: fund.factors.sharpe,
    expenseRatio: fund.factors.expenseRatio,
  });

  return {
    base: toMetric(baseFund),
    peers: peers.map(toMetric),
    metrics: ['returns', 'alpha', 'beta', 'sharpe', 'expenseRatio'],
  };
};

export const searchResearchIndex = (term: string): SearchIndexEntry[] => {
  if (!term) return searchIndex;
  return searchIndex.filter((entry) => entry.title.toLowerCase().includes(term.toLowerCase()));
};
