"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  BarChart3,
  BarChart2,
  DollarSign,
  Clock,
  RefreshCw,
} from "lucide-react";

// Time range selector
const TIME_RANGE_OPTIONS = [
  { value: "24h", label: "24H", description: "Last 24 hours" },
  { value: "7d", label: "7D", description: "Last 7 days" },
  { value: "30d", label: "30D", description: "Last 30 days" },
  { value: "90d", label: "90D", description: "Last 90 days" },
];

function TimeRangeSelector({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange: (range: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Clock className="h-4 w-4" />
        <span>Time Range:</span>
      </div>

      <div className="flex bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden">
        {TIME_RANGE_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => !disabled && onChange(option.value)}
            disabled={disabled}
            className={`
              px-3 py-1.5 text-sm font-medium transition-all duration-200
              ${
                value === option.value
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-neutral-700"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
            title={option.description}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// Chart placeholder component
function ChartPlaceholder({
  title,
  subtitle,
  icon,
  height = "300px",
  stats,
}: {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  height?: string;
  stats?: { label: string; value: string; trend?: string }[];
}) {
  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-900/30 rounded-lg">{icon}</div>
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            {subtitle && (
              <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        <button className="p-2 text-gray-400 hover:text-white transition-colors">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Chart Area */}
      <div
        style={{ height }}
        className="relative bg-neutral-800/20 rounded-lg border border-neutral-700 flex items-center justify-center"
      >
        <div className="text-center">
          <div className="text-gray-400 mb-2">{icon}</div>
          <p className="text-sm text-gray-500">
            Chart will be implemented here
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Interactive {title.toLowerCase()} visualization
          </p>
        </div>
      </div>

      {/* Stats */}
      {stats && stats.length > 0 && (
        <div className="mt-4 pt-4 border-t border-neutral-700">
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-gray-400 mb-1">{stat.label}</div>
                <div className="font-semibold text-white">{stat.value}</div>
                {stat.trend && (
                  <div
                    className={`text-xs ${
                      stat.trend.includes("+")
                        ? "text-green-400"
                        : stat.trend.includes("-")
                          ? "text-red-400"
                          : "text-gray-400"
                    }`}
                  >
                    {stat.trend}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ComprehensiveAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7d");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Pool Analytics</h2>
          <p className="text-gray-400">
            Historical data and performance metrics
          </p>
        </div>

        <div className="flex items-center gap-4">
          <TimeRangeSelector
            value={timeRange}
            onChange={setTimeRange}
            disabled={isRefreshing}
          />

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* APY Chart */}
        <ChartPlaceholder
          title="APY Historical Trends"
          subtitle="Annual Percentage Yield over time for different assets"
          icon={<TrendingUp className="h-5 w-5 text-blue-400" />}
          height="350px"
          stats={[
            { label: "USDC APY", value: "4.5%", trend: "+0.2%" },
            { label: "XLM APY", value: "6.8%", trend: "+0.5%" },
          ]}
        />

        {/* Utilization Chart */}
        <ChartPlaceholder
          title="Pool Utilization Rate"
          subtitle="Currently at 75.3% ↗"
          icon={<BarChart3 className="h-5 w-5 text-green-400" />}
          height="350px"
          stats={[
            { label: "Current", value: "75.3%", trend: "+2.1%" },
            { label: "Avg (7d)", value: "72.1%", trend: "+1.4%" },
          ]}
        />

        {/* Volume Chart */}
        <ChartPlaceholder
          title="Supply & Borrow Volume"
          subtitle="Total Supply: $1.5M | Total Borrow: $800K"
          icon={<BarChart2 className="h-5 w-5 text-yellow-400" />}
          height="350px"
          stats={[
            { label: "Supply Vol", value: "$1.5M", trend: "+12.3%" },
            { label: "Borrow Vol", value: "$800K", trend: "+8.7%" },
          ]}
        />

        {/* TVL Chart */}
        <ChartPlaceholder
          title="Total Value Locked (TVL)"
          subtitle="Current: $25.2M ↗ 5.4%"
          icon={<DollarSign className="h-5 w-5 text-blue-400" />}
          height="350px"
          stats={[
            { label: "Current TVL", value: "$25.2M", trend: "+5.4%" },
            { label: "Growth (30d)", value: "+18.2%", trend: "↗" },
          ]}
        />
      </div>

      {/* Additional Analytics Summary */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Analytics Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-300">Pool Health</h4>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-white">Healthy</span>
            </div>
            <p className="text-xs text-gray-400">
              Utilization rate is within optimal range (60-80%)
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-300">Market Trend</h4>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-sm text-white">Growing</span>
            </div>
            <p className="text-xs text-gray-400">
              TVL increased by 18.2% over the last 30 days
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-300">Next Update</h4>
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-blue-400" />
              <span className="text-sm text-white">2 min</span>
            </div>
            <p className="text-xs text-gray-400">
              Real-time data updates every 5 minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
