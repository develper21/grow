// src/app/api/scheme/[code]/rolling-return/route.ts
import { NextResponse } from "next/server";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface NavData {
    date: string;
    nav: number;
    parsedDate: dayjs.Dayjs;
}

interface RollingReturnPoint {
    date: string; // This will now be the START date of the period
    value: number;
}

/**
 * Calculates the Compound Annual Growth Rate (CAGR).
 */
function calculateCAGR(startValue: number, endValue: number, years: number): number {
    if (startValue <= 0 || years <= 0) return 0;
    return (Math.pow(endValue / startValue, 1 / years) - 1);
}

/**
 * Finds the first available NAV on or AFTER a given date.
 */
function findNavForDate(sortedNavHistory: NavData[], targetDate: dayjs.Dayjs): NavData | null {
    for (const entry of sortedNavHistory) {
        if (entry.parsedDate.isSameOrAfter(targetDate, 'day')) {
            return entry;
        }
    }
    return null; // Return null if no date is found
}

/**
 * Calculates rolling returns with the start date on the x-axis.
 */
function calculateRollingReturns(navHistory: NavData[], periodInYears: number, fundLaunchDate: dayjs.Dayjs) {
    const sortedHistory = navHistory.sort((a, b) => a.parsedDate.unix() - b.parsedDate.unix());

    if (sortedHistory.length < 2) {
        return { returns: [], average: 0, min: 0, max: 0, standardDeviation: 0 };
    }

    const returnsData: RollingReturnPoint[] = [];
    const returnsValues: number[] = [];
    
    // The last possible day someone could start an investment and have it run for the full period.
    const lastPossibleStartDate = sortedHistory[sortedHistory.length - 1].parsedDate.subtract(periodInYears, 'year');

    for (const startEntry of sortedHistory) {
        const startDate = startEntry.parsedDate;

        // Stop if the start date is too recent to form a full period
        if (startDate.isAfter(lastPossibleStartDate)) {
            break;
        }

        const targetEndDate = startDate.add(periodInYears, 'year');
        const endEntry = findNavForDate(sortedHistory, targetEndDate);

        if (endEntry) {
            const startNav = startEntry.nav;
            const endNav = endEntry.nav;

            // Use the exact period in years for CAGR for accuracy
            const actualYears = endEntry.parsedDate.diff(startDate, 'year', true);

            if (actualYears > 0) {
                 const cagr = calculateCAGR(startNav, endNav, actualYears);
                 returnsData.push({
                    date: startDate.format('YYYY-MM-DD'),
                    value: parseFloat((cagr * 100).toFixed(2)),
                });
                returnsValues.push(cagr);
            }
        }
    }

    if (returnsValues.length === 0) {
        return { returns: [], average: 0, min: 0, max: 0, standardDeviation: 0 };
    }
    
    const sum = returnsValues.reduce((a, b) => a + b, 0);
    const average = sum / returnsValues.length;
    const min = Math.min(...returnsValues);
    const max = Math.max(...returnsValues);

    const squareDiffs = returnsValues.map(value => Math.pow(value - average, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
    const standardDeviation = Math.sqrt(avgSquareDiff);

    return {
        returns: returnsData,
        average: parseFloat((average * 100).toFixed(2)),
        min: parseFloat((min * 100).toFixed(2)),
        max: parseFloat((max * 100).toFixed(2)),
        standardDeviation: parseFloat((standardDeviation * 100).toFixed(2)),
    };
}


// --- API Handler ---
export async function POST(req: Request) {
    try {
        const { periodInYears } = await req.json();
        const codeMatch = req.url.match(/\/scheme\/(\d+)\/rolling-return/);
        const code = codeMatch ? codeMatch[1] : null;

        if (!code) return NextResponse.json({ error: "Missing scheme code." }, { status: 400 });
        if (!periodInYears) return NextResponse.json({ error: "Missing `periodInYears`." }, { status: 400 });

        const res = await fetch(`https://api.mfapi.in/mf/${code}`);
        if (!res.ok) return NextResponse.json({ error: "Failed to fetch scheme data." }, { status: 502 });

        const data = await res.json();
        if (!data.data || data.data.length === 0) return NextResponse.json({ error: "No NAV history found." }, { status: 404 });
        
        // --- IMPORTANT: Filter NAV data to start from the Direct Plan launch date ---
        const directPlanLaunchDate = dayjs("2013-01-01");

        const navHistory: NavData[] = data.data.map((entry: any) => ({
            date: entry.date,
            nav: parseFloat(entry.nav),
            parsedDate: dayjs(entry.date, "DD-MM-YYYY")
        })).filter((d: NavData) => d.parsedDate.isValid() && d.nav > 0 && d.parsedDate.isSameOrAfter(directPlanLaunchDate));

        const result = calculateRollingReturns(navHistory, periodInYears, directPlanLaunchDate);
        return NextResponse.json(result);

    } catch (error: any) {
        console.error("Error in Rolling Return calculation:", error);
        return NextResponse.json({ error: error.message || "An internal server error occurred." }, { status: 500 });
    }
}