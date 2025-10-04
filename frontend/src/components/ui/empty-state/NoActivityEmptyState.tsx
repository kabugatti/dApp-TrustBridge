"use client";

import { EmptyState } from "../empty-state";
import { ActivityIllustration } from "./illustrations";

interface NoActivityEmptyStateProps {
  onStartTrading: () => void;
  className?: string;
}

export function NoActivityEmptyState({ 
  onStartTrading, 
  className 
}: NoActivityEmptyStateProps) {
  return (
    <EmptyState
      illustration={<ActivityIllustration />}
      title="No recent activity"
      description="Your transaction history will appear here once you start interacting with pools. Supply assets, borrow funds, or manage your positions to see activity."
      action={{
        label: "Start Trading",
        onClick: onStartTrading,
        variant: "primary"
      }}
      className={className}
    />
  );
}
