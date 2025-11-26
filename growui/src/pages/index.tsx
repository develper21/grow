import React, { useState, useEffect } from 'react';
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
  alpha,
  IconButton,
  Fade,
  Slide,
} from '@mui/material';
import {
  Search,
  TrendingUp,
  Assessment,
  Security,
  Speed,
  Analytics,
  AccountBalance,
  ShowChart,
  Star,
  ArrowForward,
  PlayArrow,
  CheckCircle,
  KeyboardArrowRight,
  Launch,
} from '@mui/icons-material';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Search sx={{ fontSize: 32 }} />,
      title: 'AI-Powered Fund Discovery',
      description: 'Advanced algorithms analyze thousands of mutual funds to find perfect matches for your investment goals.',
      benefits: ['Smart filtering', 'Risk assessment', 'Real-time alerts'],
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 32 }} />,
      title: 'Intelligent Analytics',
      description: 'Deep insights with predictive analytics and performance tracking powered by machine learning.',
      benefits: ['Predictive modeling', 'Performance insights', 'Risk analysis'],
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      icon: <Assessment sx={{ fontSize: 32 }} />,
      title: 'Advanced Calculators',
      description: 'Precision financial planning with sophisticated calculators that factor in market volatility and historical data.',
      benefits: ['Goal planning', 'Tax optimization', 'Retirement planning'],
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      icon: <Security sx={{ fontSize: 32 }} />,
      title: 'Bank-Level Security',
      description: 'Your financial data is protected with enterprise-grade security and encryption protocols.',
      benefits: ['256-bit encryption', 'Two-factor auth', 'Privacy first'],
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
    {
      icon: <Speed sx={{ fontSize: 32 }} />,
      title: 'Lightning Fast',
      description: 'Experience blazing-fast performance with real-time data updates and instant portfolio analysis.',
      benefits: ['Real-time data', 'Instant analysis', 'Mobile optimized'],
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
    {
      icon: <Analytics sx={{ fontSize: 32 }} />,
      title: 'Portfolio Intelligence',
      description: 'Smart portfolio management with automated rebalancing and optimization suggestions.',
      benefits: ['Auto-rebalance', 'Optimization', 'Performance tracking'],
      gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Senior Software Engineer',
      company: 'TechCorp',
      content: 'Grow transformed how I approach mutual fund investments. The AI recommendations are spot-on and the interface is incredibly intuitive.',
      rating: 5,
      avatar: 'PS',
      verified: true,
    },
    {
      name: 'Rajesh Kumar',
      role: 'CEO & Founder',
      company: 'StartupHub',
      content: 'As an entrepreneur, time is precious. Grow saves me hours of research with its powerful analytics and real-time insights.',
      rating: 5,
      avatar: 'RK',
      verified: true,
    },
    {
      name: 'Anita Desai',
      role: 'Investment Advisor',
      company: 'WealthWorks',
      content: 'I recommend Grow to all my clients. The professional-grade tools and comprehensive data make it indispensable for serious investors.',
      rating: 5,
      avatar: 'AD',
      verified: true,
    },
  ];

  const stats = [
    { number: '25,000+', label: 'Active Investors', prefix: '', suffix: '' },
    { number: '₹5,000Cr+', label: 'Assets Under Analysis', prefix: '', suffix: '' },
    { number: '12,000+', label: 'Mutual Funds', prefix: '', suffix: '' },
    { number: '99.95%', label: 'Platform Uptime', prefix: '', suffix: '' },
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: 'Free',
      features: ['Basic fund search', 'Simple calculators', 'Limited watchlist', 'Email support'],
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '₹299',
      period: '/month',
      features: ['Advanced analytics', 'Unlimited watchlists', 'AI recommendations', 'Priority support', 'Tax reports'],
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: ['Custom integrations', 'Dedicated support', 'White-label options', 'API access', 'Advanced compliance'],
      highlighted: false,
    },
  ];

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* Modern Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
          color: 'white',
          py: { xs: 10, md: 16 },
          px: 2,
          position: 'relative',
          overflow: 'hidden',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '10%',
            right: '10%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite',
          },
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in={isVisible} timeout={1000}>
                <Box>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                    <Chip
                      label="🚀 NEW"
                      sx={{
                        bgcolor: alpha('#22d3ee', 0.2),
                        color: '#22d3ee',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        border: '1px solid #22d3ee',
                      }}
                    />
                    <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                      Trusted by 25,000+ Smart Investors
                    </Typography>
                  </Stack>
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: '2.5rem', md: '4rem' },
                      fontWeight: 900,
                      mb: 3,
                      lineHeight: 1.1,
                      background: 'linear-gradient(135deg, #ffffff 0%, #22d3ee 50%, #a78bfa 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Invest Smarter with
                    <br />
                    <Box component="span" sx={{ color: '#22d3ee' }}> AI-Powered Insights</Box>
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: { xs: '1.1rem', md: '1.3rem' },
                      mb: 4,
                      color: alpha('#fff', 0.8),
                      lineHeight: 1.6,
                      fontWeight: 400,
                    }}
                  >
                    Discover perfect mutual funds with advanced AI analytics, real-time data, and professional-grade investment tools designed for modern investors.
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 6 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => router.push('/funds')}
                      endIcon={<Launch />}
                      sx={{
                        background: 'linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)',
                        color: 'white',
                        px: 4,
                        py: 2.5,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        borderRadius: 3,
                        boxShadow: '0 10px 30px rgba(34, 211, 238, 0.3)',
                        '&:hover': {
                          boxShadow: '0 15px 40px rgba(34, 211, 238, 0.4)',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      Start Investing Free
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<PlayArrow />}
                      sx={{
                        borderColor: alpha('#fff', 0.3),
                        color: 'white',
                        px: 4,
                        py: 2.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderRadius: 3,
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                          backgroundColor: alpha('#fff', 0.1),
                          borderColor: alpha('#fff', 0.5),
                        },
                      }}
                    >
                      Watch Demo
                    </Button>
                  </Stack>
                  <Stack direction="row" spacing={4} alignItems="center">
                    <Stack direction="row" spacing={1}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} sx={{ color: '#fbbf24', fontSize: '1.2rem' }} />
                      ))}
                    </Stack>
                    <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                      4.9/5 rating from 2,500+ reviews
                    </Typography>
                  </Stack>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Slide direction="left" in={isVisible} timeout={1500}>
                <Box
                  sx={{
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '-10%',
                      left: '-10%',
                      right: '-10%',
                      bottom: '-10%',
                      background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)',
                      borderRadius: 4,
                      filter: 'blur(40px)',
                      zIndex: 0,
                    },
                  }}
                >
                  <Box
                    component="img"
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 400'%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23667eea;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23764ba2;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='500' height='400' fill='url(%23grad1)' /%3E%3Ctext x='250' y='200' text-anchor='middle' fill='white' font-family='Inter' font-size='24' font-weight='700'%3EGrow Analytics Dashboard%3C/text%3E%3C/svg%3E"
                    alt="Dashboard Preview"
                    sx={{
                      width: '100%',
                      borderRadius: 4,
                      boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  />
                </Box>
              </Slide>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Modern Stats Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#0f172a', px: 2 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {stats.map((stat, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Fade in={isVisible} timeout={(index + 1) * 200}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: 900,
                        background: 'linear-gradient(135deg, #22d3ee 0%, #a78bfa 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1,
                        fontSize: { xs: '2rem', md: '3.5rem' }
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: alpha('#fff', 0.7),
                        fontWeight: 500,
                        fontSize: { xs: '0.9rem', md: '1.1rem' }
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Enhanced Features Section */}
      <Box sx={{ py: { xs: 12, md: 16 }, backgroundColor: '#1e293b', px: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography
              variant="overline"
              sx={{
                letterSpacing: '0.3em',
                color: '#22d3ee',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              FEATURES
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                background: 'linear-gradient(135deg, #ffffff 0%, #22d3ee 50%, #a78bfa 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Everything You Need to Succeed
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: alpha('#fff', 0.7),
                maxWidth: 700,
                mx: 'auto',
                lineHeight: 1.6,
                fontSize: { xs: '1rem', md: '1.2rem' }
              }}
            >
              Powerful tools and insights designed for modern investors who demand excellence
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Fade in={isVisible} timeout={(index + 1) * 200}>
                  <Card
                    sx={{
                      height: '100%',
                      p: 4,
                      borderRadius: 4,
                      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: feature.gradient,
                      },
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
                        border: '1px solid rgba(34, 211, 238, 0.3)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 0 }}>
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: 3,
                          background: feature.gradient,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          mb: 3,
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: '#ffffff' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" sx={{ color: alpha('#fff', 0.7), mb: 3, lineHeight: 1.7 }}>
                        {feature.description}
                      </Typography>
                      <Stack spacing={1.5}>
                        {feature.benefits.map((benefit, idx) => (
                          <Stack key={idx} direction="row" spacing={1.5} alignItems="center">
                            <CheckCircle sx={{ color: '#22d3ee', fontSize: '1rem' }} />
                            <Typography variant="body2" sx={{ color: alpha('#fff', 0.8) }}>
                              {benefit}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Enhanced Testimonials Section */}
      <Box sx={{ py: { xs: 12, md: 16 }, backgroundColor: '#0f172a', px: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography
              variant="overline"
              sx={{
                letterSpacing: '0.3em',
                color: '#22d3ee',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              TESTIMONIALS
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                color: '#ffffff',
              }}
            >
              Loved by Investors Nationwide
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: alpha('#fff', 0.7),
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              See what our users have to say about their investment journey with Grow
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Fade in={isVisible} timeout={(index + 1) * 300}>
                  <Card
                    sx={{
                      height: '100%',
                      p: 4,
                      textAlign: 'center',
                      borderRadius: 4,
                      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: 'linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)',
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        mx: 'auto',
                        mb: 3,
                        border: '3px solid rgba(34, 211, 238, 0.2)',
                      }}
                    >
                      {testimonial.avatar}
                    </Avatar>
                    {testimonial.verified && (
                      <Chip
                        label="Verified"
                        size="small"
                        sx={{
                          mb: 2,
                          bgcolor: alpha('#22d3ee', 0.2),
                          color: '#22d3ee',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      />
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} sx={{ color: '#fbbf24', fontSize: '1.3rem' }} />
                      ))}
                    </Box>
                    <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic', lineHeight: 1.7, color: alpha('#fff', 0.8) }}>
                      &ldquo;{testimonial.content}&rdquo;
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff', mb: 0.5 }}>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha('#fff', 0.6), mb: 0.5 }}>
                      {testimonial.role}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#22d3ee', fontWeight: 600 }}>
                      {testimonial.company}
                    </Typography>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box sx={{ py: { xs: 12, md: 16 }, backgroundColor: '#1e293b', px: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography
              variant="overline"
              sx={{
                letterSpacing: '0.3em',
                color: '#22d3ee',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              PRICING
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                color: '#ffffff',
              }}
            >
              Simple, Transparent Pricing
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: alpha('#fff', 0.7),
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Choose the perfect plan for your investment journey
            </Typography>
          </Box>

          <Grid container spacing={4} alignItems="stretch">
            {pricingPlans.map((plan, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    p: 4,
                    borderRadius: 4,
                    background: plan.highlighted
                      ? 'linear-gradient(135deg, rgba(34, 211, 238, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)'
                      : 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)',
                    border: plan.highlighted ? '2px solid #22d3ee' : '1px solid rgba(255,255,255,0.1)',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
                    },
                  }}
                >
                  {plan.highlighted && (
                    <Chip
                      label="MOST POPULAR"
                      sx={{
                        position: 'absolute',
                        top: -12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bgcolor: '#22d3ee',
                        color: '#0f172a',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                      }}
                    />
                  )}
                  <CardContent sx={{ p: 0, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#ffffff' }}>
                      {plan.name}
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h3" sx={{ fontWeight: 900, color: '#22d3ee' }}>
                        {plan.price}
                        <Typography component="span" variant="h6" sx={{ color: alpha('#fff', 0.7) }}>
                          {plan.period}
                        </Typography>
                      </Typography>
                    </Box>
                    <Stack spacing={2} sx={{ mb: 4 }}>
                      {plan.features.map((feature, idx) => (
                        <Stack key={idx} direction="row" spacing={1.5} alignItems="center">
                          <CheckCircle sx={{ color: '#22d3ee', fontSize: '1rem' }} />
                          <Typography variant="body2" sx={{ color: alpha('#fff', 0.8) }}>
                            {feature}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                    <Button
                      variant={plan.highlighted ? 'contained' : 'outlined'}
                      fullWidth
                      size="large"
                      sx={{
                        py: 2,
                        fontWeight: 700,
                        ...(plan.highlighted && {
                          background: 'linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)',
                          border: 'none',
                        }),
                        ...(!plan.highlighted && {
                          borderColor: alpha('#fff', 0.3),
                          color: '#ffffff',
                        }),
                      }}
                    >
                      {plan.price === 'Free' ? 'Get Started' : plan.price === 'Custom' ? 'Contact Sales' : 'Start Free Trial'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Modern CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
          color: 'white',
          py: { xs: 12, md: 16 },
          px: 2,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.1) 0%, transparent 70%)',
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="overline"
            sx={{
              letterSpacing: '0.3em',
              color: '#22d3ee',
              fontWeight: 700,
              fontSize: '0.85rem',
              mb: 3,
            }}
          >
            READY TO GET STARTED?
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              background: 'linear-gradient(135deg, #ffffff 0%, #22d3ee 50%, #a78bfa 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Transform Your Investment Journey Today
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 6,
              color: alpha('#fff', 0.8),
              maxWidth: 700,
              mx: 'auto',
              lineHeight: 1.6,
              fontSize: { xs: '1.1rem', md: '1.3rem' }
            }}
          >
            Join 25,000+ smart investors who trust Grow for their mutual fund research and investment decisions.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/funds')}
              endIcon={<Launch />}
              sx={{
                background: 'linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)',
                color: 'white',
                px: 6,
                py: 3,
                fontSize: '1.2rem',
                fontWeight: 700,
                borderRadius: 3,
                boxShadow: '0 15px 35px rgba(34, 211, 238, 0.3)',
                '&:hover': {
                  boxShadow: '0 20px 40px rgba(34, 211, 238, 0.4)',
                  transform: 'translateY(-3px)',
                },
              }}
            >
              Start Investing Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              endIcon={<KeyboardArrowRight />}
              sx={{
                borderColor: alpha('#fff', 0.3),
                color: 'white',
                px: 6,
                py: 3,
                fontSize: '1.2rem',
                fontWeight: 700,
                borderRadius: 3,
                '&:hover': {
                  backgroundColor: alpha('#fff', 0.1),
                  borderColor: alpha('#fff', 0.5),
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
