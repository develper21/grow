"use client"; // Mark this as a Client Component

import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link";

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Mutual Fund Explorer
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" component={Link} href="/funds">
            Funds
          </Button>

          {/* Example: You can add more routes */}
          <Button color="inherit" component={Link} href="/scheme/118834">
            Sample Scheme
          </Button>

          <Button color="inherit" component={Link} href="/">
            Home
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}