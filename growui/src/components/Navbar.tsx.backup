"use client";
import React, { useState } from "react";
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
  Stack,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleNavigation = (path: string) => {
    router.push(path);
    setDrawerOpen(false);
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

          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              display: { xs: 'none', md: 'flex' },
              gap: 2,
            }}
          >
            <Button
              onClick={() => handleNavigation('/')}
              sx={{ color: router.pathname === '/' ? 'primary.main' : 'text.primary', fontWeight: 600 }}
            >
              Home
            </Button>
            <Button
              onClick={() => handleNavigation('/features')}
              sx={{ color: router.pathname === '/features' ? 'primary.main' : 'text.primary', fontWeight: 600 }}
            >
              Features
            </Button>
          </Box>

          {isMobile ? (
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
          ) : (
            <Button
              variant="contained"
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
        <Box sx={{ p: 3 }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigation('/')}> 
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigation('/features')}>
                <ListItemText primary="Features" />
              </ListItemButton>
            </ListItem>
          </List>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              setDrawerOpen(false);
              router.push('/signin');
            }}
            sx={{ mt: 2, borderRadius: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
