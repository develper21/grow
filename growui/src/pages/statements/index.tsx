import { useMemo, useState } from 'react';
import Head from 'next/head';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
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
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import {
  requestStatementGeneration,
  useStatementAuditLog,
  useStatementRequests,
  useTaxInsights,
} from '@/lib/statementsApi';
import { StatementDeliveryChannel, StatementFormat, StatementFrequency } from '@/types/statements';
import { useNotification } from '@/context/NotificationContext';

const frequencies: StatementFrequency[] = ['monthly', 'quarterly', 'fy'];
const formats: StatementFormat[] = ['pdf', 'csv'];
const deliveryOptions: { label: string; value: StatementDeliveryChannel }[] = [
  { label: 'Email', value: 'email' },
  { label: 'In-app', value: 'in_app' },
];

export default function StatementsPage() {
  const { statements, loading, refresh } = useStatementRequests();
  const { insights, loading: insightsLoading } = useTaxInsights();
  const { entries: auditEntries, loading: auditLoading } = useStatementAuditLog();
  const { notify } = useNotification();
  const [frequency, setFrequency] = useState<StatementFrequency>('monthly');
  const [format, setFormat] = useState<StatementFormat>('pdf');
  const [periodStart, setPeriodStart] = useState<string>(new Date().toISOString().split('T')[0]);
  const [periodEnd, setPeriodEnd] = useState<string>(new Date().toISOString().split('T')[0]);
  const [deliveryChannels, setDeliveryChannels] = useState<StatementDeliveryChannel[]>(['email']);
  const [submitting, setSubmitting] = useState(false);
  const [filterFreq, setFilterFreq] = useState<'all' | StatementFrequency>('all');

  const filteredStatements = useMemo(() => {
    if (!statements) return [];
    if (filterFreq === 'all') return statements;
    return statements.filter((item) => item.frequency === filterFreq);
  }, [statements, filterFreq]);

  const handleChannelToggle = (channel: StatementDeliveryChannel) => {
    setDeliveryChannels((prev) =>
      prev.includes(channel) ? prev.filter((item) => item !== channel) : [...prev, channel]
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!periodStart || !periodEnd) {
      notify('Select a period range', 'warning');
      return;
    }
    if (!deliveryChannels.length) {
      notify('Choose at least one delivery channel', 'warning');
      return;
    }
    setSubmitting(true);
    try {
      await requestStatementGeneration({ frequency, periodStart, periodEnd, format, deliveryChannels });
      notify('Statement request submitted', 'success');
      await refresh();
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Failed to create statement', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const statusColor = (status: string): 'default' | 'success' | 'warning' | 'error' => {
    if (status === 'ready') return 'success';
    if (status === 'processing' || status === 'queued') return 'warning';
    if (status === 'failed') return 'error';
    return 'default';
  };

  return (
    <>
      <Head>
        <title>Statements & Tax Center | Grow</title>
      </Head>
      <Box sx={{ minHeight: '100vh', background: 'radial-gradient(circle at 8% 12%, rgba(124,93,250,0.12), transparent 45%)' }}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, rgba(12,20,41,0.95) 0%, rgba(124,93,250,0.65) 45%, rgba(34,211,238,0.55) 100%)',
            color: 'white',
            py: { xs: 6, md: 8 },
          }}
        >
          <Container maxWidth="lg">
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={3} alignItems="center">
              <Box sx={{ maxWidth: 560 }}>
                <Typography variant="overline" sx={{ letterSpacing: '0.45em', color: alpha('#f8fafc', 0.85) }}>
                  STATEMENTS & TAX
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  Generate audit-ready statements and tax packs on command.
                </Typography>
                <Typography variant="body1" sx={{ color: alpha('#f8fafc', 0.8) }}>
                  Trigger requests across channels, monitor readiness, and surface ELSS utilization—all inside the unified shell.
                </Typography>
              </Box>
              <Button startIcon={<RefreshIcon />} onClick={() => refresh()} disabled={loading} variant="contained" color="secondary">
                Refresh
              </Button>
            </Stack>
          </Container>
        </Box>
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          <Grid container spacing={3} mt={0.5}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', borderRadius: 5 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    ELSS utilization
                  </Typography>
                  {insights ? (
                    <Stack spacing={2}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2">FY {insights.elssUtilization.financialYear}</Typography>
                        <Chip
                          label={`${((insights.elssUtilization.investedToDate / insights.elssUtilization.sectionLimit) * 100).toFixed(1)}% used`}
                          color="primary"
                          size="small"
                        />
                      </Stack>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <ElssStat label="Section 80C limit" value={formatCurrency(insights.elssUtilization.sectionLimit)} />
                        <ElssStat label="Invested to date" value={formatCurrency(insights.elssUtilization.investedToDate)} />
                        <ElssStat label="Remaining" value={formatCurrency(insights.elssUtilization.remainingLimit)} />
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        Projected tax savings: {formatCurrency(insights.elssUtilization.projectedTaxSavings)}
                      </Typography>
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Recommended funds
                        </Typography>
                        <Stack spacing={1}>
                          {insights.elssUtilization.recommendedFunds.map((fund) => (
                            <Stack
                              key={fund.schemeCode}
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Box>
                                <Typography variant="body2">{fund.schemeName}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Code: {fund.schemeCode}
                                </Typography>
                              </Box>
                              <Chip label={`SIP ₹${fund.suggestedSip.toLocaleString('en-IN')}`} size="small" />
                            </Stack>
                          ))}
                        </Stack>
                      </Box>
                    </Stack>
                  ) : (
                    <Typography color="text.secondary">
                      {insightsLoading ? 'Loading insights…' : 'Insights unavailable'}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', borderRadius: 5 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Tax-saving insights
                  </Typography>
                  <Stack spacing={2}>
                    {insights?.cards.map((card) => (
                      <Card key={card.id} variant="outlined" sx={{ borderColor: severityColor(card.severity) }}>
                        <CardContent>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
                            <Box>
                              <Typography variant="subtitle2">{card.title}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {card.body}
                              </Typography>
                            </Box>
                            {card.metricLabel && card.metricValue && (
                              <Box textAlign="right">
                                <Typography variant="caption" color="text.secondary">
                                  {card.metricLabel}
                                </Typography>
                                <Typography variant="subtitle1" fontWeight={700}>
                                  {card.metricValue}
                                </Typography>
                              </Box>
                            )}
                          </Stack>
                          {card.ctaLabel && card.ctaHref && (
                            <Button
                              href={card.ctaHref}
                              sx={{ mt: 1 }}
                              size="small"
                              variant="text"
                              color="primary"
                            >
                              {card.ctaLabel}
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    )) || (
                      <Typography color="text.secondary">
                        {insightsLoading ? 'Loading cards…' : 'No insights available'}
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3} mt={0.5}>
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 5 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Audit log
                  </Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Timestamp</TableCell>
                        <TableCell>Action</TableCell>
                        <TableCell>Channel</TableCell>
                        <TableCell>Actor</TableCell>
                        <TableCell>Reference</TableCell>
                        <TableCell>Metadata</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {auditEntries?.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>{new Date(entry.timestamp).toLocaleString('en-IN')}</TableCell>
                          <TableCell>{entry.action}</TableCell>
                          <TableCell>
                            <Chip label={entry.channel} size="small" />
                          </TableCell>
                          <TableCell>{entry.actor}</TableCell>
                          <TableCell>{entry.referenceId}</TableCell>
                          <TableCell>
                            {entry.metadata ? (
                              <Typography variant="caption" color="text.secondary">
                                {Object.entries(entry.metadata)
                                  .map(([key, value]) => `${key}: ${value}`)
                                  .join(', ')}
                              </Typography>
                            ) : (
                              <Typography variant="caption" color="text.secondary">
                                —
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      )) || (
                        <TableRow>
                          <TableCell colSpan={6}>
                            <Typography align="center" color="text.secondary">
                              {auditLoading ? 'Loading log…' : 'No audit history'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

const severityColor = (severity: 'info' | 'warning' | 'success' = 'info') => {
  if (severity === 'warning') return 'warning.light';
  if (severity === 'success') return 'success.light';
  return 'info.light';
};

const ElssStat = ({ label, value }: { label: string; value: string }) => (
  <Box>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="subtitle1" fontWeight={600}>
      {value}
    </Typography>
  </Box>
);
