'use client';

import React from 'react';
import { useTradingStore } from '../flowdex-store';
import { ChevronDown } from 'lucide-react';

interface TradingPair {
  symbol: string;
  base: string;
  quote: string;
}

interface Props {
  pairs: TradingPair[];
}

export default function TradingPairSelector({ pairs }: Props) {
  const [open, setOpen] = React.useState(false);
  const selectedPair = useTradingStore((s) => s.selectedPair);
  const setSelectedPair = useTradingStore((s) => s.setSelectedPair);
  const prices = useTradingStore((s) => s.prices);

  const currentPrice = prices[selectedPair.split('/')[0]] || 0;
  const baseToken = selectedPair.split('/')[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{selectedPair}</h2>
            <p className="text-sm text-slate-400">
              Price: ${currentPrice.toLocaleString('en-US', {
                maximumFractionDigits: baseToken === 'PEPE' ? 8 : 2,
              })}
            </p>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
          {pairs.map((pair) => (
            <button
              key={pair.symbol}
              onClick={() => {
                setSelectedPair(pair.symbol);
                setOpen(false);
              }}
              className={`w-full px-4 py-3 text-left transition hover:bg-slate-700 border-b border-slate-700 last:border-0 ${
                selectedPair === pair.symbol
                  ? 'bg-slate-700 text-cyan-400'
                  : 'text-slate-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">{pair.symbol}</span>
                <span className="text-sm">
                  ${prices[pair.base].toLocaleString('en-US', {
                    maximumFractionDigits: pair.base === 'PEPE' ? 8 : 2,
                  })}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
