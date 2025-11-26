import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import {
  OnboardingPayload,
  PersonalInfo,
  DocumentInfo,
  BankDetails,
  RiskProfile,
  OnboardingStatus,
  createDefaultOnboardingPayload,
} from '@/types/onboarding';
import { fetchOnboarding } from '@/lib/onboardingApi';

interface OnboardingState extends OnboardingPayload {}

const defaultState: OnboardingState = createDefaultOnboardingPayload();

const enum ActionType {
  SET_PERSONAL = 'SET_PERSONAL',
  SET_DOCUMENTS = 'SET_DOCUMENTS',
  SET_BANK = 'SET_BANK',
  SET_RISK = 'SET_RISK',
  SET_CONSENT = 'SET_CONSENT',
  SET_STATUS = 'SET_STATUS',
  RESET = 'RESET',
  HYDRATE = 'HYDRATE',
}

type OnboardingAction =
  | { type: ActionType.SET_PERSONAL; payload: PersonalInfo }
  | { type: ActionType.SET_DOCUMENTS; payload: DocumentInfo }
  | { type: ActionType.SET_BANK; payload: BankDetails }
  | { type: ActionType.SET_RISK; payload: RiskProfile }
  | { type: ActionType.SET_CONSENT; payload: boolean }
  | { type: ActionType.SET_STATUS; payload: { status: OnboardingStatus; message?: string } }
  | { type: ActionType.RESET }
  | { type: ActionType.HYDRATE; payload: OnboardingPayload };

function reducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  switch (action.type) {
    case ActionType.SET_PERSONAL:
      return {
        ...state,
        personalInfo: action.payload,
        updatedAt: new Date().toISOString(),
      };
    case ActionType.SET_DOCUMENTS:
      return {
        ...state,
        documents: action.payload,
        updatedAt: new Date().toISOString(),
      };
    case ActionType.SET_BANK:
      return {
        ...state,
        bankDetails: action.payload,
        updatedAt: new Date().toISOString(),
      };
    case ActionType.SET_RISK:
      return {
        ...state,
        riskProfile: action.payload,
        updatedAt: new Date().toISOString(),
      };
    case ActionType.SET_CONSENT:
      return {
        ...state,
        consentsAccepted: action.payload,
        updatedAt: new Date().toISOString(),
      };
    case ActionType.SET_STATUS:
      return {
        ...state,
        status: action.payload.status,
        statusMessage: action.payload.message ?? state.statusMessage,
        updatedAt: new Date().toISOString(),
      };
    case ActionType.HYDRATE:
      return { ...action.payload };
    case ActionType.RESET:
      return { ...defaultState };
    default:
      return state;
  }
}

interface OnboardingContextValue {
  state: OnboardingState;
  setPersonalInfo: (payload: PersonalInfo) => void;
  setDocuments: (payload: DocumentInfo) => void;
  setBankDetails: (payload: BankDetails) => void;
  setRiskProfile: (payload: RiskProfile) => void;
  setConsent: (value: boolean) => void;
  setStatus: (value: { status: OnboardingStatus; message?: string }) => void;
  hydrate: (payload: OnboardingPayload) => void;
  reset: () => void;
}

const STORAGE_KEY = 'growui_onboarding_state';

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const [hydrated, setHydrated] = useState(false);
  const serverHydratedRef = useRef(false);

  const value = useMemo<OnboardingContextValue>(() => ({
    state,
    setPersonalInfo: (payload) => dispatch({ type: ActionType.SET_PERSONAL, payload }),
    setDocuments: (payload) => dispatch({ type: ActionType.SET_DOCUMENTS, payload }),
    setBankDetails: (payload) => dispatch({ type: ActionType.SET_BANK, payload }),
    setRiskProfile: (payload) => dispatch({ type: ActionType.SET_RISK, payload }),
    setConsent: (payload) => dispatch({ type: ActionType.SET_CONSENT, payload }),
    setStatus: (payload) => dispatch({ type: ActionType.SET_STATUS, payload }),
    hydrate: (payload) => dispatch({ type: ActionType.HYDRATE, payload }),
    reset: () => dispatch({ type: ActionType.RESET }),
  }), [state]);

  useEffect(() => {
    if (!hydrated) {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as OnboardingPayload;
          dispatch({ type: ActionType.HYDRATE, payload: parsed });
        } catch (error) {
          console.error('Failed to parse onboarding state from storage', error);
        }
      }
      setHydrated(true);
    }
  }, [hydrated]);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, hydrated]);

  useEffect(() => {
    if (!hydrated || serverHydratedRef.current) {
      return;
    }
    serverHydratedRef.current = true;

    const syncFromServer = async () => {
      try {
        const serverState = await fetchOnboarding();
        if (!serverState) {
          return;
        }
        const localUpdatedAt = new Date(state.updatedAt).getTime();
        const serverUpdatedAt = new Date(serverState.updatedAt).getTime();
        if (serverUpdatedAt > localUpdatedAt) {
          dispatch({ type: ActionType.HYDRATE, payload: serverState });
        }
      } catch (error) {
        console.warn('Failed to fetch onboarding draft from API', error);
      }
    };

    syncFromServer();
  }, [hydrated, state]);

  if (!hydrated) {
    return null;
  }

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};
