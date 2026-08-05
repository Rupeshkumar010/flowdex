'use client';

import React, { useEffect, useState } from 'react';
import { useTradingStore } from '../flowdex-store';

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

interface Props {
  pair: string;
}

export default function OrderBook({ pair }: Props) {
  const [buyOrders, setBuyOrders] = useState<OrderBookEntry[]>([]);
  const [sellOrders, setSellOrders] = useState<OrderBookEntry[]>([]);
  const prices = useTradingStore((s) => s.prices);
  const baseToken = pair.split('/')[0];
  const currentPrice = prices[baseToken];

  // Generate mock order book
  useEffect(() => {
    const generateOrders = (isActive: boolean) => {
      const orders: OrderBookEntry[] = Array.from({ length: 8 }, (_, i) => ({
        price: currentPrice * (1 - (i + 1) * 0.003),
        amount: Math.random() * 50 + 10,
        total: 0,
      }));
      
      orders.forEach((order, i) => {
        order.total = order.price * orders.slice(0, i + 1).reduce((sum, o) => sum + o.amount, 0);
      });

      return orders;
    };

    const buys = generateOrders(true);
    setSellOrders(
      Array.from({ length: 8 }, (_, i) => ({
        price: currentPrice * (1 + (i + 1) * 0.003),
        amount: Math.random() * 50 + 10,
        total: 0,
      })).map((order, i, arr) => {
        const cumAmount = arr.slice(0, i + 1).reduce((sum, o) => sum + o.amount, 0);
        return { ...order, total: order.price * cumAmount };
      })
    );

    setBuyOrders(buys);
  }, [currentPrice, pair]);

  const maxTotal = Math.max(...buyOrders.map((o) => o.total), ...sellOrders.map((o) => o.total));

  const renderOrders = (orders: OrderBookEntry[], type: 'buy' | 'sell') => {
    return orders.map((order, i) => {
      const percentage = (order.total / maxTotal) * 100;
      const isBuy = type === 'buy';
      return (
        <div
          key={i}
          className="relative py-2 px-3 text-sm hover:bg-slate-700/50 transition"
        >
          <div
            className={`absolute inset-0 ${
              isBuy ? 'bg-green-500/10' : 'bg-red-500/10'
            }`}
            style={{ width: `${percentage}%` }}
          />
          <div className="relative flex justify-between">
            <span className={isBuy ? 'text-green-400' : 'text-red-400'}>
              ${order.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </span>
            <span className="text-slate-300">{order.amount.toFixed(2)}</span>
            <span className="text-slate-400">${order.total.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
      <h3 className="text-lg font-bold text-white mb-4">Order Book</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Sell Orders */}
        <div>
          <h4 className="text-xs text-slate-400 uppercase tracking-wide mb-2">Sell Orders</h4>
          <div className="bg-slate-800/30 rounded border border-slate-700/50">
            <div className="grid grid-cols-3 gap-2 px-3 py-2 border-b border-slate-700/50 text-xs text-slate-500 uppercase">
              <div>Price</div>
              <div>Amount</div>
              <div>Total</div>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {renderOrders(sellOrders, 'sell')}
            </div>
          </div>
        </div>

        {/* Buy Orders */}
        <div>
          <h4 className="text-xs text-slate-400 uppercase tracking-wide mb-2">Buy Orders</h4>
          <div className="bg-slate-800/30 rounded border border-slate-700/50">
            <div className="grid grid-cols-3 gap-2 px-3 py-2 border-b border-slate-700/50 text-xs text-slate-500 uppercase">
              <div>Price</div>
              <div>Amount</div>
              <div>Total</div>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {renderOrders(buyOrders, 'buy')}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-slate-800/50 rounded text-center text-sm text-slate-400">
        Spread: 0.06% • Last Update: Just now
      </div>
    </div>
  );
}
