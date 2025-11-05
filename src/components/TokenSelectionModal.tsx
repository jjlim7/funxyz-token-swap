/**
 * Token Selection Modal Component
 * Modal overlay for selecting tokens with search and categorized views
 */

import React, { useState, useMemo } from "react";

interface Token {
  symbol: string;
  chainId: string;
  chainName: string;
  chainColor: string;
}

interface TokenSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: Token[];
  onSelectToken: (symbol: string) => void;
  selectedSymbol: string | null;
}

export const TokenSelectionModal: React.FC<TokenSelectionModalProps> = ({
  isOpen,
  onClose,
  tokens,
  onSelectToken,
  selectedSymbol,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter tokens based on search query
  const filteredTokens = useMemo(() => {
    if (!searchQuery.trim()) return tokens;

    const query = searchQuery.toLowerCase();
    return tokens.filter(
      (token) =>
        token.symbol.toLowerCase().includes(query) ||
        token.chainName.toLowerCase().includes(query)
    );
  }, [tokens, searchQuery]);

  // Get popular tokens (first 6 unique symbols)
  const popularTokens = useMemo(() => {
    const seen = new Set<string>();
    return tokens.filter((token) => {
      if (seen.has(token.symbol)) return false;
      seen.add(token.symbol);
      return seen.size <= 6;
    });
  }, [tokens]);

  const handleSelectToken = (symbol: string) => {
    onSelectToken(symbol);
    onClose();
    setSearchQuery("");
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/80 flex items-center justify-center z-[1000] p-lg animate-fadeIn" onClick={handleBackdropClick}>
      <div className="bg-bg-secondary border border-border rounded-[20px] w-full max-w-[500px] max-h-[90vh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.6)] animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-lg px-xl border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary m-0">Select a token</h2>
          <button
            className="w-8 h-8 rounded-full border-none bg-transparent text-text-secondary text-xl cursor-pointer flex items-center justify-center transition-all duration-base hover:bg-bg-hover hover:text-text-primary"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-md px-xl flex items-center gap-sm bg-bg-input mx-xl my-md rounded-xl border border-border">
          <span className="text-lg text-text-tertiary">🔍</span>
          <input
            type="text"
            className="flex-1 border-none outline-none text-[0.9375rem] text-text-primary bg-transparent placeholder:text-text-tertiary"
            placeholder='Search any token. Include "." for exact match.'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>

        {/* Popular Tokens Grid */}
        {!searchQuery && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-sm px-xl pb-lg">
            {popularTokens.map((token) => (
              <button
                key={`${token.chainId}-${token.symbol}`}
                className={`flex flex-col items-center gap-xs p-sm border border-border rounded-xl bg-bg-tertiary cursor-pointer transition-all duration-base hover:border-primary hover:bg-bg-hover ${
                  selectedSymbol === token.symbol ? "border-primary bg-primary/10" : ""
                }`}
                onClick={() => handleSelectToken(token.symbol)}
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-xl text-white">
                  {getTokenIcon(token.symbol)}
                </div>
                <span className="text-[0.6875rem] font-semibold text-text-primary">{token.symbol}</span>
              </button>
            ))}
          </div>
        )}

        {/* Token List */}
        <div className="p-lg px-xl last:flex-1 last:overflow-y-auto last:min-h-0 last:pb-xl">
          {!searchQuery && (
            <div className="flex items-center gap-sm mb-md">
              <span className="text-[0.8125rem] font-semibold text-text-secondary capitalize">
                All Tokens
              </span>
            </div>
          )}
          <div className="flex flex-col gap-0.5">
            {filteredTokens.length > 0 ? (
              filteredTokens.map((token) => (
                <button
                  key={`${token.chainId}-${token.symbol}`}
                  className={`flex items-center justify-between gap-md p-md border-none bg-transparent cursor-pointer rounded-[10px] transition-all duration-base text-left w-full hover:bg-bg-hover ${
                    selectedSymbol === token.symbol ? "bg-primary/10" : ""
                  }`}
                  onClick={() => handleSelectToken(token.symbol)}
                >
                  <div className="flex items-center gap-md flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-lg text-white">
                      {getTokenIcon(token.symbol)}
                    </div>
                    <div className="flex-1 flex flex-col gap-1 min-w-0">
                      <div className="text-[0.9375rem] font-semibold text-text-primary flex items-center gap-xs">
                        {token.symbol}
                        <span className="text-green-500 text-xs">✓</span>
                      </div>
                      <div className="text-[0.8125rem] text-text-tertiary overflow-hidden text-ellipsis whitespace-nowrap">
                        {getTokenName(token.symbol)}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-2xl text-center text-text-secondary text-sm">
                No tokens found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      </div>
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

// Helper function to get full token name
function getTokenName(symbol: string): string {
  const names: Record<string, string> = {
    ETH: "Ethereum",
    USDC: "USD Coin",
    USDT: "Tether",
    WBTC: "Wrapped Bitcoin",
    BTC: "Bitcoin",
    WETH: "Wrapped Ethereum",
    SOL: "Solana",
    MATIC: "Polygon",
    AVAX: "Avalanche",
    BNB: "BNB",
    LINK: "Chainlink",
  };
  return names[symbol] || symbol;
}

