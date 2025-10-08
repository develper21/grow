// src/components/SchemeHeader.tsx
"use client";

import { useMemo } from "react";
import { Box, Chip, Grid, Paper, Typography, alpha, useTheme, Divider, Stack, Avatar } from "@mui/material";
import { ArrowUpward, TrendingUp } from "@mui/icons-material";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { calculateCAGR } from "@/lib/utils";

dayjs.extend(customParseFormat);

// --- TYPE DEFINITIONS ---
interface NavEntry {
  date: string;
  nav: number;
}

interface SchemeHeaderProps {
  meta: any;
  navHistory: NavEntry[];
}

// --- MAIN COMPONENT ---
export default function SchemeHeader({ meta, navHistory }: SchemeHeaderProps) {
  const theme = useTheme();

  const calculations = useMemo(() => {
    if (!navHistory || navHistory.length < 2) {
      return { oneDayChange: null, fiveYearReturn: null, inceptionDate: meta.date, cagr: null };
    }

    const sortedHistory = [...navHistory].map(d => ({...d, parsedDate: dayjs(d.date, "DD-MM-YYYY")}))
      .sort((a, b) => a.parsedDate.unix() - b.parsedDate.unix());

    const latest = sortedHistory[sortedHistory.length - 1];
    const previous = sortedHistory[sortedHistory.length - 2];
    const oneDayChange = ((latest.nav - previous.nav) / previous.nav) * 100;

    const fiveYearsAgo = latest.parsedDate.subtract(5, 'year');
    const fiveYearStartEntry = sortedHistory.find(entry => !entry.parsedDate.isBefore(fiveYearsAgo));
    
    let fiveYearReturn = null;
    if (fiveYearStartEntry) {
      fiveYearReturn = ((latest.nav - fiveYearStartEntry.nav) / fiveYearStartEntry.nav) * 100;
    }

    const inceptionDate = sortedHistory[0].parsedDate.format("DD MMMM YYYY");

    const firstNav = sortedHistory[0];
    const lastNav = sortedHistory[sortedHistory.length - 1];
    const years = lastNav.parsedDate.diff(firstNav.parsedDate, 'year', true);
    let cagr = null;
    if (years > 0) {
        cagr = calculateCAGR(firstNav.nav, lastNav.nav, years)
    }


    return { 
      latestNav: latest.nav.toFixed(4),
      latestNavDate: latest.parsedDate.format("DD MMM YYYY"),
      oneDayChange: oneDayChange.toFixed(2), 
      fiveYearReturn: fiveYearReturn ? fiveYearReturn.toFixed(2) : null,
      inceptionDate,
      cagr: cagr ? cagr.toFixed(2) : null
    };
  }, [navHistory, meta.date]);

  const { latestNav, latestNavDate, oneDayChange, fiveYearReturn, inceptionDate, cagr } = calculations;
  const fundInitial = meta.fundHouse.charAt(0);

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
      {/* Top Section: Logo, Name, Tags */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'primary.main', fontSize: '1.75rem', fontWeight: 'bold' }}>
            {fundInitial}
        </Avatar>
        <Box>
            <Typography variant="h5" component="h1" fontWeight="700">{meta.schemeName}</Typography>
            <Typography variant="subtitle1" color="text.secondary">Direct - Growth</Typography>
            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label={meta.category.split(' - ')[0]} color="primary" variant="outlined" size="small" />
                <Chip label={meta.category.split(' - ')[1]} variant="outlined" size="small" />
            </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Metrics Stack */}
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={{ xs: 2, sm: 4, md: 6 }}
        justifyContent="space-around"
        flexWrap="wrap"
      >
        {fiveYearReturn && (
          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary" gutterBottom>5 Year Absolute Returns</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
              <Typography variant="h6" fontWeight="700">{fiveYearReturn}%</Typography>
              <ArrowUpward sx={{ fontSize: '1.2rem', ml: 0.5 }} />
            </Box>
          </Box>
        )}

        <Box textAlign="center">
          <Typography variant="body2" color="text.secondary">NAV (₹) on {latestNavDate}</Typography>
          <Typography variant="h6" fontWeight="700">{latestNav}</Typography>
        </Box>

        {oneDayChange && (
          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">1 Day NAV Change</Typography>
             <Box sx={{ display: 'flex', alignItems: 'center', color: parseFloat(oneDayChange) >= 0 ? 'success.main' : 'error.main' }}>
              <Typography variant="h6" fontWeight="700">{`${parseFloat(oneDayChange) > 0 ? '+' : ''}${oneDayChange}%`}</Typography>
              <ArrowUpward sx={{ fontSize: '1.2rem', ml: 0.5 }} />
            </Box>
          </Box>
        )}

        {cagr && (
            <Box textAlign="center">
                <Typography variant="body2" color="text.secondary" gutterBottom>CAGR</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                <Typography variant="h6" fontWeight="700">{cagr}%</Typography>
                <TrendingUp sx={{ fontSize: '1.2rem', ml: 0.5 }} />
                </Box>
            </Box>
        )}
      </Stack>
       
       {/* About Fund Section */}
       <Box sx={{ mt: 3, pt: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" fontWeight="600" gutterBottom>About {meta.schemeName}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          The **{meta.schemeName}** is a **{meta.category}** mutual fund scheme offered by **{meta.fundHouse}**. 
          It was launched on **{inceptionDate}**. Mutual funds of this nature primarily invest in a diversified portfolio 
          according to their stated investment objective.
          <br /><br />
          Investors should evaluate key metrics such as the fund's Assets Under Management (AUM), expense ratio, 
          and portfolio composition to make informed decisions. Past performance, while indicative, is not a guarantee 
          of future returns. It is advisable to align the fund's risk profile with your personal investment goals and horizon.
        </Typography>
       </Box>
    </Paper>
  );
}