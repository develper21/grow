import cron from "node-cron";
import { connectToDatabase } from "@/lib/mongodb";
import Fund, { IFund } from "@/models/Fund";

type ProviderFund = {
  id: string;
  name: string;
  schemeCode?: string;
  category?: string;
  categoryName?: string;
  [key: string]: any;
};

type NavResponse = {
  date: string;
  nav: number;
};

const NAV_API_BASE = process.env.NAV_API_BASE;
const NAV_API_KEY = process.env.NAV_API_KEY;
const CRON_ENABLED = process.env.CRON_ENABLED === "true";
const CRON_TIME = process.env.CRON_TIME || "0 0 7 * * *";

async function fetchAllFundsFromProvider(): Promise<ProviderFund[]> {
  if (!NAV_API_BASE || !NAV_API_KEY) throw new Error("NAV provider config missing");
  const res = await fetch(`${NAV_API_BASE}/funds`, {
    headers: { Authorization: `Bearer ${NAV_API_KEY}` },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch funds list: ${res.status} ${res.statusText} ${text}`);
  }

  const json = (await res.json()) as unknown;
  if (Array.isArray(json)) {
    return json as ProviderFund[];
  }

  if (json && typeof json === "object" && "data" in (json as any) && Array.isArray((json as any).data)) {
    return (json as any).data as ProviderFund[];
  }

  throw new Error("Unexpected funds list format from provider");
}

async function fetchNavForFund(externalId: string): Promise<NavResponse | null> {
  if (!NAV_API_BASE || !NAV_API_KEY) throw new Error("NAV provider config missing");
  const url = `${NAV_API_BASE}/funds/${encodeURIComponent(externalId)}/nav`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${NAV_API_KEY}` },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    const text = await res.text().catch(() => "");
    console.warn(`Failed to fetch NAV for ${externalId}: ${res.status} ${res.statusText} ${text}`);
    return null;
  }

  const json = (await res.json()) as unknown;
  const candidate = (json && typeof json === "object" && "data" in (json as any))
    ? (json as any).data
    : json;

  if (!candidate || typeof candidate !== "object") return null;
  const { date, nav } = candidate as Partial<NavResponse>;

  if (!date || typeof nav !== "number") return null;
  return { date, nav };
}

export async function runOnce() {
  if (!NAV_API_BASE || !NAV_API_KEY) {
    console.error("NAV API config missing; skipping update");
    return;
  }

  await connectToDatabase();
  console.log("Connected to DB — starting funds update...");

  let fundsList: ProviderFund[] = [];
  try {
    fundsList = await fetchAllFundsFromProvider();
  } catch (err) {
    console.error("Failed to fetch funds list:", err);
    return;
  }

  const todayStr = new Date().toISOString().slice(0, 10);
  const externalIdsSeen: string[] = [];

  for (const f of fundsList) {
    const externalId = String(f.id);
    externalIdsSeen.push(externalId);

    try {
      const navData = await fetchNavForFund(externalId);

      let latestNav: number | undefined = undefined;
      let latestNavDate: string | undefined = undefined;
      let active = false;

      if (navData && navData.date) {
        latestNav = Number(navData.nav);
        latestNavDate = navData.date;
        active = typeof navData.nav === "number" && !Number.isNaN(navData.nav);
      }

      let fundDoc = (await Fund.findOne({ externalId })) as IFund | null;

      if (!fundDoc) {
        const initialNavHistory = latestNavDate && latestNav ? [{ date: latestNavDate, nav: latestNav }] : [];
        fundDoc = await Fund.create({
          externalId,
          name: f.name || externalId,
          category: f.category || f.categoryName || null,
          schemeCode: f.schemeCode || null,
          active,
          latestNav,
          latestNavDate,
          navHistory: initialNavHistory,
          metadata: f,
        });
        console.log(`Created fund ${externalId} / ${f.name}`);
      } else {
        fundDoc.name = f.name || fundDoc.name;
        fundDoc.category = f.category || f.categoryName || fundDoc.category;
        fundDoc.schemeCode = f.schemeCode || fundDoc.schemeCode;
        fundDoc.active = active;
        if (latestNavDate && latestNav) {
          const last = fundDoc.navHistory && fundDoc.navHistory.length ? fundDoc.navHistory[fundDoc.navHistory.length - 1] : null;
          if (!last || last.date !== latestNavDate) {
            fundDoc.navHistory = fundDoc.navHistory.concat([{ date: latestNavDate, nav: latestNav }]);
          } else {
            last.nav = latestNav;
            fundDoc.navHistory[fundDoc.navHistory.length - 1] = last;
          }

          if (fundDoc.navHistory.length > 1000) {
            fundDoc.navHistory = fundDoc.navHistory.slice(-800);
          }

          fundDoc.latestNav = latestNav;
          fundDoc.latestNavDate = latestNavDate;
        }

        fundDoc.metadata = { ...fundDoc.metadata, ...f };
        await fundDoc.save();
        console.log(`Updated fund ${externalId} / ${f.name}`);
      }
    } catch (err) {
      console.error(`Failed to update fund ${f.id}:`, err);
    }
  }

  try {
    await Fund.updateMany({ externalId: { $nin: externalIdsSeen } }, { $set: { active: false } });
    console.log("Marked missing funds inactive (if any).");
  } catch (err) {
    console.warn("Failed to mark missing funds inactive:", err);
  }

  console.log("Funds update run complete.");
}

if (CRON_ENABLED) {
  cron.schedule(CRON_TIME, () => {
    console.log("Running scheduled funds update:", new Date().toISOString());
    runOnce().catch((e) => console.error("Cron update failed:", e));
  }, { timezone: "Asia/Kolkata" });
}

if (require.main === module) {
  runOnce().catch((e) => {
    console.error("runOnce error:", e);
    process.exit(1);
  });
}
