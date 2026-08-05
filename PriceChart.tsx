'use client';

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  pair: string;
  price: number;
}

export default function PriceChart({ pair, price }: Props) {
  const [data, setData] = useState<{ time: string; price: number }[]>([]);
  const [high24h, setHigh24h] = useState(price);
  const [low24h, setLow24h] = useState(price);
  const [volume24h, setVolume24h] = useState(12540000);

  useEffect(() => {
    // Initialize chart data
    const initialData = Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      price: price * (0.95 + Math.random() * 0.1),
    }));
    setData(initialData);
    setHigh24h(Math.max(...initialData.map((d) => d.price)));
    setLow24h(Math.min(...initialData.map((d) => d.price)));
  }, [price, pair]);

  useEffect(() => {
    // Simulate price updates
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [
          ...prev.slice(1),
          {
            time: new Date().getHours() + ':00',
            price: price * (0.98 + Math.random() * 0.04),
          },
        ];
        const prices = newData.map((d) => d.price);
        setHigh24h(Math.max(...prices));
        setLow24h(Math.min(...prices));
        setVolume24h((v) => v + Math.random() * 100000);
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [price]);

  const priceChange = data.length > 1 ? data[data.length - 1].price - data[0].price : 0;
  const priceChangePercent = data.length > 1 ? (priceChange / data[0].price) * 100 : 0;

  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-sm text-slate-400 uppercase tracking-wide">Price Chart</h3>
          <p className="text-3xl font-bold text-white mt-2">
            ${price.toLocaleString('en-US', { maximumFractionDigits: pair.includes('PEPE') ? 8 : 2 })}
          </p>
          <p className={`text-sm mt-1 ${priceChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}% (24h)
          </p>
        </div>
      </div>

      {/* Chart */}
      {data.length > 0 && (
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800/50 rounded p-3">
          <p className="text-xs text-slate-400 uppercase">24h High</p>
          <p className="text-lg font-bold text-white mt-1">
            ${high24h.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-slate-800/50 rounded p-3">
          <p className="text-xs text-slate-400 uppercase">24h Low</p>
          <p className="text-lg font-bold text-white mt-1">
            ${low24h.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-slate-800/50 rounded p-3">
          <p className="text-xs text-slate-400 uppercase">24h Volume</p>
          <p className="text-lg font-bold text-white mt-1">
            ${(volume24h / 1000000).toFixed(1)}M
          </p>
        </div>
      </div>
    </div>
  );
}
