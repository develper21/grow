// src/app/api/scheme/[code]/lumpsum/route.ts
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

/**
 * Finds the first available NAV on or AFTER a given date.
 */
function findNavForDate(sortedNavHistory: NavData[], targetDate: dayjs.Dayjs): NavData | null {
    for (const entry of sortedNavHistory) {
        if (entry.parsedDate.isSameOrAfter(targetDate, 'day')) {
            return entry;
        }
    }
    return sortedNavHistory.length > 0 ? sortedNavHistory[sortedNavHistory.length - 1] : null;
}

/**
 * Calculates lumpsum investment returns.
 */
function calculateLumpSum(navHistory: NavData[], amount: number, from: string, to: string) {
    const sortedHistory = navHistory.sort((a, b) => a.parsedDate.unix() - b.parsedDate.unix());

    if (sortedHistory.length < 1) {
        return { totalInvested: 0, currentValue: 0, absoluteReturn: 0, cagr: 0, growthOverTime: [] };
    }

    const startDate = dayjs(from);
    const endDate = dayjs(to);

    const startNavEntry = findNavForDate(sortedHistory, startDate);

    if (!startNavEntry) {
        throw new Error("Could not find a valid starting NAV for the selected date.");
    }

    const unitsPurchased = amount / startNavEntry.nav;
    const totalInvested = amount;

    const endNavEntry = findNavForDate(sortedHistory, endDate);
     if (!endNavEntry) {
        throw new Error("Could not find a valid ending NAV for the selected date.");
    }
    
    const finalValue = unitsPurchased * endNavEntry.nav;

    const growthOverTime = sortedHistory
        .filter(entry => entry.parsedDate.isSameOrAfter(startNavEntry.parsedDate) && entry.parsedDate.isSameOrBefore(endNavEntry.parsedDate))
        .map(entry => ({
            date: entry.parsedDate.format('YYYY-MM-DD'),
            value: parseFloat((unitsPurchased * entry.nav).toFixed(2)),
        }));

    const lastChartDate = growthOverTime[growthOverTime.length - 1]?.date;
    if (lastChartDate !== endNavEntry.parsedDate.format('YYYY-MM-DD')) {
         growthOverTime.push({
            date: endNavEntry.parsedDate.format('YYYY-MM-DD'),
            value: parseFloat(finalValue.toFixed(2))
        });
    }

    const absoluteReturn = (finalValue - totalInvested) / totalInvested;

    const years = endDate.diff(startDate, 'year', true);
    let cagr = 0;
    if (years > 0 && totalInvested > 0 && finalValue > 0) {
        cagr = Math.pow(finalValue / totalInvested, 1 / years) - 1;
    }

    return {
        totalInvested: parseFloat(totalInvested.toFixed(2)),
        currentValue: parseFloat(finalValue.toFixed(2)),
        absoluteReturn: absoluteReturn * 100,
        cagr: cagr * 100,
        growthOverTime,
    };
}

// --- API Handler ---
export async function POST(req: Request) {
    try {
        const { amount, from, to } = await req.json();
        const codeMatch = req.url.match(/\/scheme\/(\d+)\/lumpsum/);
        const code = codeMatch ? codeMatch[1] : null;

        if (!code) return NextResponse.json({ error: "Missing scheme code." }, { status: 400 });
        if (!amount || !from || !to) return NextResponse.json({ error: "Missing required fields." }, { status: 400 });

        const res = await fetch(`https://api.mfapi.in/mf/${code}`);
        if (!res.ok) return NextResponse.json({ error: "Failed to fetch scheme data." }, { status: 502 });

        const data = await res.json();
        if (!data.data || data.data.length === 0) return NextResponse.json({ error: "No NAV history found." }, { status: 404 });

        const navHistory: NavData[] = data.data.map((entry: any) => ({
            date: entry.date,
            nav: parseFloat(entry.nav),
            parsedDate: dayjs(entry.date, "DD-MM-YYYY")
        })).filter((d: NavData) => d.parsedDate.isValid() && d.nav > 0);

        const result = calculateLumpSum(navHistory, amount, from, to);
        return NextResponse.json(result);

    } catch (error: any) {
        console.error("Error in Lumpsum calculation:", error);
        return NextResponse.json({ error: error.message || "An internal server error occurred." }, { status: 500 });
    }
}