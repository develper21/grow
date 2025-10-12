import dayjs, { Dayjs } from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrBefore);

export interface SipResult {
  totalInvested: number;
  totalUnits: number;
  currentValue: number;
  absoluteReturn: number;
  annualizedReturn: number;
  growthOverTime: { date: string; value: number }[];
}

function findNavEntry(
  navHistory: { date: string; nav: number }[],
  sipDate: Dayjs
): { date: string; nav: number } | null {
  for (let i = navHistory.length - 1; i >= 0; i--) {
    const navEntryDate = dayjs(navHistory[i].date);
    if (navEntryDate.isSameOrBefore(sipDate, "day")) { 
      return navHistory[i];
    }
  }
  return null;
}

export function calculateSIP(
  navHistory: { date: string; nav: number }[],
  amount: number,
  frequency: "monthly" | "quarterly",
  from: string,
  to: string
): SipResult {
  navHistory.sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());

  const startDate = dayjs(from).startOf("day");
  const endDate = dayjs(to).startOf("day"); 
  const growthOverTime: { date: string; value: number }[] = [];

  let totalUnits = 0;
  let totalInvested = 0;
  
  let sipDate = startDate;

  while (sipDate.isSameOrBefore(endDate, "day")) {
    const navEntry = findNavEntry(navHistory, sipDate);

    if (navEntry && navEntry.nav > 0) {
      const units = amount / navEntry.nav;
      totalUnits += units;
      totalInvested += amount;
      
      const currentValueAtSipDate = totalUnits * navEntry.nav;

      growthOverTime.push({
        date: sipDate.format("YYYY-MM-DD"),
        value: currentValueAtSipDate,
      });
    }

    const nextSipDate = frequency === "monthly" 
        ? sipDate.add(1, "month") 
        : sipDate.add(3, "month");

    sipDate = nextSipDate;
  }

  const latestNavEntry = navHistory[navHistory.length - 1];
  const latestNav = latestNavEntry?.nav || 0; 
  const currentValue = totalUnits * latestNav;
  
  const absoluteReturn = totalInvested > 0 
    ? ((currentValue - totalInvested) / totalInvested) * 100 
    : 0;

  const years = endDate.diff(startDate, "year", true);
  
  const annualizedReturn = 
    years > 0 && totalInvested > 0 && currentValue > 0
      ? (Math.pow(currentValue / totalInvested, 1 / years) - 1) * 100 
      : 0;

  if (growthOverTime.length > 0) {
    const lastInvestmentDate = dayjs(growthOverTime[growthOverTime.length - 1].date);
    
    if (latestNavEntry && dayjs(latestNavEntry.date).isAfter(lastInvestmentDate, 'day')) {
        growthOverTime.push({
            date: latestNavEntry.date,
            value: currentValue,
        });
    } else if (latestNavEntry) {
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