import React, { useEffect, useState } from "react";
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
} from "@mui/material";
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
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 6, md: 8 },
          px: 2,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              My Watchlist
            </Typography>
            <Typography
              variant="h5"
              sx={{
                opacity: 0.95,
                mb: 4,
                maxWidth: 600,
                mx: 'auto',
                fontSize: { xs: '1.1rem', md: '1.3rem' },
              }}
            >
              Track your favorite mutual funds and monitor their performance across different time periods
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                mb: 2,
              }}
            >
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                📊 {items.length} funds in watchlist
              </Typography>
            </Box>
          </Box>
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
            <Button
              variant="contained"
              onClick={() => window.location.href = '/funds'}
              sx={{ borderRadius: 3 }}
            >
              Explore Funds
            </Button>
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
                      borderRadius: 4,
                      transition: 'all 0.3s ease',
                      border: '1px solid',
                      borderColor: 'rgba(0, 0, 0, 0.08)',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
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
                          <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
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
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => window.location.href = `/scheme/${e.item.schemeCode}`}
                          sx={{ borderRadius: 2 }}
                        >
                          View Details
                        </Button>
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
