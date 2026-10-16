import React, { useState } from 'react';
import { UserData, AppScreen } from '../types';
import { SectionHeader, Card, Badge, Button, Label } from '../components/UI';
import { AnimatedNumber, Stagger, StaggerItem } from '../components/Motion';
import { ArrowUpRight, Plus, Zap, Shield, ChevronRight, TrendingUp, Sparkles, Receipt, X, Info, Landmark, LineChart, Wallet, Quote } from 'lucide-react';

interface Props {
  userData: UserData;
  setScreen: (s: AppScreen) => void;
  navigateToVault: (id: string) => void;
  showTutorial?: boolean;
}

const Home: React.FC<Props> = ({ userData, setScreen, navigateToVault, showTutorial }) => {
  const [showArchitecture, setShowArchitecture] = useState(false);
  
  const totalVaults = userData.vaults.reduce((acc, v) => acc + v.balance, 0);
  const totalExternal = userData.externalAssets.reduce((acc, v) => acc + v.value, 0);
  const totalBalance = totalVaults + totalExternal;
  // Keep long balances inside a phone-width screen (original size up to 4 figures)
  const netLen = Math.round(totalBalance).toLocaleString('en-GB').length;
  const netSize = netLen <= 5 ? 'text-8xl' : netLen <= 7 ? 'text-6xl' : 'text-5xl';
  
  const totalExpenses = userData.monthlyExpenses.reduce((acc, e) => acc + e.amount, 0);
  const disposableIncome = userData.monthlyIncome - totalExpenses;

  // Architecture Calculations
  const foundation = userData.vaults.filter(v => !v.isInvested).reduce((a, b) => a + b.balance, 0);
  const accelerators = userData.vaults.filter(v => v.isInvested && v.assetClass !== 'Crypto').reduce((a, b) => a + b.balance, 0) + 
                      userData.externalAssets.filter(a => a.type === 'Equity').reduce((a, b) => a + b.value, 0);
  const frontier = userData.vaults.filter(v => v.assetClass === 'Crypto').reduce((a, b) => a + b.balance, 0) + 
                  userData.externalAssets.filter(a => a.type === 'Crypto').reduce((a, b) => a + b.value, 0);

  return (
    <div className="animate-in fade-in duration-1000 pb-32">
      {/* Actionable Central Balance Pulse */}
      <button 
        onClick={() => setShowArchitecture(true)}
        className="relative py-28 flex flex-col items-center justify-center overflow-hidden w-full group active:scale-95 transition-all"
      >
        <div className="absolute w-[240px] h-[240px] rounded-full border border-rust/20 pulse-ring group-hover:border-rust/40 transition-colors"></div>
        <div className="absolute w-[300px] h-[300px] rounded-full border border-rust/10 pulse-ring group-hover:border-rust/20 transition-colors" style={{ animationDelay: '1.5s' }}></div>
        
        <div className="relative text-center z-10 w-full px-4">
          <p className="text-[10px] font-black text-charcoal/60 dark:text-stone/40 uppercase tracking-[0.5em] mb-8 group-hover:text-rust transition-colors antialiased">Portfolio Net Value</p>
          
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-3xl font-bold text-charcoal/30 dark:text-stone/20 mb-1 group-hover:text-rust/40 transition-colors">£</span>
            <h1 className={`${netSize} font-black tracking-tight text-charcoal dark:text-stone leading-none transition-[font-size] duration-500`}>
              <AnimatedNumber value={totalBalance} duration={1.6} />
            </h1>
            <span className="text-3xl font-bold text-charcoal/30 dark:text-stone/20 mb-1 group-hover:text-rust/40 transition-colors">.00</span>
          </div>

          <div className="mt-10 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
             <Badge variant="rust" className="lowercase !tracking-normal">Tap for architecture</Badge>
          </div>
        </div>
      </button>

      {showTutorial && (
        <Card className="mb-12 border-2 border-rust bg-rust/5 p-8 animate-bounce-subtle">
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 bg-rust rounded-2xl flex items-center justify-center text-white shrink-0">
              <Sparkles size={24} fill="currentColor" />
            </div>
            <div className="flex-1">
              <h4 className="font-black text-charcoal dark:text-stone tracking-tight">System Initialization!</h4>
              <p className="text-sm text-charcoal/80 dark:text-stone/50 mt-1 mb-6 leading-relaxed">
                Your portfolio is now mapped. Folio uses rules to move future income automatically. Ready to set your first allocation?
              </p>
              <Button fullWidth onClick={() => setScreen('allocate')} className="h-12 !text-[10px]">
                Configure Allocations
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Cash Flow Summary */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6 px-2">
          <h4 className="text-[11px] font-black text-charcoal/40 dark:text-stone/40 uppercase tracking-[0.4em]">Cash Flow Analysis</h4>
        </div>
        <Card onClick={() => setScreen('flow')} className="bg-charcoal dark:bg-charcoal-lighter border-none p-10 rounded-[54px] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rust/5 rounded-bl-[80px] group-hover:scale-110 transition-transform"></div>
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-[10px] font-black uppercase text-stone/40 tracking-widest block mb-2">Disposable Capital</span>
              <p className="text-5xl font-black text-stone tracking-tighter">£<AnimatedNumber value={disposableIncome} /></p>
            </div>
            <div className="text-right">
               <span className="text-[10px] font-black uppercase text-rust tracking-widest block mb-2">Commitments</span>
               <p className="text-2xl font-black text-rust tracking-tighter">£{totalExpenses.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex gap-2 h-2.5 bg-white/5 rounded-full overflow-hidden">
             <div className="bg-rust origin-left animate-in slide-in-from-left-full duration-1000 ease-silk" style={{ width: `${(totalExpenses / userData.monthlyIncome) * 100}%` }}></div>
             <div className="bg-green-500/40 flex-1"></div>
          </div>
          <p className="text-[10px] font-bold text-stone/20 uppercase tracking-widest mt-6 text-center">Tap to manage monthly flow</p>
        </Card>
      </div>

      {/* Core Actions */}
      <div className="grid grid-cols-2 gap-5 mb-16">
        <Card onClick={() => setScreen('allocate')} className="flex flex-col items-start gap-5 hover:border-rust/40 transition-all px-8 py-10 rounded-[44px]">
          <div className="w-14 h-14 bg-rust rounded-[22px] flex items-center justify-center text-white dark:text-stone shadow-xl shadow-rust/30">
            <Plus size={28} strokeWidth={3} />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-charcoal/80 dark:text-stone/60">Allocate</span>
        </Card>
        <Card onClick={() => setScreen('scope')} className="flex flex-col items-start gap-5 hover:border-rust/40 transition-all px-8 py-10 rounded-[44px]">
          <div className="w-14 h-14 bg-charcoal/5 dark:bg-stone/5 rounded-[22px] flex items-center justify-center text-rust border border-charcoal/10 dark:border-white/10 shadow-sm">
            <Zap size={28} fill="currentColor" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-charcoal/80 dark:text-stone/60">Scope Lens</span>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-10 px-2">
        <h3 className="text-3xl font-black text-charcoal dark:text-stone tracking-tighter">Vault Spaces</h3>
        <button onClick={() => setScreen('vaults')} className="text-[11px] font-black text-rust uppercase tracking-[0.4em] flex items-center gap-3 active:opacity-50">
          All <ChevronRight size={20} strokeWidth={4} />
        </button>
      </div>

      <Stagger className="space-y-5">
        {userData.vaults.map(v => (
          <StaggerItem key={v.id}>
          <Card 
            key={v.id} 
            onClick={() => navigateToVault(v.id)}
            className="flex justify-between items-center py-10 px-0 group transition-all relative overflow-hidden bg-charcoal dark:bg-charcoal-card border-none rounded-[40px] shadow-2xl"
          >
            <div className="flex items-center gap-8 pl-0">
              <div className={`w-2.5 h-20 rounded-r-full transition-all duration-500 group-hover:w-3.5 ${v.isInvested ? 'bg-rust' : 'bg-charcoal-lighter dark:bg-white/[0.08]'}`} />
              
              <div>
                <h4 className="font-black text-white text-2xl tracking-tighter mb-1.5">{v.name}</h4>
                <div className="flex items-center gap-3">
                  <span className="bg-white/5 text-[9px] font-black text-stone/40 px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/5">
                    {v.type === 'ISA' ? 'ISA' : v.assetClass === 'Crypto' ? 'INVESTMENT' : 'SAVINGS'}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right pr-10">
              <p className="text-3xl font-black text-white tracking-tighter leading-none mb-2">£<AnimatedNumber value={v.balance} /></p>
              <div className="flex items-center justify-end gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                <p className="text-[9px] font-black text-stone/30 uppercase tracking-[0.2em]">Live Sync</p>
              </div>
            </div>
          </Card>
          </StaggerItem>
        ))}
      </Stagger>

      {/* Portfolio Architecture Modal */}
      {showArchitecture && (
        <div className="fixed inset-0 z-[100] bg-charcoal/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
           <Card className="w-full max-w-sm p-12 bg-[#080808] border-white/5 rounded-[54px] shadow-3xl relative overflow-hidden">
              <button 
                onClick={() => setShowArchitecture(false)} 
                className="absolute top-10 right-10 text-white/20 hover:text-white transition-colors z-20"
              >
                <X size={32} />
              </button>

              <div className="mb-10 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-12 h-12 bg-rust/10 rounded-2xl flex items-center justify-center text-rust">
                      <Sparkles size={24} />
                   </div>
                   <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-white/40">Portfolio Architecture</h3>
                </div>
                <p data-fit className="text-6xl font-black text-white tracking-compressed">
                   £{totalBalance.toLocaleString()}
                </p>
              </div>

              <div className="space-y-6 relative z-10">
                {/* The Foundation */}
                <div className="p-7 bg-white/5 rounded-[32px] border border-white/5">
                   <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                         <Landmark size={18} className="text-stone/40" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-stone/50">The Foundation</span>
                      </div>
                      <span className="text-xl font-black text-white">£{foundation.toLocaleString()}</span>
                   </div>
                   <p className="text-[10px] font-medium text-stone/30 leading-relaxed uppercase tracking-wider">Liquid cash & emergency buffers. Low-yield, high-safety capital for near-term stability.</p>
                </div>

                {/* The Accelerators */}
                <div className="p-7 bg-rust/10 rounded-[32px] border border-rust/10">
                   <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                         <LineChart size={18} className="text-rust" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-rust">Accelerators</span>
                      </div>
                      <span className="text-xl font-black text-white">£{accelerators.toLocaleString()}</span>
                   </div>
                   <p className="text-[10px] font-medium text-rust/40 leading-relaxed uppercase tracking-wider">Equity ISAs & long-term holdings. Designed to outpace inflation via market compound growth.</p>
                </div>

                {/* The Frontier */}
                <div className="p-7 bg-yellow-500/10 rounded-[32px] border border-yellow-500/10">
                   <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                         <Zap size={18} className="text-yellow-500" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500">The Frontier</span>
                      </div>
                      <span className="text-xl font-black text-white">£{frontier.toLocaleString()}</span>
                   </div>
                   <p className="text-[10px] font-medium text-yellow-500/30 leading-relaxed uppercase tracking-wider">Digital assets & high-volatility plays. Maximum risk for potential asymmetric capture.</p>
                </div>
              </div>

              <div className="mt-10 flex gap-4 relative z-10">
                 <Button fullWidth onClick={() => setScreen('holdings')} variant="secondary" className="!bg-white/5 !border-white/5">Holdings Ledger</Button>
                 <Button fullWidth onClick={() => setShowArchitecture(false)}>Understood</Button>
              </div>

              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-rust/5 rounded-full blur-[100px] pointer-events-none"></div>
           </Card>
        </div>
      )}

      {/* Aesthetic Quote Section */}
      <div className="mt-24 p-16 bg-charcoal/5 dark:bg-charcoal-card rounded-[64px] border border-charcoal/10 dark:border-white/5 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rust/5 rounded-bl-full opacity-50"></div>
        <Quote className="text-rust/20 mb-8" size={48} />
        <p className="text-2xl text-charcoal/70 dark:text-stone/40 italic font-black leading-tight max-w-[320px] mx-auto antialiased tracking-tight">
          "Wealth is the ability to fully experience life."
        </p>
        <p className="text-[10px] font-black text-rust uppercase tracking-[0.4em] mt-8">
          — Henry David Thoreau
        </p>
      </div>
    </div>
  );
};

export default Home;