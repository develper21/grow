export type OnboardingStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'submitted';
export type DocumentType = 'aadhaar' | 'passport' | 'driving_license';

export interface PersonalInfo {
  fullName: string;
  pan: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface DocumentInfo {
  documentType: DocumentType | '';
  documentNumber: string;
  fileName?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  previewDataUrl?: string;
  extractedName?: string;
  extractedDob?: string;
  ocrConfidence?: number;
}

export interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  ifsc: string;
  bankName: string;
  verificationStatus: 'unverified' | 'in_progress' | 'verified';
}

export interface RiskQuestionResponse {
  questionId: string;
  score: number;
}

export interface RiskProfile {
  responses: RiskQuestionResponse[];
  overallScore: number;
  profile: 'conservative' | 'balanced' | 'aggressive';
}

export interface OnboardingPayload {
  personalInfo: PersonalInfo;
  documents: DocumentInfo;
  bankDetails: BankDetails;
  riskProfile: RiskProfile;
  consentsAccepted: boolean;
  status: OnboardingStatus;
  statusMessage?: string;
  updatedAt: string;
}

export const createDefaultOnboardingPayload = (): OnboardingPayload => ({
  personalInfo: {
    fullName: '',
    pan: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
  },
  documents: {
    documentType: '',
    documentNumber: '',
    fileName: undefined,
    verificationStatus: 'pending',
    previewDataUrl: undefined,
    extractedName: undefined,
    extractedDob: undefined,
    ocrConfidence: undefined,
  },
  bankDetails: {
    accountHolderName: '',
    accountNumber: '',
    ifsc: '',
    bankName: '',
    verificationStatus: 'unverified',
  },
  riskProfile: {
    responses: [],
    overallScore: 0,
    profile: 'conservative',
  },
  consentsAccepted: false,
  status: 'draft',
  statusMessage: 'Draft started',
  updatedAt: new Date().toISOString(),
});
