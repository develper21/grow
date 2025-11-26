import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import {
  DeliveryLog,
  NotificationTemplate,
  TriggerRule,
  UserPreference,
} from '@/types/notification';

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

export const useNotificationTemplates = () => {
  const { data, error, isLoading, mutate } = useSWR<{ items: NotificationTemplate[] }>(
    '/api/notifications/templates',
    fetcher
  );
  const { trigger, isMutating } = useSWRMutation('/api/notifications/templates', patchFetcher);
  const updateStatus = async (templateId: string, status: NotificationTemplate['status']) => {
    await trigger({ templateId, status });
    await mutate();
  };
  return { templates: data?.items, loading: isLoading, updating: isMutating, error, updateStatus, refresh: mutate };
};

export const useNotificationPreferences = () => {
  const { data, error, isLoading, mutate } = useSWR<{ items: UserPreference[] }>('/api/notifications/preferences', fetcher);
  const { trigger, isMutating } = useSWRMutation('/api/notifications/preferences', patchFetcher);
  const updatePreference = async (userId: string, channel: string, optedIn: boolean) => {
    await trigger({ userId, channel, optedIn });
    await mutate();
  };
  return {
    preferences: data?.items,
    loading: isLoading,
    updating: isMutating,
    error,
    updatePreference,
    refresh: mutate,
  };
};

export const useDeliveryLogs = () => {
  const { data, error, isLoading, mutate } = useSWR<{ items: DeliveryLog[] }>('/api/notifications/delivery-logs', fetcher);
  return { deliveries: data?.items, loading: isLoading, error, refresh: mutate };
};

export const useTriggerRules = () => {
  const { data, error, isLoading, mutate } = useSWR<{ items: TriggerRule[] }>('/api/notifications/triggers', fetcher);
  const { trigger, isMutating } = useSWRMutation('/api/notifications/triggers', patchFetcher);
  const toggleTrigger = async (triggerId: string, active: boolean) => {
    await trigger({ triggerId, active });
    await mutate();
  };
  return { triggers: data?.items, loading: isLoading, updating: isMutating, error, toggleTrigger, refresh: mutate };
};
