/**
 * Zustand store for swap state management
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SwapState {
  sourceSymbol: string | null;
  targetSymbol: string | null;
  sourceTokenAmount: string; // Amount of source token (e.g., "500" for 500 USDC)
  slippageTolerance: number; // Percentage (e.g., 0.5 for 0.5%)
  favoriteTokens: string[]; // Array of token symbols
  setSourceSymbol: (symbol: string | null) => void;
  setTargetSymbol: (symbol: string | null) => void;
  setSourceTokenAmount: (amount: string) => void;
  setSlippageTolerance: (slippage: number) => void;
  toggleFavorite: (symbol: string) => void;
  isFavorite: (symbol: string) => boolean;
  reset: () => void;
}

const INITIAL_STATE = {
  sourceSymbol: "USDC",
  targetSymbol: "ETH",
  sourceTokenAmount: "100",
  slippageTolerance: 0.5, // Default 0.5%
  favoriteTokens: ["USDC", "ETH"], // Default favorites
};

export const useSwapStore = create<SwapState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,
      setSourceSymbol: (symbol) => set({ sourceSymbol: symbol }),
      setTargetSymbol: (symbol) => set({ targetSymbol: symbol }),
      setSourceTokenAmount: (amount) => set({ sourceTokenAmount: amount }),
      setSlippageTolerance: (slippage) => set({ slippageTolerance: slippage }),
      toggleFavorite: (symbol) =>
        set((state) => {
          const isFav = state.favoriteTokens.includes(symbol);
          return {
            favoriteTokens: isFav
              ? state.favoriteTokens.filter((s) => s !== symbol)
              : [...state.favoriteTokens, symbol],
          };
        }),
      isFavorite: (symbol) => get().favoriteTokens.includes(symbol),
      reset: () => set(INITIAL_STATE),
    }),
    {
      name: "swap-store",
    }
  )
);

