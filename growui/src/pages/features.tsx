import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CalculateIcon from '@mui/icons-material/Calculate';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import SupportIcon from '@mui/icons-material/Support';

type PaletteColorKey = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error';

type IconType = typeof SearchIcon;

interface Feature {
  Icon: IconType;
  title: string;
  description: string;
  benefits: string[];
  paletteColor: PaletteColorKey;
}

const features: Feature[] = [
  {
    Icon: SearchIcon,
    title: 'Smart Fund Discovery',
    description: 'AI-powered search through thousands of mutual funds with advanced filtering and comparison tools.',
    benefits: ['Real-time NAV data', 'Risk analysis', 'Performance tracking'],
    paletteColor: 'primary',
  },
  {
    Icon: CalculateIcon,
    title: 'Advanced Calculators',
    description: 'Precise SIP, Lumpsum, and SWP calculators with historical data and future projections.',
    benefits: ['Historical accuracy', 'Future projections', 'Goal planning'],
    paletteColor: 'secondary',
  },
  {
    Icon: ShowChartIcon,
    title: 'Interactive Analytics',
    description: 'Beautiful charts and visualizations to understand fund performance and market trends.',
    benefits: ['Interactive charts', 'Custom timeframes', 'Export reports'],
    paletteColor: 'success',
  },
  {
    Icon: SecurityIcon,
    title: 'Portfolio Management',
    description: 'Create virtual portfolios, track watchlists, and monitor your investment performance.',
    benefits: ['Virtual portfolios', 'Watchlist tracking', 'Performance alerts'],
    paletteColor: 'info',
  },
  {
    Icon: SpeedIcon,
    title: 'Real-time Updates',
    description: 'Get live NAV updates and market data to make informed investment decisions.',
    benefits: ['Live data feeds', 'Instant notifications', 'Market alerts'],
    paletteColor: 'warning',
  },
  {
    Icon: SupportIcon,
    title: 'Expert Support',
    description: '24/7 customer support and educational resources to help you succeed.',
    benefits: ['Expert guidance', 'Learning resources', 'Community forum'],
    paletteColor: 'error',
  },
];

export default function FeaturesPage() {
  const theme = useTheme();

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
                label="🚀 Powerful Features"
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
                Everything You Need for Smart Investing
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
                Discover, analyze, and invest in mutual funds with our comprehensive suite of professional-grade tools.
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Features Grid */}
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, md: 3 } }}>
          <Grid container spacing={4}>
            {features.map((feature, index) => {
              const paletteEntry = theme.palette[feature.paletteColor];
              const paletteColor = paletteEntry?.main ?? theme.palette.primary.main;

              return (
                <Grid item xs={12} md={6} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      p: 3,
                      borderRadius: 4,
                      transition: 'all 0.3s ease',
                      border: '1px solid',
                      borderColor: 'rgba(0, 0, 0, 0.08)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                        borderColor: paletteColor,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                        <Box sx={{ mr: 3, color: paletteColor }}>
                          <feature.Icon sx={{ fontSize: 48, color: paletteColor }} />
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                            {feature.title}
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.7 }}>
                            {feature.description}
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            {feature.benefits.map((benefit, idx) => (
                              <Chip
                                key={idx}
                                label={benefit}
                                size="small"
                                variant="outlined"
                                sx={{
                                  fontSize: '0.8rem',
                                  color: paletteColor,
                                  borderColor: alpha(paletteColor, 0.3),
                                  bgcolor: alpha(paletteColor, 0.05),
                                }}
                              />
                            ))}
                          </Stack>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>

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
              Ready to Start Investing Smarter?
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
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
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
                Get Started Free
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 6,
                  py: 2.5,
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  borderRadius: 3,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderColor: 'white',
                    transform: 'translateY(-3px)',
                  },
                }}
              >
                View Demo
              </Button>
            </Stack>
          </Container>
        </Box>
      </Box>
  );
}
