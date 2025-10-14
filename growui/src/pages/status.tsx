import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  useTheme,
  Stack,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ScheduleIcon from '@mui/icons-material/Schedule';

interface Service {
  name: string;
  status: 'operational' | 'degraded' | 'down' | string;
  uptime: string;
  responseTime: string;
  description?: string;
}

const services: Service[] = [
  {
    name: 'API Server',
    status: 'operational',
    uptime: '99.9%',
    responseTime: '120ms',
  },
  {
    name: 'Database',
    status: 'operational',
    uptime: '99.8%',
    responseTime: '15ms',
  },
  {
    name: 'Cache Layer',
    status: 'operational',
    uptime: '99.9%',
    responseTime: '8ms',
  },
  {
    name: 'External APIs',
    status: 'operational',
    uptime: '98.5%',
    responseTime: '450ms',
  },
];

const incidents = [
  {
    date: 'Jan 15, 2024',
    title: 'Database Maintenance',
    status: 'resolved',
    description: 'Scheduled maintenance completed successfully.',
  },
  {
    date: 'Jan 10, 2024',
    title: 'API Rate Limiting',
    status: 'resolved',
    description: 'Temporary rate limiting due to high traffic.',
  },
];

export default function StatusPage() {
  const theme = useTheme();

  return (
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            py: { xs: 6, md: 8 },
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
                System Status
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  opacity: 0.95,
                  maxWidth: 600,
                  mx: 'auto',
                }}
              >
                Real-time status of all our services
              </Typography>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 }, px: { xs: 2, md: 3 } }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Card sx={{
                borderRadius: 4,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
                    Service Status
                  </Typography>

                  <Grid container spacing={3}>
                    {services.map((service, index) => (
                      <Grid item xs={12} key={index}>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          p: 3,
                          borderRadius: 2,
                          backgroundColor: service.status === 'operational' ? 'success.main' : 'error.main',
                          color: 'white',
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {service.status === 'operational' ? (
                              <CheckCircleIcon />
                            ) : (
                              <ErrorIcon />
                            )}
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {service.name}
                              </Typography>
                              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                {service.description || 'All systems operational'}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              Uptime: {service.uptime}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              Response: {service.responseTime}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{
                borderRadius: 4,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
                    Recent Incidents
                  </Typography>

                  <Stack spacing={3}>
                    {incidents.map((incident, index) => (
                      <Box key={index} sx={{
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                        border: '1px solid',
                        borderColor: 'rgba(0, 0, 0, 0.08)',
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <ScheduleIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {incident.date}
                          </Typography>
                          <Chip
                            label={incident.status}
                            size="small"
                            sx={{
                              bgcolor: incident.status === 'resolved' ? 'success.main' : 'warning.main',
                              color: 'white',
                              fontSize: '0.7rem',
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                          {incident.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {incident.description}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
  );
}
