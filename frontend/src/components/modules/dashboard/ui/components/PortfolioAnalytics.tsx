"use client";

import { useState, useEffect } from "react";
import { useWalletContext } from "@/providers/wallet.provider";
import { 
  getUserPositions, 
  calculateHealthFactor, 
  type HealthFactorResult,
  type PositionInfo 
} from "@/helpers/health-factor.helper";
import { formatCurrency } from "@/helpers/user-positions.helper";

interface PortfolioAnalyticsProps {
  className?: string;
}

export function PortfolioAnalytics({ className = "" }: PortfolioAnalyticsProps) {
  const { walletAddress } = useWalletContext();
  const [positions, setPositions] = useState<PositionInfo[]>([]);
  const [healthFactor, setHealthFactor] = useState<HealthFactorResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1D' | '7D' | '30D' | '90D'>('7D');

  useEffect(() => {
    if (!walletAddress) {
      setLoading(false);
      return;
    }

    const loadPortfolioData = async () => {
      try {
        setLoading(true);
        const userPositions = await getUserPositions(walletAddress);
        setPositions(userPositions);
        
        if (userPositions.length > 0) {
          const health = calculateHealthFactor(userPositions);
          setHealthFactor(health);
        }
      } catch (error) {
        console.error('Error loading portfolio data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPortfolioData();
  }, [walletAddress]);

  // Calculate portfolio metrics
  const totalValue = positions.reduce((sum, pos) => sum + (pos.supplied * pos.price), 0);
  const totalBorrowed = positions.reduce((sum, pos) => sum + (pos.borrowed * pos.price), 0);
  const netValue = totalValue - totalBorrowed;
  const utilizationRate = totalValue > 0 ? (totalBorrowed / totalValue) * 100 : 0;

  // Mock performance data (in production, this would come from historical data)
  const performanceData = {
    '1D': { change: 2.5, pnl: 125.50 },
    '7D': { change: 8.2, pnl: 410.75 },
    '30D': { change: 15.8, pnl: 789.25 },
    '90D': { change: 28.4, pnl: 1420.00 }
  };

  const currentPerformance = performanceData[selectedTimeframe];

  if (loading) {
    return (
      <div className={`card p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Portfolio Analytics</h3>
          <p className="text-sm text-gray-400">Comprehensive analysis of your positions</p>
        </div>
        
        {/* Timeframe Selector */}
        <div className="flex bg-dark-tertiary rounded-lg p-1">
          {(['1D', '7D', '30D', '90D'] as const).map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                selectedTimeframe === timeframe
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Portfolio Value */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Total Value</span>
            <i className="fas fa-chart-line text-success"></i>
          </div>
          <div className="text-xl font-bold text-white">
            {formatCurrency(totalValue)}
          </div>
          <div className="flex items-center mt-1">
            <span className={`text-xs ${currentPerformance.change >= 0 ? 'text-success' : 'text-danger'}`}>
              {currentPerformance.change >= 0 ? '+' : ''}{currentPerformance.change}%
            </span>
            <span className="text-xs text-gray-400 ml-2">
              {formatCurrency(currentPerformance.pnl)}
            </span>
          </div>
        </div>

        {/* Net Position Value */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Net Position</span>
            <i className="fas fa-balance-scale text-blue-400"></i>
          </div>
          <div className="text-xl font-bold text-white">
            {formatCurrency(netValue)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {totalBorrowed > 0 ? `${((netValue / totalValue) * 100).toFixed(1)}% of total` : 'No debt'}
          </div>
        </div>

        {/* Utilization Rate */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Utilization</span>
            <i className="fas fa-percentage text-warning"></i>
          </div>
          <div className="text-xl font-bold text-white">
            {utilizationRate.toFixed(1)}%
          </div>
          <div className="mt-2">
            <div className="w-full bg-dark-tertiary rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  utilizationRate < 50 ? 'bg-success' : utilizationRate < 80 ? 'bg-warning' : 'bg-danger'
                }`}
                style={{ width: `${Math.min(100, utilizationRate)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Health Factor Analysis */}
      {healthFactor && (
        <div className="card p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-white">Health Factor Analysis</h4>
            <div className={`px-2 py-1 rounded text-xs ${
              healthFactor.riskLevel === 'safe' ? 'bg-green-900 text-green-300' :
              healthFactor.riskLevel === 'warning' ? 'bg-yellow-900 text-yellow-300' :
              'bg-red-900 text-red-300'
            }`}>
              {healthFactor.riskLevel.toUpperCase()}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-400">Health Factor</div>
              <div className={`text-lg font-bold ${
                healthFactor.riskLevel === 'safe' ? 'text-success' :
                healthFactor.riskLevel === 'warning' ? 'text-warning' :
                'text-danger'
              }`}>
                {healthFactor.healthFactor.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Collateral Ratio</div>
              <div className="text-lg font-bold text-white">
                {healthFactor.collateralRatio.toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Collateral Value</div>
              <div className="text-lg font-bold text-white">
                {formatCurrency(healthFactor.collateralValue)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Borrowed Value</div>
              <div className="text-lg font-bold text-warning">
                {formatCurrency(healthFactor.borrowedValue)}
              </div>
            </div>
          </div>

          {/* Health Factor Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Liquidation Threshold (1.0)</span>
              <span>Safe Zone (2.0+)</span>
            </div>
            <div className="w-full bg-dark-tertiary rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  healthFactor.riskLevel === 'safe' ? 'bg-success' :
                  healthFactor.riskLevel === 'warning' ? 'bg-warning' :
                  'bg-danger'
                }`}
                style={{ 
                  width: `${Math.min(100, Math.max(0, (healthFactor.healthFactor / 3) * 100))}%` 
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Asset Allocation */}
      <div className="card p-4 mb-6">
        <h4 className="text-md font-medium text-white mb-4">Asset Allocation</h4>
        
        {positions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <i className="fas fa-chart-pie text-3xl mb-3"></i>
            <p>No positions found</p>
            <p className="text-sm">Start by supplying assets to see your allocation</p>
          </div>
        ) : (
          <div className="space-y-3">
            {positions.map((position) => {
              const positionValue = position.supplied * position.price;
              const allocationPercentage = totalValue > 0 ? (positionValue / totalValue) * 100 : 0;
              
              return (
                <div key={position.asset} className="flex items-center justify-between p-3 bg-dark-tertiary rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                      <span className="text-xs font-bold">{position.asset}</span>
                    </div>
                    <div>
                      <div className="font-medium text-white">{position.asset}</div>
                      <div className="text-xs text-gray-400">
                        {position.supplied.toFixed(2)} {position.asset} supplied
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium text-white">
                      {formatCurrency(positionValue)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {allocationPercentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Risk Metrics */}
      <div className="card p-4">
        <h4 className="text-md font-medium text-white mb-4">Risk Metrics</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Portfolio Beta</span>
              <span className="text-sm font-medium text-white">0.85</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Sharpe Ratio</span>
              <span className="text-sm font-medium text-success">1.24</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Max Drawdown</span>
              <span className="text-sm font-medium text-danger">-8.5%</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Volatility (30D)</span>
              <span className="text-sm font-medium text-white">12.3%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">VaR (95%)</span>
              <span className="text-sm font-medium text-warning">$2,450</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Liquidation Risk</span>
              <span className={`text-sm font-medium ${
                healthFactor?.riskLevel === 'safe' ? 'text-success' :
                healthFactor?.riskLevel === 'warning' ? 'text-warning' :
                'text-danger'
              }`}>
                {healthFactor?.riskLevel === 'safe' ? 'Low' :
                 healthFactor?.riskLevel === 'warning' ? 'Medium' : 'High'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
