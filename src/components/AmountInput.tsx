/**
 * Amount input component
 */

import React from "react";
import "../styles/amount-input.css";

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  placeholder = "Enter amount in USD",
  error,
  disabled = false,
}) => {
  return (
    <div className="amount-input">
      <label className="amount-input__label">USD Amount</label>
      <div className="amount-input__wrapper">
        <span className="amount-input__currency">$</span>
        <input
          type="number"
          className={`amount-input__field ${error ? "amount-input__field--error" : ""}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          min="0"
          step="0.01"
        />
      </div>
      {error && <span className="amount-input__error">{error}</span>}
    </div>
  );
};

