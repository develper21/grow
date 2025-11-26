import { useMemo, useState } from 'react';
import Head from 'next/head';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import { FundCategory, FundScreenerFilters, RiskProfile } from '@/types/research';
import { useFundScreener, useSavedScreens, useWatchlist } from '@/lib/researchApi';
import { useNotification } from '@/context/NotificationContext';

const categoryOptions: { label: string; value: FundCategory }[] = [
  { label: 'Large Cap', value: 'large_cap' },
  { label: 'Mid Cap', value: 'mid_cap' },
  { label: 'Small Cap', value: 'small_cap' },
  { label: 'Multi Cap', value: 'multi_cap' },
  { label: 'Debt', value: 'debt' },
  { label: 'Hybrid', value: 'hybrid' },
  { label: 'Index', value: 'index' },
  { label: 'Sectoral', value: 'sectoral' },
];

const riskOptions: { label: string; value: RiskProfile }[] = [
  { label: 'Low', value: 'low' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'Mod. High', value: 'moderately_high' },
  { label: 'High', value: 'high' },
];

export default function FundScreenerPage() {
  const [filters, setFilters] = useState<FundScreenerFilters>({ minRating: 3, maxExpenseRatio: 1.5 });
  const [search, setSearch] = useState('');
  const [saveName, setSaveName] = useState('My screen');
  const { notify } = useNotification();

  const { screener, loading, refresh } = useFundScreener(filters);
  const { screens, save, saving } = useSavedScreens();
  const { watchlist, toggle, toggling } = useWatchlist();

  const watchlistCodes = useMemo(() => new Set(watchlist?.map((item) => item.schemeCode)), [watchlist]);

  const handleCategoryToggle = (value: FundCategory) => {
    setFilters((prev) => {
      const existing = prev.categories ?? [];
      return existing.includes(value)
        ? { ...prev, categories: existing.filter((item) => item !== value) }
        : { ...prev, categories: [...existing, value] };
    });
  };

  const handleRiskToggle = (value: RiskProfile) => {
    setFilters((prev) => {
      const existing = prev.riskLevels ?? [];
      return existing.includes(value)
        ? { ...prev, riskLevels: existing.filter((item) => item !== value) }
        : { ...prev, riskLevels: [...existing, value] };
    });
  };

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, searchTerm: search || undefined }));
  };

  const handleSaveScreen = async () => {
    if (!saveName.trim()) {
      notify('Provide a name for the screen', 'warning');
      return;
    }
    try {
      await save({ name: saveName.trim(), filters });
      notify('Screen saved', 'success');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Failed to save screen', 'error');
    }
  };

  const applyScreen = (screenFilters: FundScreenerFilters) => {
    setFilters(screenFilters);
    setSearch(screenFilters.searchTerm ?? '');
  };

  return (
    <>
      <Head>
        <title>Fund Screener | Grow</title>
      </Head>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={3} mb={3}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Fund Screener
            </Typography>
            <Typography color="text.secondary">
              Filter schemes by category, risk, ratings, expense ratio and tags. Save favorite screens for quick reuse.
            </Typography>
          </Box>
          <Button startIcon={<RefreshIcon />} onClick={() => refresh()} disabled={loading}>
            Refresh
          </Button>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={3.5}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Filters
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    placeholder="Search schemes"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    size="small"
                    InputProps={{ endAdornment: <SearchIcon fontSize="small" /> }}
                  />
                  <Button variant="outlined" onClick={handleSearch}>
                    Apply search
                  </Button>
                  <Divider />
                  <Typography variant="caption" color="text.secondary">
                    Categories
                  </Typography>
                  <Stack spacing={0.5}>
                    {categoryOptions.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        control={<Checkbox checked={filters.categories?.includes(option.value) ?? false} />}
                        onChange={() => handleCategoryToggle(option.value)}
                        label={option.label}
                      />
                    ))}
                  </Stack>
                  <Divider />
                  <Typography variant="caption" color="text.secondary">
                    Risk levels
                  </Typography>
                  <Stack spacing={0.5}>
                    {riskOptions.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        control={<Checkbox checked={filters.riskLevels?.includes(option.value) ?? false} />}
                        onChange={() => handleRiskToggle(option.value)}
                        label={option.label}
                      />
                    ))}
                  </Stack>
                  <Divider />
                  <FormControl size="small">
                    <InputLabel>Min rating</InputLabel>
                    <Select
                      label="Min rating"
                      value={filters.minRating ?? ''}
                      onChange={(event) =>
                        setFilters((prev) => ({ ...prev, minRating: Number(event.target.value) || undefined }))
                      }
                    >
                      <MenuItem value="">Any</MenuItem>
                      {[5, 4, 3].map((value) => (
                        <MenuItem key={value} value={value}>
                          {value} ★ & up
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Max expense ratio ({filters.maxExpenseRatio?.toFixed(2) ?? '—'}%)
                    </Typography>
                    <Slider
                      min={0.3}
                      max={2}
                      step={0.05}
                      value={filters.maxExpenseRatio ?? 1.5}
                      onChange={(_, value) =>
                        setFilters((prev) => ({ ...prev, maxExpenseRatio: Array.isArray(value) ? value[0] : value }))
                      }
                    />
                  </Box>
                  <Button variant="outlined" onClick={() => setFilters({})}>
                    Reset filters
                  </Button>
                </Stack>
              </CardContent>
            </Card>
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Saved screens
                </Typography>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      value={saveName}
                      onChange={(event) => setSaveName(event.target.value)}
                      size="small"
                      placeholder="Screen name"
                      fullWidth
                    />
                    <Button
                      startIcon={<SaveIcon />}
                      variant="contained"
                      size="small"
                      onClick={handleSaveScreen}
                      disabled={saving}
                    >
                      Save
                    </Button>
                  </Stack>
                  {screens?.length ? (
                    <Stack spacing={1}>
                      {screens.map((screen) => (
                        <Card
                          key={screen.id}
                          variant="outlined"
                          sx={{ borderColor: screen.pinned ? 'primary.light' : undefined, cursor: 'pointer' }}
                          onClick={() => applyScreen(screen.filters)}
                        >
                          <CardContent sx={{ py: 1.5 }}>
                            <Typography variant="subtitle2">{screen.name}</Typography>
                            {screen.description && (
                              <Typography variant="caption" color="text.secondary">
                                {screen.description}
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No saved screens yet.
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={8.5}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {loading ? 'Loading results…' : `${screener?.total ?? 0} funds`}
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Scheme</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Risk / Rating</TableCell>
                      <TableCell>1Y / 3Y</TableCell>
                      <TableCell>Expense</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {screener?.results.map((fund) => (
                      <TableRow key={fund.schemeCode} hover>
                        <TableCell>
                          <Stack>
                            <Typography variant="subtitle2">{fund.schemeName}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {fund.amc}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>{fund.category.replace('_', ' ')}</TableCell>
                        <TableCell>
                          <Stack spacing={0.5}>
                            <Chip label={fund.risk.replace('_', ' ')} size="small" />
                            <Typography variant="caption">Rating: {fund.rating} ★</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{fund.returns.oneYear.toFixed(1)}%</Typography>
                          <Typography variant="caption" color="text.secondary">
                            3Y {fund.returns.threeYear.toFixed(1)}%
                          </Typography>
                        </TableCell>
                        <TableCell>{fund.factors.expenseRatio.toFixed(2)}%</TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant={watchlistCodes.has(fund.schemeCode) ? 'contained' : 'outlined'}
                            startIcon={watchlistCodes.has(fund.schemeCode) ? <BookmarkAddedIcon /> : <BookmarkAddIcon />}
                            onClick={() => toggle(fund.schemeCode)}
                            disabled={toggling}
                          >
                            {watchlistCodes.has(fund.schemeCode) ? 'Watching' : 'Watchlist'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!screener?.results.length && !loading && (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <Typography align="center" color="text.secondary">
                            No funds match current filters.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
