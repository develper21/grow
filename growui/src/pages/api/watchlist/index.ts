import type { NextApiRequest, NextApiResponse } from "next";

const watchlistStorage = new Map<string, Set<string>>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === "GET") {
    const userId = String(req.query.userId || "");
    if (!userId) return res.status(400).json({ error: "userId required" });

    const schemeCodes = watchlistStorage.get(userId) || new Set<string>();
    const response = Array.from(schemeCodes).map((schemeCode) => ({
      item: {
        userId,
        schemeCode,
        addedAt: new Date().toISOString(),
        note: undefined,
      },
      fund: {
        schemeCode,
        name: `Fund ${schemeCode}`,
        currentNAV: 100 + Math.random() * 50,
        currentNAVDate: new Date().toISOString(),
      },
      perf: {
        day: (Math.random() - 0.5) * 10,
        month: (Math.random() - 0.5) * 20,
        "3m": (Math.random() - 0.5) * 30,
        "6m": (Math.random() - 0.5) * 40,
        "1y": (Math.random() - 0.5) * 50,
      },
    }));

    return res.status(200).json({ data: response });
  }

  if (req.method === "POST") {
    const { userId, schemeCode, note } = req.body;
    if (!userId || !schemeCode) return res.status(400).json({ error: "userId and schemeCode required" });

    if (!watchlistStorage.has(userId)) {
      watchlistStorage.set(userId, new Set<string>());
    }
    watchlistStorage.get(userId)!.add(schemeCode);

    return res.status(200).json({ ok: true });
  }

  if (req.method === "DELETE") {
    const { userId, schemeCode } = req.body;
    if (!userId || !schemeCode) return res.status(400).json({ error: "userId and schemeCode required" });

    if (watchlistStorage.has(userId)) {
      watchlistStorage.get(userId)!.delete(schemeCode);
    }

    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
