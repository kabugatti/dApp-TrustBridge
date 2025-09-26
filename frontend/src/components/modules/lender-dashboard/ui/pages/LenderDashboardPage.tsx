"use client";

import { useLenderDashboard } from "../../hooks/useLenderDashboard.hook";
import { InvestmentSummary } from "../components/InvestmentSummary";
import { PortfolioOverview } from "../components/PortfolioOverview";
import { PerformanceMetrics } from "../components/PerformanceMetrics";
import { TransactionHistory } from "../components/TransactionHistory";
import { useWalletContext } from "@/providers/wallet.provider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCwIcon, AlertTriangleIcon } from "lucide-react";

export default function LenderDashboardPage() {
  const {
    investments,
    metrics,
    transactions,
    loading,
    error,
    refreshData
  } = useLenderDashboard();

  const { walletAddress: address, walletName } = useWalletContext();

  const getWalletDisplayName = () => {
    if (!address) return "Usuario";
    if (walletName) return walletName;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (!address) {
    return (
      <div className="container mx-auto px-4 md:px-6 pt-24 pb-16 max-w-6xl">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-700 flex items-center justify-center">
            <AlertTriangleIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Wallet Not Connected</h3>
          <p className="text-gray-400 mb-6">
            Please connect your wallet to view your investment dashboard
          </p>
          <Button className="bg-[#35bb64] hover:bg-[#2da354] text-white">
            Connect Wallet
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 pt-24 pb-16 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Investment Dashboard
            </h1>
            <p className="text-gray-400">
              Welcome back, <span className="text-[#35bb64]">{getWalletDisplayName()}</span> • 
              Track your investments and returns
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-neutral-600 text-gray-300 hover:bg-neutral-600"
            onClick={refreshData}
            disabled={loading.investments || loading.metrics || loading.transactions}
          >
            <RefreshCwIcon className={`w-4 h-4 mr-2 ${(loading.investments || loading.metrics || loading.transactions) ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert className="mb-6 border-red-800 bg-red-900/20">
          <AlertTriangleIcon className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-200">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Investment Summary Cards */}
      <InvestmentSummary 
        metrics={metrics} 
        loading={loading.metrics} 
      />
      
      {/* Portfolio Overview */}
      <PortfolioOverview 
        investments={investments} 
        loading={loading.investments} 
      />
      
      {/* Performance Metrics */}
      <PerformanceMetrics />
      
      {/* Transaction History */}
      <TransactionHistory 
        transactions={transactions} 
        loading={loading.transactions} 
      />

      {/* Quick Actions Footer */}
      <div className="mt-8 pt-8 border-t border-neutral-700">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-400">
            <p>Need help with your investments?</p>
            <p>Contact our support team or check our documentation</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-neutral-600 text-gray-300 hover:bg-neutral-600">
              View Documentation
            </Button>
            <Button className="bg-[#35bb64] hover:bg-[#2da354] text-white">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
