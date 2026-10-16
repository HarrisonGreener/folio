
import React, { useState } from 'react';
import { Vault } from '../types';
import { Button, Card, SectionHeader, Input, Label } from '../components/UI';
import { ChevronLeft, Info, Calendar, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Props {
  vault: Vault | undefined;
  onBack: () => void;
}

const Withdraw: React.FC<Props> = ({ vault, onBack }) => {
  const [amount, setAmount] = useState<number | ''>('');
  const [step, setStep] = useState(1);

  if (!vault) return null;

  const handleNext = () => setStep(2);
  const handleConfirm = () => setStep(3);

  if (step === 3) {
    return (
      <div className="min-h-screen p-6 max-w-md mx-auto flex flex-col items-center justify-center bg-stone dark:bg-charcoal text-center text-charcoal dark:text-stone transition-colors duration-500">
        <div className="w-24 h-24 bg-rust/10 rounded-full flex items-center justify-center text-rust mb-8 shadow-inner">
          <CheckCircle2 size={48} strokeWidth={2.5} />
        </div>
        <h2 className="text-3xl font-black mb-4 tracking-tighter antialiased">Request Received</h2>
        <p className="text-charcoal/60 dark:text-stone/40 mb-12 max-w-xs font-medium leading-relaxed antialiased text-lg">
          Your £{Number(amount).toLocaleString()} will arrive in your connected account within {vault.isInvested ? '3-5 business days' : 'a few hours'}.
        </p>
        <Button fullWidth onClick={onBack} className="h-16">Done</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-md mx-auto flex flex-col bg-stone dark:bg-charcoal text-charcoal dark:text-stone transition-colors duration-500">
      <button onClick={onBack} className="mb-8 flex items-center gap-2 text-charcoal/40 dark:text-stone/30 hover:text-rust transition-colors group">
        <ChevronLeft size={22} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-black uppercase tracking-widest">Cancel</span>
      </button>

      <div className="flex-1">
        {step === 1 ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHeader 
              title="Withdrawal" 
              subtitle={`Moving money from your ${vault.name}.`} 
            />
            
            <Card className="mb-8 p-10 border-none shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <Label>Available to Withdraw</Label>
                <span className="font-black text-xl tracking-tighter">£{vault.available.toLocaleString()}</span>
              </div>
              <div className="relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-rust text-3xl font-black">£</span>
                <Input 
                  type="number" 
                  className="pl-10 text-4xl font-black py-8 bg-transparent border-b-2 border-charcoal/10 dark:border-white/10 rounded-none px-0" 
                  placeholder="0.00" 
                  value={amount}
                  onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>
            </Card>

            <div className="p-8 bg-charcoal/5 dark:bg-charcoal-card rounded-[32px] flex gap-5 items-start border border-charcoal/5 dark:border-white/5">
              <Info size={24} className="text-rust shrink-0 mt-0.5" />
              <p className="text-sm text-charcoal/60 dark:text-stone/40 leading-relaxed font-semibold antialiased">
                This Vault usually takes {vault.isInvested ? '3-5 business days' : 'a few hours'} to reach your primary bank.
              </p>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <SectionHeader 
              title="Clear View" 
              subtitle="Transparency before you confirm." 
            />
            
            <div className="space-y-6">
              <Card className="flex items-start gap-6 p-8 border-none shadow-xl">
                <div className="w-14 h-14 bg-rust/10 rounded-2xl flex items-center justify-center text-rust shrink-0">
                  <Clock size={28} />
                </div>
                <div>
                  <h4 className="font-black text-lg dark:text-stone tracking-tight">Timing</h4>
                  <p className="text-sm text-charcoal/60 dark:text-stone/40 mt-1 font-medium leading-relaxed">Expected arrival: {vault.isInvested ? 'Next Wednesday' : 'Within 2 hours'}.</p>
                </div>
              </Card>

              <Card className="flex items-start gap-6 p-8 border-none shadow-xl">
                <div className="w-14 h-14 bg-rust/10 rounded-2xl flex items-center justify-center text-rust shrink-0">
                  <Calendar size={28} />
                </div>
                <div>
                  <h4 className="font-black text-lg dark:text-stone tracking-tight">Impact on Goals</h4>
                  <p className="text-sm text-charcoal/60 dark:text-stone/40 mt-1 font-medium leading-relaxed">This will extend your {vault.name} goal timeframe by approx. 2 months.</p>
                </div>
              </Card>

              <div className="p-8 bg-charcoal/5 dark:bg-charcoal-card rounded-[32px] border border-charcoal/5 dark:border-white/5">
                <p className="text-sm text-charcoal/40 dark:text-stone/30 text-center italic font-bold leading-relaxed antialiased">
                  "Folio is designed to help you use your money when you need it. No pressure, no guilt."
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pt-8">
        <Button 
          fullWidth 
          onClick={step === 1 ? handleNext : handleConfirm}
          disabled={!amount || Number(amount) > vault.available}
          className="h-20 text-xl shadow-2xl shadow-rust/30"
        >
          {step === 1 ? "Review Impact" : "Confirm Withdrawal"}
          <ArrowRight size={24} />
        </Button>
      </div>
    </div>
  );
};

export default Withdraw;
