/**
 * API Types for Token and Price Information
 */

export interface TokenInfo {
  chainId: string;
  symbol: string;
  address: string;
  decimals: number;
  name: string;
}

export interface PriceInfo {
  chainId: string;
  assetTokenAddress: string;
  priceUsd: number;
  lastUpdated: number;
}

export interface ConversionResult {
  sourceToken: TokenInfo;
  targetToken: TokenInfo;
  sourcePrice: PriceInfo;
  targetPrice: PriceInfo;
  usdAmount: number;
  sourceAmount: number;
  targetAmount: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

