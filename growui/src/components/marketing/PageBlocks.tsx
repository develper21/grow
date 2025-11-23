import Image from 'next/image';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { PageBlock, HeroBlock, FeatureGridBlock, StatsBlock, CtaBannerBlock, TestimonialCarouselBlock } from '@/types/marketing';

interface PageBlocksProps {
  blocks: PageBlock[];
}

export const PageBlocks = ({ blocks }: PageBlocksProps) => {
  return (
    <Stack spacing={4}>
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'hero':
            return <HeroSection key={index} block={block} />;
          case 'feature_grid':
            return <FeatureGrid key={index} block={block} />;
          case 'stats':
            return <StatsSection key={index} block={block} />;
          case 'cta_banner':
            return <CtaBanner key={index} block={block} />;
          case 'testimonial_carousel':
            return <TestimonialCarousel key={index} block={block} />;
          default:
            return null;
        }
      })}
    </Stack>
  );
};

const HeroSection = ({ block }: { block: HeroBlock }) => (
  <Grid
    container
    spacing={4}
    alignItems="center"
    direction={block.variant === 'centered' ? 'column' : 'row'}
  >
    <Grid item xs={12} md={6}>
      <Stack spacing={2} textAlign={block.variant === 'centered' ? 'center' : 'left'}>
        {block.eyebrow && (
          <Chip label={block.eyebrow} color="primary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
        )}
        <Typography variant="h3" fontWeight={700}>
          {block.title}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {block.subtitle}
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent={block.variant === 'centered' ? 'center' : 'flex-start'}
        >
          {block.actions.map((action) => (
            <Button
              key={action.href}
              href={action.href}
              variant={action.style === 'primary' ? 'contained' : action.style === 'secondary' ? 'outlined' : 'text'}
              size="large"
            >
              {action.label}
            </Button>
          ))}
        </Stack>
      </Stack>
    </Grid>
    {block.mediaUrl && (
      <Grid item xs={12} md={6}>
        <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', height: 320 }}>
          <Image src={block.mediaUrl} alt={block.title} fill style={{ objectFit: 'cover' }} />
        </Box>
      </Grid>
    )}
  </Grid>
);

const FeatureGrid = ({ block }: { block: FeatureGridBlock }) => (
  <Grid container spacing={3}>
    {block.items.map((item, index) => (
      <Grid item xs={12} md={12 / block.columns} key={index}>
        <Card variant="outlined" sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="overline" color="text.secondary">
              {item.icon}
            </Typography>
            <Typography variant="h6" gutterBottom>
              {item.title}
            </Typography>
            <Typography color="text.secondary">{item.body}</Typography>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

const StatsSection = ({ block }: { block: StatsBlock }) => (
  <Card variant="outlined">
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {block.headline}
      </Typography>
      <Grid container spacing={2}>
        {block.items.map((item, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Typography variant="h4" fontWeight={700}>
              {item.value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.label}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </CardContent>
  </Card>
);

const CtaBanner = ({ block }: { block: CtaBannerBlock }) => (
  <Card sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
    <CardContent>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h5" fontWeight={600}>
            {block.title}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            {block.body}
          </Typography>
        </Box>
        <Button href={block.ctaHref} variant="contained" color="secondary" sx={{ mt: { xs: 2, md: 0 } }}>
          {block.ctaLabel}
        </Button>
      </Stack>
    </CardContent>
  </Card>
);

const TestimonialCarousel = ({ block }: { block: TestimonialCarouselBlock }) => (
  <Grid container spacing={3}>
    {block.testimonials.map((testimonial) => (
      <Grid item xs={12} md={6} key={testimonial.id}>
        <Card variant="outlined" sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="body1" gutterBottom>
              “{testimonial.quote}”
            </Typography>
            <Typography variant="subtitle2">{testimonial.author}</Typography>
            <Typography variant="caption" color="text.secondary">
              {testimonial.role}, {testimonial.company}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);
