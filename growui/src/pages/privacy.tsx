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

export default function PrivacyPage() {
  const theme = useTheme();

  return (
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
        {/* Hero Section */}
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
                Privacy Policy
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
              1. Information We Collect
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              We collect information you provide directly to us, such as when you create an account, use our calculators, or contact us for support. This may include:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4, color: 'text.secondary' }}>
              <li>Name and email address</li>
              <li>Investment preferences and goals</li>
              <li>Watchlist and portfolio data</li>
              <li>Usage analytics and performance metrics</li>
              <li>Communication preferences</li>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
              2. How We Use Your Information
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              We use the information we collect to:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4, color: 'text.secondary' }}>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Communicate with you about products, services, and events</li>
              <li>Monitor and analyze trends, usage, and activities</li>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
              3. Information Sharing
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information in the following circumstances:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4, color: 'text.secondary' }}>
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
              <li>In connection with a business transfer</li>
              <li>With service providers who assist us in operating our platform</li>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
              4. Data Security
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4, color: 'text.secondary' }}>
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication requirements</li>
              <li>Secure data centers with physical security</li>
              <li>Employee training on data protection</li>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
              5. Your Rights
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              You have the following rights regarding your personal information:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4, color: 'text.secondary' }}>
              <li><strong>Access:</strong> Request information about the personal data we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate personal information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Restriction:</strong> Request restriction of processing your personal information</li>
              <li><strong>Portability:</strong> Request a copy of your personal information in a structured format</li>
              <li><strong>Objection:</strong> Object to processing of your personal information</li>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
              6. Cookies and Tracking
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              We use cookies and similar tracking technologies to collect and use personal information about you. For more information about our use of cookies, please see our Cookie Policy.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
              7. International Data Transfers
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              Your information may be transferred to and maintained on computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ. By using our services, you consent to such transfers.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
              8. Children's Privacy
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              Our services are not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
              9. Changes to This Policy
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
              10. Contact Us
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              If you have any questions about this Privacy Policy, please contact us:
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
