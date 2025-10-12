import dayjs from "dayjs";

export function formatDate(date: string | Date): string {
  return dayjs(date).format("DD-MM-YYYY");
}

export function formatCurrency(
  value: number,
  currency: string = "INR",
  locale: string = "en-IN"
): string {
  if (typeof value !== "number" || isNaN(value)) return "-";
  
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value?: number, decimals = 2): string {
  if (typeof value !== "number" || isNaN(value)) return "-";
  
  return `${value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: false, 
  })}%`;
}

export function calculateCAGR(
  startValue: number,
  endValue: number,
  years: number
): number {
  if (startValue <= 0 || years <= 0) return 0;
  
  if (endValue <= 0) return -100;
  
  return (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
}

export function generateId(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
}