/**
 * FunKit API Service Wrapper
 * Handles all interactions with @funkit/api-base
 */

import {
  getAssetErc20ByChainAndSymbol,
  getAssetPriceInfo,
} from "@funkit/api-base";
import type { TokenInfo, PriceInfo, ApiError } from "../types/api";

const API_KEY = import.meta.env.VITE_FUNKIT_API_KEY;

if (!API_KEY) {
  console.warn("VITE_FUNKIT_API_KEY is not set in environment variables");
}

/**
 * Fetch token information by chain ID and symbol
 */
export async function fetchTokenInfo(
  chainId: string,
  symbol: string
): Promise<TokenInfo> {
  try {
    const response = await getAssetErc20ByChainAndSymbol({
      chainId,
      symbol,
      apiKey: API_KEY,
    });

    if (!response || !response.address) {
      throw new Error(`Token ${symbol} not found on chain ${chainId}`);
    }

    return {
      chainId,
      symbol,
      address: response.address,
      decimals: response.decimals || 18,
      name: response.name || symbol,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch token info";
    throw {
      message,
      code: "TOKEN_FETCH_ERROR",
      details: error,
    } as ApiError;
  }
}

/**
 * Fetch price information for a token
 */
export async function fetchPriceInfo(
  chainId: string,
  assetTokenAddress: string
): Promise<PriceInfo> {
  try {
    const response = await getAssetPriceInfo({
      chainId,
      assetTokenAddress,
      apiKey: API_KEY,
    });

    if (!response || response.unitPrice === undefined) {
      throw new Error(`Price info not found for token ${assetTokenAddress}`);
    }

    return {
      chainId,
      assetTokenAddress,
      priceUsd: response.unitPrice,
      lastUpdated: Date.now(),
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch price info";
    throw {
      message,
      code: "PRICE_FETCH_ERROR",
      details: error,
    } as ApiError;
  }
}

/**
 * Fetch both token and price info
 */
export async function fetchTokenWithPrice(
  chainId: string,
  symbol: string
): Promise<{ token: TokenInfo; price: PriceInfo }> {
  const token = await fetchTokenInfo(chainId, symbol);
  const price = await fetchPriceInfo(chainId, token.address);
  return { token, price };
}

