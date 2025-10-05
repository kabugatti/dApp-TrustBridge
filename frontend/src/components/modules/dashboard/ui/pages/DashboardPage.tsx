import Image from "next/image";
import StatCard from "../cards/StatCard";
import { useTranslation } from "@/hooks/useTranslation";
import { NoPositionsEmptyState } from "@/components/ui/empty-state";
import { useRouter } from "next/navigation";
import {
  formatCurrency,
  UserPosition,
  POOL_CONFIG,
  getPoolTypeForAsset,
} from "@/helpers/user-positions.helper";
import { useDashboard } from "../../hooks/useDashboard.hook";
import { TrendingUp, TrendingDown, Wallet, FileText } from "lucide-react";

// Import comprehensive analytics dashboard
import { ComprehensiveAnalyticsDashboard } from "../charts/ComprehensiveAnalyticsDashboard";

export default function Dashboard() {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    userPositions,
    address,
    profile,
    walletName,
    totalSupplied,
    totalBorrowed,
    availableBalance,
    activeLoans,
    cardsLoading,
  } = useDashboard();

  const handleManagePosition = () => {
    alert(
      "Position management functionality will be implemented in the full version.",
    );
  };

  // Create breakdown content for tooltips
  const createBreakdownContent = (
    positions: UserPosition[],
    type: "supplied" | "borrowed",
  ) => {
    if (!positions || positions.length === 0) {
      return <div className="text-gray-400">No data available</div>;
    }

    const filteredPositions = positions.filter(
      (pos: UserPosition) => pos[type] > 0,
    );

    if (filteredPositions.length === 0) {
      return <div className="text-gray-400">No {type} positions</div>;
    }

    return (
      <div className="space-y-1">
        <div className="font-medium text-gray-300">Breakdown:</div>
        {filteredPositions.map((position: UserPosition) => (
          <div key={position.asset} className="flex justify-between text-xs">
            <span className="text-gray-400">{position.symbol}:</span>
            <span className="text-white">{formatCurrency(position[type])}</span>
          </div>
        ))}
      </div>
    );
  };

  // Create Available Balance breakdown content
  const createAvailableBalanceContent = () => {
    if (!userPositions || userPositions.length === 0) {
      return <div className="text-gray-400">No data available</div>;
    }

    const availableByAsset = userPositions
      .map((position: UserPosition) => {
        const walletBalanceForAsset = 0; // TODO: Get actual wallet balance for this asset
        const available = Math.max(
          0,
          walletBalanceForAsset + position.supplied - position.borrowed,
        );

        return {
          symbol: position.symbol,
          available: available,
          walletBalance: walletBalanceForAsset,
          supplied: position.supplied,
          borrowed: position.borrowed,
        };
      })
      .filter((asset: { available: number }) => asset.available > 0);

    if (availableByAsset.length === 0) {
      return <div className="text-gray-400">No available balance</div>;
    }

    return (
      <div className="space-y-1">
        <div className="font-medium text-gray-300">Breakdown:</div>
        {availableByAsset.map(
          (asset: {
            symbol: string;
            available: number;
            walletBalance: number;
          }) => (
            <div key={asset.symbol} className="flex justify-between text-xs">
              <span className="text-gray-400">{asset.symbol}:</span>
              <span className="text-white">
                {formatCurrency(asset.available)}
              </span>
            </div>
          ),
        )}
        {availableByAsset.some(
          (asset: { walletBalance: number }) => asset.walletBalance > 0,
        ) && (
          <div className="text-xs text-gray-500 mt-1 pt-1 border-t border-gray-700">
            Includes wallet balance
          </div>
        )}
      </div>
    );
  };

  // Create Active Loans breakdown content
  const createActiveLoansContent = () => {
    if (!userPositions || userPositions.length === 0) {
      return <div className="text-gray-400">No data available</div>;
    }

    const poolLoanCounts: Record<string, number> = {};
    Object.keys(POOL_CONFIG).forEach((poolType) => {
      poolLoanCounts[poolType] = 0;
    });

    userPositions.forEach((position: UserPosition) => {
      if (position.borrowed > 0) {
        const poolType = getPoolTypeForAsset(position.symbol);
        if (poolType) {
          poolLoanCounts[poolType]++;
        }
      }
    });

    const poolsWithLoans = Object.entries(poolLoanCounts)
      .filter(([, count]) => count > 0)
      .map(([poolType, count]) => ({
        poolType: poolType === "MAIN_POOL" ? "Main Pool" : "Secondary Pool",
        count,
      }));

    if (poolsWithLoans.length === 0) {
      return <div className="text-gray-400">No active loans</div>;
    }

    return (
      <div className="space-y-1">
        <div className="font-medium text-gray-300">Breakdown:</div>
        {poolsWithLoans.map((pool) => (
          <div key={pool.poolType} className="flex justify-between text-xs">
            <span className="text-gray-400">{pool.poolType}:</span>
            <span className="text-white">{pool.count}</span>
          </div>
        ))}
      </div>
    );
  };

  const getWalletDisplayName = () => {
    if (!address) return "Usuario";

    // Use profile name if available
    if (profile && (profile.firstName || profile.lastName)) {
      const profileName = `${profile.firstName} ${profile.lastName}`.trim();
      if (profileName) return profileName;
    }

    // 2: Use walletName if it's not "Freighter"
    if (walletName && walletName !== "Freighter") {
      return walletName;
    }

    // Fallback: Use truncated address
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className="container mx-auto px-4 md:px-6 pt-24 pb-16 max-w-6xl">
      <h1 className="text-3xl font-bold mb-2">
        {t("dashboard.title", { address: "GABU...HE3JH" })}
      </h1>
      <p className="text-gray-400 mb-6">{t("dashboard.subtitle")}</p>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title={t("dashboard.totalSupplied")}
          value={formatCurrency(totalSupplied)}
          change="+1.8%"
          changeType="positive"
          icon={<TrendingUp className="w-4 h-4" />}
          loading={cardsLoading.totalSupplied}
        />
        <StatCard
          title={t("dashboard.totalBorrowed")}
          value={formatCurrency(totalBorrowed)}
          change="+0.5%"
          changeType="positive"
          icon={<TrendingDown className="w-4 h-4" />}
          loading={cardsLoading.totalBorrowed}
        />
        <StatCard
          title={t("dashboard.availableBalance")}
          value="$330,539"
          icon={<Wallet className="w-4 h-4" />}
          loading={cardsLoading.availableBalance}
        />
        <StatCard
          title={t("dashboard.activeLoans")}
          value={activeLoans.toString()}
          icon={<FileText className="w-4 h-4" />}
          loading={cardsLoading.activeLoans}
        />
      </div>

      {/* Pool Analytics Section */}
      <div className="mb-8">
        <ComprehensiveAnalyticsDashboard />
      </div>

      {/* Current Positions Table */}
      <div className="card p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">
          {t("dashboard.currentPositions")}
        </h2>
        <div className="overflow-x-auto">
          <table className="custom-table">
            <thead>
              <tr>
                <th>{t("dashboard.asset")}</th>
                <th>{t("dashboard.quantity")}</th>
                <th>{t("dashboard.apy")}</th>
                <th>{t("dashboard.collateral")}</th>
                <th>{t("dashboard.status")}</th>
                <th>{t("dashboard.action")}</th>
              </tr>
            </thead>
            <tbody>
              {userPositions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-0">
                    <NoPositionsEmptyState
                      onSupplyAssets={() => {
                        router.push("/dashboard/marketplace");
                      }}
                      onBrowsePools={() => {
                        router.push("/dashboard/marketplace");
                      }}
                    />
                  </td>
                </tr>
              ) : (
                userPositions.map((position: UserPosition) => (
                  <tr key={position.asset}>
                    <td>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 overflow-hidden">
                          <img
                            src={`/img/tokens/${position.symbol.toLowerCase()}.png`}
                            alt={position.symbol}
                            className="w-5 h-5 object-contain"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{position.symbol}</div>
                          <div className="text-xs text-gray-400">
                            {position.symbol === "USDC"
                              ? t("dashboard.usdCoin")
                              : position.symbol === "XLM"
                                ? t("dashboard.stellarLumens")
                                : position.symbol}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="font-medium">
                        {formatCurrency(position.usdValue)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatCurrency(position.supplied)}
                      </div>
                    </td>
                    <td>
                      <div className="text-success font-medium">
                        {position.apy}%
                      </div>
                    </td>
                    <td>
                      <div className="text-xs">
                        {position.collateral ? "Sí (75%)" : "-"}
                      </div>
                    </td>
                    <td>
                      <div
                        className={`${position.borrowed > 0 ? "bg-green-900 bg-opacity-20 text-green-400" : "bg-blue-900 bg-opacity-20 text-blue-400"} text-xs inline-block px-2 py-1 rounded`}
                      >
                        {position.borrowed > 0
                          ? t("dashboard.active")
                          : t("dashboard.collateralBadge")}
                      </div>
                    </td>
                    <td>
                      <button
                        className="btn-secondary text-xs px-2 py-1"
                        onClick={handleManagePosition}
                      >
                        {t("common.manage")}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
