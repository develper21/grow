export type Period = "1d" | "1m" | "3m" | "6m" | "1y";
export function computePercentageChanges(navHistory: { date: string; nav: number }[]) {
  if (!navHistory || navHistory.length === 0) return null;

  const toMap = new Map(navHistory.map((p) => [p.date, p.nav]));
  const arr = navHistory.slice().sort((a, b) => a.date.localeCompare(b.date));
  const latest = arr[arr.length - 1];
  const latestDate = new Date(latest.date);

  function findNavBefore(date: Date) {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (new Date(arr[i].date) <= date) return arr[i].nav;
    }
    return null;
  }

  const periods: { key: Period; days: number }[] = [
    { key: "1d", days: 1 },
    { key: "1m", days: 30 },
    { key: "3m", days: 90 },
    { key: "6m", days: 180 },
    { key: "1y", days: 365 },
  ];

  const result: Record<Period, number | null> = {
    "1d": null,
    "1m": null,
    "3m": null,
    "6m": null,
    "1y": null,
  };

  for (const p of periods) {
    const target = new Date(latestDate);
    target.setDate(target.getDate() - p.days);
    const navBefore = findNavBefore(target);
    if (navBefore && navBefore > 0) {
      const change = ((latest.nav - navBefore) / navBefore) * 100;
      result[p.key] = Number(change.toFixed(2));
    } else {
      result[p.key] = null;
    }
  }

  return {
    latestDate: latest.date,
    latestNav: latest.nav,
    changes: result,
  };
}
