import {
  TimeRange,
  ChartDataPoint,
  generateMockChartData,
} from "@/helpers/chart.helper";

export interface PoolAnalytics {
  apy: ChartDataPoint[];
  utilization: ChartDataPoint[];
  volume: {
    supply: ChartDataPoint[];
    borrow: ChartDataPoint[];
  };
  tvl: ChartDataPoint[];
}

export interface AssetAnalytics {
  symbol: string;
  apy: ChartDataPoint[];
  volume: ChartDataPoint[];
  price: ChartDataPoint[];
}

// Cache for analytics data
const analyticsCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Check if cached data is still valid
const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_DURATION;
};

// Get cache key for analytics data
const getCacheKey = (
  type: string,
  timeRange: TimeRange,
  params?: any,
): string => {
  return `${type}_${timeRange}_${JSON.stringify(params || {})}`;
};

/**
 * Fetch pool analytics data
 * In a real implementation, this would call the Blend Protocol APIs
 */
export const fetchPoolAnalytics = async (
  poolId: string,
  timeRange: TimeRange,
): Promise<PoolAnalytics> => {
  const cacheKey = getCacheKey("pool_analytics", timeRange, { poolId });
  const cached = analyticsCache.get(cacheKey);

  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data;
  }

  try {
    // TODO: Replace with actual API calls to Blend Protocol
    // For now, generate mock data that simulates realistic pool analytics

    const analytics: PoolAnalytics = {
      apy: generateMockChartData(timeRange, 5.2, 0.1), // 5.2% base APY with 10% volatility
      utilization: generateMockChartData(timeRange, 75, 0.05), // 75% base utilization with 5% volatility
      volume: {
        supply: generateMockChartData(timeRange, 1500000, 0.2), // $1.5M base supply volume
        borrow: generateMockChartData(timeRange, 800000, 0.25), // $800K base borrow volume
      },
      tvl: generateMockChartData(timeRange, 25000000, 0.15), // $25M base TVL
    };

    // Cache the result
    analyticsCache.set(cacheKey, {
      data: analytics,
      timestamp: Date.now(),
    });

    return analytics;
  } catch (error) {
    console.error("Error fetching pool analytics:", error);
    throw new Error("Failed to fetch pool analytics data");
  }
};

/**
 * Fetch analytics for multiple assets
 */
export const fetchMultiAssetAnalytics = async (
  assets: string[],
  timeRange: TimeRange,
): Promise<AssetAnalytics[]> => {
  const cacheKey = getCacheKey("multi_asset_analytics", timeRange, { assets });
  const cached = analyticsCache.get(cacheKey);

  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data;
  }

  try {
    // TODO: Replace with actual API calls
    const analyticsPromises = assets.map(async (symbol) => {
      // Different base values for different assets
      const baseValues = {
        USDC: { apy: 4.5, volume: 2000000, price: 1.0 },
        XLM: { apy: 6.8, volume: 500000, price: 0.12 },
        TBT: { apy: 12.5, volume: 100000, price: 0.85 },
      } as const;

      const base =
        baseValues[symbol as keyof typeof baseValues] || baseValues["USDC"];

      return {
        symbol,
        apy: generateMockChartData(timeRange, base.apy, 0.1),
        volume: generateMockChartData(timeRange, base.volume, 0.3),
        price: generateMockChartData(timeRange, base.price, 0.05),
      };
    });

    const analytics = await Promise.all(analyticsPromises);

    // Cache the result
    analyticsCache.set(cacheKey, {
      data: analytics,
      timestamp: Date.now(),
    });

    return analytics;
  } catch (error) {
    console.error("Error fetching multi-asset analytics:", error);
    throw new Error("Failed to fetch asset analytics data");
  }
};

/**
 * Fetch historical APY data for multiple assets
 */
export const fetchHistoricalAPY = async (
  assets: string[],
  timeRange: TimeRange,
): Promise<{ [symbol: string]: ChartDataPoint[] }> => {
  const cacheKey = getCacheKey("historical_apy", timeRange, { assets });
  const cached = analyticsCache.get(cacheKey);

  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data;
  }

  try {
    // TODO: Replace with actual API calls
    const apyData: { [symbol: string]: ChartDataPoint[] } = {};

    const baseAPYMap = {
      USDC: 4.5,
      XLM: 6.8,
      TBT: 12.5,
    } as const;

    for (const symbol of assets) {
      const baseAPY = baseAPYMap[symbol as keyof typeof baseAPYMap] || 5.0;

      apyData[symbol] = generateMockChartData(timeRange, baseAPY, 0.1);
    }

    // Cache the result
    analyticsCache.set(cacheKey, {
      data: apyData,
      timestamp: Date.now(),
    });

    return apyData;
  } catch (error) {
    console.error("Error fetching historical APY data:", error);
    throw new Error("Failed to fetch historical APY data");
  }
};

/**
 * Fetch pool utilization data
 */
export const fetchPoolUtilization = async (
  poolId: string,
  timeRange: TimeRange,
): Promise<ChartDataPoint[]> => {
  const cacheKey = getCacheKey("pool_utilization", timeRange, { poolId });
  const cached = analyticsCache.get(cacheKey);

  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data;
  }

  try {
    // TODO: Replace with actual API calls
    const utilizationData = generateMockChartData(timeRange, 75, 0.05);

    // Cache the result
    analyticsCache.set(cacheKey, {
      data: utilizationData,
      timestamp: Date.now(),
    });

    return utilizationData;
  } catch (error) {
    console.error("Error fetching pool utilization data:", error);
    throw new Error("Failed to fetch pool utilization data");
  }
};

/**
 * Fetch volume data (supply and borrow)
 */
export const fetchVolumeData = async (
  timeRange: TimeRange,
): Promise<{ supply: ChartDataPoint[]; borrow: ChartDataPoint[] }> => {
  const cacheKey = getCacheKey("volume_data", timeRange);
  const cached = analyticsCache.get(cacheKey);

  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data;
  }

  try {
    // TODO: Replace with actual API calls
    const volumeData = {
      supply: generateMockChartData(timeRange, 1500000, 0.2),
      borrow: generateMockChartData(timeRange, 800000, 0.25),
    };

    // Cache the result
    analyticsCache.set(cacheKey, {
      data: volumeData,
      timestamp: Date.now(),
    });

    return volumeData;
  } catch (error) {
    console.error("Error fetching volume data:", error);
    throw new Error("Failed to fetch volume data");
  }
};

/**
 * Fetch Total Value Locked (TVL) data
 */
export const fetchTVLData = async (
  timeRange: TimeRange,
): Promise<ChartDataPoint[]> => {
  const cacheKey = getCacheKey("tvl_data", timeRange);
  const cached = analyticsCache.get(cacheKey);

  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data;
  }

  try {
    // TODO: Replace with actual API calls
    const tvlData = generateMockChartData(timeRange, 25000000, 0.15);

    // Cache the result
    analyticsCache.set(cacheKey, {
      data: tvlData,
      timestamp: Date.now(),
    });

    return tvlData;
  } catch (error) {
    console.error("Error fetching TVL data:", error);
    throw new Error("Failed to fetch TVL data");
  }
};

/**
 * Clear analytics cache
 */
export const clearAnalyticsCache = (): void => {
  analyticsCache.clear();
};

/**
 * Export chart data to CSV format
 */
export const exportChartDataToCSV = (
  data: ChartDataPoint[],
  filename: string = "chart_data.csv",
): void => {
  if (data.length === 0) {
    console.warn("No data to export");
    return;
  }

  const headers = ["Timestamp", "Date", "Value"];
  const csvContent = [
    headers.join(","),
    ...data.map((point) =>
      [
        point.timestamp,
        new Date(point.timestamp).toISOString(),
        point.value,
      ].join(","),
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
