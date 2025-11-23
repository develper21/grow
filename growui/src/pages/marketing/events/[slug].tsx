import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PeopleIcon from '@mui/icons-material/People';
import ScienceIcon from '@mui/icons-material/Science';
import { useEventPage, useExperiments, useFormSubmission } from '@/lib/marketingApi';
import { useNotification } from '@/context/NotificationContext';

export default function EventPage() {
  const router = useRouter();
  const slug = typeof router.query.slug === 'string' ? router.query.slug : '';
  const { event, loading } = useEventPage(slug);
  const { experiments } = useExperiments();
  const { submit, submitting } = useFormSubmission();
  const { notify } = useNotification();
  const [form, setForm] = useState({ name: '', email: '', company: '' });

  const handleFormChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (eventObj: React.FormEvent) => {
    eventObj.preventDefault();
    if (!form.name || !form.email) {
      notify('Name and email are required', 'warning');
      return;
    }
    try {
      await submit({ formId: `event-${slug}`, ...form });
      notify('Registration received! We will confirm soon.', 'success');
      setForm({ name: '', email: '', company: '' });
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Failed to submit form', 'error');
    }
  };

  return (
    <>
      <Head>
        <title>{event?.title ?? 'Event'} | Grow Marketing</title>
      </Head>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={1} mb={4}>
          <Typography variant="overline" color="text.secondary">
            {event ? event.slug : 'events'}
          </Typography>
          <Typography variant="h3" fontWeight={700}>
            {event?.title ?? 'Loading event…'}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {event?.description ?? 'Please wait while we fetch the agenda.'}
          </Typography>
        </Stack>

        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <EventAvailableIcon color="primary" />
                  <Typography variant="h6">Sessions</Typography>
                </Stack>
                <Stack spacing={2}>
                  {event?.sessions.map((session: NonNullable<typeof event>['sessions'][number]) => {
                    const fill = (session.registered / session.capacity) * 100;
                    return (
                      <Box key={session.id}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {session.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          <ScheduleIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                          {new Date(session.startTime).toLocaleString('en-IN')} • {session.durationMinutes} mins
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                          <PeopleIcon fontSize="small" />
                          <Typography variant="body2">
                            {session.registered}/{session.capacity} seats
                          </Typography>
                        </Stack>
                        <LinearProgress variant="determinate" value={fill} sx={{ mt: 1 }} />
                      </Box>
                    );
                  })}
                  {!loading && !event?.sessions.length && (
                    <Typography color="text.secondary">No sessions yet.</Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={5}>
            <Card>
              <CardContent component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" gutterBottom>
                  {event?.registrationHeadline ?? 'Register interest'}
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    label="Full name"
                    value={form.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    required
                    fullWidth
                  />
                  <TextField
                    label="Work email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    required
                    fullWidth
                  />
                  <TextField
                    label="Company"
                    value={form.company}
                    onChange={(e) => handleFormChange('company', e.target.value)}
                    fullWidth
                  />
                  <Button type="submit" variant="contained" size="large" disabled={submitting}>
                    {submitting ? 'Submitting…' : 'Reserve seat'}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                  <ScienceIcon color="secondary" />
                  <Typography variant="subtitle1">Active experiments</Typography>
                </Stack>
                <Stack spacing={1}>
                  {experiments?.map((experiment: NonNullable<typeof experiments>[number]) => (
                    <Box key={experiment.id}>
                      <Typography variant="body2" fontWeight={600}>
                        {experiment.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {experiment.status.toUpperCase()} • {experiment.variantCount} variants • {experiment.primaryMetric}
                      </Typography>
                    </Box>
                  ))}
                  {!experiments?.length && (
                    <Typography color="text.secondary">No experiments configured.</Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
