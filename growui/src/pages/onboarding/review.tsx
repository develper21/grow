import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { OnboardingActions } from '@/components/onboarding/OnboardingActions';
import { onboardingSteps } from '@/constants/onboardingSteps';
import { useOnboarding } from '@/context/OnboardingContext';
import { SidebarTips } from '@/components/onboarding/SidebarTips';
import { StatusBanner } from '@/components/onboarding/StatusBanner';
import { useNotification } from '@/context/NotificationContext';
import { saveOnboarding, submitOnboarding } from '@/lib/onboardingApi';

const stepIndex = onboardingSteps.findIndex((step) => step.id === 'review');

export default function ReviewPage() {
  const router = useRouter();
  const { state, setConsent, setStatus } = useOnboarding();
  const { notify } = useNotification();
  const [consentChecked, setConsentChecked] = useState(state.consentsAccepted);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setConsentChecked(state.consentsAccepted);
  }, [state.consentsAccepted]);

  const navigateTo = (path: string) => router.push(path);

  const handleBack = () => {
    router.push(onboardingSteps[stepIndex - 1].path);
  };

  const handleSave = async () => {
    try {
      await saveOnboarding({ ...state, consentsAccepted: consentChecked });
      notify('Draft saved successfully.', 'success');
    } catch (error) {
      notify('Failed to save draft. Please try again.', 'error');
    }
  };

  const handleSubmit = async () => {
    if (!consentChecked) {
      notify('Please accept the e-sign consent to continue.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      setConsent(consentChecked);
      await submitOnboarding({ ...state, consentsAccepted: true, status: 'submitted' });
      setStatus({ status: 'submitted' });
      notify('Your onboarding application has been submitted!', 'success');
    } catch (error) {
      notify('Submission failed. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const renderSection = (title: string, rows: Array<{ label: string; value: string }>, editPath?: string) => (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight={700}>
            {title}
          </Typography>
          {editPath && (
            <Button size="small" onClick={() => navigateTo(editPath)}>
              Edit
            </Button>
          )}
        </Stack>
        <Stack spacing={1.5}>
          {rows.map((row) => (
            <Box key={row.label}>
              <Typography variant="caption" color="text.secondary">
                {row.label}
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {row.value || '—'}
              </Typography>
              <Divider sx={{ mt: 1 }} />
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <OnboardingLayout
      activeStep={stepIndex}
      title="Review & Submit"
      subtitle="Confirm your details and e-sign consent to finish onboarding."
      sidebar={<SidebarTips tips={["Double-check details before submitting", "You can edit any section using the buttons"]} />}
      statusBanner={<StatusBanner status={state.status} updatedAt={state.updatedAt} />}
    >
      <Stack spacing={3}>
        {renderSection('Personal Information', [
          { label: 'Full Name', value: state.personalInfo.fullName },
          { label: 'PAN', value: state.personalInfo.pan },
          { label: 'Date of Birth', value: state.personalInfo.dateOfBirth },
          { label: 'Email', value: state.personalInfo.email },
          { label: 'Phone', value: state.personalInfo.phone },
          { label: 'Address', value: `${state.personalInfo.addressLine1} ${state.personalInfo.addressLine2}`.trim() },
        ], onboardingSteps[0].path)}

        {renderSection('KYC Document', [
          { label: 'Document Type', value: state.documents.documentType.toUpperCase() || '—' },
          { label: 'Document Number', value: state.documents.documentNumber },
          { label: 'Verification Status', value: state.documents.verificationStatus },
        ], onboardingSteps[1].path)}

        {renderSection('Bank Details', [
          { label: 'Account Holder', value: state.bankDetails.accountHolderName },
          { label: 'Account Number', value: state.bankDetails.accountNumber },
          { label: 'IFSC', value: state.bankDetails.ifsc },
          { label: 'Bank Name', value: state.bankDetails.bankName },
          { label: 'Verification Status', value: state.bankDetails.verificationStatus },
        ], onboardingSteps[2].path)}

        {renderSection('Risk Profile', [
          { label: 'Profile Type', value: state.riskProfile.profile },
          { label: 'Score', value: String(state.riskProfile.overallScore) },
        ], onboardingSteps[3].path)}

        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              E-sign Consent
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              I confirm that the information provided is accurate and authorize Grow to use it for regulatory compliance and investment onboarding.
            </Typography>
            <FormControlLabel
              control={<Checkbox checked={consentChecked} onChange={(event) => setConsentChecked(event.target.checked)} />}
              label="I agree to the terms and provide my e-sign consent"
            />
          </CardContent>
        </Card>
      </Stack>

      <OnboardingActions
        onBack={handleBack}
        onNext={handleSubmit}
        disableNext={!consentChecked || submitting}
        onSave={handleSave}
        nextLabel={submitting ? 'Submitting...' : 'Submit Application'}
      />
    </OnboardingLayout>
  );
}
