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

export default function TermsPage() {
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
                Terms of Service
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
              1. Acceptance of Terms
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              By accessing and using Grow Fund Explorer ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
              2. Use License
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              Permission is granted to temporarily use Grow Fund Explorer for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4, color: 'text.secondary' }}>
              <li>modify or copy the materials</li>
              <li>use the materials for any commercial purpose or for any public display</li>
              <li>attempt to reverse engineer any software contained on the website</li>
              <li>remove any copyright or other proprietary notations from the materials</li>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
              3. Disclaimer
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              The materials on Grow Fund Explorer are provided on an 'as is' basis. Grow Fund Explorer makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              Further, Grow Fund Explorer does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
              4. Investment Disclaimer
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              The information provided on Grow Fund Explorer is for educational and informational purposes only and should not be construed as investment advice. Past performance is not indicative of future results. Mutual fund investments are subject to market risks, read all scheme related documents carefully.
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              Always consult with a qualified financial advisor before making any investment decisions. Grow Fund Explorer is not responsible for any financial losses incurred based on the use of information provided on this platform.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
              5. Limitations
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              In no event shall Grow Fund Explorer or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Grow Fund Explorer, even if Grow Fund Explorer or a Grow Fund Explorer authorized representative has been notified orally or in writing of the possibility of such damage.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
              6. Revisions and Errata
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              The materials appearing on Grow Fund Explorer could include technical, typographical, or photographic errors. Grow Fund Explorer does not warrant that any of the materials on its website are accurate, complete, or current. Grow Fund Explorer may make changes to the materials contained on its website at any time without notice.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
              7. Links
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              Grow Fund Explorer has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Grow Fund Explorer of the site. Use of any such linked website is at the user's own risk.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
              8. Modifications
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              Grow Fund Explorer may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
              9. Governing Law
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
              10. Contact Information
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              If you have any questions about these Terms of Service, please contact us at:
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
