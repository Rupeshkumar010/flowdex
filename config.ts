import { createPublicClient, http } from 'viem';
import { Chain } from 'viem';

// Arc Testnet Configuration
export const arcTestnet: Chain = {
  id: 912,
  name: 'Arc Testnet',
  network: 'arc-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.arc.io'],
    },
    public: {
      http: ['https://testnet-rpc.arc.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'ArcScan',
      url: 'https://testnet.arcscan.app',
    },
  },
};

// Trading Pairs Configuration
export const TRADING_PAIRS = [
  { symbol: 'BTC/USDC', base: 'BTC', quote: 'USDC', decimals: 8 },
  { symbol: 'ETH/USDC', base: 'ETH', quote: 'USDC', decimals: 18 },
  { symbol: 'SOL/USDC', base: 'SOL', quote: 'USDC', decimals: 9 },
  { symbol: 'XRP/USDC', base: 'XRP', quote: 'USDC', decimals: 6 },
  { symbol: 'PEPE/USDC', base: 'PEPE', quote: 'USDC', decimals: 18 },
];

// Mock Token Addresses on Arc Testnet
export const TOKEN_ADDRESSES = {
  USDC: '0x1234567890abcdef1234567890abcdef12345678',
  BTC: '0xabcdef1234567890abcdef1234567890abcdef12',
  ETH: '0x0000000000000000000000000000000000000000', // Native
  SOL: '0xsoladdrhere123456789012345678901234567890',
  XRP: '0xrppaddrhere123456789012345678901234567890',
  PEPE: '0xpepeaddhere123456789012345678901234567890',
};

// Mock Price Feeds (Real prices would come from oracle)
export const MOCK_PRICES = {
  BTC: 42500,
  ETH: 2250,
  SOL: 98,
  XRP: 2.45,
  PEPE: 0.0000085,
};

// Public RPC Client for Arc Testnet
export const publicClient = createPublicClient({
  chain: arcTestnet,
  transport: http('https://testnet-rpc.arc.io'),
});

// Leverage Options
export const LEVERAGE_OPTIONS = [1, 2, 3, 5, 10, 15, 20];

// Min/Max Order Values
export const ORDER_LIMITS = {
  minUSDC: 10,
  maxUSDC: 100000,
};
