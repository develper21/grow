import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Fund from "@/models/Fund";

export async function GET(req: Request) {
  await connectToDatabase();
  const url = new URL(req.url);
  const search = url.searchParams.get("search") || "";
  const page = Number(url.searchParams.get("page") || 1);
  const limit = Math.min(Number(url.searchParams.get("limit") || 50), 200);

  const filter: any = { active: true };
  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  const total = await Fund.countDocuments(filter);
  const funds = await Fund.find(filter)
    .sort({ name: 1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return NextResponse.json({ total, page, limit, data: funds });
}
