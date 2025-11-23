import type { NextApiRequest, NextApiResponse } from 'next';
import { DocumentInfo, DocumentType } from '@/types/onboarding';

interface OcrResponse extends Pick<DocumentInfo, 'extractedName' | 'extractedDob' | 'ocrConfidence' | 'verificationStatus'> {}

const MOCK_IDENTITIES: Record<DocumentType, { name: string; dob: string }> = {
  aadhaar: { name: 'Aarav Sharma', dob: '1991-05-14' },
  passport: { name: 'Meera Kapoor', dob: '1987-11-02' },
  driving_license: { name: 'Rohan Iyer', dob: '1994-03-28' },
};

const isValidDocumentType = (value: unknown): value is DocumentType =>
  value === 'aadhaar' || value === 'passport' || value === 'driving_license';

export default function handler(req: NextApiRequest, res: NextApiResponse<OcrResponse | { message: string }>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { documentType } = req.body as Partial<DocumentInfo>;
  if (!isValidDocumentType(documentType)) {
    return res.status(400).json({ message: 'Document type is required for OCR.' });
  }

  const identity = MOCK_IDENTITIES[documentType];
  const confidence = Math.round((0.9 + Math.random() * 0.09) * 100) / 100;

  return res.status(200).json({
    extractedName: identity?.name ?? 'Document Holder',
    extractedDob: identity?.dob ?? '1990-01-01',
    ocrConfidence: confidence,
    verificationStatus: confidence > 0.92 ? 'verified' : 'pending',
  });
}
