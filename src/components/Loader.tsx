/**
 * Loading spinner component
 */

import React from "react";

interface LoaderProps {
  size?: "small" | "medium" | "large";
}

export const Loader: React.FC<LoaderProps> = ({ size = "medium" }) => {
  const sizeClasses = {
    small: "w-5 h-5",
    medium: "w-10 h-10",
    large: "w-[60px] h-[60px]"
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} border-[3px] border-border border-t-primary rounded-full animate-spin`}></div>
    </div>
  );
};

