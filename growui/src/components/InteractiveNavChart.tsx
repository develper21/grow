// src/components/InteractiveNavChart.tsx
"use client";

import { useState, useMemo } from "react";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  Typography,
  Paper,
  alpha,
  Dialog,
  DialogContent,
  IconButton,
  DialogTitle,
} from "@mui/material";
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

// Extend dayjs to handle the "DD-MM-YYYY" format from the API
dayjs.extend(customParseFormat);

// --- TYPE DEFINITIONS ---
interface NavDataPoint {
  date: string; // The raw date string from the API
  nav: number;
}

// --- CONSTANTS ---
const TIME_RANGES = ["1D", "1W", "1M", "3M", "6M", "1Y", "3Y", "5Y", "Max"];

// --- HELPER COMPONENTS ---

/**
 * A custom tooltip for a better visual experience on hover.
 */
const CustomTooltip = ({ active, payload, label }: any) => {
  const theme = useTheme();
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Paper
        elevation={4}
        sx={{
          p: 1.5,
          backgroundColor: alpha(theme.palette.background.paper, 0.9),
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
        }}
      >
        <Typography variant="body2" fontWeight="bold">
          {dayjs(label).format("DD MMM, YYYY")}
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.primary.main }}>
          NAV: {data.nav.toFixed(4)}
        </Typography>
      </Paper>
    );
  }
  return null;
};

/**
 * The core chart rendering component. It's responsive for the dialog and fixed for the main page.
 */
const ChartRenderer = ({ data, theme, isFullScreen = false }: { data: any[], theme: any, isFullScreen?: boolean }) => {
  if (data.length === 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Typography color="text.secondary">No data available for this time range.</Typography>
      </Box>
    );
  }

  const latestNav = data[data.length - 1].nav;
  const chartMin = Math.min(...data.map(d => d.nav));
  const chartMax = Math.max(...data.map(d => d.nav));
  const domainPadding = (chartMax - chartMin) * 0.1;

  const chart = (
    <LineChart
      // Apply fixed width and height only when NOT in fullscreen
      width={isFullScreen ? undefined : 1000}
      height={isFullScreen ? undefined : 350}
      data={data}
      margin={{ top: 5, right: 30, left: 10, bottom: 20 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
      <XAxis
        dataKey="date"
        type="number"
        domain={["dataMin", "dataMax"]}
        tickFormatter={(unixTime) => dayjs(unixTime).format(data.length > 30 ? "MMM YY" : "DD MMM")}
        tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
        angle={-25}
        textAnchor="end"
        height={50}
      />
      <YAxis
        domain={[chartMin - domainPadding, chartMax + domainPadding]}
        tickFormatter={(value) => value.toFixed(0)}
        tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
      />
      <Tooltip content={<CustomTooltip />} />
      <Line
        type="monotone"
        dataKey="nav"
        stroke={theme.palette.warning.main} // Orange color
        strokeWidth={2.5}
        dot={false}
        activeDot={{ r: 6 }}
      />
      <ReferenceLine
        y={latestNav}
        stroke={theme.palette.text.secondary}
        strokeDasharray="4 4"
        strokeWidth={1.5}
      />
    </LineChart>
  );
  
  // Use ResponsiveContainer only for the fullscreen dialog
  if(isFullScreen){
    return <ResponsiveContainer width="100%" height="100%">{chart}</ResponsiveContainer>
  }

  // Return the fixed-size chart for the normal view
  return chart;
};

// --- MAIN CHART COMPONENT ---

export default function InteractiveNavChart({ data, schemeName }: { data: NavDataPoint[], schemeName?: string }) {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState("1Y");
  const [isDialogOpen, setDialogOpen] = useState(false);

  const processedData = useMemo(() => {
    return data
      .map(d => ({
        ...d,
        parsedDate: dayjs(d.date, "DD-MM-YYYY"),
      }))
      .sort((a, b) => a.parsedDate.unix() - b.parsedDate.unix())
      .map(d => ({
        date: d.parsedDate.valueOf(),
        nav: d.nav,
      }));
  }, [data]);

  const chartData = useMemo(() => {
    if (processedData.length === 0) return [];

    const endDate = dayjs(processedData[processedData.length - 1].date);
    let startDate: dayjs.Dayjs;

    if (timeRange === "Max") return processedData;
    if (timeRange === "1D") startDate = endDate.subtract(1, "day");
    else if (timeRange === "1W") startDate = endDate.subtract(1, "week");
    else {
      const value = parseInt(timeRange.slice(0, -1), 10);
      const unit = timeRange.slice(-1) as "M" | "Y";
      startDate = endDate.subtract(value, unit === "M" ? "month" : "year");
    }

    return processedData.filter(d => d.date >= startDate.valueOf());
  }, [timeRange, processedData]);

  const handleTimeRangeChange = (
    event: React.MouseEvent<HTMLElement>,
    newRange: string | null
  ) => {
    if (newRange) setTimeRange(newRange);
  };

  const ChartControls = (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <ToggleButtonGroup
          value={timeRange}
          exclusive
          onChange={handleTimeRangeChange}
          aria-label="Time range"
          size="small"
        >
          {TIME_RANGES.map((range) => (
            <ToggleButton key={range} value={range} aria-label={range} sx={{ px: { xs: 1, sm: 2 } }}>
              {range}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
  );

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          NAV Performance
        </Typography>
        <IconButton onClick={() => setDialogOpen(true)} aria-label="Fullscreen chart">
            <FullscreenIcon />
        </IconButton>
      </Box>
      
      {ChartControls}

      {/* Wrapper for the normal chart to allow horizontal scrolling */}
      <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <ChartRenderer data={chartData} theme={theme} isFullScreen={false} />
      </Box>

      {/* Fullscreen Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="xl"
      >
        <DialogTitle>
          {schemeName || "NAV Performance"}
          <IconButton
            aria-label="close"
            onClick={() => setDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ height: '80vh' }}>
            {ChartControls}
            <ChartRenderer data={chartData} theme={theme} isFullScreen={true} />
        </DialogContent>
      </Dialog>
    </>
  );
}