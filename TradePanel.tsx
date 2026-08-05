'use client';

import React, { useState } from 'react';
import { useTradingStore } from '../flowdex-store';
import { LEVERAGE_OPTIONS, ORDER_LIMITS } from '../flowdex-config';
import { ArrowRight } from 'lucide-react';

interface Props {
  pair: string;
}

export default function TradePanel({ pair }: Props) {
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [leverage, setLeverage] = useState(1);
  const [loading, setLoading] = useState(false);

  const prices = useTradingStore((s) => s.prices);
  const addOrder = useTradingStore((s) => s.addOrder);
  const portfolio = useTradingStore((s) => s.portfolio);

  const baseToken = pair.split('/')[0];
  const currentPrice = prices[baseToken];
  const orderPrice = orderType === 'limit' ? parseFloat(price) || 0 : currentPrice;
  const total = parseFloat(amount) * orderPrice * leverage;

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) === 0) {
      alert('Please enter an amount');
      return;
    }

    if (orderType === 'limit' && !price) {
      alert('Please enter a price');
      return;
    }

    if (total > ORDER_LIMITS.maxUSDC) {
      alert(`Order exceeds max limit of $${ORDER_LIMITS.maxUSDC}`);
      return;
    }

    if (tradeType === 'buy' && total > portfolio.usdcBalance) {
      alert('Insufficient balance');
      return;
    }

    setLoading(true);

    // Simulate order creation
    setTimeout(() => {
      addOrder({
        pair,
        type: tradeType,
        amount: parseFloat(amount),
        price: orderPrice,
        leverage,
        status: 'pending',
      });

      // Reset form
      setAmount('');
      setPrice('');
      setLoading(false);
      alert(`${tradeType.toUpperCase()} order created successfully!`);
    }, 1000);
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6">
      <h3 className="text-lg font-bold text-white mb-6">Trade {pair}</h3>

      {/* Type Selector */}
      <div className="flex gap-2 mb-6">
        {(['buy', 'sell'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setTradeType(type)}
            className={`flex-1 py-3 rounded-lg font-semibold transition ${
              tradeType === type
                ? type === 'buy'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                  : 'bg-red-500/20 text-red-400 border border-red-500/50'
                : 'bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            {type === 'buy' ? '⬆ Buy' : '⬇ Sell'}
          </button>
        ))}
      </div>

      {/* Order Type */}
      <div className="flex gap-2 mb-6">
        {(['market', 'limit'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setOrderType(type)}
            className={`flex-1 py-2 text-sm rounded transition ${
              orderType === type
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                : 'bg-slate-700 text-slate-400 border border-slate-700'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Amount Input */}
      <div className="mb-4">
        <label className="block text-sm text-slate-400 mb-2">Amount ({baseToken})</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full bg-slate-700 border border-slate-600 rounded p-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Price Input (Limit Orders) */}
      {orderType === 'limit' && (
        <div className="mb-4">
          <label className="block text-sm text-slate-400 mb-2">Price (USDC)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder={currentPrice.toFixed(2)}
            className="w-full bg-slate-700 border border-slate-600 rounded p-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      )}

      {/* Leverage */}
      <div className="mb-6">
        <label className="block text-sm text-slate-400 mb-2">Leverage: {leverage}x</label>
        <div className="flex gap-2">
          {LEVERAGE_OPTIONS.slice(0, 4).map((lev) => (
            <button
              key={lev}
              onClick={() => setLeverage(lev)}
              className={`flex-1 py-2 text-sm rounded transition ${
                leverage === lev
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                  : 'bg-slate-700 text-slate-400 border border-slate-700 hover:border-slate-600'
              }`}
            >
              {lev}x
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-slate-700/50 rounded p-4 mb-6 space-y-2 text-sm">
        <div className="flex justify-between text-slate-400">
          <span>Current Price:</span>
          <span className="text-white">${currentPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Order Price:</span>
          <span className="text-white">${orderPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Total (USDC):</span>
          <span className={total > portfolio.usdcBalance && tradeType === 'buy' ? 'text-red-400' : 'text-white'}>
            ${total.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading || !amount}
        className={`w-full py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
          tradeType === 'buy'
            ? 'bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white'
            : 'bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white'
        }`}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          <>
            {tradeType === 'buy' ? 'Buy' : 'Sell'} {baseToken}
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <p className="text-xs text-slate-500 mt-4 text-center">
        Balance: {portfolio.usdcBalance.toFixed(2)} USDC
      </p>
    </div>
  );
}
