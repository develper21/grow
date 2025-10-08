// src/lib/utils.ts

import dayjs from "dayjs"; // Use a modern date library for better reliability

// --- Date Utilities ---

/**
 * ✅ Format a date into DD-MM-YYYY
 * Uses dayjs for more robust and reliable date parsing and formatting.
 * @param date - The date string or Date object to format.
 * @returns The formatted date string (e.g., "31-12-2023").
 */
export function formatDate(date: string | Date): string {
  // dayjs is superior for date manipulation and formatting over plain Date object
  // Especially handles various input string formats better
  return dayjs(date).format("DD-MM-YYYY");
}

// --- Formatting Utilities ---

/**
 * ✅ Format currency (Indian Rupees style by default)
 * @param value - The numeric value to format.
 * @param currency - The currency code (e.g., "INR", "USD").
 * @param locale - The locale to use for formatting (defaults to "en-IN").
 * @returns The formatted currency string (e.g., "₹1,23,456.78").
 */
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
    minimumFractionDigits: 2, // Ensure two decimals are always shown
  }).format(value);
}

/**
 * ✅ Convert a number to percentage with a specified number of decimals.
 * @param value - The numeric value (e.g., 15.456) to format.
 * @param decimals - The number of decimal places (default is 2).
 * @returns The formatted percentage string (e.g., "15.46%").
 */
export function formatPercent(value?: number, decimals = 2): string {
  if (typeof value !== "number" || isNaN(value)) return "-";
  
  // Use toLocaleString for locale-aware number formatting before appending %
  return `${value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: false, // Ensures no thousand separators in the percentage value itself
  })}%`;
}

// --- Financial Utilities ---

/**
 * ✅ Calculate CAGR (Compound Annual Growth Rate)
 * @param startValue - The starting investment value.
 * @param endValue - The ending investment value.
 * @param years - The duration in years.
 * @returns The CAGR as a percentage (e.g., 15.45). Returns 0 in edge cases.
 */
export function calculateCAGR(
  startValue: number,
  endValue: number,
  years: number
): number {
  // Check for non-positive start value or non-positive years
  if (startValue <= 0 || years <= 0) return 0;
  
  // Check for scenarios where growth is impossible (e.g., non-positive end value)
  if (endValue <= 0) return -100; // Represents a total loss or 0 return effectively
  
  return (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
}

// --- Helper Utilities ---

/**
 * ✅ Helper: generate a random ID (useful for charts, keys, etc.)
 * @param prefix - A prefix for the ID (default is "id").
 * @returns A unique-enough string (e.g., "key_a1b2c3d").
 */
export function generateId(prefix = "id"): string {
  // Use a cryptographically secure random number generator if possible, 
  // but Math.random is sufficient for simple UI keys/IDs.
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
}