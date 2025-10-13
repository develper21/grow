"use client";
import React from "react";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
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
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
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
          </List>
        </Box>
      </Drawer>
    </>
  );
}
