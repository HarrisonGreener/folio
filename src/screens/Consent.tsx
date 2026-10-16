
import React, { useState } from 'react';
import { UserData } from '../types';
import { Button, Card, SectionHeader } from '../components/UI';
import { ShieldCheck, ArrowRight, Wallet } from 'lucide-react';

interface Props {
  onConfirm: () => void;
  userData: UserData;
}

const Consent: React.FC<Props> = ({ onConfirm, userData }) => {
  const [loading, setLoading] = useState(false);

  const handleConnect = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onConfirm();
    }, 1500);
  };

  return (
    <div className="min-h-screen p-6 max-w-md mx-auto flex flex-col bg-stone dark:bg-charcoal text-charcoal dark:text-stone transition-colors duration-500">
      <div className="flex-1 flex flex-col">
        <div className="mb-12 mt-8 flex justify-center">
          <div className="w-20 h-20 bg-rust/10 rounded-full flex items-center justify-center text-rust">
            <ShieldCheck size={40} />
          </div>
        </div>

        <SectionHeader 
          title="Connect your bank" 
          subtitle="Folio uses read-only access to understand your income and help you allocate it." 
        />

        <div className="space-y-4 mb-8">
          <Card className="flex items-start gap-4">
            <div className="mt-1 text-rust shrink-0"><Wallet size={20} /></div>
            <div>
              <h4 className="font-bold text-sm dark:text-stone antialiased">Read-only access</h4>
              <p className="text-xs text-charcoal/60 dark:text-stone/40 mt-0.5 leading-relaxed antialiased">We can see transactions and balance, but we can't move money or make payments.</p>
            </div>
          </Card>

          <Card className="flex items-start gap-4">
            <div className="mt-1 text-rust shrink-0"><ShieldCheck size={20} /></div>
            <div>
              <h4 className="font-bold text-sm dark:text-stone antialiased">Transparent & Secure</h4>
              <p className="text-xs text-charcoal/60 dark:text-stone/40 mt-0.5 leading-relaxed antialiased">Your data is never sold. This is a prototype environment using simulated data.</p>
            </div>
          </Card>
        </div>

        <div className="p-6 bg-charcoal/5 dark:bg-charcoal-card rounded-2xl border border-charcoal/5 dark:border-white/5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-black text-charcoal/40 dark:text-stone/30 uppercase tracking-widest">Simulated Salary</span>
            <span className="text-sm font-black text-charcoal dark:text-stone">£{userData.monthlyIncome.toLocaleString()}</span>
          </div>
          <p className="text-xs text-charcoal/60 dark:text-stone/40 font-medium leading-relaxed antialiased">
            Based on your profile, we've identified this as your representative monthly income flow.
          </p>
        </div>
      </div>

      <div className="pt-8">
        <Button 
          fullWidth 
          onClick={handleConnect}
          disabled={loading}
          className="h-18"
        >
          {loading ? "Establishing connection..." : "Confirm & Connect"}
          {!loading && <ArrowRight size={20} />}
        </Button>
        <p className="text-[10px] text-center text-charcoal/40 dark:text-stone/20 mt-6 px-8 font-bold uppercase tracking-wider antialiased">
          Secure Simulation • No Real Login Required
        </p>
      </div>
    </div>
  );
};

export default Consent;
