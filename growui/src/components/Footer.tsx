import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
  Stack,
  Divider,
  useTheme,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';

export default function Footer() {
  const theme = useTheme();

  const footerLinks = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'API', href: '/api' },
      { label: 'Integrations', href: '#integrations' },
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Community', href: '/community' },
      { label: 'Status', href: '/status' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
    legal: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Disclaimer', href: '/disclaimer' },
    ],
  };

  const socialLinks = [
    { icon: <TwitterIcon />, href: 'https://twitter.com/growfunds' },
    { icon: <LinkedInIcon />, href: 'https://linkedin.com/company/growfunds' },
    { icon: <FacebookIcon />, href: 'https://facebook.com/growfunds' },
    { icon: <YouTubeIcon />, href: 'https://youtube.com/growfunds' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: 'white',
        pt: { xs: 8, md: 12 },
        pb: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TrendingUpIcon sx={{ fontSize: 32, color: 'primary.main', mr: 1.5 }} />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Grow
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ mb: 3, opacity: 0.9, lineHeight: 1.7 }}>
                Empowering investors with intelligent tools for mutual fund research,
                analysis, and portfolio management. Make informed decisions with confidence.
              </Typography>
              <Stack direction="row" spacing={1}>
                {socialLinks.map((social, index) => (
                  <IconButton
                    key={index}
                    component="a"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      '&:hover': {
                        color: 'primary.main',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              <Grid item xs={6} sm={3}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  Product
                </Typography>
                <Stack spacing={2}>
                  {footerLinks.product.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      sx={{
                        color: 'rgba(255,255,255,0.8)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        '&:hover': {
                          color: 'primary.main',
                          textDecoration: 'none',
                        },
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </Stack>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  Company
                </Typography>
                <Stack spacing={2}>
                  {footerLinks.company.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      sx={{
                        color: 'rgba(255,255,255,0.8)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        '&:hover': {
                          color: 'primary.main',
                          textDecoration: 'none',
                        },
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </Stack>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  Support
                </Typography>
                <Stack spacing={2}>
                  {footerLinks.support.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      sx={{
                        color: 'rgba(255,255,255,0.8)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        '&:hover': {
                          color: 'primary.main',
                          textDecoration: 'none',
                        },
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </Stack>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  Legal
                </Typography>
                <Stack spacing={2}>
                  {footerLinks.legal.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      sx={{
                        color: 'rgba(255,255,255,0.8)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        '&:hover': {
                          color: 'primary.main',
                          textDecoration: 'none',
                        },
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {new Date().getFullYear()} Grow Fund Explorer. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Data powered by{' '}
              <Link
                href="https://www.mfapi.in/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                MFAPI.in
              </Link>
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              |
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Made with ❤️ for Indian investors
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
