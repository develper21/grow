import React from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  Chip,
  useTheme,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CalculateIcon from '@mui/icons-material/Calculate';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import StarIcon from '@mui/icons-material/Star';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import SupportIcon from '@mui/icons-material/Support';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const theme = useTheme();

  const features = [
    {
      icon: <SearchIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Smart Fund Discovery',
      description: 'AI-powered search through thousands of mutual funds with advanced filtering and comparison tools.',
      benefits: ['Real-time NAV data', 'Risk analysis', 'Performance tracking']
    },
    {
      icon: <CalculateIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Advanced Calculators',
      description: 'Precise SIP, Lumpsum, and SWP calculators with historical data and future projections.',
      benefits: ['Historical accuracy', 'Future projections', 'Goal planning']
    },
    {
      icon: <ShowChartIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Interactive Analytics',
      description: 'Beautiful charts and visualizations to understand fund performance and market trends.',
      benefits: ['Interactive charts', 'Custom timeframes', 'Export reports']
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Portfolio Management',
      description: 'Create virtual portfolios, track watchlists, and monitor your investment performance.',
      benefits: ['Virtual portfolios', 'Watchlist tracking', 'Performance alerts']
    },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Software Engineer',
      content: 'Grow helped me understand mutual funds better. The calculators are incredibly accurate and the interface is so intuitive.',
      rating: 5,
      avatar: 'PS'
    },
    {
      name: 'Rajesh Kumar',
      role: 'Business Owner',
      content: 'As a busy entrepreneur, I needed something simple yet powerful. Grow delivers exactly that with real-time data.',
      rating: 5,
      avatar: 'RK'
    },
    {
      name: 'Anita Desai',
      role: 'Financial Advisor',
      content: 'I recommend Grow to all my clients. The analytics and research tools are professional-grade and very reliable.',
      rating: 5,
      avatar: 'AD'
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Mutual Funds' },
    { number: '50,000+', label: 'Active Users' },
    { number: '₹1,000Cr+', label: 'Assets Tracked' },
    { number: '99.9%', label: 'Uptime' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 12, md: 16 },
          px: 2,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box>
                <Chip
                  label="🚀 Trusted by 50,000+ Investors"
                  sx={{
                    mb: 3,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                />
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: 800,
                    mb: 3,
                    lineHeight: 1.1,
                  }}
                >
                  Smart Mutual Fund Investment Platform
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                    mb: 4,
                    opacity: 0.95,
                    lineHeight: 1.6,
                  }}
                >
                  Discover, analyze, and invest in mutual funds with AI-powered insights, real-time data, and professional-grade tools.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => router.push('/funds')}
                    sx={{
                      backgroundColor: 'white',
                      color: 'primary.main',
                      px: 4,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                      },
                    }}
                  >
                    Explore Funds
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      px: 4,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderColor: 'white',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    View Demo
                  </Button>
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -20,
                    left: -20,
                    right: -20,
                    bottom: -20,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                    borderRadius: 4,
                    blur: '20px',
                  }
                }}
              >
                <Box
                  component="img"
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f8fafc'/%3E%3Ctext x='200' y='150' text-anchor='middle' fill='%2364748b' font-family='Inter' font-size='18' font-weight='500'%3EGrow Dashboard%3C/text%3E%3C/svg%3E"
                  alt="Dashboard Preview"
                  sx={{
                    width: '100%',
                    borderRadius: 3,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {stats.map((stat, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 800,
                      color: 'primary.main',
                      mb: 1,
                      fontSize: { xs: '2rem', md: '3rem' }
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 500,
                      fontSize: { xs: '0.9rem', md: '1.1rem' }
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, px: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Powerful Features
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'text.secondary',
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Everything you need to make informed investment decisions
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    p: 3,
                    borderRadius: 4,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                      <Box sx={{ mr: 3 }}>
                        {feature.icon}
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
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
                                color: 'primary.main',
                                borderColor: 'primary.main'
                              }}
                            />
                          ))}
                        </Stack>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'grey.50', px: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
              What Our Users Say
            </Typography>
            <Typography variant="h5" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
              Join thousands of satisfied investors who trust Grow
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    p: 3,
                    textAlign: 'center',
                    borderRadius: 4,
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 20,
                      left: 20,
                      width: 40,
                      height: 40,
                      backgroundColor: 'primary.main',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }
                  }}
                >
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      bgcolor: 'primary.main',
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      mx: 'auto',
                      mb: 3
                    }}
                  >
                    {testimonial.avatar}
                  </Avatar>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} sx={{ color: '#fbbf24', fontSize: '1.2rem' }} />
                    ))}
                  </Box>
                  <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic', lineHeight: 1.7 }}>
                    &ldquo;{testimonial.content}&rdquo;
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {testimonial.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {testimonial.role}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 12, md: 16 },
          px: 2,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Ready to Start Your Investment Journey?
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 6,
              opacity: 0.95,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6,
              fontSize: { xs: '1.1rem', md: '1.3rem' }
            }}
          >
            Join 50,000+ investors who trust Grow for their mutual fund research and investment decisions.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/funds')}
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
              Schedule Demo
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
