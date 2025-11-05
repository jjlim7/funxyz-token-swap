/**
 * Settings Modal Component
 * Modal for configuring swap settings like slippage tolerance
 */

import React, { useState } from "react";
import { useSwapStore } from "../features/swap/store/swapStore";
import "../styles/settings-modal.css";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SLIPPAGE_PRESETS = [0.1, 0.5, 1, 3];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { slippageTolerance, setSlippageTolerance } = useSwapStore();
  const [customSlippage, setCustomSlippage] = useState("");
  const [isCustom, setIsCustom] = useState(
    !SLIPPAGE_PRESETS.includes(slippageTolerance)
  );

  const handlePresetClick = (preset: number) => {
    setSlippageTolerance(preset);
    setIsCustom(false);
    setCustomSlippage("");
  };

  const handleCustomChange = (value: string) => {
    setCustomSlippage(value);
    setIsCustom(true);

    // Validate and set slippage
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0 && num <= 50) {
      setSlippageTolerance(num);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const getWarningMessage = () => {
    if (slippageTolerance < 0.1) {
      return {
        type: "warning",
        message: "Your transaction may fail due to very low slippage tolerance.",
      };
    }
    if (slippageTolerance > 5) {
      return {
        type: "error",
        message: "Your transaction may be frontrun due to high slippage tolerance.",
      };
    }
    return null;
  };

  const warning = getWarningMessage();

  return (
    <div className="settings-modal-backdrop" onClick={handleBackdropClick}>
      <div className="settings-modal">
        {/* Header */}
        <div className="settings-modal__header">
          <h2 className="settings-modal__title">Settings</h2>
          <button
            className="settings-modal__close"
            onClick={onClose}
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        {/* Slippage Tolerance Section */}
        <div className="settings-modal__section">
          <div className="settings-modal__section-header">
            <h3 className="settings-modal__section-title">Slippage Tolerance</h3>
            <span className="settings-modal__info-icon" title="Maximum price movement you're willing to accept">
              ℹ️
            </span>
          </div>

          {/* Preset Buttons */}
          <div className="settings-modal__presets">
            {SLIPPAGE_PRESETS.map((preset) => (
              <button
                key={preset}
                className={`settings-modal__preset ${
                  !isCustom && slippageTolerance === preset
                    ? "settings-modal__preset--active"
                    : ""
                }`}
                onClick={() => handlePresetClick(preset)}
              >
                {preset}%
              </button>
            ))}
            <div className="settings-modal__custom-input-wrapper">
              <input
                type="text"
                className={`settings-modal__custom-input ${
                  isCustom ? "settings-modal__custom-input--active" : ""
                }`}
                placeholder="Custom"
                value={customSlippage}
                onChange={(e) => handleCustomChange(e.target.value)}
                onFocus={() => setIsCustom(true)}
              />
              {isCustom && <span className="settings-modal__custom-suffix">%</span>}
            </div>
          </div>

          {/* Warning Message */}
          {warning && (
            <div className={`settings-modal__warning settings-modal__warning--${warning.type}`}>
              <span className="settings-modal__warning-icon">
                {warning.type === "error" ? "⚠️" : "ℹ️"}
              </span>
              <span className="settings-modal__warning-text">{warning.message}</span>
            </div>
          )}

          {/* Current Value Display */}
          <div className="settings-modal__current">
            Current: <strong>{slippageTolerance}%</strong>
          </div>
        </div>

        {/* Future: Add more settings sections here */}
        {/* 
        <div className="settings-modal__section">
          <h3 className="settings-modal__section-title">Transaction Deadline</h3>
          ...
        </div>
        */}

        {/* Close Button */}
        <button className="settings-modal__done" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
};

