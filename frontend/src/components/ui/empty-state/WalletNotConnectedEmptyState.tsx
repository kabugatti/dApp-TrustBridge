"use client";

import { EmptyState } from "../empty-state";
import { WalletIllustration } from "./illustrations";

interface WalletNotConnectedEmptyStateProps {
  onConnect: () => void;
  className?: string;
}

export function WalletNotConnectedEmptyState({ 
  onConnect, 
  className 
}: WalletNotConnectedEmptyStateProps) {
  return (
    <EmptyState
      illustration={<WalletIllustration />}
      title="Connect your wallet to get started"
      description="Connect your Stellar wallet to access lending pools and manage your positions. Your wallet is required to interact with the DeFi protocol."
      action={{
        label: "Connect Wallet",
        onClick: onConnect,
        variant: "primary"
      }}
      className={className}
    />
  );
}
