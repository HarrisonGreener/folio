
import React from 'react';
import { SectionHeader, Card } from '../components/UI';
import { MOCK_ACTIVITY } from '../constants';
import { ArrowUpRight, ArrowDownLeft, TrendingUp, Gift, Wallet, CalendarDays } from 'lucide-react';

const Activity: React.FC = () => {
  const hasActivity = MOCK_ACTIVITY.length > 0;

  const getIcon = (type: string) => {
    switch (type) {
      case 'contribution': return <Wallet size={18} />;
      case 'allocation': return <ArrowDownLeft size={18} />;
      case 'growth': return <TrendingUp size={18} />;
      case 'withdrawal': return <ArrowUpRight size={18} />;
      case 'prize': return <Gift size={18} />;
      default: return <Wallet size={18} />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'contribution': return 'bg-charcoal dark:bg-stone text-stone dark:text-charcoal';
      case 'allocation': return 'bg-rust text-stone';
      case 'growth': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'prize': return 'bg-rust/20 text-rust';
      default: return 'bg-charcoal/10 dark:bg-white/10 text-charcoal/40 dark:text-stone/40';
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <SectionHeader 
        title="Activity" 
        subtitle="Every movement across your Folio is tracked and explained here." 
      />

      {!hasActivity ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-10">
          <div className="w-16 h-16 bg-charcoal/5 dark:bg-stone/5 rounded-3xl flex items-center justify-center text-charcoal/30 dark:text-stone/20 mb-6">
            <CalendarDays size={32} />
          </div>
          <h3 className="text-xl font-bold text-charcoal dark:text-stone mb-2">No activity yet.</h3>
          <p className="text-sm text-charcoal/60 dark:text-stone/40 leading-relaxed">
            Once your first allocation triggers or you make a manual contribution, your timeline will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-8 relative before:absolute before:left-[1.25rem] before:top-4 before:bottom-4 before:w-[1px] before:bg-charcoal/10 dark:before:bg-white/10">
          {MOCK_ACTIVITY.map(item => (
            <div key={item.id} className="relative pl-12">
              <div className={`absolute left-0 top-1 w-10 h-10 rounded-2xl flex items-center justify-center z-10 ${getColor(item.type)} border-[6px] border-stone dark:border-charcoal`}>
                {getIcon(item.type)}
              </div>
              
              <div className="mb-2 flex justify-between items-baseline px-1">
                <span className="text-[10px] font-black text-charcoal/50 dark:text-stone/30 uppercase tracking-[0.2em]">{new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span className={`text-base font-black ${item.type === 'growth' ? 'text-green-700 dark:text-green-400' : 'text-charcoal dark:text-stone'}`}>
                  {item.type === 'withdrawal' ? '-' : '+'}{item.amount < 1 ? `£${item.amount.toFixed(2)}` : `£${item.amount.toLocaleString()}`}
                </span>
              </div>

              <Card className="p-5 hover:border-charcoal/20 dark:hover:border-white/20 transition-all">
                <h5 className="font-bold text-charcoal dark:text-stone">{item.title}</h5>
                <p className="text-xs text-charcoal/70 dark:text-stone/50 mt-2 leading-relaxed">{item.description}</p>
                {item.vaultId && (
                  <div className="mt-4 pt-4 border-t border-charcoal/10 dark:border-white/10 flex items-center justify-between">
                    <span className="text-[9px] text-charcoal/40 dark:text-stone/40 uppercase font-bold tracking-widest">Target Vault</span>
                    <span className="text-[10px] font-bold text-rust uppercase tracking-wider">{item.vaultId === 'v1' ? 'Emergency Fund' : 'Stock ISA'}</span>
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Activity;
