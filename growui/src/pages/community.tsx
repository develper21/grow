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
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import ForumIcon from '@mui/icons-material/Forum';
import PeopleIcon from '@mui/icons-material/People';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const communityFeatures = [
  {
    icon: <ForumIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'Discussion Forums',
    description: 'Join conversations about mutual funds, investment strategies, and market trends.',
    members: '2,500+',
  },
  {
    icon: <QuestionAnswerIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'Q&A Sessions',
    description: 'Get answers to your investment questions from our community of experts and experienced investors.',
    members: 'Weekly',
  },
  {
    icon: <PeopleIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'Investor Meetups',
    description: 'Connect with fellow investors in your city through regular meetups and networking events.',
    members: 'Monthly',
  },
  {
    icon: <TrendingUpIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'Market Analysis',
    description: 'Share insights and analysis about market trends and investment opportunities.',
    members: 'Daily',
  },
];

export default function CommunityPage() {
  const theme = useTheme();

  return (
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
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
                Investment Community
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
                Connect with fellow investors, share insights, and learn together
              </Typography>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, md: 3 } }}>
          <Grid container spacing={4}>
            {communityFeatures.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    p: 4,
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
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.7 }}>
                      {feature.description}
                    </Typography>
                    <Chip
                      label={feature.members}
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                        fontWeight: 600,
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
              Join Our Growing Community
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, maxWidth: 600, mx: 'auto' }}>
              Be part of a community of 10,000+ investors who are passionate about building wealth through informed decisions.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                sx={{
                  px: 6,
                  py: 2,
                  borderRadius: 3,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                Join Community
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  px: 6,
                  py: 2,
                  borderRadius: 3,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                View Forum
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
  );
}
