/**
 * Swap Input Component
 * Input box for Sell/Buy with token selector button
 */

import React from "react";
import { TokenIcon } from "./TokenIcon";
import { Loader } from "./Loader";

interface SwapInputProps {
  label: "Sell" | "Buy" | "Selling" | "Buying";
  value: string;
  onChange: (value: string) => void;
  selectedToken: string | null;
  onOpenTokenSelector: () => void;
  onQuickSelectToken?: (symbol: string) => void;
  tokenAmount?: string;
  usdValue?: string;
  isLoading?: boolean;
  isFetching?: boolean;
  disabled?: boolean;
  showPopularTokens?: boolean;
}

// Popular tokens for quick selection
const POPULAR_TOKENS = ["ETH", "USDC", "USDT", "WBTC", "BTC"];

export const SwapInput: React.FC<SwapInputProps> = ({
  label,
  value,
  onChange,
  selectedToken,
  onOpenTokenSelector,
  onQuickSelectToken,
  tokenAmount,
  usdValue,
  isLoading,
  isFetching,
  disabled,
  showPopularTokens = false,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow empty string
    if (inputValue === "") {
      onChange("");
      return;
    }

    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(inputValue)) {
      onChange(inputValue);
    }
  };

  return (
    <div className={`relative bg-bg-tertiary border border-border rounded-2xl p-lg transition-all duration-base hover:border-bg-hover focus-within:border-primary focus-within:bg-bg-tertiary ${disabled ? "cursor-not-allowed" : ""} ${isFetching ? "opacity-70" : ""}`}>
      <div className="flex items-center justify-between mb-sm">
        <label className="text-[0.8125rem] font-semibold text-text-secondary capitalize">{label}</label>
        <div className="flex items-center gap-sm">
          {tokenAmount && !isLoading && !isFetching && (
            <span className="text-xs text-text-tertiary">
              {tokenAmount} {selectedToken}
            </span>
          )}
          {isLoading && !isFetching && (
            <span className="text-xs text-primary animate-pulse">Loading...</span>
          )}
          {isFetching && (
            <div className="flex items-center gap-xs">
              <Loader size="small" />
              <span className="text-xs text-primary">Updating...</span>
            </div>
          )}
        </div>
      </div>

      {/* Show input and token selector when token is selected, or just popular tokens when empty */}
      {selectedToken ? (
        <div className="flex items-center gap-md mb-sm">
          <input
            type="text"
            className="flex-1 border-none outline-none bg-transparent text-[2rem] font-semibold text-text-primary p-0 min-w-0 placeholder:text-text-tertiary disabled:cursor-not-allowed"
            value={value}
            onChange={handleInputChange}
            placeholder="0"
            disabled={disabled}
          />

          <button
            className="flex items-center gap-sm px-md py-sm border border-border rounded-xl cursor-pointer transition-all duration-base flex-shrink-0 bg-bg-secondary hover:bg-bg-hover hover:border-primary"
            onClick={onOpenTokenSelector}
            type="button"
          >
            <div className="w-6 h-6 rounded-full bg-bg-secondary flex items-center justify-center overflow-hidden">
              <TokenIcon symbol={selectedToken} size={24} />
            </div>
            <span className="text-base font-semibold text-text-primary">{selectedToken}</span>
            <span className="text-xs text-text-secondary transition-transform duration-base group-hover:translate-y-0.5">▼</span>
          </button>
        </div>
      ) : (
        <div className="mb-sm">
          {/* Popular token icons - right aligned and compact, positioned above */}
          {showPopularTokens && onQuickSelectToken && (
            <div className="flex items-center gap-xs justify-end mb-xs">
              {POPULAR_TOKENS.map((symbol) => (
                <button
                  key={symbol}
                  type="button"
                  className="w-7 h-7 rounded-full bg-bg-secondary border border-border flex items-center justify-center overflow-hidden cursor-pointer transition-all duration-base hover:bg-bg-hover hover:border-primary hover:scale-110 active:scale-95"
                  onClick={() => onQuickSelectToken(symbol)}
                  title={`Select ${symbol}`}
                >
                  <TokenIcon symbol={symbol} size={22} />
                </button>
              ))}
            </div>
          )}

          {/* Main row with 0 and button at same height */}
          <div className="flex items-center gap-md">
            {/* Empty state - just show 0 */}
            <div className="text-[2rem] font-semibold text-text-tertiary flex-1">0</div>

            {/* Select token button - inline/compact on the right, same height as selected token button */}
            <button
              className="flex items-center gap-sm px-md py-sm border border-[#C7F284] bg-[#C7F284] text-[#0D111C] rounded-xl cursor-pointer transition-all duration-base flex-shrink-0 font-semibold hover:bg-[#B5E070] hover:border-[#B5E070] active:scale-[0.98]"
              onClick={onOpenTokenSelector}
              type="button"
            >
              <span className="text-base font-semibold">Select token</span>
              <span className="text-xs">▼</span>
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-[0.8125rem] text-text-tertiary">
          {usdValue ? `$${usdValue}` : (value && !isNaN(parseFloat(value)) ? `$${parseFloat(value).toFixed(2)}` : "$0")}
        </span>
      </div>

      {/* Quick Amount Buttons - Only show for Sell/Selling input */}
      {(label === "Sell" || label === "Selling") && !disabled && (
        <div className="flex gap-sm mt-md pt-md border-t border-border">
          <button
            type="button"
            className="flex-1 px-md py-sm border border-border bg-bg-secondary rounded-lg text-[0.8125rem] font-semibold text-text-primary cursor-pointer transition-all duration-base hover:bg-bg-hover hover:border-primary active:scale-[0.98]"
            onClick={() => onChange("100")}
          >
            $100
          </button>
          <button
            type="button"
            className="flex-1 px-md py-sm border border-border bg-bg-secondary rounded-lg text-[0.8125rem] font-semibold text-text-primary cursor-pointer transition-all duration-base hover:bg-bg-hover hover:border-primary active:scale-[0.98]"
            onClick={() => onChange("500")}
          >
            $500
          </button>
          <button
            type="button"
            className="flex-1 px-md py-sm border border-border bg-bg-secondary rounded-lg text-[0.8125rem] font-semibold text-text-primary cursor-pointer transition-all duration-base hover:bg-bg-hover hover:border-primary active:scale-[0.98]"
            onClick={() => onChange("1000")}
          >
            $1K
          </button>
          <button
            type="button"
            className="flex-1 px-md py-sm border border-success bg-success rounded-lg text-[0.8125rem] font-semibold text-[#0D111C] cursor-pointer transition-all duration-base hover:bg-success-dark hover:border-success-dark active:scale-[0.98]"
            onClick={() => {
              // For now, set to a reasonable max. In future, use wallet balance
              onChange("10000");
            }}
          >
            Max
          </button>
        </div>
      )}
    </div>
  );
};


