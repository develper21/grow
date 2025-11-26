import { DocumentInfo, OnboardingPayload } from '@/types/onboarding';

async function handleResponse(response: Response) {
  if (!response.ok) {
    const message = (await response.text()) || 'Request failed';
    throw new Error(message);
  }
  return response.json();
}

export async function saveOnboarding(payload: OnboardingPayload) {
  const response = await fetch('/api/onboarding', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}

export async function fetchOnboarding(): Promise<OnboardingPayload | null> {
  const response = await fetch('/api/onboarding');
  if (!response.ok) {
    return null;
  }
  return response.json();
}

export async function submitOnboarding(payload: OnboardingPayload) {
  const response = await fetch('/api/onboarding?submit=true', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}

export async function runDocumentOcr(payload: {
  documentType: DocumentInfo['documentType'];
  documentNumber: string;
  fileName?: string;
  previewDataUrl?: string;
}): Promise<Pick<DocumentInfo, 'extractedName' | 'extractedDob' | 'ocrConfidence' | 'verificationStatus'>> {
  const response = await fetch('/api/onboarding/ocr', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}
