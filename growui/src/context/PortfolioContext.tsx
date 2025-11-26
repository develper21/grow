import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { PortfolioFilters, PortfolioNavPoint, PortfolioSnapshot } from '@/types/portfolio';
import { fetchPortfolioAccounts, usePortfolioSnapshot } from '@/lib/portfolioApi';

interface PortfolioContextValue {
  filters: PortfolioFilters;
  setTimeRange: (range: PortfolioFilters['timeRange']) => void;
  setAccount: (accountId?: string) => void;
  accounts: string[];
  snapshot?: PortfolioSnapshot & { navSeries: PortfolioNavPoint[] };
  loading: boolean;
  refresh: () => void;
}

const PortfolioContext = createContext<PortfolioContextValue | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: React.ReactNode }) => {
  const [filters, setFilters] = useState<PortfolioFilters>({ timeRange: '6M' });
  const [accounts, setAccounts] = useState<string[]>([]);
  const { snapshot, loading, refresh } = usePortfolioSnapshot(filters);

  useEffect(() => {
    let mounted = true;
    fetchPortfolioAccounts()
      .then((list) => {
        if (mounted) {
          setAccounts(list);
        }
      })
      .catch((error) => console.warn('Failed to load accounts', error));
    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      filters,
      setTimeRange: (range: PortfolioFilters['timeRange']) => setFilters((prev) => ({ ...prev, timeRange: range })),
      setAccount: (accountId?: string) => setFilters((prev) => ({ ...prev, accountId })),
      accounts,
      snapshot,
      loading: loading ?? false,
      refresh,
    }),
    [filters, accounts, snapshot, loading, refresh]
  );

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
};

export const usePortfolioContext = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolioContext must be used within PortfolioProvider');
  }
  return context;
};
