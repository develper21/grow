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
import WorkIcon from '@mui/icons-material/Work';
import LocationIcon from '@mui/icons-material/LocationOn';
import ScheduleIcon from '@mui/icons-material/Schedule';

const jobs = [
  {
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'Mumbai, India',
    type: 'Full-time',
    description: 'Build beautiful user interfaces for our mutual fund platform using React and Material-UI.',
  },
  {
    title: 'Backend Engineer',
    department: 'Engineering',
    location: 'Mumbai, India',
    type: 'Full-time',
    description: 'Develop scalable APIs and data processing systems for financial data.',
  },
  {
    title: 'Product Manager',
    department: 'Product',
    location: 'Mumbai, India',
    type: 'Full-time',
    description: 'Define product strategy and roadmap for our investment platform.',
  },
  {
    title: 'Investment Research Analyst',
    department: 'Research',
    location: 'Mumbai, India',
    type: 'Full-time',
    description: 'Analyze mutual fund performance and provide investment insights.',
  },
];

export default function CareersPage() {
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
                Join Our Team
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
                Help us democratize financial education and build the future of investing
              </Typography>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, md: 3 } }}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 3, color: 'text.primary' }}>
                Why Join Grow?
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
                We're building the next generation of financial tools that will help millions of Indians make informed investment decisions. Join us in our mission to democratize financial education.
              </Typography>

              <Stack spacing={3}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                  <WorkIcon sx={{ color: 'primary.main', fontSize: 24, mt: 0.5 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                      Competitive Compensation
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Top-tier salaries with equity participation and performance bonuses.
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                  <LocationIcon sx={{ color: 'primary.main', fontSize: 24, mt: 0.5 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                      Flexible Work
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Hybrid work model with flexible hours and remote options.
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                  <ScheduleIcon sx={{ color: 'primary.main', fontSize: 24, mt: 0.5 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                      Learning & Growth
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Continuous learning opportunities and career development programs.
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{
                borderRadius: 4,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
              }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: 'text.primary' }}>
                    50,000+
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                    Investors Using Our Platform
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Join a team that's making a real impact on financial inclusion in India.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 8 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 6, textAlign: 'center' }}>
              Open Positions
            </Typography>

            <Grid container spacing={4}>
              {jobs.map((job, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 4,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                        {job.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'primary.main', mb: 3, fontWeight: 600 }}>
                        {job.department}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          📍 {job.location}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          ⏰ {job.type}
                        </Typography>
                      </Box>

                      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.7 }}>
                        {job.description}
                      </Typography>

                      <Button
                        variant="outlined"
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        Apply Now
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
  );
}
