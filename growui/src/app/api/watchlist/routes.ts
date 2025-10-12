import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Watchlist from "@/models/Watchlist";
import Fund from "@/models/Fund";
import { computePercentageChanges } from "@/lib/perf";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, externalFundId, note } = body;
  if (!userId || !externalFundId) {
    return NextResponse.json({ error: "Missing" }, { status: 400 });
  }
  await connectToDatabase();

  // ensure fund exists & active
  const fund = await Fund.findOne({ externalId: externalFundId, active: true });
  if (!fund) return NextResponse.json({ error: "Fund not active or not found" }, { status: 404 });

  const existing = await Watchlist.findOne({ userId, externalFundId });
  if (existing) return NextResponse.json({ ok: true, message: "Already in watchlist" });

  await Watchlist.create({ userId, externalFundId, note });
  return NextResponse.json({ ok: true });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  await connectToDatabase();

  const list = await Watchlist.find({ userId }).lean();
  const fundIds = list.map((l) => l.externalFundId);
  const funds = await Fund.find({ externalId: { $in: fundIds } }).lean();

  // map
  const fundMap = new Map(funds.map((f) => [f.externalId, f]));
  const results = list.map((l) => {
    const f = fundMap.get(l.externalFundId);
    const perf = f ? computePercentageChanges(f.navHistory || []) : null;
    return {
      id: l._id,
      externalFundId: l.externalFundId,
      note: l.note,
      fund: f ? { name: f.name, latestNav: f.latestNav, latestNavDate: f.latestNavDate } : null,
      performance: perf,
      createdAt: l.createdAt,
    };
  });

  return NextResponse.json({ data: results });
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { userId, externalFundId } = body;
  if (!userId || !externalFundId) return NextResponse.json({ error: "Missing" }, { status: 400 });
  await connectToDatabase();
  await Watchlist.deleteOne({ userId, externalFundId });
  return NextResponse.json({ ok: true });
}
