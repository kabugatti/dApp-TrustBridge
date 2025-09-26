"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUpIcon, 
  BarChart3Icon,
  CalendarIcon 
} from "lucide-react";

export function PerformanceMetrics() {
  // Mock performance data - in real implementation this would come from the hook
  const performanceData = {
    portfolioValue: 129625,
    totalReturn: 4625,
    totalReturnPercentage: 3.7,
    monthlyReturn: 2.1,
    yearlyReturn: 15.8,
    averageAPY: 4.4
  };

  const timeRanges = [
    { label: "1M", value: "1m", active: false },
    { label: "3M", value: "3m", active: false },
    { label: "6M", value: "6m", active: false },
    { label: "1Y", value: "1y", active: true },
    { label: "ALL", value: "all", active: false }
  ];

  return (
    <Card className="card mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Performance Metrics</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-neutral-600 text-gray-300">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-neutral-800 border-neutral-700">
            <TabsTrigger 
              value="overview"
              className="text-[#35bb64] data-[state=active]:bg-neutral-800 data-[state=active]:text-[#35bb64]"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="charts"
              className="data-[state=active]:bg-neutral-800"
            >
              Charts
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-neutral-800"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Performance Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Return</p>
                      <p className="text-2xl font-bold text-white">
                        ${performanceData.totalReturn.toLocaleString()}
                      </p>
                      <p className="text-sm text-[#35bb64]">
                        +{performanceData.totalReturnPercentage}%
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-neutral-700 text-[#35bb64]">
                      <TrendingUpIcon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Monthly Return</p>
                      <p className="text-2xl font-bold text-white">
                        +{performanceData.monthlyReturn}%
                      </p>
                      <p className="text-sm text-gray-400">This month</p>
                    </div>
                    <div className="p-3 rounded-full bg-neutral-700 text-blue-400">
                      <BarChart3Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Yearly Return</p>
                      <p className="text-2xl font-bold text-white">
                        +{performanceData.yearlyReturn}%
                      </p>
                      <p className="text-sm text-gray-400">This year</p>
                    </div>
                    <div className="p-3 rounded-full bg-neutral-700 text-purple-400">
                      <CalendarIcon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Time Range Selector */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">Portfolio Performance</h3>
              <div className="flex items-center gap-2">
                {timeRanges.map((range) => (
                  <Button
                    key={range.value}
                    variant={range.active ? "default" : "outline"}
                    size="sm"
                    className={`${
                      range.active 
                        ? "bg-[#35bb64] text-white" 
                        : "border-neutral-600 text-gray-300 hover:bg-neutral-600"
                    }`}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Chart Placeholder */}
            <div className="h-64 bg-neutral-800 border border-neutral-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3Icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Performance chart coming soon...</p>
                <p className="text-sm text-gray-500 mt-2">
                  Historical performance data will be displayed here
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="charts">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="card">
                  <CardHeader>
                    <CardTitle className="text-base">APY Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 bg-neutral-800 border border-neutral-700 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <TrendingUpIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">APY chart</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card">
                  <CardHeader>
                    <CardTitle className="text-base">Portfolio Allocation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 bg-neutral-800 border border-neutral-700 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3Icon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">Allocation chart</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <Card className="card">
                <CardHeader>
                  <CardTitle className="text-base">Risk Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border border-neutral-700 rounded-lg">
                      <p className="text-sm text-gray-400">Volatility</p>
                      <p className="text-xl font-bold text-white">2.3%</p>
                      <p className="text-xs text-gray-500">Low risk</p>
                    </div>
                    <div className="text-center p-4 border border-neutral-700 rounded-lg">
                      <p className="text-sm text-gray-400">Sharpe Ratio</p>
                      <p className="text-xl font-bold text-white">1.8</p>
                      <p className="text-xs text-gray-500">Good</p>
                    </div>
                    <div className="text-center p-4 border border-neutral-700 rounded-lg">
                      <p className="text-sm text-gray-400">Max Drawdown</p>
                      <p className="text-xl font-bold text-white">-0.5%</p>
                      <p className="text-xs text-gray-500">Minimal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card">
                <CardHeader>
                  <CardTitle className="text-base">Benchmark Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border border-neutral-700 rounded-lg">
                      <div>
                        <p className="font-medium text-white">Your Portfolio</p>
                        <p className="text-sm text-gray-400">TrustBridge investments</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#35bb64]">+{performanceData.yearlyReturn}%</p>
                        <p className="text-sm text-gray-400">1Y return</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-neutral-700 rounded-lg">
                      <div>
                        <p className="font-medium text-white">S&P 500</p>
                        <p className="text-sm text-gray-400">Market benchmark</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-300">+12.5%</p>
                        <p className="text-sm text-gray-400">1Y return</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-neutral-700 rounded-lg">
                      <div>
                        <p className="font-medium text-white">DeFi Index</p>
                        <p className="text-sm text-gray-400">DeFi benchmark</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-300">+8.2%</p>
                        <p className="text-sm text-gray-400">1Y return</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
