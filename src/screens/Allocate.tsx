
import React, { useState, useEffect } from 'react';
import { UserData, Vault } from '../types';
import { SectionHeader, Card, Label, Button, Badge, Input } from '../components/UI';
// Added AlertCircle to imports to fix "Cannot find name 'AlertCircle'"
import { ChevronLeft, Power, Scissors, Target, Shield, ArrowDownCircle, ArrowRightLeft, Check, AlertTriangle, AlertCircle, Minus, Plus as PlusIcon } from 'lucide-react';

interface Props {
  userData: UserData;
  updateUserData: (d: Partial<UserData>) => void;
  onBack: () => void;
  onExecute: () => void;
}

const Allocate: React.FC<Props> = ({ userData, updateUserData, onBack, onExecute }) => {
  const { allocation } = userData;
  const [mode, setMode] = useState<'income' | 'manual'>('income');
  const [fromVault, setFromVault] = useState<string>(userData.vaults[0].id);
  const [toVault, setToVault] = useState<string>(userData.vaults[1].id);
  const [manualAmount, setManualAmount] = useState<number | ''>('');
  const [moving, setMoving] = useState(false);
  const [moved, setMoved] = useState(false);

  // Splits local state to handle editing before saving to main state
  const [localSplits, setLocalSplits] = useState<Record<string, number>>(allocation.splits);

  const toggleRoundUps = () => {
    updateUserData({
      allocation: { ...allocation, roundUpsEnabled: !allocation.roundUpsEnabled }
    });
  };

  const updateSplit = (vaultId: string, delta: number) => {
    const current = localSplits[vaultId] || 0;
    const newVal = Math.max(0, Math.min(100, current + delta));
    const nextSplits = { ...localSplits, [vaultId]: newVal };
    setLocalSplits(nextSplits);
    updateUserData({ allocation: { ...allocation, splits: nextSplits } });
  };

  // Fixed type error: Operator '+' cannot be applied to types 'unknown' and 'unknown' by adding explicit types
  const totalSplits = (Object.values(localSplits) as number[]).reduce((a: number, b: number) => a + b, 0);

  const handleManualMove = () => {
    if (!manualAmount || Number(manualAmount) <= 0) return;
    setMoving(true);
    setTimeout(() => {
      const updatedVaults = userData.vaults.map(v => {
        if (v.id === fromVault) return { ...v, balance: v.balance - Number(manualAmount), available: v.available - Number(manualAmount) };
        if (v.id === toVault) return { ...v, balance: v.balance + Number(manualAmount), available: v.available + Number(manualAmount) };
        return v;
      });
      updateUserData({ vaults: updatedVaults });
      setMoving(false);
      setMoved(true);
      setManualAmount('');
      setTimeout(() => setMoved(false), 3000);
    }, 1500);
  };

  const sourceVault = userData.vaults.find(v => v.id === fromVault);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex justify-between items-center mb-10">
        <button onClick={onBack} className="flex items-center gap-1 text-charcoal/80 dark:text-stone/60 hover:text-rust transition-colors group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-black uppercase tracking-widest">Back</span>
        </button>
        <div className="flex bg-charcoal/5 dark:bg-white/5 p-1.5 rounded-2xl border border-charcoal/10 dark:border-white/10">
          <button 
            onClick={() => setMode('income')}
            className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${mode === 'income' ? 'bg-rust text-white shadow-lg shadow-rust/30' : 'text-charcoal/50 dark:text-stone/40'}`}
          >
            Income
          </button>
          <button 
            onClick={() => setMode('manual')}
            className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${mode === 'manual' ? 'bg-rust text-white shadow-lg shadow-rust/30' : 'text-charcoal/50 dark:text-stone/40'}`}
          >
            Manual
          </button>
        </div>
      </div>

      <SectionHeader 
        title={mode === 'income' ? "Allocations" : "Free Movement"} 
        subtitle={mode === 'income' 
          ? "Automate how your salary flows into your intent spaces." 
          : "Move capital between spaces instantly without traditional banking hurdles."
        } 
      />

      {mode === 'income' ? (
        <div className="space-y-8">
          {userData.vaults[0].balance > 0 && (
            <Card className="bg-charcoal dark:bg-charcoal-lighter text-stone border-none shadow-2xl p-12 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rust/10 rounded-bl-full group-hover:scale-125 transition-transform duration-700"></div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-stone/60">Salary Pool Available</h4>
              <p className="text-5xl font-black tracking-tighter mb-10 text-stone">
                £{(userData.monthlyIncome * (allocation.incomeAllocationPercent/100)).toLocaleString()}
              </p>
              <Button 
                fullWidth 
                onClick={onExecute} 
                className="h-16 shadow-none relative z-10"
                disabled={totalSplits !== 100}
              >
                <ArrowDownCircle size={20} /> {totalSplits !== 100 ? 'Fix Splits to Execute' : 'Execute Split'}
              </Button>
              <p className="text-center text-[9px] font-black uppercase tracking-widest mt-6 text-stone/40">
                Manual trigger required for movement
              </p>
            </Card>
          )}

          <Card className={!allocation.roundUpsEnabled ? 'opacity-60 grayscale' : ''}>
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-rust/10 rounded-2xl flex items-center justify-center text-rust">
                  <Scissors size={24} />
                </div>
                <div>
                  <h3 className="font-black text-lg tracking-tight text-charcoal dark:text-stone">Round-Ups</h3>
                  <p className="text-xs font-bold text-charcoal/50 dark:text-stone/50 uppercase tracking-widest">Active Smoothing</p>
                </div>
              </div>
              <button 
                onClick={toggleRoundUps}
                className={`w-14 h-8 rounded-full p-1.5 transition-colors ${allocation.roundUpsEnabled ? 'bg-rust' : 'bg-charcoal/20 dark:bg-white/10'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${allocation.roundUpsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className="space-y-6">
              <Label>Round to nearest</Label>
              <div className="flex gap-3">
                {[1, 5].map(v => (
                  <button
                    key={v}
                    onClick={() => updateUserData({ allocation: { ...allocation, roundTo: v as 1|5 } })}
                    className={`flex-1 p-5 rounded-[20px] border-2 transition-all font-black text-sm ${
                      allocation.roundTo === v 
                      ? 'border-rust bg-rust/10 text-rust' 
                      : 'border-charcoal/10 dark:border-white/10 text-charcoal/60 dark:text-stone/50 hover:border-rust/30'
                    }`}
                  >
                    £{v}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-charcoal/5 dark:bg-white/5 rounded-2xl flex items-center justify-center text-rust">
                  <Target size={24} />
                </div>
                <h3 className="font-black text-lg tracking-tight text-charcoal dark:text-stone">Vault Splits</h3>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-rust font-black text-2xl tracking-tighter">{allocation.incomeAllocationPercent}%</span>
                <span className="text-[9px] font-black uppercase text-charcoal/40 dark:text-stone/40">of Income</span>
              </div>
            </div>
            
            <input 
              type="range" 
              min="0" 
              max="50" 
              step="1"
              value={allocation.incomeAllocationPercent}
              onChange={(e) => updateUserData({ allocation: { ...allocation, incomeAllocationPercent: Number(e.target.value) } })}
              className="w-full accent-rust h-2 bg-charcoal/10 dark:bg-white/10 rounded-full appearance-none cursor-pointer mb-12"
            />

            <div className="flex justify-between items-center px-1 mb-6">
               <Label>Customise Splits</Label>
               <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${totalSplits === 100 ? 'text-green-500 border-green-500/20' : 'text-rust border-rust/20'}`}>
                 Total: {totalSplits}% {totalSplits !== 100 && ' (Target 100%)'}
               </div>
            </div>

            <div className="space-y-4">
              {userData.vaults.map(v => (
                <div key={v.id} className="flex items-center justify-between p-5 bg-charcoal/5 dark:bg-white/5 rounded-[24px] border border-charcoal/5 dark:border-white/5 group hover:border-rust/20 transition-all">
                  <div className="flex-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-charcoal dark:text-stone/80 group-hover:text-rust transition-colors">{v.name}</span>
                    <p className="text-[8px] font-bold uppercase tracking-wider text-charcoal/30 dark:text-stone/30 mt-0.5">{v.type}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => updateSplit(v.id, -5)}
                      className="w-10 h-10 rounded-full bg-charcoal/10 dark:bg-white/10 flex items-center justify-center text-charcoal/60 dark:text-stone/60 hover:bg-rust hover:text-white transition-all active:scale-90"
                    >
                      <Minus size={14} strokeWidth={4} />
                    </button>
                    
                    <div className="w-16 text-center">
                      <span className={`text-base font-black tracking-tighter ${localSplits[v.id] > 0 ? 'text-rust' : 'text-charcoal/40 dark:text-stone/40'}`}>
                        {localSplits[v.id] || 0}%
                      </span>
                    </div>

                    <button 
                      onClick={() => updateSplit(v.id, 5)}
                      className="w-10 h-10 rounded-full bg-charcoal/10 dark:bg-white/10 flex items-center justify-center text-charcoal/60 dark:text-stone/60 hover:bg-rust hover:text-white transition-all active:scale-90"
                    >
                      <PlusIcon size={14} strokeWidth={4} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {totalSplits !== 100 && (
               <div className="mt-8 p-6 bg-rust/5 border border-rust/10 rounded-3xl flex items-center gap-4 text-rust animate-in fade-in duration-500">
                 <AlertCircle size={20} />
                 <p className="text-[10px] font-black uppercase tracking-widest">Splits must total exactly 100% to save.</p>
               </div>
            )}
          </Card>
        </div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
          <Card className="p-10 border-none shadow-2xl space-y-10">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6">
              <div className="space-y-3">
                <Label>From</Label>
                <select 
                  value={fromVault} 
                  onChange={e => setFromVault(e.target.value)}
                  className="w-full bg-charcoal/5 dark:bg-charcoal-lighter border border-charcoal/10 dark:border-white/10 rounded-2xl p-4 font-black text-xs uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-rust/30 text-charcoal dark:text-stone"
                >
                  {userData.vaults.map(v => <option key={v.id} value={v.id} className="bg-white dark:bg-charcoal">{v.name}</option>)}
                </select>
                <p className="text-[10px] font-black text-rust ml-1 uppercase tracking-widest">£{sourceVault?.balance.toLocaleString()}</p>
              </div>
              
              <div className="w-10 h-10 bg-rust/10 rounded-full flex items-center justify-center text-rust mt-6">
                <ArrowRightLeft size={18} strokeWidth={3} />
              </div>

              <div className="space-y-3">
                <Label>To</Label>
                <select 
                  value={toVault} 
                  onChange={e => setToVault(e.target.value)}
                  className="w-full bg-charcoal/5 dark:bg-charcoal-lighter border border-charcoal/10 dark:border-white/10 rounded-2xl p-4 font-black text-xs uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-rust/30 text-charcoal dark:text-stone"
                >
                  {userData.vaults.filter(v => v.id !== fromVault).map(v => <option key={v.id} value={v.id} className="bg-white dark:bg-charcoal">{v.name}</option>)}
                </select>
              </div>
            </div>

            <div className="relative pt-6 border-t border-charcoal/10 dark:border-white/10">
              <Label>Transfer Amount</Label>
              <div className="relative mt-2">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-rust text-4xl font-black">£</span>
                <Input 
                  type="number" 
                  placeholder="0.00"
                  className="pl-10 text-5xl font-black bg-transparent border-none rounded-none py-6 h-auto tracking-tighter text-charcoal dark:text-stone"
                  value={manualAmount}
                  onChange={e => setManualAmount(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>
            </div>

            <Button 
              fullWidth 
              onClick={handleManualMove}
              disabled={moving || !manualAmount || Number(manualAmount) > (sourceVault?.balance || 0)}
              className="h-20 text-xl rounded-[32px]"
            >
              {moving ? "Relocating..." : moved ? <><Check size={28} /> Relocated</> : "Execute Movement"}
            </Button>
          </Card>

          {manualAmount && Number(manualAmount) > (sourceVault?.balance || 0) && (
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center gap-4 text-red-500 animate-in shake duration-300 shadow-lg">
              <AlertTriangle size={24} />
              <p className="text-xs font-black uppercase tracking-widest">Insufficient capital in {sourceVault?.name}</p>
            </div>
          )}

          <div className="p-10 bg-charcoal/5 dark:bg-charcoal-card rounded-[48px] border border-charcoal/10 dark:border-white/5 flex gap-6 items-start">
            <Shield size={32} className="text-rust shrink-0" />
            <p className="text-sm text-charcoal/80 dark:text-stone/60 font-semibold leading-relaxed antialiased">
              Manual movements are internal ledger updates. These reflect instantly in Folio and trigger banking instructions in the background.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Allocate;
