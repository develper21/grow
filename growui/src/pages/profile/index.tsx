import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import BadgeIcon from '@mui/icons-material/Badge';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import EmailIcon from '@mui/icons-material/Email';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { useOnboarding } from '@/context/OnboardingContext';

const documentLabels: Record<string, string> = {
  aadhaar: 'Aadhaar Card',
  passport: 'Passport',
  driving_license: 'Driving License',
};

const verificationPalette: Record<string, { label: string; color: 'default' | 'success' | 'warning' | 'error' }> = {
  pending: { label: 'Pending', color: 'warning' },
  verified: { label: 'Verified', color: 'success' },
  rejected: { label: 'Rejected', color: 'error' },
  unverified: { label: 'Unverified', color: 'default' },
  in_progress: { label: 'In Progress', color: 'warning' },
};

const formatDisplayDate = (value?: string) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const { state } = useOnboarding();
  const router = useRouter();

  const personal = state.personalInfo;
  const documents = state.documents;
  const bank = state.bankDetails;
  const risk = state.riskProfile;

  const address = [personal.addressLine1, personal.addressLine2, personal.city, personal.state, personal.postalCode]
    .filter(Boolean)
    .join(', ');

  const completion = useMemo(() => {
    const values = Object.values(personal);
    const filled = values.filter((value) => Boolean(value && value.trim())).length;
    return Math.min(100, Math.round((filled / values.length) * 100));
  }, [personal]);

  const personalRows = [
    { label: 'Full name', value: personal.fullName },
    { label: 'PAN', value: personal.pan },
    { label: 'Date of birth', value: formatDisplayDate(personal.dateOfBirth) },
  ];

  const contactRows = [
    { label: 'Email address', value: personal.email },
    { label: 'Phone number', value: personal.phone },
    { label: 'Residential address', value: address },
  ];

  const bankRows = [
    { label: 'Account holder', value: bank.accountHolderName },
    { label: 'Account number', value: bank.accountNumber },
    { label: 'IFSC', value: bank.ifsc },
    { label: 'Bank', value: bank.bankName },
  ];

  const docStatus = verificationPalette[documents.verificationStatus] ?? verificationPalette.unverified;
  const bankStatus = verificationPalette[bank.verificationStatus] ?? verificationPalette.unverified;

  const tasks = [
    {
      primary: 'Accept e-sign consent',
      secondary: state.consentsAccepted ? 'Accepted' : 'Pending acceptance',
      done: state.consentsAccepted,
    },
    {
      primary: 'Verify government ID',
      secondary: `Status: ${docStatus.label}`,
      done: documents.verificationStatus === 'verified',
    },
    {
      primary: 'Complete bank verification',
      secondary: `Status: ${bankStatus.label}`,
      done: bank.verificationStatus === 'verified',
    },
  ];

  return (
    <>
      <Head>
        <title>Profile & Identity | Grow</title>
      </Head>
      <Box sx={{ background: 'radial-gradient(circle at 12% 18%, rgba(124,93,250,0.15), transparent 45%)', minHeight: '100vh' }}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, rgba(13,20,46,0.95) 0%, rgba(124,93,250,0.65) 45%, rgba(34,211,238,0.5) 100%)',
            color: 'white',
            py: { xs: 6, md: 8 },
            mb: { xs: 4, md: 6 },
          }}
        >
          <Container maxWidth="lg">
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent="space-between" alignItems="center">
              <Stack spacing={1.5} sx={{ maxWidth: 640 }}>
                <Chip
                  label="IDENTITY HUB"
                  sx={{
                    alignSelf: 'flex-start',
                    letterSpacing: '0.35em',
                    fontSize: '0.7rem',
                    color: alpha('#f8fafc', 0.85),
                    borderColor: alpha('#f8fafc', 0.35),
                  }}
                  variant="outlined"
                />
                <Typography variant="h3" fontWeight={700} lineHeight={1.2}>
                  {session?.user?.name || personal.fullName || 'Investor'}
                </Typography>
                <Typography color={alpha('#f8fafc', 0.85)}>
                  Manage your verified identity, government credentials, banking footprint, and compliance posture from one secure console.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <Chip label={`Status: ${state.status.toUpperCase()}`} color="secondary" sx={{ fontWeight: 600, borderRadius: 5 }} />
                  <Chip
                    label={`Risk profile: ${risk.profile.charAt(0).toUpperCase() + risk.profile.slice(1)}`}
                    sx={{ fontWeight: 600, borderRadius: 5, backgroundColor: alpha('#050816', 0.35), color: '#f8fafc' }}
                  />
                </Stack>
              </Stack>
              <Stack spacing={2} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
                <Avatar sx={{ width: 64, height: 64, bgcolor: alpha('#050816', 0.3), fontSize: '1.5rem', border: '1px solid rgba(255,255,255,0.35)' }}>
                  {(session?.user?.name || personal.fullName || 'IN')[0]}
                </Avatar>
                <Stack direction="row" spacing={1}>
                  <Button variant="contained" color="secondary" onClick={() => router.push('/onboarding/review')}>
                    Update Profile
                  </Button>
                  <Button variant="outlined" color="inherit" onClick={() => router.push('/onboarding/documents')}>
                    Manage KYC
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 8 } }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 5, height: '100%' }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                    <Typography fontWeight={700}>Identity completion</Typography>
                    <Chip size="small" label={`${completion}%`} color={completion === 100 ? 'success' : 'warning'} />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    Verify each field to unlock instant approvals.
                  </Typography>
                  <LinearProgress variant="determinate" value={completion} sx={{ borderRadius: 999, height: 8, mb: 2 }} />
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <BadgeIcon fontSize="small" color="primary" />
                      <Typography variant="body2">Personal details</Typography>
                      <Chip label={completion === 100 ? 'Complete' : 'In progress'} size="small" variant="outlined" />
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <FingerprintIcon fontSize="small" color={documents.verificationStatus === 'verified' ? 'success' : 'warning'} />
                      <Typography variant="body2">Government ID</Typography>
                      <Chip label={docStatus.label} size="small" color={docStatus.color} />
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <AccountBalanceIcon fontSize="small" color={bank.verificationStatus === 'verified' ? 'success' : 'warning'} />
                      <Typography variant="body2">Bank verification</Typography>
                      <Chip label={bankStatus.label} size="small" color={bankStatus.color} />
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card sx={{ borderRadius: 5, height: '100%' }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ShieldOutlinedIcon color="primary" />
                      <Typography variant="h6">Government ID & biometrics</Typography>
                    </Stack>
                    <Button size="small" onClick={() => router.push('/onboarding/documents')}>
                      Update document
                    </Button>
                  </Stack>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption" color="text.secondary">
                        Document type
                      </Typography>
                      <Typography fontWeight={600} gutterBottom>
                        {documents.documentType ? documentLabels[documents.documentType] ?? documents.documentType : '—'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Document number
                      </Typography>
                      <Typography fontWeight={600} gutterBottom>
                        {documents.documentNumber || '—'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        OCR confidence
                      </Typography>
                      <Typography fontWeight={600}>
                        {documents.ocrConfidence ? `${Math.round(documents.ocrConfidence * 100)}%` : '—'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption" color="text.secondary">
                        Extracted name
                      </Typography>
                      <Typography fontWeight={600} gutterBottom>
                        {documents.extractedName || personal.fullName || '—'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Extracted DOB
                      </Typography>
                      <Typography fontWeight={600} gutterBottom>
                        {formatDisplayDate(documents.extractedDob) || '—'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Verification status
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip label={docStatus.label} color={docStatus.color} />
                        {documents.verificationStatus === 'verified' && (
                          <CheckCircleIcon color="success" fontSize="small" />
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3} mt={0.5}>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 5 }}>
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <BadgeIcon color="secondary" />
                    <Typography variant="h6">Personal identity</Typography>
                  </Stack>
                  <Stack spacing={1.5}>
                    {personalRows.map((row) => (
                      <Box key={row.label}>
                        <Typography variant="caption" color="text.secondary">
                          {row.label}
                        </Typography>
                        <Typography fontWeight={600}>{row.value || '—'}</Typography>
                        <Divider sx={{ mt: 1 }} />
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 5 }}>
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <HomeWorkIcon color="secondary" />
                    <Typography variant="h6">Contact & address</Typography>
                  </Stack>
                  <Stack spacing={1.5}>
                    {contactRows.map((row) => (
                      <Box key={row.label}>
                        <Typography variant="caption" color="text.secondary">
                          {row.label}
                        </Typography>
                        <Typography fontWeight={600}>{row.value || '—'}</Typography>
                        <Divider sx={{ mt: 1 }} />
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3} mt={0.5}>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 5 }}>
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <AccountBalanceIcon color="secondary" />
                    <Typography variant="h6">Bank & payout routes</Typography>
                  </Stack>
                  <Stack spacing={1.5}>
                    {bankRows.map((row) => (
                      <Box key={row.label}>
                        <Typography variant="caption" color="text.secondary">
                          {row.label}
                        </Typography>
                        <Typography fontWeight={600}>{row.value || '—'}</Typography>
                        <Divider sx={{ mt: 1 }} />
                      </Box>
                    ))}
                  </Stack>
                  <Chip label={bankStatus.label} color={bankStatus.color} sx={{ mt: 2 }} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 5 }}>
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <TaskAltIcon color="secondary" />
                    <Typography variant="h6">Compliance checklist</Typography>
                  </Stack>
                  <List dense disablePadding>
                    {tasks.map((task) => (
                      <ListItem key={task.primary} disablePadding sx={{ mb: 1 }}>
                        <ListItemText
                          primary={
                            <Stack direction="row" alignItems="center" spacing={1}>
                              {task.done ? <CheckCircleIcon color="success" fontSize="small" /> : <ShieldOutlinedIcon color="warning" fontSize="small" />}
                              <Typography variant="body2" fontWeight={600}>
                                {task.primary}
                              </Typography>
                            </Stack>
                          }
                          secondary={task.secondary}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Typography variant="caption" color="text.secondary">
                    Last updated {formatDisplayDate(state.updatedAt)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
