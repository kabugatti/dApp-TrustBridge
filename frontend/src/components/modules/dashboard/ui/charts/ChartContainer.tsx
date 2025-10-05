"use client";

import React from "react";
import { AlertTriangle, RefreshCw, Download, TrendingUp } from "lucide-react";
import { exportChartDataToCSV } from "@/services/analytics.service";
import { ChartDataPoint } from "@/helpers/chart.helper";

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onExport?: () => void;
  exportData?: ChartDataPoint[];
  exportFilename?: string;
  className?: string;
  height?: string;
  showExport?: boolean;
  showRetry?: boolean;
  emptyMessage?: string;
  icon?: React.ReactNode;
}

export function ChartContainer({
  title,
  subtitle,
  children,
  loading = false,
  error = null,
  onRetry,
  onExport,
  exportData,
  exportFilename,
  className = "",
  height = "300px",
  showExport = true,
  showRetry = true,
  emptyMessage = "No data available",
  icon,
}: ChartContainerProps) {
  const handleExport = () => {
    if (onExport) {
      onExport();
    } else if (exportData && exportData.length > 0) {
      exportChartDataToCSV(
        exportData,
        exportFilename ||
          `${title.toLowerCase().replace(/\s+/g, "_")}_data.csv`,
      );
    }
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
  };

  return (
    <div className={`card p-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          {icon && <div className="p-2 bg-blue-900/30 rounded-lg">{icon}</div>}
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            {subtitle && (
              <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {showRetry && (
            <button
              onClick={handleRetry}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          )}

          {showExport && !loading && !error && (exportData || onExport) && (
            <button
              onClick={handleExport}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Download className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Chart Content */}
      <div style={{ height }} className="relative">
        {loading && <LoadingSkeleton />}

        {error && (
          <ErrorState
            message={error}
            onRetry={showRetry ? handleRetry : undefined}
          />
        )}

        {!loading && !error && children}
      </div>
    </div>
  );
}

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-neutral-800/20 rounded-lg">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="text-sm text-gray-400">Loading chart data...</p>
      </div>
    </div>
  );
}

// Error state component
function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-neutral-800/20 rounded-lg">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm">
        <div className="p-3 bg-red-900/20 rounded-full">
          <AlertTriangle className="h-6 w-6 text-red-400" />
        </div>

        <div>
          <h4 className="text-sm font-medium text-white mb-1">
            Unable to Load Chart
          </h4>
          <p className="text-sm text-gray-400">{message}</p>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-gray-700 text-gray-300 border border-gray-600 rounded hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

// Empty state component
export function ChartEmptyState({
  message = "No data available",
  icon,
}: {
  message?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="p-3 bg-gray-700/50 rounded-full">
          {icon || <TrendingUp className="h-6 w-6 text-gray-400" />}
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-1">
            No Data Available
          </h4>
          <p className="text-sm text-gray-500">{message}</p>
        </div>
      </div>
    </div>
  );
}
