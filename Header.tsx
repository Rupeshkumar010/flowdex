'use client';

import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { Wallet, LogOut } from 'lucide-react';

export default function Header() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <header className="border-b border-slate-700 bg-slate-900/30 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">≋</span>
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            FlowDEX
          </h1>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {isConnected && address && (
            <>
              <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg">
                <Wallet className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-mono text-slate-300">
                  {formatAddress(address)}
                </span>
              </div>
              <button
                onClick={() => disconnect()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition text-slate-300 hover:text-slate-100"
              >
                <LogOut className="w-4 h-4" />
                Disconnect
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
