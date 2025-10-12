import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import VirtualPortfolio from "@/models/VirtualPortfolio";
import Fund, { IFund } from "@/models/Fund";
import { computePercentageChanges } from "@/lib/perf";

type NavPoint = { date: string; nav: number };

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, externalFundId, sipAmount, startDate, frequency } = body;

  if (!userId || !externalFundId || !sipAmount || !startDate) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await connectToDatabase();

  const fund = (await Fund.findOne({
    externalId: externalFundId,
    active: true,
  }).lean()) as IFund | null;

  if (!fund) {
    return NextResponse.json({ error: "Fund not found or inactive" }, { status: 404 });
  }

  const navHistory = (fund.navHistory || []).slice().sort((a: NavPoint, b: NavPoint) =>
    a.date.localeCompare(b.date)
  );

  const start = new Date(startDate);
  const latestDate = navHistory.length ? new Date(navHistory[navHistory.length - 1].date) : new Date();

  const transactions: { date: string; amount: number; units: number }[] = [];

  if (frequency === "monthly" || !frequency) {
    const cur = new Date(start);

    while (cur <= latestDate) {
      let navPoint: NavPoint | null = null;

      for (let i = navHistory.length - 1; i >= 0; i--) {
        const candidate = navHistory[i];
        if (new Date(candidate.date) <= cur) {
          navPoint = candidate;
          break;
        }
      }

      if (navPoint && navPoint.nav > 0) {
        const units = Number((sipAmount / navPoint.nav).toFixed(6));
        transactions.push({ date: navPoint.date, amount: sipAmount, units });
      }

      const next = new Date(cur);
      next.setMonth(next.getMonth() + 1);
      cur.setTime(next.getTime());
    }
  }

  const portfolio = await VirtualPortfolio.create({
    userId,
    externalFundId,
    sipAmount,
    startDate,
    frequency: frequency || "monthly",
    transactions,
  });

  return NextResponse.json({ ok: true, portfolio });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  await connectToDatabase();

  const list = await VirtualPortfolio.find({ userId }).lean();
  const externalIds = list.map((l: any) => l.externalFundId);
  const funds = (await Fund.find({ externalId: { $in: externalIds } }).lean()) as unknown as IFund[];
  const fundMap = new Map<string, IFund>(funds.map((f) => [f.externalId, f]));
  const results = (list as any[]).map((p) => {
    const fund = fundMap.get(p.externalFundId);
    const latestNav = fund?.latestNav || 0;

    const totalUnits = (p.transactions || []).reduce(
      (s: number, t: { units: number }) => s + (t.units || 0),
      0
    );
    const invested = (p.transactions || []).reduce(
      (s: number, t: { amount: number }) => s + (t.amount || 0),
      0
    );

    const currentValue = totalUnits * latestNav;
    const gain = currentValue - invested;
    const gainPct = invested > 0 ? (gain / invested) * 100 : 0;
    const perf = fund ? computePercentageChanges(fund.navHistory || []) : null;

    return {
      ...p,
      fund: fund ? { name: fund.name, latestNav: fund.latestNav } : null,
      totalUnits: Number(totalUnits.toFixed(6)),
      invested: Number(invested.toFixed(2)),
      currentValue: Number(currentValue.toFixed(2)),
      gain: Number(gain.toFixed(2)),
      gainPct: Number(gainPct.toFixed(2)),
      performance: perf,
    };
  });

  return NextResponse.json({ data: results });
}
