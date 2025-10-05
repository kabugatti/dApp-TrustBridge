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
  formatPercentage,
  getColorWithOpacity,
} from "@/helpers/chart.helper";
import { BarChart3 } from "lucide-react";

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

interface UtilizationChartProps {
  data: ChartDataPoint[] | null;
  loading?: boolean;
  error?: string | null;
  timeRange: TimeRange;
  onRetry?: () => void;
  className?: string;
  height?: string;
  poolName?: string;
}

export function UtilizationChart({
  data,
  loading = false,
  error = null,
  timeRange,
  onRetry,
  className = "",
  height = "300px",
  poolName = "Pool",
}: UtilizationChartProps) {
  // Prepare chart data
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return null;
    }

    const datasets = [
      {
        label: `${poolName} Utilization Rate`,
        data: data,
        color: CHART_COLORS.secondary,
        borderColor: CHART_COLORS.secondary,
        backgroundColor: getColorWithOpacity(CHART_COLORS.secondary, 0.1),
      },
    ];

    return formatDataForChart(datasets, timeRange);
  }, [data, timeRange, poolName]);

  // Calculate current utilization and trend
  const utilizationStats = useMemo(() => {
    if (!data || data.length === 0) return null;

    const current = data[data.length - 1]?.value || 0;
    const previous = data[data.length - 2]?.value || current;
    const change = current - previous;
    const trend = change > 0 ? "up" : change < 0 ? "down" : "stable";

    return {
      current,
      change: Math.abs(change),
      trend,
    };
  }, [data]);

  // Chart options with utilization-specific styling
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
              return `Utilization: ${formatPercentage(value)}`;
            },
          },
        },
      },
      scales: {
        ...getDefaultChartOptions(true).scales,
        y: {
          ...getDefaultChartOptions(true).scales?.y,
          min: 0,
          max: 100,
          ticks: {
            ...getDefaultChartOptions(true).scales?.y?.ticks,
            callback: (value: any) => `${value}%`,
          },
        },
      },
      elements: {
        line: {
          tension: 0.2,
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
      title="Pool Utilization Rate"
      subtitle={
        utilizationStats
          ? `Currently at ${formatPercentage(utilizationStats.current)} ${
              utilizationStats.trend === "up"
                ? "↗"
                : utilizationStats.trend === "down"
                  ? "↘"
                  : "→"
            }`
          : "Pool utilization rate over time"
      }
      loading={loading}
      error={error}
      onRetry={onRetry}
      exportData={data || []}
      exportFilename={`utilization_${timeRange}.csv`}
      className={className}
      height={height}
      icon={<BarChart3 className="h-5 w-5 text-green-400" />}
    >
      <div className="relative h-full">
        {/* Current utilization indicator */}
        {utilizationStats && !loading && !error && (
          <div className="absolute top-0 right-0 z-10 bg-neutral-800 border border-neutral-700 rounded-lg p-3 min-w-[140px]">
            <div className="text-xs text-gray-400 mb-1">Current Rate</div>
            <div
              className={`text-lg font-bold ${
                utilizationStats.current > 80
                  ? "text-red-400"
                  : utilizationStats.current > 60
                    ? "text-yellow-400"
                    : "text-green-400"
              }`}
            >
              {formatPercentage(utilizationStats.current)}
            </div>
            {utilizationStats.change > 0 && (
              <div
                className={`text-xs ${
                  utilizationStats.trend === "up"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {utilizationStats.trend === "up" ? "+" : "-"}
                {formatPercentage(utilizationStats.change)}
              </div>
            )}
          </div>
        )}

        {/* Chart or empty state */}
        {!chartData ? (
          <ChartEmptyState
            message="No utilization data available for the selected time range"
            icon={<BarChart3 className="h-6 w-6 text-gray-400" />}
          />
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}

        {/* Utilization level indicators */}
        {chartData && !loading && !error && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-4 pb-2">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Healthy (&lt;60%)
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              Moderate (60-80%)
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              High (&gt;80%)
            </span>
          </div>
        )}
      </div>
    </ChartContainer>
  );
}
