// src/lib/swpCalculator.ts

export interface SWPInput {
    totalInvestment: number;
    monthlyWithdrawal: number;
    annualReturnRate: number; // As a percentage, e.g., 12 for 12%
    durationInYears: number;
  }
  
  export interface SWPYearlyBreakdown {
    year: number;
    openingBalance: number;
    interestEarned: number;
    totalWithdrawal: number;
    closingBalance: number;
  }
  
  export interface SWPResult {
    totalInvestment: number;
    totalWithdrawal: number;
    finalValue: number;
    breakdown: SWPYearlyBreakdown[];
  }
  
  /**
   * Calculates the outcome of a Systematic Withdrawal Plan (SWP).
   * @param input - The SWP parameters.
   * @returns The calculated results including yearly breakdown.
   */
  export function calculateSWP(input: SWPInput): SWPResult {
    const { totalInvestment, monthlyWithdrawal, annualReturnRate, durationInYears } = input;
  
    const monthlyReturnRate = (annualReturnRate / 100) / 12;
    const totalMonths = durationInYears * 12;
  
    let currentBalance = totalInvestment;
    let totalWithdrawn = 0;
    const yearlyBreakdown: SWPYearlyBreakdown[] = [];
  
    for (let year = 1; year <= durationInYears; year++) {
      const openingBalance = currentBalance;
      let interestThisYear = 0;
      let withdrawalThisYear = 0;
  
      for (let month = 1; month <= 12; month++) {
        const interestEarned = currentBalance * monthlyReturnRate;
        interestThisYear += interestEarned;
        currentBalance += interestEarned;
        
        // Ensure we don't withdraw more than the available balance
        const actualWithdrawal = Math.min(currentBalance, monthlyWithdrawal);
        currentBalance -= actualWithdrawal;
        withdrawalThisYear += actualWithdrawal;
  
        // Stop if the balance is depleted
        if (currentBalance <= 0) break;
      }
  
      yearlyBreakdown.push({
        year,
        openingBalance,
        interestEarned: interestThisYear,
        totalWithdrawal: withdrawalThisYear,
        closingBalance: currentBalance,
      });
      
      totalWithdrawn += withdrawalThisYear;
      if (currentBalance <= 0) break;
    }
  
    return {
      totalInvestment: totalInvestment,
      totalWithdrawal: totalWithdrawn,
      finalValue: currentBalance > 0 ? currentBalance : 0,
      breakdown: yearlyBreakdown,
    };
  }