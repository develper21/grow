import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  ToggleButton,
  ToggleButtonGroup,
  Breadcrumbs,
  Link,
  Button,
} from '@mui/material';
import { useRouter } from 'next/router';
import axios from 'axios';
import { SchemeDetails, ReturnData } from '@/types';
import NAVChart from '@/components/NAVChart';
import ReturnsTable from '@/components/ReturnsTable';
import SIPCalculator from '@/components/SIPCalculator';
import LumpsumCalculator from '@/components/LumpsumCalculator';
import SWPCalculator from '@/components/SWPCalculator';
import ComparisonCalculator from '@/components/ComparisonCalculator';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { formatNumber } from '@/utils/calculations';
import { TransactionWizard, OrderType } from '@/components/orders/TransactionWizard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function SchemeDetailPage() {
  const router = useRouter();
  const { code } = router.query;
  const [scheme, setScheme] = useState<SchemeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [chartPeriod, setChartPeriod] = useState('1y');
  const [returns, setReturns] = useState<{
    period: string;
    returns: number | null;
    loading: boolean;
  }[]>([
    { period: '1 Month', returns: null, loading: true },
    { period: '3 Months', returns: null, loading: true },
    { period: '6 Months', returns: null, loading: true },
    { period: '1 Year', returns: null, loading: true },
    { period: '3 Years', returns: null, loading: true },
    { period: '5 Years', returns: null, loading: true },
  ]);

  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardType, setWizardType] = useState<OrderType>('lumpsum');

  const fetchSchemeDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/scheme/${code}`);
      setScheme(response.data);
    } catch (err) {
      setError('Failed to load scheme details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [code]);

  const fetchReturns = useCallback(async () => {
    const periods = ['1m', '3m', '6m', '1y', '3y', '5y'];
    const labels = ['1 Month', '3 Months', '6 Months', '1 Year', '3 Years', '5 Years'];

    for (let i = 0; i < periods.length; i++) {
      try {
        const response = await axios.get<ReturnData>(
          `/api/scheme/${code}/returns?period=${periods[i]}`
        );
        setReturns((prev) => {
          const updated = [...prev];
          updated[i] = {
            period: labels[i],
            returns: response.data.annualizedReturn || response.data.simpleReturn,
            loading: false,
          };
          return updated;
        });
      } catch (err) {
        setReturns((prev) => {
          const updated = [...prev];
          updated[i] = { period: labels[i], returns: null, loading: false };
          return updated;
        });
      }
    }
  }, [code]);

  useEffect(() => {
    if (code) {
      fetchSchemeDetails();
      fetchReturns();
    }
  }, [code, fetchSchemeDetails, fetchReturns]);

  const latestNAV = scheme?.data[0];

  const wizardScheme = useMemo(() => {
    if (!scheme || !latestNAV) {
      return {
        code: Number(code ?? 0),
        name: '',
        nav: '0',
        fundHouse: '',
      };
    }
    return {
      code: scheme.meta.scheme_code,
      name: scheme.meta.scheme_name,
      nav: latestNAV.nav,
      fundHouse: scheme.meta.fund_house,
    };
  }, [scheme, latestNAV, code]);

  const openWizard = (type: OrderType) => {
    setWizardType(type);
    setWizardOpen(true);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading scheme details...
        </Typography>
      </Container>
    );
  }

  if (error || !scheme) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">{error || 'Scheme not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 3 }}
      >
        <Link
          underline="hover"
          color="inherit"
          onClick={() => router.push('/')}
          sx={{ cursor: 'pointer' }}
        >
          Home
        </Link>
        <Link
          underline="hover"
          color="inherit"
          onClick={() => router.push('/funds')}
          sx={{ cursor: 'pointer' }}
        >
          Funds
        </Link>
        <Typography color="text.primary">Scheme Details</Typography>
      </Breadcrumbs>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <Chip label={scheme.meta.scheme_category} color="primary" sx={{ mr: 1 }} />
            <Chip label={scheme.meta.scheme_type} variant="outlined" />
          </Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            {scheme.meta.scheme_name}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {scheme.meta.fund_house}
          </Typography>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">
                Current NAV
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {latestNAV ? `₹${formatNumber(parseFloat(latestNAV.nav))}` : '—'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                as of {latestNAV ? latestNAV.date : '—'}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">
                Scheme Code
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {scheme.meta.scheme_code}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Actions
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1.5} mt={1}>
                <Button variant="contained" onClick={() => openWizard('lumpsum')}>
                  Buy now
                </Button>
                <Button variant="outlined" onClick={() => openWizard('sip')}>
                  Start SIP
                </Button>
                <Button color="inherit" onClick={() => openWizard('redeem')}>
                  Redeem
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              NAV History
            </Typography>
            <ToggleButtonGroup
              value={chartPeriod}
              exclusive
              onChange={(_, value) => value && setChartPeriod(value)}
              size="small"
            >
              <ToggleButton value="1m">1M</ToggleButton>
              <ToggleButton value="3m">3M</ToggleButton>
              <ToggleButton value="6m">6M</ToggleButton>
              <ToggleButton value="1y">1Y</ToggleButton>
              <ToggleButton value="3y">3Y</ToggleButton>
              <ToggleButton value="5y">5Y</ToggleButton>
              <ToggleButton value="all">All</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <NAVChart data={scheme.data} period={chartPeriod} />
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Historical Returns
          </Typography>
          <ReturnsTable returns={returns} />
        </CardContent>
      </Card>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, value) => setTabValue(value)}>
          <Tab label="SIP Calculator" />
          <Tab label="Lumpsum Calculator" />
          <Tab label="SWP Calculator" />
          <Tab label="SIP vs Lumpsum" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <SIPCalculator schemeCode={code as string} />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <LumpsumCalculator schemeCode={code as string} />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <SWPCalculator schemeCode={code as string} />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <ComparisonCalculator schemeCode={code as string} />
      </TabPanel>

      <TransactionWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        scheme={wizardScheme}
        defaultOrderType={wizardType}
      />
    </Container>
  );
}
