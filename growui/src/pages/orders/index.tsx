import { Fragment, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Container,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Step,
  StepLabel,
  Stepper,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import RefreshIcon from '@mui/icons-material/Refresh';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useOrders } from '@/context/OrdersContext';
import { formatCurrency } from '@/utils/calculations';

const statusConfig = {
  processing: { label: 'Processing', color: 'warning' as const },
  executed: { label: 'Executed', color: 'success' as const },
  failed: { label: 'Failed', color: 'error' as const },
};

const orderTypeCopy: Record<string, string> = {
  lumpsum: 'Lumpsum',
  sip: 'Systematic Investment Plan',
  redeem: 'Redemption',
};

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

type TimelineStep = {
  label: string;
  description: string;
  timestamp: string;
  completed: boolean;
  failed?: boolean;
};

export default function OrderBookPage() {
  const { orders, ordersLoading, refreshOrders } = useOrders();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const summary = useMemo(() => {
    const base = { total: orders.length, processing: 0, executed: 0, failed: 0 };
    return orders.reduce((acc, curr) => {
      acc[curr.status] += 1;
      return acc;
    }, base);
  }, [orders]);

  const getTimelineSteps = (status: typeof orders[number]['status'], createdAt: string, updatedAt: string): TimelineStep[] => {
    const placed: TimelineStep = {
      label: 'Order placed',
      description: 'Instruction received and validated',
      timestamp: createdAt,
      completed: true,
    };

    const processing: TimelineStep = {
      label: 'Processing payment',
      description: 'Awaiting confirmation from fund house',
      timestamp: createdAt,
      completed: status !== 'processing',
    };

    const final: TimelineStep = {
      label: status === 'failed' ? 'Failed' : 'Executed',
      description: status === 'failed' ? 'Amount reversed to your account' : 'Units allotted successfully',
      timestamp: status === 'processing' ? '' : updatedAt,
      completed: status !== 'processing',
      failed: status === 'failed',
    };

    return [placed, processing, final];
  };

  return (
    <>
      <Head>
        <title>Order Book | Grow</title>
      </Head>
      <Box sx={{ minHeight: '100vh', background: 'radial-gradient(circle at 5% 15%, rgba(124,93,250,0.12), transparent 45%)' }}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, rgba(18,24,48,0.95) 0%, rgba(124,93,250,0.7) 55%, rgba(34,211,238,0.55) 100%)',
            color: 'white',
            py: { xs: 6, md: 8 },
          }}
        >
          <Container maxWidth="lg">
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={3} alignItems="center">
              <Box sx={{ maxWidth: 540 }}>
                <Typography variant="overline" sx={{ letterSpacing: '0.4em', color: alpha('#f8fafc', 0.85) }}>
                  ORDER STUDIO
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  Command every SIP, lumpsum, and redemption from a single ledger.
                </Typography>
                <Typography variant="body1" sx={{ color: alpha('#f8fafc', 0.8) }}>
                  Monitor statuses, download receipts, and keep compliance-ready trails without leaving the dashboard shell.
                </Typography>
              </Box>
              <Button onClick={refreshOrders} startIcon={<RefreshIcon />} variant="contained" color="secondary">
                Refresh orders
              </Button>
            </Stack>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          {ordersLoading && <LinearProgress sx={{ mb: 3 }} />}

          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: '100%',
                  background: 'linear-gradient(180deg, rgba(16,22,38,0.95), rgba(16,22,38,0.7))',
                }}
              >
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <ReceiptLongIcon sx={{ color: '#22d3ee' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Total orders
                      </Typography>
                      <Typography variant="h5" fontWeight={700}>
                        {summary.total}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', backgroundColor: 'rgba(34,211,238,0.08)' }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <PendingActionsIcon sx={{ color: '#fbbf24' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        In progress
                      </Typography>
                      <Typography variant="h5" fontWeight={700}>
                        {summary.processing}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', backgroundColor: 'rgba(16,185,129,0.08)' }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <DoneAllIcon sx={{ color: '#10b981' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Executed
                      </Typography>
                      <Typography variant="h5" fontWeight={700}>
                        {summary.executed}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card sx={{ borderRadius: 5 }}>
            <CardContent>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2} mb={2}>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Recent activity
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Orders update automatically as the mock engine changes their status.
                  </Typography>
                </Box>
                <Chip
                  icon={<ErrorOutlineIcon />}
                  label="Tip: keep this tab open to watch live status updates"
                  color="info"
                  variant="outlined"
                  sx={{ alignSelf: 'flex-start' }}
                />
              </Stack>
              <TableContainer component={Paper} variant="outlined" sx={{ backgroundColor: 'rgba(15,23,42,0.7)' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell>Order ID</TableCell>
                      <TableCell>Fund</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Placed on</TableCell>
                      <TableCell align="center">Receipt</TableCell>
                    </TableRow>
                  </TableHead>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <Typography variant="body1" gutterBottom>
                          You have not placed any orders yet.
                        </Typography>
                        <Button component={Link} href="/funds" variant="contained">
                          Explore funds
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => {
                      const expanded = expandedOrderId === order.id;
                      const steps = getTimelineSteps(order.status, order.createdAt, order.updatedAt);
                      const finalStepIndex = order.status === 'processing' ? 1 : 2;
                      return (
                        <Fragment key={order.id}>
                          <TableRow hover>
                            <TableCell padding="checkbox">
                              <IconButton size="small" onClick={() => setExpandedOrderId(expanded ? null : order.id)}>
                                {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                              </IconButton>
                            </TableCell>
                            <TableCell sx={{ fontFamily: 'monospace' }}>{order.id}</TableCell>
                            <TableCell>
                              <Typography fontWeight={600}>{order.schemeName}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {order.fundHouse}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Tooltip title={orderTypeCopy[order.orderType] ?? order.orderType}>
                                <Chip label={order.orderType.toUpperCase()} size="small" />
                              </Tooltip>
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                              {formatCurrency(order.amount)}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={statusConfig[order.status].label}
                                color={statusConfig[order.status].color}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">{formatDateTime(order.createdAt)}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                Updated {formatDateTime(order.updatedAt)}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                component="a"
                                href={`/api/orders/${order.id}/receipt`}
                                target="_blank"
                                rel="noreferrer"
                                size="small"
                                disabled={order.status !== 'executed'}
                              >
                                Download
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell colSpan={7} sx={{ py: 0 }}>
                              <Collapse in={expanded} timeout="auto" unmountOnExit>
                                <Box sx={{ my: 2, mx: 1 }}>
                                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                                    Status timeline
                                  </Typography>
                                  <Stepper activeStep={finalStepIndex} orientation="vertical">
                                    {steps.map((step, index) => (
                                      <Step key={step.label} completed={step.completed}>
                                        <StepLabel error={Boolean(step.failed)}>
                                          <Box>
                                            <Typography fontWeight={600}>{step.label}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                              {step.description}
                                            </Typography>
                                            {step.timestamp && (
                                              <Typography variant="caption" color="text.secondary">
                                                {formatDateTime(step.timestamp)}
                                              </Typography>
                                            )}
                                          </Box>
                                        </StepLabel>
                                      </Step>
                                    ))}
                                  </Stepper>
                                  <Divider sx={{ my: 2 }} />
                                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                                    <Box>
                                      <Typography variant="body2" color="text.secondary">
                                        Payment method
                                      </Typography>
                                      <Typography fontWeight={600}>{order.paymentMethod}</Typography>
                                    </Box>
                                    {order.orderType === 'sip' && (
                                      <Box>
                                        <Typography variant="body2" color="text.secondary">
                                          SIP schedule
                                        </Typography>
                                        <Typography fontWeight={600}>
                                          {order.frequency?.toUpperCase()} starting {new Date(order.sipStartDate ?? '').toLocaleDateString('en-IN')}
                                        </Typography>
                                      </Box>
                                    )}
                                  </Stack>
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        </Fragment>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
}
