"use client";

import { WalletProvider } from "./wallet.provider";
import { TabsProvider } from "./tabs.provider";
import { UserProvider } from "./user.provider";
import { RoleProvider } from "./role.provider";
import { ThemeProvider } from "./theme.provider";

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <WalletProvider>
        <TabsProvider>
          <UserProvider>
            <RoleProvider>{children}</RoleProvider>
          </UserProvider>
        </TabsProvider>
      </WalletProvider>
    </ThemeProvider>
  );
};
