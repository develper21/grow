import Head from 'next/head';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import ArticleIcon from '@mui/icons-material/Article';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useMarketInsights } from '@/lib/researchApi';

const typeIconMap = {
  video: <PlayCircleIcon color="primary" />,
  article: <ArticleIcon color="secondary" />,
  podcast: <GraphicEqIcon color="success" />,
};

export default function MarketInsightsPage() {
  const { insights, loading } = useMarketInsights();

  return (
    <>
      <Head>
        <title>Market Insights | Grow</title>
      </Head>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={3} mb={3}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Market insights
            </Typography>
            <Typography color="text.secondary">
              Curated articles, videos, and podcasts from the Grow research desk.
            </Typography>
          </Box>
        </Stack>

        <Grid container spacing={3}>
          {insights?.map((item) => (
            <Grid item xs={12} md={6} key={item.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Avatar src={item.thumbnail} sx={{ width: 72, height: 72 }} variant="rounded">
                      {typeIconMap[item.type]}
                    </Avatar>
                    <Box flex={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {typeIconMap[item.type]}
                        <Typography variant="caption" color="text.secondary">
                          {item.type.toUpperCase()}
                        </Typography>
                      </Stack>
                      <Typography variant="h6" mt={1}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.summary}
                      </Typography>
                      <Stack direction="row" spacing={2} mt={2} alignItems="center">
                        <Chip
                          icon={<TrendingUpIcon fontSize="small" />}
                          label={`${item.engagement.reads.toLocaleString('en-IN')} reads`}
                          size="small"
                        />
                        <Chip
                          icon={<FavoriteIcon fontSize="small" />}
                          label={`${item.engagement.likes.toLocaleString('en-IN')} likes`}
                          size="small"
                        />
                      </Stack>
                      <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                        {item.author} • {new Date(item.publishedAt).toLocaleString('en-IN')}
                      </Typography>
                      <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                        {item.tags.map((tag) => (
                          <Chip key={tag} label={tag} size="small" variant="outlined" />
                        ))}
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {!insights?.length && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography align="center" color="text.secondary">
                    {loading ? 'Loading insights…' : 'No insights available'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
}
