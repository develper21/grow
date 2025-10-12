"use client";

import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

interface NavEntry {
  date: dayjs.Dayjs;
  nav: number;
}

interface ProcessedReturns {
  year: number;
  monthly: (number | null)[];
  annual: number | null;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const ReturnValue = ({ value }: { value: number | null }) => {
  const theme = useTheme();

  if (value === null || typeof value === "undefined" || isNaN(value)) {
    return <Typography component="span">NA</Typography>;
  }

  const color =
    value > 0
      ? theme.palette.success.main
      : value < 0
      ? theme.palette.error.main
      : theme.palette.text.secondary;

  return (
    <Typography component="span" sx={{ color, fontWeight: 500 }}>
      {(value * 100).toFixed(2)}%
    </Typography>
  );
};

function calculateReturnsGrid(navHistory: NavEntry[]): ProcessedReturns[] {
  if (navHistory.length === 0) return [];

  const lastNavOfMonth = new Map<string, number>();
  navHistory.forEach((entry) => {
    const key = entry.date.format("YYYY-MM");
    lastNavOfMonth.set(key, entry.nav);
  });

  const yearlyData = new Map<
    number,
    { monthly: (number | null)[]; annual: number | null }
  >();

  const sortedMonthKeys = Array.from(lastNavOfMonth.keys()).sort();

  const firstDate = dayjs(sortedMonthKeys[0], "YYYY-MM");
  const monthBeforeFirstKey = firstDate.subtract(1, "month").format("YYYY-MM");
  lastNavOfMonth.set(monthBeforeFirstKey, navHistory[0].nav);
  sortedMonthKeys.unshift(monthBeforeFirstKey);

  for (let i = 1; i < sortedMonthKeys.length; i++) {
    const currentMonthKey = sortedMonthKeys[i];
    const prevMonthKey = sortedMonthKeys[i - 1];

    const [yearStr, monthStr] = currentMonthKey.split("-");
    const year = Number(yearStr);
    const month = Number(monthStr);

    if (!yearlyData.has(year)) {
      yearlyData.set(year, { monthly: Array(12).fill(null), annual: null });
    }

    const currentNav = lastNavOfMonth.get(currentMonthKey);
    const prevNav = lastNavOfMonth.get(prevMonthKey);

    if (typeof currentNav !== "undefined" && typeof prevNav !== "undefined" && prevNav !== 0) {
      const monthlyReturn = (currentNav - prevNav) / prevNav;
      const yearData = yearlyData.get(year);
      if (yearData) {
        yearData.monthly[month - 1] = monthlyReturn;
      }
    }
  }

  const sortedYears = Array.from(yearlyData.keys()).sort();
  for (let i = 0; i < sortedYears.length; i++) {
    const year = sortedYears[i];
    const prevYear = year - 1;

    const yearEndKey = `${year}-12`;
    const prevYearEndKey = `${prevYear}-12`;

    let yearEndNav = lastNavOfMonth.get(yearEndKey);
    if (!yearEndNav) {
      const lastAvailableMonth = sortedMonthKeys[sortedMonthKeys.length - 1];
      if (lastAvailableMonth.startsWith(String(year))) {
        yearEndNav = lastNavOfMonth.get(lastAvailableMonth);
      }
    }

    let yearStartNav = lastNavOfMonth.get(prevYearEndKey);
    if (!yearStartNav && i === 0) {
      yearStartNav = navHistory[0].nav;
    }

    if (
      typeof yearEndNav !== "undefined" &&
      typeof yearStartNav !== "undefined" &&
      yearStartNav !== 0
    ) {
      const annualReturn = (yearEndNav - yearStartNav) / yearStartNav;
      const yearData = yearlyData.get(year);
      if (yearData) {
        yearData.annual = annualReturn;
      }
    }
  }

  return Array.from(yearlyData.entries())
    .map(([year, data]) => ({ year, ...data }))
    .sort((a, b) => b.year - a.year);
}

export default function HistoricalReturnsGrid({ code }: { code: string }) {
  const [returns, setReturns] = useState<ProcessedReturns[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!code) return;

    const fetchAndProcessData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://api.mfapi.in/mf/${code}`);
        if (!res.ok) throw new Error("Failed to fetch scheme data.");

        const json = await res.json();
        if (!json.data || json.data.length === 0) {
          throw new Error("No NAV history available.");
        }

        const sortedNavHistory: NavEntry[] = json.data
          .map((d: any) => ({
            date: dayjs(d.date, "DD-MM-YYYY"),
            nav: parseFloat(d.nav),
          }))
          .filter((d: NavEntry) => d.date.isValid() && !isNaN(d.nav))
          .sort((a: NavEntry, b: NavEntry) => a.date.unix() - b.date.unix());

        const gridData = calculateReturnsGrid(sortedNavHistory);
        setReturns(gridData);
      } catch (err: any) {
        setError(err?.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessData();
  }, [code]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading Historical Returns...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
      <TableContainer>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, minWidth: 80 }}>Year</TableCell>
              {MONTHS.map((month) => (
                <TableCell
                  key={month}
                  align="right"
                  sx={{ fontWeight: 700, minWidth: 80 }}
                >
                  {month}
                </TableCell>
              ))}
              <TableCell
                align="right"
                sx={{
                  fontWeight: 700,
                  minWidth: 90,
                  backgroundColor: alpha(theme.palette.primary.light, 0.1),
                }}
              >
                Annually
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {returns.map(({ year, monthly, annual }) => (
              <TableRow key={year} hover>
                <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                  {year}
                </TableCell>

                {monthly.map((returnValue, index) => (
                  <TableCell key={index} align="right">
                    <ReturnValue value={returnValue} />
                  </TableCell>
                ))}

                <TableCell
                  align="right"
                  sx={{ backgroundColor: alpha(theme.palette.grey[500], 0.05) }}
                >
                  <ReturnValue value={annual} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
