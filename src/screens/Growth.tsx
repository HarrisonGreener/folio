import React, { useState } from 'react';
import { Vault } from '../types';
import { SectionHeader, Card, Button } from '../components/UI';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ChevronLeft, Info, TrendingUp, Landmark, Zap, AlertTriangle, Sparkles, Quote } from 'lucide-react';

interface Props {
  onBack: () => void;
  vault?: Vault;
}

const Growth: React.FC<Props> = ({ onBack, vault }) => {
  const [horizon, setHorizon] = useState<1 | 5 | 10>(10);
  const isCrypto = vault?.assetClass === 'Crypto';

  const getMockData = (years: number) => {
    const data = [];
    let baseline = vault?.balance || 15000;
    let strategy = vault?.balance || 15000;
    const annualContrib = 3600; // £300/mo
    
    // Growth rates
    const strategyYield = isCrypto ? 0.22 : 0.07; // 22% for crypto simulation vs 7% ISA
    const baselineYield = 0.03; // 3% annual Cash return

    for (let i = 0; i <= years; i++) {
      // Add some random volatility if it's crypto
      const volMultiplier = isCrypto ? (1 + (Math.random() * 0.4 - 0.2)) : 1;
      
      data.push({
        year: i === 0 ? 'Now' : `Yr ${i}`,
        baseline: Math.round(baseline),
        strategy: Math.round(strategy * volMultiplier),
      });
      
      baseline = (baseline + annualContrib) * (1 + baselineYield);
      strategy = (strategy + annualContrib) * (1 + strategyYield);
    }
    return data;
  };

  const chartData = getMockData(horizon);
  const chartColor = isCrypto ? '#ef4444' : '#B3593B';
  const label = isCrypto ? 'Crypto Projection' : 'ISA Projection';
  const description = isCrypto 
    ? "Visualizing aggressive compounding with high volatility. Crypto spaces prioritize maximum capture over long-term cycles." 
    : "Visualizing the potential impact of consistency vs inflation. A Stock ISA prioritises growth over the long term.";

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      <button onClick={onBack} className="mb-8 flex items-center gap-2 text-charcoal/40 dark:text-stone/40 hover:text-rust transition-colors group">
        <ChevronLeft size={20} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Back to Space</span>
      </button>

      <SectionHeader 
        title={`${horizon} Year Growth`} 
        subtitle={description} 
      />

      <div className="flex gap-2 mb-10">
        {[1, 5, 10].map(h => (
          <button
            key={h}
            onClick={() => setHorizon(h as 1|5|10)}
            className={`flex-1 p-4 rounded-[24px] border-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${
              horizon === h 
              ? 'border-rust bg-rust/10 text-rust shadow-lg shadow-rust/10' 
              : 'border-charcoal/10 dark:border-white/10 bg-white dark:bg-charcoal text-charcoal/40 dark:text-stone/40'
            }`}
          >
            {h} Year{h > 1 ? 's' : ''}
          </button>
        ))}
      </div>

      <Card className="mb-10 overflow-hidden h-[420px] flex flex-col p-10 bg-charcoal dark:bg-[#0D0D0D] border-none shadow-3xl relative rounded-[54px]">
        <div className="flex justify-between items-start mb-12 text-stone relative z-10">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-2">{label}</h3>
            <p className="text-4xl font-black tracking-tighter text-white">£{chartData[chartData.length-1].strategy.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-2">Cash Baseline</h3>
            <p className="text-4xl font-black tracking-tighter text-white/20">£{chartData[chartData.length-1].baseline.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="flex-1 -mx-10 -mb-4 relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorStrategy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.6}/>
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#666" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#666" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F1F1F', 
                  border: 'none', 
                  borderRadius: '24px', 
                  color: '#FBFBFA',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                }}
                itemStyle={{ color: chartColor }}
              />
              <Area 
                type="monotone" 
                dataKey="strategy" 
                stroke={chartColor} 
                strokeWidth={5}
                fillOpacity={1} 
                fill="url(#colorStrategy)" 
                isAnimationActive={true}
              />
              <Area 
                type="monotone" 
                dataKey="baseline" 
                stroke="#444" 
                strokeWidth={2}
                strokeDasharray="10 10"
                fillOpacity={1} 
                fill="url(#colorBaseline)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="space-y-6">
        {isCrypto ? (
          <>
            <Card className="p-10 flex items-start gap-8 border-none bg-red-500/5 rounded-[44px] shadow-xl">
              <Zap className="text-red-500 shrink-0 mt-1" size={32} />
              <div>
                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-charcoal dark:text-stone mb-3">Aggressive Alpha</h4>
                <p className="text-xs text-charcoal/70 dark:text-stone/40 leading-relaxed font-bold opacity-80 antialiased">
                  Crypto spaces leverage market cycles (like Bitcoin Halving) to target outlier returns. Volatility is the price of this entry point.
                </p>
              </div>
            </Card>
            
            <Card className="p-10 flex items-start gap-8 border-none bg-charcoal/5 dark:bg-charcoal-card rounded-[44px] shadow-xl">
              <AlertTriangle size={32} className="text-rust shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-charcoal dark:text-stone mb-3">Risk Calibration</h4>
                <p className="text-xs text-charcoal/60 dark:text-stone/40 leading-relaxed font-bold opacity-80 antialiased">
                  Projections assume an average 22% CAGR based on high-volatility simulations. Actual market drawdowns can exceed 80%. Only allocate surplus capital.
                </p>
              </div>
            </Card>
          </>
        ) : (
          <>
            <Card className="p-10 flex items-start gap-8 border-none bg-rust/5 rounded-[44px] shadow-xl">
              <TrendingUp className="text-rust shrink-0 mt-1" size={32} />
              <div>
                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-charcoal dark:text-stone mb-3">The ISA Advantage</h4>
                <p className="text-xs text-charcoal/70 dark:text-stone/40 leading-relaxed font-bold opacity-80 antialiased">
                  Over 10 years, historical market yields often outperform cash rates. Tax-free compounding within the ISA wrapper significantly impacts the final outcome.
                </p>
              </div>
            </Card>
            
            <Card className="p-10 flex items-start gap-8 border-none bg-charcoal/5 dark:bg-charcoal-card rounded-[44px] shadow-xl">
              <Info size={32} className="text-rust shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-charcoal dark:text-stone mb-3">Market Assumptions</h4>
                <p className="text-xs text-charcoal/60 dark:text-stone/40 leading-relaxed font-bold opacity-80 antialiased">
                  Projection assumes £300/mo contribution and a 7% average equity return. Your capital is at risk and returns are not guaranteed.
                </p>
              </div>
            </Card>
          </>
        )}
      </div>

      <div className="mt-16 p-16 bg-white/5 dark:bg-[#151515] rounded-[54px] border border-white/5 flex flex-col items-center text-center">
         <Quote className="text-rust/20 mb-8" size={48} />
         <p className="text-2xl text-charcoal/50 dark:text-stone/30 italic font-black leading-tight max-w-[320px] mx-auto antialiased tracking-tight">
           "The individual investor should act consistently as an investor and not as a speculator."
         </p>
         <p className="text-[10px] font-black text-rust uppercase tracking-[0.4em] mt-8">
           — Benjamin Graham
         </p>
      </div>
    </div>
  );
};

export default Growth;