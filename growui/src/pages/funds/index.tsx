import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  InputAdornment,
  CircularProgress,
  Alert,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Avatar,
  Button,
  IconButton,
  useTheme,
  Paper,
  alpha,
  Tooltip,
  Snackbar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import AddIcon from '@mui/icons-material/Add';
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
        borderRadius: 4,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid',
        borderColor: 'rgba(0, 0, 0, 0.08)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
          borderColor: 'primary.main',
        },
        cursor: 'pointer',
        position: 'relative',
      }}
      onClick={() => onClick(scheme.schemeCode)}
    >
      {/* Watchlist Button */}
      {onWatchlistToggle && (
        <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}>
          <Tooltip title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}>
            <IconButton
              size="small"
              onClick={handleWatchlistClick}
              sx={{
                bgcolor: isInWatchlist ? alpha(theme.palette.primary.main, 0.1) : 'rgba(255, 255, 255, 0.9)',
                color: isInWatchlist ? 'primary.main' : 'text.secondary',
                '&:hover': {
                  bgcolor: isInWatchlist ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                },
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              {isInWatchlist ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      )}

      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
              width: 48,
              height: 48,
              fontSize: '1.2rem',
              fontWeight: 700,
            }}
          >
            {fundHouse.substring(0, 2).toUpperCase()}
          </Avatar>
          <Chip
            label={category}
            size="small"
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        </Box>

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
            minHeight: '3.5em',
          }}
        >
          {scheme.schemeName.replace(/^[^-]+-\s*/, '')}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            mb: 2,
            fontSize: '0.85rem',
          }}
        >
          {fundHouse}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              Fund Code
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {scheme.schemeCode}
            </Typography>
          </Box>
          <TrendingUpIcon sx={{ color: 'success.main', fontSize: 24 }} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default function FundsPage() {
  const router = useRouter();
  const theme = useTheme();
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

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((scheme) =>
        scheme.schemeName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((scheme) =>
        scheme.schemeName.toLowerCase().includes(categoryFilter.toLowerCase())
      );
    }

    // Sort
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
        params: { userId: 'default-user' } // Using default user for now
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
      const response = await axios.get('/api/mf');
      setSchemes(response.data);
      setFilteredSchemes(response.data);
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
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
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
              Discover Mutual Funds
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
              Explore thousands of mutual funds with advanced filtering, search, and detailed analytics
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
                📊 {schemes.length.toLocaleString()} funds available
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 3 } }}>
        {/* Filters Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'rgba(0, 0, 0, 0.08)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(248,250,252,0.8) 100%)',
          }}
        >
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterListIcon />
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
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: 'background.paper',
                    }
                  }
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
                    borderRadius: 3,
                    backgroundColor: 'background.paper',
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
                    borderRadius: 3,
                    backgroundColor: 'background.paper',
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
                  color: 'primary.main',
                }}
              >
                Clear Filters
              </Button>
            )}
          </Box>
        </Paper>

        {/* Funds Grid */}
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
              sx={{ borderRadius: 3 }}
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

      {/* Snackbar for notifications */}
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
