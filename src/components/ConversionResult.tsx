/**
 * Conversion result display component
 */

import React from "react";
import type { TokenInfo, PriceInfo } from "../types/api";
import { formatUSD, formatTokenAmount } from "../features/swap/logic/convert";
import { Loader } from "./Loader";
import "../styles/conversion-result.css";

interface ConversionResultProps {
  sourceToken: TokenInfo | null;
  targetToken: TokenInfo | null;
  sourcePrice: PriceInfo | null;
  targetPrice: PriceInfo | null;
  usdAmount: number;
  sourceAmount: number;
  targetAmount: number;
  loading?: boolean;
}

export const ConversionResult: React.FC<ConversionResultProps> = ({
  sourceToken,
  targetToken,
  sourcePrice,
  targetPrice,
  usdAmount,
  sourceAmount,
  targetAmount,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="conversion-result conversion-result--loading">
        <Loader size="medium" />
      </div>
    );
  }

  if (!sourceToken || !targetToken || !sourcePrice || !targetPrice) {
    return (
      <div className="conversion-result conversion-result--empty">
        <p>Select tokens to see conversion</p>
      </div>
    );
  }

  return (
    <div className="conversion-result">
      <div className="conversion-result__section">
        <div className="conversion-result__header">
          <h3 className="conversion-result__title">You Send</h3>
          <span className="conversion-result__price">
            ${formatUSD(sourcePrice.priceUsd)}/token
          </span>
        </div>
        <div className="conversion-result__amount">
          <span className="conversion-result__value">
            {formatTokenAmount(sourceAmount)}
          </span>
          <span className="conversion-result__symbol">{sourceToken.symbol}</span>
        </div>
        <div className="conversion-result__usd">
          ≈ ${formatUSD(usdAmount)}
        </div>
      </div>

      <div className="conversion-result__arrow">→</div>

      <div className="conversion-result__section">
        <div className="conversion-result__header">
          <h3 className="conversion-result__title">You Receive</h3>
          <span className="conversion-result__price">
            ${formatUSD(targetPrice.priceUsd)}/token
          </span>
        </div>
        <div className="conversion-result__amount">
          <span className="conversion-result__value">
            {formatTokenAmount(targetAmount)}
          </span>
          <span className="conversion-result__symbol">{targetToken.symbol}</span>
        </div>
        <div className="conversion-result__usd">
          ≈ ${formatUSD(usdAmount)}
        </div>
      </div>
    </div>
  );
};

