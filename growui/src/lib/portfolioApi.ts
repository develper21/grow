import useSWR from 'swr';
import { PortfolioExportResponse, PortfolioFilters, PortfolioSnapshot, PortfolioNavPoint } from '@/types/portfolio';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || 'Request failed');
  }
  return res.json();
};

export interface SharePortfolioResponse {
  shareUrl: string;
  expiresAt: string;
  filters: PortfolioFilters;
}

export const sharePortfolioSnapshot = async (filters: PortfolioFilters): Promise<SharePortfolioResponse> => {
  const res = await fetch('/api/portfolio/share', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ timeRange: filters.timeRange, accountId: filters.accountId }),
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || 'Failed to share snapshot');
  }
  return res.json();
};

export const usePortfolioSnapshot = (filters: PortfolioFilters) => {
  const params = new URLSearchParams({ timeRange: filters.timeRange });
  if (filters.accountId) params.append('accountId', filters.accountId);
  const { data, error, isLoading, mutate } = useSWR<PortfolioSnapshot & { navSeries: PortfolioNavPoint[] }>(
    `/api/portfolio/snapshot?${params.toString()}`,
    fetcher
  );
  return { snapshot: data, error, loading: isLoading, refresh: mutate };
};

export const fetchPortfolioAccounts = async (): Promise<string[]> => {
  const res = await fetch('/api/portfolio/accounts');
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || 'Failed to load accounts');
  }
  const payload = await res.json();
  return payload.accounts ?? [];
};

export const exportPortfolioData = async (
  format: 'csv' | 'pdf',
  filters: PortfolioFilters
): Promise<PortfolioExportResponse> => {
  const res = await fetch('/api/portfolio/export', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ format, timeRange: filters.timeRange, accountId: filters.accountId }),
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || 'Failed to export portfolio');
  }
  return res.json();
};
