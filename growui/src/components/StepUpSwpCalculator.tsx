// src/components/StepUpSwpCalculator.tsx
"use client";

import { useState } from "react";
import {
    TextField, Button, Typography, Stack, Divider, Box, useTheme,
    Paper, InputAdornment, CircularProgress, alpha, Alert,
} from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import CalculateIcon from '@mui/icons-material/Calculate';
import dayjs from "dayjs";

const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const CustomTooltip = ({ active, payload, label }: any) => {
    const theme = useTheme();
    if (active && payload && payload.length) {
        return (
            <Paper elevation={6} sx={{ p: 1.5, backgroundColor: alpha(theme.palette.background.paper, 0.95), border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    Date: <Box component="span" fontWeight="700">{dayjs(label).format('DD MMM, YYYY')}</Box>
                </Typography>
                <Typography variant="subtitle1" fontWeight={700} color="success.main">
                    Corpus Value: {formatCurrency(payload[0].value)}
                </Typography>
            </Paper>
        );
    }
    return null;
};

export default function StepUpSwpCalculator({ code }: { code: string }) {
    const [initialInvestment, setInitialInvestment] = useState<number>(1000000);
    const [initialMonthlyWithdrawal, setInitialMonthlyWithdrawal] = useState<number>(8000);
    const [stepUpPercentage, setStepUpPercentage] = useState<number>(5);
    const [from, setFrom] = useState<string>(dayjs().subtract(10, 'year').format('YYYY-MM-DD'));
    const [to, setTo] = useState<string>(dayjs().format('YYYY-MM-DD'));
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const theme = useTheme();

    const handleCalculate = async () => {
        if (!initialInvestment || !initialMonthlyWithdrawal || stepUpPercentage === undefined || !from || !to) return;
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch(`/api/scheme/${code}/step-up-swp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ initialInvestment, initialMonthlyWithdrawal, stepUpPercentage, from, to }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to calculate.");
            }
            const data = await res.json();
            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={0} sx={{ width: "100%", borderRadius: 3, border: `1px solid ${theme.palette.divider}`, p: { xs: 2.5, sm: 4 } }}>
            <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                Historical Step-up SWP Calculator
            </Typography>

            <Stack spacing={3} sx={{ mb: 4 }}>
                 <TextField
                    label="Total Investment Amount"
                    type="number"
                    fullWidth
                    value={initialInvestment || ""}
                    onChange={(e) => setInitialInvestment(Number(e.target.value))}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                    <TextField
                        label="Initial Monthly Withdrawal"
                        type="number"
                        fullWidth
                        value={initialMonthlyWithdrawal || ""}
                        onChange={(e) => setInitialMonthlyWithdrawal(Number(e.target.value))}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                    />
                    <TextField
                        label="Annual Step-up"
                        type="number"
                        fullWidth
                        value={stepUpPercentage || ""}
                        onChange={(e) => setStepUpPercentage(Number(e.target.value))}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                    />
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                    <TextField label="Investment Date" type="date" fullWidth value={from} onChange={(e) => setFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
                    <TextField label="End Date" type="date" fullWidth value={to} onChange={(e) => setTo(e.target.value)} InputLabelProps={{ shrink: true }} />
                </Stack>
                <Button variant="contained" size="large" fullWidth onClick={handleCalculate} disabled={loading} startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CalculateIcon />}>
                    {loading ? "Calculating..." : "Calculate Step-up SWP"}
                </Button>
            </Stack>

            {error && <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>Error: {error}</Typography>}

            {result && (
                <Box>
                    <Divider sx={{ my: 3 }} />
                     {result.corpusRanOutDate && (
                        <Alert severity="warning" sx={{ mb: 3 }}>
                            Your corpus would have run out on approximately **{dayjs(result.corpusRanOutDate).format("DD MMMM, YYYY")}**.
                        </Alert>
                    )}
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2, mb: 4 }}>
                        <MetricItem label="Total Investment" value={formatCurrency(result.totalInvested)} color="info" theme={theme} />
                        <MetricItem label="Total Withdrawn" value={formatCurrency(result.totalWithdrawn)} color="warning" theme={theme} />
                        <MetricItem label="Final Value" value={formatCurrency(result.finalValue)} color="success" theme={theme} />
                    </Box>

                    {result.growthOverTime?.length > 1 && (
                        <Box>
                            <Typography variant="h6" fontWeight={600} gutterBottom>Corpus Value Over Time</Typography>
                            <Box sx={{ height: { xs: 280, md: 360 }, mt: 2 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={result.growthOverTime} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: theme.palette.text.secondary }} tickMargin={10} angle={-35} textAnchor="end" height={60} tickFormatter={(tick) => dayjs(tick).format('MMM YY')} />
                                        <YAxis tickFormatter={(val) => val >= 1e5 ? `₹${(val / 1e5).toFixed(1)}L` : `₹${(val / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: theme.palette.text.secondary }} width={70} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line type="monotone" dataKey="value" stroke={theme.palette.success.main} strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} />
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