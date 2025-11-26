import useSWR from 'swr';
import {
  CapitalGainsReport,
  CreateStatementPayload,
  StatementAuditLogEntry,
  StatementRequest,
  TaxInsightsPayload,
} from '@/types/statements';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || 'Request failed');
  }
  return res.json();
};

export const useStatementRequests = () => {
  const { data, error, isLoading, mutate } = useSWR<StatementRequest[]>('/api/statements', fetcher);
  return {
    statements: data,
    error,
    loading: isLoading,
    refresh: mutate,
  };
};

export const requestStatementGeneration = async (payload: CreateStatementPayload): Promise<StatementRequest> => {
  const res = await fetch('/api/statements', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || 'Failed to request statement');
  }
  return res.json();
};

export const useCapitalGainsReport = () => {
  const { data, error, isLoading, mutate } = useSWR<CapitalGainsReport>('/api/capital-gains', fetcher);
  return {
    report: data,
    error,
    loading: isLoading,
    refresh: mutate,
  };
};

export const useTaxInsights = () => {
  const { data, error, isLoading, mutate } = useSWR<TaxInsightsPayload>('/api/tax-insights', fetcher);
  return {
    insights: data,
    error,
    loading: isLoading,
    refresh: mutate,
  };
};

export const useStatementAuditLog = () => {
  const { data, error, isLoading, mutate } = useSWR<{ entries: StatementAuditLogEntry[] }>('/api/audit-log', fetcher);
  return {
    entries: data?.entries,
    error,
    loading: isLoading,
    refresh: mutate,
  };
};
