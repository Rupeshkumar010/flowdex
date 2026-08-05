'use client';

import React, { ReactNode } from 'react';
import { WagmiConfig, createConfig, http } from 'wagmi';
import { injected, walletConnect, metaMask } from 'wagmi/connectors';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { arcTestnet } from './flowdex-config';
import '@rainbow-me/rainbowkit/styles.css';
import './globals.css';

const wagmiConfig = createConfig({
  chains: [arcTestnet],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ projectId: 'YOUR_WALLETCONNECT_PROJECT_ID' }),
  ],
  transports: {
    [arcTestnet.id]: http('https://testnet-rpc.arc.io'),
  },
});

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>FlowDEX - Arc Testnet Trading</title>
        <meta name="description" content="Multi-pair OTC trading on Arc testnet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-slate-950 text-white">
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider>
            {children}
          </RainbowKitProvider>
        </WagmiConfig>
      </body>
    </html>
  );
}
