
import React, { useState, useMemo } from 'react';
import { UserData, AppScreen } from '../types';
import { SectionHeader, Card, Label, Badge } from '../components/UI';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { ChevronLeft, Info, Calendar, ArrowRight, TrendingUp, Sparkles, Clock } from 'lucide-react';
import { MOCK_HISTORY } from '../constants';

interface Props {
  userData: UserData;
  onBack: () => void;
}

const Timeline: React.FC<Props> = ({ userData, onBack }) => {
  // Logic to calculate projections based on current user inputs
  const totalCurrentBalance = useMemo(() => 
    userData.vaults.reduce((acc, v) => acc + v.balance, 0), 
    [userData.vaults]
  );

  const monthlyContribution = useMemo(() => 
    userData.monthlyIncome * (userData.allocation.incomeAllocationPercent / 100),
    [userData.monthlyIncome, userData.allocation.incomeAllocationPercent]
  );

  // We'll calculate a weighted growth rate based on the asset classes in the vaults
  const estimatedAnnualGrowth = useMemo(() => {
    let weightedRate = 0;
    // Fixed type error: Explicitly cast to number[] and typed reduce parameters to fix 'unknown' type issues
    const totalSplits = (Object.values(userData.allocation.splits) as number[]).reduce((a: number, b: number) => a + b, 0) || 1;
    
    userData.vaults.forEach(v => {
      const split = userData.allocation.splits[v.id] || 0;
      const weight = split / totalSplits;
      
      let rate = 0.03; // 3% for savings
      if (v.type === 'ISA') rate = 0.07; // 7% for ISA
      if (v.assetClass === 'Crypto') rate = 0.15; // 15% for Crypto (aggressive)
      
      weightedRate += rate * weight;
    });
    
    return weightedRate || 0.04; // Default to 4% if no splits defined
  }, [userData.vaults, userData.allocation.splits]);

  const calculateProjection = (months: number) => {
    const ratePerMonth = estimatedAnnualGrowth / 12;
    let balance = totalCurrentBalance;
    for (let i = 0; i < months; i++) {
      balance = (balance + monthlyContribution) * (1 + ratePerMonth);
    }
    return Math.round(balance);
  };

  const projections = {
    sixMonths: calculateProjection(6),
    oneYear: calculateProjection(12),
    fiveYears: calculateProjection(60)
  };

  // Generate chart data that reflects the "Actual Path" vs "Plan Baseline" from the screenshot
  const historyData = useMemo(() => {
    const data = [];
    const points = 7;
    const baseValue = totalCurrentBalance > 0 ? totalCurrentBalance * 0.8 : 8000;
    
    for (let i = 0; i < points; i++) {
      const monthLabel = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'][i];
      // Baseline is a steady straight line
      const baseline = baseValue + (i * 1000);
      // Actual path has some "decisive event" dips or bumps
      let actual = baseline;
      if (i === 1) actual -= 600; // Withdrawal impact
      if (i >= 3) actual += 400; // Income increase impact
      if (i === 6) actual = totalCurrentBalance || 11400;

      data.push({ month: monthLabel, baseline, actual });
    }
    return data;
  }, [totalCurrentBalance]);

  const [selectedEvent, setSelectedEvent] = useState(MOCK_HISTORY[1]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <SectionHeader 
        title="Timeline" 
        subtitle="Understand how your actions have shaped your current wealth trajectory." 
      />

      <Card className="mb-8 p-0 bg-charcoal dark:bg-charcoal-lighter border-none h-[320px] overflow-hidden shadow-2xl relative">
        <div className="p-8 flex justify-between items-start text-stone z-10 relative">
          <div>
            <Label><span className="text-stone/70">Actual Path</span></Label>
            <p data-fit className="text-4xl font-black tracking-tighter">£{totalCurrentBalance.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <Label><span className="text-stone/40">Plan Baseline</span></Label>
            <p data-fit className="text-4xl font-black opacity-30 tracking-tighter">£{(totalCurrentBalance * 0.96).toLocaleString()}</p>
          </div>
        </div>
        
        <div className="absolute inset-x-0 bottom-0 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historyData}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B3593B" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#B3593B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="actual" 
                stroke="#B3593B" 
                strokeWidth={5} 
                fill="url(#colorActual)" 
                fillOpacity={1}
                isAnimationActive={true}
              />
              <Area 
                type="monotone" 
                dataKey="baseline" 
                stroke="#666" 
                strokeWidth={2} 
                strokeDasharray="8 8" 
                fill="transparent" 
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="flex items-center gap-3 mb-6 px-2">
        <h4 className="text-[11px] font-black text-charcoal/40 dark:text-stone/40 uppercase tracking-[0.4em]">Projection Outcomes</h4>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-12">
        <Card className="p-6 text-center flex flex-col items-center bg-charcoal/5 dark:bg-charcoal-card border-none">
          <p className="text-[9px] font-black text-charcoal/40 dark:text-stone/40 uppercase tracking-widest mb-3">6 Months</p>
          <p className="text-lg font-black text-charcoal dark:text-stone tracking-tighter">£{projections.sixMonths.toLocaleString()}</p>
          <div className="mt-2 text-[8px] font-black text-rust uppercase">Short-Term</div>
        </Card>
        <Card className="p-6 text-center flex flex-col items-center bg-charcoal/5 dark:bg-charcoal-card border-none border-rust/10">
          <p className="text-[9px] font-black text-charcoal/40 dark:text-stone/40 uppercase tracking-widest mb-3">1 Year</p>
          <p className="text-lg font-black text-rust tracking-tighter">£{projections.oneYear.toLocaleString()}</p>
          <div className="mt-2 text-[8px] font-black text-rust uppercase">Mid-Horizon</div>
        </Card>
        <Card className="p-6 text-center flex flex-col items-center bg-charcoal/5 dark:bg-charcoal-card border-none">
          <p className="text-[9px] font-black text-charcoal/40 dark:text-stone/40 uppercase tracking-widest mb-3">5 Years</p>
          <p className="text-lg font-black text-charcoal dark:text-stone tracking-tighter">£{projections.fiveYears.toLocaleString()}</p>
          <div className="mt-2 text-[8px] font-black text-rust uppercase">Long-Term</div>
        </Card>
      </div>

      <div className="flex items-center gap-3 mb-6 px-2">
        <h4 className="text-[11px] font-black text-charcoal/50 dark:text-stone/50 uppercase tracking-[0.4em]">Decisive Events</h4>
      </div>

      <div className="space-y-4 mb-10">
        {MOCK_HISTORY.map((event, i) => (
          <button 
            key={i}
            onClick={() => setSelectedEvent(event)}
            className={`w-full text-left p-8 rounded-[36px] border transition-all flex justify-between items-center ${
              selectedEvent.date === event.date 
              ? 'bg-rust/5 border-rust/30 shadow-lg shadow-rust/5' 
              : 'bg-white dark:bg-charcoal-card border-charcoal/10 dark:border-white/10 hover:border-rust/20'
            }`}
          >
            <div className="flex items-center gap-6">
              <div className={`w-3.5 h-3.5 rounded-full ${selectedEvent.date === event.date ? 'bg-rust animate-pulse' : 'bg-charcoal/20 dark:bg-white/20'}`} />
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/40 dark:text-stone/40 mb-1">{event.date}</p>
                <h5 className="text-xl font-black text-charcoal dark:text-stone tracking-tight">{event.label}</h5>
              </div>
            </div>
            <ArrowRight size={20} className={selectedEvent.date === event.date ? 'text-rust' : 'text-charcoal/20'} strokeWidth={3} />
          </button>
        ))}
      </div>

      {selectedEvent && (
        <Card className="p-12 border-none bg-charcoal dark:bg-charcoal-lighter text-stone animate-in slide-in-from-bottom-6 duration-500 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rust/5 rounded-bl-full"></div>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-rust/10 rounded-2xl flex items-center justify-center text-rust">
              <Info size={28} />
            </div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-stone/40">Retrospective Analysis</h4>
          </div>
          <p className="text-3xl font-black leading-tight mb-10 tracking-tighter">{selectedEvent.description}</p>
          <div className="p-8 bg-white/5 dark:bg-white/10 rounded-[32px] border border-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-rust" fill="currentColor" />
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-rust">Observable Impact</p>
            </div>
            <p className="text-lg font-bold text-stone/90 leading-relaxed">{selectedEvent.impact}</p>
          </div>
        </Card>
      )}

      <div className="mt-20 p-16 bg-charcoal/5 dark:bg-charcoal-card rounded-[64px] border border-charcoal/10 dark:border-white/10 flex flex-col items-center text-center">
        <Clock className="text-rust/20 mb-8" size={48} />
        <p className="text-xl text-charcoal/70 dark:text-stone/40 italic font-black leading-relaxed max-w-[280px] mx-auto antialiased tracking-tight">
          "Wealth is not built by perfect plans, but by understanding the weight of our choices."
        </p>
      </div>
    </div>
  );
};

export default Timeline;
