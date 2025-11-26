import { randomUUID } from 'crypto';
import {
  CaseStudy,
  EventPagePayload,
  FormSubmissionInput,
  FormSubmissionResponse,
  HeroBlock,
  MarketingPage,
  PricingPagePayload,
  Testimonial,
  TestimonialCarouselBlock,
  Experiment,
} from '@/types/marketing';

const heroBlock: HeroBlock = {
  type: 'hero',
  variant: 'split',
  eyebrow: 'Grow for Startups',
  title: 'Launch wealth experiences in weeks, not months',
  subtitle: 'Campaign-ready landing templates, CRM-integrated forms, and built-in experiments.',
  mediaUrl:
    'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=60',
  actions: [
    { label: 'Book a demo', href: '/demo', style: 'primary' },
    { label: 'Download playbook', href: '/playbook.pdf', style: 'secondary' },
  ],
};

const marketingPages: MarketingPage[] = [
  {
    slug: 'campaigns-wealth',
    title: 'Grow Campaign Toolkit',
    description: 'Modular landing pages with hero, features, stats and testimonials.',
    tags: ['hero', 'landing', 'campaign'],
    blocks: [
      heroBlock,
      {
        type: 'feature_grid',
        columns: 3,
        items: [
          { icon: 'AutoFixHigh', title: 'Drag & drop sections', body: 'Assemble hero, feature and CTA blocks in one place.' },
          { icon: 'Bolt', title: 'Instant A/B tests', body: 'Launch experiments with one click—no extra tooling.' },
          { icon: 'Hub', title: 'CRM synced forms', body: 'Pipe submissions to HubSpot, Salesforce or webhooks.' },
        ],
      },
      {
        type: 'stats',
        headline: 'Teams trust Grow to ship faster',
        items: [
          { label: 'Avg. build time', value: '3 days' },
          { label: 'Lead lift', value: '+42%' },
          { label: 'Experiments shipped', value: '120+' },
        ],
      },
      {
        type: 'testimonial_carousel',
        testimonials: [],
      },
      {
        type: 'cta_banner',
        title: 'Ready to build your next campaign?',
        body: 'Talk to our growth engineers and get a tailored rollout plan.',
        ctaLabel: 'Talk to sales',
        ctaHref: '/contact',
      },
    ],
    lastPublishedAt: new Date().toISOString(),
  },
];

const testimonials: Testimonial[] = [
  {
    id: randomUUID(),
    type: 'customer',
    quote: 'Grow let us iterate landing pages twice as fast while syncing every lead to Salesforce.',
    author: 'Priya Singh',
    role: 'Growth Lead',
    company: 'VistaMoney',
    avatar: 'https://randomuser.me/api/portraits/women/91.jpg',
  },
  {
    id: randomUUID(),
    type: 'advisor',
    quote: 'The built-in experimentation hooks are a gift for CRO teams.',
    author: 'Arjun Mehta',
    role: 'Partner',
    company: 'Elevate Ventures',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
];

(marketingPages[0].blocks[3] as TestimonialCarouselBlock).testimonials = testimonials;

const caseStudies: CaseStudy[] = [
  {
    id: randomUUID(),
    customer: 'PaySprint',
    industry: 'Payments',
    title: 'PaySprint tripled demo conversions in 6 weeks',
    summary: 'Modular landing pages + CRM syncing removed engineering bottlenecks.',
    metrics: [
      { label: 'Demo conversions', value: '+210%' },
      { label: 'Launch cadence', value: 'Weekly' },
    ],
    link: '/case-studies/paysprint',
  },
];

const pricingPage: PricingPagePayload = {
  headline: 'Simple plans for every growth team',
  tiers: [
    {
      id: 'starter',
      name: 'Starter',
      price: '₹24,999/mo',
      description: 'Launch branded landing pages with CMS blocks.',
      features: ['5 live pages', 'HubSpot + webhooks', 'Monthly experiment report'],
    },
    {
      id: 'scale',
      name: 'Scale',
      price: '₹49,999/mo',
      description: 'Everything in Starter plus personalization + A/B testing.',
      features: ['Unlimited pages', 'Experiment workflow', 'Dedicated CSM'],
      recommended: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Contact us',
      description: 'Advanced security, SLAs and headless CMS APIs.',
      features: ['SAML/SCIM', 'Custom data residency', 'Solution architect'],
    },
  ],
  faqs: [
    { question: 'Can I migrate existing pages?', answer: 'Yes, our team helps import legacy HTML or CMS data.' },
    { question: 'Do you support white-label?', answer: 'All pages can run on custom domains with branded assets.' },
  ],
};

const eventPage: EventPagePayload = {
  slug: 'events/growth-days',
  title: 'Grow Growth Days 2025',
  description: 'A two-day virtual summit covering performance marketing, CRO, and automation.',
  registrationHeadline: 'Reserve your seat (limited to 500 attendees)',
  sessions: [
    {
      id: randomUUID(),
      title: 'Building landing systems teams love',
      speaker: 'Natasha Verma',
      startTime: new Date(Date.now() + 86400000).toISOString(),
      durationMinutes: 60,
      capacity: 200,
      registered: 156,
    },
    {
      id: randomUUID(),
      title: 'Experiment pipelines without the chaos',
      speaker: 'Ravi Menon',
      startTime: new Date(Date.now() + 2 * 86400000).toISOString(),
      durationMinutes: 45,
      capacity: 200,
      registered: 120,
    },
  ],
};

const experiments: Experiment[] = [
  {
    id: randomUUID(),
    name: 'Hero CTA phrasing',
    status: 'running',
    primaryMetric: 'Lead-to-demo rate',
    variantCount: 2,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    name: 'Testimonials placement',
    status: 'completed',
    primaryMetric: 'Time on page',
    variantCount: 3,
    lastUpdated: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const getMarketingPages = () => marketingPages;
export const getMarketingPageBySlug = (slug: string) => marketingPages.find((page) => page.slug === slug);
export const getTestimonials = () => testimonials;
export const getCaseStudies = () => caseStudies;
export const getPricingPage = () => pricingPage;
export const getEventPage = () => eventPage;
export const getEventPageBySlug = (slug: string) => (eventPage.slug === slug ? eventPage : undefined);
export const getExperiments = () => experiments;

export const submitForm = (input: FormSubmissionInput): FormSubmissionResponse => {
  return {
    submissionId: randomUUID(),
    status: 'queued',
  };
};
