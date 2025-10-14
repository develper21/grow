import type { NextApiRequest, NextApiResponse } from "next";

const portfolioStorage = new Map<string, any[]>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;

  if (method === "GET") {
    const userId = String(req.query.userId || "");
    if (!userId) return res.status(400).json({ error: "userId required" });

    const ports = portfolioStorage.get(userId) || [];
    const enriched = ports.map((p: any) => ({
      ...p,
      sips: p.sips.map((s: any) => ({
        ...s,
        currentNAV: 100 + Math.random() * 50,
      })),
    }));

    return res.status(200).json({ data: enriched });
  }

  if (method === "POST") {
    const { userId, name, cash } = req.body;
    if (!userId) return res.status(400).json({ error: "userId required" });

    const portfolioId = Date.now().toString();
    const portfolio = {
      _id: portfolioId,
      userId,
      name: name || "My Virtual Portfolio",
      cash: cash ?? 100000,
      sips: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!portfolioStorage.has(userId)) {
      portfolioStorage.set(userId, []);
    }
    portfolioStorage.get(userId)!.push(portfolio);

    return res.status(201).json({ data: portfolio });
  }

  if (method === "PUT") {
    const { id, action, payload } = req.body;
    if (!id || !action) return res.status(400).json({ error: "id and action required" });

    const userId = "default-user";
    const portfolios = portfolioStorage.get(userId) || [];
    const portIndex = portfolios.findIndex((p: any) => p._id === id);

    if (portIndex === -1) return res.status(404).json({ error: "portfolio not found" });

    const port = portfolios[portIndex];

    if (action === "add_sip") {
      port.sips.push({
        _id: Date.now().toString(),
        schemeCode: payload.schemeCode,
        amount: payload.amount,
        frequency: payload.frequency || "monthly",
        startDate: payload.startDate ? new Date(payload.startDate) : new Date(),
        active: true,
      });
    } else if (action === "remove_sip") {
      port.sips = port.sips.filter((s: any) => s._id !== payload.sipId);
    } else if (action === "toggle_sip") {
      const sip = port.sips.find((s: any) => s._id === payload.sipId);
      if (sip) sip.active = !sip.active;
    } else if (action === "update_cash") {
      port.cash = Number(payload.cash ?? port.cash);
    }

    port.updatedAt = new Date().toISOString();
    portfolios[portIndex] = port;

    return res.status(200).json({ data: port });
  }

  if (method === "DELETE") {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: "id required" });

    const userId = "default-user";
    const portfolios = portfolioStorage.get(userId) || [];
    const filteredPortfolios = portfolios.filter((p: any) => p._id !== id);
    portfolioStorage.set(userId, filteredPortfolios);

    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
