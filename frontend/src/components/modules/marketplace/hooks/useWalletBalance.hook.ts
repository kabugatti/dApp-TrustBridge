// frontend/src/components/modules/marketplace/hooks/useWalletBalance.hook.ts
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useWalletContext } from "@/providers/wallet.provider";
import { TOKENS } from "@/config/contracts";
import {
  getAllBalances,
} from "@/helpers/wallet-balance.helper";

export function useWalletBalance() {
  const { walletAddress } = useWalletContext();
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const hasWallet = Boolean(walletAddress);

  const refresh = useCallback(async () => {
    if (!walletAddress) return;
    setLoading(true);
    setError(null);
    try {
      // Ensure we only fetch for the tokens we care about
      const map = await getAllBalances(walletAddress, {
        USDC: TOKENS.USDC,
        XLM: TOKENS.XLM,
        TBRG: TOKENS.TBRG,
      });
      setBalances(map);
    } catch (e) {
      console.error("Error fetching balances", e);
      setError("Failed to load wallet balances");
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (hasWallet) {
      refresh();
    } else {
      setBalances({});
      setLoading(false);
    }
  }, [hasWallet, refresh]);

  // simple pretty format (keep as strings)
  const balancesFormatted = useMemo(() => {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(balances)) {
      // Keep as-is; you can Intl.NumberFormat if you prefer locale formatting
      out[k] = v ?? "0";
    }
    return out;
  }, [balances]);

  return {
    balances,
    balancesFormatted,
    loading,
    error,
    refresh,
    hasWallet,
  };
}
