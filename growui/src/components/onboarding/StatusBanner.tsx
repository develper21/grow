import React from 'react';
import { Alert, AlertTitle, Box, Chip } from '@mui/material';
import { OnboardingStatus } from '@/types/onboarding';

type StatusBannerProps = {
  status: OnboardingStatus;
  updatedAt: string;
};

const STATUS_COPY: Record<OnboardingStatus, { title: string; description: string; color: 'info' | 'success' | 'warning' | 'error' }> = {
  draft: {
    title: 'Onboarding in Progress',
    description: 'Complete the remaining steps to start investing.',
    color: 'info',
  },
  pending: {
    title: 'Submitted for Verification',
    description: 'Our compliance team is reviewing your application. You will receive an update shortly.',
    color: 'warning',
  },
  submitted: {
    title: 'Submission Received',
    description: 'We are validating your details before the compliance review begins.',
    color: 'info',
  },
  approved: {
    title: 'Onboarding Approved',
    description: 'You can now explore funds and start investing on Grow.',
    color: 'success',
  },
  rejected: {
    title: 'Action Required',
    description: 'We could not approve your onboarding details. Please review the highlighted sections and resubmit.',
    color: 'error',
  },
};

export const StatusBanner = ({ status, updatedAt }: StatusBannerProps) => {
  const content = STATUS_COPY[status];
  return (
    <Alert severity={content.color} variant="outlined" icon={false} sx={{ borderRadius: 3 }}>
      <AlertTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {content.title}
        <Chip size="small" label={status.toUpperCase()} color={content.color} variant="outlined" />
      </AlertTitle>
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={1}>
        <span>{content.description}</span>
        <span style={{ fontSize: '0.85rem', color: 'rgba(0,0,0,0.6)' }}>Last updated: {new Date(updatedAt).toLocaleString()}</span>
      </Box>
    </Alert>
  );
};
