import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import {
  AnalystNote,
  CompareFundsResponse,
  FundScreenerFilters,
  MarketInsightItem,
  ModelPortfolio,
  SavedScreen,
  ScreenerResultPayload,
  WatchlistEntry,
} from '@/types/research';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || 'Request failed');
  }
  return res.json();
};

const postFetcher = async (url: string, { arg }: { arg: any }) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg),
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || 'Request failed');
  }
  return res.json();
};

const buildScreenerQuery = (filters: FundScreenerFilters) => {
  const params = new URLSearchParams();
  if (filters.categories?.length) params.append('categories', filters.categories.join(','));
  if (filters.riskLevels?.length) params.append('riskLevels', filters.riskLevels.join(','));
  if (filters.amcs?.length) params.append('amcs', filters.amcs.join(','));
  if (filters.tags?.length) params.append('tags', filters.tags.join(','));
  if (typeof filters.minRating === 'number') params.append('minRating', filters.minRating.toString());
  if (typeof filters.maxExpenseRatio === 'number') params.append('maxExpenseRatio', filters.maxExpenseRatio.toString());
  if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
  return `/api/research/screener?${params.toString()}`;
};

export const useFundScreener = (filters: FundScreenerFilters) => {
  const key = buildScreenerQuery(filters);
  const { data, error, isLoading, mutate } = useSWR<ScreenerResultPayload>(key, fetcher);
  return { screener: data, loading: isLoading, error, refresh: mutate };
};

export const useSavedScreens = () => {
  const { data, error, isLoading, mutate } = useSWR<{ items: SavedScreen[] }>('/api/research/saved-screens', fetcher);
  const { trigger, isMutating } = useSWRMutation('/api/research/saved-screens', postFetcher);
  const save = async (screen: Omit<SavedScreen, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await trigger(screen);
    await mutate();
    return created as SavedScreen;
  };
  return {
    screens: data?.items,
    loading: isLoading,
    saving: isMutating,
    error,
    save,
    refresh: mutate,
  };
};

export const useWatchlist = () => {
  const { data, error, isLoading, mutate } = useSWR<{ items: WatchlistEntry[] }>('/api/research/watchlist', fetcher);
  const { trigger, isMutating } = useSWRMutation('/api/research/watchlist', postFetcher);
  const toggle = async (schemeCode: string) => {
    await trigger({ schemeCode });
    await mutate();
  };
  return {
    watchlist: data?.items,
    loading: isLoading,
    toggling: isMutating,
    error,
    toggle,
    refresh: mutate,
  };
};

export const useAnalystNotes = () => {
  const { data, error, isLoading, mutate } = useSWR<{ items: AnalystNote[] }>('/api/research/analyst-notes', fetcher);
  return { notes: data?.items, loading: isLoading, error, refresh: mutate };
};

export const useModelPortfolios = () => {
  const { data, error, isLoading, mutate } = useSWR<{ items: ModelPortfolio[] }>('/api/research/model-portfolios', fetcher);
  return { portfolios: data?.items, loading: isLoading, error, refresh: mutate };
};

export const useMarketInsights = () => {
  const { data, error, isLoading, mutate } = useSWR<{ items: MarketInsightItem[] }>('/api/research/insights', fetcher);
  return { insights: data?.items, loading: isLoading, error, refresh: mutate };
};

export const fetchCompareData = async (base: string, peers: string[]): Promise<CompareFundsResponse> => {
  const params = new URLSearchParams({ base });
  if (peers.length) params.append('peers', peers.join(','));
  const res = await fetch(`/api/research/compare?${params.toString()}`);
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || 'Failed to fetch comparison');
  }
  return res.json();
};
