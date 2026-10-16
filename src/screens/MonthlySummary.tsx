
import React from 'react';
import { Button, Card, SectionHeader, Badge } from '../components/UI';
import { TrendingUp, ArrowDownLeft, Wallet, Info } from 'lucide-react';

const MonthlySummary: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="min-h-screen p-8 max-w-md mx-auto flex flex-col bg-stone dark:bg-charcoal text-charcoal dark:text-stone transition-colors duration-500">
      <div className="flex-1">
        <div className="mt-8 mb-6">
          <Badge>May 2024</Badge>
          <h1 className="text-4xl font-black text-charcoal dark:text-stone mt-4 tracking-tighter antialiased">Monthly Summary</h1>
        </div>
        
        <p className="text-charcoal/60 dark:text-stone/40 mb-12 text-lg font-medium leading-relaxed antialiased">Here's how your money moved and grew this month in plain English.</p>

        <div className="space-y-6">
          <Card className="flex items-start gap-6 p-8 border-none shadow-xl">
            <div className="w-14 h-14 bg-charcoal/5 dark:bg-charcoal-lighter rounded-2xl flex items-center justify-center text-charcoal/40 dark:text-stone/20 shrink-0">
              <Wallet size={28} />
            </div>
            <div>
              <h4 className="font-black text-[11px] uppercase tracking-widest text-charcoal/40 dark:text-stone/30 mb-2">Income In</h4>
              <p className="text-3xl font-black tracking-tighter">£2,500.00</p>
              <p className="text-xs text-charcoal/40 dark:text-stone/40 mt-1 font-bold">Salary detected on the 1st.</p>
            </div>
          </Card>

          <Card className="flex items-start gap-6 p-8 border-none shadow-xl">
            <div className="w-14 h-14 bg-rust/10 rounded-2xl flex items-center justify-center text-rust shrink-0">
              <ArrowDownLeft size={28} />
            </div>
            <div>
              <h4 className="font-black text-[11px] uppercase tracking-widest text-charcoal/40 dark:text-stone/30 mb-2">Allocated</h4>
              <p className="text-3xl font-black tracking-tighter text-rust">£425.40</p>
              <p className="text-xs text-rust/60 mt-1 font-bold">Includes Round-Ups.</p>
            </div>
          </Card>

          <Card className="flex items-start gap-6 p-8 border-none shadow-xl">
            <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-600 shrink-0">
              <TrendingUp size={28} />
            </div>
            <div>
              <h4 className="font-black text-[11px] uppercase tracking-widest text-charcoal/40 dark:text-stone/30 mb-2">Portfolio Growth</h4>
              <p className="text-3xl font-black tracking-tighter text-green-600">+£142.10</p>
              <p className="text-xs text-green-600/60 mt-1 font-bold">Illustrative Market Projection.</p>
            </div>
          </Card>
        </div>

        <div className="mt-12 p-10 bg-charcoal dark:bg-charcoal-lighter text-stone rounded-[40px] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rust/10 rounded-bl-full"></div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <Info size={20} className="text-rust" />
            <h4 className="text-sm font-black uppercase tracking-widest">Available Now</h4>
          </div>
          <p className="text-4xl font-black tracking-tighter mb-6 relative z-10">£15,350.40</p>
          <p className="text-xs text-stone/40 leading-relaxed font-medium relative z-10 antialiased">
            This is your unified position across all Vaults. £2,450 is instant-access. Remaining balance typically clears in 3-5 days.
          </p>
        </div>
      </div>

      <div className="pt-10">
        <Button fullWidth onClick={onClose} className="h-18 text-lg">Back to Overview</Button>
      </div>
    </div>
  );
};

export default MonthlySummary;
