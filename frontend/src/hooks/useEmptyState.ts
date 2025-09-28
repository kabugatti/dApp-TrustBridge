"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/components/modules/auth/hooks/wallet.hook";

export type EmptyStateContext = 
  | 'first-time-user' 
  | 'returning-user' 
  | 'no-results' 
  | 'error' 
  | 'wallet-disconnected';

export interface EmptyStateMetadata {
  searchQuery?: string;
  filterCount?: number;
  lastActivity?: Date;
  error?: string;
  hasWallet?: boolean;
}

export interface EmptyStateConfig {
  context: EmptyStateContext;
  metadata?: EmptyStateMetadata;
  customActions?: {
    primary?: {
      label: string;
      action: () => void;
    };
    secondary?: {
      label: string;
      action: () => void;
    };
  };
}

export function useEmptyState(config: EmptyStateConfig) {
  const router = useRouter();
  const { connectWallet } = useWallet();

  // Default actions based on context
  const getDefaultActions = useCallback(() => {
    const { context } = config;

    switch (context) {
      case 'first-time-user':
        return {
          primary: {
            label: "Get Started",
            action: () => router.push('/dashboard/marketplace')
          },
          secondary: {
            label: "Learn More",
            action: () => router.push('/docs')
          }
        };

      case 'returning-user':
        return {
          primary: {
            label: "View Dashboard",
            action: () => router.push('/dashboard')
          },
          secondary: {
            label: "Browse Pools",
            action: () => router.push('/dashboard/marketplace')
          }
        };

      case 'no-results':
        return {
          primary: {
            label: "Clear Filters",
            action: () => router.refresh()
          },
          secondary: {
            label: "Browse All",
            action: () => router.push('/dashboard/marketplace')
          }
        };

      case 'error':
        return {
          primary: {
            label: "Try Again",
            action: () => router.refresh()
          },
          secondary: {
            label: "Contact Support",
            action: () => router.push('/support')
          }
        };

      case 'wallet-disconnected':
        return {
          primary: {
            label: "Connect Wallet",
            action: () => { void connectWallet(); }
          }
        };

      default:
        return {};
    }
  }, [config, router]);

  // Get contextual messages based on context and metadata
  const getContextualMessage = useCallback(() => {
    const { context, metadata } = config;

    switch (context) {
      case 'first-time-user': {
        return {
          title: "Welcome to TrustBridge",
          description: "Start your DeFi journey by connecting your wallet and exploring lending pools. Supply assets to earn interest or borrow against your collateral."
        };
      }

      case 'returning-user': {
        const lastActivity = metadata?.lastActivity;
        const daysSinceActivity = lastActivity 
          ? Math.floor((Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))
          : null;

        if (daysSinceActivity && daysSinceActivity > 7) {
          return {
            title: "Welcome back!",
            description: `It's been ${daysSinceActivity} days since your last activity. Check out the latest pools and opportunities available.`
          };
        }

        return {
          title: "Welcome back!",
          description: "Continue managing your positions and explore new opportunities in the lending pools."
        };
      }

      case 'no-results': {
        const searchQuery = metadata?.searchQuery;
        const filterCount = metadata?.filterCount || 0;

        if (searchQuery) {
          return {
            title: `No results for "${searchQuery}"`,
            description: `We couldn't find any pools matching your search. Try different keywords or browse all available pools.`
          };
        }

        if (filterCount > 0) {
          return {
            title: "No pools match your filters",
            description: `You have ${filterCount} active filter${filterCount > 1 ? 's' : ''}. Try adjusting your criteria or clear all filters to see more pools.`
          };
        }

        return {
          title: "No pools available",
          description: "There are currently no lending pools available. Check back later or create a new pool to get started."
        };
      }

      case 'error': {
        return {
          title: "Something went wrong",
          description: metadata?.error || "We encountered an error while loading your data. Please try again or contact support if the problem persists."
        };
      }

      case 'wallet-disconnected': {
        return {
          title: "Connect your wallet",
          description: "Connect your Stellar wallet to access lending pools and manage your positions. Your wallet is required to interact with the DeFi protocol."
        };
      }

      default: {
        return {
          title: "No data available",
          description: "There's no data to display at the moment."
        };
      }
    }
  }, [config]);

  // Get personalized recommendations based on user context
  const getRecommendations = useCallback(() => {
    const { context } = config;

    switch (context) {
      case 'first-time-user':
        return [
          "Connect your Stellar wallet to get started",
          "Explore available lending pools",
          "Start with a small supply to learn the platform"
        ];

      case 'returning-user':
        return [
          "Check your current positions and performance",
          "Explore new lending opportunities",
          "Review your portfolio allocation"
        ];

      case 'no-results':
        return [
          "Try different search terms",
          "Clear your current filters",
          "Browse all available pools"
        ];

      case 'error':
        return [
          "Check your internet connection",
          "Try refreshing the page",
          "Contact support if the issue persists"
        ];

      case 'wallet-disconnected':
        return [
          "Make sure you have a Stellar wallet installed",
          "Check that your wallet is unlocked",
          "Try reconnecting your wallet"
        ];

      default:
        return [];
    }
  }, [config]);

  // Memoized configuration
  const emptyStateConfig = useMemo(() => {
    const defaultActions = getDefaultActions();
    const message = getContextualMessage();
    const recommendations = getRecommendations();

    return {
      ...message,
      actions: config.customActions || defaultActions,
      recommendations,
      context: config.context,
      metadata: config.metadata
    };
  }, [config, getDefaultActions, getContextualMessage, getRecommendations]);

  return emptyStateConfig;
}

// Utility hook for common empty state scenarios
export function useCommonEmptyStates() {
  const router = useRouter();
  const { connectWallet } = useWallet();

  const navigateToMarketplace = useCallback(() => {
    router.push('/dashboard/marketplace');
  }, [router]);

  const navigateToDashboard = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  const refreshPage = useCallback(() => {
    router.refresh();
  }, [router]);

  const connectWalletAction = useCallback(() => {
    void connectWallet();
  }, [connectWallet]);

  return {
    navigateToMarketplace,
    navigateToDashboard,
    refreshPage,
    connectWallet: connectWalletAction
  };
}
