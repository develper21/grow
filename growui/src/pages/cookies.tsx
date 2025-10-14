import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';

export default function CookiesPage() {
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
                Cookie Policy
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  opacity: 0.95,
                  maxWidth: 600,
                  mx: 'auto',
                }}
              >
                Last updated: January 15, 2024
              </Typography>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 }, px: { xs: 2, md: 3 } }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 6 },
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'rgba(0, 0, 0, 0.08)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
              What Are Cookies
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              Cookies are small text files that are used to store small pieces of information. They are stored on your device when the website is loaded on your browser.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
              How We Use Cookies
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              We use cookies to enhance your experience, analyze site usage, and provide personalized content. Cookies help us remember your preferences and understand how you interact with our site.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
              Types of Cookies We Use
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4, color: 'text.secondary' }}>
              <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our site</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
              Managing Cookies
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              You can control and manage cookies in various ways. Please note that removing or blocking cookies can negatively affect your user experience and parts of our website may no longer be fully accessible.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
              Contact Us
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              If you have any questions about our Cookie Policy, please contact us:
            </Typography>
            <Typography variant="body1" sx={{ color: 'primary.main', fontWeight: 600 }}>
              Email: privacy@growfunds.com<br />
              Address: Grow Fund Explorer, Mumbai, India
            </Typography>
          </Paper>
        </Container>
      </Box>
  );
}
