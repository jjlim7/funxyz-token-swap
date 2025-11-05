/**
 * Conversion logic for token swaps
 */

import type { PriceInfo } from "../../../types/api";

/**
 * Format a number to a specific number of decimal places
 */
export function formatNumber(value: number, decimals: number): string {
  if (!isFinite(value)) return "0";
  return value.toFixed(decimals);
}

/**
 * Format USD amount to 2 decimal places
 */
export function formatUSD(value: number): string {
  return formatNumber(value, 2);
}

/**
 * Format token amount with up to 8 significant digits
 */
export function formatTokenAmount(value: number): string {
  if (value === 0) return "0";
  if (!isFinite(value)) return "0";

  // For very small numbers, show more decimals
  if (value < 0.000001) {
    return value.toExponential(2);
  }

  // For numbers >= 1, show up to 8 significant figures
  if (value >= 1) {
    const decimals = Math.max(0, 8 - Math.floor(Math.log10(value)) - 1);
    return formatNumber(value, decimals);
  }

  // For numbers < 1, show up to 8 decimal places
  return formatNumber(value, 8).replace(/\.?0+$/, "");
}

/**
 * Calculate the amount of target token for a given USD amount
 */
export function calculateConversion(
  usdAmount: number,
  sourcePrice: PriceInfo,
  targetPrice: PriceInfo
): {
  sourceAmount: number;
  targetAmount: number;
} {
  if (usdAmount <= 0 || sourcePrice.priceUsd <= 0 || targetPrice.priceUsd <= 0) {
    return { sourceAmount: 0, targetAmount: 0 };
  }

  // Calculate source token amount: USD / price per token
  const sourceAmount = usdAmount / sourcePrice.priceUsd;

  // Calculate target token amount: (source amount * source price) / target price
  const targetAmount = (sourceAmount * sourcePrice.priceUsd) / targetPrice.priceUsd;

  return { sourceAmount, targetAmount };
}

/**
 * Validate USD amount input
 */
export function validateUSDAmount(value: string): { valid: boolean; error?: string } {
  if (!value || value.trim() === "") {
    return { valid: true }; // Empty is valid (just no conversion)
  }

  const num = parseFloat(value);

  if (isNaN(num)) {
    return { valid: false, error: "Please enter a valid number" };
  }

  if (num < 0) {
    return { valid: false, error: "Amount must be positive" };
  }

  if (num > 1000000000) {
    return { valid: false, error: "Amount is too large" };
  }

  return { valid: true };
}

/**
 * Calculate price impact percentage
 * For now, this is a simplified calculation. In a real DEX, this would
 * consider liquidity pool depth and slippage.
 */
export function calculatePriceImpact(usdAmount: number): number {
  // Simplified price impact model:
  // - Small trades (<$1000): minimal impact (0-0.1%)
  // - Medium trades ($1000-$10000): low impact (0.1-0.5%)
  // - Large trades ($10000-$100000): medium impact (0.5-2%)
  // - Very large trades (>$100000): high impact (2-5%)

  if (usdAmount < 1000) {
    return (usdAmount / 10000) * 0.1; // 0-0.1%
  } else if (usdAmount < 10000) {
    return 0.1 + ((usdAmount - 1000) / 9000) * 0.4; // 0.1-0.5%
  } else if (usdAmount < 100000) {
    return 0.5 + ((usdAmount - 10000) / 90000) * 1.5; // 0.5-2%
  } else {
    return Math.min(2 + ((usdAmount - 100000) / 100000) * 3, 5); // 2-5% (capped at 5%)
  }
}

/**
 * Get price impact severity level
 */
export function getPriceImpactSeverity(impact: number): "low" | "medium" | "high" | "critical" {
  if (impact < 0.5) return "low";
  if (impact < 2) return "medium";
  if (impact < 5) return "high";
  return "critical";
}

/**
 * Calculate minimum received amount with slippage
 */
export function calculateMinimumReceived(
  targetAmount: number,
  slippageTolerance: number
): number {
  return targetAmount * (1 - slippageTolerance / 100);
}

