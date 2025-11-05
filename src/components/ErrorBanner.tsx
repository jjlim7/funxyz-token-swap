/**
 * Error banner component
 */

import React from "react";

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  onRetry,
  onDismiss,
}) => {
  return (
    <div className="flex justify-between items-center gap-md p-md px-lg bg-red-50 border border-red-200 rounded-md animate-slideIn">
      <div className="flex items-center gap-md flex-1">
        <span className="text-xl flex-shrink-0">⚠️</span>
        <span className="text-sm text-error font-medium leading-[1.4]">{message}</span>
      </div>
      <div className="flex gap-sm flex-shrink-0">
        {onRetry && (
          <button className="px-md py-xs rounded-sm text-xs font-semibold uppercase tracking-wider transition-all duration-base cursor-pointer border-none bg-error text-white hover:bg-[#dc2626] hover:-translate-y-px hover:shadow-sm" onClick={onRetry}>
            Retry
          </button>
        )}
        {onDismiss && (
          <button className="px-md py-xs rounded-sm text-xs font-semibold uppercase tracking-wider transition-all duration-base cursor-pointer bg-transparent text-error border border-error hover:bg-error hover:text-white" onClick={onDismiss}>
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
};

