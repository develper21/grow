// src/app/api/scheme/[code]/step-up-swp/route.ts
import { NextResponse } from "next/server";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

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
 * Calculates historical Step-up SWP performance.
 */
function calculateStepUpSWP(
    navHistory: NavData[],
    initialInvestment: number,
    initialMonthlyWithdrawal: number,
    stepUpPercentage: number,
    from: string,
    to: string
) {
    const sortedHistory = navHistory.sort((a, b) => a.parsedDate.unix() - b.parsedDate.unix());

    if (sortedHistory.length < 1) {
        return { totalInvested: 0, totalWithdrawn: 0, finalValue: 0, growthOverTime: [], corpusRanOutDate: null };
    }

    const startDate = dayjs(from);
    const endDate = dayjs(to);

    const startNavEntry = findNavForDate(sortedHistory, startDate);
    if (!startNavEntry) {
        throw new Error("Could not find a valid starting NAV for the selected investment date.");
    }

    let currentUnits = initialInvestment / startNavEntry.nav;
    let totalWithdrawn = 0;
    let currentMonthlyWithdrawal = initialMonthlyWithdrawal;
    const growthOverTime: { date: string, value: number }[] = [];
    
    growthOverTime.push({ date: startDate.format('YYYY-MM-DD'), value: initialInvestment });

    let withdrawalDate = startDate.add(1, 'month');
    let nextStepUpDate = startDate.add(1, 'year');
    let corpusRanOutDate: string | null = null;

    while (withdrawalDate.isSameOrBefore(endDate)) {
        // Check if it's time to increase the withdrawal amount
        if (withdrawalDate.isSameOrAfter(nextStepUpDate, 'day')) {
            currentMonthlyWithdrawal *= (1 + stepUpPercentage / 100);
            nextStepUpDate = nextStepUpDate.add(1, 'year');
        }

        const navEntry = findNavForDate(sortedHistory, withdrawalDate);

        if (navEntry) {
            const currentValue = currentUnits * navEntry.nav;
            
            if (currentValue < currentMonthlyWithdrawal) {
                totalWithdrawn += currentValue;
                currentUnits = 0;
                corpusRanOutDate = withdrawalDate.format('YYYY-MM-DD');
            } else {
                const unitsToSell = currentMonthlyWithdrawal / navEntry.nav;
                currentUnits -= unitsToSell;
                totalWithdrawn += currentMonthlyWithdrawal;
            }
            
            growthOverTime.push({
                date: withdrawalDate.format('YYYY-MM-DD'),
                value: parseFloat((currentUnits * navEntry.nav).toFixed(2)),
            });
        }
        
        if (corpusRanOutDate) break;
        withdrawalDate = withdrawalDate.add(1, 'month');
    }

    const finalNavEntry = findNavForDate(sortedHistory, endDate) || sortedHistory[sortedHistory.length - 1];
    const finalValue = currentUnits * finalNavEntry.nav;

    return {
        totalInvested: initialInvestment,
        totalWithdrawn: parseFloat(totalWithdrawn.toFixed(2)),
        finalValue: parseFloat(finalValue.toFixed(2)),
        corpusRanOutDate,
        growthOverTime,
    };
}

export async function POST(req: Request) {
    try {
        const { initialInvestment, initialMonthlyWithdrawal, stepUpPercentage, from, to } = await req.json();
        const codeMatch = req.url.match(/\/scheme\/(\d+)\/step-up-swp/);
        const code = codeMatch ? codeMatch[1] : null;

        if (!code) return NextResponse.json({ error: "Missing scheme code." }, { status: 400 });
        if (!initialInvestment || !initialMonthlyWithdrawal || stepUpPercentage === undefined || !from || !to) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }

        const res = await fetch(`https://api.mfapi.in/mf/${code}`);
        if (!res.ok) return NextResponse.json({ error: "Failed to fetch scheme data." }, { status: 502 });

        const data = await res.json();
        if (!data.data || data.data.length === 0) return NextResponse.json({ error: "No NAV history found." }, { status: 404 });

        const navHistory: NavData[] = data.data
            .map((entry: any) => ({
                date: entry.date,
                nav: parseFloat(entry.nav),
                parsedDate: dayjs(entry.date, "DD-MM-YYYY")
            }))
            .filter((d: NavData) => d.parsedDate.isValid() && d.nav > 0);

        const result = calculateStepUpSWP(navHistory, initialInvestment, initialMonthlyWithdrawal, stepUpPercentage, from, to);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error in Step-up SWP calculation:", error);
        return NextResponse.json({ error: error.message || "An internal server error occurred." }, { status: 500 });
    }
}