'use client';

import React from 'react';
import { useTradingStore } from '../flowdex-store';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

export default function OrderHistory() {
  const orders = useTradingStore((s) => s.orders);
  const cancelOrder = useTradingStore((s) => s.cancelOrder);

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">No orders yet</p>
        <p className="text-sm text-slate-500 mt-2">Create a trade to see your order history</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'filled':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400 animate-spin" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-2">
      {orders
        .slice()
        .reverse()
        .map((order) => (
          <div key={order.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(order.status)}
                <div>
                  <p className="text-sm font-semibold text-white">{order.pair}</p>
                  <p className="text-xs text-slate-400">
                    {order.type.toUpperCase()} • {new Date(order.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  order.type === 'buy'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs mb-2">
              <div>
                <p className="text-slate-400">Amount</p>
                <p className="text-white font-semibold">{order.amount.toFixed(4)}</p>
              </div>
              <div>
                <p className="text-slate-400">Price</p>
                <p className="text-white font-semibold">
                  ${order.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-slate-400">Leverage</p>
                <p className="text-white font-semibold">{order.leverage}x</p>
              </div>
            </div>

            {order.status === 'open' && (
              <button
                onClick={() => {
                  if (confirm('Cancel this order?')) {
                    cancelOrder(order.id);
                  }
                }}
                className="w-full text-xs py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition"
              >
                Cancel Order
              </button>
            )}

            {order.txHash && (
              <a
                href={`https://testnet.arcscan.app/tx/${order.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-cyan-400 hover:text-cyan-300 mt-2 block"
              >
                View on ArcScan →
              </a>
            )}
          </div>
        ))}
    </div>
  );
}
