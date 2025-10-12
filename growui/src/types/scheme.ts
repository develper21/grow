export interface NAVEntry {
  date: string;
  nav: number;
}

export interface Scheme {
  schemeCode: string;      
  schemeName: string;      
  isin?: string;          
  category?: string;       
  type?: string;          
  navHistory?: NAVEntry[];
}

export interface Returns {
  oneMonth: number;
  threeMonths: number;
  sixMonths: number;
  oneYear: number;
  threeYears?: number;
  fiveYears?: number;
  cagr?: number;
}

export interface SIPInput {
  amount: number;     
  duration: number;   
  expectedRate: number; 
}

export interface SIPResult {
  investedAmount: number;  
  currentValue: number;    
  wealthGain: number;      
  xirr?: number;           
}
