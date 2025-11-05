/**
 * Token selector component with chain badges
 */

import React from "react";
import "../styles/token-selector.css";

interface TokenSelectorProps {
  tokens: Array<{
    symbol: string;
    chainId: string;
    chainName: string;
    chainColor: string;
  }>;
  selectedSymbol: string | null;
  onSelect: (symbol: string) => void;
  label?: string;
  variant?: 'source' | 'target';
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  tokens,
  selectedSymbol,
  onSelect,
  label,
  variant = 'source',
}) => {
  return (
    <div className={`token-selector token-selector--${variant}`}>
      {label && <label className="token-selector__label">{label}</label>}
      <div className="token-selector__buttons">
        {tokens.map((token) => (
          <button
            key={`${token.chainId}-${token.symbol}`}
            className={`token-selector__button ${
              selectedSymbol === token.symbol
                ? "token-selector__button--active"
                : ""
            }`}
            onClick={() => onSelect(token.symbol)}
            aria-label={`Select ${token.symbol} on ${token.chainName}`}
          >
            <span className="token-selector__symbol">{token.symbol}</span>
            <span
              className="token-selector__chain"
              style={{ borderColor: token.chainColor }}
            >
              {token.chainName}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

