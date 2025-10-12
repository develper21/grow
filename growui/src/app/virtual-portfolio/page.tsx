"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Button } from "@mui/material";

export default function VirtualPortfolioPage() {
  const [data, setData] = useState<any[]>([]);
  const userId = "demo-user";

  useEffect(() => {
    fetch(`/api/virtual-portfolio?userId=${encodeURIComponent(userId)}`)
      .then((r) => r.json())
      .then((j) => setData(j.data || []))
      .catch(console.error);
  }, []);

  return (
    <>
      <Box sx={{ p: 4, background: "#07101a", minHeight: "100vh" }}>
        <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", color: "#fff", mb: 2 }}>
          Virtual Portfolio
        </Typography>

        <Box sx={{ display: "grid", gap: 2 }}>
          {data.map((p) => (
            <Paper key={p._id} sx={{ p: 2, background: "linear-gradient(180deg,#0b1720,#07101a)" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: "#e6eef8" }}>{p.fund?.name}</Typography>
                  <Typography variant="caption" sx={{ color: "rgba(230,238,248,0.7)" }}>
                    Invested: ₹{p.invested} — Current: ₹{p.currentValue}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography sx={{ color: p.gain >= 0 ? "#8ef2c7" : "#ff7d7d", fontWeight: 700 }}>
                    {p.gain >= 0 ? "+" : ""}{p.gain} ({p.gainPct}%)
                  </Typography>
                  <Typography variant="caption" sx={{ color: "rgba(230,238,248,0.7)" }}>
                    Units: {p.totalUnits}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
    </>
  );
}
