// scripts/cron.ts
import cron from "node-cron";
import axios from "axios";

async function runUpdate() {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    console.log("Triggering funds update at", new Date().toISOString());
    const resp = await axios.post(`${base}/api/funds/update`, {}, {
      timeout: 300000, // 5 minutes timeout for large updates
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log("Funds update response:", resp.data);
  } catch (err) {
    console.error("cron update error:", (err as any)?.response?.data || (err as any)?.message || err);
  }
}

// Schedule: everyday at 07:00 server local time
cron.schedule("0 7 * * *", () => {
  console.log("Running scheduled funds update...");
  runUpdate();
});

console.log("Cron started — scheduled daily at 07:00 (server local time).");

// Optionally run once at startup (uncomment if needed for testing)
// runUpdate();
