// src/types/scheme.ts

// ✅ NAV entry (daily price)
export interface NAVEntry {
  date: string;   // e.g. "2025-09-25"
  nav: number;    // NAV value
}

// ✅ Mutual Fund Scheme metadata
export interface Scheme {
  code: string;          // Unique AMFI scheme code
  name: string;          // Scheme name (e.g. SBI Bluechip Fund)
  isin?: string;         // Optional ISIN (International Securities Identification Number)
  category?: string;     // e.g. "Equity", "Debt", "Hybrid"
  type?: string;         // e.g. "Open Ended", "Close Ended"
  navHistory?: NAVEntry[]; // Optional NAV history
}

// ✅ Returns (absolute % for given time periods)
export interface Returns {
  oneMonth: number;
  threeMonths: number;
  sixMonths: number;
  oneYear: number;
  threeYears?: number;
  fiveYears?: number;
  cagr?: number; // CAGR if available
}

// ✅ SIP Calculation input
export interface SIPInput {
  amount: number;      // Monthly investment
  duration: number;    // In months
  expectedRate: number; // Annual return in %
}

// ✅ SIP Calculation result
export interface SIPResult {
  investedAmount: number;  // Total money invested
  currentValue: number;    // Value at end of SIP
  wealthGain: number;      // Profit earned
  xirr?: number;           // Approximate XIRR %
}
