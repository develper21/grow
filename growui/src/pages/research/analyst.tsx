import Head from 'next/head';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import InsightsIcon from '@mui/icons-material/Insights';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import { useAnalystNotes, useModelPortfolios } from '@/lib/researchApi';

export default function AnalystResearchPage() {
  const { notes, loading: notesLoading } = useAnalystNotes();
  const { portfolios, loading: portfoliosLoading } = useModelPortfolios();

  return (
    <>
      <Head>
        <title>Analyst Notes & Model Portfolios | Grow</title>
      </Head>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={3} mb={3}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Analyst library
            </Typography>
            <Typography color="text.secondary">
              Read the latest rating actions and track curated model portfolios from our investment desk.
            </Typography>
          </Box>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <EventNoteIcon color="primary" />
                  <Typography variant="h6">Analyst notes</Typography>
                </Stack>
                <Stack spacing={2}>
                  {notes?.map((note) => (
                    <Card key={note.id} variant="outlined">
                      <CardContent>
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2}>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {note.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(note.publishedAt).toLocaleDateString('en-IN')} • {note.analyst}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mt={1}>
                              {note.summary}
                            </Typography>
                            <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                              {note.tags.map((tag) => (
                                <Chip key={tag} label={tag} size="small" />
                              ))}
                            </Stack>
                          </Box>
                          <Stack alignItems={{ xs: 'flex-start', sm: 'flex-end' }} spacing={1}>
                            <Chip label={note.ratingAction} color={note.ratingAction === 'downgrade' ? 'error' : 'success'} />
                            <Typography variant="caption" color="text.secondary">
                              Related: {note.relatedSchemes.join(', ')}
                            </Typography>
                          </Stack>
                        </Stack>
                        <List dense sx={{ mt: 2 }}>
                          {note.thesisHighlights.map((item, index) => (
                            <ListItem key={index} disableGutters>
                              <ListItemAvatar>
                                <Avatar sx={{ bgcolor: 'primary.light', width: 28, height: 28 }}>
                                  <InsightsIcon fontSize="small" />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText primary={item} />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  )) || (
                    <Typography color="text.secondary">
                      {notesLoading ? 'Loading notes…' : 'No analyst notes yet'}
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={5}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <PlaylistAddCheckIcon color="secondary" />
                  <Typography variant="h6">Model portfolios</Typography>
                </Stack>
                <Stack spacing={2}>
                  {portfolios?.map((portfolio) => (
                    <Card key={portfolio.id} variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {portfolio.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Risk: {portfolio.riskProfile.replace('_', ' ')} • Rebalanced {new Date(portfolio.rebalancedAt).toLocaleDateString('en-IN')}
                        </Typography>
                        <Typography variant="body2" mt={1}>
                          {portfolio.objective}
                        </Typography>
                        <Stack direction="row" spacing={2} mt={1}>
                          <PortfolioReturn label="1Y" value={portfolio.returns.oneYear} />
                          <PortfolioReturn label="3Y" value={portfolio.returns.threeYear} />
                          <PortfolioReturn label="5Y" value={portfolio.returns.fiveYear} />
                        </Stack>
                        <Typography variant="caption" color="text.secondary" mt={2} display="block">
                          Holdings
                        </Typography>
                        <List dense>
                          {portfolio.holdings.map((holding) => (
                            <ListItem key={holding.schemeCode} disableGutters>
                              <ListItemText
                                primary={holding.schemeName}
                                secondary={`Allocation ${holding.allocation}%`}
                                primaryTypographyProps={{ variant: 'body2' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  )) || (
                    <Typography color="text.secondary">
                      {portfoliosLoading ? 'Loading portfolios…' : 'No portfolios found'}
                    </Typography>
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

const PortfolioReturn = ({ label, value }: { label: string; value: number }) => (
  <Box>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="subtitle1" fontWeight={600}>
      {value.toFixed(1)}%
    </Typography>
  </Box>
);
