// src/app/api/scheme/[code]/route.ts
import { NextResponse } from "next/server";
import { getScheme } from "@/lib/api";

interface Params {
  params: { code: string };
}

export async function GET(req: Request, { params }: Params) {
  try {
    const { code } = params;
    const scheme = await getScheme(code);

    // Transform NAV history: keep only date + nav as number
    const navHistory = scheme.data.map((d: any) => ({
      date: d.date,
      nav: parseFloat(d.nav),
    }));

    const response = {
      meta: {
        schemeCode: scheme.meta.scheme_code,
        schemeName: scheme.meta.scheme_name,
        fundHouse: scheme.meta.fund_house,
        category: scheme.meta.scheme_category,
        plan: scheme.meta.plan,
        isin: scheme.meta.isin_growth,
      },
      navHistory,
    };

    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
