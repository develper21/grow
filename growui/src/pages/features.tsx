import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  useTheme,
  alpha,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CalculateIcon from '@mui/icons-material/Calculate';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import SupportIcon from '@mui/icons-material/Support';
import AssessmentIcon from '@mui/icons-material/Assessment';
import GroupsIcon from '@mui/icons-material/Groups';
import VerifiedIcon from '@mui/icons-material/Verified';
import InsightsIcon from '@mui/icons-material/Insights';
import ShieldIcon from '@mui/icons-material/Shield';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const personas = [
  {
    role: 'Company Head',
    focus: 'Growth & Governance',
    summary: 'Live view of mandates, onboarding progress, and compliance health to keep the organization audit-ready.',
    capabilities: ['Consent & retention dashboards', 'Alert workflows', 'Multi-role approvals'],
    color: '#1d4ed8',
  },
  {
    role: 'Admin',
    focus: 'Operations Control',
    summary: 'Manage orders, statements, and customer escalations with automated notifications.',
    capabilities: ['Statements & tax center', 'Support triage', 'Real-time monitoring'],
    color: '#7c3aed',
  },
  {
    role: 'Seller / RM',
    focus: 'Customer Engagement',
    summary: 'Smart research, watchlists, and SIP automation to keep clients invested.',
    capabilities: ['Fund screener & watchlist', 'Goal/SIP calculators', 'Notification rules'],
    color: '#0ea5e9',
  },
  {
    role: 'Investor',
    focus: 'Self-Serve Investing',
    summary: 'Transparent transactions, timelines, and support to build trust.',
    capabilities: ['Transaction wizard', 'Order timeline & receipts', 'Alerts + support center'],
    color: '#10b981',
  },
];

const platformPillars = [
  {
    icon: <SearchIcon />,
    title: 'Fund Intelligence',
    bullets: ['NAV history with charts', 'Portfolio analytics & KPI cards', 'Virtual portfolio sandbox'],
  },
  {
    icon: <CalculateIcon />,
    title: 'Decision Tools',
    bullets: ['SIP, Lumpsum, SWP calculators', 'Comparison & scenario analysis', 'Live goal momentum sparkline'],
  },
  {
    icon: <SecurityIcon />,
    title: 'Compliance & Trust',
    bullets: ['Consent & retention policies', 'Disaster recovery checklist', 'Audit-ready exports'],
  },
  {
    icon: <SupportIcon />,
    title: 'Engagement & Support',
    bullets: ['Omnichannel notifications', 'Knowledge search + ticketing', 'Feedback loops & SLAs'],
  },
];

const automationHighlights = [
  {
    icon: <NotificationsActiveIcon color="primary" />,
    title: 'Event Notifications',
    detail: 'Payment status, onboarding changes, compliance alerts delivered to web & email with user preferences.',
  },
  {
    icon: <ShieldIcon color="primary" />,
    title: 'Secure Workflows',
    detail: 'Role-based API routes (NextAuth + Mongo) ensure every write/read is audited across roles.',
  },
  {
    icon: <InsightsIcon color="primary" />,
    title: 'Insight Loops',
    detail: 'Watchlist & research data fuel dashboards, enabling admins to trigger nudges instantly.',
  },
];

export default function FeaturesPage() {
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero */}
      <Box sx={{ background: 'linear-gradient(135deg,#0f172a 0%,#312e81 60%,#4338ca 100%)', color: 'white', py: { xs: 8, md: 12 }, px: 2 }}>
        <Container maxWidth="lg">
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Chip label="Platform Overview" sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'white', fontWeight: 600 }} />
            <Typography variant="h2" fontWeight={800} sx={{ fontSize: { xs: '2.3rem', md: '3.4rem' } }}>
              One workspace for every role in wealth management
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.85, maxWidth: 760, lineHeight: 1.6 }}>
              From discovery to compliance, Grow stitches funds, onboarding, statements, support, and automation into a single control plane.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button variant="contained" color="secondary" onClick={() => window.location.href = '/signin'}>
                Launch Dashboard
              </Button>
              <Button variant="outlined" sx={{ color: 'white', borderColor: 'white' }} onClick={() => window.location.href = '/support'}>
                Talk to Support
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Role personas */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 4 }}>
          Tailored experiences for every persona
        </Typography>
        <Grid container spacing={3}>
          {personas.map((persona) => (
            <Grid item xs={12} md={6} key={persona.role}>
              <Card sx={{ borderRadius: 4, height: '100%', border: '1px solid', borderColor: alpha(persona.color, 0.3) }}>
                <CardContent>
                  <Chip label={persona.focus} sx={{ bgcolor: alpha(persona.color, 0.15), color: persona.color, mb: 2, fontWeight: 600 }} />
                  <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                    {persona.role}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {persona.summary}
                  </Typography>
                  <Stack spacing={1.2}>
                    {persona.capabilities.map((cap) => (
                      <Stack key={cap} direction="row" spacing={1.5} alignItems="center">
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: persona.color }} />
                        <Typography variant="body2">{cap}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Platform pillars */}
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={800} sx={{ mb: 4 }}>
            Platform pillars
          </Typography>
          <Grid container spacing={4}>
            {platformPillars.map((pillar) => (
              <Grid item xs={12} md={6} key={pillar.title}>
                <Card sx={{ borderRadius: 4, p: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Box sx={{ color: 'primary.main' }}>{pillar.icon}</Box>
                    <Box>
                      <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>{pillar.title}</Typography>
                      <List dense>
                        {pillar.bullets.map((bullet) => (
                          <ListItem key={bullet} disablePadding>
                            <ListItemIcon sx={{ minWidth: 26, color: 'primary.main' }}>
                              <VerifiedIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={bullet} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Automation / notifications */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
              Automation + notifications
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Every event—watchlist change, order status, compliance reminder—triggers configurable popups and emails powered by the NotificationContext.
            </Typography>
            <Stack spacing={3}>
              {automationHighlights.map((item) => (
                <Stack key={item.title} direction="row" spacing={2}>
                  {item.icon}
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700}>{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.detail}</Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, height: '100%', background: 'linear-gradient(135deg,#eef2ff,#e0e7ff)' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Audit-grade persistence
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  MongoDB + NextAuth adapter store users, watchlists, orders, and compliance artifacts. Each dashboard module will reuse these collections for CRUD flows.
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1}><GroupsIcon color="primary" /><Typography variant="body2">Role-based collections (company_head/admin/seller/customer)</Typography></Stack>
                  <Stack direction="row" spacing={1}><AssessmentIcon color="primary" /><Typography variant="body2">Orders + statements linked to session user</Typography></Stack>
                  <Stack direction="row" spacing={1}><SecurityIcon color="primary" /><Typography variant="body2">Compliance exports & policies persisted for audits</Typography></Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* CTA */}
      <Box sx={{ background: 'linear-gradient(135deg,#4338ca 0%,#2563eb 100%)', color: 'white', py: { xs: 6, md: 10 }, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={800} sx={{ mb: 3 }}>
            Ready to review every module in one place?
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
            Sign in to the dashboard to experience funds, onboarding, compliance, and notifications working together.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button variant="contained" size="large" onClick={() => window.location.href = '/signin'}>
              Go to Dashboard
            </Button>
            <Button variant="outlined" size="large" sx={{ color: 'white', borderColor: 'white' }} onClick={() => window.location.href = '/portfolio'}>
              Preview Portfolio View
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
