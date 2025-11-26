export type OrderStatus = 'processing' | 'executed' | 'failed';
export type MandateStatus = 'active' | 'paused';

export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly';

export interface OrderInput {
  schemeCode: number;
  schemeName: string;
  fundHouse: string;
  nav: string;
  orderType: 'lumpsum' | 'sip' | 'redeem' | 'swp' | 'stp';
  amount: number;
  frequency?: RecurringFrequency;
  sipStartDate?: string;
  payoutAccount?: string;
  targetScheme?: string;
  transferStartDate?: string;
  paymentMethod: string;
  paymentGateway?: string;
  paymentReference?: string;
}

export interface OrderRecord extends OrderInput {
  id: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  receiptEmailSentAt?: string;
}

export interface MandateRecord {
  id: string;
  nickname: string;
  bank: string;
  limit: number;
  status: MandateStatus;
  createdAt: string;
}
