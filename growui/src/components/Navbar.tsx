"use client";

import React from "react";
import Link from "next/link";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { styled, keyframes } from "@mui/system";

const shine = keyframes`
  0% { background-position: -150% 0; }
  100% { background-position: 150% 0; }
`;

const TypoAppBar = styled(AppBar)(({ theme }) => ({
  background: "#0f1724",
  borderBottom: "1px solid rgba(255,255,255,0.05)",
  color: "#e6eef8",
  backdropFilter: "blur(8px)",
  boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
}));

export default function Navbar() {
  return (
    <TypoAppBar position="static" color="default" elevation={0}>
      <Toolbar sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: 0.3,
              backgroundImage:
                "linear-gradient(90deg, rgba(255,255,255,0.95), rgba(120,200,255,0.9), rgba(255,255,255,0.95))",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              animation: `${shine} 4s linear infinite`,
            }}
          >
            GrowwExplorer
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontFamily: "'Inter', sans-serif",
              opacity: 0.75,
              fontSize: "0.8rem",
            }}
          >
            Curated funds & analysis
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: "flex", gap: 1 }}>
          {[
            { href: "/funds", label: "Funds" },
            { href: "/scheme/118834", label: "Sample Scheme" },
            { href: "/", label: "Home" },
          ].map((item) => (
            <Button
              key={item.href}
              component={Link}
              href={item.href}
              sx={{
                textTransform: "none",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                letterSpacing: 0.2,
                color: "rgba(230,238,248,0.95)",
                position: "relative",
                px: 1.5,
                "&:hover": {
                  transform: "translateY(-3px) scale(1.02)",
                  transition: "transform 300ms ease",
                },
                "&:after": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  bottom: 2,
                  width: "100%",
                  height: 2,
                  borderRadius: 2,
                  transform: "translateY(8px)",
                  background:
                    "linear-gradient(90deg, rgba(120,200,255,0.9), rgba(200,120,255,0.85))",
                  opacity: 0,
                  transition: "opacity 300ms, transform 350ms",
                },
                "&:hover:after": {
                  opacity: 1,
                  transform: "translateY(0px)",
                },
              }}
            >
              <span style={{ fontSize: 13 }}>{item.label}</span>
            </Button>
          ))}
        </Box>
      </Toolbar>
    </TypoAppBar>
  );
}
