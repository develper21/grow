import React, { useEffect, useState } from "react";
import Link from 'next/link';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  Chip,
  Avatar,
  Stack,
  IconButton,
  Alert,
  useTheme,
  alpha,
  Tooltip,
  Divider,
} from "@mui/material";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShieldIcon from '@mui/icons-material/Shield';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";

type Perf = { day: number | null; month: number | null; "3m": number | null; "6m": number | null; "1y": number | null };

interface Entry {
  item: { userId: string; schemeCode: string; addedAt: string; note?: string };
  fund?: any;
  perf: Perf;
}

const PerformanceChip = ({ value, label }: { value: number | null; label: string }) => {
  if (value === null) {
    return (
      <Chip
        label={`${label}: N/A`}
        size="small"
        sx={{
          bgcolor: 'grey.100',
          color: 'text.secondary',
          fontSize: '0.75rem',
        }}
      />
    );
  }

  const isPositive = value >= 0;
  return (
    <Chip
      label={`${label}: ${isPositive ? '+' : ''}${value.toFixed(2)}%`}
      size="small"
      sx={{
        bgcolor: isPositive ? alpha('#10b981', 0.1) : alpha('#ef4444', 0.1),
        color: isPositive ? 'success.main' : 'error.main',
        fontSize: '0.75rem',
        fontWeight: 600,
      }}
    />
  );
};

export default function WatchlistPage() {
  const userId = "default-user";
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Entry[]>([]);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get("/api/watchlist", { params: { userId } });
      setItems(res.data.data || []);
    } catch (err) {
      console.error('Error loading watchlist:', err);
      setError('Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  }

  const handleRemoveFromWatchlist = async (schemeCode: string) => {
    try {
      await axios.delete("/api/watchlist", { data: { userId, schemeCode } });
      // Reload watchlist
      load();
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 3,
        }}
      >
        <CircularProgress size={60} sx={{ color: 'primary.main' }} />
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          Loading your watchlist...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'radial-gradient(circle at 10% 20%, rgba(124,93,250,0.1), transparent 45%)' }}>
      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(18,24,48,0.95) 0%, rgba(124,93,250,0.7) 55%, rgba(34,211,238,0.55) 100%)',
          color: 'white',
          py: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center" justifyContent="space-between">
            <Box sx={{ maxWidth: 560 }}>
              <Typography variant="overline" sx={{ letterSpacing: '0.35em', color: alpha('#f8fafc', 0.85) }}>
                WATCHLIST PULSE
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                Zero-latency intelligence across your curated funds.
              </Typography>
              <Typography variant="body1" sx={{ color: alpha('#f8fafc', 0.8) }}>
                Monitor mandates, spot winners, and get ahead of compliance guardrails with AI signals designed for wealth teams.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={4}>
                <Link href="/funds" passHref legacyBehavior>
                  <Button component="a" variant="contained" color="primary">
                    Discover Funds
                  </Button>
                </Link>
                <Link href="/portfolio" passHref legacyBehavior>
                  <Button
                    component="a"
                    variant="outlined"
                    sx={{ borderColor: alpha('#f8fafc', 0.4), color: '#f8fafc' }}
                  >
                    Launch Portfolio Lab
                  </Button>
                </Link>
              </Stack>
            </Box>

            <Grid container spacing={2} maxWidth={420}>
              {[
                { label: 'Tracked Funds', value: items.length.toString(), icon: <TrendingUpIcon /> },
                { label: 'Breaches', value: '3 critical', icon: <ShieldIcon /> },
              ].map((stat) => (
                <Grid item xs={12} sm={6} key={stat.label}>
                  <Box
                    sx={{
                      borderRadius: 6,
                      p: 3,
                      backgroundColor: alpha('#050816', 0.4),
                      border: '1px solid rgba(248,250,252,0.25)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                    }}
                  >
                    <Avatar sx={{ bgcolor: 'rgba(124,93,250,0.3)', color: 'white', width: 40, height: 40 }}>
                      {stat.icon}
                    </Avatar>
                    <Typography variant="h4" fontWeight={700}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha('#f8fafc', 0.7) }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {items.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
              Your watchlist is empty
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
              Add funds to your watchlist to track their performance here
            </Typography>
            <Link href="/funds" passHref legacyBehavior>
              <Button component="a" variant="contained">
                Explore Funds
              </Button>
            </Link>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {items.map((e) => {
              const fund = e.fund;
              return (
                <Grid item xs={12} md={6} lg={4} key={e.item.schemeCode}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 6,
                      border: '1px solid rgba(124,93,250,0.25)',
                      backgroundColor: alpha('#0f172a', 0.65),
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: '0 25px 60px rgba(5, 8, 22, 0.45)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      {/* Header */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              mb: 1,
                              lineHeight: 1.3,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {fund?.name || e.item.schemeCode}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Code: {e.item.schemeCode}
                          </Typography>
                        </Box>

                        <Tooltip title="Remove from Watchlist">
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveFromWatchlist(e.item.schemeCode)}
                            sx={{
                              color: 'error.main',
                              '&:hover': {
                                bgcolor: alpha(theme.palette.error.main, 0.1),
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>

                      {fund?.currentNAV && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                            Current NAV
                          </Typography>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: '#67e8f9' }}>
                            ₹{fund.currentNAV.toFixed(2)}
                          </Typography>
                          {fund?.currentNAVDate && (
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              as of {new Date(fund.currentNAVDate).toLocaleDateString()}
                            </Typography>
                          )}
                        </Box>
                      )}

                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                          Performance
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          <PerformanceChip value={e.perf.day} label="1D" />
                          <PerformanceChip value={e.perf.month} label="1M" />
                          <PerformanceChip value={e.perf['3m']} label="3M" />
                          <PerformanceChip value={e.perf['6m']} label="6M" />
                          <PerformanceChip value={e.perf['1y']} label="1Y" />
                        </Stack>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Added {new Date(e.item.addedAt).toLocaleDateString()}
                        </Typography>
                        <Link href={`/scheme/${e.item.schemeCode}`} passHref legacyBehavior>
                          <Button
                            component="a"
                            variant="outlined"
                            size="small"
                          >
                            View Details
                          </Button>
                        </Link>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
