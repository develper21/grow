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

export default function DisclaimerPage() {
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
                Disclaimer
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
                Important information about our services
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
              Investment Disclaimer
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              The information provided on Grow Fund Explorer is for educational and informational purposes only and should not be construed as investment advice. Past performance is not indicative of future results.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
              No Financial Advice
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              The content on this website is not intended to provide financial, investment, or trading advice. You should consult with a qualified financial advisor before making any investment decisions.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
              Market Risks
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully before investing. The value of investments may go down as well as up.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
              Data Accuracy
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              While we strive to provide accurate and up-to-date information, we cannot guarantee the accuracy, completeness, or timeliness of the data provided on this platform.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
              External Links
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              This website may contain links to external websites. We are not responsible for the content or privacy practices of these external sites.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
              Contact Us
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              If you have any questions about this disclaimer, please contact us:
            </Typography>
            <Typography variant="body1" sx={{ color: 'primary.main', fontWeight: 600 }}>
              Email: legal@growfunds.com<br />
              Address: Grow Fund Explorer, Mumbai, India
            </Typography>
          </Paper>
        </Container>
      </Box>
  );
}
