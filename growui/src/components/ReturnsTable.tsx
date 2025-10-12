"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Box,
  Typography,
  Paper,
  useTheme,
  alpha,
} from "@mui/material";
import {
  ArrowUpward,
  ArrowDownward,
  TrendingUp as PerformanceIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

interface NavEntry {
  date: dayjs.Dayjs;
  nav: number;
}

interface ReturnData {
  simpleReturn: number;
  annualizedReturn?: number;
}

const PERIODS = ["1m", "3m", "6m", "1y", "3y", "5y", "all"] as const;
type Period = (typeof PERIODS)[number];

const formatPercent = (val: number | undefined | null): string => {
  if (val === undefined || val === null || isNaN(val)) return "N/A";
  return `${(val * 100).toFixed(2)}%`;
};

const getReturnColor = (value: number, theme: any) => {
  if (value > 0) return theme.palette.success.main;
  if (value < 0) return theme.palette.error.main;
  return theme.palette.text.secondary;
};

function calculatePeriodReturns(
  navHistory: NavEntry[],
  period: Period
): ReturnData | null {
  if (navHistory.length < 2) return null;

  const latestNavEntry = navHistory[navHistory.length - 1];
  let startNavEntry: NavEntry | undefined;

  if (period === "all") {
    startNavEntry = navHistory[0];
  } else {
    const durationMatch = period.match(/^(\d+)(m|y)$/);
    if (!durationMatch) return null;

    const value = parseInt(durationMatch[1], 10);
    const unit = durationMatch[2] as "m" | "y";
    const targetStartDate = latestNavEntry.date.subtract(value, unit);

    startNavEntry = navHistory.find((entry) => !entry.date.isBefore(targetStartDate));
  }

  if (!startNavEntry) {
    return null;
  }

  const endNAV = latestNavEntry.nav;
  const startNAV = startNavEntry.nav;
  const years = latestNavEntry.date.diff(startNavEntry.date, "year", true);
  const simpleReturn = (endNAV - startNAV) / startNAV;

  let annualizedReturn: number | undefined;
  if (years >= 1) {
    annualizedReturn = Math.pow(endNAV / startNAV, 1 / years) - 1;
  }

  return { simpleReturn, annualizedReturn };
}

const StyledReturnCell = ({ value }: { value: number | undefined | null }) => {
  const theme = useTheme();

  if (value === undefined || value === null || isNaN(value)) {
    return (
      <TableCell
        align="right"
        sx={{
          color: theme.palette.text.secondary,
          fontWeight: 500,
          fontStyle: "italic",
          fontSize: "0.875rem",
        }}
      >
        N/A
      </TableCell>
    );
  }

  const color = getReturnColor(value, theme);
  const formattedValue = formatPercent(value);
  const IconComponent = value > 0 ? ArrowUpward : ArrowDownward;

  return (
    <TableCell
      align="right"
      sx={{
        color: color,
        fontWeight: 600,
        fontSize: "0.9rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 0.5,
        }}
      >
        {value !== 0 && <IconComponent sx={{ fontSize: 16 }} />}
        {formattedValue}
      </Box>
    </TableCell>
  );
};


export default function ReturnsTable({ code }: { code: string }) {
  const [returnsMap, setReturnsMap] = useState<Partial<Record<Period, ReturnData | null>>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!code) return;

    const fetchAndCalculateReturns = async () => {
      setLoading(true);
      setError(null);
      setReturnsMap({});

      try {
        const res = await fetch(`https://api.mfapi.in/mf/${code}`);
        if (!res.ok) {
          throw new Error("Failed to fetch NAV data from the API.");
        }
        const schemeData = await res.json();

        if (!schemeData.data || schemeData.data.length === 0) {
          throw new Error("No NAV history available for this fund.");
        }
        
        const sortedNavHistory: NavEntry[] = schemeData.data
          .map((d: any) => ({
            date: dayjs(d.date, "DD-MM-YYYY"),
            nav: parseFloat(d.nav),
          }))
          .filter((d: NavEntry) => d.date.isValid() && !isNaN(d.nav) && d.nav > 0)
          .sort((a: NavEntry, b: NavEntry) => a.date.unix() - b.date.unix());

        const calculatedReturns: Partial<Record<Period, ReturnData | null>> = {};
        for (const period of PERIODS) {
          calculatedReturns[period] = calculatePeriodReturns(sortedNavHistory, period);
        }
        
        setReturnsMap(calculatedReturns);

      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
        console.error("Error fetching or calculating returns:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndCalculateReturns();
  }, [code]);
  
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 4,
          minHeight: 150,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <CircularProgress size={32} color="primary" />
        <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
          Calculating returns...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          p: 3,
          border: `1px dashed ${theme.palette.error.main}`,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.error.main, 0.05),
        }}
      >
        <Typography color="error" variant="body2" fontWeight={600}>
          ⚠️ Error Loading Data
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[1],
        width: "100%",
      }}
    >
      <Table size="medium" sx={{ "& .MuiTableCell-root": { py: 1.5, px: { xs: 1.5, sm: 2 } } }}>
        <TableHead
          sx={{
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            borderBottom: `2px solid ${theme.palette.primary.main}`,
          }}
        >
          <TableRow>
            <TableCell sx={{ fontWeight: "700", color: theme.palette.text.primary }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PerformanceIcon fontSize="small" color="primary" />
                Period
              </Box>
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "700", color: theme.palette.text.primary, whiteSpace: "nowrap" }}>
              Absolute
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "700", color: theme.palette.text.primary, whiteSpace: "nowrap" }}>
              Annualized
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {PERIODS.map((period) => {
            const data = returnsMap[period];
            const isLongTerm = period.endsWith("y") || period === "all";
            
            return (
              <TableRow
                key={period}
                sx={{
                  "&:nth-of-type(even)": {
                    backgroundColor: theme.palette.action.hover,
                  },
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell component="th" scope="row" sx={{ fontWeight: isLongTerm ? 600 : 500, textTransform: "uppercase" }}>
                  {period}
                </TableCell>
                <StyledReturnCell value={data?.simpleReturn} />
                <StyledReturnCell value={data?.annualizedReturn} />
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}