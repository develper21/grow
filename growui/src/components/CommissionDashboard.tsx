import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Stack,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalanceWallet as WalletIcon,
  Schedule as ScheduleIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface CommissionData {
  currentMonth: {
    totalCommission: number;
    userShare: number;
    count: number;
    avgPortfolioValue: number;
  };
  historical: Array<{
    period: string;
    totalCommission: number;
    userShare: number;
    count: number;
    avgPortfolioValue: number;
  }>;
  recentCommissions: Array<{
    _id: string;
    period: { month: number; year: number };
    portfolioValue: number;
    userShare: number;
    status: string;
    generatedAt: string;
  }>;
}

interface AvailableCommissions {
  totalAvailable: number;
  count: number;
  periods: Array<{
    period: { month: number; year: number };
    totalAmount: number;
    count: number;
    commissions: Array<{
      _id: string;
      portfolioValue: number;
      userShare: number;
      withdrawalDate: string;
    }>;
  }>;
  canWithdraw: boolean;
}

interface CommissionEstimate {
  totalCurrentValue: number;
  annualProjections: {
    totalAnnualCommission: number;
    userShare: number;
    monthlyAverage: number;
  };
  portfolios: Array<{
    portfolioId: string;
    portfolioName: string;
    currentValue: number;
    monthlyCommission: number;
    annualProjection: number;
    userShare: number;
  }>;
}

interface CommissionDashboardProps {
  userRole: 'company_head' | 'admin' | 'seller' | 'customer';
}

export default function CommissionDashboard({ userRole }: CommissionDashboardProps) {
  const theme = useTheme();
  const [commissionData, setCommissionData] = useState<CommissionData | null>(null);
  const [availableCommissions, setAvailableCommissions] = useState<AvailableCommissions | null>(null);
  const [commissionEstimate, setCommissionEstimate] = useState<CommissionEstimate | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCommissions, setSelectedCommissions] = useState<string[]>([]);

  useEffect(() => {
    fetchCommissionData();
  }, []);

  const fetchCommissionData = async () => {
    try {
      setLoading(true);

      const [monthlyRes, availableRes, estimateRes] = await Promise.all([
        fetch('/api/commissions/monthly'),
        fetch('/api/commissions/available'),
        fetch('/api/portfolio/commission-estimate')
      ]);

      if (monthlyRes.ok) {
        setCommissionData(await monthlyRes.json());
      }

      if (availableRes.ok) {
        setAvailableCommissions(await availableRes.json());
      }

      if (estimateRes.ok) {
        setCommissionEstimate(await estimateRes.json());
      }
    } catch (error) {
      console.error('Error fetching commission data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawCommissions = async () => {
    if (selectedCommissions.length === 0) return;

    try {
      const response = await fetch('/api/commissions/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commissionIds: selectedCommissions })
      });

      if (response.ok) {
        await fetchCommissionData();
        setSelectedCommissions([]);
      }
    } catch (error) {
      console.error('Error withdrawing commissions:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          💰 Commission Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Track your earnings and manage withdrawals
        </Typography>
      </Box>

      {commissionData && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}` }}>
              <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  Current Month Earnings
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  {formatCurrency(commissionData.currentMonth.userShare)}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                  <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16 }} />
                  <Typography variant="body2" sx={{ color: 'success.main' }}>
                    {commissionData.currentMonth.count} portfolios
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: alpha(theme.palette.info.main, 0.05), border: `1px solid ${alpha(theme.palette.info.main, 0.2)}` }}>
              <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  Total Portfolio Value
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'info.main' }}>
                  {formatCurrency(commissionData.currentMonth.avgPortfolioValue)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                  Average per portfolio
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: alpha(theme.palette.success.main, 0.05), border: `1px solid ${alpha(theme.palette.success.main, 0.2)}` }}>
              <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  Annual Projection
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'success.main' }}>
                  {formatCurrency(commissionData.currentMonth.userShare * 12)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                  Based on current month
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: alpha(theme.palette.warning.main, 0.05), border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}` }}>
              <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  Available for Withdrawal
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'warning.main' }}>
                  {formatCurrency(availableCommissions?.totalAvailable || 0)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                  {availableCommissions?.count || 0} pending withdrawals
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                📈 Monthly Earnings Trend
              </Typography>
              {commissionData && commissionData.historical.length > 0 && (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={commissionData.historical}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis tickFormatter={formatCurrency} />
                    <Line
                      type="monotone"
                      dataKey="userShare"
                      stroke={theme.palette.primary.main}
                      strokeWidth={3}
                      dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  💵 Available Withdrawals
                </Typography>
                {availableCommissions?.canWithdraw && (
                  <Chip
                    label="Ready"
                    color="success"
                    size="small"
                    icon={<CheckCircleIcon />}
                  />
                )}
              </Box>

              {availableCommissions && availableCommissions.totalAvailable > 0 ? (
                <>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'success.main', mb: 2 }}>
                    {formatCurrency(availableCommissions.totalAvailable)}
                  </Typography>

                  <List dense>
                    {availableCommissions.periods.map((period) => (
                      <ListItem key={`${period.period.month}-${period.period.year}`}>
                        <ListItemText
                          primary={`${period.period.month}/${period.period.year}`}
                          secondary={`${period.count} portfolios`}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatCurrency(period.totalAmount)}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>

                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleWithdrawCommissions}
                    disabled={selectedCommissions.length === 0}
                  >
                    <WalletIcon sx={{ mr: 1 }} />
                    Withdraw All Available
                  </Button>
                </>
              ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No commissions available for withdrawal yet. Check back on Day 5 of next month.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {commissionEstimate && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              🎯 Annual Commission Projection
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    Total Portfolio Value
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                    {formatCurrency(commissionEstimate.totalCurrentValue)}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.success.main, 0.05), borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    Your Annual Share
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'success.main' }}>
                    {formatCurrency(commissionEstimate.annualProjections.userShare)}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    Monthly Average
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'info.main' }}>
                    {formatCurrency(commissionEstimate.annualProjections.monthlyAverage)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {commissionData && commissionData.recentCommissions.length > 0 && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              📋 Recent Commission Records
            </Typography>

            <List>
              {commissionData.recentCommissions.slice(0, 10).map((commission) => (
                <ListItem key={commission._id} divider>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                      <WalletIcon sx={{ color: 'primary.main' }} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1">
                          {commission.period.month}/{commission.period.year}
                        </Typography>
                        <Chip
                          label={commission.status}
                          size="small"
                          color={commission.status === 'withdrawn' ? 'success' : 'default'}
                        />
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Portfolio: {formatCurrency(commission.portfolioValue)} • Generated: {formatDate(commission.generatedAt)}
                      </Typography>
                    }
                  />
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {formatCurrency(commission.userShare)}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
