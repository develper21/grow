export type HeroVariant = 'split' | 'centered' | 'media_left';
export type CtaStyle = 'primary' | 'secondary' | 'text';
export type TestimonialType = 'customer' | 'advisor' | 'partner';
export type ContentBlockType = 'hero' | 'feature_grid' | 'stats' | 'cta_banner' | 'testimonial_carousel';
export type ExperimentStatus = 'draft' | 'running' | 'completed';

export interface HeroBlock {
  type: 'hero';
  variant: HeroVariant;
  eyebrow?: string;
  title: string;
  subtitle: string;
  mediaUrl?: string;
  actions: Array<{
    label: string;
    href: string;
    style: CtaStyle;
  }>;
}

export interface FeatureGridItem {
  icon: string;
  title: string;
  body: string;
}

export interface FeatureGridBlock {
  type: 'feature_grid';
  columns: number;
  items: FeatureGridItem[];
}

export interface StatsBlockItem {
  label: string;
  value: string;
}

export interface StatsBlock {
  type: 'stats';
  headline: string;
  items: StatsBlockItem[];
}

export interface CtaBannerBlock {
  type: 'cta_banner';
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface TestimonialCarouselBlock {
  type: 'testimonial_carousel';
  testimonials: Testimonial[];
}

export type PageBlock = HeroBlock | FeatureGridBlock | StatsBlock | CtaBannerBlock | TestimonialCarouselBlock;

export interface MarketingPage {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  blocks: PageBlock[];
  lastPublishedAt: string;
}

export interface Testimonial {
  id: string;
  type: TestimonialType;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
}

export interface CaseStudy {
  id: string;
  customer: string;
  industry: string;
  title: string;
  summary: string;
  metrics: StatsBlockItem[];
  link: string;
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

export interface PricingPagePayload {
  headline: string;
  tiers: PricingTier[];
  faqs: Array<{ question: string; answer: string }>;
}

export interface EventSession {
  id: string;
  title: string;
  speaker: string;
  startTime: string;
  durationMinutes: number;
  capacity: number;
  registered: number;
}

export interface EventPagePayload {
  slug: string;
  title: string;
  description: string;
  sessions: EventSession[];
  registrationHeadline: string;
}

export interface FormSubmissionInput {
  formId: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message?: string;
}

export interface FormSubmissionResponse {
  submissionId: string;
  status: 'queued' | 'delivered';
}

export interface Experiment {
  id: string;
  name: string;
  status: ExperimentStatus;
  primaryMetric: string;
  variantCount: number;
  lastUpdated: string;
}
