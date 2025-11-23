import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Link,
  Alert,
  Stack,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  useTheme,
  Grid,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Visibility, VisibilityOff, Email, Lock, Person, CheckCircle, Fingerprint, ShieldOutlined } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useNotification } from '@/context/NotificationContext';

export default function SignUp() {
  const theme = useTheme();
  const router = useRouter();
  const { notify } = useNotification();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    aadhaar: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    if (error) setError('');
  };

  const handleAadhaarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = event.target.value.replace(/\D/g, '').slice(0, 12);
    setFormData((prev) => ({ ...prev, aadhaar: digitsOnly }));
    if (error) setError('');
  };

  const formattedAadhaar = formData.aadhaar.replace(/(\d{4})(?=\d)/g, '$1 ').trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.aadhaar) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (formData.aadhaar.length !== 12) {
      setError('Enter a valid 12-digit Aadhaar number');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the Terms of Service and Privacy Policy');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          aadhaarNumber: formData.aadhaar,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        setError(payload?.message || 'Sign up failed. Please try again.');
        return;
      }

      notify('Account created! OTP rail is live for this profile.', 'success');
      setSuccessOpen(true);
    } catch (err) {
      console.error('Signup failed', err);
      setError('Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessContinue = () => {
    setSuccessOpen(false);
    router.push({
      pathname: '/signin',
      query: { onboarding: 'success', otpReady: 'true' },
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 15% 15%, rgba(124,93,250,0.25), transparent 45%)',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 6, md: 10 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5} alignItems="stretch">
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 4,
                p: { xs: 4, md: 5 },
                background: 'linear-gradient(135deg, rgba(11,18,45,0.95), rgba(6,11,25,0.92))',
                border: '1px solid rgba(124,93,250,0.35)',
                boxShadow: '0 45px 120px rgba(5,8,22,0.65)',
                color: '#f8fafc',
              }}
            >
              <Stack spacing={3}>
                <Chip
                  label="CREATE YOUR GROW IDENTITY"
                  variant="outlined"
                  sx={{
                    alignSelf: 'flex-start',
                    letterSpacing: '0.35em',
                    color: alpha('#f8fafc', 0.85),
                    borderColor: alpha('#f8fafc', 0.35),
                  }}
                />
                <Typography variant="h3" fontWeight={700} lineHeight={1.15}>
                  A premium account with Aadhaar-fast onboarding
                </Typography>
                <Typography color={alpha('#f8fafc', 0.85)}>
                  Link your Aadhaar once, glide through OTP-only access later. We harden every new profile with bank-grade encryption, rate-limited OTP flows, and a 24-hour rolling session.
                </Typography>
                <Grid container spacing={2}>
                  {[{
                    icon: <ShieldOutlined fontSize="small" />, label: 'Multi-layered KYC'
                  }, {
                    icon: <Fingerprint fontSize="small" />, label: 'Secure Aadhaar vault'
                  }, {
                    icon: <CheckCircle fontSize="small" />, label: 'Instant approvals'
                  }].map((item) => (
                    <Grid item xs={12} sm={4} key={item.label}>
                      <Stack
                        spacing={1}
                        sx={{
                          borderRadius: 3,
                          border: '1px solid rgba(148,163,184,0.3)',
                          p: 2,
                          backgroundColor: 'rgba(5,8,22,0.35)',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#22d3ee' }}>
                          {item.icon}
                          <Typography variant="caption" sx={{ letterSpacing: '0.1em' }}>
                            TRUST
                          </Typography>
                        </Box>
                        <Typography fontWeight={600}>{item.label}</Typography>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
                <Divider sx={{ borderColor: alpha('#f8fafc', 0.15) }} />
                <Typography variant="body2" color={alpha('#f8fafc', 0.7)}>
                  Need help with onboarding? Visit our{' '}
                  <Link href="/support" sx={{ color: '#f8fafc', fontWeight: 600 }}>
                    Support Desk
                  </Link>
                </Typography>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: '0 35px 100px rgba(5,8,22,0.55)',
                border: '1px solid rgba(148,163,184,0.2)',
                background: 'linear-gradient(135deg, rgba(8,12,24,0.92), rgba(15,23,42,0.95))',
              }}
            >
              <CardContent sx={{ p: { xs: 4, md: 5 } }}>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h4" fontWeight={700} color="#f8fafc">
                      Join Grow Today
                    </Typography>
                    <Typography color="text.secondary">
                      Complete your profile, link Aadhaar once, and unlock one-tap OTP logins.
                    </Typography>
                  </Box>

                  <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          value={formData.firstName}
                          onChange={handleInputChange('firstName')}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person color="primary" />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2.5,
                              backgroundColor: alpha('#FFFFFF', 0.02),
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          value={formData.lastName}
                          onChange={handleInputChange('lastName')}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person color="primary" />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2.5,
                              backgroundColor: alpha('#FFFFFF', 0.02),
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange('email')}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Email color="primary" />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2.5,
                              backgroundColor: alpha('#FFFFFF', 0.02),
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Aadhaar Number"
                          value={formattedAadhaar}
                          onChange={handleAadhaarChange}
                          placeholder="1234 5678 9012"
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Fingerprint color="primary" />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2.5,
                              backgroundColor: alpha('#FFFFFF', 0.02),
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={handleInputChange('password')}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Lock color="primary" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2.5,
                              backgroundColor: alpha('#FFFFFF', 0.02),
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Confirm Password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={handleInputChange('confirmPassword')}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Lock color="primary" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2.5,
                              backgroundColor: alpha('#FFFFFF', 0.02),
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={acceptTerms}
                              onChange={(e) => setAcceptTerms(e.target.checked)}
                              color="primary"
                            />
                          }
                          label={
                            <Typography variant="body2">
                              I agree to the{' '}
                              <Link href="/terms" sx={{ color: 'primary.main', textDecoration: 'none' }}>
                                Terms of Service
                              </Link>
                              {' '}and{' '}
                              <Link href="/privacy" sx={{ color: 'primary.main', textDecoration: 'none' }}>
                                Privacy Policy
                              </Link>
                            </Typography>
                          }
                        />
                      </Grid>
                    </Grid>

                    {error && (
                      <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                        {error}
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{
                        mt: 3,
                        py: 1.4,
                        borderRadius: 999,
                        fontWeight: 600,
                        textTransform: 'none',
                      }}
                    >
                      {loading ? 'Creating Account…' : 'Create Account'}
                    </Button>
                  </Box>

                  <Divider sx={{ borderColor: 'rgba(148,163,184,0.2)' }} />
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    Already have an account?{' '}
                    <Link href="/signin" sx={{ fontWeight: 600 }}>
                      Sign in
                    </Link>
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Dialog open={successOpen} onClose={handleSuccessContinue} maxWidth="sm" fullWidth>
        <DialogTitle>Aadhaar linked. OTP rail live.</DialogTitle>
        <DialogContent>
          <Typography>
            Your Grow identity is now paired with Aadhaar {formattedAadhaar || formData.aadhaar}. Use the Aadhaar + OTP rail for instant access—sessions stay active for 24h of usage and auto-expire if idle.
          </Typography>
          <Typography mt={2} variant="body2" color="text.secondary">
            For security, OTP requests are throttled and each code is valid for 5 minutes.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessContinue} variant="contained">
            Continue to sign in
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
