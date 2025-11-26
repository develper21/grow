import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Stack,
  Button,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/SpaceDashboardRounded';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import SavingsIcon from '@mui/icons-material/Savings';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SecurityIcon from '@mui/icons-material/Security';
import ShowChartIcon from '@mui/icons-material/ShowChart';

const quickActions = [
  {
    label: 'Virtual Portfolio',
    copy: 'Curate strategies across funds and mandates with realtime analytics.',
    href: '/portfolio',
    icon: <ShowChartIcon fontSize="small" />,
  },
  {
    label: 'Watchlist Pulse',
    copy: 'Get AI nudges on funds breaching guardrails or outperforming peers.',
    href: '/watchlist',
    icon: <WatchLaterIcon fontSize="small" />,
  },
  {
    label: 'Order Studio',
    copy: 'Deploy SIPs, place lumpsum blocks, and monitor execution health.',
    href: '/orders',
    icon: <SavingsIcon fontSize="small" />,
  },
  {
    label: 'Statements & Tax',
    copy: 'Generate audit-grade statements and fiscal insights instantly.',
    href: '/statements',
    icon: <AssignmentTurnedInIcon fontSize="small" />,
  },
  {
    label: 'Compliance Command',
    copy: 'Map every workflow to policy with one-click evidence trails.',
    href: '/compliance',
    icon: <SecurityIcon fontSize="small" />,
  },
  {
    label: 'Support Orbit',
    copy: 'White-glove support, release notes, and bespoke playbooks.',
    href: '/support',
    icon: <SupportAgentIcon fontSize="small" />,
  },
];

const signalMetrics = [
  { label: 'Managed AUM', value: '₹42.7 Cr', delta: '+4.1% WoW' },
  { label: 'Active SIPs', value: '318', delta: '+27 new' },
  { label: 'Watchlist Alerts', value: '12', delta: '3 critical' },
];

export default function UnifiedDashboard() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box
          sx={{
            borderRadius: 5,
            px: { xs: 3, md: 6 },
            py: { xs: 5, md: 7 },
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#1d2b5fff',
          }}
        >
          {/* Exact Windsurf Animated Background */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(146.64% 134.09% at 17.84% 0%, #FFE47A 0.1%, #FB9CE5 17.31%, #096FFF 29.33%, #011C42 60.58%)',
              backgroundSize: '200% 200%',
              animation: 'windsurfGradient 15s ease-in-out infinite',
              zIndex: 0,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(247.5% 100% at 50% 0%, rgb(255, 232, 142) 14.6%, rgb(251, 156, 229) 34.58%, rgb(9, 111, 255) 55.65%, rgb(1, 28, 66) 88.45%)',
                backgroundSize: '300% 300%',
                animation: 'windsurfGradient2 20s ease-in-out infinite reverse',
                opacity: 0.7,
                mixBlendMode: 'screen',
              },
              '@keyframes windsurfGradient': {
                '0%': { backgroundPosition: '0% 0%' },
                '50%': { backgroundPosition: '100% 100%' },
                '100%': { backgroundPosition: '0% 0%' },
              },
              '@keyframes windsurfGradient2': {
                '0%': { backgroundPosition: '0% 0%' },
                '33%': { backgroundPosition: '50% 30%' },
                '66%': { backgroundPosition: '100% 60%' },
                '100%': { backgroundPosition: '0% 0%' },
              },
            }}
          />
          <Box sx={{ maxWidth: 640, position: 'relative', zIndex: 1 }}>
            <Typography variant="overline" sx={{ letterSpacing: '0.45em', color: alpha('#f8fafc', 0.8) }}>
              COMMAND DECK
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              Orchestrate capital, compliance, and care from one canvas.
            </Typography>
            <Typography variant="body1" sx={{ color: alpha('#f8fafc', 0.8) }}>
              Every workflow — from fund discovery to audit trails — now lives in a single immersive workspace tuned for modern wealth teams.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={4}>
              <Link href="/funds" passHref legacyBehavior>
                <Button component="a" variant="contained" color="primary">
                  Launch Portfolio Lab
                </Button>
              </Link>
              <Link href="/support" passHref legacyBehavior>
                <Button
                  component="a"
                  variant="outlined"
                  sx={{
                    borderColor: alpha('#f8fafc', 0.4),
                    color: '#f8fafc',
                    '&:hover': {
                      borderColor: '#f8fafc',
                      backgroundColor: alpha('#f8fafc', 0.08),
                    },
                  }}
                >
                  View Release Notes
                </Button>
              </Link>
            </Stack>
          </Box>

          <Grid container spacing={2} mt={4}>
            {signalMetrics.map((metric) => (
              <Grid item xs={12} sm={4} key={metric.label}>
                <Box
                  sx={{
                    borderRadius: 4,
                    p: 2.5,
                    backgroundColor: alpha('#050816', 0.25),
                    border: '1px solid rgba(248,250,252,0.2)',
                  }}
                >
                  <Typography variant="caption" sx={{ letterSpacing: '0.2em', color: alpha('#f8fafc', 0.7) }}>
                    {metric.label}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                    {metric.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#67e8f9' }}>
                    {metric.delta}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 5, p: 3 }}>
            <CardContent sx={{ p: 0 }}>
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <DashboardIcon sx={{ color: '#22d3ee' }} />
                <Box>
                  <Typography variant="overline" sx={{ letterSpacing: '0.3em', color: 'text.secondary' }}>
                    Launchpads
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    Quick Actions
                  </Typography>
                </Box>
              </Stack>
              <Grid container spacing={2}>
                {quickActions.map((action) => (
                  <Grid item xs={12} sm={6} key={action.label}>
                    <Link href={action.href} passHref legacyBehavior>
                      <ListItemButton
                        component="a"
                        sx={{
                          borderRadius: 4,
                          border: '1px solid rgba(124,93,250,0.25)',
                          bgcolor: alpha('#0f172a', 0.6),
                          minHeight: 110,
                          alignItems: 'flex-start',
                          '&:hover': {
                            bgcolor: alpha('#1d2671', 0.5),
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40, color: '#22d3ee' }}>{action.icon}</ListItemIcon>
                        <ListItemText
                          primary={action.label}
                          secondary={action.copy}
                          primaryTypographyProps={{ fontWeight: 600 }}
                          secondaryTypographyProps={{ color: 'text.secondary' }}
                        />
                      </ListItemButton>
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 5,
              height: '100%',
              background: 'linear-gradient(180deg, rgba(16,22,38,0.95), rgba(16,22,38,0.7))',
            }}
          >
            <CardContent>
              <Stack spacing={1.5}>
                <Typography variant="overline" sx={{ letterSpacing: '0.4em', color: 'text.secondary' }}>
                  SESSION IDENTITY
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {session.user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {session.user.email}
                </Typography>
                <Chip
                  label={session.user.role?.toUpperCase() ?? 'INVESTOR'}
                  color="secondary"
                  sx={{ alignSelf: 'flex-start', fontWeight: 600 }}
                />
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
                <Typography variant="body2" color="text.secondary">
                  Mission Control
                </Typography>
                <Stack spacing={1}>
                  <Link href="/orders" passHref legacyBehavior>
                    <Button component="a" variant="text" sx={{ justifyContent: 'flex-start', color: '#67e8f9' }}>
                      Review recent orders
                    </Button>
                  </Link>
                  <Link href="/watchlist" passHref legacyBehavior>
                    <Button component="a" variant="text" sx={{ justifyContent: 'flex-start', color: '#fda4af' }}>
                      Update watchlist targets
                    </Button>
                  </Link>
                  <Link href="/statements" passHref legacyBehavior>
                    <Button component="a" variant="text" sx={{ justifyContent: 'flex-start', color: '#c4b5fd' }}>
                      Generate statement
                    </Button>
                  </Link>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 5 }}>
            <CardContent>
              <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                <SavingsIcon sx={{ color: '#10b981' }} />
                <Box>
                  <Typography variant="overline" sx={{ letterSpacing: '0.3em', color: 'text.secondary' }}>
                    Execution
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    Orders & SIPs
                  </Typography>
                </Box>
              </Stack>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Deploy SIPs, place one-click lumpsum instructions, and audit execution health across fund houses.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Link href="/orders" passHref legacyBehavior>
                  <Button component="a" variant="contained">
                    Go to Order Book
                  </Button>
                </Link>
                <Link href="/funds" passHref legacyBehavior>
                  <Button component="a" variant="outlined">
                    Start New SIP
                  </Button>
                </Link>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 5 }}>
            <CardContent>
              <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                <SupportAgentIcon sx={{ color: '#f472b6' }} />
                <Box>
                  <Typography variant="overline" sx={{ letterSpacing: '0.3em', color: 'text.secondary' }}>
                    Ops & Care
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    Help & Notifications
                  </Typography>
                </Box>
              </Stack>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Raise white-glove support tickets, review policy updates, and configure notification cadences.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Link href="/support" passHref legacyBehavior>
                  <Button component="a" variant="contained">
                    Get Support
                  </Button>
                </Link>
                <Link href="/status" passHref legacyBehavior>
                  <Button component="a" variant="outlined">
                    View Updates
                  </Button>
                </Link>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
  );
}
