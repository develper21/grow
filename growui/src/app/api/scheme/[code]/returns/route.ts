// src/app/api/scheme/[code]/returns/route.ts
import { NextResponse } from "next/server";
import { getScheme } from "@/lib/api";
import { parseISO, differenceInDays } from "date-fns";

interface Params {
  params: { code: string };
}

function calculateReturns(navHistory: { date: string; nav: number }[], from: string, to: string) {
  const start = navHistory.find((d) => d.date === from) || navHistory[navHistory.length - 1];
  const end = navHistory.find((d) => d.date === to) || navHistory[0];

  const startNAV = start.nav;
  const endNAV = end.nav;

  const simpleReturn = ((endNAV - startNAV) / startNAV) * 100;

  const days = differenceInDays(parseISO(to), parseISO(from));
  const annualizedReturn =
    days >= 30 ? (Math.pow(endNAV / startNAV, 365 / days) - 1) * 100 : null;

  return { startDate: from, endDate: to, startNAV, endNAV, simpleReturn, annualizedReturn };
}

export async function GET(req: Request, { params }: Params) {
  try {
    const { code } = params;
    const url = new URL(req.url);
    const period = url.searchParams.get("period");
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");

    const scheme = await getScheme(code);
    const navHistory = scheme.data.map((d: any) => ({
      date: d.date,
      nav: parseFloat(d.nav),
    }));

    let startDate: string, endDate: string;

    if (period) {
      const latest = parseISO(navHistory[0].date);
      switch (period) {
        case "1m":
          startDate = new Date(latest.setMonth(latest.getMonth() - 1)).toISOString().split("T")[0];
          break;
        case "3m":
          startDate = new Date(latest.setMonth(latest.getMonth() - 3)).toISOString().split("T")[0];
          break;
        case "6m":
          startDate = new Date(latest.setMonth(latest.getMonth() - 6)).toISOString().split("T")[0];
          break;
        case "1y":
          startDate = new Date(latest.setFullYear(latest.getFullYear() - 1)).toISOString().split("T")[0];
          break;
        default:
          throw new Error("Invalid period");
      }
      endDate = navHistory[0].date;
    } else if (from && to) {
      startDate = from;
      endDate = to;
    } else {
      throw new Error("Provide either period or from/to");
    }

    const result = calculateReturns(navHistory, startDate, endDate);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
