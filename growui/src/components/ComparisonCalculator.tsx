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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import axios from 'axios';
import { SIPResponse, LumpsumResponse } from '@/types';
import { formatCurrency, formatPercentage } from '@/utils/calculations';

interface ComparisonCalculatorProps {
  schemeCode: string;
}

export default function ComparisonCalculator({ schemeCode }: ComparisonCalculatorProps) {
  const [amount, setAmount] = useState('5000');
  const [fromDate, setFromDate] = useState('2020-01-01');
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sipResult, setSipResult] = useState<SIPResponse | null>(null);
  const [lumpsumResult, setLumpsumResult] = useState<LumpsumResponse | null>(null);

  const handleCompare = async () => {
    setError('');
    setSipResult(null);
    setLumpsumResult(null);

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);

      // Calculate SIP
      const sipResponse = await axios.post(`/api/scheme/${schemeCode}/sip`, {
        amount: parseFloat(amount),
        frequency: 'monthly',
        from: fromDate,
        to: toDate,
      });
      setSipResult(sipResponse.data);

      // Calculate equivalent lumpsum (total SIP amount invested at start)
      const lumpsumAmount = sipResponse.data.totalInvested;
      const lumpsumResponse = await axios.post(`/api/scheme/${schemeCode}/lumpsum`, {
        amount: lumpsumAmount,
        from: fromDate,
        to: toDate,
      });
      setLumpsumResult(lumpsumResponse.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to calculate comparison');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          SIP vs Lumpsum Comparison
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Compare monthly SIP with equivalent lumpsum investment
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Monthly SIP Amount (₹)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
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
              onClick={handleCompare}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Compare Returns'}
            </Button>
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {sipResult && lumpsumResult && (
          <Box sx={{ mt: 4 }}>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Comparison Results
            </Typography>

            <TableContainer component={Paper} elevation={0} sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Metric</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      SIP
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      Lumpsum
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Total Invested</TableCell>
                    <TableCell align="right">{formatCurrency(sipResult.totalInvested)}</TableCell>
                    <TableCell align="right">{formatCurrency(lumpsumResult.invested)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Current Value</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: 'success.main' }}>
                      {formatCurrency(sipResult.currentValue)}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: 'success.main' }}>
                      {formatCurrency(lumpsumResult.currentValue)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Absolute Return</TableCell>
                    <TableCell align="right">{formatPercentage(sipResult.absoluteReturn)}</TableCell>
                    <TableCell align="right">{formatPercentage(lumpsumResult.absoluteReturn)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Annualized Return</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      {formatPercentage(sipResult.annualizedReturn)}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      {formatPercentage(lumpsumResult.annualizedReturn)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Gains</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {formatCurrency(sipResult.currentValue - sipResult.totalInvested)}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {formatCurrency(lumpsumResult.currentValue - lumpsumResult.invested)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ width: '100%', height: 350 }}>
              <BarChart
                xAxis={[
                  {
                    scaleType: 'band',
                    data: ['Invested', 'Current Value', 'Gains'],
                  },
                ]}
                series={[
                  {
                    label: 'SIP',
                    data: [
                      sipResult.totalInvested,
                      sipResult.currentValue,
                      sipResult.currentValue - sipResult.totalInvested,
                    ],
                    color: '#2196f3',
                  },
                  {
                    label: 'Lumpsum',
                    data: [
                      lumpsumResult.invested,
                      lumpsumResult.currentValue,
                      lumpsumResult.currentValue - lumpsumResult.invested,
                    ],
                    color: '#4caf50',
                  },
                ]}
                height={350}
                margin={{ top: 20, right: 20, bottom: 60, left: 80 }}
              />
            </Box>

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Note:</strong> This comparison assumes the same total investment amount.
                The lumpsum amount equals the total SIP invested over the period.
                {lumpsumResult.absoluteReturn > sipResult.absoluteReturn
                  ? ' Lumpsum performed better in this period.'
                  : ' SIP performed better in this period.'}
              </Typography>
            </Alert>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
