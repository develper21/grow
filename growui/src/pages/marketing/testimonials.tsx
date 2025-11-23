import Head from 'next/head';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import InsightsIcon from '@mui/icons-material/Insights';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTestimonials } from '@/lib/marketingApi';

export default function TestimonialsPage() {
  const { testimonials, caseStudies, loading } = useTestimonials();

  return (
    <>
      <Head>
        <title>Testimonials & Case Studies | Grow</title>
      </Head>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={1} mb={4}>
          <Typography variant="h3" fontWeight={700}>
            Success stories
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Hear from teams shipping growth pages faster with Grow.
          </Typography>
        </Stack>
        <Grid container spacing={3}>
          {testimonials?.map((item: NonNullable<typeof testimonials>[number]) => (
            <Grid item xs={12} md={6} key={item.id}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Stack spacing={2}>
                    <FormatQuoteIcon color="primary" />
                    <Typography variant="h6">“{item.quote}”</Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={item.avatar}>{item.author[0]}</Avatar>
                      <Box>
                        <Typography fontWeight={600}>{item.author}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.role}, {item.company}
                        </Typography>
                      </Box>
                      <Chip label={item.type} size="small" sx={{ ml: 'auto' }} />
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {!loading && !testimonials?.length && (
            <Grid item xs={12}>
              <Typography color="text.secondary">No testimonials yet.</Typography>
            </Grid>
          )}
        </Grid>

        <Divider sx={{ my: 5 }} />

        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <InsightsIcon color="primary" />
          <Typography variant="h5">Case studies</Typography>
        </Stack>
        <Grid container spacing={3}>
          {caseStudies?.map((study: NonNullable<typeof caseStudies>[number]) => (
            <Grid item xs={12} md={6} key={study.id}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="overline" color="text.secondary">
                    {study.industry}
                  </Typography>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    {study.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {study.summary}
                  </Typography>
                  <Stack direction="row" spacing={2} mt={2}>
                    {study.metrics.map((metric: (typeof study.metrics)[number]) => (
                      <Box key={metric.label}>
                        <Typography variant="h6" fontWeight={600}>
                          {metric.value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {metric.label}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                  <Chip
                    component="a"
                    href={study.link}
                    clickable
                    icon={<ArrowForwardIcon />}
                    label="Read story"
                    sx={{ mt: 2 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
          {!loading && !caseStudies?.length && (
            <Grid item xs={12}>
              <Typography color="text.secondary">No case studies yet.</Typography>
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
}
