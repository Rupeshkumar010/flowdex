'use client';

import React from 'react';
import { useTradingStore } from '../flowdex-store';
import { X } from 'lucide-react';

export default function Positions() {
  const positions = useTradingStore((s) => s.positions);
  const closePosition = useTradingStore((s) => s.closePosition);
  const prices = useTradingStore((s) => s.prices);

  if (positions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">No open positions</p>
        <p className="text-sm text-slate-500 mt-2">Create a trade to start building positions</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {positions.map((pos) => (
        <div key={pos.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-white">{pos.pair}</span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    pos.type === 'long'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {pos.type.toUpperCase()} {pos.leverage}x
                </span>
              </div>
              <p className="text-sm text-slate-400">
                Size: {pos.amount.toFixed(4)} {pos.pair.split('/')[0]}
              </p>
            </div>
            <button
              onClick={() => {
                if (confirm('Close this position?')) {
                  closePosition(pos.id);
                }
              }}
              className="p-2 hover:bg-red-500/20 rounded transition text-red-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
            <div>
              <p className="text-slate-400">Entry Price</p>
              <p className="text-white font-semibold">
                ${pos.entryPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Current Price</p>
              <p className="text-white font-semibold">
                ${pos.currentPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-700">
            <div className="flex justify-between items-center">
              <p className="text-sm text-slate-400">P&L</p>
              <p className={`text-lg font-bold ${pos.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                <span className="text-sm ml-2">({pos.pnlPercent >= 0 ? '+' : ''}{pos.pnlPercent.toFixed(2)}%)</span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
