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
} from "@/helpers/chart.helper";
import { TrendingUp } from "lucide-react";

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

interface APYChartProps {
  data: { [symbol: string]: ChartDataPoint[] } | null;
  loading?: boolean;
  error?: string | null;
  timeRange: TimeRange;
  onRetry?: () => void;
  className?: string;
  height?: string;
}

export function APYChart({
  data,
  loading = false,
  error = null,
  timeRange,
  onRetry,
  className = "",
  height = "300px",
}: APYChartProps) {
  // Prepare chart data
  const chartData = useMemo(() => {
    if (!data || Object.keys(data).length === 0) {
      return null;
    }

    const datasets = Object.entries(data).map(([symbol, points], index) => {
      const colors = [
        CHART_COLORS.primary,
        CHART_COLORS.secondary,
        CHART_COLORS.tertiary,
        CHART_COLORS.quaternary,
        CHART_COLORS.accent,
      ];

      return {
        label: `${symbol} APY`,
        data: points,
        color: colors[index % colors.length],
      };
    });

    return formatDataForChart(datasets, timeRange);
  }, [data, timeRange]);

  // Chart options
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
              return `${context.dataset.label}: ${formatPercentage(value)}`;
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
            callback: (value: any) => `${value}%`,
          },
        },
      },
    }),
    [],
  );

  // Calculate export data
  const exportData = useMemo(() => {
    if (!data) return [];

    // Flatten all asset data for export
    const allPoints: ChartDataPoint[] = [];
    Object.entries(data).forEach(([symbol, points]) => {
      points.forEach((point) => {
        allPoints.push({
          ...point,
          label: `${symbol}_APY`,
        });
      });
    });

    return allPoints.sort((a, b) => a.timestamp - b.timestamp);
  }, [data]);

  return (
    <ChartContainer
      title="APY Historical Trends"
      subtitle="Annual Percentage Yield over time for different assets"
      loading={loading}
      error={error}
      onRetry={onRetry}
      exportData={exportData}
      exportFilename={`apy_trends_${timeRange}.csv`}
      className={className}
      height={height}
      icon={<TrendingUp className="h-5 w-5 text-blue-400" />}
    >
      {!chartData ? (
        <ChartEmptyState
          message="No APY data available for the selected time range"
          icon={<TrendingUp className="h-6 w-6 text-gray-400" />}
        />
      ) : (
        <Line data={chartData} options={chartOptions} />
      )}
    </ChartContainer>
  );
}
