export interface MFScheme {
  schemeCode: number;
  schemeName: string;
}

export interface NAVData {
  date: string;
  nav: string;
}

export interface SchemeDetails {
  meta: {
    scheme_type: string;
    scheme_category: string;
    scheme_code: number;
    scheme_name: string;
    fund_house: string;
  };
  data: NAVData[];
  status: string;
}

export interface ReturnData {
  startDate: string;
  endDate: string;
  startNAV: number;
  endNAV: number;
  simpleReturn: number;
  annualizedReturn?: number;
  duration: number;
}

export interface SIPRequest {
  amount: number;
  frequency: 'monthly' | 'weekly' | 'quarterly';
  from: string;
  to: string;
}

export interface SIPResponse {
  totalInvested: number;
  currentValue: number;
  totalUnits: number;
  absoluteReturn: number;
  annualizedReturn: number;
  investments: {
    date: string;
    amount: number;
    nav: number;
    units: number;
    totalUnits: number;
    totalInvested: number;
    currentValue: number;
  }[];
}

export interface LumpsumRequest {
  amount: number;
  from: string;
  to: string;
}

export interface LumpsumResponse {
  invested: number;
  currentValue: number;
  units: number;
  absoluteReturn: number;
  annualizedReturn: number;
  startDate: string;
  endDate: string;
  startNAV: number;
  endNAV: number;
}

export interface SWPRequest {
  initialInvestment: number;
  withdrawalAmount: number;
  frequency: 'monthly' | 'quarterly';
  from: string;
  to: string;
}

export interface SWPResponse {
  initialInvestment: number;
  totalWithdrawn: number;
  remainingValue: number;
  remainingUnits: number;
  withdrawals: {
    date: string;
    withdrawalAmount: number;
    nav: number;
    unitsRedeemed: number;
    remainingUnits: number;
    remainingValue: number;
  }[];
}
