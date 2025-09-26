#!/usr/bin/env tsx

import { getAllBalances } from "../src/helpers/wallet-balance.helper";
import { TOKENS } from "../src/config/contracts";

async function testWalletBalance() {
  console.log("🧪 Testing Wallet Balance Helper...\n");

  // Test wallet address (you can replace with a real one)
  const testWallet = "GD7M2UK2HEJDOMDLYIFEHOQV5E7DG2ONYW724YHWALFFTSSWB223DJ22";

  console.log(`👛 Testing with wallet: ${testWallet}\n`);

  try {
    console.log("📊 Fetching balances for all tokens...");
    const balances = await getAllBalances(testWallet, {
      USDC: TOKENS.USDC,
      XLM: TOKENS.XLM,
      TBRG: TOKENS.TBRG,
    });

    console.log("\n✅ Wallet Balance Results:");
    console.log("==========================");

    Object.entries(balances).forEach(([token, balance]) => {
      console.log(`${token}: ${balance}`);
    });

    console.log("\n🎉 Wallet balance helper test completed successfully!");
    console.log("   No errors should appear above this message.");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testWalletBalance().catch(console.error);
