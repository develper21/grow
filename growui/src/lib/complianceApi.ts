import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import {
  AuditArtifact,
  ConsentRecord,
  DisasterRecoveryTask,
  Regulator,
  RetentionPolicy,
} from '@/types/compliance';

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

export const useRetentionPolicies = () => {
  const { data, error, isLoading, mutate } = useSWR<{ items: RetentionPolicy[] }>('/api/compliance/policies', fetcher);
  const { trigger: triggerPatch, isMutating: updating } = useSWRMutation('/api/compliance/policies', patchFetcher);
  const { trigger: triggerPost, isMutating: creating } = useSWRMutation('/api/compliance/policies', postFetcher);

  const updatePolicy = async (policyId: string, retentionPeriodMonths: number, regulator?: Regulator) => {
    await triggerPatch({ policyId, retentionPeriodMonths, regulator });
    await mutate();
  };
  const createPolicy = async (payload: Omit<RetentionPolicy, 'id' | 'updatedAt'>) => {
    await triggerPost(payload);
    await mutate();
  };

  return {
    policies: data?.items,
    loading: isLoading,
    updating,
    creating,
    error,
    updatePolicy,
    createPolicy,
    refresh: mutate,
  };
};

export const useConsents = () => {
  const { data, error, isLoading, mutate } = useSWR<{ items: ConsentRecord[] }>('/api/compliance/consents', fetcher);
  const { trigger, isMutating } = useSWRMutation('/api/compliance/consents', patchFetcher);
  const updateConsent = async (consentId: string, status: ConsentRecord['status']) => {
    await trigger({ consentId, status });
    await mutate();
  };
  return { consents: data?.items, loading: isLoading, updating: isMutating, error, updateConsent, refresh: mutate };
};

export const useAuditArtifacts = () => {
  const { data, error, isLoading, mutate } = useSWR<{ items: AuditArtifact[] }>('/api/compliance/audit', fetcher);
  const { trigger, isMutating } = useSWRMutation('/api/compliance/audit', postFetcher);
  const regenerate = async (artifactId: string) => {
    await trigger({ artifactId });
    await mutate();
  };
  return { artifacts: data?.items, loading: isLoading, regenerating: isMutating, error, regenerate, refresh: mutate };
};

export const useDrTasks = () => {
  const { data, error, isLoading, mutate } = useSWR<{ items: DisasterRecoveryTask[] }>('/api/compliance/dr', fetcher);
  const { trigger, isMutating } = useSWRMutation('/api/compliance/dr', patchFetcher);
  const updateTask = async (taskId: string, status: DisasterRecoveryTask['status']) => {
    await trigger({ taskId, status });
    await mutate();
  };
  return { tasks: data?.items, loading: isLoading, updating: isMutating, error, updateTask, refresh: mutate };
};
