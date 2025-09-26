import { TRUSTBRIDGE_POOL_ID, TOKENS } from "@/config/contracts";
import { PoolContractV2 } from "@blend-capital/blend-sdk";

/**
 * Health factor calculation result
 */
export interface HealthFactorResult {
  healthFactor: number;
  collateralValue: number;
  borrowedValue: number;
  collateralRatio: number;
  liquidationThreshold: number;
  isAtRisk: boolean;
  riskLevel: 'safe' | 'warning' | 'danger' | 'liquidatable';
  recommendations: string[];
}

/**
 * Position information
 */
export interface PositionInfo {
  asset: string;
  supplied: number;
  borrowed: number;
  collateralFactor: number;
  price: number;
}

/**
 * Calculate health factor for a user's position
 * 
 * @param positions - Array of user positions
 * @returns Health factor calculation result
 */
export function calculateHealthFactor(positions: PositionInfo[]): HealthFactorResult {
  let totalCollateralValue = 0;
  let totalBorrowedValue = 0;
  let weightedCollateralValue = 0;

  // Calculate total values
  positions.forEach(position => {
    const collateralValue = position.supplied * position.price;
    const borrowedValue = position.borrowed * position.price;
    
    totalCollateralValue += collateralValue;
    totalBorrowedValue += borrowedValue;
    weightedCollateralValue += collateralValue * (position.collateralFactor / 100);
  });

  // Calculate health factor
  const healthFactor = totalBorrowedValue > 0 ? weightedCollateralValue / totalBorrowedValue : 999;
  const collateralRatio = totalBorrowedValue > 0 ? (totalCollateralValue / totalBorrowedValue) * 100 : 0;
  
  // Determine liquidation threshold (typically 1.0 for most protocols)
  const liquidationThreshold = 1.0;
  
  // Determine risk level
  let riskLevel: HealthFactorResult['riskLevel'] = 'safe';
  const recommendations: string[] = [];

  if (healthFactor <= liquidationThreshold) {
    riskLevel = 'liquidatable';
    recommendations.push('Your position is at risk of liquidation. Add collateral immediately.');
  } else if (healthFactor <= 1.2) {
    riskLevel = 'danger';
    recommendations.push('Your position is at high risk. Consider adding collateral or repaying debt.');
  } else if (healthFactor <= 1.5) {
    riskLevel = 'warning';
    recommendations.push('Monitor your position closely. Consider adding collateral for safety.');
  } else {
    riskLevel = 'safe';
    recommendations.push('Your position is healthy. Continue monitoring for market changes.');
  }

  return {
    healthFactor,
    collateralValue: totalCollateralValue,
    borrowedValue: totalBorrowedValue,
    collateralRatio,
    liquidationThreshold,
    isAtRisk: healthFactor <= 1.5,
    riskLevel,
    recommendations
  };
}

/**
 * Get real-time price for an asset
 * 
 * @param asset - Asset symbol (USDC, XLM, TBRG)
 * @returns Current price in USD
 */
export async function getAssetPrice(asset: string): Promise<number> {
  try {
    // For now, return mock prices
    // In production, this would fetch from oracle or price feed
    const mockPrices: Record<string, number> = {
      'USDC': 1.00,
      'XLM': 0.12,
      'TBRG': 0.15
    };

    return mockPrices[asset] || 0;
  } catch (error) {
    console.error(`Error fetching price for ${asset}:`, error);
    return 0;
  }
}

/**
 * Get user positions from the pool
 * 
 * @param walletAddress - User's wallet address
 * @returns Array of user positions
 */
export async function getUserPositions(walletAddress: string): Promise<PositionInfo[]> {
  try {
    const pool = new PoolContractV2(TRUSTBRIDGE_POOL_ID);
    
    // Get user positions for each asset
    const positions: PositionInfo[] = [];
    
    for (const [symbol, tokenAddress] of Object.entries(TOKENS)) {
      try {
        // Get user's supplied and borrowed amounts
        const supplied = await getUserSuppliedAmount(pool, walletAddress, tokenAddress);
        const borrowed = await getUserBorrowedAmount(pool, walletAddress, tokenAddress);
        const price = await getAssetPrice(symbol);
        
        // Get collateral factor from pool configuration
        const collateralFactor = getCollateralFactor(symbol);
        
        if (supplied > 0 || borrowed > 0) {
          positions.push({
            asset: symbol,
            supplied,
            borrowed,
            collateralFactor,
            price
          });
        }
      } catch (error) {
        console.error(`Error getting position for ${symbol}:`, error);
      }
    }
    
    return positions;
  } catch (error) {
    console.error('Error getting user positions:', error);
    return [];
  }
}

/**
 * Get user's supplied amount for a specific asset
 * 
 * @param _pool - Pool contract instance (unused for now)
 * @param _walletAddress - User's wallet address (unused for now)
 * @param _tokenAddress - Token contract address (unused for now)
 * @returns Supplied amount
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getUserSuppliedAmount(_pool: PoolContractV2, _walletAddress: string, _tokenAddress: string): Promise<number> {
  try {
    // This would call the pool contract to get user's supplied amount
    // For now, return mock data
    return Math.random() * 1000;
  } catch (error) {
    console.error('Error getting supplied amount:', error);
    return 0;
  }
}

/**
 * Get user's borrowed amount for a specific asset
 * 
 * @param _pool - Pool contract instance (unused for now)
 * @param _walletAddress - User's wallet address (unused for now)
 * @param _tokenAddress - Token contract address (unused for now)
 * @returns Borrowed amount
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getUserBorrowedAmount(_pool: PoolContractV2, _walletAddress: string, _tokenAddress: string): Promise<number> {
  try {
    // This would call the pool contract to get user's borrowed amount
    // For now, return mock data
    return Math.random() * 500;
  } catch (error) {
    console.error('Error getting borrowed amount:', error);
    return 0;
  }
}

/**
 * Get collateral factor for an asset
 * 
 * @param asset - Asset symbol
 * @returns Collateral factor as percentage
 */
function getCollateralFactor(asset: string): number {
  const collateralFactors: Record<string, number> = {
    'USDC': 85, // 85%
    'XLM': 75,  // 75%
    'TBRG': 60  // 60%
  };
  
  return collateralFactors[asset] || 0;
}

/**
 * Monitor health factor in real-time
 * 
 * @param walletAddress - User's wallet address
 * @param callback - Callback function to handle health factor updates
 * @returns Function to stop monitoring
 */
export function monitorHealthFactor(
  walletAddress: string, 
  callback: (result: HealthFactorResult) => void
): () => void {
  let isMonitoring = true;
  
  const checkHealthFactor = async () => {
    if (!isMonitoring) return;
    
    try {
      const positions = await getUserPositions(walletAddress);
      const healthFactor = calculateHealthFactor(positions);
      callback(healthFactor);
    } catch (error) {
      console.error('Error monitoring health factor:', error);
    }
  };
  
  // Check immediately
  checkHealthFactor();
  
  // Check every 30 seconds
  const interval = setInterval(checkHealthFactor, 30000);
  
  // Return function to stop monitoring
  return () => {
    isMonitoring = false;
    clearInterval(interval);
  };
}

/**
 * Get health factor alerts
 * 
 * @param healthFactor - Current health factor
 * @returns Array of alert messages
 */
export function getHealthFactorAlerts(healthFactor: HealthFactorResult): string[] {
  const alerts: string[] = [];
  
  if (healthFactor.riskLevel === 'liquidatable') {
    alerts.push('🚨 CRITICAL: Your position is at risk of liquidation!');
    alerts.push('Add collateral immediately to protect your position.');
  } else if (healthFactor.riskLevel === 'danger') {
    alerts.push('⚠️ WARNING: Your position is at high risk.');
    alerts.push('Consider adding collateral or repaying debt.');
  } else if (healthFactor.riskLevel === 'warning') {
    alerts.push('⚠️ CAUTION: Monitor your position closely.');
    alerts.push('Market volatility may affect your health factor.');
  }
  
  return alerts;
}

/**
 * Calculate maximum borrowable amount
 * 
 * @param collateralValue - Total collateral value in USD
 * @param collateralFactor - Collateral factor as percentage
 * @param currentBorrowed - Currently borrowed amount
 * @returns Maximum amount that can be borrowed
 */
export function calculateMaxBorrowable(
  collateralValue: number,
  collateralFactor: number,
  currentBorrowed: number
): number {
  const maxBorrowable = (collateralValue * collateralFactor / 100) - currentBorrowed;
  return Math.max(0, maxBorrowable);
}

/**
 * Calculate liquidation price
 * 
 * @param borrowedAmount - Total borrowed amount
 * @param collateralAmount - Total collateral amount
 * @param collateralFactor - Collateral factor as percentage
 * @returns Price at which position would be liquidated
 */
export function calculateLiquidationPrice(
  borrowedAmount: number,
  collateralAmount: number,
  collateralFactor: number
): number {
  if (collateralAmount === 0) return 0;
  
  // Liquidation occurs when: borrowed / (collateral * price * factor) = 1
  // Therefore: price = borrowed / (collateral * factor)
  return borrowedAmount / (collateralAmount * collateralFactor / 100);
}
