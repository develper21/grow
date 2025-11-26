import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Chip, Typography } from '@mui/material';
import { DocumentsForm } from '@/components/onboarding/DocumentsForm';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { OnboardingActions } from '@/components/onboarding/OnboardingActions';
import { onboardingSteps } from '@/constants/onboardingSteps';
import { useOnboarding } from '@/context/OnboardingContext';
import { DocumentInfo } from '@/types/onboarding';
import { SidebarTips } from '@/components/onboarding/SidebarTips';
import { StatusBanner } from '@/components/onboarding/StatusBanner';
import { runDocumentOcr, saveOnboarding } from '@/lib/onboardingApi';
import { useNotification } from '@/context/NotificationContext';

const stepIndex = onboardingSteps.findIndex((step) => step.id === 'kyc-docs');

export default function KycDocsPage() {
  const router = useRouter();
  const { state, setDocuments } = useOnboarding();
  const { notify } = useNotification();
  const [formState, setFormState] = useState<DocumentInfo>(state.documents);
  const [loading, setLoading] = useState(false);
  const [ocrProcessing, setOcrProcessing] = useState(false);

  useEffect(() => {
    setFormState(state.documents);
  }, [state.documents]);

  const isValid = Boolean(formState.documentType && formState.documentNumber && formState.fileName);

  const navigateTo = (index: number) => router.push(onboardingSteps[index].path);

  const persistDocuments = async (successMessage?: string) => {
    const payload = { ...state, documents: formState };
    setDocuments(formState);
    await saveOnboarding(payload);
    if (successMessage) {
      notify(successMessage, 'success');
    }
  };

  const handleRunOcr = async () => {
    if (!formState.fileName) {
      notify('Upload your document before running OCR.', 'warning');
      return;
    }

    if (ocrProcessing) {
      return;
    }

    setOcrProcessing(true);
    try {
      const ocrPayload = {
        documentType: formState.documentType,
        documentNumber: formState.documentNumber,
        fileName: formState.fileName,
        previewDataUrl: formState.previewDataUrl,
      };
      const ocrResult = await runDocumentOcr(ocrPayload);
      const updated = {
        ...formState,
        ...ocrResult,
      };
      setFormState(updated);
      setDocuments(updated);
      if (ocrResult.verificationStatus === 'verified') {
        notify('Document auto-verified via OCR.', 'success');
      } else {
        notify('OCR completed. Please review extracted details.', 'info');
      }
    } catch (error) {
      notify('OCR failed. Please try again.', 'error');
    } finally {
      setOcrProcessing(false);
    }
  };

  const handleNext = async () => {
    setLoading(true);
    try {
      await persistDocuments('KYC documents saved.');
      navigateTo(stepIndex + 1);
    } catch (error) {
      notify('Failed to save documents. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = async () => {
    setLoading(true);
    try {
      await persistDocuments();
      navigateTo(stepIndex - 1);
    } catch (error) {
      notify('Failed to save documents. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await persistDocuments('Draft saved.');
    } catch (error) {
      notify('Failed to save draft. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingLayout
      activeStep={stepIndex}
      title="Verify Your Identity"
      subtitle="Upload one valid government ID so we can complete your KYC in minutes."
      sidebar={<SidebarTips tips={["Use a clear photo or PDF of your ID", "Ensure details match your PAN and bank info"]} />}
      statusBanner={<StatusBanner status={state.status} updatedAt={state.updatedAt} />}
    >
      <Box mb={2} display="flex" alignItems="center" gap={1}>
        <Chip
          label={`Verification: ${formState.verificationStatus}`}
          color={formState.verificationStatus === 'verified' ? 'success' : 'warning'}
          variant="outlined"
        />
        <Typography variant="body2" color="text.secondary">
          {formState.verificationStatus === 'verified'
            ? 'Your document is verified.'
            : 'Run the OCR check to auto-verify your document.'}
        </Typography>
      </Box>
      <DocumentsForm value={formState} onChange={setFormState} />
      <Box mt={2}>
        <Button variant="outlined" onClick={handleRunOcr} disabled={ocrProcessing || formState.verificationStatus === 'verified'}>
          {formState.verificationStatus === 'verified'
            ? 'Document Verified'
            : ocrProcessing
            ? 'Running OCR...'
            : 'Run OCR Check'}
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
