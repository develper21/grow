// src/components/RollingReturnCalculator.tsx
"use client";

import { useState } from "react";
import {
    TextField, Button, Typography, Stack, Divider, Box, useTheme,
    Paper, CircularProgress, alpha, MenuItem,
} from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";
import CalculateIcon from '@mui/icons-material/Calculate';
import dayjs from "dayjs";

const formatPercent = (val: number) => `${val.toFixed(2)}%`;

const CustomTooltip = ({ active, payload, label, periodInYears }: any) => {
    const theme = useTheme();
    if (active && payload && payload.length) {
        const startDate = dayjs(label);
        const endDate = startDate.add(periodInYears, 'year');
        return (
            <Paper elevation={6} sx={{ p: 1.5, backgroundColor: alpha(theme.palette.background.paper, 0.95), border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    Period: 
                    <Box component="span" fontWeight="700"> {startDate.format('DD MMM YYYY')} - {endDate.format('DD MMM YYYY')}</Box>
                </Typography>
                <Typography variant="subtitle1" fontWeight={700} color="primary.main">
                    Annualized Return: {formatPercent(payload[0].value)}
                </Typography>
            </Paper>
        );
    }
    return null;
};

const PERIODS = [
    { label: "1 Year", value: 1 },
    { label: "3 Years", value: 3 },
    { label: "5 Years", value: 5 },
    { label: "7 Years", value: 7 },
    { label: "10 Years", value: 10 },
    { label: "15 Years", value: 15 },
];

export default function RollingReturnCalculator({ code }: { code: string }) {
    const [periodInYears, setPeriodInYears] = useState<number>(3);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const theme = useTheme();

    const handleCalculate = async () => {
        if (!periodInYears) return;
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch(`/api/scheme/${code}/rolling-return`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ periodInYears }),
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
                Rolling Returns Analysis
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mb: 4 }} alignItems="center">
                <TextField
                    select
                    label="Return Period"
                    value={periodInYears}
                    onChange={(e) => setPeriodInYears(Number(e.target.value))}
                    fullWidth
                >
                    {PERIODS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <Button variant="contained" size="large" onClick={handleCalculate} disabled={loading} startIcon={loading ? <CircularProgress size={3} color="inherit" /> : <CalculateIcon />}>
                    {loading ? "Calculating..." : "Calculate"}
                </Button>
            </Stack>

            {error && <Typography color="error" sx={{ my: 2, textAlign: 'center' }}>Error: {error}</Typography>}

            {result && (
                <Box>
                    <Divider sx={{ my: 3 }} />
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 2, mb: 4 }}>
                        <MetricItem label="Average" value={formatPercent(result.average)} color="info" theme={theme} />
                        <MetricItem label="Highest" value={formatPercent(result.max)} color="success" theme={theme} />
                        <MetricItem label="Lowest" value={formatPercent(result.min)} color="error" theme={theme} />
                        <MetricItem label="Std. Deviation" value={formatPercent(result.standardDeviation)} color="warning" theme={theme} />
                    </Box>

                    {result.returns?.length > 0 ? (
                        <Box sx={{ height: { xs: 280, md: 360 }, mt: 2 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={result.returns} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: theme.palette.text.secondary }} tickMargin={10} angle={-35} textAnchor="end" height={60} tickFormatter={(tick) => dayjs(tick).format('MMM YY')} />
                                    <YAxis tickFormatter={(val) => `${val.toFixed(0)}%`} tick={{ fontSize: 11, fill: theme.palette.text.secondary }} width={70} />
                                    <Tooltip content={<CustomTooltip periodInYears={periodInYears} />} />
                                    <ReferenceLine y={result.average} label={{ value: `Avg: ${result.average}%`, position: 'insideTopLeft', fill: theme.palette.text.secondary }} stroke={theme.palette.info.main} strokeDasharray="4 4" />
                                    <Line type="monotone" dataKey="value" stroke={theme.palette.primary.main} strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                    ) : (
                        <Typography sx={{textAlign: 'center', my: 4, color: 'text.secondary'}}>
                            Not enough data to calculate {periodInYears}-year rolling returns for this fund.
                        </Typography>
                    )}
                </Box>
            )}
        </Paper>
    );
}

function MetricItem({ label, value, color, theme }: { label: string; value: string; color: "primary" | "secondary" | "success" | "info" | "warning" | "error"; theme: any; }) {
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