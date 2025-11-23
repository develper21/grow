import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box, Breadcrumbs, Container, Link, Skeleton, Stack, Typography } from '@mui/material';
import { PageBlocks } from '@/components/marketing/PageBlocks';
import { useMarketingPage } from '@/lib/marketingApi';

export default function CampaignPage() {
  const router = useRouter();
  const slug = typeof router.query.slug === 'string' ? router.query.slug : undefined;
  const { page, loading } = useMarketingPage(slug ?? '');

  const title = page?.title ?? 'Campaign landing';

  return (
    <>
      <Head>
        <title>{title} | Grow Marketing</title>
      </Head>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }} aria-label="breadcrumb">
          <Link color="inherit" href="/marketing">
            Marketing
          </Link>
          <Typography color="text.primary">{title}</Typography>
        </Breadcrumbs>
        {loading && (
          <Stack spacing={2}>
            <Skeleton variant="text" width="60%" height={48} />
            <Skeleton variant="rectangular" height={320} />
            <Skeleton variant="rectangular" height={200} />
          </Stack>
        )}
        {!loading && page ? (
          <Stack spacing={1} mb={4}>
            <Typography variant="h3" fontWeight={700}>
              {page.title}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {page.description}
            </Typography>
            <Box>
              {page.tags.map((tag: string) => (
                <Typography key={tag} component="span" variant="caption" color="primary" sx={{ mr: 1 }}>
                  #{tag}
                </Typography>
              ))}
            </Box>
          </Stack>
        ) : null}
        {!loading && !page && (
          <Typography color="text.secondary">Campaign not found.</Typography>
        )}
        {page && <PageBlocks blocks={page.blocks} />}
      </Container>
    </>
  );
}
