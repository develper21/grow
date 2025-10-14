import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Stack,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationIcon from '@mui/icons-material/LocationOn';
import SendIcon from '@mui/icons-material/Send';

export default function ContactPage() {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <EmailIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: 'Email',
      value: 'hello@growfunds.com',
      description: 'Send us an email anytime',
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: 'Phone',
      value: '+91-98765-43210',
      description: 'Mon-Fri 9 AM - 6 PM IST',
    },
    {
      icon: <LocationIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: 'Office',
      value: 'Mumbai, India',
      description: '123 Business District, Mumbai 400001',
    },
  ];

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
                Contact Us
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  opacity: 0.95,
                  maxWidth: 600,
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
                Get in touch with our team for support, partnerships, or any questions
              </Typography>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, md: 3 } }}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 6 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 3, color: 'text.primary' }}>
                  Get In Touch
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
                  We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </Typography>

                <Stack spacing={4}>
                  {contactInfo.map((info, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                      <Box sx={{ color: 'primary.main' }}>
                        {info.icon}
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                          {info.title}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main', mb: 0.5 }}>
                          {info.value}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {info.description}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{
                borderRadius: 4,
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>
                    Send us a Message
                  </Typography>

                  {success && (
                    <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                      Thank you for your message! We'll get back to you soon.
                    </Alert>
                  )}

                  <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        label="Name"
                        value={formData.name}
                        onChange={handleInputChange('name')}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Subject"
                        value={formData.subject}
                        onChange={handleInputChange('subject')}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Message"
                        multiline
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange('message')}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />

                      {error && (
                        <Alert severity="error" sx={{ borderRadius: 2 }}>
                          {error}
                        </Alert>
                      )}

                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={loading}
                        endIcon={<SendIcon />}
                        sx={{
                          py: 1.5,
                          borderRadius: 2,
                          fontSize: '1rem',
                          fontWeight: 600,
                          textTransform: 'none',
                          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 6px 16px rgba(37, 99, 235, 0.4)',
                          },
                        }}
                      >
                        {loading ? 'Sending...' : 'Send Message'}
                      </Button>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
  );
}
