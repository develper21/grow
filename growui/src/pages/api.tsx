import React from 'react';
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
  useTheme,
  alpha,
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import SupportIcon from '@mui/icons-material/Support';

const apiFeatures = [
  {
    icon: <CodeIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'RESTful API',
    description: 'Clean, well-documented REST API for seamless integration.',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'Secure Access',
    description: 'API key authentication with rate limiting and security best practices.',
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'High Performance',
    description: 'Optimized for speed with caching and efficient data structures.',
  },
  {
    icon: <SupportIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'Developer Support',
    description: 'Comprehensive documentation and dedicated developer support.',
  },
];

const endpoints = [
  {
    method: 'GET',
    endpoint: '/api/mf',
    description: 'Get all available mutual funds',
    params: 'None',
  },
  {
    method: 'GET',
    endpoint: '/api/mf/{schemeCode}',
    description: 'Get NAV history for specific fund',
    params: 'schemeCode: number',
  },
  {
    method: 'POST',
    endpoint: '/api/scheme/{schemeCode}/sip',
    description: 'Calculate SIP returns',
    params: 'amount, frequency, from, to',
  },
  {
    method: 'POST',
    endpoint: '/api/scheme/{schemeCode}/lumpsum',
    description: 'Calculate lumpsum returns',
    params: 'amount, from, to',
  },
];

export default function APIPage() {
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
                Developer API
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
                Integrate Grow&apos;s powerful mutual fund data into your applications
              </Typography>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, md: 3 } }}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 3, color: 'text.primary' }}>
                API Features
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
                Our API provides access to comprehensive mutual fund data with real-time updates, historical analysis, and advanced calculation capabilities.
              </Typography>

              <Stack spacing={3}>
                {apiFeatures.map((feature, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                    <Box sx={{ color: feature.icon.props.children[1].props.color }}>
                      {feature.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {feature.description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{
                borderRadius: 4,
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
                    API Endpoints
                  </Typography>

                  <Stack spacing={3}>
                    {endpoints.map((endpoint, index) => (
                      <Box key={index} sx={{
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        border: '1px solid',
                        borderColor: 'rgba(0, 0, 0, 0.08)',
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Chip
                            label={endpoint.method}
                            size="small"
                            sx={{
                              bgcolor: endpoint.method === 'GET' ? 'success.main' : 'primary.main',
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                            {endpoint.endpoint}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                          {endpoint.description}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Parameters: {endpoint.params}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>

                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                    }}
                  >
                    Get API Key
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
  );
}
