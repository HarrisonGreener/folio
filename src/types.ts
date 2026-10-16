
export type EmploymentType = 'employed' | 'self-employed' | 'student' | 'other';
export type PayFrequency = 'weekly' | 'monthly' | 'irregular';
export type MoneyComfort = 'low' | 'medium' | 'high';
export type Intention = 'saving' | 'investing' | 'both';

export type VaultType = 'Savings' | 'ISA' | 'Premium Bonds' | 'Investment';

export interface Vault {
  id: string;
  name: string;
  type: VaultType;
  balance: number;
  available: number;
  description: string;
  isInvested: boolean;
  assetClass?: 'Equity' | 'Crypto' | 'Fixed Income' | 'Cash';
  performanceHistory?: { date: string; value: number }[];
  change24h?: number;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: 'housing' | 'utility' | 'subscription' | 'other';
  isFixed: boolean;
}

export interface ExternalAsset {
  id: string;
  name: string;
  symbol?: string;
  provider: string;
  type: 'Crypto' | 'Equity' | 'Manual' | 'Cash';
  value: number;
  quantity?: number;
  volatility: 'low' | 'medium' | 'high';
  change24h?: number; // percentage
  history?: { date: string; value: number }[]; // for sparklines
}

export interface HistoryEvent {
  date: string;
  label: string;
  description: string;
  impact: string;
}

export interface AllocationSettings {
  roundUpsEnabled: boolean;
  roundTo: 1 | 5;
  monthlyCap: number;
  minBalanceThreshold: number;
  incomeAllocationPercent: number;
  splits: Record<string, number>; // vaultId -> percent
}

export interface UserData {
  onboarded: boolean;
  ageConfirmed: boolean;
  employmentType: EmploymentType;
  monthlyIncome: number;
  monthlyExpenses: Expense[];
  payFrequency: PayFrequency;
  comfortLevel: MoneyComfort;
  intention: Intention;
  vaults: Vault[];
  externalAssets: ExternalAsset[];
  allocation: AllocationSettings;
  isDarkMode: boolean;
}

export interface ActivityItem {
  id: string;
  type: 'contribution' | 'allocation' | 'growth' | 'withdrawal' | 'prize';
  date: string;
  amount: number;
  title: string;
  description: string;
  vaultId?: string;
}

export type AppScreen = 
  | 'onboarding' 
  | 'consent'
  | 'home' 
  | 'vaults' 
  | 'vault-detail' 
  | 'allocate' 
  | 'growth' 
  | 'holdings' 
  | 'activity' 
  | 'withdraw' 
  | 'scope' 
  | 'monthly-summary' 
  | 'settings'
  | 'timeline' 
  | 'connections'
  | 'flow';
