export type FundCategory = 'large_cap' | 'mid_cap' | 'small_cap' | 'multi_cap' | 'debt' | 'hybrid' | 'index' | 'sectoral';
export type RiskProfile = 'low' | 'moderate' | 'moderately_high' | 'high';
export type InsightType = 'article' | 'video' | 'podcast';
export type RatingAction = 'upgrade' | 'downgrade' | 'reiterate' | 'initiate';

export interface FundReturnWindow {
  oneYear: number;
  threeYear: number;
  fiveYear: number;
  ytd: number;
}

export interface FundFactorScores {
  alpha: number;
  beta: number;
  sharpe: number;
  standardDeviation: number;
  expenseRatio: number;
}

export interface FundSummary {
  schemeCode: string;
  schemeName: string;
  amc: string;
  category: FundCategory;
  risk: RiskProfile;
  rating: number;
  nav: number;
  aum: number;
  tags: string[];
  returns: FundReturnWindow;
  factors: FundFactorScores;
}

export interface FundScreenerFilters {
  categories?: FundCategory[];
  riskLevels?: RiskProfile[];
  amcs?: string[];
  minRating?: number;
  maxExpenseRatio?: number;
  tags?: string[];
  searchTerm?: string;
}

export interface ScreenerResultPayload {
  filters: FundScreenerFilters;
  results: FundSummary[];
  total: number;
}

export interface SavedScreen {
  id: string;
  name: string;
  description?: string;
  filters: FundScreenerFilters;
  createdAt: string;
  updatedAt: string;
  pinned?: boolean;
}

export interface WatchlistEntry {
  id: string;
  schemeCode: string;
  schemeName: string;
  addedAt: string;
  notes?: string;
  targetNav?: number;
  tags: string[];
}

export interface AnalystNote {
  id: string;
  title: string;
  summary: string;
  analyst: string;
  ratingAction: RatingAction;
  publishedAt: string;
  thesisHighlights: string[];
  relatedSchemes: string[];
  tags: string[];
}

export interface ModelPortfolioHolding {
  schemeCode: string;
  schemeName: string;
  allocation: number;
}

export interface ModelPortfolio {
  id: string;
  name: string;
  riskProfile: RiskProfile;
  objective: string;
  holdings: ModelPortfolioHolding[];
  rebalancedAt: string;
  returns: FundReturnWindow;
}

export interface MarketInsightItem {
  id: string;
  type: InsightType;
  title: string;
  summary: string;
  url: string;
  thumbnail?: string;
  author: string;
  publishedAt: string;
  tags: string[];
  engagement: {
    reads: number;
    likes: number;
  };
}

export interface CompareFundMetric {
  schemeCode: string;
  schemeName: string;
  category: FundCategory;
  risk: RiskProfile;
  returns: FundReturnWindow;
  alpha: number;
  beta: number;
  sharpe: number;
  expenseRatio: number;
  expenseRank?: number;
}

export interface CompareFundsResponse {
  base: CompareFundMetric;
  peers: CompareFundMetric[];
  metrics: string[];
}

export interface SearchIndexEntry {
  id: string;
  title: string;
  entityType: 'fund' | 'note' | 'insight' | 'portfolio';
  summary: string;
  tags: string[];
  url: string;
  updatedAt: string;
}
