// src/app/api/scheme/[code]/step-up-sip/route.ts
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
            if (guess > -1) {
                derivative += -exponent * cf.amount / Math.pow(1 + guess, exponent + 1);
            }
        }

        if (Math.abs(npv) < tolerance) return guess;
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
 * Calculates Step-up SIP returns.
 */
function calculateStepUpSIP(
    navHistory: NavData[],
    initialAmount: number,
    from: string,
    to: string,
    stepUpPercentage: number
) {
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
    let currentSipAmount = initialAmount;
    let nextSipDate = startDate;
    let nextStepUpDate = startDate.add(1, 'year');
    const investments: Cashflow[] = [];
    const growthOverTime: { date: string; value: number; investment: number }[] = [];

    for (const navEntry of relevantNavHistory) {
        const currentDate = navEntry.parsedDate;

        while (nextSipDate.isSameOrBefore(currentDate, 'day') && nextSipDate.isBefore(endDate, 'day')) {
            // Check if it's time to step up the SIP amount
            if (nextSipDate.isSameOrAfter(nextStepUpDate, 'day')) {
                currentSipAmount *= (1 + stepUpPercentage / 100);
                nextStepUpDate = nextStepUpDate.add(1, 'year');
            }

            const sipNavEntry = findNavForDate(sortedHistory, nextSipDate);
            if (sipNavEntry) {
                totalUnits += currentSipAmount / sipNavEntry.nav;
                cumulativeInvestment += currentSipAmount;
                investments.push({ amount: -currentSipAmount, date: sipNavEntry.parsedDate });
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
        const { initialAmount, from, to, stepUpPercentage } = await req.json();
        const codeMatch = req.url.match(/\/scheme\/(\d+)\/step-up-sip/);
        const code = codeMatch ? codeMatch[1] : null;

        if (!code) return NextResponse.json({ error: "Missing scheme code." }, { status: 400 });
        if (!initialAmount || !from || !to || stepUpPercentage === undefined) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }

        const res = await fetch(`https://api.mfapi.in/mf/${code}`);
        if (!res.ok) return NextResponse.json({ error: "Failed to fetch scheme data." }, { status: 502 });

        const data = await res.json();
        if (!data.data || data.data.length === 0) return NextResponse.json({ error: "No NAV history found." }, { status: 404 });

        const navHistory: NavData[] = data.data.map((entry: any) => ({
            date: entry.date,
            nav: parseFloat(entry.nav),
            parsedDate: dayjs(entry.date, "DD-MM-YYYY")
        })).filter((d: NavData) => d.parsedDate.isValid() && d.nav > 0);

        const result = calculateStepUpSIP(navHistory, initialAmount, from, to, stepUpPercentage);
        
        return NextResponse.json({
            ...result,
            absoluteReturn: result.absoluteReturn * 100,
            annualizedReturn: result.annualizedReturn * 100
        });

    } catch (error) {
        console.error("Error in Step-up SIP calculation:", error);
        return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
    }
}