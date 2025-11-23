import { useMemo, useState, ChangeEvent } from 'react';
import Head from 'next/head';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import ReviewsIcon from '@mui/icons-material/Reviews';
import { formatDistanceToNow } from 'date-fns';
import { useKnowledgeBase, useSupportTickets, useSlaMetrics, useFeedback } from '@/lib/supportApi';
import { FeedbackEntry, FaqEntry, SlaMetric, SupportTicket } from '@/types/support';
import { useNotification } from '@/context/NotificationContext';

const channelOptions: SupportTicket['channel'][] = ['chat', 'email', 'in_app'];

export default function SupportCenterPage() {
  const [search, setSearch] = useState('');
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    channel: 'chat' as SupportTicket['channel'],
    customer: '',
    message: '',
  });
  const [feedbackForm, setFeedbackForm] = useState({ user: '', rating: 7, comment: '', type: 'nps' as 'nps' | 'csat' });
  const { notify } = useNotification();

  const trimmedSearch = search.trim();
  const { categories, searchResults, loading: knowledgeLoading } = useKnowledgeBase(
    trimmedSearch.length > 1 ? trimmedSearch : undefined
  );
  const { tickets, loading: ticketsLoading, updating, creating, updateTicket, createTicket } = useSupportTickets();
  const { sla, loading: slaLoading } = useSlaMetrics();
  const { feedback, loading: feedbackLoading, submitting, submitFeedback } = useFeedback();

  const knowledgeItems = useMemo(() => {
    if (trimmedSearch.length > 1) {
      return (searchResults ?? []).map((item: FaqEntry) => ({ ...item, category: item.category }));
    }
    return (
      categories?.flatMap((category) =>
        category.articles.map((article) => ({ ...article, category: category.name }))
      ) ?? []
    );
  }, [categories, trimmedSearch, searchResults]);

  const handleTicketInput = (field: keyof typeof ticketForm) => (event: ChangeEvent<HTMLInputElement>) => {
    setTicketForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleTicketSubmit = async () => {
    if (!ticketForm.subject || !ticketForm.customer || !ticketForm.message) {
      notify('Subject, contact, and message are required', 'warning');
      return;
    }
    try {
      await createTicket({
        subject: ticketForm.subject,
        channel: ticketForm.channel,
        customer: ticketForm.customer,
        body: ticketForm.message,
      });
      notify('Ticket submitted successfully', 'success');
      setTicketForm({ subject: '', channel: 'chat', customer: '', message: '' });
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Failed to create ticket', 'error');
    }
  };

  const handleFeedbackInput = (field: keyof typeof feedbackForm) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = field === 'rating' ? Number(event.target.value) : event.target.value;
    setFeedbackForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFeedbackTypeChange = (event: SelectChangeEvent<'nps' | 'csat'>) => {
    setFeedbackForm((prev) => ({ ...prev, type: event.target.value as 'nps' | 'csat' }));
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackForm.user || !feedbackForm.rating) {
      notify('Provide your contact and rating', 'warning');
      return;
    }
    try {
      await submitFeedback(feedbackForm);
      notify('Feedback submitted, thank you!', 'success');
      setFeedbackForm({ user: '', rating: 7, comment: '', type: 'nps' });
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Failed to submit feedback', 'error');
    }
  };

  return (
    <>
      <Head>
        <title>Help & Support Center | Grow</title>
      </Head>
      <Box sx={{ background: 'radial-gradient(circle at 18% 20%, rgba(124,93,250,0.15), transparent 45%)', minHeight: '100vh' }}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(124,93,250,0.65) 45%, rgba(34,211,238,0.5) 100%)',
            color: 'white',
            py: { xs: 6, md: 8 },
            mb: { xs: 4, md: 6 },
          }}
        >
          <Container maxWidth="lg">
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent="space-between" alignItems="center">
              <Stack spacing={1.5} sx={{ maxWidth: 620 }}>
                <Chip
                  label="SUPPORT DESK"
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
                  Resolve investor issues faster with our mission console
                </Typography>
                <Typography color={alpha('#f8fafc', 0.85)}>
                  Search curated runbooks, orchestrate multi-channel tickets, monitor SLAs, and capture NPS without leaving the premium dashboard shell.
                </Typography>
                <TextField
                  placeholder="Search knowledge base..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HelpOutlineIcon sx={{ color: alpha('#f8fafc', 0.7) }} />
                      </InputAdornment>
                    ),
                    sx: {
                      backgroundColor: 'rgba(5,8,22,0.35)',
                      borderRadius: 2,
                    },
                  }}
                  sx={{ maxWidth: 420, width: '100%' }}
                />
              </Stack>
              <Card sx={{ borderRadius: 5, minWidth: 260, backgroundColor: 'rgba(5,8,22,0.45)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <CardContent>
                  <Typography variant="body2" color={alpha('#f8fafc', 0.75)}>
                    SLA Performance
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {sla?.avgResolution ?? '—'}
                  </Typography>
                  <Typography variant="caption" color={alpha('#f8fafc', 0.6)}>
                    Avg resolution window
                  </Typography>
                  <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption" color={alpha('#f8fafc', 0.7)}>
                        Open tickets
                      </Typography>
                      <Typography fontWeight={600}>{tickets?.length ?? 0}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption" color={alpha('#f8fafc', 0.7)}>
                        Breaches
                      </Typography>
                      <Typography color={sla?.breachingTickets ? 'warning.main' : 'success.main'}>
                        {sla?.breachingTickets ?? '—'}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 8 } }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
              <Card sx={{ borderRadius: 5, border: '1px solid rgba(148,163,184,0.25)', background: 'linear-gradient(135deg, rgba(11,17,30,0.92), rgba(15,23,42,0.92))', boxShadow: '0 30px 70px rgba(3,7,18,0.55)' }}>
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <HelpOutlineIcon color="primary" />
                    <Typography variant="h6">Knowledge Base</Typography>
                  </Stack>
                  {knowledgeLoading && <LinearProgress />}
                  <Stack spacing={2}>
                    {knowledgeItems.map((article: FaqEntry & { category: string }) => (
                      <Box key={article.id}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {article.question}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {article.category}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mt={0.5}>
                          {article.answer}
                        </Typography>
                      </Box>
                    ))}
                    {!knowledgeItems.length && !knowledgeLoading && (
                      <Typography color="text.secondary">No articles match your filters.</Typography>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              <Card sx={{ mt: 4, borderRadius: 5, border: '1px solid rgba(148,163,184,0.25)', background: 'linear-gradient(135deg, rgba(11,17,30,0.92), rgba(15,23,42,0.92))' }}>
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <SupportAgentIcon color="secondary" />
                    <Typography variant="h6">Open Tickets</Typography>
                  </Stack>
                  {(ticketsLoading || updating) && <LinearProgress />}
                  <Stack spacing={2}>
                    {(tickets ?? []).map((ticket: SupportTicket) => (
                      <Card key={ticket.id} variant="outlined" sx={{ borderRadius: 4, borderColor: 'rgba(148,163,184,0.3)', backgroundColor: 'rgba(5,8,22,0.5)' }}>
                        <CardContent sx={{ pb: '16px !important' }}>
                          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2}>
                            <Box>
                              <Typography fontWeight={600}>{ticket.subject}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {ticket.customer} • {ticket.channel.toUpperCase()} • Updated{' '}
                                {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                Last message: {ticket.messages[ticket.messages.length - 1]?.body}
                              </Typography>
                            </Box>
                            <Stack spacing={1} alignItems={{ xs: 'flex-start', sm: 'flex-end' }}>
                              <Chip label={ticket.status} color={ticket.status === 'resolved' ? 'success' : 'warning'} size="small" sx={{ textTransform: 'capitalize' }} />
                              {ticket.status !== 'resolved' && (
                                <Button size="small" onClick={() => updateTicket(ticket.id, 'resolved')}>
                                  Mark Resolved
                                </Button>
                              )}
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                    {!(tickets ?? []).length && !ticketsLoading && (
                      <Typography color="text.secondary">No tickets yet.</Typography>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={5}>
              <Card sx={{ borderRadius: 5, border: '1px solid rgba(148,163,184,0.25)', background: 'linear-gradient(135deg, rgba(11,17,30,0.92), rgba(15,23,42,0.92))' }}>
                <CardContent>
                  <Typography variant="h6" mb={2}>
                    Raise a Ticket
                  </Typography>
                  <Stack spacing={2}>
                    <TextField label="Subject" value={ticketForm.subject} onChange={handleTicketInput('subject')} fullWidth InputProps={{ sx: { backgroundColor: 'rgba(5,8,22,0.35)' } }} />
                    <TextField label="Contact email" value={ticketForm.customer} onChange={handleTicketInput('customer')} fullWidth InputProps={{ sx: { backgroundColor: 'rgba(5,8,22,0.35)' } }} />
                    <TextField
                      select
                      label="Channel"
                      value={ticketForm.channel}
                      onChange={(event) =>
                        setTicketForm((prev) => ({ ...prev, channel: event.target.value as SupportTicket['channel'] }))
                      }
                      fullWidth
                      SelectProps={{ MenuProps: { PaperProps: { sx: { bgcolor: '#0f172a' } } } }}
                      InputProps={{ sx: { backgroundColor: 'rgba(5,8,22,0.35)' } }}
                    >
                      {channelOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option.toUpperCase()}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      label="Describe your issue"
                      value={ticketForm.message}
                      onChange={handleTicketInput('message')}
                      multiline
                      minRows={3}
                      fullWidth
                      InputProps={{ sx: { backgroundColor: 'rgba(5,8,22,0.35)' } }}
                    />
                    <Button variant="contained" onClick={handleTicketSubmit} disabled={creating}>
                      {creating ? 'Submitting…' : 'Submit Ticket'}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              <Card sx={{ mt: 4, borderRadius: 5, border: '1px solid rgba(148,163,184,0.25)', background: 'linear-gradient(135deg, rgba(11,17,30,0.92), rgba(15,23,42,0.92))' }}>
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <QueryStatsIcon color="info" />
                    <Typography variant="h6">SLA Dashboard</Typography>
                  </Stack>
                  {slaLoading && <LinearProgress />}
                  {sla ? (
                    <Stack spacing={2}>
                      <Stack direction="row" spacing={2}>
                        <Box flex={1}>
                          <Typography variant="body2" color="text.secondary">
                            Avg First Response
                          </Typography>
                          <Typography variant="h5">{sla.avgFirstResponse}</Typography>
                        </Box>
                        <Box flex={1}>
                          <Typography variant="body2" color="text.secondary">
                            Avg Resolution
                          </Typography>
                          <Typography variant="h5">{sla.avgResolution}</Typography>
                        </Box>
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        Breaching tickets: {sla.breachingTickets}
                      </Typography>
                      <Divider />
                      <Stack spacing={1}>
                        {sla.metrics.map((metric: SlaMetric) => (
                          <Stack key={metric.id} direction="row" justifyContent="space-between">
                            <Typography>{metric.name}</Typography>
                            <Typography color="text.secondary">
                              Target {metric.target} • Current {metric.current}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </Stack>
                  ) : (
                    <Typography color="text.secondary">No SLA data available.</Typography>
                  )}
                </CardContent>
              </Card>

              <Card sx={{ mt: 4, borderRadius: 5, border: '1px solid rgba(148,163,184,0.25)', background: 'linear-gradient(135deg, rgba(11,17,30,0.92), rgba(15,23,42,0.92))' }}>
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <ReviewsIcon color="warning" />
                    <Typography variant="h6">Feedback / NPS</Typography>
                  </Stack>
                  {(feedbackLoading || submitting) && <LinearProgress />}
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2}>
                      <TextField
                        label="Your email"
                        value={feedbackForm.user}
                        onChange={handleFeedbackInput('user')}
                        fullWidth
                        InputProps={{ sx: { backgroundColor: 'rgba(5,8,22,0.35)' } }}
                      />
                      <TextField
                        label="Rating"
                        type="number"
                        inputProps={{ min: 1, max: 10 }}
                        value={feedbackForm.rating}
                        onChange={handleFeedbackInput('rating')}
                        sx={{ width: 120 }}
                        InputProps={{ sx: { backgroundColor: 'rgba(5,8,22,0.35)' } }}
                      />
                    </Stack>
                    <Select
                      value={feedbackForm.type}
                      onChange={handleFeedbackTypeChange}
                      fullWidth
                      sx={{ backgroundColor: 'rgba(5,8,22,0.35)' }}
                    >
                      <MenuItem value="nps">NPS</MenuItem>
                      <MenuItem value="csat">CSAT</MenuItem>
                    </Select>
                    <TextField
                      label="Comments"
                      value={feedbackForm.comment}
                      onChange={handleFeedbackInput('comment')}
                      multiline
                      minRows={3}
                      InputProps={{ sx: { backgroundColor: 'rgba(5,8,22,0.35)' } }}
                    />
                    <Button variant="outlined" onClick={handleFeedbackSubmit} disabled={submitting}>
                      {submitting ? 'Submitting…' : 'Send Feedback'}
                    </Button>
                  </Stack>
                  <Divider sx={{ my: 2 }} />
                  <Stack spacing={1} maxHeight={220} sx={{ overflow: 'auto' }}>
                    {feedback?.map((entry: FeedbackEntry) => (
                      <Box key={entry.id}>
                        <Typography fontWeight={600}>
                          {entry.user} • {entry.type.toUpperCase()} ({entry.rating}/10)
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {entry.comment || 'No additional comments.'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDistanceToNow(new Date(entry.submittedAt), { addSuffix: true })}
                        </Typography>
                      </Box>
                    ))}
                    {!feedback?.length && !feedbackLoading && (
                      <Typography color="text.secondary">No feedback captured yet.</Typography>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
