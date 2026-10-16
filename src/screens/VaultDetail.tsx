
import React, { useState, useMemo } from 'react';
import { Vault, AppScreen, UserData } from '../types';
import { Card, Button, Badge, Label, Input } from '../components/UI';
import { coinLogo } from '../components/CoinMark';
import { 
  ChevronLeft, ArrowUpRight, ArrowDownLeft, Activity, 
  X, Pencil, Calculator, Plus, Check, Landmark, TrendingUp, ShieldCheck, HelpCircle, Info
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface Props {
  vault: Vault;
  userData: UserData;
  onBack: () => void;
  setScreen: (s: AppScreen) => void;
}

const CryptoLogos = {
  BTC: coinLogo('BTC'),
  ETH: coinLogo('ETH'),
  SOL: coinLogo('SOL'),
};

const COIN_DATABASE = [
  { id: 'BTC', name: 'Bitcoin', logo: CryptoLogos.BTC, defaultWeight: 0.60, projectedYield: 0.25 },
  { id: 'ETH', name: 'Ethereum', logo: CryptoLogos.ETH, defaultWeight: 0.25, projectedYield: 0.22 },
  { id: 'SOL', name: 'Solana', logo: CryptoLogos.SOL, defaultWeight: 0.15, projectedYield: 0.45 }
];

const PerformanceSparkline: React.FC<{ data: any[], color: string }> = ({ data, color }) => (
  <div className="h-44 w-full absolute bottom-0 left-0 overflow-hidden pointer-events-none opacity-40">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.6}/>
            <stop offset="100%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          strokeWidth={4} 
          fill="url(#chartGradient)" 
          isAnimationActive={true}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const VaultDetail: React.FC<Props> = ({ vault, userData, onBack, setScreen }) => {
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [isAddingCoin, setIsAddingCoin] = useState(false);
  const [helpContent, setHelpContent] = useState<{ title: string; text: string } | null>(null);
  const [newBalance, setNewBalance] = useState(vault.balance.toString());
  
  const isCrypto = vault.assetClass === 'Crypto';
  const isEquity = vault.assetClass === 'Equity';
  const isPremiumBonds = vault.type === 'Premium Bonds';
  
  // Conditionally enable the growth engine only for appropriate vault types
  const hasGrowthEngine = vault.type === 'ISA' || vault.type === 'Investment';

  const handleAdjustBalance = () => {
    setIsAdjusting(false);
    alert(`System Message: Manual balance override successful.`);
  };

  const chartColor = isCrypto ? '#ef4444' : isEquity ? '#22c55e' : '#B3593B';
  const subLabel = isCrypto ? 'CRYPTO GROWTH SPACE' : isEquity ? 'GLOBAL MARKET EXPOSURE' : isPremiumBonds ? 'GOVERNMENT-BACKED PRIZE FUND' : 'LIQUID CASH RESERVE';
  const badgeVariant = isEquity ? 'default' : 'rust';

  const mockPerformance = [
    { value: 100 }, { value: 102 }, { value: 98 }, { value: 99 }, { value: 101 }, { value: 98 }, { value: 100 }
  ];

  const totalVaultBalance = parseFloat(newBalance) || vault.balance;

  const filteredAssets = useMemo(() => {
    return userData.externalAssets.filter(asset => {
      if (isCrypto) return asset.type === 'Crypto';
      if (isEquity) return asset.type === 'Equity';
      return false;
    });
  }, [userData.externalAssets, isCrypto, isEquity]);

  const displayHoldings = useMemo(() => {
    return filteredAssets.map(asset => {
      const dbInfo = COIN_DATABASE.find(c => c.id === asset.symbol);
      const weight = totalVaultBalance > 0 ? (asset.value / totalVaultBalance) * 100 : 0;
      return {
        ...asset,
        weight: Math.round(weight),
        projectedYield: dbInfo?.projectedYield || 0.05,
        logo: dbInfo?.logo || (() => <div className="w-6 h-6 bg-white/10 rounded-full" />)
      };
    });
  }, [filteredAssets, totalVaultBalance]);

  const showHelp = (title: string, text: string) => {
    setHelpContent({ title, text });
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 pb-32">
      <button onClick={onBack} className="mb-8 flex items-center gap-2 text-charcoal/40 dark:text-stone/40 hover:text-rust transition-colors group">
        <ChevronLeft size={20} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Vaults</span>
      </button>

      <div className="mb-10">
        <h1 className="text-4xl font-black text-charcoal dark:text-stone tracking-tighter mb-2">{vault.name}</h1>
        <div className="flex items-center gap-3">
          <Badge variant={badgeVariant} className="px-4 py-1 rounded-[12px] font-black">{vault.type.toUpperCase()}</Badge>
          <span className="text-[9px] font-black uppercase text-charcoal/30 dark:text-stone/30 tracking-[0.2em] self-center">{subLabel}</span>
          {isPremiumBonds && (
            <button onClick={() => showHelp("Premium Bonds Guide", "Premium Bonds are savings accounts where you can put in money (minimum £25) and all the interest is paid into a monthly prize draw. You could win tax-free prizes from £25 up to £1 million. Every £1 you save is a 'bond' and has an equal chance of winning. Backed by HM Treasury, so your capital is 100% secure.")}>
              <HelpCircle size={14} className="text-rust" />
            </button>
          )}
        </div>
      </div>

      <Card className="mb-10 p-0 border-none bg-charcoal dark:bg-[#0D0D0D] overflow-hidden shadow-2xl relative rounded-[54px] min-h-[520px]">
        <div className="p-12 z-20 relative">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase text-stone/30 tracking-[0.3em]">TOTAL VALUE IN £</span>
              <button onClick={() => showHelp("Total Value", "This is the combined market value of all assets allocated to this space, synced from your linked accounts or manual inputs.")} className="text-stone/20 hover:text-stone transition-colors">
                <HelpCircle size={14} />
              </button>
            </div>
            <button 
              onClick={() => setIsAdjusting(true)}
              className="w-11 h-11 bg-white/5 rounded-full flex items-center justify-center text-white/20 hover:text-white transition-colors border border-white/5 active:scale-90"
            >
              <Pencil size={20} />
            </button>
          </div>
          
          <div className="flex items-center gap-4 mb-14">
            <p className="text-8xl font-black text-white tracking-tighter leading-none">£{totalVaultBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            {!isPremiumBonds && (
              <div className="relative group">
                <div className={`bg-${isCrypto ? '[#B3593B]' : isEquity ? 'green-500' : '[#B3593B]'}/20 text-${isCrypto ? '[#B3593B]' : isEquity ? 'green-500' : '[#B3593B]'} text-[11px] font-black px-4 py-1.5 rounded-full flex items-center gap-1.5 border border-white/5 cursor-pointer`}
                     onClick={() => showHelp("Performance", "The 24-hour percentage change based on real-time market data.")}>
                  {isCrypto ? '↓ 4.32%' : '↑ 1.25%'}
                  <HelpCircle size={10} className="opacity-50" />
                </div>
              </div>
            )}
            {isPremiumBonds && (
              <Badge variant="default" className="!bg-charcoal/30 border border-white/5 text-stone/40">Prize Fund Active</Badge>
            )}
          </div>

          <div className="space-y-4 relative z-30 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase text-stone/30 tracking-[0.2em]">Asset Mix & Projections</span>
              <button onClick={() => showHelp("Projections", "We estimate 1-year value using current market yields and historical volatility. For Premium Bonds, this reflects the average prize fund rate.")}>
                <HelpCircle size={12} className="text-stone/20" />
              </button>
            </div>
            
            {displayHoldings.map((asset) => (
              <div key={asset.id} className="w-[280px] bg-[#1A1A1A]/90 backdrop-blur-2xl border border-white/5 rounded-[28px] p-6 flex items-center gap-5 hover:border-white/10 transition-colors group shadow-lg">
                <div className="w-10 h-10 flex items-center justify-center shrink-0">
                  <asset.logo />
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-[14px] font-black text-white uppercase tracking-widest leading-none">
                      {asset.weight}% • £{asset.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <span className="text-[9px] font-black text-green-500 uppercase tracking-widest opacity-80">
                    Est. 1Y: £{(asset.value * (1 + asset.projectedYield)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            ))}
            
            {isPremiumBonds && (
              <div className="w-[280px] bg-white/5 border border-white/10 rounded-[28px] p-6 flex items-center gap-5">
                 <div className="w-10 h-10 bg-rust/20 rounded-xl flex items-center justify-center text-rust">
                    <ShieldCheck size={24} />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[14px] font-black text-white uppercase tracking-widest leading-none">100% Cash Buffer</span>
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-1">Monthly Draw Odds: 1 in 21,000</span>
                 </div>
              </div>
            )}
            
            {isCrypto && (
              <button 
                onClick={() => setIsAddingCoin(true)}
                className="w-[280px] bg-white/5 border border-white/10 border-dashed rounded-[28px] p-6 flex items-center justify-center gap-4 hover:bg-white/10 transition-all text-white/40 hover:text-white active:scale-95 group"
              >
                <div className="w-8 h-8 rounded-full border border-dashed border-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform">
                  <Plus size={18} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Add Asset</span>
              </button>
            )}
          </div>
        </div>
        
        <PerformanceSparkline 
          data={mockPerformance} 
          color={chartColor} 
        />
      </Card>

      <div className="grid grid-cols-2 gap-6 mb-12">
        <Button variant="secondary" className="h-22 !rounded-[40px] !bg-[#151515] !border-white/[0.04] text-white flex flex-col items-center justify-center gap-2 group shadow-xl" onClick={() => setScreen('allocate')}>
          <ArrowDownLeft size={24} strokeWidth={3} className="text-rust group-hover:scale-110 transition-transform" /> 
          <span className="text-[10px] font-black text-white/40 tracking-[0.25em] uppercase">ADD FUNDS</span>
        </Button>
        <Button 
          variant="secondary" 
          onClick={() => setScreen('withdraw')}
          className="h-22 !rounded-[40px] !bg-[#151515] !border-white/[0.04] text-white flex flex-col items-center justify-center gap-2 group shadow-xl"
        >
          <ArrowUpRight size={24} strokeWidth={3} className="text-rust group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black text-white/40 tracking-[0.25em] uppercase">WITHDRAW</span>
        </Button>
      </div>

      <div className="space-y-4">
        <Card className="flex items-center justify-between p-10 cursor-pointer bg-[#121212] border-white/[0.03] rounded-[48px] hover:bg-white/[0.02] transition-colors relative overflow-hidden group shadow-2xl">
          <div className="flex items-center gap-8 relative z-10">
            <div className="w-16 h-16 bg-white/[0.03] rounded-[24px] flex items-center justify-center text-white/20 border border-white/5 shadow-inner">
              <Activity size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-lg font-black text-white uppercase tracking-widest">Transaction Audit</p>
                <HelpCircle size={14} className="text-white/20" onClick={(e) => { e.stopPropagation(); showHelp("Audit", "A transparent log of every internal movement. Folio tracks money flows between spaces without making actual bank transfers, allowing for instant orchestration.") }} />
              </div>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em]">Internal movements & flows</p>
            </div>
          </div>
        </Card>

        {hasGrowthEngine && (
          <Card onClick={() => setScreen('growth')} className="flex items-center justify-between p-10 cursor-pointer bg-[#121212] border-white/[0.03] rounded-[48px] hover:bg-white/[0.02] transition-colors relative overflow-hidden group shadow-2xl">
            <div className="flex items-center gap-8 relative z-10">
              <div className={`w-16 h-16 ${isEquity ? 'bg-green-500/10 border-green-500/10' : 'bg-rust/10 border-rust/10'} border rounded-[24px] flex items-center justify-center ${isEquity ? 'text-green-500/50' : 'text-rust/50'} shadow-lg`}>
                <Calculator size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-lg font-black text-white uppercase tracking-widest">Growth Engine</p>
                  <HelpCircle size={14} className="text-white/20" onClick={(e) => { e.stopPropagation(); showHelp("Growth Engine", "Our simulation engine that uses historical data and current yields to project your portfolio's future value. It helps you see the impact of time and compounding.") }} />
                </div>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em]">Intent clarity & projections</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {helpContent && (
        <div className="fixed inset-0 z-[300] bg-charcoal/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-300">
          <Card className="w-full max-w-sm p-12 relative bg-[#1A1A1A] rounded-[54px] border-white/[0.05] shadow-3xl">
            <button onClick={() => setHelpContent(null)} className="absolute top-12 right-12 text-white/20 hover:text-white transition-colors">
              <X size={32} />
            </button>
            <div className="w-16 h-16 bg-rust/10 rounded-[24px] flex items-center justify-center text-rust mb-8">
              <Info size={32} />
            </div>
            <h3 className="text-3xl font-black text-white tracking-tighter mb-4 uppercase leading-none">{helpContent.title}</h3>
            <p className="text-white/40 font-medium text-lg leading-relaxed antialiased mt-6">{helpContent.text}</p>
            <Button fullWidth onClick={() => setHelpContent(null)} className="mt-12 h-18 rounded-[32px] text-base">Got it</Button>
          </Card>
        </div>
      )}

      {isAddingCoin && (
        <div className="fixed inset-0 z-[200] bg-charcoal/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-300">
          <Card className="w-full max-w-sm p-12 relative bg-[#1A1A1A] rounded-[54px] border-white/[0.05] shadow-3xl">
            <button onClick={() => setIsAddingCoin(false)} className="absolute top-12 right-12 text-white/20 hover:text-white transition-colors">
              <X size={32} />
            </button>
            <h3 className="text-3xl font-black text-white tracking-tighter mb-4">Add Asset</h3>
            <p className="text-white/40 mb-10 font-medium text-sm leading-relaxed">Select coins to include in this allocation strategy. Portfolio weights will auto-rebalance.</p>
            
            <div className="space-y-4 mb-10">
              {COIN_DATABASE.map(coin => {
                const isSelected = displayHoldings.some(h => h.symbol === coin.id);
                return (
                  <button 
                    key={coin.id}
                    className={`w-full flex items-center justify-between p-7 rounded-[32px] border transition-all duration-300 ${isSelected ? 'bg-rust/10 border-rust/40 text-white shadow-lg' : 'bg-white/5 border-white/5 text-white/30 hover:border-white/10'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 flex items-center justify-center"><coin.logo /></div>
                      <span className="font-black uppercase tracking-[0.2em] text-sm">{coin.name}</span>
                    </div>
                    {isSelected && <Check size={20} className="text-rust" strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
            <Button fullWidth onClick={() => setIsAddingCoin(false)} className="h-20 rounded-[32px] text-base">Save Asset Mix</Button>
          </Card>
        </div>
      )}

      {isAdjusting && (
        <div className="fixed inset-0 z-[200] bg-charcoal/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-300">
           <Card className="w-full max-w-sm p-12 relative bg-[#1A1A1A] rounded-[54px] border-white/[0.05] shadow-3xl">
              <button onClick={() => setIsAdjusting(false)} className="absolute top-12 right-12 text-white/20 hover:text-white transition-colors">
                 <X size={32} />
              </button>
              <h3 className="text-3xl font-black text-white tracking-tighter mb-4 uppercase">Manual Sync</h3>
              <p className="text-white/40 mb-12 font-medium">Update the current space value manually for simulation purposes.</p>
              <div className="space-y-10">
                 <div className="relative">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-rust text-5xl font-black">£</span>
                    <Input 
                      type="number" 
                      autoFocus
                      className="h-24 text-6xl font-black !bg-transparent !border-none text-white pl-12" 
                      value={newBalance} 
                      onChange={e => setNewBalance(e.target.value)}
                    />
                 </div>
                 <Button fullWidth onClick={handleAdjustBalance} className="h-20 rounded-[32px] text-base">Confirm Sync</Button>
              </div>
           </Card>
        </div>
      )}
    </div>
  );
};

export default VaultDetail;
