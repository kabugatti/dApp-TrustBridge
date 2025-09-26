"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/layouts/header/Header";
import { useWalletContext } from "@/providers/wallet.provider";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { walletAddress } = useWalletContext();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Temporarily disabled for development/testing
    // TODO: Re-enable wallet check for production
    // if (!walletAddress) {
    //   router.replace("/");
    // }
  }, [walletAddress, router]);

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return (
      <div className="min-h-screen flex flex-col w-full bg-neutral-900">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  // Temporarily disabled for development/testing
  // TODO: Re-enable wallet check for production
  // if (!walletAddress) {
  //   return null;
  // }

  return (
    <div className="min-h-screen flex flex-col w-full bg-neutral-900">
      <Header />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
