import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  Chip,
  InputAdornment,
  CircularProgress,
  Alert,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Button,
  IconButton,
  Stack,
  useTheme,
  Paper,
  alpha,
  Tooltip,
  Snackbar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FilterListIcon from '@mui/icons-material/FilterList';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useRouter } from 'next/router';
import axios from 'axios';
import { MFScheme } from '@/types';

const ITEMS_PER_PAGE = 16;

interface FundCardProps {
  scheme: MFScheme;
  onClick: (code: number) => void;
  fundHouse: string;
  category: string;
  isInWatchlist?: boolean;
  onWatchlistToggle?: (schemeCode: number) => void;
}

const FundCard = ({ scheme, onClick, fundHouse, category, isInWatchlist = false, onWatchlistToggle }: FundCardProps) => {
  const theme = useTheme();

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onWatchlistToggle) {
      onWatchlistToggle(scheme.schemeCode);
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 5,
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid',
        borderColor: isInWatchlist ? alpha(theme.palette.primary.main, 0.6) : 'rgba(148, 163, 184, 0.2)',
        background: 'linear-gradient(140deg, rgba(10,16,32,0.9) 0%, rgba(14,23,42,0.85) 60%, rgba(124,93,250,0.15) 100%)',
        boxShadow: '0 30px 70px rgba(2, 6, 23, 0.55)',
        '&:hover': {
          transform: 'translateY(-8px)',
          borderColor: alpha(theme.palette.secondary.main, 0.8),
          boxShadow: '0 35px 90px rgba(34, 211, 238, 0.3)',
        },
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
      onClick={() => onClick(scheme.schemeCode)}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        }}
      />

      {/* Watchlist Button */}
      {onWatchlistToggle && (
        <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}>
          <Tooltip title={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}>
            <IconButton
              size="small"
              onClick={handleWatchlistClick}
              sx={{
                bgcolor: isInWatchlist ? alpha(theme.palette.primary.main, 0.2) : 'rgba(15, 23, 42, 0.7)',
                color: isInWatchlist ? 'primary.main' : 'text.secondary',
                borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.12)',
                '&:hover': {
                  bgcolor: isInWatchlist ? alpha(theme.palette.primary.main, 0.3) : alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                },
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.35)',
              }}
            >
              {isInWatchlist ? <BookmarkIcon sx={{ fontSize: 18 }} /> : <BookmarkBorderIcon sx={{ fontSize: 18 }} />}
            </IconButton>
          </Tooltip>
        </Box>
      )}

      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.18),
                color: 'primary.main',
                width: 42,
                height: 42,
                fontSize: '0.95rem',
                fontWeight: 700,
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.35),
              }}
            >
              {fundHouse.substring(0, 2).toUpperCase()}
            </Avatar>
            <Box>
              <Chip
                label={category}
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.18),
                  color: '#f8fafc',
                  fontWeight: 600,
                  fontSize: '0.65rem',
                  mb: 0.5,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: alpha('#f8fafc', 0.65),
                  fontSize: '0.78rem',
                  fontWeight: 500,
                }}
              >
                {fundHouse}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2,
            lineHeight: 1.2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '3.2em',
            color: '#f8fafc',
          }}
        >
          {scheme.schemeName.replace(/^[^-]+-\s*/, '')}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
          <Box>
            <Typography variant="body2" sx={{ color: alpha('#f8fafc', 0.6), mb: 0.5, fontSize: '0.72rem' }}>
              Fund Code
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', fontSize: '1rem' }}>
              {scheme.schemeCode}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUpIcon sx={{ color: 'success.main', fontSize: 18 }} />
            <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>
              Active
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default function FundsPage() {
  const router = useRouter();
  const [schemes, setSchemes] = useState<MFScheme[]>([]);
  const [filteredSchemes, setFilteredSchemes] = useState<MFScheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [page, setPage] = useState(1);
  const [watchlistSchemes, setWatchlistSchemes] = useState<Set<number>>(new Set());
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetchSchemes();
    loadWatchlist();
  }, []);

  const filterSchemes = useCallback(() => {
    let filtered = [...schemes];

    if (searchQuery) {
      filtered = filtered.filter((scheme) =>
        scheme.schemeName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((scheme) =>
        scheme.schemeName.toLowerCase().includes(categoryFilter.toLowerCase())
      );
    }

    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.schemeName.localeCompare(b.schemeName));
        break;
      case 'code':
        filtered.sort((a, b) => a.schemeCode - b.schemeCode);
        break;
      default:
        break;
    }

    setFilteredSchemes(filtered);
    setPage(1);
  }, [schemes, searchQuery, categoryFilter, sortBy]);

  useEffect(() => {
    filterSchemes();
  }, [searchQuery, categoryFilter, sortBy, schemes, filterSchemes]);

  const loadWatchlist = async () => {
    try {
      const response = await axios.get('/api/watchlist', {
        params: { userId: 'default-user' }
      });
      const watchlistItems = response.data.data || [];
      const schemeCodes = new Set<number>(watchlistItems.map((item: any) => parseInt(item.item.schemeCode)));
      setWatchlistSchemes(schemeCodes);
    } catch (error) {
      console.error('Error loading watchlist:', error);
    }
  };

  const handleWatchlistToggle = async (schemeCode: number) => {
    try {
      const isCurrentlyInWatchlist = watchlistSchemes.has(schemeCode);

      if (isCurrentlyInWatchlist) {
        await axios.delete('/api/watchlist', {
          data: { userId: 'default-user', schemeCode: schemeCode.toString() }
        });
        setWatchlistSchemes(prev => {
          const newSet = new Set(prev);
          newSet.delete(schemeCode);
          return newSet;
        });
        setSnackbar({ open: true, message: 'Removed from watchlist', severity: 'success' });
      } else {
        await axios.post('/api/watchlist', {
          userId: 'default-user',
          schemeCode: schemeCode.toString()
        });
        setWatchlistSchemes(prev => new Set(prev).add(schemeCode));
        setSnackbar({ open: true, message: 'Added to watchlist', severity: 'success' });
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
      setSnackbar({ open: true, message: 'Failed to update watchlist', severity: 'error' });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/api/mf', {
        params: {
          limit: 10000,
        },
      });
      const schemesData = Array.isArray(response.data) ? response.data : response.data.data;
      setSchemes(schemesData);
      setFilteredSchemes(schemesData);
    } catch (err) {
      setError('Failed to load mutual funds. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'equity', label: 'Equity Funds' },
    { value: 'debt', label: 'Debt Funds' },
    { value: 'hybrid', label: 'Hybrid Funds' },
    { value: 'elss', label: 'ELSS Funds' },
    { value: 'index', label: 'Index Funds' },
    { value: 'liquid', label: 'Liquid Funds' },
  ];

  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'code', label: 'Fund Code' },
  ];

  const paginatedSchemes = filteredSchemes.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredSchemes.length / ITEMS_PER_PAGE);

  const handleSchemeClick = (code: number) => {
    router.push(`/scheme/${code}`);
  };

  const extractFundHouse = (schemeName: string): string => {
    const match = schemeName.match(/^([^-]+)/);
    return match ? match[1].trim() : 'Unknown';
  };

  const extractCategory = (schemeName: string): string => {
    const lower = schemeName.toLowerCase();
    if (lower.includes('equity')) return 'Equity';
    if (lower.includes('debt')) return 'Debt';
    if (lower.includes('hybrid')) return 'Hybrid';
    if (lower.includes('elss')) return 'ELSS';
    if (lower.includes('index')) return 'Index';
    if (lower.includes('liquid')) return 'Liquid';
    return 'Other';
  };

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
        <CircularProgress size={80} sx={{ color: 'primary.main' }} />
        <Typography variant="h5" sx={{ fontWeight: 500, color: 'text.secondary' }}>
          Loading Mutual Funds...
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          We&apos;re fetching the latest fund data for you
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert
          severity="error"
          sx={{
            borderRadius: 3,
            p: 3,
            '& .MuiAlert-icon': {
              fontSize: 28,
            }
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            Unable to Load Funds
          </Typography>
          {error}
        </Alert>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            onClick={fetchSchemes}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontSize: '1rem',
            }}
          >
            Try Again
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        background: 'radial-gradient(circle at 10% 20%, rgba(124,93,250,0.15), transparent 50%)',
        minHeight: '100vh',
      }}
    >
      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(124,93,250,0.65) 45%, rgba(34,211,238,0.5) 100%)',
          color: 'white',
          py: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={3} alignItems="center">
            <Box sx={{ maxWidth: 560 }}>
              <Typography variant="overline" sx={{ letterSpacing: '0.4em', color: alpha('#f8fafc', 0.85) }}>
                RESEARCH & FUNDS
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                Discover mutual funds with institutional-grade clarity.
              </Typography>
              <Typography variant="body1" sx={{ color: alpha('#f8fafc', 0.8) }}>
                Filter, sort, and bookmark thousands of schemes inside the premium dashboard environment.
              </Typography>
            </Box>
            <Chip
              label={`📊 ${schemes.length.toLocaleString()} funds available`}
              color="secondary"
              sx={{ fontWeight: 600, px: 2, py: 0.5, borderRadius: 5, backgroundColor: alpha('#0b1120', 0.35) }}
            />
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 3 } }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 5,
            border: '1px solid rgba(124,93,250,0.25)',
            background: 'linear-gradient(135deg, rgba(11,17,30,0.92), rgba(15,23,42,0.9))',
            boxShadow: '0 25px 60px rgba(2,6,23,0.55)',
          }}
        >
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterListIcon sx={{ fontSize: 20 }} />
            Filters & Search
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search funds by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                  sx: {
                    backgroundColor: 'rgba(15,23,42,0.7)',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  sx={{
                    backgroundColor: 'rgba(15,23,42,0.7)',
                  }}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                  sx={{
                    backgroundColor: 'rgba(15,23,42,0.7)',
                  }}
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Showing {filteredSchemes.length} of {schemes.length} funds
            </Typography>
            {filteredSchemes.length !== schemes.length && (
              <Button
                size="small"
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                }}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  color: 'secondary.main',
                }}
              >
                Clear Filters
              </Button>
            )}
          </Box>
        </Paper>

        <Grid container spacing={3}>
          {paginatedSchemes.map((scheme) => (
            <Grid item xs={12} sm={6} lg={4} xl={3} key={scheme.schemeCode}>
              <FundCard
                scheme={scheme}
                onClick={handleSchemeClick}
                fundHouse={extractFundHouse(scheme.schemeName)}
                category={extractCategory(scheme.schemeName)}
                isInWatchlist={watchlistSchemes.has(scheme.schemeCode)}
                onWatchlistToggle={handleWatchlistToggle}
              />
            </Grid>
          ))}
        </Grid>

        {paginatedSchemes.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
              No funds found
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
              Try adjusting your search or filter criteria
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
              }}
              sx={{ borderRadius: 5 }}
            >
              Clear All Filters
            </Button>
          </Box>
        )}

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: 2,
                  mx: 0.5,
                },
              }}
            />
          </Box>
        )}
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
