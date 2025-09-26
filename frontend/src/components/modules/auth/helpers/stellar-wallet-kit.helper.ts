import { kit } from "@/config/wallet-kit";
import { NETWORK_CONFIG } from "@/config/contracts";
import { Transaction, TransactionBuilder, Memo, Operation } from "@stellar/stellar-sdk";

/**
 * Custom error type for wallet-related errors
 */
interface WalletError extends Error {
  code?: number;
  message: string;
  name: string;
}

/**
 * Wallet account information
 */
export interface WalletAccount {
  address: string;
  balance: number;
  assets: AssetBalance[];
}

/**
 * Asset balance information
 */
export interface AssetBalance {
  asset: string;
  balance: string;
  assetType: string;
  assetCode?: string;
  assetIssuer?: string;
}

/**
 * Transaction history item
 */
export interface TransactionHistoryItem {
  hash: string;
  timestamp: string;
  type: 'payment' | 'trustline' | 'contract' | 'other';
  amount?: string;
  asset?: string;
  from?: string;
  to?: string;
  memo?: string;
}

/**
 * Sign a transaction using the connected wallet
 * 
 * @param transaction - The transaction to sign (can be Transaction object or XDR string)
 * @returns The signed transaction
 * @throws {Error} If the transaction signing fails or returns an unexpected type
 */
export async function signTransaction(transaction: Transaction<Memo, Operation[]> | string): Promise<Transaction<Memo, Operation[]>> {
  try {
    const unsignedXdr = typeof transaction === 'string' ? transaction : transaction.toXDR();
    
    const { signedTxXdr } = await kit.signTransaction(unsignedXdr, {
      networkPassphrase: NETWORK_CONFIG.networkPassphrase,
    });

    const signedTx = TransactionBuilder.fromXDR(signedTxXdr, NETWORK_CONFIG.networkPassphrase);
    if ('memo' in signedTx) {
      return signedTx as Transaction<Memo, Operation[]>;
    }
    throw new Error('Unexpected transaction type returned from signing');
  } catch (error: unknown) {
    if ((error as WalletError).code === -1) {
      throw new Error("Wallet rejected the transaction. Please try again.");
    }
    if (error instanceof Error) {
      throw new Error(`Transaction signing failed: ${error.message}`);
    }
    throw new Error("Unknown error occurred while signing transaction");
  }
}

/**
 * Get wallet account information including balances
 * 
 * @param address - The wallet address to query
 * @returns Promise with account information
 */
export async function getWalletAccountInfo(address: string): Promise<WalletAccount> {
  try {
    // Use fetch to get account info from Horizon API
    const response = await fetch(`${NETWORK_CONFIG.horizonUrl}/accounts/${address}`);
    if (!response.ok) {
      throw new Error('Failed to fetch account information');
    }
    
    const account = await response.json();
    
    const assets: AssetBalance[] = account.balances.map((balance: { asset_type: string; asset_code?: string; asset_issuer?: string; balance: string }) => ({
      asset: balance.asset_type === 'native' ? 'XLM' : `${balance.asset_code}:${balance.asset_issuer}`,
      balance: balance.balance,
      assetType: balance.asset_type,
      assetCode: balance.asset_code,
      assetIssuer: balance.asset_issuer
    }));

    return {
      address,
      balance: parseFloat(account.balances.find((b: { asset_type: string; balance: string }) => b.asset_type === 'native')?.balance || '0'),
      assets
    };
  } catch (error) {
    console.error('Error getting wallet account info:', error);
    throw new Error('Failed to get wallet account information');
  }
}

/**
 * Get transaction history for a wallet address
 * 
 * @param address - The wallet address to query
 * @param limit - Number of transactions to return (default: 20)
 * @returns Promise with transaction history
 */
export async function getTransactionHistory(address: string, limit: number = 20): Promise<TransactionHistoryItem[]> {
  try {
    // Use fetch to get transaction history from Horizon API
    const response = await fetch(`${NETWORK_CONFIG.horizonUrl}/accounts/${address}/transactions?limit=${limit}&order=desc`);
    if (!response.ok) {
      throw new Error('Failed to fetch transaction history');
    }
    
    const data = await response.json();
    const transactions = data._embedded?.records || [];

    return transactions.map((tx: { hash: string; created_at: string; operation_count: number; operations?: Array<{ type: string; amount?: string; asset_type?: string; asset_code?: string; from?: string; to?: string }>; memo?: string }) => {
      let type: TransactionHistoryItem['type'] = 'other';
      let amount: string | undefined;
      let asset: string | undefined;
      let from: string | undefined;
      let to: string | undefined;

      // Determine transaction type and extract relevant data
      if (tx.operation_count === 1) {
        const operations = tx.operations;
        if (operations && operations.length > 0) {
          const op = operations[0];
          if (op.type === 'payment') {
            type = 'payment';
            amount = op.amount;
            asset = op.asset_type === 'native' ? 'XLM' : op.asset_code || undefined;
            from = op.from;
            to = op.to;
          } else if (op.type === 'change_trust') {
            type = 'trustline';
          } else if (op.type === 'invoke_host_function') {
            type = 'contract';
          }
        }
      }

      return {
        hash: tx.hash,
        timestamp: tx.created_at,
        type,
        amount,
        asset,
        from,
        to,
        memo: tx.memo
      };
    });
  } catch (error) {
    console.error('Error getting transaction history:', error);
    throw new Error('Failed to get transaction history');
  }
}

/**
 * Check if wallet is connected and available
 * 
 * @returns Promise with connection status
 */
export async function isWalletConnected(): Promise<boolean> {
  try {
    // For StellarWalletsKit, we need to check if we can get the address
    const { address } = await kit.getAddress();
    return !!address;
  } catch (error) {
    console.error('Error checking wallet connection:', error);
    return false;
  }
}

/**
 * Get connected wallet address
 * 
 * @returns Promise with wallet address or null if not connected
 */
export async function getConnectedWalletAddress(): Promise<string | null> {
  try {
    const { address } = await kit.getAddress();
    return address || null;
  } catch (error) {
    console.error('Error getting connected wallet address:', error);
    return null;
  }
}

/**
 * Connect wallet with proper error handling
 * 
 * @returns Promise with connection result
 */
export async function connectWallet(): Promise<{ success: boolean; address?: string; error?: string }> {
  try {
    // For StellarWalletsKit, we need to check if it's already connected
    const { address } = await kit.getAddress();
    if (address) {
      return { success: true, address };
    }
    
    // If not connected, we need to trigger connection
    // This might require user interaction with the wallet
    return { success: false, error: 'Please connect your wallet manually' };
  } catch (error) {
    console.error('Error connecting wallet:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown connection error' 
    };
  }
}

/**
 * Disconnect wallet
 * 
 * @returns Promise with disconnection result
 */
export async function disconnectWallet(): Promise<{ success: boolean; error?: string }> {
  try {
    await kit.disconnect();
    return { success: true };
  } catch (error) {
    console.error('Error disconnecting wallet:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown disconnection error' 
    };
  }
}
