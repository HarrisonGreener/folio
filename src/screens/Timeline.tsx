import React, { useState, useMemo } from 'react';
import { UserData } from '../types';
import { SectionHeader, Card, Button } from '../components/UI';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, Sparkles, Wallet, HelpCircle, X, Info, Zap, MousePointer2, Quote } from 'lucide-react';

interface Props {
  userData: UserData;
  onBack: () => void;
}

const Timeline: React.FC<Props> = ({ userData, onBack }) => {
  const [horizon, setHorizon] = useState<number>(12); // months
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [helpContent, setHelpContent] = useState<{ title: string; text: string } | null>(null);

  const horizons = [
    { label: '6M', value: 6 },
    { label: '1Y', value: 12 },
    { label: '5Y', value: 60 },
    { label: '10Y', value: 120 },
  ];

  // Logic: Calculate distinct paths for Salary vs Assets
  const trajectoryData = useMemo(() => {
    const data = [];
    const monthlyIncome = userData.monthlyIncome;
    const monthlyContribution = monthlyIncome * (userData.allocation.incomeAllocationPercent / 100);
    const initialWealth = userData.vaults.reduce((acc, v) => acc + v.balance, 0);
    
    // Growth rates (annual)
    const rates = {
      ISA: 0.07,
      Crypto: 0.18,
      Bonds: 0.04,
      Savings: 0.03,
      Salary: 0.0, 
    };

    for (let i = 0; i <= horizon; i++) {
      let salarySum = (monthlyIncome * i);
      let isaSum = 0;
      let cryptoSum = 0;
      let otherSum = 0;

      userData.vaults.forEach(v => {
        const split = userData.allocation.splits[v.id] || 0;
        const alloc = (monthlyContribution * (split / 100));
        const rate = v.type === 'ISA' ? rates.ISA : v.assetClass === 'Crypto' ? rates.Crypto : rates.Savings;
        const monthlyRate = rate / 12;
        
        // Compound: FV = P(1+r)^n + PMT[((1+r)^n - 1)/r]
        const futureVal = v.balance * Math.pow(1 + monthlyRate, i) + 
                         (alloc > 0 ? alloc * (Math.pow(1 + monthlyRate, i) - 1) / monthlyRate : 0);

        if (v.type === 'ISA') isaSum += futureVal;
        else if (v.assetClass === 'Crypto') cryptoSum += futureVal;
        else otherSum += futureVal;
      });

      data.push({
        name: i === 0 ? 'Now' : `Month ${i}`,
        index: i,
        salary: Math.round(salarySum),
        isa: Math.round(isaSum),
        crypto: Math.round(cryptoSum),
        other: Math.round(otherSum),
        total: Math.round(isaSum + cryptoSum + otherSum + (monthlyIncome - monthlyContribution) * i + initialWealth)
      });
    }
    return data;
  }, [userData, horizon]);

  const showHelp = (title: string, text: string) => setHelpContent({ title, text });

  const finalPoint = trajectoryData[trajectoryData.length - 1];
  const activePoint = activeIndex !== null ? trajectoryData[activeIndex] : finalPoint;

  const handleMouseMove = (state: any) => {
    if (state && state.activeTooltipIndex !== undefined) {
      setActiveIndex(state.activeTooltipIndex);
    }
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 pb-40">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 pr-4">
          <SectionHeader 
            title="Total Trajectory" 
            subtitle="Visualizing the layers of your wealth from base wages to investment yields." 
          />
        </div>
        <button 
          onClick={() => showHelp("Trajectory Masterclass", "This chart layers your financial components. The dashed white line is your salary accumulation, the dotted lines are your growth assets (ISA/Crypto), and the solid green line is your total consolidated wealth. Drag or tap any point to see exact figures for that date.")}
          className="mt-2 w-14 h-14 bg-charcoal/5 dark:bg-charcoal-card border border-charcoal/10 dark:border-white/10 rounded-[20px] flex items-center justify-center text-rust hover:text-rust-hover transition-all shadow-sm active:scale-95 group"
        >
          <HelpCircle size={26} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      {/* Horizon Switcher */}
      <div className="flex bg-charcoal/5 dark:bg-white/5 p-2 rounded-[32px] mb-10 border border-charcoal/5 dark:border-white/5 shadow-inner">
        {horizons.map((h) => (
          <button
            key={h.value}
            onClick={() => { setHorizon(h.value); setActiveIndex(null); }}
            className={`flex-1 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300 ${
              horizon === h.value 
              ? 'bg-rust text-white shadow-xl shadow-rust/30' 
              : 'text-charcoal/40 dark:text-stone/40 hover:text-rust'
            }`}
          >
            {h.label}
          </button>
        ))}
      </div>

      {/* Master Weaver Chart */}
      <Card className="mb-12 p-0 bg-charcoal dark:bg-[#080808] border-none min-h-[580px] overflow-hidden shadow-3xl relative rounded-[54px] group/chart">
        <div className="p-12 z-20 relative">
          <div className="flex justify-between items-start mb-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">
                  {activeIndex !== null ? `PROJECTED AT ${activePoint.name}` : 'TOTAL PROJECTED POSITION'}
                </span>
              </div>
              <p data-fit className="text-7xl font-black tracking-compressed text-white leading-none">
                £{activePoint.total.toLocaleString()}
              </p>
              
              {activeIndex !== null && (
                <div className="flex items-center gap-2 mt-4 text-green-500 animate-in fade-in slide-in-from-left-2">
                  <TrendingUp size={16} strokeWidth={3} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    +£{(activePoint.total - trajectoryData[0].total).toLocaleString()} GROWTH
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-6 mt-12 bg-black/40 p-4 rounded-3xl border border-white/5 inline-flex">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
              <span className={`text-[9px] font-black uppercase tracking-widest ${activeIndex !== null ? 'text-white' : 'text-white/40'}`}>
                £{activePoint.salary.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rust shadow-[0_0_8px_rgba(179,89,59,0.4)]" />
              <span className={`text-[9px] font-black uppercase tracking-widest ${activeIndex !== null ? 'text-rust' : 'text-rust/40'}`}>
                £{activePoint.isa.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
              <span className={`text-[9px] font-black uppercase tracking-widest ${activeIndex !== null ? 'text-yellow-500' : 'text-yellow-500/40'}`}>
                £{activePoint.crypto.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-96 z-10 transition-opacity duration-500 group-hover/chart:opacity-100 opacity-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={trajectoryData} 
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleMouseMove}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="totalGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.15}/>
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                content={<></>} 
                cursor={{ stroke: '#ffffff', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.3 }}
              />
              <Area type="monotone" dataKey="total" stroke="#22c55e" strokeWidth={5} fill="url(#totalGlow)" activeDot={{ r: 8, strokeWidth: 0, fill: '#22c55e' }} />
              <Area type="monotone" dataKey="crypto" stroke="#eab308" strokeWidth={3} fill="transparent" strokeDasharray="6 6" activeDot={{ r: 4, fill: '#eab308' }} />
              <Area type="monotone" dataKey="isa" stroke="#B3593B" strokeWidth={3} fill="transparent" strokeDasharray="6 6" activeDot={{ r: 4, fill: '#B3593B' }} />
              <Area type="monotone" dataKey="salary" stroke="#fff" strokeWidth={2} fill="transparent" strokeDasharray="12 12" activeDot={{ r: 4, fill: '#fff' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="absolute bottom-10 left-12 z-20 pointer-events-none opacity-40 group-hover/chart:opacity-0 transition-opacity duration-300">
          <div className="flex items-center gap-3">
             <MousePointer2 size={18} className="text-white animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Tap to inspect growth</span>
          </div>
        </div>
      </Card>

      {/* Section: The Foundation */}
      <div className="mb-14">
        <div className="flex items-center justify-between mb-8 px-2">
          <h4 className="text-[11px] font-black text-charcoal/40 dark:text-stone/40 uppercase tracking-[0.4em]">The Foundation</h4>
          <HelpCircle size={18} className="text-rust/60 hover:text-rust transition-colors cursor-pointer" onClick={() => showHelp("The Foundation", "This represents your 'Floor'—the wealth generated purely from your base salary income over time, assuming no growth.")} />
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <Card className="bg-charcoal/5 dark:bg-[#121212] border-white/5 p-10 rounded-[44px] flex items-center justify-between group overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[60px] group-hover:scale-110 transition-transform" />
            <div className="flex items-center gap-8 relative z-10">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 border border-white/5">
                <Wallet size={32} />
              </div>
              <div>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">CUMULATIVE WAGES</p>
                <p className="text-4xl font-black text-white tracking-tighter">£{activePoint.salary.toLocaleString()}</p>
              </div>
            </div>
            <div className="h-12 w-32 opacity-20 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trajectoryData}>
                  <Area type="monotone" dataKey="salary" stroke="#fff" fill="transparent" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* Section: The Accelerator */}
      <div className="mb-14">
        <div className="flex items-center justify-between mb-8 px-2">
          <h4 className="text-[11px] font-black text-charcoal/40 dark:text-stone/40 uppercase tracking-[0.4em]">The Accelerator</h4>
          <HelpCircle size={18} className="text-rust/60 hover:text-rust transition-colors cursor-pointer" onClick={() => showHelp("The Accelerator", "How your specific assets (ISA, Crypto, etc.) compound over time. The 'Acceleration' is the value added by growth on top of your contributions.")} />
        </div>

        <div className="grid grid-cols-1 gap-5">
          <Card className="p-10 bg-charcoal/5 dark:bg-[#121212] border-white/5 rounded-[44px] flex items-center justify-between group overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rust/5 rounded-bl-[60px] group-hover:scale-110 transition-transform" />
            <div className="flex items-center gap-8 relative z-10">
              <div className="w-16 h-16 bg-rust/10 rounded-2xl flex items-center justify-center text-rust border border-rust/10 shadow-lg">
                <TrendingUp size={32} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">ISA GROWTH POSITION</p>
                  <HelpCircle size={10} className="text-white/10" onClick={() => showHelp("ISA Projection", "Calculated using a 7% composite annual yield based on historical global equity benchmarks.")} />
                </div>
                <p className="text-4xl font-black text-white tracking-tighter">£{activePoint.isa.toLocaleString()}</p>
              </div>
            </div>
            <div className="h-12 w-32 opacity-30 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trajectoryData}>
                  <Area type="monotone" dataKey="isa" stroke="#B3593B" fill="transparent" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-10 bg-charcoal/5 dark:bg-[#121212] border-white/5 rounded-[44px] flex items-center justify-between group overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-bl-[60px] group-hover:scale-110 transition-transform" />
            <div className="flex items-center gap-8 relative z-10">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 border border-yellow-500/10 shadow-lg">
                <Zap size={32} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">CRYPTO GROWTH POSITION</p>
                  <HelpCircle size={10} className="text-white/10" onClick={() => showHelp("Crypto Projection", "Aggressive 18% yield projection. High variance. This assumes you capture cycle growth while managing drawdowns.")} />
                </div>
                <p className="text-4xl font-black text-white tracking-tighter">£{activePoint.crypto.toLocaleString()}</p>
              </div>
            </div>
            <div className="h-12 w-32 opacity-30 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trajectoryData}>
                  <Area type="monotone" dataKey="crypto" stroke="#eab308" fill="transparent" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* Composition Insight */}
      <Card className="p-12 border-none bg-charcoal dark:bg-charcoal-card rounded-[54px] shadow-3xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-rust/5 rounded-full blur-3xl" />
        <div className="flex items-center gap-4 mb-8 relative z-10">
           <Sparkles size={28} className="text-rust" />
           <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">Wealth Composition</h4>
        </div>
        <div className="space-y-6 relative z-10">
          <div className="flex justify-between items-center pb-6 border-b border-white/5">
            <span className="text-sm font-bold text-stone/40 uppercase tracking-widest">Base Contributions</span>
            <span className="text-xl font-black text-white">£{(userData.monthlyIncome * (userData.allocation.incomeAllocationPercent/100) * horizon).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-rust uppercase tracking-widest">Investment Premium</span>
              <HelpCircle size={12} className="text-rust/40" onClick={() => showHelp("Investment Premium", "The 'free' wealth generated by your money working for you, calculated as the difference between your total portfolio value and your raw contributions.")} />
            </div>
            <span className="text-xl font-black text-rust">£{(finalPoint.isa + finalPoint.crypto + finalPoint.other - (userData.vaults.reduce((a,v) => a+v.balance, 0) + (userData.monthlyIncome * (userData.allocation.incomeAllocationPercent/100) * horizon))).toLocaleString()}</span>
          </div>
        </div>
        <p className="text-[10px] text-center font-black text-stone/20 uppercase tracking-[0.2em] mt-10">
          *Projections are illustrative and not guaranteed
        </p>
      </Card>

      {/* Aesthetic Quote Section */}
      <div className="mt-20 p-16 bg-charcoal/5 dark:bg-charcoal-card rounded-[64px] border border-charcoal/10 dark:border-white/5 flex flex-col items-center text-center">
        <Quote className="text-rust/20 mb-8" size={48} />
        <p className="text-2xl text-charcoal/70 dark:text-stone/40 italic font-black leading-tight max-w-[320px] mx-auto antialiased tracking-tight">
          "The four most dangerous words in investing are: 'this time it's different.'"
        </p>
        <p className="text-[10px] font-black text-rust uppercase tracking-[0.4em] mt-8">
          — Sir John Templeton
        </p>
      </div>

      {/* Help Modal */}
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
    </div>
  );
};

export default Timeline;