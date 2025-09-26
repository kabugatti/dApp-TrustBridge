"use client";

import { useState, useEffect, useCallback } from "react";
import { useWalletContext } from "@/providers/wallet.provider";
import { 
  LenderInvestment, 
  PortfolioMetrics, 
  TransactionHistory 
} from "../types/lender-dashboard.types";

// Mock data for UI development
const mockInvestments: LenderInvestment[] = [
  {
    id: "1",
    poolId: "pool-1",
    poolName: "TrustBridge Main Pool",
    asset: {
      symbol: "USDC",
      name: "USD Coin",
      icon: "/img/tokens/usdc.png"
    },
    amount: 50000,
    value: 51250,
    apy: 4.2,
    earnedInterest: 1250,
    startDate: new Date("2024-01-15"),
    status: "active"
  },
  {
    id: "2",
    poolId: "pool-2",
    poolName: "TrustBridge Secondary Pool",
    asset: {
      symbol: "XLM",
      name: "Stellar Lumens",
      icon: "/img/tokens/xlm.png"
    },
    amount: 25000,
    value: 25875,
    apy: 3.8,
    earnedInterest: 875,
    startDate: new Date("2024-02-01"),
    status: "active"
  },
  {
    id: "3",
    poolId: "pool-3",
    poolName: "TrustBridge Token Pool",
    asset: {
      symbol: "TBT",
      name: "TrustBridge Token",
      icon: "/img/tokens/tbt.png"
    },
    amount: 50000,
    value: 52500,
    apy: 5.1,
    earnedInterest: 2500,
    startDate: new Date("2024-01-20"),
    status: "active"
  }
];

const mockMetrics: PortfolioMetrics = {
  totalInvested: 125000,
  totalEarned: 4625,
  averageAPY: 4.4,
  activeInvestments: 3,
  totalValue: 129625,
  monthlyGrowth: 2.1,
  yearlyGrowth: 15.8
};

const mockTransactions: TransactionHistory[] = [
  {
    id: "tx-1",
    type: "supply",
    asset: "USDC",
    amount: 50000,
    timestamp: new Date("2024-01-15"),
    status: "completed",
    txHash: "0x1234...5678"
  },
  {
    id: "tx-2",
    type: "interest_earned",
    asset: "USDC",
    amount: 1250,
    timestamp: new Date("2024-02-15"),
    status: "completed"
  },
  {
    id: "tx-3",
    type: "supply",
    asset: "XLM",
    amount: 25000,
    timestamp: new Date("2024-02-01"),
    status: "completed",
    txHash: "0x8765...4321"
  },
  {
    id: "tx-4",
    type: "interest_earned",
    asset: "XLM",
    amount: 875,
    timestamp: new Date("2024-03-01"),
    status: "completed"
  },
  {
    id: "tx-5",
    type: "supply",
    asset: "TBT",
    amount: 50000,
    timestamp: new Date("2024-01-20"),
    status: "completed",
    txHash: "0xabcd...efgh"
  }
];

interface LenderDashboardData {
  investments: LenderInvestment[];
  metrics: PortfolioMetrics | null;
  transactions: TransactionHistory[];
  loading: {
    investments: boolean;
    metrics: boolean;
    transactions: boolean;
  };
  error: string | null;
  refreshData: () => Promise<void>;
}

export function useLenderDashboard(): LenderDashboardData {
  const { walletAddress: address } = useWalletContext();
  
  const [investments, setInvestments] = useState<LenderInvestment[]>([]);
  const [metrics, setMetrics] = useState<PortfolioMetrics | null>(null);
  const [transactions, setTransactions] = useState<TransactionHistory[]>([]);
  const [loading, setLoading] = useState({
    investments: true,
    metrics: true,
    transactions: true
  });
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!address) {
      setLoading({
        investments: false,
        metrics: false,
        transactions: false
      });
      return;
    }

    try {
      setError(null);
      
      // Reset loading states
      setLoading({
        investments: true,
        metrics: true,
        transactions: true
      });

      // Simulate API calls with different loading times for better UX
      const timeoutIds: NodeJS.Timeout[] = [];

      // Load investments
      timeoutIds.push(setTimeout(() => {
        setInvestments(mockInvestments);
        setLoading(prev => ({ ...prev, investments: false }));
      }, 300));

      // Load metrics
      timeoutIds.push(setTimeout(() => {
        setMetrics(mockMetrics);
        setLoading(prev => ({ ...prev, metrics: false }));
      }, 500));

      // Load transactions
      timeoutIds.push(setTimeout(() => {
        setTransactions(mockTransactions);
        setLoading(prev => ({ ...prev, transactions: false }));
      }, 700));

      // Return cleanup function
      return () => {
        timeoutIds.forEach(id => clearTimeout(id));
      };

    } catch (err) {
      console.error("Error fetching lender dashboard data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch dashboard data");
      setLoading({
        investments: false,
        metrics: false,
        transactions: false
      });
    }
  }, [address]);

  // Reset loading states when wallet address changes
  const resetLoadingStates = useCallback(() => {
    if (address) {
      setLoading({
        investments: true,
        metrics: true,
        transactions: true
      });
      setError(null);
    } else {
      setLoading({
        investments: false,
        metrics: false,
        transactions: false
      });
    }
  }, [address]);

  useEffect(() => {
    resetLoadingStates();
  }, [resetLoadingStates]);

  // Fetch data when wallet address changes
  useEffect(() => {
    let isMounted = true;
    let cleanup: (() => void) | undefined;

    const loadData = async () => {
      try {
        cleanup = await fetchDashboardData();
        
        if (!isMounted && cleanup) {
          cleanup();
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error in loadData:", error);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
      if (cleanup) {
        cleanup();
      }
    };
  }, [fetchDashboardData]);

  const refreshData = async () => {
    await fetchDashboardData();
  };

  return {
    investments,
    metrics,
    transactions,
    loading,
    error,
    refreshData
  };
}
