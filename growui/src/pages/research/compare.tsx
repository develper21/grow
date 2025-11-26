import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { fetchCompareData, useFundScreener } from '@/lib/researchApi';
import { CompareFundsResponse, FundScreenerFilters } from '@/types/research';
import { useNotification } from '@/context/NotificationContext';

const baseFilters: FundScreenerFilters = { minRating: 3 };

export default function CompareFundsPage() {
  const { notify } = useNotification();
  const { screener, loading } = useFundScreener(baseFilters);
  const [baseCode, setBaseCode] = useState('');
  const [peerCodes, setPeerCodes] = useState<string[]>([]);
  const [comparison, setComparison] = useState<CompareFundsResponse | null>(null);
  const [comparing, setComparing] = useState(false);

  const fundOptions = screener?.results ?? [];

  useEffect(() => {
    if (fundOptions.length && !baseCode) {
      setBaseCode(fundOptions[0].schemeCode);
      setPeerCodes(fundOptions.slice(1, 3).map((fund) => fund.schemeCode));
    }
  }, [fundOptions, baseCode]);

  const handleCompare = async () => {
    if (!baseCode) {
      notify('Select a base fund to compare', 'warning');
      return;
    }
    setComparing(true);
    try {
      const data = await fetchCompareData(baseCode, peerCodes);
      setComparison(data);
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Failed to compare funds', 'error');
    } finally {
      setComparing(false);
    }
  };

  const metricRows = useMemo(() => {
    if (!comparison) return [];
    return [comparison.base, ...comparison.peers];
  }, [comparison]);

  return (
    <>
      <Head>
        <title>Compare Funds | Grow</title>
      </Head>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={3} mb={3}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Compare funds
            </Typography>
            <Typography color="text.secondary">
              Benchmark a base scheme against peers across returns, factors, and expenses.
            </Typography>
          </Box>
        </Stack>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <Autocomplete
                  loading={loading}
                  options={fundOptions}
                  getOptionLabel={(option) => `${option.schemeName} (${option.schemeCode})`}
                  value={fundOptions.find((fund) => fund.schemeCode === baseCode) ?? null}
                  onChange={(_, value) => setBaseCode(value?.schemeCode ?? '')}
                  renderInput={(params) => <TextField {...params} label="Base fund" size="small" />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  multiple
                  loading={loading}
                  options={fundOptions.filter((fund) => fund.schemeCode !== baseCode)}
                  getOptionLabel={(option) => `${option.schemeName} (${option.schemeCode})`}
                  value={fundOptions.filter((fund) => peerCodes.includes(fund.schemeCode))}
                  onChange={(_, values) => setPeerCodes(values.map((fund) => fund.schemeCode))}
                  renderInput={(params) => <TextField {...params} label="Peers" size="small" placeholder="Select peers" />}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<CompareArrowsIcon />}
                  onClick={handleCompare}
                  disabled={comparing}
                >
                  {comparing ? 'Comparing…' : 'Compare'}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {comparison ? (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <AssessmentIcon color="primary" />
                    <Typography variant="h6">Performance metrics</Typography>
                  </Stack>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Scheme</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Risk</TableCell>
                        <TableCell>1Y</TableCell>
                        <TableCell>3Y</TableCell>
                        <TableCell>5Y</TableCell>
                        <TableCell>Alpha</TableCell>
                        <TableCell>Beta</TableCell>
                        <TableCell>Sharpe</TableCell>
                        <TableCell>Expense</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {metricRows.map((row) => (
                        <TableRow key={row.schemeCode} hover>
                          <TableCell>
                            <Stack>
                              <Typography variant="subtitle2">{row.schemeName}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {row.schemeCode}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>{row.category.replace('_', ' ')}</TableCell>
                          <TableCell>{row.risk.replace('_', ' ')}</TableCell>
                          <TableCell>{row.returns.oneYear.toFixed(1)}%</TableCell>
                          <TableCell>{row.returns.threeYear.toFixed(1)}%</TableCell>
                          <TableCell>{row.returns.fiveYear.toFixed(1)}%</TableCell>
                          <TableCell>{row.alpha.toFixed(2)}</TableCell>
                          <TableCell>{row.beta.toFixed(2)}</TableCell>
                          <TableCell>{row.sharpe.toFixed(2)}</TableCell>
                          <TableCell>{row.expenseRatio.toFixed(2)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Card>
            <CardContent>
              <Typography align="center" color="text.secondary">
                Select a base fund and peers to view comparison.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Container>
    </>
  );
}
