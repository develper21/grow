import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import ShareIcon from '@mui/icons-material/Share';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { PortfolioFilters } from '@/types/portfolio';
import { exportPortfolioData, sharePortfolioSnapshot } from '@/lib/portfolioApi';
import { useNotification } from '@/context/NotificationContext';
import { PortfolioProvider, usePortfolioContext } from '@/context/PortfolioContext';

const timeRanges: PortfolioFilters['timeRange'][] = ['1M', '3M', '6M', '1Y', '3Y', '5Y', 'ALL'];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

const formatDate = (value: string) => new Date(value).toLocaleDateString('en-IN');

export default function PortfolioOverviewPage() {
  return (
    <PortfolioProvider>
      <PortfolioOverviewContent />
    </PortfolioProvider>
  );
}

function PortfolioOverviewContent() {
  const { notify } = useNotification();
  const { filters, setTimeRange, setAccount, accounts, snapshot, loading } = usePortfolioContext();
  const [exporting, setExporting] = useState<'csv' | 'pdf' | null>(null);
  const [sharing, setSharing] = useState(false);

  const kpis = snapshot?.kpis;

  const accountLabel = useMemo(() => {
    if (!filters.accountId) return 'All accounts';
    return accounts.find((acc) => acc === filters.accountId) ?? filters.accountId;
  }, [accounts, filters.accountId]);

  const handleTimeRangeChange = (_: React.MouseEvent<HTMLElement>, value: PortfolioFilters['timeRange'] | null) => {
    if (value) {
      setTimeRange(value);
    }
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      const { shareUrl, expiresAt } = await sharePortfolioSnapshot(filters);
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        notify('Snapshot link copied to clipboard', 'success');
      } else {
        notify('Snapshot link ready in console', 'success');
      }
      console.info('Portfolio share link', { shareUrl, expiresAt });
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Unable to share snapshot', 'error');
    } finally {
      setSharing(false);
    }
  };

  const handleAccountChange = (event: SelectChangeEvent<string>) => {
    const next = event.target.value || undefined;
    setAccount(next);
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    setExporting(format);
    try {
      const response = await exportPortfolioData(format, filters);
      notify(`${format.toUpperCase()} ready: ${response.filename}`, 'success');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Unable to export portfolio', 'error');
    } finally {
      setExporting((current) => (current === format ? null : current));
    }
  };

  const allocation = snapshot?.allocation ?? [];
  const goals = snapshot?.goals ?? [];
  const activities = snapshot?.activities?.slice(0, 8) ?? [];
  const navSeries = snapshot?.navSeries ?? [];

  const allocationChartData = allocation.map((slice) => ({
    id: slice.assetClass,
    value: slice.percentage,
    label: slice.assetClass,
  }));

  const allocationColors: Record<string, string> = {
    equity: '#1976d2',
    debt: '#2e7d32',
    gold: '#c77b00',
    hybrid: '#9c27b0',
  };

  const upcomingContributions = goals
    .map((goal) => {
      const remainingMilestones = Math.max(goal.totalMilestones - goal.milestonesCompleted, 1);
      const amount = Math.max(goal.targetAmount - goal.currentAmount, 0) / remainingMilestones;
      return {
        id: goal.id,
        label: goal.label,
        amount,
        dueDate: goal.targetDate,
      };
    })
    .filter((item) => item.amount > 0)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4);

  const goalSparklineData = goals.map((goal) => Number(((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)));

  const groupedActivities = activities
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .reduce<Record<string, typeof activities>>( (acc, activity) => {
      const label = formatDate(activity.date);
      if (!acc[label]) acc[label] = [];
      acc[label].push(activity);
      return acc;
    }, {});
  const groupedActivityEntries = Object.entries(groupedActivities);

  return (
    <>
      <Head>
        <title>Portfolio Analytics | Grow</title>
      </Head>
      <Box sx={{ minHeight: '100vh', background: 'radial-gradient(circle at 15% 15%, rgba(124,93,250,0.12), transparent 45%)' }}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, rgba(13,20,46,0.95) 0%, rgba(124,93,250,0.65) 45%, rgba(34,211,238,0.55) 100%)',
            color: 'white',
            py: { xs: 6, md: 8 },
          }}
        >
          <Container maxWidth="lg">
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={3} alignItems="center">
              <Box sx={{ maxWidth: 560 }}>
                <Typography variant="overline" sx={{ letterSpacing: '0.4em', color: alpha('#f8fafc', 0.85) }}>
                  PORTFOLIO ANALYTICS
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  Command AUM, IRR, and liquidity from one mission console.
                </Typography>
                <Typography variant="body1" sx={{ color: alpha('#f8fafc', 0.8) }}>
                  Explore NAV trends, goal progress, and asset mix without leaving the unified dashboard shell.
                </Typography>
              </Box>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="flex-start">
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="flex-start">
                  <ToggleButtonGroup
                    value={filters.timeRange}
                    exclusive
                    onChange={handleTimeRangeChange}
                    size="small"
                    color="primary"
                  >
                    {timeRanges.map((range) => (
                      <ToggleButton key={range} value={range} sx={{ px: 1.5 }}>
                        {range}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                  <Select
                    value={filters.accountId ?? ''}
                    onChange={handleAccountChange}
                    displayEmpty
                    size="small"
                    sx={{ minWidth: 180, bgcolor: 'rgba(15,23,42,0.4)', borderRadius: 1.5 }}
                  >
                    <MenuItem value="">
                      <em>All accounts</em>
                    </MenuItem>
                    {accounts.map((account) => (
                      <MenuItem key={account} value={account}>
                        {account}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} width="100%" justifyContent="flex-end">
                  <Button
                    startIcon={<FileDownloadIcon />}
                    variant="outlined"
                    size="small"
                    onClick={() => handleExport('csv')}
                    disabled={exporting === 'csv'}
                  >
                    {exporting === 'csv' ? 'Preparing…' : 'Export CSV'}
                  </Button>
                  <Button
                    startIcon={<FileDownloadIcon />}
                    variant="outlined"
                    size="small"
                    onClick={() => handleExport('pdf')}
                    disabled={exporting === 'pdf'}
                  >
                    {exporting === 'pdf' ? 'Preparing…' : 'Export PDF'}
                  </Button>
                  <Button
                    startIcon={<ShareIcon />}
                    variant="contained"
                    size="small"
                    onClick={handleShare}
                    disabled={sharing}
                  >
                    {sharing ? 'Creating link…' : 'Share snapshot'}
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={3} mb={3}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Total capital overview
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Track AUM, gains, and IRR across all linked accounts.
              </Typography>
            </Box>
          </Stack>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <KpiCard
                icon={<TrendingUpIcon color="primary" />}
                label="Total value"
                primary={kpis ? formatCurrency(kpis.totalValue) : '—'}
                helper={accountLabel}
                loading={loading}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <KpiCard
                icon={<CurrencyExchangeIcon color="success" />}
                label="Total P/L"
                primary={kpis ? formatCurrency(kpis.totalGain) : '—'}
                helper={kpis ? `${kpis.gainPct.toFixed(1)}%` : '—'}
                loading={loading}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <KpiCard
                icon={<AutoGraphIcon color="warning" />}
                label="XIRR"
                primary={kpis ? `${kpis.xirr.toFixed(2)}%` : '—'}
                helper={`As of ${snapshot ? new Date(snapshot.asOf).toLocaleDateString('en-IN') : '—'}`}
                loading={loading}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} mt={0.5}>
            <Grid item xs={12} md={8}>
              <Card sx={{ height: '100%', borderRadius: 5 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Portfolio NAV
                  </Typography>
                  {navSeries.length ? (
                    <LineChart
                      height={260}
                      series={[
                        {
                          data: navSeries.map((point) => point.value),
                          label: 'NAV',
                          area: true,
                          curve: 'linear',
                        },
                      ]}
                      xAxis={[{ data: navSeries.map((point) => point.date), scaleType: 'point' }]}
                      margin={{ left: 40, right: 20, top: 20, bottom: 20 }}
                    />
                  ) : (
                    <Typography color="text.secondary">No NAV history for this filter.</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Goal momentum
                  </Typography>
                  {goalSparklineData.length ? (
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Avg completion
                      </Typography>
                      <Typography variant="h4" fontWeight={700}>
                        {(
                          goalSparklineData.reduce((sum, value) => sum + value, 0) / goalSparklineData.length
                        ).toFixed(1)}
                        %
                      </Typography>
                      <SparkLineChart
                        data={goalSparklineData}
                        curve="natural"
                        showHighlight
                        height={140}
                        colors={[ '#ff9800' ]}
                        margin={{ top: 20, bottom: 10, left: 0, right: 0 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        Progress calculated across {goalSparklineData.length} goals
                      </Typography>
                    </Box>
                  ) : (
                    <Typography color="text.secondary">No goals available.</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3} mt={0.5}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', borderRadius: 5 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Allocation mix
                  </Typography>
                  {allocation.length ? (
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center" mt={1}>
                      <Box sx={{ width: { xs: '100%', sm: 240 }, height: 240 }}>
                        <PieChart
                          colors={allocationChartData.map((item) => allocationColors[item.id] ?? '#90a4ae')}
                          series={[
                            {
                              data: allocationChartData,
                              innerRadius: 60,
                              outerRadius: 110,
                              paddingAngle: 2,
                              cornerRadius: 4,
                            },
                          ]}
                          slotProps={{ legend: { hidden: true } }}
                        />
                      </Box>
                      <Stack spacing={2} flex={1} width="100%">
                        {allocation.map((slice) => (
                          <Stack
                            key={slice.assetClass}
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            gap={2}
                          >
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  backgroundColor: allocationColors[slice.assetClass] ?? '#90a4ae',
                                }}
                              />
                              <Stack>
                                <Typography variant="subtitle2" textTransform="capitalize">
                                  {slice.assetClass}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {formatCurrency(slice.value)}
                                </Typography>
                              </Stack>
                            </Stack>
                            <Chip label={`${slice.percentage.toFixed(1)}%`} color="primary" variant="outlined" />
                          </Stack>
                        ))}
                      </Stack>
                    </Stack>
                  ) : (
                    <Typography color="text.secondary">No allocation data for this filter.</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Goals progress
                  </Typography>
                  <Stack spacing={2}>
                    {goals.map((goal) => {
                      const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
                      const milestoneCount = goal.totalMilestones;
                      const completed = goal.milestonesCompleted;
                      const remainingMilestones = Math.max(milestoneCount - completed, 1);
                      const nextContribution = Math.max(goal.targetAmount - goal.currentAmount, 0) / remainingMilestones;
                      return (
                        <Box key={goal.id}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                            <Typography variant="subtitle2">{goal.label}</Typography>
                            <Chip
                              size="small"
                              label={goal.status.replace('_', ' ')}
                              color={goal.status === 'on_track' ? 'success' : goal.status === 'completed' ? 'primary' : 'warning'}
                            />
                          </Stack>
                          <Typography variant="caption" color="text.secondary">
                            {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)} • Target {formatDate(goal.targetDate)}
                          </Typography>
                          <LinearProgress variant="determinate" value={progress} sx={{ mt: 1 }} />
                          <Stack direction="row" spacing={0.5} mt={1} flexWrap="wrap">
                            {Array.from({ length: milestoneCount }).map((_, index) => (
                              <Chip
                                key={`${goal.id}-milestone-${index}`}
                                size="small"
                                label={`M${index + 1}`}
                                variant={index < completed ? 'filled' : 'outlined'}
                                color={index < completed ? 'success' : 'default'}
                              />
                            ))}
                          </Stack>
                          <Typography variant="body2" color="text.secondary" mt={1}>
                            Upcoming contribution: {formatCurrency(nextContribution)} by {formatDate(goal.targetDate)}
                          </Typography>
                        </Box>
                      );
                    })}
                    {!goals.length && <Typography color="text.secondary">No goals in this view.</Typography>}
                  </Stack>
                  {upcomingContributions.length > 0 && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" gutterBottom>
                        Upcoming contributions
                      </Typography>
                      <List dense disablePadding>
                        {upcomingContributions.map((item) => (
                          <ListItem key={`upcoming-${item.id}`} sx={{ px: 0 }}>
                            <ListItemText
                              primary={item.label}
                              secondary={`Due by ${formatDate(item.dueDate)}`}
                            />
                            <Typography variant="body2" fontWeight={600}>
                              {formatCurrency(item.amount)}
                            </Typography>
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3} mt={0.5}>
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 5 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent activity
                  </Typography>
                  {groupedActivityEntries.length ? (
                    <Stack spacing={2}>
                      {groupedActivityEntries.map(([dateLabel, items]) => (
                        <Box key={dateLabel}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            {dateLabel}
                          </Typography>
                          <List disablePadding>
                            {items.map((activity, index) => (
                              <>
                                <ListItem key={activity.id} sx={{ px: 0 }}>
                                  <ListItemText
                                    primary={
                                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="subtitle2">{activity.title}</Typography>
                                        <Typography variant="body2" color={activity.type === 'sell' ? 'error.main' : 'success.main'}>
                                          {activity.type === 'sell' ? '-' : '+'}
                                          {formatCurrency(activity.amount)}
                                        </Typography>
                                      </Stack>
                                    }
                                    secondary={`${activity.description} • ${activity.tags.join(', ')}`}
                                  />
                                </ListItem>
                                {index < items.length - 1 && <Divider component="li" />}
                              </>
                            ))}
                          </List>
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Typography color="text.secondary">No recent activity for this filter.</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  primary: string;
  helper: string;
  loading?: boolean;
}

const KpiCard = ({ icon, label, primary, helper, loading }: KpiCardProps) => (
  <Card sx={{ height: '100%', borderRadius: 5 }}>
    <CardContent>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            bgcolor: 'rgba(124,93,250,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            {loading ? '…' : primary}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {helper}
          </Typography>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);
