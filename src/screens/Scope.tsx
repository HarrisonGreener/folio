import React, { useState } from 'react';
import { UserData, Vault, AppScreen, VaultType } from '../types';
import { SectionHeader, Card, Button, Input, Label, Badge } from '../components/UI';
import { getScopeScenarios, ScopeResult, ScopeScenario } from '../services/scope';
import { isLocalAISupported, isModelLoaded, MODEL_LABEL } from '../services/localModel';
import { motion, AnimatePresence } from 'framer-motion';
import { Stagger, StaggerItem } from '../components/Motion';
import { Cpu } from 'lucide-react';
import { Zap, Sparkles, AlertCircle, Calendar, ArrowRight, Loader2, Target, Plus, ShieldCheck, Vault as VaultIcon, TrendingUp, Info, Scale, Clock, Quote } from 'lucide-react';

interface Props {
  userData: UserData;
  onAddVault: (v: Vault) => void;
  setScreen: (s: AppScreen) => void;
}

const Scope: React.FC<Props> = ({ userData, onAddVault, setScreen }) => {
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [timeframe, setTimeframe] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ScopeResult | null>(null);
  const [planStarted, setPlanStarted] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ stage: 'loading' | 'thinking'; value: number; text: string } | null>(null);
  const aiSupported = isLocalAISupported();

  const handleScope = async () => {
    if (!price) return;
    setLoading(true);
    setProgress(null);
    const res = await getScopeScenarios({
      itemName: itemName || 'New Goal',
      price: Number(price),
      timeframe,
      currentIncome: userData.monthlyIncome,
      currentSavings: userData.vaults.reduce((a, b) => a + b.balance, 0),
      externalPortfolio: userData.externalAssets
    }, {
      useAI: true,
      onProgress: (stage, value, text) => setProgress({ stage, value, text }),
    });
    setResults(res);
    setLoading(false);
    setProgress(null);
  };

  const loadingLabel = !progress
    ? (aiSupported ? 'Starting assistant...' : 'Analyzing Scenarios...')
    : progress.stage === 'loading'
      ? `Loading model ${Math.round(progress.value * 100)}%`
      : 'Analyzing Scenarios...';

  const createGoalVault = (scenario: ScopeScenario) => {
    const vType = (scenario.recommendedVaultType as VaultType) || 'Savings';
    const isInvested = ['ISA', 'Investment'].includes(vType);
    
    const newVault: Vault = {
      id: `v-${Date.now()}`,
      name: itemName || scenario.title,
      type: vType,
      balance: 0,
      available: 0,
      description: `Targeting ${scenario.monthlyAmount} to reach your goal by ${scenario.date}. Logic: ${scenario.assumptions}`,
      isInvested: isInvested,
      assetClass: isInvested ? 'Equity' : 'Cash'
    };
    onAddVault(newVault);
    setPlanStarted(scenario.title);
    setTimeout(() => {
      setScreen('vaults');
    }, 2000);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <SectionHeader 
        title="Scope Lens" 
        subtitle="Analyze goals with our financial assistant. Turn intent into actionable spaces instantly." 
      />

      {!results ? (
        <div className="space-y-8">
          <Card className="p-10 border-charcoal/10 dark:border-white/5 shadow-2xl rounded-[54px] transition-all bg-white dark:bg-charcoal-lighter">
            <div className="space-y-12">
              <div className="flex items-center gap-6">
                <div className="w-18 h-18 bg-rust rounded-[28px] flex items-center justify-center text-white shadow-2xl shadow-rust/30">
                  <Target size={36} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="font-black text-3xl text-charcoal dark:text-stone tracking-tighter">New Goal</h3>
                  <p className="text-[11px] font-black text-rust uppercase tracking-[0.4em] mt-1">Alignment Mode</p>
                </div>
              </div>
              
              <div className="space-y-5">
                <Label>What do you need to scope?</Label>
                <div className="relative">
                   <Input 
                    placeholder="e.g. Deposit for a house" 
                    value={itemName}
                    onChange={e => setItemName(e.target.value)}
                    className="h-24 text-lg rounded-[28px] px-8 bg-charcoal/5 dark:bg-charcoal border-charcoal/10 dark:border-white/10"
                  />
                </div>
              </div>

              <div className="space-y-5">
                <Label>Total Target Amount</Label>
                <div className="relative">
                  <span className="absolute left-8 top-1/2 -translate-y-1/2 text-rust text-3xl font-black">£</span>
                  <Input 
                    type="number" 
                    className="pl-16 font-black text-4xl h-24 rounded-[28px] px-8 bg-charcoal/5 dark:bg-charcoal border-charcoal/10 dark:border-white/10" 
                    placeholder="0" 
                    value={price}
                    onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-5">
                <Label>Horizon (Optional)</Label>
                <div className="relative">
                  <Calendar className="absolute left-8 top-1/2 -translate-y-1/2 text-rust/40" size={24} />
                  <Input 
                    className="pl-20 text-lg font-bold h-24 rounded-[28px] px-8 bg-charcoal/5 dark:bg-charcoal border-charcoal/10 dark:border-white/10" 
                    placeholder="e.g. 5 years" 
                    value={timeframe}
                    onChange={e => setTimeframe(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Button 
            fullWidth 
            onClick={handleScope}
            disabled={loading || !price}
            className="h-24 text-2xl shadow-3xl shadow-rust/40 rounded-[36px] font-black tracking-widest"
          >
            {loading ? <Loader2 size={32} className="animate-spin" /> : <Sparkles size={30} fill="currentColor" />}
            {loading ? loadingLabel : "Consult Strategy Assistant"}
          </Button>

          <div className="flex items-center gap-4 px-6 py-5 rounded-[28px] bg-charcoal/5 dark:bg-charcoal-card border border-charcoal/10 dark:border-white/[0.06]">
            <div className="w-10 h-10 rounded-2xl bg-rust/10 text-rust flex items-center justify-center shrink-0">
              <Cpu size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-charcoal/60 dark:text-stone/50">
                {aiSupported ? MODEL_LABEL : 'Calculated on device'}
              </p>
              <p className="text-xs text-charcoal/50 dark:text-stone/40 mt-1 leading-snug">
                {!aiSupported
                  ? 'The open-source assistant needs a WebGPU browser (desktop Chrome or Edge). Figures are still calculated exactly.'
                  : isModelLoaded()
                    ? 'Open-source model ready. Runs privately in your browser.'
                    : 'Open-source model, runs privately in your browser. About 1 GB on first use, then cached.'}
              </p>
              <AnimatePresence>
                {progress && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3"
                  >
                    <div className="h-1.5 rounded-full bg-charcoal/10 dark:bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full shimmer-bar animate-shimmer"
                        animate={{ width: `${Math.max(4, Math.round((progress.stage === 'thinking' ? 1 : progress.value) * 100))}%` }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-10 bg-charcoal/5 dark:bg-charcoal-card rounded-[48px] border border-charcoal/10 dark:border-white/10 flex gap-6 items-start shadow-xl">
              <Clock size={28} className="text-rust shrink-0 mt-1" />
              <div>
                <p className="text-[11px] text-charcoal/40 dark:text-stone/40 uppercase tracking-[0.3em] font-black mb-2">Horizon Engineering</p>
                <p className="text-base text-charcoal/80 dark:text-stone/40 leading-relaxed font-medium">Goals under 3 years are typically optimized for liquidity. Longer horizons should consider the equity premium to maintain purchasing power.</p>
              </div>
            </div>
            
            <div className="p-10 bg-charcoal/5 dark:bg-charcoal-card rounded-[48px] border border-charcoal/10 dark:border-white/10 flex gap-6 items-start shadow-xl">
              <Scale size={28} className="text-rust shrink-0 mt-1" />
              <div>
                <p className="text-[11px] text-charcoal/40 dark:text-stone/40 uppercase tracking-[0.3em] font-black mb-2">Risk Calibration</p>
                <p className="text-base text-charcoal/80 dark:text-stone/40 leading-relaxed font-medium">Assistant factors in your {userData.externalAssets.length} external holdings to ensure your new goal doesn't over-concentrate your total portfolio risk.</p>
              </div>
            </div>
          </div>

          <div className="mt-20 p-16 bg-charcoal/5 dark:bg-charcoal-card rounded-[64px] border border-charcoal/10 dark:border-white/5 flex flex-col items-center text-center">
            <Quote className="text-rust/20 mb-8" size={48} />
            <p className="text-2xl text-charcoal/50 dark:text-stone/30 italic font-black leading-tight max-w-[320px] mx-auto antialiased tracking-tight">
              "Setting goals is the first step in turning the invisible into the visible."
            </p>
            <p className="text-[10px] font-black text-rust uppercase tracking-[0.4em] mt-8">
              — Tony Robbins
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {planStarted ? (
            <div className="py-24 flex flex-col items-center text-center animate-in zoom-in duration-700">
              <div className="w-28 h-28 bg-rust rounded-[40px] flex items-center justify-center text-white dark:text-stone shadow-2xl shadow-rust/40 mb-10">
                <VaultIcon size={56} strokeWidth={3} />
              </div>
              <h3 className="text-4xl font-black mb-4 tracking-tighter leading-none text-charcoal dark:text-stone">Space Established.</h3>
              <p className="text-charcoal/50 dark:text-stone/40 text-lg font-medium px-8">Your new goal space has been configured for the selected path.</p>
            </div>
          ) : (
            <>
              <button 
                onClick={() => setResults(null)}
                className="text-[11px] font-black text-rust flex items-center gap-2 uppercase tracking-[0.3em] mb-6 hover:opacity-70 transition-opacity"
              >
                <ArrowRight size={16} className="rotate-180" strokeWidth={3} /> Back to Inputs
              </button>

              <div className="p-10 bg-rust rounded-[48px] shadow-2xl shadow-rust/30 border-none relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-charcoal/10 rounded-full blur-3xl transition-transform" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-5">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/20 text-[9px] font-black uppercase tracking-[0.2em] text-white/80">
                      {results.engine === 'ai' ? <Sparkles size={12} /> : <Cpu size={12} />}
                      {results.engineLabel}
                    </span>
                  </div>
                  <h3 className="text-3xl font-black text-white tracking-tighter mb-4">Strategic Analysis</h3>
                  <p className="text-white/80 font-medium text-lg leading-relaxed mb-8">{results.estimate}</p>
                </div>
                <Stagger className="space-y-6 relative z-10" delay={0.15} gap={0.1}>
                  {results.scenarios.map((s, idx) => (
                    <StaggerItem key={idx}>
                    <Card className="bg-white/10 border-white/10 p-8 backdrop-blur-md">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h4 className="text-xl font-black text-white tracking-tight">{s.title}</h4>
                          <Badge variant="default" className="mt-2 bg-white/20 text-white">{s.recommendedVaultType}</Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-white">{s.monthlyAmount}</p>
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{s.date}</p>
                        </div>
                      </div>
                      <div className="space-y-4 text-sm text-white/60">
                        <p><strong className="text-white/80">Trade-off:</strong> {s.tradeOff}</p>
                        <p><strong className="text-white/80">Assumptions:</strong> {s.assumptions}</p>
                        {s.investmentHighlight && <p className="text-white font-bold italic">"{s.investmentHighlight}"</p>}
                      </div>
                      <Button fullWidth onClick={() => createGoalVault(s)} className="mt-8 !bg-white !text-rust">
                        Start this Plan
                      </Button>
                    </Card>
                    </StaggerItem>
                  ))}
                </Stagger>
                <div className="mt-8 p-6 bg-black/20 rounded-3xl border border-white/5 relative z-10">
                  <p className="text-xs text-white/40 leading-relaxed italic">{results.safetyNote}</p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Scope;