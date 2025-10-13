// pages/api/funds/update.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    // For development: simulate fund update without MongoDB
    console.log("Funds update triggered (development mode)");

    // Simulate processing some funds
    const mockUpdated = Math.floor(Math.random() * 50) + 10;

    return res.status(200).json({
      updated: mockUpdated,
      message: "Funds update completed (development mode)"
    });
  } catch (err: any) {
    console.error("funds.update error", err?.message || err);
    return res.status(500).json({ error: err?.message || String(err) });
  }
}
