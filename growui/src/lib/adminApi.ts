import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import {
  ActivityLogEntry,
  AdminUser,
  AlertWorkflow,
  FeatureFlag,
  ModerationCase,
  RoleDefinition,
  UserRole,
} from '@/types/admin';

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

export const useAdminUsers = () => {
  const { data, error, isLoading, mutate } = useSWR<{ items: AdminUser[] }>('/api/admin/users', fetcher);
  const { trigger, isMutating } = useSWRMutation('/api/admin/users', patchFetcher);
  const updateUser = async (userId: string, role?: UserRole, status?: 'active' | 'suspended') => {
    await trigger({ userId, role, status });
    await mutate();
  };
  return { users: data?.items, loading: isLoading, updating: isMutating, error, updateUser, refresh: mutate };
};

export const useRoleDefinitions = () => {
  const { data, error, isLoading } = useSWR<{ items: RoleDefinition[] }>('/api/admin/roles', fetcher);
  return { roles: data?.items, loading: isLoading, error };
};

export const useFeatureFlags = () => {
  const { data, error, isLoading, mutate } = useSWR<{ items: FeatureFlag[] }>('/api/admin/feature-flags', fetcher);
  const { trigger, isMutating } = useSWRMutation('/api/admin/feature-flags', patchFetcher);
  const toggle = async (key: string, enabled: boolean) => {
    await trigger({ key, enabled });
    await mutate();
  };
  return { flags: data?.items, loading: isLoading, toggling: isMutating, error, toggle, refresh: mutate };
};

export const useModerationCases = () => {
  const { data, error, isLoading, mutate } = useSWR<{ items: ModerationCase[] }>('/api/admin/moderation', fetcher);
  const { trigger, isMutating } = useSWRMutation('/api/admin/moderation', patchFetcher);
  const updateStatus = async (caseId: string, status: ModerationCase['status']) => {
    await trigger({ caseId, status });
    await mutate();
  };
  return { cases: data?.items, loading: isLoading, updating: isMutating, error, updateStatus, refresh: mutate };
};

export const useActivityLogs = () => {
  const { data, error, isLoading, mutate } = useSWR<{ items: ActivityLogEntry[] }>('/api/admin/activity-logs', fetcher);
  return { logs: data?.items, loading: isLoading, error, refresh: mutate };
};

export const useAlertWorkflows = () => {
  const { data, error, isLoading } = useSWR<{ items: AlertWorkflow[] }>('/api/admin/alerts', fetcher);
  return { alerts: data?.items, loading: isLoading, error };
};
