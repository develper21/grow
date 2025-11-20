import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Stack,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import ChatIcon from '@mui/icons-material/Chat';

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        question: 'How do I create an account?',
        answer: 'You can create an account by clicking the "Sign Up" button in the top right corner. Fill in your details and verify your email to get started.',
      },
      {
        question: 'Is Grow free to use?',
        answer: 'Yes! Grow offers a free plan with access to basic fund research tools. We also have Pro and Enterprise plans with advanced features.',
      },
      {
        question: 'What information do I need to provide?',
        answer: 'We only require your basic information: name, email, and password. No financial information is required to get started.',
      },
    ],
  },
  {
    category: 'Fund Research',
    questions: [
      {
        question: 'How many mutual funds can I research?',
        answer: 'Free users can access 100+ funds. Pro users get access to all 7000+ funds in our database.',
      },
      {
        question: 'How often is fund data updated?',
        answer: 'Fund data is updated daily at 7:00 AM IST with the latest NAV values and performance metrics.',
      },
      {
        question: 'Can I compare multiple funds?',
        answer: 'Yes! You can compare up to 5 funds side-by-side to analyze their performance, risk, and other metrics.',
      },
    ],
  },
  {
    category: 'Calculators',
    questions: [
      {
        question: 'Which calculators are available?',
        answer: 'We offer SIP, Lumpsum, and SWP calculators with historical data and future projections.',
      },
      {
        question: 'How accurate are the calculations?',
        answer: 'Our calculations use actual historical NAV data for accuracy. Future projections are based on historical performance.',
      },
      {
        question: 'Can I save my calculations?',
        answer: 'Yes! Pro users can save their calculations and create custom investment scenarios.',
      },
    ],
  },
  {
    category: 'Portfolio Management',
    questions: [
      {
        question: 'What is Virtual Portfolio?',
        answer: 'Virtual Portfolio allows you to simulate investments with virtual money to test strategies before investing real money.',
      },
      {
        question: 'How do I add funds to my watchlist?',
        answer: 'Click the bookmark icon on any fund card to add it to your watchlist for easy tracking.',
      },
      {
        question: 'Can I track performance over time?',
        answer: 'Yes! Your watchlist shows performance for 1D, 1M, 3M, 6M, and 1Y periods.',
      },
    ],
  },
  {
    category: 'Account & Billing',
    questions: [
      {
        question: 'How do I upgrade my plan?',
        answer: 'Go to Settings > Billing to upgrade your plan. Changes take effect immediately.',
      },
      {
        question: 'What payment methods are accepted?',
        answer: 'We accept all major credit cards, UPI payments, and bank transfers.',
      },
      {
        question: 'Can I cancel anytime?',
        answer: 'Yes, you can cancel your subscription anytime. You\'ll retain access until the end of your billing period.',
      },
    ],
  },
];

const supportChannels = [
  {
    icon: <EmailIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
    title: 'Email Support',
    description: 'Get help via email within 24 hours',
    contact: 'support@growfunds.com',
  },
  {
    icon: <PhoneIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
    title: 'Phone Support',
    description: 'Speak with our experts (Pro & Enterprise only)',
    contact: '+91-98765-43210',
  },
  {
    icon: <ChatIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
    title: 'Live Chat',
    description: 'Instant help during business hours',
    contact: 'Available 9 AM - 6 PM IST',
  },
];

export default function HelpCenterPage() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const filteredFAQs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0);

  return (
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
        {/* Hero Section */}
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
                Help Center
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
                Find answers to your questions and get the help you need
              </Typography>

              {/* Search */}
              <TextField
                fullWidth
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)', mr: 1 }} />
                  ),
                }}
                sx={{
                  maxWidth: 500,
                  mx: 'auto',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                    '&::placeholder': {
                      color: 'rgba(255,255,255,0.7)',
                    },
                  },
                }}
              />
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, md: 3 } }}>
          {!searchQuery ? (
            <>
              {/* Quick Help */}
              <Box sx={{ mb: 8 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 4, textAlign: 'center' }}>
                  How can we help you?
                </Typography>

                <Grid container spacing={4}>
                  <Grid item xs={12} md={4}>
                    <Card
                      sx={{
                        textAlign: 'center',
                        p: 4,
                        borderRadius: 4,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 0 }}>
                        <SearchIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                          Browse FAQs
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Find quick answers to common questions about using Grow
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Card
                      sx={{
                        textAlign: 'center',
                        p: 4,
                        borderRadius: 4,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 0 }}>
                        <EmailIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                          Email Support
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Get detailed help from our support team
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Card
                      sx={{
                        textAlign: 'center',
                        p: 4,
                        borderRadius: 4,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 0 }}>
                        <PhoneIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                          Phone Support
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Speak directly with our investment experts
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>

              {/* Support Channels */}
              <Box sx={{ mb: 8 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 4, textAlign: 'center' }}>
                  Contact Support
                </Typography>

                <Grid container spacing={4}>
                  {supportChannels.map((channel, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <Card
                        sx={{
                          height: '100%',
                          textAlign: 'center',
                          p: 4,
                          borderRadius: 4,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                          },
                        }}
                      >
                        <CardContent sx={{ p: 0 }}>
                          <Box sx={{ mb: 3 }}>
                            {channel.icon}
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            {channel.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                            {channel.description}
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            {channel.contact}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* FAQs */}
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 6, textAlign: 'center' }}>
                  Frequently Asked Questions
                </Typography>

                {filteredFAQs.map((category, categoryIndex) => (
                  <Box key={categoryIndex} sx={{ mb: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>
                      {category.category}
                    </Typography>

                    {category.questions.map((faq, faqIndex) => (
                      <Accordion
                        key={faqIndex}
                        expanded={expanded === `${categoryIndex}-${faqIndex}`}
                        onChange={handleAccordionChange(`${categoryIndex}-${faqIndex}`)}
                        sx={{
                          mb: 2,
                          borderRadius: 2,
                          '&:before': {
                            display: 'none',
                          },
                          '&.Mui-expanded': {
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          },
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          sx={{
                            borderRadius: 2,
                            '&.Mui-expanded': {
                              borderBottomLeftRadius: 0,
                              borderBottomRightRadius: 0,
                            },
                          }}
                        >
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {faq.question}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                            {faq.answer}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Box>
                ))}
              </Box>
            </>
          ) : (
            /* Search Results */
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Search Results for &quot;{searchQuery}&quot;
              </Typography>

              {filteredFAQs.length === 0 ? (
                <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
                  No results found. Try different keywords or browse the categories above.
                </Typography>
              ) : (
                filteredFAQs.map((category, categoryIndex) =>
                  category.questions.map((faq, faqIndex) => (
                    <Accordion
                      key={`${categoryIndex}-${faqIndex}`}
                      sx={{
                        mb: 2,
                        borderRadius: 2,
                        '&:before': {
                          display: 'none',
                        },
                      }}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {faq.question}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                          {faq.answer}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))
                )
              )}
            </Box>
          )}
        </Container>
      </Box>
  );
}
