import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Fund from "@/models/Fund";

export async function GET(req: Request, { params }: any) {
  await connectToDatabase();
  const id = params.id;
  const fund = await Fund.findOne({ externalId: id, active: true }).lean();
  if (!fund) return NextResponse.json({ error: "Not found or inactive" }, { status: 404 });
  return NextResponse.json(fund);
}
