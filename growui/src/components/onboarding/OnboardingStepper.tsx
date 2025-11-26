import React from 'react';
import { Box, Stepper, Step, StepLabel, Typography } from '@mui/material';

export interface StepDefinition {
  id: string;
  label: string;
  description: string;
  path: string;
}

interface OnboardingStepperProps {
  steps: StepDefinition[];
  activeStep: number;
}

export const OnboardingStepper = ({ steps, activeStep }: OnboardingStepperProps) => {
  return (
    <Box sx={{ position: 'sticky', top: 24 }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        ONBOARDING PROGRESS
      </Typography>
      <Stepper orientation="vertical" activeStep={activeStep} sx={{ backgroundColor: 'transparent' }}>
        {steps.map((step) => (
          <Step key={step.id}>
            <StepLabel>
              <Typography variant="subtitle1" fontWeight={600}>
                {step.label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {step.description}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};
