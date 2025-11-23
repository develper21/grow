import React, { useEffect, useState } from 'react';
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
  useTheme,
  alpha,
  Grid,
  Tabs,
  Tab,
  Chip,
  Divider,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Fingerprint, PhoneIphone, ShieldOutlined } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { useNotification } from '@/context/NotificationContext';

export default function SignIn() {
  const theme = useTheme();
  const router = useRouter();
  const { notify } = useNotification();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'classic' | 'aadhaar'>('classic');
  const [aadhaarInput, setAadhaarInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSubmitting, setOtpSubmitting] = useState(false);
  const [otpError, setOtpError] = useState('');

  useEffect(() => {
    if (router.query.onboarding === 'success' && router.query.otpReady === 'true') {
      notify('Account created! Use Aadhaar + OTP for instant access. Sessions auto-expire after 24h.', 'success');
      router.replace({ pathname: router.pathname, query: {} }, undefined, { shallow: true });
    }
  }, [router, notify]);

  useEffect(() => {
    if (!otpTimer) return;
    const id = setInterval(() => {
      setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [otpTimer]);

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials. Please try again.');
      } else if (result?.ok) {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formattedAadhaar = aadhaarInput.replace(/(\d{4})(?=\d)/g, '$1 ').trim();

  const handleTabChange = (_: React.SyntheticEvent, value: 'classic' | 'aadhaar') => {
    setActiveTab(value);
    setError('');
    setOtpError('');
  };

  const handleAadhaarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = event.target.value.replace(/\D/g, '').slice(0, 12);
    setAadhaarInput(digitsOnly);
    if (otpError) setOtpError('');
  };

  const handleOtpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const otpValue = event.target.value.replace(/\D/g, '').slice(0, 6);
    setOtpInput(otpValue);
    if (otpError) setOtpError('');
  };

  const handleSendOtp = async () => {
    if (aadhaarInput.length !== 12) {
      setOtpError('Enter a valid 12-digit Aadhaar number.');
      return;
    }

    setOtpLoading(true);
    setOtpError('');

    try {
      const response = await fetch('/api/auth/aadhaar/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhaarNumber: aadhaarInput }),
      });
      const payload = await response.json();

      if (!response.ok) {
        if (payload?.retryAfterMs) {
          setOtpTimer(Math.ceil(payload.retryAfterMs / 1000));
        }
        throw new Error(payload?.message || 'Failed to send OTP');
      }

      setOtpSent(true);
      const retryAfterSeconds = payload?.retryAfterMs
        ? Math.max(1, Math.ceil(payload.retryAfterMs / 1000))
        : 60;
      setOtpTimer(retryAfterSeconds || 60);
      notify('OTP sent to your registered mobile number.', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send OTP';
      setOtpError(message);
      notify(message, 'error');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleOtpSubmit = async (event?: React.FormEvent) => {
    event?.preventDefault();
    if (aadhaarInput.length !== 12) {
      setOtpError('Enter a valid 12-digit Aadhaar number.');
      return;
    }
    if (otpInput.length !== 6) {
      setOtpError('Enter the 6-digit OTP.');
      return;
    }

    setOtpSubmitting(true);
    setOtpError('');

    try {
      const verifyResponse = await fetch('/api/auth/aadhaar/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhaarNumber: aadhaarInput, otp: otpInput }),
      });
      const payload = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(payload?.message || 'Failed to verify OTP');
      }

      const result = await signIn('credentials', {
        redirect: false,
        aadhaarNumber: aadhaarInput,
        otp: otpInput,
      });

      if (result?.error) {
        throw new Error('Invalid OTP. Please try again.');
      }

      notify('Signed in securely.', 'success');
      router.push('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to verify OTP';
      setOtpError(message);
      notify(message, 'error');
    } finally {
      setOtpSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 20% 20%, rgba(124,93,250,0.2), transparent 55%)',
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
                background: 'linear-gradient(135deg, rgba(11,18,45,0.95), rgba(19,7,45,0.9))',
                border: '1px solid rgba(124,93,250,0.35)',
                boxShadow: '0 45px 120px rgba(5,8,22,0.65)',
                color: '#f8fafc',
              }}
            >
              <Stack spacing={3}>
                <Chip
                  label="GROW IDENTITY CLOUD"
                  variant="outlined"
                  sx={{
                    alignSelf: 'flex-start',
                    letterSpacing: '0.35em',
                    color: alpha('#f8fafc', 0.85),
                    borderColor: alpha('#f8fafc', 0.35),
                  }}
                />
                <Typography variant="h3" fontWeight={700} lineHeight={1.15}>
                  One secure console for credentials, biometrics, and OTP rails
                </Typography>
                <Typography color={alpha('#f8fafc', 0.85)}>
                  Login with your classic credentials or switch to Aadhaar + OTP for quick, hardware-secured access. Sessions auto-renew while you stay active and auto-expire after 24 hours.
                </Typography>
                <Grid container spacing={2}>
                  {[{
                    icon: <ShieldOutlined fontSize="small" />, label: '24H auto logout'
                  }, {
                    icon: <Fingerprint fontSize="small" />, label: 'UIDAI-compliant Aadhaar'
                  }, {
                    icon: <PhoneIphone fontSize="small" />, label: 'Instant OTP delivery'
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
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => router.push('/signup')}
                    sx={{ borderRadius: 999, px: 3 }}
                  >
                    Create premium account
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => router.push('/support')}
                    sx={{ borderRadius: 999, borderColor: alpha('#f8fafc', 0.3), color: '#f8fafc' }}
                  >
                    Get help
                  </Button>
                </Stack>
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
                      Welcome back
                    </Typography>
                    <Typography color="text.secondary">
                      Pick your auth rail – credentials or Aadhaar OTP.
                    </Typography>
                  </Box>

                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    sx={{
                      '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 },
                    }}
                  >
                    <Tab label="Email + Password" value="classic" icon={<Lock fontSize="small" />} iconPosition="start" />
                    <Tab label="Aadhaar + OTP" value="aadhaar" icon={<Fingerprint fontSize="small" />} iconPosition="start" />
                  </Tabs>

                  {activeTab === 'classic' && (
                    <Box component="form" onSubmit={handleSubmit}>
                      <Stack spacing={3}>
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
                                <Email sx={{ color: 'primary.main' }} />
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
                                <Lock sx={{ color: 'primary.main' }} />
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

                        {error && (
                          <Alert severity="error" sx={{ borderRadius: 2 }}>
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
                            py: 1.4,
                            borderRadius: 999,
                            fontWeight: 600,
                            textTransform: 'none',
                          }}
                        >
                          {loading ? 'Signing In…' : 'Sign In Securely'}
                        </Button>
                      </Stack>
                    </Box>
                  )}

                  {activeTab === 'aadhaar' && (
                    <Stack component="form" spacing={3} onSubmit={handleOtpSubmit}>
                      <TextField
                        label="Aadhaar Number"
                        value={formattedAadhaar}
                        onChange={handleAadhaarChange}
                        placeholder="1234 5678 9012"
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

                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField
                          label="One-Time OTP"
                          value={otpInput}
                          onChange={handleOtpChange}
                          placeholder="••••••"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PhoneIphone color="primary" />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            flex: 1,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2.5,
                              backgroundColor: alpha('#FFFFFF', 0.02),
                            },
                          }}
                        />
                        <Button
                          variant="outlined"
                          onClick={handleSendOtp}
                          disabled={otpLoading || otpTimer > 0}
                          sx={{ minWidth: 160, borderRadius: 2 }}
                        >
                          {otpLoading ? 'Sending…' : otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Send OTP'}
                        </Button>
                      </Stack>

                      {otpError && (
                        <Alert severity="error" sx={{ borderRadius: 2 }}>
                          {otpError}
                        </Alert>
                      )}

                      <Button
                        type="submit"
                        variant="contained"
                        disabled={otpSubmitting}
                        sx={{ borderRadius: 999, py: 1.4 }}
                      >
                        {otpSubmitting ? 'Verifying…' : 'Verify & Continue'}
                      </Button>
                      {otpSent && (
                        <Typography variant="caption" color="text.secondary">
                          OTP is valid for 5 minutes. We’ll refresh your session automatically for 24 hours of activity.
                        </Typography>
                      )}
                    </Stack>
                  )}

                  <Divider sx={{ borderColor: 'rgba(148,163,184,0.2)' }} />
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    Don’t have an account?{' '}
                    <Link href="/signup" sx={{ fontWeight: 600 }}>
                      Create one
                    </Link>
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
