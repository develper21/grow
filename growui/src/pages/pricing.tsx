import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Stack,
  Chip,
  Switch,
  FormControlLabel,
  useTheme,
  alpha,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const pricingPlans = [
  {
    name: 'Free',
    price: '₹0',
    period: '/month',
    description: 'Perfect for getting started with mutual fund research',
    features: [
      { text: 'Access to 100+ funds', included: true },
      { text: 'Basic SIP calculator', included: true },
      { text: 'Lumpsum calculator', included: true },
      { text: 'Basic charts', included: true },
      { text: 'Community support', included: true },
      { text: 'Advanced analytics', included: false },
      { text: 'Priority support', included: false },
      { text: 'Custom alerts', included: false },
    ],
    buttonText: 'Get Started Free',
    popular: false,
  },
  {
    name: 'Pro',
    price: '₹499',
    period: '/month',
    description: 'Advanced tools for serious investors',
    features: [
      { text: 'Access to all 7000+ funds', included: true },
      { text: 'Advanced SIP calculator', included: true },
      { text: 'SWP calculator', included: true },
      { text: 'Advanced charts & analytics', included: true },
      { text: 'Virtual portfolio', included: true },
      { text: 'Watchlist with alerts', included: true },
      { text: 'Priority email support', included: true },
      { text: 'Custom investment reports', included: false },
    ],
    buttonText: 'Start Pro Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '₹1999',
    period: '/month',
    description: 'Complete solution for financial advisors and institutions',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Custom investment reports', included: true },
      { text: 'API access', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'White-label solutions', included: true },
      { text: 'Advanced risk analysis', included: true },
      { text: 'Bulk portfolio analysis', included: true },
      { text: '24/7 phone support', included: true },
    ],
    buttonText: 'Contact Sales',
    popular: false,
  },
];

export default function PricingPage() {
  const theme = useTheme();
  const [isAnnual, setIsAnnual] = useState(false);

  const getPrice = (basePrice: string) => {
    if (basePrice === '₹0') return '₹0';
    const price = parseInt(basePrice.replace('₹', ''));
    return isAnnual ? `₹${Math.floor(price * 0.8)}` : basePrice;
  };

  const getPeriod = () => {
    return isAnnual ? '/year' : '/month';
  };

  return (
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            py: { xs: 8, md: 12 },
            px: 2,
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center' }}>
              <Chip
                label="💰 Simple, Transparent Pricing"
                sx={{
                  mb: 3,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  px: 2,
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 800,
                  mb: 3,
                  lineHeight: 1.1,
                }}
              >
                Choose Your Investment Journey
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  mb: 4,
                  opacity: 0.95,
                  maxWidth: 600,
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
                Start free and upgrade as your investment needs grow
              </Typography>

              {/* Billing Toggle */}
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 4 }}>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Monthly
                </Typography>
                <Switch
                  checked={isAnnual}
                  onChange={(e) => setIsAnnual(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: 'white',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: 'rgba(255,255,255,0.3)',
                    },
                  }}
                />
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Annual
                </Typography>
                <Chip
                  label="Save 20%"
                  size="small"
                  sx={{
                    bgcolor: 'success.main',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Pricing Cards */}
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, md: 3 } }}>
          <Grid container spacing={4} justifyContent="center">
            {pricingPlans.map((plan, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 4,
                    position: 'relative',
                    border: plan.popular ? `2px solid ${theme.palette.primary.main}` : '1px solid rgba(0, 0, 0, 0.08)',
                    transform: plan.popular ? 'scale(1.05)' : 'none',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  {plan.popular && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bgcolor: 'primary.main',
                        color: 'white',
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                      }}
                    >
                      Most Popular
                    </Box>
                  )}

                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
                      {plan.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                      {plan.description}
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main', display: 'inline' }}>
                        {getPrice(plan.price)}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary', display: 'inline' }}>
                        {getPeriod()}
                      </Typography>
                    </Box>

                    <Button
                      variant={plan.popular ? 'contained' : 'outlined'}
                      fullWidth
                      size="large"
                      sx={{
                        mb: 3,
                        py: 1.5,
                        borderRadius: 2,
                        fontSize: '1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        ...(plan.popular && {
                          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                          '&:hover': {
                            boxShadow: '0 6px 16px rgba(37, 99, 235, 0.4)',
                          },
                        }),
                      }}
                    >
                      {plan.buttonText}
                    </Button>

                    <Stack spacing={2}>
                      {plan.features.map((feature, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {feature.included ? (
                            <CheckIcon sx={{ color: 'success.main', fontSize: 20 }} />
                          ) : (
                            <CloseIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                          )}
                          <Typography
                            variant="body2"
                            sx={{
                              color: feature.included ? 'text.primary' : 'text.secondary',
                              textAlign: 'left',
                              fontSize: '0.9rem',
                            }}
                          >
                            {feature.text}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* FAQ Section */}
        <Box sx={{ backgroundColor: 'grey.50', py: { xs: 8, md: 12 }, px: 2 }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                Frequently Asked Questions
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
                Everything you need to know about our pricing and features
              </Typography>
            </Box>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 3, mb: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Can I change my plan anytime?
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 3, mb: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Is there a free trial?
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Yes! All plans come with a 14-day free trial. No credit card required to get started.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 3, mb: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      What payment methods do you accept?
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      We accept all major credit cards, UPI, and bank transfers. All payments are processed securely.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 3, mb: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Do you offer refunds?
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Yes, we offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            py: { xs: 8, md: 12 },
            px: 2,
            textAlign: 'center',
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              Ready to Start Your Investment Journey?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 6,
                opacity: 0.95,
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.6,
                fontSize: { xs: '1.1rem', md: '1.3rem' }
              }}
            >
              Join thousands of investors who trust Grow for their mutual fund research and investment decisions.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => window.location.href = '/signup'}
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                px: 6,
                py: 2.5,
                fontSize: '1.2rem',
                fontWeight: 700,
                borderRadius: 3,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                },
              }}
            >
              Start Free Trial
            </Button>
          </Container>
        </Box>
      </Box>
  );
}
