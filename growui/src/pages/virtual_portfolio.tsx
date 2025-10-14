import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  CircularProgress,
  Chip,
  Stack,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  alpha,
  Tooltip,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import axios from "axios";

interface SIP {
  _id?: string;
  schemeCode: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  active: boolean;
  currentNAV?: number;
}

interface Portfolio {
  _id: string;
  name: string;
  cash: number;
  sips: SIP[];
  createdAt: string;
  updatedAt: string;
}

export default function VirtualPortfolioPage() {
  const userId = "default-user";
  const theme = useTheme();
  const [ports, setPorts] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [newSIP, setNewSIP] = useState({
    schemeCode: '',
    amount: '',
    frequency: 'monthly' as 'monthly' | 'quarterly' | 'yearly',
  });

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get("/api/virtual_portfolio", { params: { userId } });
      setPorts(res.data.data || []);
    } catch (err) {
      console.error('Error loading portfolios:', err);
      setError('Failed to load portfolios');
    } finally {
      setLoading(false);
    }
  }

  async function create() {
    if (!newName.trim()) return;

    try {
      await axios.post("/api/virtual_portfolio", { userId, name: newName.trim() });
      setNewName("");
      load();
    } catch (error) {
      console.error('Error creating portfolio:', error);
      setError('Failed to create portfolio');
    }
  }

  const handleDeletePortfolio = async (portfolioId: string) => {
    try {
      await axios.delete("/api/virtual_portfolio", { data: { id: portfolioId } });
      load();
    } catch (error) {
      console.error('Error deleting portfolio:', error);
    }
  };

  const handleToggleSIP = async (portfolioId: string, sipId: string) => {
    try {
      await axios.put("/api/virtual_portfolio", {
        id: portfolioId,
        action: "toggle_sip",
        payload: { sipId }
      });
      load();
    } catch (error) {
      console.error('Error toggling SIP:', error);
    }
  };

  const handleAddSIP = async () => {
    if (!selectedPortfolio || !newSIP.schemeCode || !newSIP.amount) return;

    try {
      await axios.put("/api/virtual_portfolio", {
        id: selectedPortfolio._id,
        action: "add_sip",
        payload: {
          schemeCode: newSIP.schemeCode.trim(),
          amount: Number(newSIP.amount),
          frequency: newSIP.frequency,
        }
      });
      setDialogOpen(false);
      setNewSIP({ schemeCode: '', amount: '', frequency: 'monthly' });
      load();
    } catch (error) {
      console.error('Error adding SIP:', error);
      setError('Failed to add SIP');
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
          Loading your portfolios...
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
              Virtual Portfolio
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
              Simulate investments with virtual money and track SIP performance
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
                💰 {ports.length} portfolios • ₹{ports.reduce((sum, p) => sum + p.cash, 0).toLocaleString()} virtual cash
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Card
          sx={{
            mb: 4,
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
              Create New Portfolio
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                label="Portfolio Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="My Investment Portfolio"
                sx={{ flex: 1 }}
              />
              <Button
                variant="contained"
                onClick={create}
                disabled={!newName.trim()}
                sx={{ px: 4, py: 1.5, borderRadius: 3 }}
              >
                Create Portfolio
              </Button>
            </Box>
          </CardContent>
        </Card>

        {ports.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
              No portfolios yet
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
              Create your first virtual portfolio to start simulating investments
            </Typography>
            <Button
              variant="contained"
              onClick={() => setNewName('My First Portfolio')}
              sx={{ borderRadius: 3 }}
            >
              Create Your First Portfolio
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {ports.map((portfolio) => (
              <Grid item xs={12} md={6} lg={4} key={portfolio._id}>
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            mb: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {portfolio.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Created {new Date(portfolio.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>

                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          onClick={() => {
                            setSelectedPortfolio(portfolio);
                            setDialogOpen(true);
                          }}
                          startIcon={<AddIcon />}
                          sx={{ borderRadius: 2 }}
                        >
                          Add SIP
                        </Button>

                        <Tooltip title="Delete Portfolio">
                          <IconButton
                            size="small"
                            onClick={() => handleDeletePortfolio(portfolio._id)}
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
                      </Stack>
                    </Box>

                    <Box sx={{ mb: 3, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                        Available Cash
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        ₹{portfolio.cash.toLocaleString()}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                        Active SIPs ({portfolio.sips.filter(sip => sip.active).length})
                      </Typography>

                      {portfolio.sips.length === 0 ? (
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                          No SIPs added yet
                        </Typography>
                      ) : (
                        <Stack spacing={1}>
                          {portfolio.sips.map((sip) => (
                            <Box
                              key={sip._id}
                              sx={{
                                p: 2,
                                border: '1px solid',
                                borderColor: 'rgba(0, 0, 0, 0.08)',
                                borderRadius: 2,
                                backgroundColor: sip.active ? 'transparent' : alpha(theme.palette.grey[100], 0.5),
                              }}
                            >
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    Scheme: {sip.schemeCode}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    ₹{sip.amount.toLocaleString()} • {sip.frequency} • Started {new Date(sip.startDate).toLocaleDateString()}
                                  </Typography>
                                </Box>

                                <Chip
                                  label={sip.active ? 'Active' : 'Paused'}
                                  size="small"
                                  color={sip.active ? 'success' : 'default'}
                                  sx={{ fontSize: '0.75rem' }}
                                />
                              </Box>

                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => handleToggleSIP(portfolio._id, sip._id!)}
                                  startIcon={sip.active ? <PauseIcon /> : <PlayArrowIcon />}
                                  sx={{ borderRadius: 2 }}
                                >
                                  {sip.active ? 'Pause' : 'Resume'}
                                </Button>

                                {sip.currentNAV && (
                                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    NAV: ₹{sip.currentNAV.toFixed(2)}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          ))}
                        </Stack>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New SIP</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Scheme Code"
              value={newSIP.schemeCode}
              onChange={(e) => setNewSIP(prev => ({ ...prev, schemeCode: e.target.value }))}
              placeholder="e.g., 100001"
              fullWidth
            />

            <TextField
              label="Amount per Installment"
              type="number"
              value={newSIP.amount}
              onChange={(e) => setNewSIP(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="5000"
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Frequency</InputLabel>
              <Select
                value={newSIP.frequency}
                label="Frequency"
                onChange={(e) => setNewSIP(prev => ({ ...prev, frequency: e.target.value as any }))}
              >
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddSIP}
            disabled={!newSIP.schemeCode || !newSIP.amount}
          >
            Add SIP
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
