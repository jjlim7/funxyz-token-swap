/**
 * Hook for fetching price information
 */

import { useEffect, useState } from "react";
import type { PriceInfo, ApiError } from "../../../types/api";
import { fetchPriceInfo } from "../../../services/funkit";

interface UsePriceInfoState {
  data: PriceInfo | null;
  loading: boolean;
  error: ApiError | null;
}

export function usePriceInfo(
  chainId: string | null,
  tokenAddress: string | null
): UsePriceInfoState {
  const [state, setState] = useState<UsePriceInfoState>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!chainId || !tokenAddress) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    const fetchData = async () => {
      setState({ data: null, loading: true, error: null });
      try {
        const priceInfo = await fetchPriceInfo(chainId, tokenAddress);
        setState({ data: priceInfo, loading: false, error: null });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error as ApiError,
        });
      }
    };

    fetchData();
  }, [chainId, tokenAddress]);

  return state;
}

