// src/components/HistoricalReturnsGrid.tsx
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

// --- TYPE DEFINITIONS ---
interface NavEntry {
  date: dayjs.Dayjs;
  nav: number;
}

interface ProcessedReturns {
  year: number;
  monthly: (number | null)[];
  annual: number | null;
}

// --- CONSTANTS ---
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// --- HELPER & CALCULATION LOGIC ---

/**
 * Custom styled cell for displaying return percentages.
 * Colors are based on positive (green) or negative (red) values.
 */
const ReturnCell = ({ value }: { value: number | null }) => {
  const theme = useTheme();

  if (value === null || typeof value === "undefined" || isNaN(value)) {
    return <TableCell align="right">NA</TableCell>;
  }

  const color =
    value > 0
      ? theme.palette.success.main
      : value < 0
      ? theme.palette.error.main
      : theme.palette.text.secondary;

  return (
    <TableCell align="right" sx={{ color, fontWeight: 500 }}>
      {(value * 100).toFixed(2)}%
    </TableCell>
  );
};


/**
 * Processes the entire NAV history to build a grid of monthly and annual returns.
 * @param navHistory - NAV history sorted from OLDEST to NEWEST.
 * @returns An array of processed returns, one object per year.
 */
function calculateReturnsGrid(navHistory: NavEntry[]): ProcessedReturns[] {
    if (navHistory.length === 0) return [];

    // Step 1: Create a map of the last NAV for each month
    const lastNavOfMonth = new Map<string, number>();
    navHistory.forEach(entry => {
        const key = entry.date.format('YYYY-MM');
        lastNavOfMonth.set(key, entry.nav);
    });

    const yearlyData = new Map<number, { monthly: (number | null)[], annual: number | null }>();

    // Step 2: Calculate monthly returns
    const sortedMonthKeys = Array.from(lastNavOfMonth.keys()).sort();
    
    // Add a synthetic entry for the month before the first data point to calculate the first month's return
    const firstDate = dayjs(sortedMonthKeys[0], 'YYYY-MM');
    const monthBeforeFirstKey = firstDate.subtract(1, 'month').format('YYYY-MM');
    // Use the very first NAV as the starting point for the first month's calculation
    lastNavOfMonth.set(monthBeforeFirstKey, navHistory[0].nav); 
    sortedMonthKeys.unshift(monthBeforeFirstKey);
    

    for (let i = 1; i < sortedMonthKeys.length; i++) {
        const currentMonthKey = sortedMonthKeys[i];
        const prevMonthKey = sortedMonthKeys[i-1];

        const [year, month] = currentMonthKey.split('-').map(Number);

        if (!yearlyData.has(year)) {
            yearlyData.set(year, { monthly: Array(12).fill(null), annual: null });
        }

        const currentNav = lastNavOfMonth.get(currentMonthKey);
        const prevNav = lastNavOfMonth.get(prevMonthKey);

        if (currentNav && prevNav) {
            const monthlyReturn = (currentNav - prevNav) / prevNav;
            const yearData = yearlyData.get(year);
            if (yearData) {
                // month-1 because months are 1-indexed, arrays are 0-indexed
                yearData.monthly[month - 1] = monthlyReturn;
            }
        }
    }

    // Step 3: Calculate annual returns
    const sortedYears = Array.from(yearlyData.keys()).sort();
    for (let i = 0; i < sortedYears.length; i++) {
        const year = sortedYears[i];
        const prevYear = year - 1;

        const yearEndKey = `${year}-12`;
        const prevYearEndKey = `${prevYear}-12`;
        
        let yearEndNav = lastNavOfMonth.get(yearEndKey);
        // For the current, incomplete year, use the latest available NAV
        if (!yearEndNav) {
            const lastAvailableMonth = sortedMonthKeys[sortedMonthKeys.length -1];
            if(lastAvailableMonth.startsWith(String(year))){
               yearEndNav = lastNavOfMonth.get(lastAvailableMonth);
            }
        }

        let yearStartNav = lastNavOfMonth.get(prevYearEndKey);
        // For the very first year, use the first NAV entry as the starting point
        if (!yearStartNav && i === 0) {
            yearStartNav = navHistory[0].nav;
        }

        if (yearEndNav && yearStartNav) {
            const annualReturn = (yearEndNav - yearStartNav) / yearStartNav;
            const yearData = yearlyData.get(year);
            if (yearData) {
                yearData.annual = annualReturn;
            }
        }
    }
    
    // Step 4: Format for rendering
    return Array.from(yearlyData.entries())
        .map(([year, data]) => ({ year, ...data }))
        .sort((a, b) => b.year - a.year); // Sort years descending
}


// --- MAIN COMPONENT ---

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
        setError(err.message || "An error occurred.");
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
                <TableCell key={month} align="right" sx={{ fontWeight: 700, minWidth: 80 }}>
                  {month}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: 700, minWidth: 90, backgroundColor: alpha(theme.palette.primary.light, 0.1) }}>
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
                  <ReturnCell key={index} value={returnValue} />
                ))}
                <TableCell align="right" sx={{ backgroundColor: alpha(theme.palette.grey[500], 0.05) }}>
                    <ReturnCell value={annual} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}