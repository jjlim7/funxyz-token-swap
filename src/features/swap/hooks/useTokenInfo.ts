/**
 * Hook for fetching token information using TanStack Query
 */

import { useQuery } from "@tanstack/react-query";
import type { TokenInfo, ApiError } from "../../../types/api";
import { fetchTokenInfo } from "../../../services/funkit";

interface UseTokenInfoState {
  data: TokenInfo | null;
  loading: boolean;
  fetching: boolean;
  error: ApiError | null;
}

export function useTokenInfo(
  chainId: string | null,
  symbol: string | null
): UseTokenInfoState {
  const { data, isLoading, isFetching, error } = useQuery<TokenInfo, ApiError>({
    // Unique cache key per token (chainId + symbol combination)
    queryKey: ["tokenInfo", chainId, symbol],
    // Query function
    queryFn: () => {
      if (!chainId || !symbol) {
        throw new Error("Chain ID and symbol are required");
      }
      return fetchTokenInfo(chainId, symbol);
    },
    // Only run query if we have both chainId and symbol
    enabled: Boolean(chainId && symbol),
    // Token info rarely changes, cache for 1 hour
    staleTime: 60 * 60 * 1000,
    // Keep in cache for 24 hours
    gcTime: 24 * 60 * 60 * 1000,
  });

  return {
    data: data ?? null,
    loading: isLoading,
    fetching: isFetching,
    error: error ?? null,
  };
}

