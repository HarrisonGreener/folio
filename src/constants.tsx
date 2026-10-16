
import { Vault, HistoryEvent, ExternalAsset } from './types';

const generatePerformance = (base: number, days: number) => {
  return Array.from({ length: days }).map((_, i) => ({
    date: `2024-05-${String(i + 1).padStart(2, '0')}`,
    value: base * (1 + (Math.random() * 0.08 - 0.04))
  }));
};

export const INITIAL_VAULTS: Vault[] = [
  {
    id: 'v0',
    name: 'Main Account',
    type: 'Savings',
    balance: 0.00,
    available: 0.00,
    description: 'Your primary connected bank account for daily spending and income receipts.',
    isInvested: false,
    assetClass: 'Cash'
  },
  {
    id: 'v1',
    name: 'Emergency Fund',
    type: 'Savings',
    balance: 0.00,
    available: 0.00,
    description: 'Cash held in a highly liquid savings account. Instant access.',
    isInvested: false,
    assetClass: 'Cash'
  },
  {
    id: 'v2',
    name: 'Global Equity ISA',
    type: 'ISA',
    balance: 0.00,
    available: 0.00,
    description: 'Invested in low-cost global index funds. 3-5 day withdrawal.',
    isInvested: true,
    assetClass: 'Equity',
    performanceHistory: generatePerformance(100, 10),
    change24h: 1.25
  },
  {
    id: 'v4',
    name: 'Premium Bonds',
    type: 'Premium Bonds',
    balance: 0.00,
    available: 0.00,
    description: 'NS&I government-backed savings with monthly prize draws instead of interest.',
    isInvested: false,
    assetClass: 'Fixed Income'
  },
  {
    id: 'v3',
    name: 'Crypto Vault',
    type: 'Investment',
    balance: 0.00,
    available: 0.00,
    description: 'Simulated high-volatility space for digital assets.',
    isInvested: true,
    assetClass: 'Crypto',
    performanceHistory: generatePerformance(100, 10),
    change24h: -4.32
  }
];

export const MOCK_HISTORY: HistoryEvent[] = [
  {
    date: '2023-11-12',
    label: 'Withdrawal',
    description: 'Manual withdrawal of £500 from Emergency Fund.',
    impact: 'Plan completion date shifted 12 days later.'
  },
  {
    date: '2024-01-01',
    label: 'Income Change',
    description: 'Monthly income baseline increased by £200.',
    impact: 'Wealth projection for Year 5 increased by £3,400.'
  },
  {
    date: '2024-03-15',
    label: 'Allocation Paused',
    description: 'ISA transfers paused for 1 month.',
    impact: 'Compound growth potential reduced by £45.'
  }
];

const generateHistory = (baseValue: number, days: number) => {
  return Array.from({ length: days }).map((_, i) => ({
    date: `2024-05-${String(i + 1).padStart(2, '0')}`,
    value: baseValue * (1 + (Math.random() * 0.1 - 0.05))
  }));
};

export const MOCK_EXTERNAL_ASSETS: ExternalAsset[] = [
  { 
    id: 'ext1', 
    name: 'Bitcoin', 
    symbol: 'BTC',
    provider: 'Hardware Wallet', 
    type: 'Crypto', 
    value: 2450.00, 
    quantity: 0.042,
    volatility: 'high',
    change24h: 4.2,
    history: generateHistory(2450, 10)
  },
  { 
    id: 'ext2', 
    name: 'Ethereum', 
    symbol: 'ETH',
    provider: 'Browser Wallet', 
    type: 'Crypto', 
    value: 1120.00, 
    quantity: 0.45,
    volatility: 'high',
    change24h: -1.8,
    history: generateHistory(1120, 10)
  },
  { 
    id: 'ext3', 
    name: 'Solana', 
    symbol: 'SOL',
    provider: 'Mobile Wallet', 
    type: 'Crypto', 
    value: 850.00, 
    quantity: 6.2,
    volatility: 'high',
    change24h: 12.5,
    history: generateHistory(850, 10)
  },
  { 
    id: 'ext4', 
    name: 'Global Equity', 
    symbol: 'VWRL',
    provider: 'Index Fund Platform', 
    type: 'Equity', 
    value: 12500.00, 
    volatility: 'medium',
    change24h: 0.5,
    history: generateHistory(12500, 10)
  }
];

export const MOCK_ACTIVITY: any[] = [];
