"use client";
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Toolbar, 
  Typography, 
  Avatar, 
  IconButton, 
  Divider, 
  Badge,
  CircularProgress,
  AppBar,
  Tooltip,
  Stack,
  Chip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/SpaceDashboardRounded';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import LogoutIcon from '@mui/icons-material/Logout';
import { signOut } from 'next-auth/react';

const drawerWidth = 260;

const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Virtual Portfolio', icon: <ShowChartIcon />, path: '/portfolio' },
  { text: 'Watchlist', icon: <WatchLaterIcon />, path: '/watchlist' },
  { text: 'Orders', icon: <AssignmentTurnedInIcon />, path: '/orders' },
  { text: 'Funds', icon: <AccountBalanceIcon />, path: '/funds' },
  { text: 'Statements', icon: <AssignmentTurnedInIcon />, path: '/statements' },
  { text: 'Compliance', icon: <SecurityIcon />, path: '/compliance' },
  { text: 'Support', icon: <SupportAgentIcon />, path: '/support' },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const userName = session?.user?.name ?? 'Investor';
  const userInitials = userName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/signin');
    }
  }, [session, status, router]);

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  if (status === 'loading' || !session) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ justifyContent: 'flex-start', py: 3, px: 3 }}>
        <Box>
          <Typography variant="subtitle2" sx={{ letterSpacing: '0.5em', color: 'text.secondary' }}>
            GROW
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Command</Typography>
          <Typography variant="caption" color="text.secondary">
            Wealth OS
          </Typography>
        </Box>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
      <List sx={{ flexGrow: 1, mt: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={router.pathname === item.path}
              onClick={() => {
                router.push(item.path);
                if (mobileOpen) handleDrawerClose();
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 44 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontWeight: 600, letterSpacing: '0.05em' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ px: 3, pb: 4 }}>
        <Stack spacing={0.5}>
          <Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: '0.2em' }}>
            SESSION
          </Typography>
          <Typography variant="body1" fontWeight={600}>
            {userName}
          </Typography>
          <Chip
            label={session.user?.role?.toUpperCase() ?? 'INVESTOR'}
            size="small"
            sx={{ alignSelf: 'flex-start', mt: 0.5 }}
          />
        </Stack>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            bgcolor: 'background.paper',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, rgba(15,23,42,0.9) 0%, rgba(5,8,22,0.98) 80%)',
            borderRight: '1px solid rgba(255,255,255,0.08)',
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          overflow: 'hidden',
          background: 'radial-gradient(circle at 20% 20%, rgba(124,93,250,0.1), transparent 40%)',
        }}
      >
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            top: 0,
            backgroundColor: 'rgba(15,23,42,0.8)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 10px 50px rgba(5,8,22,0.35)',
            px: { xs: 1.5, md: 4 },
          }}
        >
          <Toolbar disableGutters sx={{ py: 2 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="overline" sx={{ letterSpacing: '0.4em', color: 'text.secondary' }}>
                {title ? title.toUpperCase() : 'DASHBOARD'}
              </Typography>
              <Typography variant="h5" fontWeight={600}>
                {`Hello, ${userName.split(' ')[0]}`}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Tooltip title="Notifications">
                <IconButton color="inherit">
                  <Badge badgeContent={3} color="error">
                    <NotificationsNoneIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Sign out">
                <IconButton onClick={() => signOut()} color="inherit">
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={session.user?.name || 'Profile'}>
                <Avatar
                  alt={session.user?.name || 'User'}
                  src={session.user?.image || undefined}
                  sx={{ width: 40, height: 40, fontWeight: 700, cursor: 'pointer' }}
                  onClick={() => router.push('/profile')}
                >
                  {userInitials}
                </Avatar>
              </Tooltip>
            </Stack>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            height: 'calc(100vh - 88px)',
            overflowY: 'auto',
            px: { xs: 2, md: 4 },
            py: { xs: 3, md: 4 },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
