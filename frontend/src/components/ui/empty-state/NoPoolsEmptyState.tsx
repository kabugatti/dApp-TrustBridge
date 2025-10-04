"use client";

import * as React from "react";
import { EmptyState } from "../empty-state";
import { PoolsIllustration } from "./illustrations";

interface NoPoolsEmptyStateProps {
  onCreatePool: () => void;
  className?: string;
}

export function NoPoolsEmptyState({ 
  onCreatePool, 
  className 
}: NoPoolsEmptyStateProps) {
  return (
    <EmptyState
      illustration={<PoolsIllustration />}
      title="No lending pools available"
      description="Be the first to create a lending pool and start earning interest on your assets. Create a pool to enable lending and borrowing for the community."
      action={{
        label: "Create Pool",
        onClick: onCreatePool,
        variant: "primary"
      }}
      className={className}
    />
  );
}
