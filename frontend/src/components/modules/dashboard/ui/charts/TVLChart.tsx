"use client";

import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ChartContainer, ChartEmptyState } from "./ChartContainer";
import {
  formatDataForChart,
  CHART_COLORS,
  getDefaultChartOptions,
  TimeRange,
  ChartDataPoint,
  formatChartValue,
  calculatePercentageChange,
  getColorWithOpacity,
} from "@/helpers/chart.helper";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface TVLChartProps {
  data: ChartDataPoint[] | null;
  loading?: boolean;
  error?: string | null;
  timeRange: TimeRange;
  onRetry?: () => void;
  className?: string;
  height?: string;
}

export function TVLChart({
  data,
  loading = false,
  error = null,
  timeRange,
  onRetry,
  className = "",
  height = "300px",
}: TVLChartProps) {
  // Prepare chart data
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return null;
    }

    const datasets = [
      {
        label: "Total Value Locked",
        data: data,
        color: CHART_COLORS.primary,
        borderColor: CHART_COLORS.primary,
        backgroundColor: getColorWithOpacity(CHART_COLORS.primary, 0.1),
      },
    ];

    return formatDataForChart(datasets, timeRange);
  }, [data, timeRange]);

  // Calculate TVL statistics
  const tvlStats = useMemo(() => {
    if (!data || data.length === 0) return null;

    const current = data[data.length - 1]?.value || 0;
    const previous = data[0]?.value || current;
    const change = calculatePercentageChange(current, previous);
    const highest = Math.max(...data.map((point) => point.value));
    const lowest = Math.min(...data.map((point) => point.value));

    return {
      current,
      change,
      highest,
      lowest,
      trend: change > 0 ? "up" : change < 0 ? "down" : "stable",
    };
  }, [data]);

  // Chart options with area fill
  const chartOptions = useMemo(
    () => ({
      ...getDefaultChartOptions(true),
      plugins: {
        ...getDefaultChartOptions(true).plugins,
        tooltip: {
          ...getDefaultChartOptions(true).plugins?.tooltip,
          callbacks: {
            label: (context: any) => {
              const value = context.parsed.y;
              return `TVL: ${formatChartValue(value)}`;
            },
          },
        },
      },
      scales: {
        ...getDefaultChartOptions(true).scales,
        y: {
          ...getDefaultChartOptions(true).scales?.y,
          ticks: {
            ...getDefaultChartOptions(true).scales?.y?.ticks,
            callback: (value: any) => formatChartValue(value, 1),
          },
        },
      },
      elements: {
        line: {
          tension: 0.2,
          fill: true,
        },
        point: {
          radius: 2,
          hoverRadius: 4,
        },
      },
    }),
    [],
  );

  return (
    <ChartContainer
      title="Total Value Locked (TVL)"
      subtitle={
        tvlStats
          ? `Current: ${formatChartValue(tvlStats.current)} ${
              tvlStats.trend === "up"
                ? "↗"
                : tvlStats.trend === "down"
                  ? "↘"
                  : "→"
            } ${Math.abs(tvlStats.change).toFixed(2)}%`
          : "Total value locked in the protocol over time"
      }
      loading={loading}
      error={error}
      onRetry={onRetry}
      exportData={data || []}
      exportFilename={`tvl_${timeRange}.csv`}
      className={className}
      height={height}
      icon={<DollarSign className="h-5 w-5 text-blue-400" />}
    >
      <div className="relative h-full">
        {/* TVL statistics overlay */}
        {tvlStats && !loading && !error && (
          <div className="absolute top-0 right-0 z-10 bg-neutral-800 border border-neutral-700 rounded-lg p-3 min-w-[180px]">
            <div className="text-xs text-gray-400 mb-2">TVL Statistics</div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Current:</span>
                <span className="text-sm font-bold text-white">
                  {formatChartValue(tvlStats.current)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Change:</span>
                <div className="flex items-center gap-1">
                  {tvlStats.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-400" />
                  ) : tvlStats.trend === "down" ? (
                    <TrendingDown className="h-3 w-3 text-red-400" />
                  ) : null}
                  <span
                    className={`text-xs font-medium ${
                      tvlStats.trend === "up"
                        ? "text-green-400"
                        : tvlStats.trend === "down"
                          ? "text-red-400"
                          : "text-gray-400"
                    }`}
                  >
                    {tvlStats.change > 0 ? "+" : ""}
                    {tvlStats.change.toFixed(2)}%
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-600 pt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">High:</span>
                  <span className="text-green-400 font-medium">
                    {formatChartValue(tvlStats.highest)}
                  </span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Low:</span>
                  <span className="text-red-400 font-medium">
                    {formatChartValue(tvlStats.lowest)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chart or empty state */}
        {!chartData ? (
          <ChartEmptyState
            message="No TVL data available for the selected time range"
            icon={<DollarSign className="h-6 w-6 text-gray-400" />}
          />
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}

        {/* Growth indicator */}
        {tvlStats && !loading && !error && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-2">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                tvlStats.trend === "up"
                  ? "bg-green-900/20 text-green-400 border border-green-700"
                  : tvlStats.trend === "down"
                    ? "bg-red-900/20 text-red-400 border border-red-700"
                    : "bg-gray-700/20 text-gray-400 border border-gray-600"
              }`}
            >
              {tvlStats.trend === "up" ? (
                <TrendingUp className="h-3 w-3" />
              ) : tvlStats.trend === "down" ? (
                <TrendingDown className="h-3 w-3" />
              ) : (
                <div className="h-3 w-3 rounded-full bg-current" />
              )}
              {tvlStats.trend === "up"
                ? "Growing"
                : tvlStats.trend === "down"
                  ? "Declining"
                  : "Stable"}
              ({Math.abs(tvlStats.change).toFixed(1)}%)
            </div>
          </div>
        )}
      </div>
    </ChartContainer>
  );
}
