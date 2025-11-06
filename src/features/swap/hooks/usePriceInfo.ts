/**
 * Hook for fetching price information using TanStack Query
 */

import { useQuery } from "@tanstack/react-query";
import type { PriceInfo, ApiError } from "../../../types/api";
import { fetchPriceInfo } from "../../../services/funkit";

interface UsePriceInfoState {
  data: PriceInfo | null;
  loading: boolean;
  fetching: boolean;
  error: ApiError | null;
}

export function usePriceInfo(
  chainId: string | null,
  tokenAddress: string | null
): UsePriceInfoState {
  const { data, isLoading, isFetching, error } = useQuery<PriceInfo, ApiError>({
    // Unique cache key per token price (chainId + tokenAddress combination)
    queryKey: ["priceInfo", chainId, tokenAddress],
    // Query function
    queryFn: () => {
      if (!chainId || !tokenAddress) {
        throw new Error("Chain ID and token address are required");
      }
      return fetchPriceInfo(chainId, tokenAddress);
    },
    // Only run query if we have both chainId and tokenAddress
    enabled: Boolean(chainId && tokenAddress),
    // Price data is stale after 30 seconds (inherits from QueryClient default)
    // Refetch on window focus to get fresh prices
    refetchOnWindowFocus: true,
    // Refetch every 30 seconds in the background
    refetchInterval: 30 * 1000,
  });

  return {
    data: data ?? null,
    loading: isLoading,
    fetching: isFetching,
    error: error ?? null,
  };
}

