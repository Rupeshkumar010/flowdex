'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { TRADING_PAIRS, MOCK_PRICES } from './flowdex-config';
import { useTradingStore } from './flowdex-store';
import Header from './components/Header';
import TradingPairSelector from './components/TradingPairSelector';
import PriceChart from './components/PriceChart';
import OrderBook from './components/OrderBook';
import TradePanel from './components/TradePanel';
import Portfolio from './components/Portfolio';
import OrderHistory from './components/OrderHistory';
import Positions from './components/Positions';

export default function Home() {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const [activeTab, setActiveTab] = useState<'trade' | 'portfolio' | 'positions' | 'orders'>('trade');
  const selectedPair = useTradingStore((s) => s.selectedPair);
  const prices = useTradingStore((s) => s.prices);

  // Simulate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newPrices: Record<string, number> = {};
      Object.entries(prices).forEach(([token, price]) => {
        const change = (Math.random() - 0.5) * 100;
        newPrices[token] = Math.max(price + change, 0.00001);
      });
      useTradingStore.setState({ prices: newPrices });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            FlowDEX
          </h1>
          <p className="text-lg text-slate-400 mb-8">Multi-pair OTC Trading on Arc Testnet</p>
          <button
            onClick={() => connect({ connector: connectors[0] })}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Trading */}
          <div className="lg:col-span-2 space-y-6">
            <TradingPairSelector pairs={TRADING_PAIRS} />
            <PriceChart pair={selectedPair} price={prices[selectedPair.split('/')[0]]} />
            <OrderBook pair={selectedPair} />
          </div>

          {/* Right Panel - Trade & Portfolio */}
          <div className="space-y-6">
            <TradePanel pair={selectedPair} />
            
            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-700">
              {(['trade', 'portfolio', 'positions', 'orders'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-semibold border-b-2 transition ${
                    activeTab === tab
                      ? 'border-cyan-500 text-cyan-400'
                      : 'border-transparent text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
              {activeTab === 'portfolio' && <Portfolio />}
              {activeTab === 'positions' && <Positions />}
              {activeTab === 'orders' && <OrderHistory />}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-700 text-center text-sm text-slate-400">
          <p>Built on Arc Testnet • Testnet assets have no real-world value</p>
        </div>
      </div>
    </div>
  );
}
