import { StepDefinition } from '@/components/onboarding/OnboardingStepper';

export const onboardingSteps: StepDefinition[] = [
  {
    id: 'personal-info',
    label: 'Personal Information',
    description: 'Tell us about yourself and verify your PAN details.',
    path: '/onboarding/personal-info',
  },
  {
    id: 'kyc-docs',
    label: 'KYC Documents',
    description: 'Upload identity proof for verification.',
    path: '/onboarding/kyc-docs',
  },
  {
    id: 'bank-link',
    label: 'Bank Linking',
    description: 'Add and verify your primary bank account.',
    path: '/onboarding/bank-link',
  },
  {
    id: 'risk-profile',
    label: 'Risk Profiling',
    description: 'Help us understand your investment style.',
    path: '/onboarding/risk-profile',
  },
  {
    id: 'review',
    label: 'Review & Submit',
    description: 'Confirm details and submit your application.',
    path: '/onboarding/review',
  },
];
