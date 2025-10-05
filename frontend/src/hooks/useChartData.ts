import { useState, useEffect, useCallback, useMemo } from "react";
import { TimeRange, ChartDataPoint } from "@/helpers/chart.helper";
import {
  fetchPoolAnalytics,
  fetchMultiAssetAnalytics,
  fetchHistoricalAPY,
  fetchPoolUtilization,
  fetchVolumeData,
  fetchTVLData,
  PoolAnalytics,
  AssetAnalytics,
} from "@/services/analytics.service";

export interface ChartDataState {
  data: any;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

export interface UseChartDataReturn {
  poolAnalytics: ChartDataState;
  assetAnalytics: ChartDataState;
  apyData: ChartDataState;
  utilizationData: ChartDataState;
  volumeData: ChartDataState;
  tvlData: ChartDataState;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  refetchAll: () => Promise<void>;
  isRefreshing: boolean;
}

export function useChartData(
  poolId?: string,
  assets: string[] = ["USDC", "XLM", "TBT"],
): UseChartDataReturn {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Individual data states
  const [poolAnalytics, setPoolAnalytics] = useState<ChartDataState>({
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  });

  const [assetAnalytics, setAssetAnalytics] = useState<ChartDataState>({
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  });

  const [apyData, setApyData] = useState<ChartDataState>({
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  });

  const [utilizationData, setUtilizationData] = useState<ChartDataState>({
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  });

  const [volumeData, setVolumeData] = useState<ChartDataState>({
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  });

  const [tvlData, setTvlData] = useState<ChartDataState>({
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  });

  // Helper function to update state safely
  const updateState = useCallback(
    (
      setState: React.Dispatch<React.SetStateAction<ChartDataState>>,
      updates: Partial<ChartDataState>,
    ) => {
      setState((prev) => ({ ...prev, ...updates }));
    },
    [],
  );

  // Fetch pool analytics
  const fetchPoolAnalyticsData = useCallback(async () => {
    if (!poolId) return;

    updateState(setPoolAnalytics, { loading: true, error: null });

    try {
      const data = await fetchPoolAnalytics(poolId, timeRange);
      updateState(setPoolAnalytics, {
        data,
        loading: false,
        lastUpdated: Date.now(),
      });
    } catch (error) {
      updateState(setPoolAnalytics, {
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch pool analytics",
      });
    }
  }, [poolId, timeRange, updateState]);

  // Fetch asset analytics
  const fetchAssetAnalyticsData = useCallback(async () => {
    if (!assets.length) return;

    updateState(setAssetAnalytics, { loading: true, error: null });

    try {
      const data = await fetchMultiAssetAnalytics(assets, timeRange);
      updateState(setAssetAnalytics, {
        data,
        loading: false,
        lastUpdated: Date.now(),
      });
    } catch (error) {
      updateState(setAssetAnalytics, {
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch asset analytics",
      });
    }
  }, [assets, timeRange, updateState]);

  // Fetch APY data
  const fetchAPYData = useCallback(async () => {
    if (!assets.length) return;

    updateState(setApyData, { loading: true, error: null });

    try {
      const data = await fetchHistoricalAPY(assets, timeRange);
      updateState(setApyData, {
        data,
        loading: false,
        lastUpdated: Date.now(),
      });
    } catch (error) {
      updateState(setApyData, {
        loading: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch APY data",
      });
    }
  }, [assets, timeRange, updateState]);

  // Fetch utilization data
  const fetchUtilizationData = useCallback(async () => {
    if (!poolId) return;

    updateState(setUtilizationData, { loading: true, error: null });

    try {
      const data = await fetchPoolUtilization(poolId, timeRange);
      updateState(setUtilizationData, {
        data,
        loading: false,
        lastUpdated: Date.now(),
      });
    } catch (error) {
      updateState(setUtilizationData, {
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch utilization data",
      });
    }
  }, [poolId, timeRange, updateState]);

  // Fetch volume data
  const fetchVolumeDataHandler = useCallback(async () => {
    updateState(setVolumeData, { loading: true, error: null });

    try {
      const data = await fetchVolumeData(timeRange);
      updateState(setVolumeData, {
        data,
        loading: false,
        lastUpdated: Date.now(),
      });
    } catch (error) {
      updateState(setVolumeData, {
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch volume data",
      });
    }
  }, [timeRange, updateState]);

  // Fetch TVL data
  const fetchTVLDataHandler = useCallback(async () => {
    updateState(setTvlData, { loading: true, error: null });

    try {
      const data = await fetchTVLData(timeRange);
      updateState(setTvlData, {
        data,
        loading: false,
        lastUpdated: Date.now(),
      });
    } catch (error) {
      updateState(setTvlData, {
        loading: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch TVL data",
      });
    }
  }, [timeRange, updateState]);

  // Refetch all data
  const refetchAll = useCallback(async () => {
    setIsRefreshing(true);

    try {
      await Promise.all([
        fetchPoolAnalyticsData(),
        fetchAssetAnalyticsData(),
        fetchAPYData(),
        fetchUtilizationData(),
        fetchVolumeDataHandler(),
        fetchTVLDataHandler(),
      ]);
    } catch (error) {
      console.error("Error refetching chart data:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [
    fetchPoolAnalyticsData,
    fetchAssetAnalyticsData,
    fetchAPYData,
    fetchUtilizationData,
    fetchVolumeDataHandler,
    fetchTVLDataHandler,
  ]);

  // Effect to fetch data when dependencies change
  useEffect(() => {
    const fetchData = async () => {
      // Don't fetch during refresh to avoid duplicate requests
      if (isRefreshing) return;

      // Fetch data in parallel for better performance
      const promises = [
        fetchAssetAnalyticsData(),
        fetchAPYData(),
        fetchVolumeDataHandler(),
        fetchTVLDataHandler(),
      ];

      // Only fetch pool-specific data if poolId is provided
      if (poolId) {
        promises.push(fetchPoolAnalyticsData(), fetchUtilizationData());
      }

      await Promise.allSettled(promises);
    };

    fetchData();
  }, [
    timeRange,
    poolId,
    assets,
    isRefreshing,
    fetchPoolAnalyticsData,
    fetchAssetAnalyticsData,
    fetchAPYData,
    fetchUtilizationData,
    fetchVolumeDataHandler,
    fetchTVLDataHandler,
  ]);

  // Debounced timeRange setter to prevent excessive API calls
  const debouncedSetTimeRange = useCallback((range: TimeRange) => {
    setTimeRange(range);
  }, []);

  // Memoized return value to prevent unnecessary re-renders
  const returnValue = useMemo(
    () => ({
      poolAnalytics,
      assetAnalytics,
      apyData,
      utilizationData,
      volumeData,
      tvlData,
      timeRange,
      setTimeRange: debouncedSetTimeRange,
      refetchAll,
      isRefreshing,
    }),
    [
      poolAnalytics,
      assetAnalytics,
      apyData,
      utilizationData,
      volumeData,
      tvlData,
      timeRange,
      debouncedSetTimeRange,
      refetchAll,
      isRefreshing,
    ],
  );

  return returnValue;
}
