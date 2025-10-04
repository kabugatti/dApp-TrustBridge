"use client";

import * as React from "react";
import { EmptyState } from "../empty-state";
import { ErrorIllustration } from "./illustrations";

interface ErrorEmptyStateProps {
  onRetry: () => void;
  error?: string;
  className?: string;
}

export function ErrorEmptyState({ 
  onRetry, 
  error,
  className 
}: ErrorEmptyStateProps) {
  return (
    <EmptyState
      illustration={<ErrorIllustration />}
      title="Something went wrong"
      description={error || "We encountered an error while loading your data. Please try again or contact support if the problem persists."}
      action={{
        label: "Try Again",
        onClick: onRetry,
        variant: "primary"
      }}
      className={className}
    />
  );
}
