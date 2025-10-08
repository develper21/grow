import dayjs, { Dayjs } from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"; // Import the necessary plugin

// Extend dayjs with the isSameOrBefore plugin
dayjs.extend(isSameOrBefore);

export interface SipResult {
  totalInvested: number;
  totalUnits: number;
  currentValue: number;
  absoluteReturn: number;
  annualizedReturn: number;
  growthOverTime: { date: string; value: number }[];
}

/**
 * Finds the Net Asset Value (NAV) entry for a given SIP date.
 * It looks for an NAV entry whose date is on or before the SIP date.
 * @param navHistory - Sorted NAV history (oldest to newest).
 * @param sipDate - The date of the SIP installment.
 * @returns The NAV entry or null if not found.
 */
function findNavEntry(
  navHistory: { date: string; nav: number }[],
  sipDate: Dayjs
): { date: string; nav: number } | null {
  // Since navHistory is sorted oldest-to-newest, we iterate backwards
  // to find the NAV entry on or immediately before the sipDate.
  for (let i = navHistory.length - 1; i >= 0; i--) {
    const navEntryDate = dayjs(navHistory[i].date);
    // Use isSameOrBefore for robustness
    if (navEntryDate.isSameOrBefore(sipDate, "day")) { 
      return navHistory[i];
    }
  }
  return null;
}

/**
 * Calculates the SIP returns based on NAV history.
 * @param navHistory - List of NAV history entries.
 * @param amount - The fixed SIP installment amount.
 * @param frequency - "monthly" or "quarterly".
 * @param from - Start date of the SIP (YYYY-MM-DD).
 * @param to - End date of the SIP (YYYY-MM-DD).
 * @returns An object containing the SIP results.
 */
export function calculateSIP(
  navHistory: { date: string; nav: number }[],
  amount: number,
  frequency: "monthly" | "quarterly",
  from: string,
  to: string
): SipResult {
  // 1. Sort NAV history from OLDEST to NEWEST
  // This is crucial for findNavEntry and getting the latest NAV.
  navHistory.sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());

  const startDate = dayjs(from).startOf("day");
  const endDate = dayjs(to).startOf("day"); // Ensure comparison is apples-to-apples
  const growthOverTime: { date: string; value: number }[] = [];

  let totalUnits = 0;
  let totalInvested = 0;
  
  let sipDate = startDate;

  // The SIP investment loop
  while (sipDate.isSameOrBefore(endDate, "day")) {
    // Find NAV for the SIP date or nearest earlier date
    const navEntry = findNavEntry(navHistory, sipDate);

    if (navEntry && navEntry.nav > 0) {
      const units = amount / navEntry.nav;
      totalUnits += units;
      totalInvested += amount;
      
      // Calculate the current value using the NAV used for this SIP installment.
      // The value at the point of investment is totalUnits * navEntry.nav
      // The NAV is effectively "locked in" for this transaction date.
      const currentValueAtSipDate = totalUnits * navEntry.nav;

      growthOverTime.push({
        date: sipDate.format("YYYY-MM-DD"),
        value: currentValueAtSipDate,
      });
    }

    // Determine the next SIP date
    const nextSipDate = frequency === "monthly" 
        ? sipDate.add(1, "month") 
        : sipDate.add(3, "month");

    // Important: Move to the next date for the loop.
    sipDate = nextSipDate;
  }

  // 2. Final Value Calculation: Use the absolute latest NAV available
  // The latest NAV is the last entry in the sorted array.
  const latestNavEntry = navHistory[navHistory.length - 1];
  const latestNav = latestNavEntry?.nav || 0; 

  const currentValue = totalUnits * latestNav;
  
  // Guard against division by zero
  const absoluteReturn = totalInvested > 0 
    ? ((currentValue - totalInvested) / totalInvested) * 100 
    : 0;

  // Calculate investment period in years.
  const years = endDate.diff(startDate, "year", true);
  
  // Calculate Compound Annual Growth Rate (CAGR)
  // This is the standard simplified annualized return for a single lump-sum-like period.
  const annualizedReturn = 
    years > 0 && totalInvested > 0 && currentValue > 0 // Ensure positive values for math.pow
      ? (Math.pow(currentValue / totalInvested, 1 / years) - 1) * 100 
      : 0;

  // Final `growthOverTime` correction: The last point should reflect the final calculated value
  if (growthOverTime.length > 0) {
    // Find the latest investment date
    const lastInvestmentDate = dayjs(growthOverTime[growthOverTime.length - 1].date);
    
    // If the latest NAV date is *after* the last investment, 
    // we need to add a final point to show the final value.
    if (latestNavEntry && dayjs(latestNavEntry.date).isAfter(lastInvestmentDate, 'day')) {
        growthOverTime.push({
            date: latestNavEntry.date,
            value: currentValue,
        });
    } else if (latestNavEntry) {
        // If the latest NAV date is the same as the last investment date,
        // we should ensure the final calculated currentValue is reflected.
        growthOverTime[growthOverTime.length - 1].value = currentValue;
    }
  }


  return {
    totalInvested: parseFloat(totalInvested.toFixed(2)),
    totalUnits: totalUnits,
    currentValue: parseFloat(currentValue.toFixed(2)),
    absoluteReturn: parseFloat(absoluteReturn.toFixed(2)),
    annualizedReturn: parseFloat(annualizedReturn.toFixed(2)),
    growthOverTime,
  };
}