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
import { SWPResponse } from '@/types';
import { formatCurrency, formatNumber } from '@/utils/calculations';

interface SWPCalculatorProps {
  schemeCode: string;
}

export default function SWPCalculator({ schemeCode }: SWPCalculatorProps) {
  const theme = useTheme();
  const [initialInvestment, setInitialInvestment] = useState('500000');
  const [withdrawalAmount, setWithdrawalAmount] = useState('5000');
  const [frequency, setFrequency] = useState<'monthly' | 'quarterly'>('monthly');
  const [fromDate, setFromDate] = useState('2020-01-01');
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<SWPResponse | null>(null);

  const handleCalculate = async () => {
    setError('');
    setResult(null);

    if (!initialInvestment || parseFloat(initialInvestment) <= 0) {
      setError('Please enter a valid initial investment');
      return;
    }

    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      setError('Please enter a valid withdrawal amount');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`/api/scheme/${schemeCode}/swp`, {
        initialInvestment: parseFloat(initialInvestment),
        withdrawalAmount: parseFloat(withdrawalAmount),
        frequency,
        from: fromDate,
        to: toDate,
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to calculate SWP');
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
          bgcolor: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.08)} 0%, ${alpha(theme.palette.error.main, 0.08)} 100%)`,
          borderRadius: 2,
        }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
            💸 SWP Calculator
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Calculate Systematic Withdrawal Plan projections
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Initial Investment (₹)"
              type="number"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Withdrawal Amount (₹)"
              type="number"
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Frequency</InputLabel>
              <Select
                value={frequency}
                label="Frequency"
                onChange={(e) => setFrequency(e.target.value as any)}
              >
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
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
              {loading ? <CircularProgress size={24} /> : 'Calculate SWP'}
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
                    Initial Investment
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {formatCurrency(result.initialInvestment)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Withdrawn
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'warning.main' }}>
                    {formatCurrency(result.totalWithdrawn)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Remaining Value
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                    {formatCurrency(result.remainingValue)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Remaining Units
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {formatNumber(result.remainingUnits, 3)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {result.withdrawals.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  Withdrawal Timeline
                </Typography>
                <Box sx={{ width: '100%', height: 300 }}>
                  <LineChart
                    xAxis={[
                      {
                        data: result.withdrawals.map((w) => new Date(w.date)),
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
                        data: result.withdrawals.map((w) => w.remainingValue),
                        label: 'Remaining Value',
                        color: '#2196f3',
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
