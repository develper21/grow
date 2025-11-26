import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import {
  FeedbackEntry,
  KnowledgeCategory,
  SupportTicket,
  TicketStatus,
  SlaDashboard,
  FaqEntry,
} from '@/types/support';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || 'Request failed');
  }
  return res.json();
};

const patchFetcher = async (url: string, { arg }: { arg: any }) => {
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg),
  });
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

export const useKnowledgeBase = (search?: string) => {
  const key = search ? `/api/support/knowledge?search=${encodeURIComponent(search)}` : '/api/support/knowledge';
  const { data, error, isLoading, mutate } = useSWR(key, fetcher);
  const categories: KnowledgeCategory[] | undefined = data?.categories;
  const searchResults: FaqEntry[] | undefined = data?.items;
  return { categories, searchResults, loading: isLoading, error, refresh: mutate };
};

export const useSupportTickets = () => {
  const { data, error, isLoading, mutate } = useSWR<{ items: SupportTicket[] }>('/api/support/tickets', fetcher);
  const { trigger: triggerStatus, isMutating: updating } = useSWRMutation('/api/support/tickets', patchFetcher);
  const { trigger: triggerCreate, isMutating: creating } = useSWRMutation('/api/support/tickets', postFetcher);

  const updateTicket = async (ticketId: string, status: TicketStatus) => {
    await triggerStatus({ ticketId, status });
    await mutate();
  };

  const createTicket = async (payload: { subject: string; channel: SupportTicket['channel']; customer: string; body: string }) => {
    await triggerCreate(payload);
    await mutate();
  };

  return {
    tickets: data?.items,
    loading: isLoading,
    updating,
    creating,
    error,
    updateTicket,
    createTicket,
    refresh: mutate,
  };
};

export const useSlaMetrics = () => {
  const { data, error, isLoading, mutate } = useSWR<SlaDashboard>('/api/support/sla', fetcher);
  return { sla: data, loading: isLoading, error, refresh: mutate };
};

export const useFeedback = () => {
  const { data, error, isLoading, mutate } = useSWR<{ items: FeedbackEntry[] }>('/api/support/feedback', fetcher);
  const { trigger, isMutating } = useSWRMutation('/api/support/feedback', postFetcher);
  const submitFeedback = async (entry: Pick<FeedbackEntry, 'user' | 'rating' | 'comment' | 'type'>) => {
    await trigger(entry);
    await mutate();
  };
  return { feedback: data?.items, loading: isLoading, submitting: isMutating, error, submitFeedback, refresh: mutate };
};
