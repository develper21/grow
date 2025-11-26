import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { OnboardingActions } from '@/components/onboarding/OnboardingActions';
import { PersonalInfoForm } from '@/components/onboarding/PersonalInfoForm';
import { onboardingSteps } from '@/constants/onboardingSteps';
import { useOnboarding } from '@/context/OnboardingContext';
import { saveOnboarding } from '@/lib/onboardingApi';
import { useNotification } from '@/context/NotificationContext';
import { PersonalInfo } from '@/types/onboarding';

const stepIndex = onboardingSteps.findIndex((step) => step.id === 'personal-info');

export default function PersonalInfoPage() {
  const router = useRouter();
  const { state, setPersonalInfo } = useOnboarding();
  const { notify } = useNotification();
  const [formState, setFormState] = useState<PersonalInfo>(state.personalInfo);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormState(state.personalInfo);
  }, [state.personalInfo]);

  const isValid = useMemo(() => {
    const requiredFields: (keyof PersonalInfo)[] = ['fullName', 'pan', 'dateOfBirth', 'email', 'phone', 'addressLine1', 'city', 'state', 'postalCode'];
    return requiredFields.every((field) => Boolean(formState[field]));
  }, [formState]);

  const goToNext = async () => {
    setPersonalInfo(formState);
    try {
      await saveOnboarding({ ...state, personalInfo: formState });
      notify('Personal information saved.', 'success');
      router.push(onboardingSteps[stepIndex + 1]?.path ?? onboardingSteps[stepIndex].path);
    } catch (error) {
      notify('Failed to save details. Please try again.', 'error');
    }
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const payload = { ...state, personalInfo: formState };
      setPersonalInfo(formState);
      await saveOnboarding(payload);
      notify('Draft saved.', 'success');
    } catch (error) {
      notify('Failed to save draft. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <OnboardingLayout
      activeStep={stepIndex}
      title="Personal Information"
      subtitle="We’re required to verify your identity before you start investing."
    >
      <PersonalInfoForm value={formState} onChange={setFormState} />
      <OnboardingActions
        showBack={false}
        onNext={goToNext}
        disableNext={!isValid}
        onSave={handleSaveDraft}
        loading={saving}
      />
    </OnboardingLayout>
  );
}
