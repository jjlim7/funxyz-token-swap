/**
 * Hook for fetching token information
 */

import { useEffect, useState } from "react";
import type { TokenInfo, ApiError } from "../../../types/api";
import { fetchTokenInfo } from "../../../services/funkit";

interface UseTokenInfoState {
  data: TokenInfo | null;
  loading: boolean;
  error: ApiError | null;
}

export function useTokenInfo(
  chainId: string | null,
  symbol: string | null
): UseTokenInfoState {
  const [state, setState] = useState<UseTokenInfoState>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!chainId || !symbol) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    const fetchData = async () => {
      setState({ data: null, loading: true, error: null });
      try {
        const tokenInfo = await fetchTokenInfo(chainId, symbol);
        setState({ data: tokenInfo, loading: false, error: null });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error as ApiError,
        });
      }
    };

    fetchData();
  }, [chainId, symbol]);

  return state;
}

