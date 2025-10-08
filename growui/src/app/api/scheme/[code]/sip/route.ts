// src/app/api/scheme/[code]/sip/route.ts
import { NextResponse } from "next/server";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

// --- TYPE DEFINITIONS ---
interface NavData {
    date: string;
    nav: number;
    parsedDate: dayjs.Dayjs;
}

interface Cashflow {
    amount: number;
    date: dayjs.Dayjs;
}

/**
 * Calculates XIRR for accurate annualized returns.
 */
function calculateXIRR(cashflows: Cashflow[]): number {
    if (cashflows.length < 2) return 0;

    const maxIterations = 100;
    const tolerance = 1e-7;
    let guess = 0.1;

    for (let i = 0; i < maxIterations; i++) {
        let npv = 0;
        let derivative = 0;
        const firstDate = cashflows[0].date;

        for (const cf of cashflows) {
            const days = cf.date.diff(firstDate, 'day');
            const exponent = days / 365.0;
            npv += cf.amount / Math.pow(1 + guess, exponent);
            if (guess > -1) { // Avoid issues with negative guess
                derivative += -exponent * cf.amount / Math.pow(1 + guess, exponent + 1);
            }
        }

        if (Math.abs(npv) < tolerance) {
            return guess; // Return as a factor
        }

        if (derivative === 0) break;
        guess = guess - npv / derivative;
    }

    return 0;
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
 * Calculates SIP returns with precision for charting.
 */
function calculateSIP(navHistory: NavData[], amount: number, from: string, to: string) {
    const sortedHistory = navHistory.sort((a, b) => a.parsedDate.unix() - b.parsedDate.unix());

    if (sortedHistory.length < 1) {
        return { totalInvested: 0, currentValue: 0, absoluteReturn: 0, annualizedReturn: 0, growthOverTime: [] };
    }

    const startDate = dayjs(from);
    const endDate = dayjs(to);

    const relevantNavHistory = sortedHistory.filter(
        d => d.parsedDate.isSameOrAfter(startDate, 'day') && d.parsedDate.isSameOrBefore(endDate, 'day')
    );
    
    if (relevantNavHistory.length === 0) {
        return { totalInvested: 0, currentValue: 0, absoluteReturn: 0, annualizedReturn: 0, growthOverTime: [] };
    }

    let totalUnits = 0;
    let cumulativeInvestment = 0;
    let nextSipDate = startDate;
    const investments: Cashflow[] = [];
    const growthOverTime: { date: string; value: number; investment: number }[] = [];

    for (const navEntry of relevantNavHistory) {
        const currentDate = navEntry.parsedDate;

        // **THE FIX IS HERE**: Changed isSameOrBefore to isBefore to exclude the end date from new investments
        while (nextSipDate.isSameOrBefore(currentDate, 'day') && nextSipDate.isBefore(endDate, 'day')) {
            const sipNavEntry = findNavForDate(sortedHistory, nextSipDate);
            if (sipNavEntry) {
                totalUnits += amount / sipNavEntry.nav;
                cumulativeInvestment += amount;
                investments.push({ amount: -amount, date: sipNavEntry.parsedDate });
            }
            nextSipDate = nextSipDate.add(1, 'month');
        }

        growthOverTime.push({
            date: currentDate.format('YYYY-MM-DD'),
            value: parseFloat((totalUnits * navEntry.nav).toFixed(2)),
            investment: cumulativeInvestment
        });
    }

    const finalValue = growthOverTime.length > 0 ? growthOverTime[growthOverTime.length - 1].value : 0;
    const totalInvested = cumulativeInvestment;

    if (totalInvested === 0) {
        return { totalInvested: 0, currentValue: 0, absoluteReturn: 0, annualizedReturn: 0, growthOverTime: [] };
    }
    
    // Ensure final valuation cashflow is added for XIRR
    if (investments.length > 0) {
        investments.push({ amount: finalValue, date: endDate });
    }

    const absoluteReturn = (finalValue - totalInvested) / totalInvested;
    const annualizedReturn = calculateXIRR(investments);
    
    return {
        totalInvested,
        currentValue: finalValue,
        absoluteReturn,
        annualizedReturn,
        growthOverTime,
    };
}


// --- API Handler ---
export async function POST(req: Request) {
    try {
        const { amount, from, to } = await req.json();
        const codeMatch = req.url.match(/\/scheme\/(\d+)\/sip/);
        const code = codeMatch ? codeMatch[1] : null;

        if (!code) return NextResponse.json({ error: "Missing scheme code." }, { status: 400 });
        if (!amount || !from || !to) return NextResponse.json({ error: "Missing required fields." }, { status: 400 });

        const res = await fetch(`https://api.mfapi.in/mf/${code}`);
        if (!res.ok) return NextResponse.json({ error: "Failed to fetch scheme data from provider." }, { status: 502 });

        const data = await res.json();
        if (!data.data || data.data.length === 0) return NextResponse.json({ error: "No NAV history found for this fund." }, { status: 404 });

        const navHistory: NavData[] = data.data.map((entry: any) => ({
            date: entry.date,
            nav: parseFloat(entry.nav),
            parsedDate: dayjs(entry.date, "DD-MM-YYYY")
        })).filter((d: NavData) => d.parsedDate.isValid() && d.nav > 0);

        const result = calculateSIP(navHistory, amount, from, to);
        
        return NextResponse.json({
            ...result,
            absoluteReturn: result.absoluteReturn * 100,
            annualizedReturn: result.annualizedReturn * 100
        });

    } catch (error) {
        console.error("Error in SIP calculation:", error);
        return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
    }
}