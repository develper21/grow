import Head from 'next/head';
import Link from 'next/link';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useOrders } from '@/context/OrdersContext';
import { formatCurrency } from '@/utils/calculations';

const statusCopy = {
  active: { label: 'Active', color: 'success' as const, icon: <PlayCircleOutlineIcon fontSize="small" /> },
  paused: { label: 'Paused', color: 'default' as const, icon: <PauseCircleOutlineIcon fontSize="small" /> },
};

export default function MandateManagementPage() {
  const { mandates, mandatesLoading, refreshMandates, toggleMandateStatus } = useOrders();

  const handleToggle = async (id: string) => {
    await toggleMandateStatus(id);
  };

  const summary = mandates.reduce(
    (acc, mandate) => {
      acc.total += 1;
      acc[mandate.status] += 1;
      return acc;
    },
    { total: mandates.length, active: 0, paused: 0 }
  );

  return (
    <>
      <Head>
        <title>Mandate Management | Grow</title>
      </Head>
      <Container sx={{ py: 4 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} mb={3}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Mandate Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Control auto-debit limits powering your SIP instructions.
            </Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} width={{ xs: '100%', sm: 'auto' }}>
            <Button component={Link} href="/orders" startIcon={<ArrowBackIcon />} variant="outlined" fullWidth>
              Order book
            </Button>
            <Button onClick={refreshMandates} startIcon={<AutorenewIcon />} variant="contained" fullWidth>
              Refresh
            </Button>
          </Stack>
        </Stack>

        {mandatesLoading && <LinearProgress sx={{ mb: 3 }} />}

        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Total mandates
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {summary.total}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Active
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {summary.active}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Paused
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {summary.paused}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {mandates.map((mandate) => (
            <Grid item xs={12} md={6} key={mandate.id}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                      <Typography fontWeight={700}>{mandate.nickname}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {mandate.bank}
                      </Typography>
                    </Box>
                    <Chip
                      icon={statusCopy[mandate.status].icon}
                      label={statusCopy[mandate.status].label}
                      color={statusCopy[mandate.status].color}
                      size="small"
                    />
                  </Stack>
                  <Stack direction="row" spacing={4}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Limit
                      </Typography>
                      <Typography variant="h6" fontWeight={700}>
                        {formatCurrency(mandate.limit)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Created on
                      </Typography>
                      <Typography fontWeight={600}>{new Date(mandate.createdAt).toLocaleDateString('en-IN')}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
                <CardActions sx={{ px: 3, pb: 3 }}>
                  <Button
                    variant="contained"
                    color={mandate.status === 'active' ? 'inherit' : 'primary'}
                    onClick={() => handleToggle(mandate.id)}
                  >
                    {mandate.status === 'active' ? 'Pause mandate' : 'Activate mandate'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}

          {mandates.length === 0 && !mandatesLoading && (
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    No mandates yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start a SIP from any fund detail page to create your first auto-debit mandate.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
}
