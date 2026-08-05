'use client';

import React from 'react';
import { useTradingStore } from '../flowdex-store';
import { Wallet } from 'lucide-react';

export default function Portfolio() {
  const portfolio = useTradingStore((s) => s.portfolio);
  const positions = useTradingStore((s) => s.positions);

  const totalPnL = positions.reduce((sum, p) => sum + p.pnl, 0);
  const totalValue = portfolio.usdcBalance + totalPnL;

  return (
    <div className="space-y-4">
      {/* Main Balance */}
      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-4">
        <p className="text-sm text-slate-400 flex items-center gap-2">
          <Wallet className="w-4 h-4" />
          Total Balance
        </p>
        <h3 className="text-3xl font-bold text-white mt-2">
          ${totalValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
        </h3>
        <p className={`text-sm mt-2 ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          P&L: {totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString('en-US', { maximumFractionDigits: 2 })}
        </p>
      </div>

      {/* USDC Balance */}
      <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-slate-400">USDC Available</p>
            <p className="text-xl font-bold text-white mt-1">
              {portfolio.usdcBalance.toLocaleString('en-US', { maximumFractionDigits: 2 })} USDC
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">Total Deposit</p>
            <p className="text-xl font-bold text-white mt-1">
              ${portfolio.totalDeposit.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Pool Statistics */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-slate-300">Pool Statistics</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-slate-800/30 border border-slate-700 rounded p-3">
            <p className="text-slate-400 text-xs">LP Tokens</p>
            <p className="text-white font-semibold mt-1">
              {portfolio.totalLpTokens.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-slate-800/30 border border-slate-700 rounded p-3">
            <p className="text-slate-400 text-xs">Pool Share</p>
            <p className="text-white font-semibold mt-1">
              {(portfolio.poolShare * 100).toFixed(3)}%
            </p>
          </div>
        </div>
      </div>

      {/* Position Summary */}
      {positions.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-300">Open Positions</h4>
          <div className="space-y-2">
            {positions.map((pos) => (
              <div key={pos.id} className="bg-slate-800/30 border border-slate-700 rounded p-3 text-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-slate-400">{pos.pair}</p>
                    <p className="text-white font-semibold mt-1">
                      {pos.type.toUpperCase()} {pos.amount.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={pos.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-slate-400 text-xs mt-1">
                      {pos.pnlPercent >= 0 ? '+' : ''}{pos.pnlPercent.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
