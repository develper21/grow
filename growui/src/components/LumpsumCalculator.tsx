import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import axios from 'axios';
import { LumpsumResponse } from '@/types';
import { formatCurrency, formatPercentage, formatNumber } from '@/utils/calculations';

interface LumpsumCalculatorProps {
  schemeCode: string;
}

export default function LumpsumCalculator({ schemeCode }: LumpsumCalculatorProps) {
  const [amount, setAmount] = useState('100000');
  const [fromDate, setFromDate] = useState('2020-01-01');
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<LumpsumResponse | null>(null);

  const handleCalculate = async () => {
    setError('');
    setResult(null);

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`/api/scheme/${schemeCode}/lumpsum`, {
        amount: parseFloat(amount),
        from: fromDate,
        to: toDate,
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to calculate lumpsum returns');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Lumpsum Calculator
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Calculate returns for one-time investment
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Investment Amount (₹)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Investment Date"
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

            <Grid container spacing={3}>
              <Grid item xs={6} sm={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Invested
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {formatCurrency(result.invested)}
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
                    {formatNumber(result.units, 3)}
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
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Start NAV ({result.startDate})
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    ₹{formatNumber(result.startNAV)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    End NAV ({result.endDate})
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    ₹{formatNumber(result.endNAV)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Annualized Return
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      color: result.annualizedReturn >= 0 ? 'success.main' : 'error.main',
                    }}
                  >
                    {formatPercentage(result.annualizedReturn)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
