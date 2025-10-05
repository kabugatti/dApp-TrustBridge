import { format, subDays, subMonths, startOfDay, endOfDay } from "date-fns";

export type TimeRange = "24h" | "7d" | "30d" | "90d";

export interface ChartDataPoint {
  timestamp: number;
  value: number;
  label?: string;
}

export interface ChartDataset {
  label: string;
  data: ChartDataPoint[];
  color: string;
  borderColor?: string;
  backgroundColor?: string;
}

export interface FormattedChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
    tension: number;
  }[];
}

// Color palette matching the app's theme
export const CHART_COLORS = {
  primary: "#3B82F6", // blue-500
  secondary: "#10B981", // green-500
  tertiary: "#F59E0B", // yellow-500
  quaternary: "#EF4444", // red-500
  accent: "#8B5CF6", // purple-500
  neutral: "#6B7280", // gray-500
  success: "#22C55E", // green-600
  warning: "#F97316", // orange-500
  danger: "#DC2626", // red-600
  info: "#06B6D4", // cyan-500
} as const;

// Generate color with opacity
export const getColorWithOpacity = (color: string, opacity: number): string => {
  // Convert hex to rgba
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Get date range based on time range selection
export const getDateRange = (
  timeRange: TimeRange,
): { start: Date; end: Date } => {
  const end = endOfDay(new Date());
  let start: Date;

  switch (timeRange) {
    case "24h":
      start = startOfDay(subDays(end, 1));
      break;
    case "7d":
      start = startOfDay(subDays(end, 7));
      break;
    case "30d":
      start = startOfDay(subDays(end, 30));
      break;
    case "90d":
      start = startOfDay(subDays(end, 90));
      break;
    default:
      start = startOfDay(subDays(end, 7));
  }

  return { start, end };
};

// Format date labels based on time range
export const formatDateLabel = (date: Date, timeRange: TimeRange): string => {
  switch (timeRange) {
    case "24h":
      return format(date, "HH:mm");
    case "7d":
      return format(date, "MM/dd");
    case "30d":
    case "90d":
      return format(date, "MM/dd");
    default:
      return format(date, "MM/dd");
  }
};

// Generate mock data for demonstration (replace with real API calls)
export const generateMockChartData = (
  timeRange: TimeRange,
  baseValue: number,
  volatility: number = 0.1,
): ChartDataPoint[] => {
  const { start, end } = getDateRange(timeRange);
  const points: ChartDataPoint[] = [];

  let current = new Date(start);
  let currentValue = baseValue;

  // Determine interval based on time range
  const intervals = {
    "24h": 60 * 60 * 1000, // 1 hour
    "7d": 4 * 60 * 60 * 1000, // 4 hours
    "30d": 24 * 60 * 60 * 1000, // 1 day
    "90d": 24 * 60 * 60 * 1000, // 1 day
  };

  const interval = intervals[timeRange];

  while (current <= end) {
    // Add some realistic volatility
    const change = (Math.random() - 0.5) * 2 * volatility * baseValue;
    currentValue = Math.max(0, currentValue + change);

    points.push({
      timestamp: current.getTime(),
      value: currentValue,
      label: formatDateLabel(current, timeRange),
    });

    current = new Date(current.getTime() + interval);
  }

  return points;
};

// Format chart data for Chart.js
export const formatDataForChart = (
  datasets: ChartDataset[],
  timeRange: TimeRange,
): FormattedChartData => {
  if (datasets.length === 0) {
    return { labels: [], datasets: [] };
  }

  // Use the first dataset to generate labels
  const labels = datasets[0].data.map(
    (point) =>
      point.label || formatDateLabel(new Date(point.timestamp), timeRange),
  );

  const formattedDatasets = datasets.map((dataset, index) => ({
    label: dataset.label,
    data: dataset.data.map((point) => point.value),
    borderColor: dataset.borderColor || dataset.color,
    backgroundColor:
      dataset.backgroundColor || getColorWithOpacity(dataset.color, 0.1),
    fill: false,
    tension: 0.1,
  }));

  return {
    labels,
    datasets: formattedDatasets,
  };
};

// Calculate percentage change
export const calculatePercentageChange = (
  current: number,
  previous: number,
): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

// Format currency values for charts
export const formatChartValue = (
  value: number,
  decimals: number = 2,
): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(decimals)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(decimals)}K`;
  } else {
    return `$${value.toFixed(decimals)}`;
  }
};

// Format percentage values
export const formatPercentage = (
  value: number,
  decimals: number = 2,
): string => {
  return `${value.toFixed(decimals)}%`;
};

// Aggregate data by time period (for volume charts)
export const aggregateByTimePeriod = (
  data: ChartDataPoint[],
  timeRange: TimeRange,
): ChartDataPoint[] => {
  if (data.length === 0) return [];

  const aggregated: {
    [key: string]: { sum: number; count: number; timestamp: number };
  } = {};

  data.forEach((point) => {
    const date = new Date(point.timestamp);
    let key: string;

    switch (timeRange) {
      case "24h":
        key = format(date, "yyyy-MM-dd-HH");
        break;
      case "7d":
        key = format(date, "yyyy-MM-dd");
        break;
      case "30d":
      case "90d":
        key = format(date, "yyyy-MM-dd");
        break;
      default:
        key = format(date, "yyyy-MM-dd");
    }

    if (!aggregated[key]) {
      aggregated[key] = { sum: 0, count: 0, timestamp: point.timestamp };
    }

    aggregated[key].sum += point.value;
    aggregated[key].count += 1;
  });

  return Object.values(aggregated).map((item) => ({
    timestamp: item.timestamp,
    value: item.sum, // Use sum for volume, could use average for other metrics
  }));
};

// Default chart options for Chart.js
export const getDefaultChartOptions = (isDark: boolean = true) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        color: isDark ? "#E5E7EB" : "#374151",
        font: {
          size: 12,
          family: "Inter, sans-serif",
        },
      },
    },
    tooltip: {
      mode: "index" as const,
      intersect: false,
      backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
      titleColor: isDark ? "#E5E7EB" : "#374151",
      bodyColor: isDark ? "#E5E7EB" : "#374151",
      borderColor: isDark ? "#374151" : "#E5E7EB",
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      display: true,
      grid: {
        color: isDark ? "#374151" : "#E5E7EB",
        drawBorder: false,
      },
      ticks: {
        color: isDark ? "#9CA3AF" : "#6B7280",
        font: {
          size: 11,
          family: "Inter, sans-serif",
        },
      },
    },
    y: {
      display: true,
      grid: {
        color: isDark ? "#374151" : "#E5E7EB",
        drawBorder: false,
      },
      ticks: {
        color: isDark ? "#9CA3AF" : "#6B7280",
        font: {
          size: 11,
          family: "Inter, sans-serif",
        },
      },
    },
  },
  interaction: {
    mode: "nearest" as const,
    axis: "x" as const,
    intersect: false,
  },
});
