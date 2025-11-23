"use client";
import React from "react";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const showPublicChrome = router.pathname === "/" || router.pathname === "/features";
  const isDashboard = router.pathname === "/dashboard";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      {showPublicChrome && <Navbar />}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          minHeight: "100vh",
          overflowX: "hidden",
          pt: showPublicChrome || isDashboard ? 0 : 4,
        }}
      >
        {children}
      </Box>

      {showPublicChrome && <Footer />}
    </Box>
  );
}
