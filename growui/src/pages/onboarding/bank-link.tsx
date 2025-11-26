import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Chip, Typography } from '@mui/material';
import { BankDetailsForm } from '@/components/onboarding/BankDetailsForm';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { OnboardingActions } from '@/components/onboarding/OnboardingActions';
import { onboardingSteps } from '@/constants/onboardingSteps';
import { useOnboarding } from '@/context/OnboardingContext';
import { BankDetails } from '@/types/onboarding';
import { SidebarTips } from '@/components/onboarding/SidebarTips';
import { StatusBanner } from '@/components/onboarding/StatusBanner';
import { saveOnboarding } from '@/lib/onboardingApi';
import { useNotification } from '@/context/NotificationContext';

const stepIndex = onboardingSteps.findIndex((step) => step.id === 'bank-link');

export default function BankLinkPage() {
  const router = useRouter();
  const { state, setBankDetails } = useOnboarding();
  const { notify } = useNotification();
  const [formState, setFormState] = useState<BankDetails>(state.bankDetails);
  const [verifying, setVerifying] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormState(state.bankDetails);
  }, [state.bankDetails]);

  const navigateTo = (index: number) => router.push(onboardingSteps[index].path);

  const persistBankDetails = async (successMessage?: string) => {
    const payload = { ...state, bankDetails: formState };
    setBankDetails(formState);
    await saveOnboarding(payload);
    if (successMessage) {
      notify(successMessage, 'success');
    }
  };

  const handleBack = async () => {
    setLoading(true);
    try {
      await persistBankDetails();
      navigateTo(stepIndex - 1);
    } catch (error) {
      notify('Failed to save bank details. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    setLoading(true);
    try {
      await persistBankDetails('Bank details saved.');
      navigateTo(stepIndex + 1);
    } catch (error) {
      notify('Failed to save bank details. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await persistBankDetails('Draft saved.');
    } catch (error) {
      notify('Failed to save draft. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAccount = async () => {
    if (formState.verificationStatus === 'verified') return;
    setVerifying(true);
    setTimeout(() => {
      setFormState((prev) => ({ ...prev, verificationStatus: 'verified' }));
      setVerifying(false);
    }, 2000);
  };

  const isValid = Boolean(
    formState.accountHolderName &&
    formState.accountNumber &&
    formState.ifsc &&
    formState.bankName &&
    formState.verificationStatus === 'verified'
  );

  const verificationChipColor = formState.verificationStatus === 'verified' ? 'success' : 'warning';

  return (
    <OnboardingLayout
      activeStep={stepIndex}
      title="Link Your Bank Account"
      subtitle="We send withdrawals and investment proceeds to this verified account."
      sidebar={<SidebarTips tips={["Use a bank account in your name", "IFSC should match the branch shown in your passbook"]} />}
      statusBanner={<StatusBanner status={state.status} updatedAt={state.updatedAt} />}
    >
      <Box mb={2} display="flex" alignItems="center" gap={1}>
        <Chip label={`Status: ${formState.verificationStatus}`} color={verificationChipColor as any} variant="outlined" />
        {formState.verificationStatus !== 'verified' && (
          <Typography variant="body2" color="text.secondary">
            Complete a quick micro-deposit check to verify ownership.
          </Typography>
        )}
      </Box>
      <BankDetailsForm value={formState} onChange={setFormState} />
      <Box mt={3}>
        <Button variant="outlined" onClick={handleVerifyAccount} disabled={verifying || formState.verificationStatus === 'verified'}>
          {formState.verificationStatus === 'verified' ? 'Account Verified' : verifying ? 'Verifying...' : 'Verify Account'}
        </Button>
      </Box>
      <OnboardingActions
        onBack={handleBack}
        onNext={handleNext}
        disableNext={!isValid}
        onSave={handleSave}
        loading={loading}
      />
    </OnboardingLayout>
  );
}
