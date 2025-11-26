export interface FaqEntry {
  id: string;
  category: string;
  question: string;
  answer: string;
  tags: string[];
  updatedAt: string;
}

export interface KnowledgeCategory {
  id: string;
  name: string;
  description: string;
  articles: FaqEntry[];
}

export type TicketStatus = 'open' | 'pending' | 'resolved';
export type TicketChannel = 'chat' | 'email' | 'in_app';

export interface SupportTicket {
  id: string;
  subject: string;
  status: TicketStatus;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  channel: TicketChannel;
  customer: string;
  assignee?: string;
  messages: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  author: 'customer' | 'agent' | 'bot';
  body: string;
  timestamp: string;
}

export interface ChatSuggestion {
  id: string;
  title: string;
  snippet: string;
}

export interface SlaMetric {
  id: string;
  name: string;
  target: string;
  current: string;
  trend: 'up' | 'down' | 'flat';
}

export interface SlaDashboard {
  avgFirstResponse: string;
  avgResolution: string;
  breachingTickets: number;
  metrics: SlaMetric[];
}

export interface FeedbackEntry {
  id: string;
  user: string;
  rating: number;
  comment: string;
  submittedAt: string;
  type: 'nps' | 'csat';
}
