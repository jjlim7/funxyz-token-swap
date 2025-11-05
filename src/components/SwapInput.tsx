/**
 * Swap Input Component
 * Input box for Sell/Buy with token selector button
 */

import React from "react";

interface SwapInputProps {
  label: "Sell" | "Buy" | "Selling" | "Buying";
  value: string;
  onChange: (value: string) => void;
  selectedToken: string | null;
  onOpenTokenSelector: () => void;
  tokenAmount?: string;
  usdValue?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export const SwapInput: React.FC<SwapInputProps> = ({
  label,
  value,
  onChange,
  selectedToken,
  onOpenTokenSelector,
  tokenAmount,
  usdValue,
  isLoading,
  disabled,
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
    <div className={`bg-bg-tertiary border border-border rounded-2xl p-lg transition-all duration-base hover:border-bg-hover focus-within:border-primary focus-within:bg-bg-tertiary ${disabled ? "cursor-not-allowed" : ""}`}>
      <div className="flex items-center justify-between mb-sm">
        <label className="text-[0.8125rem] font-semibold text-text-secondary capitalize">{label}</label>
        {tokenAmount && !isLoading && (
          <span className="text-xs text-text-tertiary">
            {tokenAmount} {selectedToken}
          </span>
        )}
        {isLoading && (
          <span className="text-xs text-primary animate-pulse">Loading...</span>
        )}
      </div>

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
          className={`flex items-center gap-sm px-md py-sm border border-border rounded-xl cursor-pointer transition-all duration-base flex-shrink-0 ${
            !selectedToken
              ? "bg-success text-[#0D111C] border-success px-lg font-semibold hover:bg-success-dark hover:border-success-dark"
              : "bg-bg-secondary hover:bg-bg-hover hover:border-primary"
          }`}
          onClick={onOpenTokenSelector}
          type="button"
        >
          {selectedToken ? (
            <>
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-base text-white">
                {getTokenIcon(selectedToken)}
              </span>
              <span className="text-base font-semibold text-text-primary">{selectedToken}</span>
              <span className="text-xs text-text-secondary transition-transform duration-base group-hover:translate-y-0.5">▼</span>
            </>
          ) : (
            <>
              <span className="text-base font-semibold">Select token</span>
              <span className="text-xs">▼</span>
            </>
          )}
        </button>
      </div>

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

// Helper function to get token icon (emoji placeholders)
function getTokenIcon(symbol: string): string {
  const icons: Record<string, string> = {
    ETH: "⟠",
    USDC: "💵",
    USDT: "💲",
    WBTC: "₿",
    BTC: "₿",
    WETH: "⟠",
    SOL: "◎",
    MATIC: "⬡",
    AVAX: "🔺",
    BNB: "💎",
    LINK: "🔗",
  };
  return icons[symbol] || "🪙";
}

