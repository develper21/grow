import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Chip, Typography } from '@mui/material';
import { RiskProfileForm } from '@/components/onboarding/RiskProfileForm';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { OnboardingActions } from '@/components/onboarding/OnboardingActions';
import { onboardingSteps } from '@/constants/onboardingSteps';
import { useOnboarding } from '@/context/OnboardingContext';
import { RiskProfile } from '@/types/onboarding';
import { SidebarTips } from '@/components/onboarding/SidebarTips';
import { StatusBanner } from '@/components/onboarding/StatusBanner';
import { useNotification } from '@/context/NotificationContext';
import { saveOnboarding } from '@/lib/onboardingApi';

const stepIndex = onboardingSteps.findIndex((step) => step.id === 'risk-profile');

export default function RiskProfilePage() {
  const router = useRouter();
  const { state, setRiskProfile } = useOnboarding();
  const { notify } = useNotification();
  const [profileState, setProfileState] = useState<RiskProfile>(state.riskProfile);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setProfileState(state.riskProfile);
  }, [state.riskProfile]);

  const navigateTo = (index: number) => router.push(onboardingSteps[index].path);

  const persistRiskProfile = async (successMessage?: string) => {
    const payload = { ...state, riskProfile: profileState };
    setRiskProfile(profileState);
    await saveOnboarding(payload);
    if (successMessage) {
      notify(successMessage, 'success');
    }
  };

  const handleBack = async () => {
    setLoading(true);
    try {
      await persistRiskProfile();
      navigateTo(stepIndex - 1);
    } catch (error) {
      notify('Failed to save risk profile. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    setLoading(true);
    try {
      await persistRiskProfile('Risk profile saved.');
      navigateTo(stepIndex + 1);
    } catch (error) {
      notify('Failed to save risk profile. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await persistRiskProfile('Draft saved.');
    } catch (error) {
      notify('Failed to save draft. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const completedQuestions = profileState.responses.length;
  const totalQuestions = 3;
  const canProceed = completedQuestions === totalQuestions;

  return (
    <OnboardingLayout
      activeStep={stepIndex}
      title="Understand Your Investment Style"
      subtitle="We tailor recommendations based on your risk appetite."
      sidebar={<SidebarTips tips={["Answer honestly to receive the right guidance", "You can always revisit these choices later"]} />}
      statusBanner={<StatusBanner status={state.status} updatedAt={state.updatedAt} />}
    >
      <Box mb={3} display="flex" alignItems="center" gap={1}>
        <Chip label={`Questions answered: ${completedQuestions}/${totalQuestions}`} color={canProceed ? 'success' : 'warning'} variant="outlined" />
        <Typography variant="body2" color="text.secondary">
          Profile detected: {profileState.profile.charAt(0).toUpperCase() + profileState.profile.slice(1)}
        </Typography>
      </Box>
      <RiskProfileForm value={profileState} onChange={setProfileState} />
      <OnboardingActions
        onBack={handleBack}
        onNext={handleNext}
        disableNext={!canProceed}
        onSave={handleSave}
        loading={loading}
      />
    </OnboardingLayout>
  );
}
