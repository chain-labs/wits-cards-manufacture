"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { skaleNebulaTestnet } from "viem/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { PROJECT_ID } from "@/constants";

const client = new QueryClient();
interface Props {
  children: React.ReactNode;
}

export const config = getDefaultConfig({
  appName: "wits",
  projectId: PROJECT_ID,
  chains: [skaleNebulaTestnet],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const RainbowKitContext = ({ children }: Props) => {
  return (
    <WagmiProvider config={config} reconnectOnMount={true}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default RainbowKitContext;
