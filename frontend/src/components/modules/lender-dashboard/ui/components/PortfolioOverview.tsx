"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { LenderInvestment } from "../../types/lender-dashboard.types";
import { WithdrawModal } from "./WithdrawModal";
import { 
  TrendingUpIcon, 
  DollarSignIcon, 
  CalendarIcon,
  MoreHorizontalIcon 
} from "lucide-react";
import Image from "next/image";

interface PortfolioOverviewProps {
  investments: LenderInvestment[];
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



const getDuration = (startDate: Date): string => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) {
    return `${diffDays} days`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months !== 1 ? 's' : ''}`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} year${years !== 1 ? 's' : ''}`;
  }
};

export function PortfolioOverview({ investments, loading }: PortfolioOverviewProps) {
  const [selectedInvestment, setSelectedInvestment] = useState<LenderInvestment | undefined>();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const handleWithdraw = (investment: LenderInvestment) => {
    setSelectedInvestment(investment);
    setShowWithdrawModal(true);
  };

  const handleCloseWithdrawModal = () => {
    setShowWithdrawModal(false);
    setSelectedInvestment(undefined);
  };
  if (loading) {
    return (
      <Card className="card mb-8">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-neutral-700 rounded-lg">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (investments.length === 0) {
    return (
      <Card className="card mb-8">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Portfolio Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-700 flex items-center justify-center">
              <TrendingUpIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No investments yet</h3>
            <p className="text-gray-400 mb-6">
              Start earning by supplying assets to TrustBridge pools
            </p>
            <Button className="bg-[#35bb64] hover:bg-[#2da354] text-white">
              Start Investing
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="card mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Portfolio Overview</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[#35bb64] border-[#35bb64]">
              {investments.length} Active
            </Badge>
            <Button variant="outline" size="sm" className="border-neutral-600 text-gray-300">
              <MoreHorizontalIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {investments.map((investment) => (
            <div 
              key={investment.id} 
              className="flex items-center justify-between p-4 border border-neutral-700 rounded-lg hover:bg-neutral-700/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Image
                    src={investment.asset.icon}
                    alt={investment.asset.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center hidden">
                    <DollarSignIcon className="w-6 h-6 text-gray-500" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-white">{investment.asset.symbol}</h4>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        investment.status === 'active' 
                          ? 'text-[#35bb64] border-[#35bb64]' 
                          : 'text-gray-400 border-gray-400'
                      }`}
                    >
                      {investment.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400">{investment.poolName}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <CalendarIcon className="w-3 h-3" />
                      <span>{getDuration(investment.startDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">
                      {formatCurrency(investment.value)}
                    </span>
                    <span className="text-xs text-[#35bb64]">
                      +{formatCurrency(investment.earnedInterest)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">
                      {formatCurrency(investment.amount)} invested
                    </span>
                    <span className="text-sm text-[#35bb64] font-medium">
                      {formatPercentage(investment.apy)} APY
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-[#35bb64] text-[#35bb64] hover:bg-[#35bb64] hover:text-white"
                >
                  Add Funds
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-neutral-600 text-gray-300 hover:bg-neutral-600"
                  onClick={() => handleWithdraw(investment)}
                >
                  Withdraw
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-neutral-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Total Portfolio Value: <span className="text-white font-semibold">
                {formatCurrency(investments.reduce((sum, inv) => sum + inv.value, 0))}
              </span>
            </div>
            <Button className="bg-[#35bb64] hover:bg-[#2da354] text-white">
              View All Investments
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Withdraw Modal */}
    <WithdrawModal
      isOpen={showWithdrawModal}
      onClose={handleCloseWithdrawModal}
      investment={selectedInvestment}
    />
  </>
  );
}
