import { randomUUID } from 'crypto';
import {
  FaqEntry,
  KnowledgeCategory,
  SupportTicket,
  TicketMessage,
  SlaDashboard,
  FeedbackEntry,
} from '@/types/support';

const faqEntries: FaqEntry[] = [
  {
    id: 'FAQ-001',
    category: 'Investments',
    question: 'How do I start a SIP?',
    answer: 'Navigate to the SIP calculator, pick a fund, and authorize mandate.',
    tags: ['sip', 'getting_started'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'FAQ-002',
    category: 'Security',
    question: 'Is my data safe?',
    answer: 'We use bank-grade encryption, 2FA, and ISO-compliant processes.',
    tags: ['security'],
    updatedAt: new Date().toISOString(),
  },
];

const knowledgeCategories: KnowledgeCategory[] = [
  {
    id: 'cat-invest',
    name: 'Investments',
    description: 'SIP, lumpsum, SWP related guides',
    articles: faqEntries.filter((entry) => entry.category === 'Investments'),
  },
  {
    id: 'cat-security',
    name: 'Security',
    description: 'Account and security FAQs',
    articles: faqEntries.filter((entry) => entry.category === 'Security'),
  },
];

const sampleMessages = (fromCustomer = true): TicketMessage[] => [
  {
    id: randomUUID(),
    author: fromCustomer ? 'customer' : 'agent',
    body: fromCustomer ? 'Need help with KYC.' : 'Sure, please upload PAN repeated copy.',
    timestamp: new Date().toISOString(),
  },
];

const supportTickets: SupportTicket[] = [
  {
    id: 'TIC-1001',
    subject: 'KYC stuck',
    status: 'open',
    priority: 'high',
    createdAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
    updatedAt: new Date().toISOString(),
    channel: 'email',
    customer: 'customer@grow.in',
    assignee: 'ria@grow.in',
    messages: sampleMessages(true),
  },
  {
    id: 'TIC-1002',
    subject: 'Unable to start SIP',
    status: 'pending',
    priority: 'medium',
    createdAt: new Date(Date.now() - 6 * 3600_000).toISOString(),
    updatedAt: new Date().toISOString(),
    channel: 'chat',
    customer: 'investor@example.com',
    messages: sampleMessages(false),
  },
];

const slaDashboard: SlaDashboard = {
  avgFirstResponse: '12m',
  avgResolution: '4h 15m',
  breachingTickets: 3,
  metrics: [
    { id: 'sla-1', name: 'First response', target: '15m', current: '12m', trend: 'up' },
    { id: 'sla-2', name: 'Resolution', target: '6h', current: '4h 15m', trend: 'down' },
  ],
};

const feedbackEntries: FeedbackEntry[] = [
  {
    id: randomUUID(),
    user: 'customer@grow.in',
    rating: 9,
    comment: 'Great customer support!',
    submittedAt: new Date().toISOString(),
    type: 'nps',
  },
  {
    id: randomUUID(),
    user: 'riz@sample.in',
    rating: 3,
    comment: 'Chat bot did not help',
    submittedAt: new Date(Date.now() - 86400_000).toISOString(),
    type: 'csat',
  },
];

export const getKnowledgeBase = () => knowledgeCategories;
export const searchFaqs = (term: string) =>
  faqEntries.filter((entry) => entry.question.toLowerCase().includes(term.toLowerCase()));

export const getTickets = () => supportTickets;
export const updateTicketStatus = (id: string, status: SupportTicket['status']) => {
  const ticket = supportTickets.find((item) => item.id === id);
  if (ticket) {
    ticket.status = status;
    ticket.updatedAt = new Date().toISOString();
    ticket.messages.push({
      id: randomUUID(),
      author: 'agent',
      body: `Status updated to ${status}`,
      timestamp: new Date().toISOString(),
    });
  }
  return ticket;
};

export const createTicket = (subject: string, channel: SupportTicket['channel'], customer: string, body: string) => {
  const ticket: SupportTicket = {
    id: `TIC-${Math.floor(Math.random() * 9000) + 1000}`,
    subject,
    status: 'open',
    priority: 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    channel,
    customer,
    messages: [
      {
        id: randomUUID(),
        author: 'customer',
        body,
        timestamp: new Date().toISOString(),
      },
    ],
  };
  supportTickets.unshift(ticket);
  return ticket;
};

export const getSlaDashboard = () => slaDashboard;
export const getFeedbackEntries = () => feedbackEntries;
export const addFeedbackEntry = (input: Omit<FeedbackEntry, 'id' | 'submittedAt'>) => {
  const entry: FeedbackEntry = {
    ...input,
    id: randomUUID(),
    submittedAt: new Date().toISOString(),
  };
  feedbackEntries.unshift(entry);
  return entry;
};
