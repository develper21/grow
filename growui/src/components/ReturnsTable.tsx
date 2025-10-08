// "use client";

// import { useEffect, useState } from "react";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableRow,
//     CircularProgress,
//     Box,
//     Typography,
//     Paper,
//     useTheme,
//     alpha,
// } from "@mui/material";
// // Icons for visual feedback on returns
// import { ArrowUpward, ArrowDownward, TrendingUp as PerformanceIcon } from "@mui/icons-material"; 

// // --- MOCK UTILITY FUNCTION ---
// // Replaces the unresolved import from "@/lib/utils"
// const formatPercent = (val: number | undefined | null): string => {
//     if (val === undefined || val === null || isNaN(val)) return '';
//     // Assumes API returns are fractional (e.g., 0.1 for 10%)
//     return `${(val * 100).toFixed(2)}%`; 
// };

// type ReturnData = {
//     simpleReturn: number;
//     annualizedReturn?: number; // Kept optional for safety, though API is expected to return it
// };

// // Expanded periods for a more comprehensive view, including all-time
// const PERIODS = ["1m", "3m", "6m", "1y", "3y", "5y", "all"] as const;

// // --- Helper Functions and Components ---

// /**
//  * Returns the color (success/error/secondary) based on the return value.
//  */
// const getReturnColor = (value: number, theme: any) => {
//     if (value > 0) return theme.palette.success.main;
//     if (value < 0) return theme.palette.error.main;
//     return theme.palette.text.secondary;
// };

// /**
//  * A custom TableCell component for styled, color-coded return values with icons.
//  */
// const StyledReturnCell = ({ value }: { value: number | undefined | null }) => {
//     const theme = useTheme();

//     // If data is missing (undefined/null/NaN)
//     if (value === undefined || value === null || isNaN(value)) {
//         return (
//             <TableCell 
//                 align="right" 
//                 sx={{ color: theme.palette.text.secondary, fontWeight: 500, fontStyle: 'italic', fontSize: '0.875rem' }}
//             >
//                 N/A
//             </TableCell>
//         );
//     }

//     const color = getReturnColor(value, theme);
//     const formattedValue = formatPercent(value);
//     const IconComponent = value > 0 ? ArrowUpward : ArrowDownward;

//     return (
//         <TableCell 
//             align="right" 
//             sx={{ 
//                 color: color, 
//                 fontWeight: 600, 
//                 fontSize: '0.9rem',
//             }}
//         >
//             <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
//                 {/* Only show icon for non-zero returns */}
//                 {value !== 0 && (
//                     <IconComponent sx={{ fontSize: 16 }} />
//                 )}
//                 {formattedValue}
//             </Box>
//         </TableCell>
//     );
// };

// // ------------------------------------------
// // --- Main Component ---
// // ------------------------------------------

// export default function ReturnsTable({ code }: { code: string }) {
//     const [returnsMap, setReturnsMap] = useState<Record<string, ReturnData | null>>({});
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const theme = useTheme();

//     useEffect(() => {
//         if (!code) return;

//         const fetchReturnForPeriod = async (period: string): Promise<[string, ReturnData | null]> => {
//             try {
//                 // --- API Fetch Placeholder ---
//                 // The user requested to use the NAV endpoint: https://api.mfapi.in/mf/${code}
//                 // In a real application, you would:
//                 // 1. Fetch NAV history from the user-specified API: 
//                 //    const res = await fetch(`https://api.mfapi.in/mf/${code}`);
//                 // 2. Use the fetched NAV history (schemeData.data) to calculate the 
//                 //    simple and annualized returns for the specific 'period'.

//                 await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
                
//                 // --- MOCK RETURN GENERATION for Display (Must be replaced by real calculation) ---
//                 let simpleReturn: number;
//                 let annualizedReturn: number | undefined;

//                 if (period.endsWith('y') || period === 'all') {
//                     // Mock long-term returns (higher, includes annualized)
//                     simpleReturn = 0.50 + (Math.random() - 0.5) * 0.4; // 10% to 90% simple return
//                     annualizedReturn = 0.12 + (Math.random() - 0.5) * 0.05; // 7% to 17% annualized
//                 } else {
//                     // Mock short-term returns (lower, no annualized)
//                     simpleReturn = 0.03 + (Math.random() - 0.5) * 0.06; // -3% to 6% simple return
//                     annualizedReturn = undefined;
//                 }
                
//                 // Simulate data unavailability for new funds
//                 if (period === '5y' && Math.random() < 0.1) {
//                     simpleReturn = undefined as any; 
//                     annualizedReturn = undefined;
//                 }
//                 // --- END MOCK ---

//                 const data = { simpleReturn, annualizedReturn };
                
//                 return [period, { 
//                     simpleReturn: data.simpleReturn ?? 0,
//                     annualizedReturn: data.annualizedReturn 
//                 }];

//             } catch (err) {
//                 console.error(`Error fetching returns for ${period}:`, err);
//                 return [period, null]; // Returns null on catastrophic error
//             }
//         };

//         const fetchAll = async () => {
//             setLoading(true);
//             setError(null);
//             try {
//                 const results = await Promise.all(
//                     PERIODS.map(period => fetchReturnForPeriod(period))
//                 );
//                 // Create a map from the array of [key, value] pairs
//                 const resultMap = Object.fromEntries(results);
//                 setReturnsMap(resultMap);
//             } catch (err) {
//                 setError("Failed to load returns data.");
//                 console.error("Unexpected error in fetchAll:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchAll();
//     }, [code]);

//     if (loading) {
//         return (
//             <Box 
//                 sx={{ 
//                     display: "flex", 
//                     justifyContent: "center", 
//                     alignItems: 'center',
//                     py: 4, 
//                     minHeight: 150, 
//                     border: `1px solid ${theme.palette.divider}`,
//                     borderRadius: 2,
//                     bgcolor: theme.palette.background.paper
//                 }}
//             >
//                 <CircularProgress size={32} color="primary" />
//                 <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
//                     Calculating returns...
//                 </Typography>
//             </Box>
//         );
//     }

//     if (error) {
//         return (
//             <Box sx={{ p: 3, border: `1px dashed ${theme.palette.error.main}`, borderRadius: 2, bgcolor: alpha(theme.palette.error.main, 0.05) }}>
//                 <Typography color="error" variant="body2" fontWeight={600}>
//                     ⚠️ Error Loading Data
//                 </Typography>
//                 <Typography variant="caption" color="text.secondary">
//                     {error}
//                 </Typography>
//             </Box>
//         );
//     }

//     return (
//         <Paper 
//             variant="outlined" 
//             sx={{ 
//                 borderRadius: 2, 
//                 overflow: 'hidden', 
//                 border: `1px solid ${theme.palette.divider}`,
//                 boxShadow: theme.shadows[1],
//                 width: '100%',
//             }}
//         >
//             <Table size="medium" sx={{ '& .MuiTableCell-root': { py: 1.5, px: { xs: 1.5, sm: 2 } } }}>
//                 <TableHead 
//                     sx={{ 
//                         backgroundColor: alpha(theme.palette.primary.main, 0.05),
//                         borderBottom: `2px solid ${theme.palette.primary.main}`
//                     }}
//                 >
//                     <TableRow>
//                         <TableCell sx={{ fontWeight: "700", color: theme.palette.text.primary }}>
//                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                 <PerformanceIcon fontSize="small" color="primary" />
//                                 Period
//                             </Box>
//                         </TableCell>
//                         <TableCell align="right" sx={{ fontWeight: "700", color: theme.palette.text.primary, whiteSpace: 'nowrap' }}>
//                             Simple Return
//                         </TableCell>
//                         <TableCell align="right" sx={{ fontWeight: "700", color: theme.palette.text.primary, whiteSpace: 'nowrap' }}>
//                             Annualized
//                         </TableCell>
//                     </TableRow>
//                 </TableHead>
//                 <TableBody>
//                     {PERIODS.map((period) => {
//                         const data = returnsMap[period];
//                         // If data is null, it means the API call for that period failed catastrophically.
//                         if (data === null) {
//                              return (
//                                 <TableRow key={period}>
//                                     <TableCell 
//                                         component="th" 
//                                         scope="row"
//                                         sx={{ fontStyle: 'italic', color: theme.palette.text.disabled }}
//                                     >
//                                         {period}
//                                     </TableCell>
//                                     <TableCell colSpan={2} align="center" sx={{ color: theme.palette.error.main }}>
//                                         Fetch Failed
//                                     </TableCell>
//                                 </TableRow>
//                              )
//                         }

//                         const isLongTerm = period.endsWith('y') || period === 'all';
//                         const isAllTime = period === 'all';
                        
//                         return (
//                             <TableRow 
//                                 key={period} 
//                                 sx={{ 
//                                     '&:nth-of-type(even)': { 
//                                         backgroundColor: theme.palette.action.hover // Simple zebra striping
//                                     },
//                                     ...(isAllTime && {
//                                         backgroundColor: alpha(theme.palette.primary.main, 0.1),
//                                         '&:hover': {
//                                             backgroundColor: alpha(theme.palette.primary.main, 0.15) + '!important'
//                                         }
//                                     }),
//                                     '&:last-child td': { borderBottom: 0 },
//                                 }}
//                             >
//                                 {/* Period Cell */}
//                                 <TableCell 
//                                     component="th" 
//                                     scope="row"
//                                     sx={{
//                                         fontWeight: isLongTerm ? 700 : 500,
//                                         textTransform: 'uppercase',
//                                         color: isAllTime ? theme.palette.primary.dark : theme.palette.text.secondary,
//                                         borderBottom: `1px solid ${theme.palette.divider}` 
//                                     }}
//                                 >
//                                     {period}
//                                 </TableCell>
                                
//                                 {/* Simple Return Cell */}
//                                 <StyledReturnCell value={data?.simpleReturn} />
                                
//                                 {/* Annualized Return Cell */}
//                                 <StyledReturnCell value={data?.annualizedReturn} />

//                             </TableRow>
//                         );
//                     })}
//                 </TableBody>
//             </Table>
//         </Paper>
//     );
// }


// src/components/ReturnsTable.tsx
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

// Extend dayjs to parse DD-MM-YYYY format
dayjs.extend(customParseFormat);

// --- TYPE DEFINITIONS ---
interface NavEntry {
  date: dayjs.Dayjs;
  nav: number;
}

interface ReturnData {
  simpleReturn: number;
  annualizedReturn?: number;
}

// --- CONSTANTS ---
const PERIODS = ["1m", "3m", "6m", "1y", "3y", "5y", "all"] as const;
type Period = (typeof PERIODS)[number];

// --- UTILITY & HELPER FUNCTIONS ---

/**
 * Formats a fractional number into a percentage string.
 */
const formatPercent = (val: number | undefined | null): string => {
  if (val === undefined || val === null || isNaN(val)) return "N/A";
  return `${(val * 100).toFixed(2)}%`;
};

/**
 * Returns the color (success/error/secondary) based on the return value.
 */
const getReturnColor = (value: number, theme: any) => {
  if (value > 0) return theme.palette.success.main;
  if (value < 0) return theme.palette.error.main;
  return theme.palette.text.secondary;
};

/**
 * Calculates simple and annualized returns for a given period from NAV history.
 * @param navHistory - NAV history sorted from OLDEST to NEWEST.
 * @param period - The period string (e.g., "1m", "3y", "all").
 * @returns The calculated return data or null if not applicable.
 */
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

    // Find the first NAV entry on or after the target start date
    startNavEntry = navHistory.find((entry) => !entry.date.isBefore(targetStartDate));
  }

  // If no suitable start date is found (fund is too new), return null
  if (!startNavEntry) {
    return null;
  }

  const endNAV = latestNavEntry.nav;
  const startNAV = startNavEntry.nav;

  // Calculate the period in years
  const years = latestNavEntry.date.diff(startNavEntry.date, "year", true);

  const simpleReturn = (endNAV - startNAV) / startNAV;

  let annualizedReturn: number | undefined;
  if (years >= 1) {
    // CAGR calculation
    annualizedReturn = Math.pow(endNAV / startNAV, 1 / years) - 1;
  }

  return { simpleReturn, annualizedReturn };
}

// --- STYLED COMPONENTS ---

/**
 * A custom TableCell component for styled, color-coded return values with icons.
 */
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

// --- MAIN COMPONENT ---

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
        // 1. Fetch NAV history from the API
        const res = await fetch(`https://api.mfapi.in/mf/${code}`);
        if (!res.ok) {
          throw new Error("Failed to fetch NAV data from the API.");
        }
        const schemeData = await res.json();

        if (!schemeData.data || schemeData.data.length === 0) {
          throw new Error("No NAV history available for this fund.");
        }
        
        // 2. Process and sort the NAV history (OLDEST to NEWEST)
        const sortedNavHistory: NavEntry[] = schemeData.data
          .map((d: any) => ({
            date: dayjs(d.date, "DD-MM-YYYY"),
            nav: parseFloat(d.nav),
          }))
          .filter((d: NavEntry) => d.date.isValid() && !isNaN(d.nav) && d.nav > 0)
          .sort((a: NavEntry, b: NavEntry) => a.date.unix() - b.date.unix());

        // 3. Calculate returns for all defined periods
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
  
  // --- RENDER LOGIC ---

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