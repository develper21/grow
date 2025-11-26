import Link from 'next/link';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { onboardingSteps } from '@/constants/onboardingSteps';

const heroPerks = [
  'Paperless verification in under 10 minutes',
  'Secure document handling with audit trails',
  'Save progress anytime and continue later',
];

export default function OnboardingIndexPage() {
  const firstStepPath = onboardingSteps[0].path;

  return (
    <Box sx={{ background: 'linear-gradient(180deg, #F9FAFB 0%, #FFFFFF 100%)', minHeight: '100vh', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Chip icon={<VerifiedUserIcon />} label="Investor Onboarding" color="primary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
              <Typography variant="h3" fontWeight={800} lineHeight={1.2}>
                Open your Grow investing account in a few guided steps.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                We combine regulatory compliance with a slick experience. Verify your identity, link your bank, understand your risk profile, and sign digitally—all within one secure flow.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={2}>
                <Button
                  component={Link}
                  href={firstStepPath}
                  size="large"
                  variant="contained"
                  startIcon={<RocketLaunchIcon />}
                >
                  Start investing
                </Button>
                <Button component={Link} href="/learn/kyc" size="large" variant="text">
                  See requirements
                </Button>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ borderRadius: 4 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="overline" color="text.secondary">
                  What to expect
                </Typography>
                <Stack spacing={2} mt={2}>
                  {heroPerks.map((perk) => (
                    <Stack key={perk} direction="row" spacing={1.5} alignItems="center">
                      <Chip label="Step" color="primary" size="small" variant="outlined" />
                      <Typography variant="body1">{perk}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box mt={8}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Onboarding roadmap
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Every step autosaves to your secure onboarding draft. You can revisit any section using the wizard navigation.
          </Typography>
          <Grid container spacing={3}>
            {onboardingSteps.map((step, index) => (
              <Grid item xs={12} sm={6} md={4} key={step.id}>
                <Card variant="outlined" sx={{ height: '100%', borderRadius: 3 }}>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                      <Chip label={`Step ${index + 1}`} size="small" color="primary" variant="outlined" />
                      <Button component={Link} href={step.path} size="small">
                        Jump
                      </Button>
                    </Stack>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      {step.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {step.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
