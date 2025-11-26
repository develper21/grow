import { OnboardingPayload, OnboardingStatus, createDefaultOnboardingPayload } from '@/types/onboarding';

let onboardingStore: OnboardingPayload = createDefaultOnboardingPayload();
let statusTimer: NodeJS.Timeout | null = null;

export const getOnboardingStore = () => onboardingStore;

export const saveOnboardingStore = (payload: OnboardingPayload) => {
  onboardingStore = {
    ...payload,
    updatedAt: new Date().toISOString(),
  };
  return onboardingStore;
};

export const updateOnboardingStatus = (status: OnboardingStatus, message?: string) => {
  onboardingStore = {
    ...onboardingStore,
    status,
    statusMessage: message ?? onboardingStore.statusMessage,
    updatedAt: new Date().toISOString(),
  };
  return onboardingStore;
};

export const scheduleAutoDecision = () => {
  if (statusTimer) {
    clearTimeout(statusTimer);
  }
  statusTimer = setTimeout(() => {
    const nextStatus: OnboardingStatus = Math.random() > 0.15 ? 'approved' : 'rejected';
    const message =
      nextStatus === 'approved'
        ? 'Compliance approved your application.'
        : 'Certain details could not be verified. Please review and submit again.';
    updateOnboardingStatus(nextStatus, message);
    statusTimer = null;
  }, 4500);
};
