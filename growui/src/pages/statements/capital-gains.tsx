import { useMemo, useState } from 'react';
import Head from 'next/head';
import {
  Box,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import TimelineIcon from '@mui/icons-material/Timeline';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useCapitalGainsReport } from '@/lib/statementsApi';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

export default function CapitalGainsPage() {
  const { report, loading } = useCapitalGainsReport();
  const [assetFilter, setAssetFilter] = useState<string>('all');

  const filteredLots = useMemo(() => {
    if (!report?.lots) return [];
    if (assetFilter === 'all') return report.lots;
    return report.lots.filter((lot) => lot.assetClass === assetFilter);
  }, [report?.lots, assetFilter]);

  return (
    <>
      <Head>
        <title>Capital Gains Report | Grow</title>
      </Head>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={3} mb={3}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Capital gains report
            </Typography>
            <Typography color="text.secondary">
              Track realized gains across asset classes and download data for filings.
            </Typography>
          </Box>
          {report && (
            <Typography variant="body2" color="text.secondary">
              Generated on {new Date(report.generatedAt).toLocaleString('en-IN')}
            </Typography>
          )}
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <SummaryCard
              icon={<CurrencyExchangeIcon color="success" />}
              label="Short-term gains"
              value={report ? formatCurrency(report.summary.shortTermGain) : '—'}
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SummaryCard
              icon={<TimelineIcon color="primary" />}
              label="Long-term gains"
              value={report ? formatCurrency(report.summary.longTermGain) : '—'}
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SummaryCard
              icon={<AssessmentIcon color="warning" />}
              label="Total gains"
              value={report ? formatCurrency(report.summary.totalGain) : '—'}
              loading={loading}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} mt={0.5}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">Lots</Typography>
                  <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Asset class</InputLabel>
                    <Select
                      label="Asset class"
                      value={assetFilter}
                      onChange={(event) => setAssetFilter(event.target.value)}
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="equity">Equity</MenuItem>
                      <MenuItem value="debt">Debt</MenuItem>
                      <MenuItem value="gold">Gold</MenuItem>
                      <MenuItem value="hybrid">Hybrid</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
                <Table size="small" sx={{ mt: 2 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Scheme</TableCell>
                      <TableCell>Units</TableCell>
                      <TableCell>Buy date</TableCell>
                      <TableCell>Sell date</TableCell>
                      <TableCell align="right">Gain</TableCell>
                      <TableCell>Type</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredLots.map((lot) => (
                      <TableRow key={lot.id} hover>
                        <TableCell>
                          <Stack>
                            <Typography variant="subtitle2">{lot.schemeName}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {lot.assetClass.toUpperCase()} • {lot.folio}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>{lot.units.toFixed(2)}</TableCell>
                        <TableCell>{new Date(lot.purchaseDate).toLocaleDateString('en-IN')}</TableCell>
                        <TableCell>{new Date(lot.saleDate).toLocaleDateString('en-IN')}</TableCell>
                        <TableCell align="right">{formatCurrency(lot.gain)}</TableCell>
                        <TableCell>{lot.gainType === 'short_term' ? 'Short' : 'Long'}</TableCell>
                      </TableRow>
                    ))}
                    {!filteredLots.length && (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <Typography align="center" color="text.secondary">
                            {loading ? 'Loading gains…' : 'No matching lots'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Breakdown
                </Typography>
                <Stack spacing={2}>
                  {report?.breakdown.map((row) => (
                    <Box key={row.assetClass}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2">{row.assetClass.toUpperCase()}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {row.shortTermGain ? `${formatCurrency(row.shortTermGain)} ST` : ''}{' '}
                          {row.longTermGain ? `${formatCurrency(row.longTermGain)} LT` : ''}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={2} mt={1}>
                        <MiniStat label="Short" value={formatCurrency(row.shortTermGain)} color="error.main" />
                        <MiniStat label="Long" value={formatCurrency(row.longTermGain)} color="success.main" />
                      </Stack>
                    </Box>
                  )) || (
                    <Typography color="text.secondary">{loading ? 'Loading breakdown…' : 'No data'}</Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  loading?: boolean;
}

const SummaryCard = ({ icon, label, value, loading }: SummaryCardProps) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box>{icon}</Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h5" fontWeight={700}>
            {loading ? '…' : value}
          </Typography>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

const MiniStat = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <Box sx={{ flex: 1 }}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="subtitle2" sx={{ color }}>
      {value}
    </Typography>
  </Box>
);
