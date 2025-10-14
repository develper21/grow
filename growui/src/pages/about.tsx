import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SupportIcon from '@mui/icons-material/Support';

const team = [
  {
    name: 'Rajesh Kumar',
    role: 'Founder & CEO',
    bio: '15+ years in fintech and investment banking. Passionate about democratizing financial education.',
    avatar: 'RK',
  },
  {
    name: 'Priya Sharma',
    role: 'Head of Product',
    bio: 'Former product manager at leading fintech companies. Focused on user experience and innovation.',
    avatar: 'PS',
  },
  {
    name: 'Amit Patel',
    role: 'Chief Technology Officer',
    bio: 'Full-stack developer with expertise in financial data processing and real-time systems.',
    avatar: 'AP',
  },
  {
    name: 'Sneha Reddy',
    role: 'Head of Research',
    bio: 'CFA charterholder with 10+ years analyzing mutual funds and investment strategies.',
    avatar: 'SR',
  },
];

const values = [
  {
    icon: <SecurityIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'Security First',
    description: 'Your financial data is encrypted and protected with bank-grade security measures.',
  },
  {
    icon: <AnalyticsIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'Data-Driven Insights',
    description: 'Every recommendation is backed by comprehensive analysis and historical data.',
  },
  {
    icon: <PeopleIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'User-Centric Design',
    description: 'We build tools that are intuitive and accessible to investors of all experience levels.',
  },
  {
    icon: <SupportIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'Expert Support',
    description: 'Our team of financial experts is here to help you make informed investment decisions.',
  },
];

export default function AboutPage() {
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
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 800,
                  mb: 3,
                  lineHeight: 1.1,
                }}
              >
                About Grow
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
                Empowering Indian investors with intelligent tools for mutual fund research, analysis, and portfolio management.
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Story Section */}
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, md: 3 } }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 3, color: 'text.primary' }}>
                Our Story
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.8 }}>
                Founded in 2023, Grow was born out of a simple belief: everyone deserves access to sophisticated investment tools, regardless of their financial knowledge or background.
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.8 }}>
                Our founders, with decades of combined experience in fintech, investment banking, and financial research, saw a gap in the market. While institutional investors had access to powerful analytics tools, individual investors were left with basic calculators and limited insights.
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
                We set out to build a platform that combines the sophistication of institutional tools with the simplicity that individual investors need. Today, Grow serves thousands of investors across India, helping them make informed decisions about their mutual fund investments.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{
                borderRadius: 4,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
              }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <TrendingUpIcon sx={{ fontSize: 80, color: 'primary.main', mb: 3 }} />
                  <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: 'text.primary' }}>
                    50,000+
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Active Users
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>

        {/* Values Section */}
        <Box sx={{ backgroundColor: 'grey.50', py: { xs: 8, md: 12 }, px: 2 }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                Our Values
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
                The principles that guide everything we do
              </Typography>
            </Box>

            <Grid container spacing={4}>
              {values.map((value, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      p: 3,
                      borderRadius: 4,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 0, textAlign: 'center' }}>
                      <Box sx={{ mb: 3 }}>
                        {value.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                        {value.title}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        {value.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Team Section */}
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, md: 3 } }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
              Meet Our Team
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
              The passionate individuals behind Grow's mission to democratize financial education
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {team.map((member, index) => (
              <Grid item xs={12} md={6} lg={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    borderRadius: 4,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 3,
                        fontSize: '1.5rem',
                        bgcolor: 'primary.main',
                        fontWeight: 700,
                      }}
                    >
                      {member.avatar}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                      {member.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'primary.main', mb: 3, fontWeight: 600 }}>
                      {member.role}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                      {member.bio}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Mission Section */}
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
                mb: 4,
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              Our Mission
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 6,
                opacity: 0.95,
                maxWidth: 700,
                mx: 'auto',
                lineHeight: 1.6,
                fontSize: { xs: '1.1rem', md: '1.3rem' }
              }}
            >
              To democratize financial education and empower every Indian investor with the tools and knowledge they need to build wealth through informed mutual fund investments.
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
                Join Our Mission
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
                Learn More
              </Button>
            </Stack>
          </Container>
        </Box>
      </Box>
  );
}
