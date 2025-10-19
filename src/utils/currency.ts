// Currency conversion utilities
// Base currency: AMD (Armenian Dram)

// Exchange rates (fixed as per RDP)
export const USD_TO_AMD_RATE = 385;
export const CNY_TO_AMD_RATE = 53.5; // TODO: Confirm with client

/**
 * Convert USD to AMD
 */
export function usdToAmd(usd: number): number {
  return usd * USD_TO_AMD_RATE;
}

/**
 * Convert AMD to USD
 */
export function amdToUsd(amd: number): number {
  return amd / USD_TO_AMD_RATE;
}

/**
 * Convert CNY to AMD
 */
export function cnyToAmd(cny: number): number {
  return cny * CNY_TO_AMD_RATE;
}

/**
 * Convert AMD to CNY
 */
export function amdToCny(amd: number): number {
  return amd / CNY_TO_AMD_RATE;
}

/**
 * Format amount in AMD with proper symbol
 */
export function formatAmd(amount: number): string {
  return `${amount.toLocaleString('ru-RU')} ֏`;
}

/**
 * Format amount in USD
 */
export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Format amount in CNY
 */
export function formatCny(amount: number): string {
  return `¥${amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}


