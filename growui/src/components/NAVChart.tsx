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
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import {
  LineChart,
  BarChart,
} from '@mui/x-charts';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Line, Bar, Scatter } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

import { NAVData } from '@/types';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface NAVChartProps {
  data: NAVData[];
  period?: string;
  fundName?: string;
}

// Define all chart types with their properties
type ChartType = 'line' | 'bar' | 'line_markers' | 'step_line' | 'area' | 'bars' | 'candles' | 'hollow_candles' | 'hlc_area' | 'baseline' | 'columns' | 'high_low' | 'heikin_ashi' | 'renko' | 'line_break' | 'kagi' | 'point_figure';

interface ChartTypeOption {
  value: ChartType;
  label: string;
  color: string;
}

interface MuiChartConfig {
  type: 'mui-bar';
  series: any;
  xAxis: any;
}

interface ChartJsConfig {
  type: 'line' | 'scatter';
  data: any;
  options: any;
}

type ChartConfig = MuiChartConfig | ChartJsConfig;

// Chart type configurations with different colors
const chartTypeOptions: ChartTypeOption[] = [
  { value: 'line', label: 'Line', color: '#2563eb' },
  { value: 'bar', label: 'Bar', color: '#dc2626' },
  { value: 'line_markers', label: 'Line with Markers', color: '#7c3aed' },
  { value: 'step_line', label: 'Step Line', color: '#059669' },
  { value: 'area', label: 'Area', color: '#ea580c' },
  { value: 'bars', label: 'Bars', color: '#0891b2' },
  { value: 'candles', label: 'Candles', color: '#be123c' },
  { value: 'hollow_candles', label: 'Hollow Candles', color: '#4338ca' },
  { value: 'hlc_area', label: 'HLC Area', color: '#c2410c' },
  { value: 'baseline', label: 'Baseline', color: '#059669' },
  { value: 'columns', label: 'Columns', color: '#7c2d12' },
  { value: 'high_low', label: 'High-Low', color: '#1e40af' },
  { value: 'heikin_ashi', label: 'Heikin Ashi', color: '#7c3aed' },
  { value: 'renko', label: 'Renko', color: '#dc2626' },
  { value: 'line_break', label: 'Line Break', color: '#0891b2' },
  { value: 'kagi', label: 'Kagi', color: '#059669' },
  { value: 'point_figure', label: 'Point & Figure', color: '#7c2d12' },
];

export default function NAVChart({ data, period = '1y', fundName }: NAVChartProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [chartType, setChartType] = useState<ChartType>('line');

  const chartDataArray = useMemo(() => {
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
      .filter((item: any) => {
        const date = new Date(item.date);
        const cutoff = new Date(now);
        cutoff.setMonth(cutoff.getMonth() - monthsAgo);
        return date >= cutoff;
      })
      .reverse();
  }, [data, period]);

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

  const { chartConfig, navValues, firstValue, lastValue, performance, isPositive } = useMemo(() => {
    const navValues = chartDataArray.map((d: any) => Number(d.nav));
    const firstValue = navValues[0];
    const lastValue = navValues[navValues.length - 1];
    const performance = ((lastValue - firstValue) / firstValue) * 100;
    const isPositive = performance >= 0;

    // Get current chart type config
    const currentChartConfig = chartTypeOptions.find(option => option.value === chartType);
    const chartColor = currentChartConfig?.color || theme.palette.primary.main;

    if (chartType === 'bar' || chartType === 'bars' || chartType === 'columns') {
      const dateLabels = chartDataArray.map((d: any) =>
        new Date(d.date).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      );

      const barSeries = [{
        data: navValues,
        label: 'NAV',
        backgroundColor: chartColor,
        borderColor: chartColor,
      }];

      const barXAxis = [{
        data: dateLabels,
        scaleType: 'band' as const,
        valueFormatter: (value: string) => value,
      }];

      return {
        chartConfig: {
          type: 'mui-bar',
          series: barSeries as any,
          xAxis: barXAxis as any,
        },
        navValues,
        firstValue,
        lastValue,
        performance,
        isPositive
      };
    } else {
      // Chart.js configuration for advanced chart types
      const timestamps = chartDataArray.map((d: any) => new Date(d.date).getTime());
      const labels = timestamps.map((ts: number) => formatDateFromTs(ts));

      let chartData: ChartData<'line', number[], string> | null = null;
      let scatterData: ChartData<'scatter', {x: number, y: number | number[]}[], string> | null = null;
      let options: ChartOptions<'line'> | null = null;
      let scatterOptions: ChartOptions<'scatter'> | null = null;

      // Common options for all chart types
      const baseOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: chartColor,
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: chartColor,
            borderWidth: 1,
          }
        },
        scales: {
          x: {
            type: 'time',
            time: { displayFormats: { day: 'dd MMM', month: 'MMM yyyy' } },
            grid: { display: true, color: 'rgba(0,0,0,0.1)' }
          },
          y: {
            grid: { display: true, color: 'rgba(0,0,0,0.1)' }
          }
        },
        interaction: { intersect: false }
      };

      // Create different chart configurations based on type
      switch (chartType) {
        case 'line':
          chartData = {
            labels,
            datasets: [{
              label: 'NAV',
              data: navValues,
              borderColor: chartColor,
              backgroundColor: 'transparent',
              tension: 0.1,
              pointRadius: 0,
              pointHoverRadius: 4,
              borderWidth: 2,
            }]
          };
          options = baseOptions;
          break;

        case 'line_markers':
          chartData = {
            labels,
            datasets: [{
              label: 'NAV',
              data: navValues,
              borderColor: chartColor,
              backgroundColor: chartColor + '20',
              tension: 0.1,
              pointRadius: 4,
              pointHoverRadius: 8,
              pointBackgroundColor: chartColor,
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              borderWidth: 2,
            }]
          };
          options = baseOptions;
          break;

        case 'step_line':
          chartData = {
            labels,
            datasets: [{
              label: 'NAV',
              data: navValues,
              borderColor: chartColor,
              backgroundColor: 'transparent',
              stepped: 'middle',
              pointRadius: 0,
              borderWidth: 2,
            }]
          };
          options = baseOptions;
          break;

        case 'area':
          chartData = {
            labels,
            datasets: [{
              label: 'NAV',
              data: navValues,
              borderColor: chartColor,
              backgroundColor: chartColor + '30',
              fill: true,
              tension: 0.4,
              pointRadius: 0,
              borderWidth: 2,
            }]
          };
          options = baseOptions;
          break;

        case 'baseline':
          // Baseline chart showing deviation from first value
          const baselineData = navValues.map((val, index) =>
            index === 0 ? 0 : ((val - navValues[0]) / navValues[0]) * 100
          );
          chartData = {
            labels,
            datasets: [{
              label: 'NAV Performance',
              data: baselineData,
              borderColor: chartColor,
              backgroundColor: chartColor + '20',
              fill: true,
              tension: 0.1,
              pointRadius: 0,
              borderWidth: 2,
            }]
          };
          options = baseOptions;
          break;

        case 'high_low':
          // High-Low chart showing range
          const highLowData = navValues.map((nav, index) => {
            const range = Math.abs(nav * 0.02); // 2% range for demo
            return {
              x: timestamps[index],
              y: [nav - range, nav + range]
            };
          });

          // Use scatter plot for high-low
          scatterData = {
            labels,
            datasets: [{
              label: 'NAV Range',
              data: highLowData,
              backgroundColor: chartColor + '40',
              borderColor: chartColor,
              borderWidth: 1,
              pointRadius: 0,
            }]
          };

          scatterOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: chartColor,
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: chartColor,
                borderWidth: 1,
              }
            },
            scales: {
              x: {
                type: 'time',
                time: { displayFormats: { day: 'dd MMM', month: 'MMM yyyy' } },
                grid: { display: true, color: 'rgba(0,0,0,0.1)' }
              },
              y: {
                grid: { display: true, color: 'rgba(0,0,0,0.1)' }
              }
            },
            interaction: { intersect: false }
          };
          break;

        case 'candles':
        case 'hollow_candles':
        case 'heikin_ashi':
          // Create candlestick-like effect with thicker lines and markers
          chartData = {
            labels,
            datasets: [{
              label: 'NAV',
              data: navValues,
              borderColor: chartColor,
              backgroundColor: chartColor + '40',
              tension: 0,
              pointRadius: 3,
              pointHoverRadius: 8,
              pointBackgroundColor: chartColor,
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              borderWidth: 3,
            }]
          };
          options = baseOptions;
          break;

        case 'renko':
        case 'line_break':
        case 'kagi':
        case 'point_figure':
          // These are specialized chart types, using stepped area for demo
          chartData = {
            labels,
            datasets: [{
              label: 'NAV',
              data: navValues,
              borderColor: chartColor,
              backgroundColor: chartColor + '25',
              fill: true,
              stepped: 'after',
              pointRadius: 0,
              borderWidth: 1,
            }]
          };
          options = baseOptions;
          break;

        case 'hlc_area':
          // High-Low-Close area chart
          chartData = {
            labels,
            datasets: [{
              label: 'NAV',
              data: navValues,
              borderColor: chartColor,
              backgroundColor: chartColor + '15',
              fill: true,
              tension: 0,
              pointRadius: 0,
              borderWidth: 1,
            }]
          };
          break;

        default:
          // Default line chart
          chartData = {
            labels,
            datasets: [{
              label: 'NAV',
              data: navValues,
              borderColor: chartColor,
              backgroundColor: 'transparent',
              tension: 0.1,
              pointRadius: 0,
              borderWidth: 2,
            }]
          };
          options = baseOptions;
      }

      // For scatter charts, use different scale configuration
      if (chartType === 'high_low') {
        scatterOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: chartColor,
              titleColor: 'white',
              bodyColor: 'white',
              borderColor: chartColor,
              borderWidth: 1,
            }
          },
          scales: {
            x: {
              type: 'time',
              time: { displayFormats: { day: 'dd MMM', month: 'MMM yyyy' } },
              grid: { display: true, color: 'rgba(0,0,0,0.1)' }
            },
            y: {
              grid: { display: true, color: 'rgba(0,0,0,0.1)' }
            }
          },
          interaction: { intersect: false }
        };
      } else {
        options = baseOptions;
      }

      return {
        chartConfig: {
          type: chartType === 'high_low' ? 'scatter' : 'line',
          data: chartType === 'high_low' ? scatterData : chartData,
          options: chartType === 'high_low' ? scatterOptions : options,
        } as ChartConfig,
        navValues,
        firstValue,
        lastValue,
        performance,
        isPositive
      };
    }
  }, [chartDataArray, chartType, theme.palette.primary.main]);

  if (chartDataArray.length === 0) {
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
    <Card sx={{
      borderRadius: 3,
      border: '1px solid',
      borderColor: 'rgba(0,0,0,0.08)',
      overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
    }}>
      {/* Header */}
      <Box sx={{
        p: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
        borderBottom: '1px solid',
        borderColor: 'rgba(0,0,0,0.06)'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
              📈 NAV Performance Chart
            </Typography>
            {fundName && (
              <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {fundName}
              </Typography>
            )}
          </Box>
          <Chip
            label={`${period.toUpperCase()} Period`}
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.15),
              color: 'primary.main',
              fontWeight: 700,
              fontSize: '0.8rem',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
            }}
          />
        </Box>

        {/* Performance Stats */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 3,
          mb: 3,
        }}>
          <Box sx={{
            p: 2,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: 2,
            border: '1px solid',
            borderColor: alpha(theme.palette.primary.main, 0.1),
          }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5, fontSize: '0.75rem' }}>
              Current NAV
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
              {formatCurrency(lastValue)}
            </Typography>
          </Box>

          <Box sx={{
            p: 2,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: 2,
            border: '1px solid',
            borderColor: isPositive ? alpha(theme.palette.success.main, 0.2) : alpha(theme.palette.error.main, 0.2),
          }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5, fontSize: '0.75rem' }}>
              {period.toUpperCase()} Return
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              {isPositive ? (
                <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16 }} />
              ) : (
                <TrendingDownIcon sx={{ color: 'error.main', fontSize: 16 }} />
              )}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: isPositive ? 'success.main' : 'error.main',
                }}
              >
                {isPositive ? '+' : ''}{performance.toFixed(2)}%
              </Typography>
            </Stack>
          </Box>

          <Box sx={{
            p: 2,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: 2,
            border: '1px solid',
            borderColor: alpha(theme.palette.info.main, 0.2),
          }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5, fontSize: '0.75rem' }}>
              Data Points
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'info.main' }}>
              {chartDataArray.length}
            </Typography>
          </Box>
        </Box>

        {/* Chart Type Selector */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <Select
              value={chartType}
              onChange={(event: SelectChangeEvent) => setChartType(event.target.value as ChartType)}
              displayEmpty
              sx={{
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                '& .MuiSelect-select': {
                  py: 1.5,
                  px: 2,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'primary.main',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.3)}`,
                },
              }}
              IconComponent={ExpandMoreIcon}
            >
              {chartTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: option.color,
                      }}
                    />
                    {option.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Chart Area */}
      <Box sx={{
        p: 3,
        background: 'linear-gradient(135deg, rgba(248,250,252,0.5) 0%, rgba(255,255,255,0.5) 100%)',
        height: isMobile ? 320 : 420,
      }}>
        {chartConfig.type === 'mui-bar' ? (
          <BarChart
            series={(chartConfig as MuiChartConfig).series}
            xAxis={(chartConfig as MuiChartConfig).xAxis}
            height={isMobile ? 280 : 380}
            margin={{
              top: 20,
              right: isMobile ? 10 : 30,
              bottom: isMobile ? 50 : 70,
              left: isMobile ? 10 : 60,
            }}
            grid={{ vertical: true, horizontal: true }}
          />
        ) : (
          <Box sx={{ height: '100%', width: '100%' }}>
            {(chartConfig as ChartJsConfig).data && (chartConfig as ChartJsConfig).options && (
              (chartConfig as ChartJsConfig).type === 'scatter' ? (
                <Scatter data={(chartConfig as ChartJsConfig).data} options={(chartConfig as ChartJsConfig).options} />
              ) : (
                <Line data={(chartConfig as ChartJsConfig).data} options={(chartConfig as ChartJsConfig).options} />
              )
            )}
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Box sx={{
        px: 3,
        py: 2,
        bgcolor: alpha(theme.palette.grey[50], 0.8),
        borderTop: '1px solid',
        borderColor: 'rgba(0,0,0,0.06)'
      }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
          📅 Showing NAV data from {formatDateFromTs(chartDataArray[0] ? new Date(chartDataArray[0].date).getTime() : 0)} to {formatDateFromTs(chartDataArray[chartDataArray.length - 1] ? new Date(chartDataArray[chartDataArray.length - 1].date).getTime() : 0)}
        </Typography>
      </Box>
    </Card>
  );
}
