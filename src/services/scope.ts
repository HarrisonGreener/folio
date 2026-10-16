import { ExternalAsset } from '../types';
import { generateNarrative, isLocalAISupported, MODEL_LABEL } from './localModel';

export interface ScopeInput {
  itemName: string;
  price: number;
  timeframe?: string;
  currentIncome: number;
  currentSavings: number;
  externalPortfolio?: ExternalAsset[];
}

export interface ScopeScenario {
  title: string;
  recommendedVaultType: 'Savings' | 'ISA' | 'Investment' | 'Premium Bonds';
  monthlyAmount: string;
  date: string;
  tradeOff: string;
  assumptions: string;
  investmentHighlight?: string;
}

export interface ScopeResult {
  estimate: string;
  scenarios: ScopeScenario[];
  safetyNote: string;
  engine: 'ai' | 'calculated';
  engineLabel: string;
}

/** Parse "5 years", "18 months", "2y", "6m", "by 2030". Defaults to 3 years. */
export const parseHorizonMonths = (raw?: string): number => {
  if (!raw) return 36;
  const t = raw.toLowerCase().trim();
  const year = t.match(/(20\d{2})/);
  if (year) {
    const now = new Date();
    const months = (Number(year[1]) - now.getFullYear()) * 12 + (11 - now.getMonth());
    return Math.max(1, months);
  }
  const n = parseFloat(t);
  if (!isFinite(n) || n <= 0) return 36;
  if (/mo|month|\bm\b|\dm$/.test(t)) return Math.max(1, Math.round(n));
  if (/week|wk/.test(t)) return Math.max(1, Math.round(n / 4.33));
  return Math.max(1, Math.round(n * 12)); // years by default
};

const gbp = (n: number) => `£${Math.ceil(n).toLocaleString('en-GB')}`;

/** Monthly contribution to reach `target` in `n` months at annual rate `r`. */
const monthlyFor = (target: number, n: number, r: number) => {
  const i = r / 12;
  if (i === 0) return target / n;
  return (target * i) / (Math.pow(1 + i, n) - 1);
};

interface Path {
  title: string;
  vault: ScopeScenario['recommendedVaultType'];
  rate: number;
  rateLabel: string;
}

const pathsFor = (months: number): Path[] => {
  const long = months > 36;
  return [
    { title: 'Stability-focused', vault: 'Savings', rate: 0.035, rateLabel: '3.5% AER easy-access cash' },
    {
      title: 'Balanced',
      vault: long ? 'ISA' : 'Premium Bonds',
      rate: long ? 0.05 : 0.04,
      rateLabel: long ? '5% blended (60% global equity, 40% cash) in an ISA' : '4% average prize fund rate',
    },
    {
      title: 'Growth-oriented',
      vault: long ? 'ISA' : 'Investment',
      rate: long ? 0.07 : 0.05,
      rateLabel: long ? '7% long-run global equity average in a Stocks & Shares ISA' : '5% assumed; short horizons limit equity upside',
    },
  ];
};

/** Exact figures for every path. Used by both engines so the numbers never drift. */
export const computeScenarios = (input: ScopeInput) => {
  const months = parseHorizonMonths(input.timeframe);
  const due = new Date();
  due.setMonth(due.getMonth() + months);
  const date = due.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
  const crypto = (input.externalPortfolio ?? []).filter(a => a.type === 'Crypto').reduce((a, b) => a + b.value, 0);
  const equity = (input.externalPortfolio ?? []).filter(a => a.type === 'Equity').reduce((a, b) => a + b.value, 0);

  const rows = pathsFor(months).map(p => {
    const monthly = monthlyFor(input.price, months, p.rate);
    const paidIn = monthly * months;
    return { ...p, monthly, paidIn, growth: Math.max(0, input.price - paidIn), date };
  });

  return { months, date, crypto, equity, rows };
};

const templateText = (input: ScopeInput, c: ReturnType<typeof computeScenarios>): Omit<ScopeResult, 'engine' | 'engineLabel'> => {
  const share = (c.rows[0].monthly / Math.max(1, input.currentIncome)) * 100;
  const feasible = share < 15 ? 'comfortably within reach' : share < 35 ? 'achievable with discipline' : 'a stretch on your current income';
  const years = c.months >= 12 ? `${(c.months / 12).toFixed(c.months % 12 ? 1 : 0)} years` : `${c.months} months`;
  const exposure = c.crypto > 0
    ? `You already hold £${c.crypto.toLocaleString('en-GB')} in high-volatility assets, so the steadier paths avoid stacking more risk on top.`
    : c.equity > 0
      ? `Your existing £${c.equity.toLocaleString('en-GB')} in equities already gives you market exposure.`
      : 'You have no external holdings yet, so any path here sets your first risk position.';

  return {
    estimate: `${input.itemName} at ${gbp(input.price)} over ${years} looks ${feasible}, needing roughly ${share.toFixed(0)}% of monthly income on the cautious path. ${exposure}`,
    scenarios: c.rows.map((r, i) => ({
      title: r.title,
      recommendedVaultType: r.vault,
      monthlyAmount: gbp(r.monthly),
      date: r.date,
      tradeOff: [
        'Instant access and no capital risk, but you contribute the most each month.',
        'Lower monthly cost than cash alone, with modest ups and downs along the way.',
        c.months > 36
          ? 'Lowest monthly cost, but values will swing and a fall near the end could delay the goal.'
          : 'A short timeline leaves little room to recover from a market dip.',
      ][i],
      assumptions: `${r.rateLabel}. You pay in ${gbp(r.paidIn)}; growth covers ${gbp(r.growth)}.`,
      investmentHighlight: i === 2 && c.months > 36 ? 'Time in the market does the heavy lifting.' : undefined,
    })),
    safetyNote: 'Illustrative only, not financial advice. Investments can fall as well as rise and you may get back less than you put in. Rates are assumptions, not quotes.',
  };
};

export type ScopeProgress = (stage: 'loading' | 'thinking', progress: number, text: string) => void;

export const getScopeScenarios = async (
  input: ScopeInput,
  opts: { useAI: boolean; onProgress?: ScopeProgress } = { useAI: true },
): Promise<ScopeResult> => {
  const computed = computeScenarios(input);
  const base = templateText(input, computed);

  if (!opts.useAI || !isLocalAISupported()) {
    return { ...base, engine: 'calculated', engineLabel: 'Calculated on device' };
  }

  try {
    const prose = await generateNarrative(input, computed, opts.onProgress);
    if (!prose) throw new Error('empty');
    return {
      estimate: prose.estimate || base.estimate,
      scenarios: base.scenarios.map((s, i) => ({
        ...s,
        tradeOff: prose.tradeOffs?.[i] || s.tradeOff,
        investmentHighlight: i === 2 ? (prose.growthHighlight || s.investmentHighlight) : s.investmentHighlight,
      })),
      safetyNote: base.safetyNote,
      engine: 'ai',
      engineLabel: MODEL_LABEL,
    };
  } catch (err) {
    console.warn('Local model unavailable, using calculated scenarios', err);
    return { ...base, engine: 'calculated', engineLabel: 'Calculated on device' };
  }
};
