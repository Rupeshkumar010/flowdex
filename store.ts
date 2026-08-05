import { create } from 'zustand';
import { MOCK_PRICES } from './flowdex-config';

export interface Order {
  id: string;
  pair: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  leverage: number;
  status: 'open' | 'pending' | 'filled' | 'cancelled';
  timestamp: number;
  txHash?: string;
}

export interface Position {
  id: string;
  pair: string;
  type: 'long' | 'short';
  amount: number;
  entryPrice: number;
  currentPrice: number;
  leverage: number;
  pnl: number;
  pnlPercent: number;
}

export interface Portfolio {
  usdcBalance: number;
  totalDeposit: number;
  totalLpTokens: number;
  poolShare: number;
  pendingPnL: number;
  adjustedLiquidity: number;
}

interface TradingStore {
  // Orders
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'timestamp'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status'], txHash?: string) => void;
  cancelOrder: (orderId: string) => void;
  
  // Positions
  positions: Position[];
  addPosition: (position: Omit<Position, 'id'>) => void;
  closePosition: (positionId: string) => void;
  updatePositionPnL: (positionId: string, currentPrice: number) => void;
  
  // Portfolio
  portfolio: Portfolio;
  updatePortfolio: (update: Partial<Portfolio>) => void;
  
  // Prices
  prices: Record<string, number>;
  updatePrices: (prices: Record<string, number>) => void;
  
  // UI State
  selectedPair: string;
  setSelectedPair: (pair: string) => void;
}

export const useTradingStore = create<TradingStore>((set) => ({
  orders: [],
  addOrder: (order) =>
    set((state) => ({
      orders: [
        ...state.orders,
        {
          ...order,
          id: `order_${Date.now()}_${Math.random()}`,
          timestamp: Date.now(),
        },
      ],
    })),
  updateOrderStatus: (orderId, status, txHash) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, status, txHash } : o
      ),
    })),
  cancelOrder: (orderId) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, status: 'cancelled' } : o
      ),
    })),

  positions: [],
  addPosition: (position) =>
    set((state) => ({
      positions: [
        ...state.positions,
        {
          ...position,
          id: `pos_${Date.now()}_${Math.random()}`,
        },
      ],
    })),
  closePosition: (positionId) =>
    set((state) => ({
      positions: state.positions.filter((p) => p.id !== positionId),
    })),
  updatePositionPnL: (positionId, currentPrice) =>
    set((state) => ({
      positions: state.positions.map((p) =>
        p.id === positionId
          ? {
              ...p,
              currentPrice,
              pnl:
                p.type === 'long'
                  ? p.amount * (currentPrice - p.entryPrice)
                  : p.amount * (p.entryPrice - currentPrice),
              pnlPercent:
                ((currentPrice - p.entryPrice) / p.entryPrice) *
                100 *
                (p.type === 'short' ? -1 : 1),
            }
          : p
      ),
    })),

  portfolio: {
    usdcBalance: 10000,
    totalDeposit: 10000,
    totalLpTokens: 0,
    poolShare: 0,
    pendingPnL: 0,
    adjustedLiquidity: 10000,
  },
  updatePortfolio: (update) =>
    set((state) => ({
      portfolio: { ...state.portfolio, ...update },
    })),

  prices: MOCK_PRICES,
  updatePrices: (prices) =>
    set({
      prices: { ...MOCK_PRICES, ...prices },
    }),

  selectedPair: 'BTC/USDC',
  setSelectedPair: (pair) =>
    set({
      selectedPair: pair,
    }),
}));
