"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export interface EmptyStateProps {
  illustration?: React.ReactNode;
  title: string;
  description: string;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  centered?: boolean;
}

export function EmptyState({
  illustration,
  title,
  description,
  action,
  secondaryAction,
  className,
  size = 'lg',
  centered = true,
}: EmptyStateProps) {
  const sizeClasses = {
    sm: "py-8 px-4",
    md: "py-12 px-4",
    lg: "py-16 px-4",
  };


  return (
    <div
      className={cn(
        "flex flex-col",
        centered
          ? "items-center justify-center text-center"
          : "items-start justify-start text-left",
        sizeClasses[size],
        centered && "min-h-[300px]",
        className
      )}
    >
      {illustration && (
        <div className={cn("opacity-60 h-[120px] mb-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500")}>
          {illustration}
        </div>
      )}

      <h3 className={cn(
        "font-semibold text-white mb-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-200",
        size === 'sm' ? "text-base" : size === 'md' ? "text-lg" : "text-xl"
      )}>
        {title}
      </h3>

      <p className={cn(
        "text-gray-400 mb-6 max-w-md animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-300",
        size === 'sm' ? "text-xs" : "text-sm"
      )}> 
        {description}
      </p>

      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-500">
      {action && (
        <Button
          onClick={action.onClick}
          variant={action.variant === 'primary' ? 'default' : 'outline'}
          size={size === 'sm' ? 'default' : 'lg'}
          className="cursor-pointer"
        >
          {action.label}
        </Button>
      )}

          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant={secondaryAction.variant === 'primary' ? 'default' : 'outline'}
              size={size === 'sm' ? 'default' : 'lg'}
              className="cursor-pointer"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Re-export specialized components
export { NoPoolsEmptyState } from "./empty-state/NoPoolsEmptyState";
export { NoPositionsEmptyState } from "./empty-state/NoPositionsEmptyState";
export { WalletNotConnectedEmptyState } from "./empty-state/WalletNotConnectedEmptyState";
export { NoActivityEmptyState } from "./empty-state/NoActivityEmptyState";
export { NoSearchResultsEmptyState } from "./empty-state/NoSearchResultsEmptyState";
export { ErrorEmptyState } from "./empty-state/ErrorEmptyState";

// Re-export illustrations
export {
  PoolsIllustration,
  WalletIllustration,
  PositionsIllustration,
  ActivityIllustration,
  SearchIllustration,
  ErrorIllustration,
} from "./empty-state/illustrations";
