"use client";

import { useMarketplace } from "../../hooks/useMarketplace.hook";
import { BorrowModal } from "../components/BorrowModal";
import { ProvideLiquidityModal } from "../components/ProvideLiquidityModal";
import { SupplyUSDCModal } from "../components/SupplyUSDCModal";
import { SupplyXLMCollateralModal } from "../components/SupplyXLMCollateralModal";
import { ResponsiveTable } from "@/components/ui/responsive-table";

// Pool Data Interface
interface PoolReserve {
  symbol: string;
  supplied: string;
  borrowed: string;
  supplyAPY: string;
  borrowAPY: string;
  role?: string;
}

export default function Marketplace() {
  const {
    loading,
    deploying,
    supplying,
    deployedPoolId,
    supplyAmount,
    showBorrowModal,
    showSupplyUSDCModal,
    showSupplyXLMModal,
    showProvideLiquidityModal,
    mockPoolData,
    POOL_CONFIG,
    ORACLE_ID,
    setSupplyAmount,
    handleDeployPool,
    handleSupplyToPool,
    openBorrowModal,
    closeBorrowModal,
    openSupplyUSDCModal,
    closeSupplyUSDCModal,
    openSupplyXLMModal,
    closeSupplyXLMModal,
    openProvideLiquidityModal,
    closeProvideLiquidityModal,
    handleSupplySuccess,
    isWalletConnected,
    isPoolDeployed,
    canSupplyToPool,
    canDeployPool,
    canInteractWithPool,
  } = useMarketplace();

  // Define table columns for the responsive table
  const tableColumns = [
    {
      key: "symbol",
      header: "Asset",
      render: (value: string, row: PoolReserve) => (
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full overflow-hidden ${
              value === "USDC"
                ? "bg-blue-700"
                : value === "XLM"
                ? "bg-gray-100"
                : "bg-gray-800"
            } flex items-center justify-center mr-3`}
          >
            {value === "USDC" ? (
              <img
                src="/img/tokens/usdc.png"
                alt="USDC"
                className="w-5 h-5 object-contain"
              />
            ) : value === "XLM" ? (
              <img
                src="/img/tokens/xlm.png"
                alt="XLM"
                className="w-5 h-5 object-contain"
              />
            ) : (
              <img
                src="/img/tokens/tbt.png"
                alt="TrustBridge Token"
                className="w-5 h-5 object-contain"
              />
            )}
          </div>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-xs text-gray-400">
              {value === "USDC"
                ? "USD Coin"
                : value === "XLM"
                ? "Stellar Lumens"
                : "TrustBridge Token"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "supplied",
      header: "Supplied",
      render: (value: string) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-gray-400">${value}</div>
        </div>
      ),
    },
    {
      key: "borrowed",
      header: "Borrowed",
      render: (value: string) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-gray-400">${value}</div>
        </div>
      ),
    },
    {
      key: "supplyAPY",
      header: "Supply APY",
      render: (value: string) => (
        <div className="text-success font-medium">{value}%</div>
      ),
    },
    {
      key: "borrowAPY",
      header: "Borrow APY",
      render: (value: string) => (
        <div className="text-warning font-medium">{value}%</div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (value: string, _: any, index: number) => (
        <div
          className={`${
            index === 0
              ? "bg-blue-900 bg-opacity-20 text-blue-400"
              : index === 1
              ? "bg-purple-900 bg-opacity-20 text-purple-400"
              : "bg-green-900 bg-opacity-20 text-green-400"
          } text-xs inline-block px-2 py-1 rounded`}
        >
          {value || `Reserve ${index + 1}`}
        </div>
      ),
    },
  ];

  // Prepare table data
  const tableData = mockPoolData?.reserves || [
    {
      symbol: "USDC",
      supplied: "875,000",
      borrowed: "654,200",
      supplyAPY: "3.2",
      borrowAPY: "6.8",
      role: "Reserve 1",
    },
    {
      symbol: "XLM",
      supplied: "350,000",
      borrowed: "168,500",
      supplyAPY: "2.8",
      borrowAPY: "5.9",
      role: "Reserve 2",
    },
    {
      symbol: "TBRG",
      supplied: "1,250,000",
      borrowed: "862,550",
      supplyAPY: "4.5",
      borrowAPY: "7.2",
      role: "Reserve 3",
    },
  ];

  if (loading) {
    return (
      <main className="container mx-auto px-4 md:px-6 pt-24 pb-16 max-w-6xl">
        <div className="space-y-8">
          <div className="h-12 w-80 bg-dark-secondary rounded animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 w-full bg-dark-secondary rounded animate-pulse"
              ></div>
            ))}
          </div>
          <div className="h-96 w-full bg-dark-secondary rounded animate-pulse"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 md:px-6 pt-24 pb-16 max-w-6xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Marketplace</h1>
      <p className="text-gray-400 mb-6">
        Decentralized lending pools powered by Blend Protocol
      </p>

      {/* Wallet Connection Alert */}
      {!isWalletConnected && (
        <div className="bg-amber-900 bg-opacity-20 border border-amber-700 text-amber-400 px-4 py-3 rounded mb-8 flex items-start">
          <i className="fas fa-exclamation-circle mt-1 mr-3"></i>
          <div>
            <p className="font-medium">Connect Your Wallet</p>
            <p className="text-sm">
              Please connect your Stellar wallet to interact with the lending
              pools.
            </p>
          </div>
        </div>
      )}

      {/* Pool Status Alert */}
      {isWalletConnected && isPoolDeployed && (
        <div className="bg-green-900 bg-opacity-20 border border-green-700 text-green-400 px-4 py-3 rounded mb-8 flex items-start">
          <i className="fas fa-check-circle mt-1 mr-3"></i>
          <div>
            <p className="font-medium">Pool Ready for Lending</p>
            <p className="text-sm">
              Pool deployed successfully! You can now supply USDC to provide
              liquidity and users can borrow from the pool. The pool is
              configured with USDC reserves and ready for operation.
            </p>
          </div>
        </div>
      )}

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Total Supplied Card */}
        <div className="card stat-card p-5">
          <h3 className="text-gray-400 text-sm mb-2">Total Supplied</h3>
          <div className="flex items-end justify-between">
            <div className="flex items-baseline">
              <span className="text-xl md:text-2xl font-bold mr-2">
                ${mockPoolData?.totalSupplied || "1,245,678"}
              </span>
              <span className="text-success text-xs md:text-sm flex items-center">
                <i className="fas fa-arrow-up mr-1"></i>
                2.4%
              </span>
            </div>
            <i className="fas fa-coins text-xl md:text-2xl text-gray-500"></i>
          </div>
        </div>
        
        {/* Total Borrowed Card */}
        <div className="card stat-card p-5">
          <h3 className="text-gray-400 text-sm mb-2">Total Borrowed</h3>
          <div className="flex items-end justify-between">
            <div className="flex items-baseline">
              <span className="text-xl md:text-2xl font-bold mr-2">
                ${mockPoolData?.totalBorrowed || "867,432"}
              </span>
              <span className="text-warning text-xs md:text-sm flex items-center">
                <i className="fas fa-arrow-down mr-1"></i>
                1.2%
              </span>
            </div>
            <i className="fas fa-hand-holding-dollar text-xl md:text-2xl text-gray-500"></i>
          </div>
        </div>
        
        {/* Utilization Rate Card */}
        <div className="card stat-card p-5">
          <h3 className="text-gray-400 text-sm mb-2">Utilization Rate</h3>
          <div className="flex items-end justify-between">
            <div className="flex items-baseline">
              <span className="text-xl md:text-2xl font-bold mr-2">
                {mockPoolData?.utilizationRate || "69.6"}%
              </span>
              <span className="text-success bg-green-900 bg-opacity-20 px-2 py-0.5 rounded-full text-xs">
                Optimal
              </span>
            </div>
            <i className="fas fa-chart-pie text-xl md:text-2xl text-gray-500"></i>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Optimal range: 50-80%
          </div>
        </div>
      </div>

      {/* Pool Card */}
      <div className="card pool-card overflow-hidden mb-8">
        <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between cursor-pointer bg-dark-tertiary">
          <div className="mb-2 sm:mb-0">
            <h2 className="text-lg font-medium">
              {POOL_CONFIG?.name || "TrustBridge-MicroLoans"} Pool
            </h2>
            <div className="text-xs text-gray-400 mt-1">
              Oracle:{" "}
              {ORACLE_ID
                ? `${ORACLE_ID.substring(0, 8)}...${ORACLE_ID.substring(-4)}`
                : "0x7a9f92e53bDFAC9007A40D103852377E984BDDc9"}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {POOL_CONFIG && (
              <>
                <span className="text-xs bg-neutral-800 text-neutral-300 px-2 py-1 rounded border border-neutral-600">
                  {POOL_CONFIG.maxPositions} Max Positions
                </span>
                <span className="text-xs bg-neutral-800 text-neutral-300 px-2 py-1 rounded border border-neutral-600">
                  {POOL_CONFIG.backstopRate}% Backstop Rate
                </span>
              </>
            )}
          </div>
        </div>

        {/* Pool Content */}
        <div className="p-4 sm:p-6">
          {/* Pool Tabs */}
          <div className="tab-buttons flex mb-4 overflow-x-auto">
            <div className="tab-btn active whitespace-nowrap">Supply & Borrow</div>
            <div className="tab-btn whitespace-nowrap">Analytics</div>
            <div className="tab-btn whitespace-nowrap">History</div>
          </div>

          {/* Asset Table */}
          <div className="mb-6">
            <ResponsiveTable
              columns={tableColumns}
              data={tableData}
              keyField="symbol"
              className="w-full"
            />
          </div>

          {/* Actions Section */}
          <div className="mt-6 border-t border-custom pt-6">
            {/* Quick Supply Section */}
            {isPoolDeployed && (
              <div className="mb-4">
                <label htmlFor="amount-input" className="form-label block mb-2">
                  Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="amount-input"
                    className="form-input text-base sm:text-lg h-12 w-full"
                    placeholder="0.00"
                    value={supplyAmount}
                    onChange={(e) => setSupplyAmount(e.target.value)}
                    min="0"
                    step="1"
                    disabled={supplying}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                    USDC
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {!isPoolDeployed ? (
                <button
                  className="btn-primary w-full flex items-center justify-center"
                  onClick={handleDeployPool}
                  disabled={!canDeployPool}
                >
                  {deploying ? (
                    <>
                      <div className="loader mr-2"></div>
                      Deploying...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-rocket mr-2"></i>
                      Deploy Pool
                    </>
                  )}
                </button>
              ) : (
                <>
                  <button
                    className="btn-primary w-full flex items-center justify-center"
                    onClick={handleSupplyToPool}
                    disabled={!canSupplyToPool}
                  >
                    {supplying ? (
                      <>
                        <div className="loader mr-2"></div>
                        Supplying...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-bolt mr-2"></i>
                        Quick Supply
                      </>
                    )}
                  </button>

                  <button
                    className="btn-primary w-full flex items-center justify-center"
                    onClick={openSupplyUSDCModal}
                    disabled={!isWalletConnected}
                  >
                    <i className="fas fa-arrow-up mr-2"></i>
                    Supply USDC
                  </button>

                  <button
                    className="btn-secondary w-full flex items-center justify-center"
                    onClick={openSupplyXLMModal}
                    disabled={!isWalletConnected}
                  >
                    <i className="fas fa-shield mr-2"></i>
                    Supply XLM
                  </button>

                  <button
                    className="btn-secondary w-full flex items-center justify-center"
                    onClick={openProvideLiquidityModal}
                    disabled={!canInteractWithPool}
                  >
                    <i className="fas fa-droplet mr-2"></i>
                    Add Liquidity
                  </button>

                  <button
                    className="btn-danger w-full flex items-center justify-center"
                    onClick={openBorrowModal}
                    disabled={!canInteractWithPool}
                  >
                    <i className="fas fa-arrow-down mr-2"></i>
                    Borrow USDC
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <BorrowModal
        isOpen={showBorrowModal}
        onClose={closeBorrowModal}
        poolData={mockPoolData}
        poolId={deployedPoolId || ""}
      />
      <SupplyUSDCModal
        isOpen={showSupplyUSDCModal}
        onClose={closeSupplyUSDCModal}
        onSuccess={handleSupplySuccess}
      />
      <SupplyXLMCollateralModal
        isOpen={showSupplyXLMModal}
        onClose={closeSupplyXLMModal}
        onSuccess={handleSupplySuccess}
      />
      <ProvideLiquidityModal
        isOpen={showProvideLiquidityModal}
        onClose={closeProvideLiquidityModal}
        poolData={mockPoolData}
      />
      {/* RoleSelectionModal is handled by parent pages */}
    </main>
     /* RoleSelectionModal is handled by parent pages */
  );
}
