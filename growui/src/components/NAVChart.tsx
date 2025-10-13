import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  useTheme,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  alpha,
  useMediaQuery,
} from '@mui/material';
import {
  LineChart,
  BarChart,
} from '@mui/x-charts';
import { NAVData } from '@/types';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ShowChartIcon from '@mui/icons-material/ShowChart';

interface NAVChartProps {
  data: NAVData[];
  period?: string;
  fundName?: string;
}

type ChartType = 'line' | 'bar';

export default function NAVChart({ data, period = '1y', fundName }: NAVChartProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [chartType, setChartType] = useState<ChartType>('line');

  // Filter data based on period (memoized)
  const chartData = useMemo(() => {
    const now = new Date();
    const monthsAgo = {
      '1m': 1,
      '3m': 3,
      '6m': 6,
      '1y': 12,
      '3y': 36,
      '5y': 60,
      'all': 9999,
    }[period] || 12;

    return data
      .filter(item => {
        const date = new Date(item.date);
        const cutoff = new Date(now);
        cutoff.setMonth(cutoff.getMonth() - monthsAgo);
        return date >= cutoff;
      })
      .reverse();
  }, [data, period]);

  // Helpers
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const formatDateFromTs = (ts: number) =>
    new Date(ts).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  // Build chart data based on chart type - always call useMemo at top level
  const { series, xAxis, navValues, firstValue, lastValue, performance, isPositive } = useMemo(() => {
    const navValues = chartData.map(d => Number(d.nav));
    const firstValue = navValues[0];
    const lastValue = navValues[navValues.length - 1];
    const performance = ((lastValue - firstValue) / firstValue) * 100;
    const isPositive = performance >= 0;

    if (chartType === 'bar') {
      // For bar charts: use formatted date strings as categories
      const dateLabels = chartData.map(d =>
        new Date(d.date).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      );

      const barSeries = [{
        data: navValues,
        label: 'NAV',
        color: theme.palette.primary.main,
      }];

      const barXAxis = [{
        data: dateLabels,
        scaleType: 'band' as const,
        valueFormatter: (value: string) => value,
      }];

      return {
        series: barSeries as any,
        xAxis: barXAxis as any,
        navValues,
        firstValue,
        lastValue,
        performance,
        isPositive
      };
    } else {
      // For line charts: use timestamps
      const timestamps = chartData.map(d => new Date(d.date).getTime());

      const lineSeries = [{
        data: navValues,
        label: 'NAV',
        color: theme.palette.primary.main,
        showMark: false,
      }];

      const lineXAxis = [{
        data: timestamps,
        scaleType: 'time' as const,
        valueFormatter: (value: number) => formatDateFromTs(value),
      }];

      return {
        series: lineSeries as any,
        xAxis: lineXAxis as any,
        navValues,
        firstValue,
        lastValue,
        performance,
        isPositive
      };
    }
  }, [chartData, chartType, theme.palette.primary.main]);

  if (chartData.length === 0) {
    return (
      <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'rgba(0,0,0,0.08)' }}>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <ShowChartIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
            No Chart Data Available
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Historical NAV data is not available for the selected period
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'rgba(0,0,0,0.08)', overflow: 'visible' }}>
      <CardContent sx={{ p: 0 }}>
        {/* Header */}
        <Box sx={{
          p: 3,
          pb: 2,
          background: 'linear-gradient(135deg, rgba(37,99,235,0.05), rgba(124,58,237,0.05))',
          borderBottom: '1px solid',
          borderColor: 'rgba(0,0,0,0.08)'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                NAV Performance Chart
              </Typography>
              {fundName && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {fundName}
                </Typography>
              )}
            </Box>
            <Stack direction="row" spacing={1}>
              <Chip
                label={`${period.toUpperCase()} Period`}
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  fontWeight: 600,
                }}
              />
            </Stack>
          </Box>

          {/* Performance summary */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                Current NAV
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {formatCurrency(lastValue)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                {period.toUpperCase()} Performance
              </Typography>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                {isPositive ? (
                  <TrendingUpIcon sx={{ color: 'success.main', fontSize: 20 }} />
                ) : (
                  <TrendingDownIcon sx={{ color: 'error.main', fontSize: 20 }} />
                )}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: isPositive ? 'success.main' : 'error.main',
                  }}
                >
                  {isPositive ? '+' : ''}{performance.toFixed(2)}%
                </Typography>
              </Stack>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                Data Points
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {chartData.length}
              </Typography>
            </Box>
          </Box>

          {/* Chart type buttons */}
          <Stack direction="row" spacing={1} justifyContent="center">
            {[
              { type: 'line' as ChartType, label: 'Line', icon: <ShowChartIcon /> },
              { type: 'bar' as ChartType, label: 'Bar', icon: <TrendingUpIcon /> },
            ].map((option) => (
              <Button
                key={option.type}
                variant={chartType === option.type ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setChartType(option.type)}
                startIcon={option.icon}
                sx={{
                  minWidth: 'auto',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  fontSize: '0.8rem',
                  '&.MuiButton-outlined': {
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    color: 'primary.main',
                  },
                }}
              >
                {option.label}
              </Button>
            ))}
          </Stack>
        </Box>

        {/* Chart */}
        <Box sx={{ p: 3 }}>
          {chartType === 'bar' ? (
            <BarChart
              series={series}
              xAxis={xAxis}
              height={isMobile ? 300 : 400}
              margin={{
                top: 20,
                right: isMobile ? 10 : 30,
                bottom: isMobile ? 50 : 70,
                left: isMobile ? 10 : 60,
              }}
              grid={{ vertical: true, horizontal: true }}
            />
          ) : (
            <LineChart
              series={series}
              xAxis={xAxis}
              height={isMobile ? 300 : 400}
              margin={{
                top: 20,
                right: isMobile ? 10 : 30,
                bottom: isMobile ? 50 : 70,
                left: isMobile ? 10 : 60,
              }}
              grid={{ vertical: true, horizontal: true }}
            />
          )}
        </Box>

        {/* Footer */}
        <Box sx={{
          px: 3,
          py: 2,
          backgroundColor: alpha(theme.palette.grey[50], 0.5),
          borderTop: '1px solid',
          borderColor: 'rgba(0,0,0,0.08)'
        }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
            Showing NAV data from {formatDateFromTs(chartData[0] ? new Date(chartData[0].date).getTime() : 0)} to {formatDateFromTs(chartData[chartData.length - 1] ? new Date(chartData[chartData.length - 1].date).getTime() : 0)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
