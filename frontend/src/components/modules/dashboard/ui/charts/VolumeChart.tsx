"use client";

import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { ChartContainer, ChartEmptyState } from "./ChartContainer";
import {
  formatDataForChart,
  CHART_COLORS,
  getDefaultChartOptions,
  TimeRange,
  ChartDataPoint,
  formatChartValue,
  getColorWithOpacity,
} from "@/helpers/chart.helper";
import { BarChart2 } from "lucide-react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface VolumeChartProps {
  data: {
    supply: ChartDataPoint[];
    borrow: ChartDataPoint[];
  } | null;
  loading?: boolean;
  error?: string | null;
  timeRange: TimeRange;
  onRetry?: () => void;
  className?: string;
  height?: string;
}

export function VolumeChart({
  data,
  loading = false,
  error = null,
  timeRange,
  onRetry,
  className = "",
  height = "300px",
}: VolumeChartProps) {
  // Prepare chart data
  const chartData = useMemo(() => {
    if (!data || !data.supply || !data.borrow) {
      return null;
    }

    const datasets = [
      {
        label: "Supply Volume",
        data: data.supply,
        color: CHART_COLORS.secondary,
        borderColor: CHART_COLORS.secondary,
        backgroundColor: getColorWithOpacity(CHART_COLORS.secondary, 0.8),
      },
      {
        label: "Borrow Volume",
        data: data.borrow,
        color: CHART_COLORS.tertiary,
        borderColor: CHART_COLORS.tertiary,
        backgroundColor: getColorWithOpacity(CHART_COLORS.tertiary, 0.8),
      },
    ];

    return formatDataForChart(datasets, timeRange);
  }, [data, timeRange]);

  // Calculate volume statistics
  const volumeStats = useMemo(() => {
    if (!data || !data.supply || !data.borrow) return null;

    const totalSupply = data.supply.reduce(
      (sum, point) => sum + point.value,
      0,
    );
    const totalBorrow = data.borrow.reduce(
      (sum, point) => sum + point.value,
      0,
    );
    const avgSupply = totalSupply / data.supply.length;
    const avgBorrow = totalBorrow / data.borrow.length;

    return {
      totalSupply,
      totalBorrow,
      avgSupply,
      avgBorrow,
      ratio: totalBorrow / totalSupply,
    };
  }, [data]);

  // Chart options for bar chart
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
              return `${context.dataset.label}: ${formatChartValue(value)}`;
            },
          },
        },
      },
      scales: {
        ...getDefaultChartOptions(true).scales,
        y: {
          ...getDefaultChartOptions(true).scales?.y,
          stacked: false,
          ticks: {
            ...getDefaultChartOptions(true).scales?.y?.ticks,
            callback: (value: any) => formatChartValue(value, 1),
          },
        },
        x: {
          ...getDefaultChartOptions(true).scales?.x,
          stacked: false,
        },
      },
      elements: {
        bar: {
          borderRadius: 2,
          borderSkipped: false,
        },
      },
    }),
    [],
  );

  // Calculate export data
  const exportData = useMemo(() => {
    if (!data) return [];

    const allPoints: ChartDataPoint[] = [];

    // Add supply data
    data.supply.forEach((point) => {
      allPoints.push({
        ...point,
        label: "Supply_Volume",
      });
    });

    // Add borrow data
    data.borrow.forEach((point) => {
      allPoints.push({
        ...point,
        label: "Borrow_Volume",
      });
    });

    return allPoints.sort((a, b) => a.timestamp - b.timestamp);
  }, [data]);

  return (
    <ChartContainer
      title="Supply & Borrow Volume"
      subtitle={
        volumeStats
          ? `Total Supply: ${formatChartValue(volumeStats.totalSupply)} | Total Borrow: ${formatChartValue(volumeStats.totalBorrow)}`
          : "Trading volume over time"
      }
      loading={loading}
      error={error}
      onRetry={onRetry}
      exportData={exportData}
      exportFilename={`volume_${timeRange}.csv`}
      className={className}
      height={height}
      icon={<BarChart2 className="h-5 w-5 text-yellow-400" />}
    >
      <div className="relative h-full">
        {/* Volume statistics overlay */}
        {volumeStats && !loading && !error && (
          <div className="absolute top-0 right-0 z-10 bg-neutral-800 border border-neutral-700 rounded-lg p-3 min-w-[180px]">
            <div className="text-xs text-gray-400 mb-2">Volume Statistics</div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Avg Supply:</span>
                <span className="text-green-400 font-medium">
                  {formatChartValue(volumeStats.avgSupply)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Avg Borrow:</span>
                <span className="text-yellow-400 font-medium">
                  {formatChartValue(volumeStats.avgBorrow)}
                </span>
              </div>

              <div className="flex justify-between pt-1 border-t border-gray-600">
                <span className="text-gray-400">Borrow Ratio:</span>
                <span className="text-white font-medium">
                  {(volumeStats.ratio * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Chart or empty state */}
        {!chartData ? (
          <ChartEmptyState
            message="No volume data available for the selected time range"
            icon={<BarChart2 className="h-6 w-6 text-gray-400" />}
          />
        ) : (
          <Bar data={chartData} options={chartOptions} />
        )}

        {/* Legend */}
        {chartData && !loading && !error && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-6 text-xs text-gray-400 pb-2">
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              Supply Volume
            </span>
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              Borrow Volume
            </span>
          </div>
        )}
      </div>
    </ChartContainer>
  );
}
