import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  useTheme,
  alpha,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const blogPosts = [
  {
    title: 'Understanding Mutual Fund Categories',
    excerpt: 'Learn about different types of mutual funds and how to choose the right one for your investment goals.',
    author: 'Priya Sharma',
    date: 'Jan 15, 2024',
    category: 'Education',
    readTime: '5 min read',
    featured: true,
  },
  {
    title: 'SIP vs Lumpsum: Which is Better?',
    excerpt: 'A comprehensive comparison between Systematic Investment Plans and one-time investments.',
    author: 'Rajesh Kumar',
    date: 'Jan 12, 2024',
    category: 'Investment',
    readTime: '8 min read',
    featured: false,
  },
  {
    title: 'Tax Implications of Mutual Fund Investments',
    excerpt: 'Everything you need to know about taxation on mutual fund returns in India.',
    author: 'Sneha Reddy',
    date: 'Jan 10, 2024',
    category: 'Taxation',
    readTime: '6 min read',
    featured: false,
  },
  {
    title: 'Building a Diversified Portfolio',
    excerpt: 'Strategies for creating a well-balanced mutual fund portfolio.',
    author: 'Amit Patel',
    date: 'Jan 8, 2024',
    category: 'Portfolio',
    readTime: '7 min read',
    featured: false,
  },
];

export default function BlogPage() {
  const theme = useTheme();

  return (
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            py: { xs: 8, md: 12 },
            px: 2,
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 800,
                  mb: 3,
                  lineHeight: 1.1,
                }}
              >
                Investment Insights
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  mb: 4,
                  opacity: 0.95,
                  maxWidth: 600,
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
                Expert articles and guides to help you make informed investment decisions
              </Typography>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, md: 3 } }}>
          <Grid container spacing={4}>
            {blogPosts.map((post, index) => (
              <Grid item xs={12} md={post.featured ? 12 : 6} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 4,
                    transition: 'all 0.3s ease',
                    border: post.featured ? `2px solid ${theme.palette.primary.main}` : '1px solid rgba(0, 0, 0, 0.08)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{
                          bgcolor: 'primary.main',
                          width: 32,
                          height: 32,
                          fontSize: '0.9rem',
                        }}>
                          {post.author.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                            {post.author}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <CalendarTodayIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {post.date}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              • {post.readTime}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Chip
                        label={post.category}
                        size="small"
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      />
                    </Box>

                    <Typography
                      variant={post.featured ? "h4" : "h6"}
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        lineHeight: 1.3,
                        color: 'text.primary',
                      }}
                    >
                      {post.title}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        mb: 3,
                        lineHeight: 1.7,
                        fontSize: post.featured ? '1.1rem' : '1rem',
                      }}
                    >
                      {post.excerpt}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      variant="outlined"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Read More
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
  );
}
