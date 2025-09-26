"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TransactionHistory as TransactionHistoryType } from "../../types/lender-dashboard.types";
import { 
  DownloadIcon, 
  SearchIcon, 
  FilterIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  DollarSignIcon
} from "lucide-react";

interface TransactionHistoryProps {
  transactions: TransactionHistoryType[];
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

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const getTransactionIcon = (type: string) => {
  switch (type) {
    case 'supply':
      return <ArrowDownIcon className="w-4 h-4 text-[#35bb64]" />;
    case 'withdraw':
      return <ArrowUpIcon className="w-4 h-4 text-orange-400" />;
    case 'interest_earned':
      return <DollarSignIcon className="w-4 h-4 text-purple-400" />;
    default:
      return <DollarSignIcon className="w-4 h-4 text-gray-400" />;
  }
};

const getTransactionTypeLabel = (type: string): string => {
  switch (type) {
    case 'supply':
      return 'Supply';
    case 'withdraw':
      return 'Withdraw';
    case 'interest_earned':
      return 'Interest Earned';
    default:
      return type;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'text-[#35bb64] border-[#35bb64]';
    case 'pending':
      return 'text-yellow-400 border-yellow-400';
    case 'failed':
      return 'text-red-400 border-red-400';
    default:
      return 'text-gray-400 border-gray-400';
  }
};

export function TransactionHistory({ transactions, loading }: TransactionHistoryProps) {
  if (loading) {
    return (
      <Card className="card mb-8">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-neutral-700 rounded-lg">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
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

  if (transactions.length === 0) {
    return (
      <Card className="card mb-8">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-700 flex items-center justify-center">
              <DollarSignIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No transactions yet</h3>
            <p className="text-gray-400">
              Your lending transactions will appear here once you start investing
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Transaction History</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-neutral-600 text-gray-300">
              <SearchIcon className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" size="sm" className="border-neutral-600 text-gray-300">
              <FilterIcon className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="border-neutral-600 text-gray-300">
              <DownloadIcon className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div 
              key={transaction.id} 
              className="flex items-center justify-between p-4 border border-neutral-700 rounded-lg hover:bg-neutral-700/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-neutral-700">
                  {getTransactionIcon(transaction.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-white">
                      {getTransactionTypeLabel(transaction.type)}
                    </h4>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getStatusColor(transaction.status)}`}
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400">
                    {transaction.asset} • {formatDate(transaction.timestamp)}
                  </p>
                  {transaction.txHash && (
                    <p className="text-xs text-gray-500 font-mono">
                      {transaction.txHash}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className={`font-semibold ${
                  transaction.type === 'withdraw' ? 'text-orange-400' : 'text-[#35bb64]'
                }`}>
                  {transaction.type === 'withdraw' ? '-' : '+'}{formatCurrency(transaction.amount)}
                </div>
                <div className="text-xs text-gray-400">
                  {transaction.asset}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-neutral-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Showing {transactions.length} of {transactions.length} transactions
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-neutral-600 text-gray-300">
                Previous
              </Button>
              <Button variant="outline" size="sm" className="border-neutral-600 text-gray-300">
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
