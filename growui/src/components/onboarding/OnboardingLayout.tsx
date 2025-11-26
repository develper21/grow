import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { OnboardingStepper } from './OnboardingStepper';
import { onboardingSteps } from '@/constants/onboardingSteps';

interface OnboardingLayoutProps {
  activeStep: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  statusBanner?: React.ReactNode;
}

export const OnboardingLayout = ({ activeStep, title, subtitle, children, sidebar, statusBanner }: OnboardingLayoutProps) => {
  return (
    <Box sx={{ py: 6, px: { xs: 2, md: 6 }, backgroundColor: 'background.default' }}>
      {statusBanner && <Box mb={3}>{statusBanner}</Box>}
      <Grid container spacing={4}>
        <Grid item xs={12} md={4} lg={3}>
          <OnboardingStepper steps={onboardingSteps} activeStep={activeStep} />
          {sidebar && <Box mt={4}>{sidebar}</Box>}
        </Grid>
        <Grid item xs={12} md={8} lg={9}>
          <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
            <Box mb={3}>
              <Typography variant="overline" color="primary" fontWeight={700} letterSpacing={1}>
                STEP {activeStep + 1}
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                {title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                {subtitle}
              </Typography>
            </Box>
            {children}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
