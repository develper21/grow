"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Button, Divider } from "@mui/material";

type WatchItem = {
  externalFundId: string;
  fund: { name: string; latestNav?: number; latestNavDate?: string } | null;
  performance: any;
  createdAt: string;
};

export default function WatchlistPage() {
  const [data, setData] = useState<WatchItem[]>([]);
  const userId = "demo-user";

  useEffect(() => {
    fetch(`/api/watchlist?userId=${encodeURIComponent(userId)}`)
      .then((r) => r.json())
      .then((j) => setData(j.data || []))
      .catch(console.error);
  }, []);

  return (
    <>
      <Box sx={{ p: 4, background: "#07101a", minHeight: "100vh" }}>
        <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", color: "#fff", mb: 2 }}>
          Your Watchlist
        </Typography>

        <Box sx={{ display: "grid", gap: 2 }}>
          {data.map((item) => (
            <Paper key={item.externalFundId} sx={{ p: 2, background: "linear-gradient(180deg,#0b1720,#07101a)" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: "#e6eef8" }}>{item.fund?.name || item.externalFundId}</Typography>
                  <Typography variant="caption" sx={{ color: "rgba(230,238,248,0.7)" }}>
                    NAV: {item.fund?.latestNav ?? "—"} ({item.fund?.latestNavDate ?? "—"})
                  </Typography>
                </Box>

                <Box sx={{ textAlign: "right" }}>
                  {item.performance ? (
                    <>
                      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
                        1d: <strong>{item.performance.changes["1d"] ?? "—"}%</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
                        1m: <strong>{item.performance.changes["1m"] ?? "—"}%</strong>
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="caption">No history</Typography>
                  )}
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
    </>
  );
}
