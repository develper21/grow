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
  useTheme,
  alpha,
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import ApiIcon from '@mui/icons-material/Api';
import WebhookIcon from '@mui/icons-material/Webhook';
import SecurityIcon from '@mui/icons-material/Security';

const integrations = [
  {
    name: 'REST API',
    description: 'Full-featured REST API for accessing mutual fund data and calculations.',
    features: ['Real-time data', 'Historical analysis', 'Custom queries'],
    icon: <ApiIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
  },
  {
    name: 'Webhook Notifications',
    description: 'Get instant notifications when fund data is updated or alerts are triggered.',
    features: ['Real-time alerts', 'Custom triggers', 'Multiple formats'],
    icon: <WebhookIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
  },
  {
    name: 'SDK Libraries',
    description: 'Pre-built libraries for popular programming languages.',
    features: ['Python SDK', 'Node.js SDK', 'Java SDK'],
    icon: <CodeIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
  },
  {
    name: 'Enterprise Solutions',
    description: 'Custom integrations and white-label solutions for institutions.',
    features: ['Custom branding', 'Dedicated support', 'SLA guarantees'],
    icon: <SecurityIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
  },
];

export default function IntegrationsPage() {
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
                Integrations
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
                Seamlessly integrate Grow's powerful mutual fund data into your applications
              </Typography>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, md: 3 } }}>
          <Grid container spacing={4}>
            {integrations.map((integration, index) => (
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
                      {integration.icon}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                      {integration.name}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.7 }}>
                      {integration.description}
                    </Typography>
                    <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                      {integration.features.map((feature, idx) => (
                        <Typography
                          key={idx}
                          variant="body2"
                          sx={{
                            color: 'primary.main',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                          }}
                        >
                          {feature}{idx < integration.features.length - 1 ? ' • ' : ''}
                        </Typography>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
              Ready to Integrate?
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, maxWidth: 600, mx: 'auto' }}>
              Get started with our comprehensive API documentation and start building powerful financial applications.
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
                View API Docs
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
                Get API Key
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
  );
}
