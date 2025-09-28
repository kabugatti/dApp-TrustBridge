"use client";

import { EmptyState } from "../empty-state";
import { PositionsIllustration } from "./illustrations";

interface NoPositionsEmptyStateProps {
  onSupplyAssets: () => void;
  onBrowsePools: () => void;
  className?: string;
}

export function NoPositionsEmptyState({
  onSupplyAssets,
  onBrowsePools,
  className
}: NoPositionsEmptyStateProps) {
  return (
    <EmptyState
      illustration={<PositionsIllustration />}
      title="You haven't supplied or borrowed any assets yet"
      description="Start your DeFi journey by supplying assets to earn interest or borrowing against your collateral. Explore available pools to get started."
      action={{
        label: "Supply Assets",
        onClick: onSupplyAssets,
        variant: "primary"
      }}
      secondaryAction={{
        label: "Browse Pools",
        onClick: onBrowsePools
      }}
      className={className}
    />
  );
}
