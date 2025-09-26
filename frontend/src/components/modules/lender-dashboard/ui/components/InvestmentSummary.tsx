"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PortfolioMetrics } from "../../types/lender-dashboard.types";
import { 
  DollarSignIcon, 
  TrendingUpIcon, 
  PiggyBankIcon, 
  BarChart3Icon 
} from "lucide-react";

interface InvestmentSummaryProps {
  metrics: PortfolioMetrics | null;
  loading: boolean;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export function InvestmentSummary({ metrics, loading }: InvestmentSummaryProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="card">
            <CardContent className="p-6">
              <div className="text-center text-gray-400">
                <p>No data available</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const summaryCards = [
    {
      title: "Total Invested",
      value: formatCurrency(metrics.totalInvested),
      subtitle: "Total amount invested",
      icon: <DollarSignIcon size={20} />,
      change: `+${formatPercentage(metrics.monthlyGrowth)}`,
      changeType: "positive" as const,
      color: "text-blue-400"
    },
    {
      title: "Total Earned",
      value: formatCurrency(metrics.totalEarned),
      subtitle: "Interest earned to date",
      icon: <PiggyBankIcon size={20} />,
      change: `+${formatPercentage(metrics.yearlyGrowth)}`,
      changeType: "positive" as const,
      color: "text-[#35bb64]"
    },
    {
      title: "Average APY",
      value: formatPercentage(metrics.averageAPY),
      subtitle: "Across all investments",
      icon: <BarChart3Icon size={20} />,
      change: "+0.2%",
      changeType: "positive" as const,
      color: "text-purple-400"
    },
    {
      title: "Active Investments",
      value: metrics.activeInvestments.toString(),
      subtitle: `${metrics.activeInvestments} active position${metrics.activeInvestments !== 1 ? 's' : ''}`,
      icon: <TrendingUpIcon size={20} />,
      change: "+1",
      changeType: "positive" as const,
      color: "text-orange-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {summaryCards.map((card, index) => (
        <Card key={index} className="card hover:bg-neutral-700/30 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-gray-400 font-medium">{card.title}</p>
                <p className="text-2xl font-bold text-white">{card.value}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${card.changeType === 'positive' ? 'text-[#35bb64]' : 'text-red-400'}`}>
                    {card.change}
                  </span>
                  <span className="text-xs text-gray-400">{card.subtitle}</span>
                </div>
              </div>
              <div className={`p-3 rounded-full bg-neutral-700 ${card.color}`}>
                {card.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
