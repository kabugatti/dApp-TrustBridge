export interface LenderInvestment {
  id: string;
  poolId: string;
  poolName: string;
  asset: {
    symbol: string;
    name: string;
    icon: string;
  };
  amount: number;
  value: number;
  apy: number;
  earnedInterest: number;
  startDate: Date;
  status: 'active' | 'withdrawn' | 'pending';
}

export interface PortfolioMetrics {
  totalInvested: number;
  totalEarned: number;
  averageAPY: number;
  activeInvestments: number;
  totalValue: number;
  monthlyGrowth: number;
  yearlyGrowth: number;
}

export interface TransactionHistory {
  id: string;
  type: 'supply' | 'withdraw' | 'interest_earned';
  asset: string;
  amount: number;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
  txHash?: string;
}

export interface InvestmentCard {
  poolName: string;
  asset: string;
  investedAmount: number;
  currentValue: number;
  apy: number;
  earnedInterest: number;
  duration: string;
  status: 'active' | 'matured';
}

export interface PerformanceData {
  date: string;
  value: number;
  apy: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}
