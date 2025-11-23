import Head from 'next/head';
import NextLink from 'next/link';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useMarketingPages } from '@/lib/marketingApi';

export default function MarketingHomePage() {
  const { pages, loading } = useMarketingPages();

  return (
    <>
      <Head>
        <title>Marketing CMS | Grow</title>
      </Head>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={1} mb={4}>
          <Typography variant="h3" fontWeight={700}>
            Marketing CMS
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Launch campaign pages, testimonials, pricing explainers and events from a single toolkit.
          </Typography>
        </Stack>
        <Grid container spacing={3}>
          {loading &&
            Array.from({ length: 3 }).map((_, index) => (
              <Grid key={index} item xs={12} md={4}>
                <Card variant="outlined" sx={{ height: 200 }} />
              </Grid>
            ))}
          {!loading &&
            pages?.map((page: (typeof pages)[number]) => (
              <Grid key={page.slug} item xs={12} md={4}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardActionArea component={NextLink} href={`/marketing/campaigns/${page.slug}`} sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {new Date(page.lastPublishedAt).toLocaleDateString('en-IN')}
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        {page.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                        {page.description}
                      </Typography>
                      <Box>
                        {page.tags.map((tag: string) => (
                          <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5 }} />
                        ))}
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Container>
    </>
  );
}
