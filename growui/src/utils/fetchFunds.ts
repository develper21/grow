import axios from "axios";

interface ExternalFund {
  schemeCode: string;
  name: string;
  category?: string;
  isActive?: boolean;
  nav?: number;
  navDate?: string;
  navHistory?: { date: string; nav: number }[];
}

const FUND_API_URL = process.env.FUND_API_URL!;
const FUND_API_KEY = process.env.FUND_API_KEY || "";

if (!FUND_API_URL) {
  console.warn("FUND_API_URL not set. fetchFunds will fail until set.");
}

export async function fetchFundsFromProvider(): Promise<ExternalFund[]> {
  const res = await axios.get(FUND_API_URL, {
    headers: FUND_API_KEY ? { Authorization: `Bearer ${FUND_API_KEY}` } : undefined,
    timeout: 20000,
  });

  const raw = res.data;
  return raw.map((r: any) => ({
    schemeCode: String(r.schemeCode || r.id || r.code),
    name: r.name,
    category: r.category,
    isActive: r.isActive !== undefined ? Boolean(r.isActive) : true,
    nav: r.nav !== undefined ? Number(r.nav) : undefined,
    navDate: r.navDate ? String(r.navDate) : undefined,
    navHistory: Array.isArray(r.navHistory) ? r.navHistory.map((n: any) => ({ date: n.date, nav: n.nav })) : [],
  }));
}
