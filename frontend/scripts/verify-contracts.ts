#!/usr/bin/env tsx

import { rpc, Contract, TransactionBuilder } from "@stellar/stellar-sdk";
import { NETWORK_CONFIG, TOKENS } from "../src/config/contracts";

async function verifyContract(
  contractId: string,
  name: string,
): Promise<boolean> {
  try {
    const server = new rpc.Server(NETWORK_CONFIG.sorobanRpcUrl);
    const contract = new Contract(contractId);

    console.log(`🔍 Checking ${name} contract: ${contractId}`);

    // Try to call decimals method to verify contract exists
    const account = await server.getAccount(
      "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF",
    );
    const tx = new TransactionBuilder(account, {
      fee: "100000",
      networkPassphrase: NETWORK_CONFIG.networkPassphrase,
    })
      .addOperation(contract.call("decimals"))
      .setTimeout(30)
      .build();

    const sim = await server.simulateTransaction(tx);

    if (rpc.Api.isSimulationError(sim)) {
      console.log(`❌ ${name} contract error: ${sim.error}`);
      return false;
    }

    const retval = sim?.result?.retval;
    if (retval) {
      console.log(`✅ ${name} contract is deployed and accessible`);
      return true;
    } else {
      console.log(`❌ ${name} contract has no retval`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${name} contract verification failed:`, error);
    return false;
  }
}

async function main() {
  console.log("🔍 Verifying TrustBridge contracts on Stellar Testnet...\n");

  const contracts = [
    { id: TOKENS.USDC, name: "USDC" },
    { id: TOKENS.XLM, name: "XLM" },
    { id: TOKENS.TBRG, name: "TBRG" },
  ];

  const results = await Promise.all(
    contracts.map(async (contract) => {
      const isDeployed = await verifyContract(contract.id, contract.name);
      return { ...contract, deployed: isDeployed };
    }),
  );

  console.log("\n📊 Contract Deployment Status:");
  console.log("================================");

  results.forEach(({ name, id, deployed }) => {
    const status = deployed ? "✅ DEPLOYED" : "❌ NOT DEPLOYED";
    console.log(`${name}: ${status}`);
    console.log(`   Contract ID: ${id}`);
  });

  const deployedCount = results.filter((r) => r.deployed).length;
  console.log(
    `\n📈 Summary: ${deployedCount}/${results.length} contracts deployed`,
  );

  if (deployedCount < results.length) {
    console.log(
      "\n⚠️  Some contracts are not deployed. This will cause wallet balance errors.",
    );
    console.log(
      "   Consider deploying missing contracts or updating contract IDs.",
    );
  }
}

main().catch(console.error);
