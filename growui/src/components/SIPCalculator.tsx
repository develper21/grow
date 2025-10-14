import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import axios from 'axios';
import { SIPResponse } from '@/types';
import { formatCurrency, formatPercentage, formatNumber } from '@/utils/calculations';

interface SIPCalculatorProps {
  schemeCode: string;
}

export default function SIPCalculator({ schemeCode }: SIPCalculatorProps) {
  const theme = useTheme();
  const [amount, setAmount] = useState('5000');
  const [frequency, setFrequency] = useState<'monthly' | 'weekly' | 'quarterly'>('monthly');
  const [fromDate, setFromDate] = useState('2020-01-01');
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<SIPResponse | null>(null);

  const handleCalculate = async () => {
    setError('');
    setResult(null);

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`/api/scheme/${schemeCode}/sip`, {
        amount: parseFloat(amount),
        frequency,
        from: fromDate,
        to: toDate,
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to calculate SIP returns');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{
      borderRadius: 3,
      border: '1px solid',
      borderColor: 'rgba(0,0,0,0.08)',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
    }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 3,
          p: 2,
          bgcolor: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
          borderRadius: 2,
        }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
            💰 SIP Calculator
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Calculate returns for Systematic Investment Plan
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="SIP Amount (₹)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Frequency</InputLabel>
              <Select
                value={frequency}
                label="Frequency"
                onChange={(e) => setFrequency(e.target.value as any)}
              >
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleCalculate}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Calculate Returns'}
            </Button>
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {result && (
          <Box sx={{ mt: 4 }}>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Results
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Invested
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {formatCurrency(result.totalInvested)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Current Value
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                    {formatCurrency(result.currentValue)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Units
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {formatNumber(result.totalUnits, 3)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Absolute Return
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: result.absoluteReturn >= 0 ? 'success.main' : 'error.main',
                    }}
                  >
                    {formatPercentage(result.absoluteReturn)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {result.investments.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  Investment Growth
                </Typography>
                <Box sx={{ width: '100%', height: 300 }}>
                  <LineChart
                    xAxis={[
                      {
                        data: result.investments.map((inv) => new Date(inv.date)),
                        scaleType: 'time',
                        valueFormatter: (date) =>
                          new Date(date).toLocaleDateString('en-IN', {
                            month: 'short',
                            year: 'numeric',
                          }),
                      },
                    ]}
                    series={[
                      {
                        data: result.investments.map((inv) => inv.totalInvested),
                        label: 'Invested',
                        color: '#ff9800',
                        showMark: false,
                      },
                      {
                        data: result.investments.map((inv) => inv.currentValue),
                        label: 'Current Value',
                        color: '#4caf50',
                        showMark: false,
                      },
                    ]}
                    height={300}
                    margin={{ top: 20, right: 20, bottom: 60, left: 80 }}
                  />
                </Box>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
