// // // components/SIPCalculator.tsx
// // "use client";

// // import { useState } from "react";
// // import {
// //     TextField,
// //     Button,
// //     Typography,
// //     Stack,
// //     Divider,
// //     Box,
// //     useTheme,
// //     Paper,
// //     InputAdornment, 
// //     CircularProgress, 
// //     alpha, 
// // } from "@mui/material";
// // // Assuming formatCurrency and formatPercent are imported from your utility library
// // // import { formatCurrency, formatPercent } from "@/lib/utils"; 

// // // MOCK UTILITY FUNCTIONS (since the actual ones aren't provided)
// // const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
// // const formatPercent = (val: number) => `${(val * 100).toFixed(2)}%`;

// // import {
// //     LineChart,
// //     Line,
// //     XAxis,
// //     YAxis,
// //     Tooltip,
// //     ResponsiveContainer,
// //     CartesianGrid,
// // } from "recharts";
// // import CalculateIcon from '@mui/icons-material/Calculate'; 
// // import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; 
// // import TrendingUpIcon from '@mui/icons-material/TrendingUp'; 

// // // Custom Tooltip (Enhanced visual polish)
// // const CustomTooltip = ({ active, payload, label }: any) => {
// //     const theme = useTheme();
// //     if (active && payload && payload.length) {
// //         return (
// //             <Paper
// //                 elevation={6} 
// //                 sx={{
// //                     backgroundColor: alpha(theme.palette.background.paper, 0.95), 
// //                     backdropFilter: 'blur(5px)', 
// //                     border: `1px solid ${theme.palette.divider}`,
// //                     borderRadius: 2, 
// //                     p: 1.5,
// //                 }}
// //             >
// //                 <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ mb: 0.5, display: 'block' }}>
// //                     Month/Date: <Box component="span" sx={{ color: theme.palette.text.primary, fontWeight: 700 }}>{label}</Box>
// //                 </Typography>
// //                 <Typography variant="subtitle1" fontWeight={700} sx={{ color: theme.palette.success.main }}>
// //                     Value: {formatCurrency(payload[0].value)}
// //                 </Typography>
// //             </Paper>
// //         );
// //     }
// //     return null;
// // };

// // // --- START OF MAIN COMPONENT ---
// // export default function SIPCalculator({ code }: { code: string }) {
// //     const [amount, setAmount] = useState<number>(5000);
// //     const [from, setFrom] = useState<string>("2020-01-01");
// //     const [to, setTo] = useState<string>("2023-12-31");
// //     const [result, setResult] = useState<any>(null);
// //     const [loading, setLoading] = useState<boolean>(false);
// //     const theme = useTheme();

// //     const handleCalculate = async () => {
// //         if (!amount || !from || !to) return;
// //         setLoading(true);

// //         try {
// //             // --- UPDATED MOCK DATA FOR CURVED LINE DEMO ---
// //             const totalMonths = 48;
// //             const initialNav = 10;
// //             const finalNav = 16;
// //             let currentNav = initialNav;
// //             let accumulatedValue = 0;
// //             let totalInvested = 0;
// //             const growthOverTime = [];
// //             let totalUnits = 0;

// //             // Helper to generate monthly dates
// //             let currentDate = new Date(from);
// //             currentDate.setDate(1); // Start on the 1st of the month

// //             for (let i = 0; i < totalMonths; i++) {
// //                 // Advance the date by one month
// //                 const month = currentDate.getMonth() + 1;
// //                 const year = currentDate.getFullYear();
// //                 const dateString = `${year}-${String(month).padStart(2, '0')}-01`;

// //                 // Simulate NAV change: Interpolate between start/end, add monthly noise
// //                 const progress = i / totalMonths;
// //                 currentNav = initialNav + (finalNav - initialNav) * progress + (Math.random() - 0.5) * 0.5;
// //                 currentNav = Math.max(10, currentNav); // Ensure NAV doesn't drop too low

// //                 // SIP Calculation: Units bought this month
// //                 const unitsBought = amount / currentNav;
// //                 totalUnits += unitsBought;
// //                 accumulatedValue = totalUnits * currentNav; // Recalculate current value based on total units and latest NAV
// //                 totalInvested += amount;
                
// //                 growthOverTime.push({
// //                     date: dateString,
// //                     value: Math.round(accumulatedValue),
// //                 });

// //                 // Move to the next month
// //                 currentDate.setMonth(currentDate.getMonth() + 1);
// //                 if (currentDate > new Date(to)) break;
// //             }

// //             const mockResult = {
// //                 totalInvested: totalInvested,
// //                 currentValue: accumulatedValue,
// //                 absoluteReturn: (accumulatedValue - totalInvested) / totalInvested,
// //                 annualizedReturn: 0.10, // Placeholder CAGR
// //                 growthOverTime: growthOverTime,
// //             };
            
// //             // SIMULATION: Use this block to see the curved line locally
// //             setTimeout(() => { 
// //                 setResult(mockResult);
// //                 setLoading(false);
// //             }, 500);
            
// //             // // --- Actual API Call (Uncomment this and comment out the simulation block for production) ---
// //             // // The /api/scheme/${code}/sip endpoint would ideally return the SipResult structure.
// //             // const res = await fetch(`/api/scheme/${code}/sip`, {
// //             //     method: "POST",
// //             //     headers: { "Content-Type": "application/json" },
// //             //     body: JSON.stringify({ amount, frequency: "monthly", from, to }),
// //             // });
// //             // const data = await res.json();
// //             // setResult(data);
// //             // setLoading(false);
// //             // // -----------------------

// //         } catch (error) {
// //             console.error("SIP calculation error:", error);
// //             setResult(null);
// //         } finally {
// //             // setLoading(false); // Controlled by setTimeout in simulation
// //         }
// //     };
// // // --- REST OF THE COMPONENT REMAINS THE SAME ---

// //     return (
// //         <Paper
// //             elevation={2} 
// //             sx={{
// //                 width: "100%",
// //                 borderRadius: 3,
// //                 border: `1px solid ${theme.palette.grey[200]}`, 
// //                 p: { xs: 2.5, sm: 4 }, 
// //             }}
// //         >
// //             <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
// //                 SIP Calculator 
// //             </Typography>

// //             {/* --- INPUTS SECTION --- */}
// //             <Stack spacing={3} sx={{ mb: 4 }}>
// //                 <TextField
// //                     label="Monthly SIP Amount"
// //                     type="number"
// //                     fullWidth
// //                     value={amount || ""}
// //                     onChange={(e) => setAmount(e.target.value ? parseInt(e.target.value) : 0)}
// //                     size="medium"
// //                     InputLabelProps={{ shrink: true }}
// //                     InputProps={{
// //                         startAdornment: (
// //                             <InputAdornment position="start">
// //                                 <AttachMoneyIcon color="action" />
// //                             </InputAdornment>
// //                         ),
// //                         sx: { borderRadius: '12px' } 
// //                     }}
// //                     helperText="Enter the monthly investment amount"
// //                 />

// //                 <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
// //                     <TextField
// //                         label="Start Date"
// //                         type="date"
// //                         fullWidth
// //                         value={from}
// //                         onChange={(e) => setFrom(e.target.value)}
// //                         InputLabelProps={{ shrink: true }}
// //                         InputProps={{ sx: { borderRadius: '12px' } }}
// //                     />
// //                     <TextField
// //                         label="End Date"
// //                         type="date"
// //                         fullWidth
// //                         value={to}
// //                         onChange={(e) => setTo(e.target.value)}
// //                         InputLabelProps={{ shrink: true }}
// //                         InputProps={{ sx: { borderRadius: '12px' } }}
// //                     />
// //                 </Stack>

// //                 <Button
// //                     variant="contained"
// //                     color="primary" 
// //                     size="large"
// //                     fullWidth
// //                     onClick={handleCalculate}
// //                     disabled={loading || !amount || !from || !to}
// //                     startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CalculateIcon />}
// //                     sx={{ 
// //                         py: 1.5, 
// //                         fontWeight: 700, 
// //                         fontSize: "1.05rem",
// //                         borderRadius: '12px', 
// //                     }}
// //                 >
// //                     {loading ? "Calculating Returns..." : "Calculate SIP Returns"}
// //                 </Button>
// //             </Stack>

// //             {/* --- RESULTS SECTION --- */}
// //             {result && (
// //                 <Box sx={{ pt: 1 }}>
// //                     <Divider sx={{ my: 3 }} />

// //                     {/* Metrics Grid */}
// //                     <Box
// //                         sx={{
// //                             display: "grid",
// //                             gridTemplateColumns: {
// //                                 xs: "1fr",
// //                                 sm: "repeat(2, 1fr)",
// //                                 md: "repeat(4, 1fr)",
// //                             },
// //                             gap: 2,
// //                             mb: 4,
// //                         }}
// //                     >
// //                         <MetricItem
// //                             label="Total Invested"
// //                             value={formatCurrency(result.totalInvested)}
// //                             color="info"
// //                             theme={theme}
// //                         />
// //                         <MetricItem
// //                             label="Current Value"
// //                             value={formatCurrency(result.currentValue)}
// //                             color="success"
// //                             theme={theme}
// //                         />
// //                         <MetricItem
// //                             label="Absolute Return"
// //                             value={formatPercent(result.absoluteReturn)}
// //                             color="primary"
// //                             theme={theme}
// //                         />
// //                         <MetricItem
// //                             label="Annualized Return"
// //                             value={formatPercent(result.annualizedReturn)}
// //                             color="warning" 
// //                             theme={theme}
// //                         />
// //                     </Box>

// //                     {/* Chart */}
// //                     {result.growthOverTime?.length > 0 && (
// //                         <Box>
// //                             <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
// //                                 <TrendingUpIcon fontSize="small" color="primary" />
// //                                 SIP Value Growth
// //                             </Typography>
// //                             <Box 
// //                                 sx={{ 
// //                                     height: { xs: 280, sm: 320, md: 360 }, 
// //                                     mt: 2, 
// //                                     p: 1, 
// //                                     border: `1px solid ${theme.palette.grey[100]}`,
// //                                     borderRadius: 2
// //                                 }}
// //                             >
// //                                 <ResponsiveContainer width="100%" height="100%">
// //                                     <LineChart data={result.growthOverTime} margin={{ top: 10, right: 10, left: -25, bottom: 20 }}>
// //                                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
// //                                         <XAxis
// //                                             dataKey="date"
// //                                             tick={{ fontSize: 10, fill: theme.palette.text.secondary }}
// //                                             tickMargin={10}
// //                                             angle={-35}
// //                                             textAnchor="end"
// //                                             height={60}
// //                                             interval="preserveStartEnd"
// //                                             tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-IN', { year: '2-digit', month: 'short' })}
// //                                         />
// //                                         <YAxis
// //                                             tickFormatter={(val) =>
// //                                                 val >= 1e7
// //                                                     ? `₹${(val / 1e7).toFixed(1)}Cr`
// //                                                     : val >= 1e5
// //                                                         ? `₹${(val / 1e5).toFixed(1)}L`
// //                                                         : `₹${(val / 1000).toFixed(0)}k`
// //                                             }
// //                                             tick={{ fontSize: 10, fill: theme.palette.text.secondary }}
// //                                             width={80}
// //                                             domain={['auto', 'auto']}
// //                                         />
// //                                         <Tooltip content={<CustomTooltip />} />
// //                                         <Line
// //                                             // 🔑 KEY FIX: Changed type to "monotone" for smooth curve
// //                                             type="monotone" 
// //                                             dataKey="value"
// //                                             stroke={theme.palette.success.main} 
// //                                             strokeWidth={3} 
// //                                             dot={false} // Removed dots for a cleaner, modern look
// //                                             activeDot={{ r: 6, fill: theme.palette.success.main, stroke: theme.palette.background.paper, strokeWidth: 2 }}
// //                                         />
// //                                     </LineChart>
// //                                 </ResponsiveContainer>
// //                             </Box>
// //                         </Box>
// //                     )}
// //                 </Box>
// //             )}
// //         </Paper>
// //     );
// // }

// // // Reusable Metric Item (Passed theme explicitly)
// // function MetricItem({
// //     label,
// //     value,
// //     color,
// //     theme, 
// // }: {
// //     label: string;
// //     value: string;
// //     color: "primary" | "secondary" | "success" | "info" | "warning";
// //     theme: any;
// // }) {
// //     const returnColor = color === 'warning' ? theme.palette.warning.main : theme.palette[color].main;

// //     return (
// //         <Box
// //             sx={{
// //                 textAlign: "center",
// //                 p: 2, 
// //                 borderRadius: 2,
// //                 backgroundColor: alpha(returnColor, 0.1), 
// //                 border: `1px solid ${alpha(returnColor, 0.3)}`,
// //             }}
// //         >
// //             <Typography
// //                 variant="caption" 
// //                 color="text.secondary"
// //                 fontWeight={600}
// //                 sx={{ mb: 0.3, display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}
// //             >
// //                 {label}
// //             </Typography>
// //             <Typography
// //                 variant="h5" 
// //                 fontWeight={700}
// //                 sx={{
// //                     color: returnColor,
// //                     lineHeight: 1.2,
// //                 }}
// //             >
// //                 {value}
// //             </Typography>
// //         </Box>
// //     );
// // }

// // components/SIPCalculator.tsx
// "use client";

// import { useState } from "react";
// import {
//     TextField,
//     Button,
//     Typography,
//     Stack,
//     Divider,
//     Box,
//     useTheme,
//     Paper,
//     InputAdornment, 
//     CircularProgress, 
//     alpha, 
// } from "@mui/material";
// import {
//     LineChart,
//     Line,
//     XAxis,
//     YAxis,
//     Tooltip,
//     ResponsiveContainer,
//     CartesianGrid,
// } from "recharts";
// import CalculateIcon from '@mui/icons-material/Calculate'; 
// import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; 
// import TrendingUpIcon from '@mui/icons-material/TrendingUp'; 
// import dayjs from "dayjs"; // <-- ADDED THIS IMPORT TO FIX THE ERROR

// // Utility functions
// const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
// const formatPercent = (val: number) => `${(val * 100).toFixed(2)}%`;


// const CustomTooltip = ({ active, payload, label }: any) => {
//     const theme = useTheme();
//     if (active && payload && payload.length) {
//         return (
//             <Paper
//                 elevation={6} 
//                 sx={{
//                     p: 1.5,
//                     backgroundColor: alpha(theme.palette.background.paper, 0.95), 
//                     backdropFilter: 'blur(5px)', 
//                     border: `1px solid ${theme.palette.divider}`,
//                     borderRadius: 2, 
//                 }}
//             >
//                 <Typography variant="caption" color="text.secondary" fontWeight={500}>
//                     Date: <Box component="span" fontWeight="700">{label}</Box>
//                 </Typography>
//                 <Typography variant="subtitle1" fontWeight={700} color="success.main">
//                     Value: {formatCurrency(payload[0].value)}
//                 </Typography>
//             </Paper>
//         );
//     }
//     return null;
// };

// // --- START OF MAIN COMPONENT ---
// export default function SIPCalculator({ code }: { code: string }) {
//     const [amount, setAmount] = useState<number>(5000);
//     const [from, setFrom] = useState<string>("2024-10-03");
//     const [to, setTo] = useState<string>("2025-10-03"); // Default to a realistic range
//     const [result, setResult] = useState<any>(null);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [error, setError] = useState<string | null>(null);
//     const theme = useTheme();

//     const handleCalculate = async () => {
//         if (!amount || !from || !to) return;
//         setLoading(true);
//         setError(null);
//         setResult(null);

//         try {
//             const res = await fetch(`/api/scheme/${code}/sip`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ amount, from, to }),
//             });

//             if (!res.ok) {
//                 const errorData = await res.json();
//                 throw new Error(errorData.error || "Failed to calculate SIP.");
//             }
            
//             const data = await res.json();
//             setResult(data);

//         } catch (error: any) {
//             console.error("SIP calculation error:", error);
//             setError(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Paper
//             elevation={0}
//             sx={{
//                 width: "100%",
//                 borderRadius: 3,
//                 border: `1px solid ${theme.palette.divider}`, 
//                 p: { xs: 2.5, sm: 4 }, 
//             }}
//         >
//             <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
//                 SIP Return Calculator
//             </Typography>

//             {/* --- INPUTS SECTION --- */}
//             <Stack spacing={3} sx={{ mb: 4 }}>
//                 <TextField
//                     label="Monthly SIP Amount"
//                     type="number"
//                     fullWidth
//                     value={amount || ""}
//                     onChange={(e) => setAmount(e.target.value ? parseInt(e.target.value) : 0)}
//                     InputLabelProps={{ shrink: true }}
//                     InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
//                 />

//                 <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
//                     <TextField label="Start Date" type="date" fullWidth value={from} onChange={(e) => setFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
//                     <TextField label="End Date" type="date" fullWidth value={to} onChange={(e) => setTo(e.target.value)} InputLabelProps={{ shrink: true }} />
//                 </Stack>

//                 <Button
//                     variant="contained"
//                     size="large"
//                     fullWidth
//                     onClick={handleCalculate}
//                     disabled={loading || !amount || !from || !to}
//                     startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CalculateIcon />}
//                     sx={{ py: 1.5, fontWeight: 700, fontSize: "1.05rem" }}
//                 >
//                     {loading ? "Calculating..." : "Calculate Returns"}
//                 </Button>
//             </Stack>
            
//             {error && <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>Error: {error}</Typography>}

//             {/* --- RESULTS SECTION --- */}
//             {result && (
//                 <Box sx={{ pt: 1 }}>
//                     <Divider sx={{ my: 3 }} />
//                     <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 2, mb: 4 }}>
//                         <MetricItem label="Total Invested" value={formatCurrency(result.totalInvested)} color="info" theme={theme} />
//                         <MetricItem label="Final Value" value={formatCurrency(result.currentValue)} color="success" theme={theme} />
//                         <MetricItem label="Absolute Gain" value={formatPercent(result.absoluteReturn)} color="primary" theme={theme} />
//                         <MetricItem label="Annualized (XIRR)" value={formatPercent(result.annualizedReturn)} color="warning" theme={theme} />
//                     </Box>

//                     {result.growthOverTime?.length > 0 && (
//                         <Box>
//                             <Typography variant="h6" fontWeight={600} gutterBottom>Investment Growth</Typography>
//                             <Box sx={{ height: { xs: 280, md: 360 }, mt: 2 }}>
//                                 <ResponsiveContainer width="100%" height="100%">
//                                     <LineChart data={result.growthOverTime} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
//                                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
//                                         <XAxis
//                                             dataKey="date"
//                                             tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
//                                             tickMargin={10} angle={-35} textAnchor="end" height={60}
//                                             tickFormatter={(tick) => dayjs(tick).format('MMM YY')}
//                                         />
//                                         <YAxis
//                                             tickFormatter={(val) => val >= 1e5 ? `₹${(val / 1e5).toFixed(1)}L` : `₹${(val / 1000).toFixed(0)}k`}
//                                             tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
//                                             width={70}
//                                         />
//                                         <Tooltip content={<CustomTooltip />} />
//                                         <Line type="monotone" dataKey="value" stroke={theme.palette.success.main} strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} />
//                                     </LineChart>
//                                 </ResponsiveContainer>
//                             </Box>
//                         </Box>
//                     )}
//                 </Box>
//             )}
//         </Paper>
//     );
// }

// // Reusable Metric Item
// function MetricItem({ label, value, color, theme }: { label: string; value: string; color: "primary" | "secondary" | "success" | "info" | "warning"; theme: any; }) {
//     const returnColor = theme.palette[color].main;
//     return (
//         <Paper variant="outlined" sx={{ textAlign: "center", p: 2, borderRadius: 2 }}>
//             <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ textTransform: 'uppercase' }}>
//                 {label}
//             </Typography>
//             <Typography variant="h5" fontWeight={700} sx={{ color: returnColor, mt: 0.5 }}>
//                 {value}
//             </Typography>
//         </Paper>
//     );
// }

// src/components/SIPCalculator.tsx
"use client";

import { useState } from "react";
import {
    TextField,
    Button,
    Typography,
    Stack,
    Divider,
    Box,
    useTheme,
    Paper,
    InputAdornment, 
    CircularProgress, 
    alpha, 
} from "@mui/material";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import CalculateIcon from '@mui/icons-material/Calculate'; 
import TrendingUpIcon from '@mui/icons-material/TrendingUp'; 
import dayjs from "dayjs";

// Utility functions
const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const formatPercent = (val: number) => `${val.toFixed(2)}%`;

const CustomTooltip = ({ active, payload, label }: any) => {
    const theme = useTheme();
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <Paper
                elevation={6} 
                sx={{
                    p: 1.5,
                    backgroundColor: alpha(theme.palette.background.paper, 0.95), 
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2, 
                }}
            >
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    Date: <Box component="span" fontWeight="700">{dayjs(label).format('DD MMM, YYYY')}</Box>
                </Typography>
                 <Typography variant="body2" fontWeight={600} color="primary.main">
                    Total Invested: {formatCurrency(data.investment)}
                </Typography>
                <Typography variant="subtitle1" fontWeight={700} color="success.main">
                    Market Value: {formatCurrency(data.value)}
                </Typography>
            </Paper>
        );
    }
    return null;
};


// --- START OF MAIN COMPONENT ---
export default function SIPCalculator({ code }: { code: string }) {
    const [amount, setAmount] = useState<number>(5000);
    const [from, setFrom] = useState<string>(dayjs().subtract(1, 'year').format('YYYY-MM-DD'));
    const [to, setTo] = useState<string>(dayjs().format('YYYY-MM-DD'));
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const theme = useTheme();

    const handleCalculate = async () => {
        if (!amount || !from || !to) return;
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch(`/api/scheme/${code}/sip`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, from, to }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to calculate SIP.");
            }
            
            const data = await res.json();
            setResult(data);

        } catch (error: any) {
            console.error("SIP calculation error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                width: "100%",
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`, 
                p: { xs: 2.5, sm: 4 }, 
            }}
        >
            <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                SIP Return Calculator
            </Typography>

            {/* --- INPUTS SECTION --- */}
            <Stack spacing={3} sx={{ mb: 4 }}>
                <TextField
                    label="Monthly SIP Amount"
                    type="number"
                    fullWidth
                    value={amount || ""}
                    onChange={(e) => setAmount(e.target.value ? parseInt(e.target.value) : 0)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                />

                <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                    <TextField label="Start Date" type="date" fullWidth value={from} onChange={(e) => setFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
                    <TextField label="End Date" type="date" fullWidth value={to} onChange={(e) => setTo(e.target.value)} InputLabelProps={{ shrink: true }} />
                </Stack>

                <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleCalculate}
                    disabled={loading || !amount || !from || !to}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CalculateIcon />}
                    sx={{ py: 1.5, fontWeight: 700, fontSize: "1.05rem" }}
                >
                    {loading ? "Calculating..." : "Calculate Returns"}
                </Button>
            </Stack>
            
            {error && <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>Error: {error}</Typography>}

            {/* --- RESULTS SECTION --- */}
            {result && (
                <Box sx={{ pt: 1 }}>
                    <Divider sx={{ my: 3 }} />
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 2, mb: 4 }}>
                        <MetricItem label="Total Invested" value={formatCurrency(result.totalInvested)} color="info" theme={theme} />
                        <MetricItem label="Final Value" value={formatCurrency(result.currentValue)} color="success" theme={theme} />
                        <MetricItem label="Absolute Gain" value={formatPercent(result.absoluteReturn)} color="primary" theme={theme} />
                        <MetricItem label="Annualized (XIRR)" value={formatPercent(result.annualizedReturn)} color="warning" theme={theme} />
                    </Box>

                    {result.growthOverTime?.length > 0 && (
                        <Box>
                            <Typography variant="h6" fontWeight={600} gutterBottom>Investment Growth</Typography>
                            <Box sx={{ height: { xs: 280, md: 360 }, mt: 2 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={result.growthOverTime} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
                                            tickMargin={10} angle={-35} textAnchor="end" height={60}
                                            tickFormatter={(tick) => dayjs(tick).format('MMM YY')}
                                        />
                                        <YAxis
                                            tickFormatter={(val) => val >= 1e5 ? `₹${(val / 1e5).toFixed(1)}L` : `₹${(val / 1000).toFixed(0)}k`}
                                            tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
                                            width={70}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        
                                        {/* Line for Total Investment (Step Chart) */}
                                        <Line 
                                            type="stepAfter" 
                                            dataKey="investment" 
                                            name="Total Investment"
                                            stroke={theme.palette.primary.main} 
                                            strokeWidth={2} 
                                            dot={false} 
                                        />

                                        {/* Line for Market Value (Curved Chart) */}
                                        <Line 
                                            type="monotone" 
                                            dataKey="value" 
                                            name="Market Value"
                                            stroke={theme.palette.success.main} 
                                            strokeWidth={2.5} 
                                            dot={false} 
                                            activeDot={{ r: 6 }} 
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>
                        </Box>
                    )}
                </Box>
            )}
        </Paper>
    );
}

// Reusable Metric Item
function MetricItem({ label, value, color, theme }: { label: string; value: string; color: "primary" | "secondary" | "success" | "info" | "warning"; theme: any; }) {
    const returnColor = theme.palette[color].main;
    return (
        <Paper variant="outlined" sx={{ textAlign: "center", p: 2, borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ textTransform: 'uppercase' }}>
                {label}
            </Typography>
            <Typography variant="h5" fontWeight={700} sx={{ color: returnColor, mt: 0.5 }}>
                {value}
            </Typography>
        </Paper>
    );
}