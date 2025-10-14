"use client";
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import { useRouter } from "next/router";

interface NavbarProps {
  navItems?: Array<{ label: string; path: string }>;
}

export default function Navbar({ navItems = [
  { label: "Home", path: "/" },
  { label: "Explore Funds", path: "/funds" },
  { label: "Watchlist", path: "/watchlist" },
  { label: "Virtual Portfolio", path: "/virtual_portfolio" },
] }: NavbarProps) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
    setDrawerOpen(false);
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };

  const handleSignOut = () => {
    localStorage.removeItem('user');
    setUser(null);
    setProfileAnchor(null);
    router.push('/');
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          color: "text.primary",
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <TrendingUpIcon
            sx={{
              mr: 1.5,
              fontSize: 32,
              color: "primary.main",
            }}
          />

          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: 0.5,
              color: "text.primary",
              cursor: "pointer",
              fontSize: "1.5rem",
            }}
            onClick={() => handleNavigation("/")}
          >
            Grow
          </Typography>

          {isMobile ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {user && (
                <Chip
                  avatar={<Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem' }}>{user.name.charAt(0).toUpperCase()}</Avatar>}
                  label={user.name}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                    fontWeight: 600,
                  }}
                />
              )}
              <IconButton
                edge="end"
                onClick={() => setDrawerOpen(true)}
                sx={{
                  color: "text.primary",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    position: "relative",
                    fontWeight: router.pathname === item.path ? 600 : 500,
                    color: router.pathname === item.path ? "primary.main" : "text.primary",
                    transition: "all 0.3s ease",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    "&:before": {
                      content: '""',
                      position: "absolute",
                      width: "100%",
                      height: "2px",
                      bottom: 8,
                      left: 0,
                      background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                      transform: "scaleX(0)",
                      transformOrigin: "right",
                      transition: "transform 0.3s ease",
                    },
                    "&:hover:before": {
                      transform: "scaleX(1)",
                      transformOrigin: "left",
                    },
                    "&:hover": {
                      backgroundColor: "rgba(25, 118, 210, 0.08)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}

              {/* User Profile Section */}
              {user ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip
                    avatar={<Avatar sx={{ width: 28, height: 28, fontSize: '0.9rem' }}>{user.name.charAt(0).toUpperCase()}</Avatar>}
                    label={user.name}
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                    onClick={handleProfileClick}
                  />
                  <Menu
                    anchorEl={profileAnchor}
                    open={Boolean(profileAnchor)}
                    onClose={handleProfileClose}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        minWidth: 200,
                        borderRadius: 2,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                      }
                    }}
                  >
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                      <Avatar sx={{
                        width: 48,
                        height: 48,
                        mx: 'auto',
                        mb: 1,
                        fontSize: '1.2rem',
                        bgcolor: 'primary.main'
                      }}>
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {user.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {user.email}
                      </Typography>
                    </Box>
                    <Divider />
                    <MenuItem onClick={() => { handleProfileClose(); router.push('/settings'); }}>
                      <SettingsIcon sx={{ mr: 1, fontSize: 18 }} />
                      Settings
                    </MenuItem>
                    <MenuItem onClick={handleSignOut}>
                      <LogoutIcon sx={{ mr: 1, fontSize: 18 }} />
                      Sign Out
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={() => router.push('/signin')}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1,
                      fontSize: '0.85rem',
                      textTransform: 'none',
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => router.push('/signup')}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1,
                      fontSize: '0.85rem',
                      textTransform: 'none',
                    }}
                  >
                    Sign Up
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            borderRadius: "16px 0 0 16px",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* User Profile Section */}
          {user ? (
            <Box sx={{ textAlign: 'center', mb: 3, p: 2, bgcolor: 'rgba(255, 255, 255, 0.8)', borderRadius: 2 }}>
              <Avatar sx={{
                width: 48,
                height: 48,
                mx: 'auto',
                mb: 1,
                fontSize: '1.2rem',
                bgcolor: 'primary.main'
              }}>
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                {user.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {user.email}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                Sign in to access all features
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => { setDrawerOpen(false); router.push('/signin'); }}
                  sx={{ borderRadius: 2 }}
                >
                  Sign In
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => { setDrawerOpen(false); router.push('/signup'); }}
                  sx={{ borderRadius: 2 }}
                >
                  Sign Up
                </Button>
              </Box>
            </Box>
          )}

          <Typography variant="h6" sx={{ mb: 3, textAlign: "center", fontWeight: 700 }}>
            Navigation
          </Typography>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={router.pathname === item.path}
                  sx={{
                    borderRadius: 2,
                    "&.Mui-selected": {
                      background: "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
                      color: "white",
                      "&:hover": {
                        background: "linear-gradient(90deg, #1565c0 0%, #1976d2 100%)",
                      },
                    },
                    "&:hover": {
                      backgroundColor: "rgba(25, 118, 210, 0.08)",
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    sx={{
                      textAlign: "center",
                      fontWeight: router.pathname === item.path ? 600 : 500,
                      "& .MuiListItemText-primary": {
                        fontSize: "1rem",
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}

            {user && (
              <>
                <Divider sx={{ my: 2 }} />
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    onClick={() => { handleNavigation('/settings'); setDrawerOpen(false); }}
                    sx={{ borderRadius: 2 }}
                  >
                    <ListItemText
                      primary="Settings"
                      sx={{ textAlign: "center" }}
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    onClick={handleSignOut}
                    sx={{
                      borderRadius: 2,
                      color: 'error.main',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                      },
                    }}
                  >
                    <ListItemText
                      primary="Sign Out"
                      sx={{ textAlign: "center" }}
                    />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
