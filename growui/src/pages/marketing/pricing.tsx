import Head from 'next/head';
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
import CheckIcon from '@mui/icons-material/Check';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { usePricingPage } from '@/lib/marketingApi';

export default function PricingPage() {
  const { pricing, loading } = usePricingPage();

  return (
    <>
      <Head>
        <title>Pricing | Grow Marketing</title>
      </Head>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={1} mb={4} alignItems="center">
          <Typography variant="h3" fontWeight={700}>
            {pricing?.headline ?? 'Plans that scale with your team'}
          </Typography>
          <Typography variant="h6" color="text.secondary" textAlign="center">
            Bundle landing templates, experiment workflow and CRM-ready forms in one subscription.
          </Typography>
        </Stack>
        <Grid container spacing={3}>
          {pricing?.tiers.map((tier: NonNullable<typeof pricing>['tiers'][number]) => (
            <Grid item xs={12} md={4} key={tier.id}>
              <Card
                variant="outlined"
                sx={{ height: '100%', borderColor: tier.recommended ? 'primary.main' : undefined, position: 'relative' }}
              >
                {tier.recommended && (
                  <Chip label="Most popular" color="primary" size="small" sx={{ position: 'absolute', top: 16, right: 16 }} />
                )}
                <CardContent>
                  <Typography variant="h5" fontWeight={700}>
                    {tier.name}
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {tier.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tier.description}
                  </Typography>
                  <Stack spacing={1.5} mt={3}>
                    {tier.features.map((feature: string) => (
                      <Stack key={feature} direction="row" spacing={1} alignItems="center">
                        <CheckIcon color="success" fontSize="small" />
                        <Typography variant="body2">{feature}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                  <Button variant="contained" fullWidth sx={{ mt: 3 }}>
                    Get started
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {loading && !pricing && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography align="center" color="text.secondary">
                    Loading pricing…
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>

        <Stack spacing={2} mt={6}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <HelpOutlineIcon color="primary" />
            <Typography variant="h5">FAQs</Typography>
          </Stack>
          {pricing?.faqs.map((faq: NonNullable<typeof pricing>['faqs'][number], index: number) => (
            <Box key={`${faq.question}-${index}`}>
              <Typography variant="subtitle1" fontWeight={600}>
                {faq.question}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {faq.answer}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Container>
    </>
  );
}
