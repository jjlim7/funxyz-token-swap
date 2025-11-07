/**
 * Main Swap Page Component - Modal-based Design
 * Integrates all components and manages the swap flow
 */

import React, { useMemo, useState } from "react";
import { SwapInput } from "../../components/SwapInput";
import { TokenSelectionModal } from "../../components/TokenSelectionModal";
import { ErrorBanner } from "../../components/ErrorBanner";
import { useSwapStore } from "./store/swapStore";
import { useTokenInfo } from "./hooks/useTokenInfo";
import { usePriceInfo } from "./hooks/usePriceInfo";
import { useDebouncedValue } from "./hooks/useDebouncedValue";
import {
  validateUSDAmount,
  formatTokenAmount,
} from "./logic/convert";

// Token configuration with chain information
const TOKENS = [
  { symbol: "BTC", chainId: "1", chainName: "Ethereum", chainColor: "#627EEA" },
  { symbol: "WBTC", chainId: "1", chainName: "Ethereum", chainColor: "#627EEA" },
  { symbol: "USDC", chainId: "1", chainName: "Ethereum", chainColor: "#627EEA" },
  { symbol: "USDT", chainId: "137", chainName: "Polygon", chainColor: "#8247E5" },
  { symbol: "ETH", chainId: "8453", chainName: "Base", chainColor: "#0052FF" },
  { symbol: "MATIC", chainId: "137", chainName: "Polygon", chainColor: "#8247E5" },
  { symbol: "LINK", chainId: "1", chainName: "Ethereum", chainColor: "#627EEA" },
  { symbol: "BNB", chainId: "56", chainName: "BSC", chainColor: "#F3BA2F" },
];

type ModalType = "source" | "target" | null;

export const SwapPage: React.FC = () => {
  const {
    sourceSymbol,
    targetSymbol,
    sourceTokenAmount,
    setSourceSymbol,
    setTargetSymbol,
    setSourceTokenAmount,
  } = useSwapStore();

  const [dismissedErrors, setDismissedErrors] = useState<Set<string>>(
    new Set()
  );

  // Debounce source token amount input
  const debouncedSourceTokenAmount = useDebouncedValue(sourceTokenAmount, 300);

  // Get source token info
  const sourceTokenInfo = useTokenInfo(
    sourceSymbol ? TOKENS.find((t) => t.symbol === sourceSymbol)?.chainId || null : null,
    sourceSymbol
  );

  // Get target token info
  const targetTokenInfo = useTokenInfo(
    targetSymbol ? TOKENS.find((t) => t.symbol === targetSymbol)?.chainId || null : null,
    targetSymbol
  );

  // Get source price info
  const sourcePriceInfo = usePriceInfo(
    sourceTokenInfo.data?.chainId || null,
    sourceTokenInfo.data?.address || null
  );

  // Get target price info
  const targetPriceInfo = usePriceInfo(
    targetTokenInfo.data?.chainId || null,
    targetTokenInfo.data?.address || null
  );

  // Calculate USD value and target token amount from source token amount
  const conversion = useMemo(() => {
    const sourceAmount = parseFloat(debouncedSourceTokenAmount) || 0;

    if (
      !sourceTokenInfo.data ||
      !targetTokenInfo.data ||
      !sourcePriceInfo.data ||
      !targetPriceInfo.data ||
      sourceAmount <= 0
    ) {
      return { sourceAmount: 0, targetAmount: 0, usdValue: 0 };
    }

    // Calculate USD value from source token amount
    const usdValue = sourceAmount * sourcePriceInfo.data.priceUsd;

    // Calculate target token amount
    const targetAmount = (sourceAmount * sourcePriceInfo.data.priceUsd) / targetPriceInfo.data.priceUsd;

    // Debug logging for conversion
    console.log('=== Conversion Debug ===');
    console.log('Source Amount:', sourceAmount, sourceSymbol);
    console.log('Source Token Price:', sourcePriceInfo.data.priceUsd);
    console.log('USD Value:', usdValue);
    console.log('Target Token:', targetSymbol, 'Price:', targetPriceInfo.data.priceUsd);
    console.log('Target Amount:', targetAmount, targetSymbol);
    console.log('=======================');

    return { sourceAmount, targetAmount, usdValue };
  }, [
    debouncedSourceTokenAmount,
    sourceTokenInfo.data,
    targetTokenInfo.data,
    sourcePriceInfo.data,
    targetPriceInfo.data,
    sourceSymbol,
    targetSymbol,
  ]);

  // Validate source token amount
  const tokenValidation = validateUSDAmount(sourceTokenAmount); // Reusing the same validation logic

  // Check for errors with user-friendly messages
  const errors = useMemo(() => {
    const errorList: Array<{ id: string; message: string; retry?: () => void }> = [];

    if (sourceTokenInfo.error && !dismissedErrors.has("source-token")) {
      errorList.push({
        id: "source-token",
        message: `We couldn't load ${sourceSymbol} information. Please check your connection and try again.`,
        retry: () => {
          // Trigger refetch by toggling the symbol
          setSourceSymbol(null);
          setTimeout(() => setSourceSymbol(sourceSymbol), 100);
        },
      });
    }

    if (targetTokenInfo.error && !dismissedErrors.has("target-token")) {
      errorList.push({
        id: "target-token",
        message: `We couldn't load ${targetSymbol} information. Please check your connection and try again.`,
        retry: () => {
          setTargetSymbol(null);
          setTimeout(() => setTargetSymbol(targetSymbol), 100);
        },
      });
    }

    if (sourcePriceInfo.error && !dismissedErrors.has("source-price")) {
      errorList.push({
        id: "source-price",
        message: `${sourceSymbol} prices are temporarily unavailable. They usually update within a few seconds.`,
        retry: () => {
          // Trigger refetch by toggling the symbol
          setSourceSymbol(null);
          setTimeout(() => setSourceSymbol(sourceSymbol), 100);
        },
      });
    }

    if (targetPriceInfo.error && !dismissedErrors.has("target-price")) {
      errorList.push({
        id: "target-price",
        message: `${targetSymbol} prices are temporarily unavailable. They usually update within a few seconds.`,
        retry: () => {
          setTargetSymbol(null);
          setTimeout(() => setTargetSymbol(targetSymbol), 100);
        },
      });
    }

    if (!tokenValidation.valid && sourceTokenAmount && !dismissedErrors.has("token-amount")) {
      errorList.push({
        id: "token-amount",
        message: tokenValidation.error || "Please enter a valid amount greater than 0",
      });
    }

    return errorList;
  }, [
    sourceTokenInfo.error,
    targetTokenInfo.error,
    sourcePriceInfo.error,
    targetPriceInfo.error,
    tokenValidation.valid,
    tokenValidation.error,
    dismissedErrors,
    sourceSymbol,
    targetSymbol,
    sourceTokenAmount,
    setSourceSymbol,
    setTargetSymbol,
  ]);

  const handleDismissError = (errorId: string) => {
    setDismissedErrors((prev) => new Set(prev).add(errorId));
  };

  // Modal state
  const [openModal, setOpenModal] = useState<ModalType>(null);

  const handleOpenSourceModal = () => setOpenModal("source");
  const handleOpenTargetModal = () => setOpenModal("target");
  const handleCloseModal = () => setOpenModal(null);

  const handleSelectToken = (symbol: string) => {
    if (openModal === "source") {
      setSourceSymbol(symbol);
    } else if (openModal === "target") {
      setTargetSymbol(symbol);
    }
    handleCloseModal();
  };

  const handleSwapTokens = () => {
    // Cache the current target token amount
    const cachedTargetAmount = targetTokenAmount;

    // Swap tokens
    const tempSource = sourceSymbol;
    const tempTarget = targetSymbol;
    setSourceSymbol(tempTarget);
    setTargetSymbol(tempSource);

    // Set the source token amount to the cached target amount
    // This makes the input show the previous "buying" amount
    if (cachedTargetAmount) {
      setSourceTokenAmount(cachedTargetAmount);
    }
  };

  // Format target token amount for display
  const targetTokenAmount = targetTokenInfo.data && targetPriceInfo.data && sourceTokenAmount
    ? formatTokenAmount(conversion.targetAmount)
    : undefined;

  // Format USD value for display
  const usdValue = conversion.usdValue > 0 ? conversion.usdValue.toFixed(2) : "0";

  return (
    <div className="min-h-screen bg-bg-primary p-2xl flex items-center justify-center">
      <div className="w-full max-w-[480px] flex flex-col gap-xl">
        {/* Hero Section */}
        <div className="text-center mb-md">
          <h1 className="text-5xl font-bold text-text-primary leading-tight m-0">
            Token Swap
          </h1>
        </div>

        {/* Error Banners */}
        {errors.length > 0 && (
          <div className="flex flex-col gap-md">
            {errors.map((error) => (
              <ErrorBanner
                key={error.id}
                message={error.message}
                onRetry={error.retry}
                onDismiss={() => handleDismissError(error.id)}
              />
            ))}
          </div>
        )}

        {/* Swap Card */}
        <div className="bg-bg-secondary border border-border rounded-[20px] p-xl shadow-[0_4px_24px_rgba(0,0,0,0.3)] flex flex-col gap-md relative">
          {/* Selling Input */}
          <SwapInput
            label="Selling"
            value={sourceTokenAmount}
            onChange={setSourceTokenAmount}
            selectedToken={sourceSymbol}
            onOpenTokenSelector={handleOpenSourceModal}
            usdValue={usdValue}
            isLoading={sourceTokenInfo.loading || sourcePriceInfo.loading}
            isFetching={sourceTokenInfo.fetching || sourcePriceInfo.fetching}
          />

          {/* Swap Button */}
          <div className="flex items-center justify-center -my-sm relative z-[5]">
            <button
              className="w-11 h-11 rounded-full bg-bg-secondary border-2 border-border flex items-center justify-center text-lg text-text-primary cursor-pointer transition-all duration-base hover:bg-bg-hover hover:border-[#C7F284] hover:rotate-180 hover:shadow-[0_0_20px_rgba(199,242,132,0.5)] active:rotate-180 active:scale-95"
              onClick={handleSwapTokens}
              aria-label="Swap tokens"
            >
              ⇅
            </button>
          </div>

          {/* Buying Input */}
          <SwapInput
            label="Buying"
            value={targetTokenAmount || "0"}
            onChange={() => {}} // Read-only
            selectedToken={targetSymbol}
            onOpenTokenSelector={handleOpenTargetModal}
            onQuickSelectToken={(symbol) => {
              const token = TOKENS.find((t) => t.symbol === symbol);
              if (token) {
                setTargetSymbol(symbol);
              }
            }}
            usdValue={usdValue}
            isLoading={targetTokenInfo.loading || targetPriceInfo.loading}
            isFetching={targetTokenInfo.fetching || targetPriceInfo.fetching}
            showPopularTokens={true}
            disabled
          />

          {/* Connect Button */}
          {/* <button className="w-full p-lg border-none rounded-2xl bg-success text-[#0D111C] text-lg font-bold cursor-pointer transition-all duration-base mt-md hover:bg-success-dark hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(199,242,132,0.3)] active:translate-y-0 disabled:bg-bg-hover disabled:text-text-tertiary disabled:cursor-not-allowed disabled:opacity-50" disabled={!sourceSymbol || !targetSymbol || !sourceTokenAmount}>
            Connect
          </button> */}
        </div>

      </div>

      {/* Token Selection Modal */}
      <TokenSelectionModal
        isOpen={openModal !== null}
        onClose={handleCloseModal}
        tokens={TOKENS}
        onSelectToken={handleSelectToken}
        selectedSymbol={openModal === "source" ? sourceSymbol : targetSymbol}
      />
    </div>
  );
};

