import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import {
  CaseStudy,
  EventPagePayload,
  FormSubmissionInput,
  FormSubmissionResponse,
  MarketingPage,
  PricingPagePayload,
  Testimonial,
  Experiment,
} from '@/types/marketing';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || 'Request failed');
  }
  return res.json();
};

const postFetcher = async (url: string, { arg }: { arg: any }) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg),
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || 'Request failed');
  }
  return res.json();
};

export const useMarketingPages = () => {
  const { data, error, isLoading, mutate } = useSWR<{ items: MarketingPage[] }>('/api/marketing/pages', fetcher);
  return { pages: data?.items, loading: isLoading, error, refresh: mutate };
};

export const useMarketingPage = (slug: string) => {
  const key = slug ? `/api/marketing/pages?slug=${slug}` : null;
  const { data, error, isLoading, mutate } = useSWR<MarketingPage | null>(key, fetcher);
  return { page: data ?? null, loading: isLoading, error, refresh: mutate };
};

export const useTestimonials = () => {
  const { data, error, isLoading, mutate } = useSWR<{ testimonials: Testimonial[]; caseStudies: CaseStudy[] }>(
    '/api/marketing/testimonials',
    fetcher
  );
  return { testimonials: data?.testimonials, caseStudies: data?.caseStudies, loading: isLoading, error, refresh: mutate };
};

export const usePricingPage = () => {
  const { data, error, isLoading, mutate } = useSWR<PricingPagePayload>('/api/marketing/pricing', fetcher);
  return { pricing: data, loading: isLoading, error, refresh: mutate };
};

export const useEventPage = (slug: string) => {
  const key = slug ? `/api/marketing/event?slug=${slug}` : null;
  const { data, error, isLoading, mutate } = useSWR<EventPagePayload | null>(key, fetcher);
  return { event: data ?? null, loading: isLoading, error, refresh: mutate };
};

export const useFormSubmission = () => {
  const { trigger, data, error, isMutating } = useSWRMutation<FormSubmissionResponse, any, string, FormSubmissionInput>(
    '/api/marketing/forms',
    postFetcher
  );
  const submit = async (input: FormSubmissionInput) => trigger(input);
  return { submit, response: data, submitting: isMutating, error };
};

export const useExperiments = () => {
  const { data, error, isLoading, mutate } = useSWR<{ items: Experiment[] }>('/api/marketing/experiments', fetcher);
  return { experiments: data?.items, loading: isLoading, error, refresh: mutate };
};
