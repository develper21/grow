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
  Stack,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  Fade,
  Slide,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SearchIcon from "@mui/icons-material/Search";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import SecurityIcon from "@mui/icons-material/Security";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("");

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
    setDrawerOpen(false);
  };

  const navItems = [
    { label: "Home", path: "/", icon: <TrendingUpIcon sx={{ fontSize: 20 }} /> },
    { label: "Features", path: "/features", icon: <SearchIcon sx={{ fontSize: 20 }} /> },
    { label: "Analytics", path: "/portfolio", icon: <ShowChartIcon sx={{ fontSize: 20 }} /> },
    { label: "Security", path: "/compliance", icon: <SecurityIcon sx={{ fontSize: 20 }} /> },
  ];

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: scrolled 
            ? "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)"
            : "linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.85) 100%)",
          backdropFilter: "blur(20px)",
          borderBottom: scrolled 
            ? "1px solid rgba(34, 211, 238, 0.2)"
            : "1px solid rgba(255, 255, 255, 0.1)",
          color: "#ffffff",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: scrolled 
            ? "0 8px 32px rgba(0, 0, 0, 0.3)"
            : "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar sx={{ py: { xs: 1.5, md: 2 }, px: { xs: 2, md: 4 } }}>
          {/* Logo Section */}
          <Stack direction="row" alignItems="center" sx={{ flexGrow: 1 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                background: "linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
                boxShadow: "0 8px 24px rgba(34, 211, 238, 0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 12px 32px rgba(34, 211, 238, 0.4)",
                },
              }}
              onClick={() => handleNavigation("/")}
            >
              <AccountBalanceIcon sx={{ fontSize: 28, color: "#ffffff" }} />
            </Box>

            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 900,
                letterSpacing: 1,
                background: "linear-gradient(135deg, #ffffff 0%, #22d3ee 50%, #a78bfa 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                cursor: "pointer",
                fontSize: { xs: "1.5rem", md: "1.8rem" },
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateX(2px)",
                },
              }}
              onClick={() => handleNavigation("/")}
            >
              Grow
            </Typography>

            <Chip
              label="..."
              size="small"
              sx={{
                ml: 2,
                bgcolor: alpha("#22d3ee", 0.2),
                color: "#22d3ee",
                fontWeight: 700,
                fontSize: "0.7rem",
                border: "1px solid #22d3ee",
                height: 24,
              }}
            />
          </Stack>

          {/* Desktop Navigation */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: { xs: 1, md: 3 },
              alignItems: "center",
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                startIcon={item.icon}
                sx={{
                  color: router.pathname === item.path ? "#22d3ee" : alpha("#fff", 0.8),
                  fontWeight: router.pathname === item.path ? 700 : 600,
                  fontSize: "0.9rem",
                  textTransform: "none",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: router.pathname === item.path ? "translateX(-50%) scaleX(1)" : "translateX(-50%) scaleX(0)",
                    width: "80%",
                    height: 2,
                    background: "linear-gradient(90deg, #22d3ee 0%, #0891b2 100%)",
                    borderRadius: 1,
                    transition: "transform 0.3s ease",
                  },
                  "&:hover": {
                    backgroundColor: alpha("#22d3ee", 0.1),
                    color: "#22d3ee",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Right Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Search Button (Desktop) */}
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <IconButton
                sx={{
                  color: alpha("#fff", 0.8),
                  bgcolor: alpha("#fff", 0.1),
                  "&:hover": {
                    bgcolor: alpha("#22d3ee", 0.2),
                    color: "#22d3ee",
                    transform: "scale(1.05)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <SearchIcon />
              </IconButton>
            </Box>

            {/* Sign In Button or Mobile Menu */}
            {isMobile ? (
              <IconButton
                edge="end"
                onClick={() => setDrawerOpen(true)}
                sx={{
                  color: "#ffffff",
                  bgcolor: alpha("#fff", 0.1),
                  "&:hover": {
                    bgcolor: alpha("#22d3ee", 0.2),
                    color: "#22d3ee",
                    transform: "scale(1.05)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  onClick={() => router.push("/signup")}
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    py: 1.5,
                    fontSize: "0.9rem",
                    textTransform: "none",
                    fontWeight: 600,
                    borderColor: alpha("#fff", 0.3),
                    color: "#ffffff",
                    "&:hover": {
                      borderColor: "#22d3ee",
                      bgcolor: alpha("#22d3ee", 0.1),
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Sign Up
                </Button>
                <Button
                  variant="contained"
                  onClick={() => router.push("/signin")}
                  endIcon={<TrendingUpIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    py: 1.5,
                    fontSize: "0.9rem",
                    textTransform: "none",
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)",
                    color: "#ffffff",
                    boxShadow: "0 8px 24px rgba(34, 211, 238, 0.3)",
                    "&:hover": {
                      boxShadow: "0 12px 32px rgba(34, 211, 238, 0.4)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Sign In
                </Button>
              </Stack>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 320,
            background: "linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%)",
            backdropFilter: "blur(20px)",
            borderLeft: "1px solid rgba(34, 211, 238, 0.2)",
            borderRadius: "24px 0 0 24px",
          },
        }}
      >
        <Box sx={{ p: 4 }}>
          {/* Mobile Logo Section */}
          <Stack direction="row" alignItems="center" sx={{ mb: 4 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                background: "linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
              }}
            >
              <AccountBalanceIcon sx={{ fontSize: 28, color: "#ffffff" }} />
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                background: "linear-gradient(135deg, #ffffff 0%, #22d3ee 50%, #a78bfa 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Grow
            </Typography>
          </Stack>

          {/* Mobile Navigation Items */}
          <List sx={{ mb: 4 }}>
            {navItems.map((item, index) => (
              <Slide key={item.path} in={drawerOpen} direction="left" timeout={(index + 1) * 100}>
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      borderRadius: 3,
                      py: 2,
                      px: 2,
                      bgcolor: router.pathname === item.path ? alpha("#22d3ee", 0.2) : "transparent",
                      border: router.pathname === item.path ? "1px solid #22d3ee" : "1px solid transparent",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: alpha("#22d3ee", 0.1),
                        border: "1px solid rgba(34, 211, 238, 0.3)",
                      },
                    }}
                  >
                    <Box sx={{ color: router.pathname === item.path ? "#22d3ee" : alpha("#fff", 0.7), mr: 3 }}>
                      {item.icon}
                    </Box>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        sx: {
                          color: router.pathname === item.path ? "#22d3ee" : "#ffffff",
                          fontWeight: router.pathname === item.path ? 700 : 600,
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </Slide>
            ))}
          </List>

          {/* Mobile Action Buttons */}
          <Stack spacing={2}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                setDrawerOpen(false);
                router.push("/signup");
              }}
              sx={{
                borderRadius: 3,
                py: 2,
                fontSize: "1rem",
                textTransform: "none",
                fontWeight: 600,
                borderColor: alpha("#fff", 0.3),
                color: "#ffffff",
                "&:hover": {
                  borderColor: "#22d3ee",
                  bgcolor: alpha("#22d3ee", 0.1),
                },
                transition: "all 0.3s ease",
              }}
            >
              Sign Up
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                setDrawerOpen(false);
                router.push("/signin");
              }}
              endIcon={<TrendingUpIcon sx={{ fontSize: 20 }} />}
              sx={{
                borderRadius: 3,
                py: 2,
                fontSize: "1rem",
                textTransform: "none",
                fontWeight: 700,
                background: "linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)",
                color: "#ffffff",
                boxShadow: "0 8px 24px rgba(34, 211, 238, 0.3)",
                "&:hover": {
                  boxShadow: "0 12px 32px rgba(34, 211, 238, 0.4)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Sign In
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
}
