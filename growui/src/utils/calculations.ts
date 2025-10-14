import { NAVData } from '@/types';

export function parseNAV(navString: string): number {
  const nav = parseFloat(navString);
  return isNaN(nav) || nav === 0 ? 0 : nav;
}

export function isValidNAV(navString: string): boolean {
  const nav = parseNAV(navString);
  return nav > 0;
}

export function findNAVForDate(
  navData: NAVData[],
  targetDate: Date
): NAVData | null {
  const sortedData = [...navData].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  for (const nav of sortedData) {
    const navDate = new Date(nav.date);
    if (navDate <= targetDate && isValidNAV(nav.nav)) {
      return nav;
    }
  }

  return null;
}

export function calculateSimpleReturn(startNAV: number, endNAV: number): number {
  if (startNAV === 0) return 0;
  return ((endNAV - startNAV) / startNAV) * 100;
}

export function calculateAnnualizedReturn(
  startNAV: number,
  endNAV: number,
  days: number
): number {
  if (startNAV === 0 || days < 30) return 0;
  const years = days / 365;
  return (Math.pow(endNAV / startNAV, 1 / years) - 1) * 100;
}

export function getDaysBetween(startDate: Date, endDate: Date): number {
  return Math.floor(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
}

export function getDateFromPeriod(period: string): Date {
  const now = new Date();
  const date = new Date(now);

  switch (period) {
    case '1m':
      date.setMonth(date.getMonth() - 1);
      break;
    case '3m':
      date.setMonth(date.getMonth() - 3);
      break;
    case '6m':
      date.setMonth(date.getMonth() - 6);
      break;
    case '1y':
      date.setFullYear(date.getFullYear() - 1);
      break;
    case '3y':
      date.setFullYear(date.getFullYear() - 3);
      break;
    case '5y':
      date.setFullYear(date.getFullYear() - 5);
      break;
    default:
      return now;
  }

  return date;
}

export function getNextSIPDate(
  currentDate: Date,
  frequency: 'monthly' | 'weekly' | 'quarterly'
): Date {
  const nextDate = new Date(currentDate);

  switch (frequency) {
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'quarterly':
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
  }

  return nextDate;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value >= 0 ? '+' : ''}${formatNumber(value, decimals)}%`;
}
