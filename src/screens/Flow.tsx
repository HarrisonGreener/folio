
import React, { useState } from 'react';
import { UserData, Expense } from '../types';
import { SectionHeader, Card, Label, Button, Badge, Input } from '../components/UI';
import { ChevronLeft, Plus, Receipt, TrendingUp, Wallet, Home, Zap, CreditCard, Trash2, Edit2 } from 'lucide-react';

interface Props {
  userData: UserData;
  onBack: () => void;
  updateUserData: (d: Partial<UserData>) => void;
}

const Flow: React.FC<Props> = ({ userData, onBack, updateUserData }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    name: '',
    amount: 0,
    category: 'other',
    isFixed: true
  });

  const totalRevenue = userData.monthlyIncome;
  const totalPayments = userData.monthlyExpenses.reduce((acc, e) => acc + e.amount, 0);
  const disposable = totalRevenue - totalPayments;

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'housing': return <Home size={20} />;
      case 'utility': return <Zap size={20} />;
      case 'subscription': return <CreditCard size={20} />;
      default: return <Receipt size={20} />;
    }
  };

  const addExpense = () => {
    if (!newExpense.name || !newExpense.amount) return;
    const expense: Expense = {
      id: `ex-${Date.now()}`,
      name: newExpense.name,
      amount: Number(newExpense.amount),
      category: (newExpense.category as any) || 'other',
      isFixed: newExpense.isFixed || false
    };
    updateUserData({ monthlyExpenses: [...userData.monthlyExpenses, expense] });
    setIsAdding(false);
    setNewExpense({ name: '', amount: 0, category: 'other', isFixed: true });
  };

  const removeExpense = (id: string) => {
    updateUserData({ monthlyExpenses: userData.monthlyExpenses.filter(e => e.id !== id) });
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 pb-32">
      <button onClick={onBack} className="mb-8 flex items-center gap-2 text-charcoal/40 dark:text-stone/40 hover:text-rust transition-colors group">
        <ChevronLeft size={22} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-black uppercase tracking-widest">Dashboard</span>
      </button>

      <SectionHeader 
        title="Monthly Flow" 
        subtitle="Visualizing the gap between Revenue and Payments. Your real capital starts after your commitments." 
      />

      {/* Hero Stats */}
      <div className="grid grid-cols-2 gap-5 mb-12">
        <Card className="bg-charcoal dark:bg-charcoal-lighter text-stone border-none p-8 flex flex-col justify-between h-44 shadow-2xl">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Monthly Revenue</span>
          <p data-fit className="text-4xl font-black tracking-tighter text-green-500">£{totalRevenue.toLocaleString()}</p>
        </Card>
        <Card className="bg-charcoal dark:bg-charcoal-lighter text-stone border-none p-8 flex flex-col justify-between h-44 shadow-2xl">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Total Payments</span>
          <p data-fit className="text-4xl font-black text-rust tracking-tighter">£{totalPayments.toLocaleString()}</p>
        </Card>
      </div>

      <Card className="mb-12 p-10 bg-rust/5 border-rust/10 flex items-center justify-between rounded-[48px]">
        <div>
          <h4 className="text-[11px] font-black text-rust uppercase tracking-[0.4em] mb-2">Disposable Surplus</h4>
          <p data-fit className="text-5xl font-black text-charcoal dark:text-stone tracking-tighter">£{disposable.toLocaleString()}</p>
        </div>
        <div className="w-20 h-20 bg-rust/10 rounded-[32px] flex items-center justify-center text-rust border border-rust/10 shadow-inner">
          <TrendingUp size={40} />
        </div>
      </Card>

      <div className="flex items-center justify-between mb-8 px-2">
        <h4 className="text-[11px] font-black text-charcoal/40 dark:text-stone/30 uppercase tracking-[0.4em]">Recurring Payments</h4>
        <button onClick={() => setIsAdding(true)} className="w-10 h-10 bg-rust rounded-full flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform">
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-4 mb-16">
        {userData.monthlyExpenses.map((expense) => (
          <Card key={expense.id} className="flex justify-between items-center py-8 px-8 dark:bg-[#141414] border-white/[0.04]">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-charcoal-lighter dark:bg-white/[0.03] rounded-2xl flex items-center justify-center text-rust border border-white/5">
                {getCategoryIcon(expense.category)}
              </div>
              <div>
                <h5 className="font-black text-lg text-stone tracking-tight leading-none mb-1">{expense.name}</h5>
                <Badge variant="default" className="text-[8px]">{expense.isFixed ? 'Fixed' : 'Variable'}</Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-2xl font-black text-stone tracking-tighter leading-none">£{expense.amount.toLocaleString()}</p>
              </div>
              <button onClick={() => removeExpense(expense.id)} className="text-charcoal/20 dark:text-stone/20 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] bg-charcoal/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
          <Card className="w-full max-w-sm p-10 bg-stone dark:bg-charcoal-lighter rounded-[48px] border-rust/20">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-2xl font-black tracking-tighter">New Commitment</h3>
               <button onClick={() => setIsAdding(false)} className="text-charcoal/40 dark:text-stone/40"><Plus size={24} className="rotate-45" /></button>
             </div>
             
             <div className="space-y-6">
                <div>
                   <Label>Label</Label>
                   <Input 
                    placeholder="e.g. Gym Membership" 
                    value={newExpense.name} 
                    onChange={e => setNewExpense({...newExpense, name: e.target.value})}
                   />
                </div>
                <div>
                   <Label>Monthly Amount</Label>
                   <Input 
                    type="number" 
                    placeholder="0" 
                    value={newExpense.amount} 
                    onChange={e => setNewExpense({...newExpense, amount: Number(e.target.value)})}
                   />
                </div>
                <div>
                  <Label>Category</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {['housing', 'utility', 'subscription', 'other'].map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setNewExpense({...newExpense, category: cat as any})}
                        className={`p-3 rounded-xl border text-[9px] font-black uppercase tracking-widest ${newExpense.category === cat ? 'bg-rust border-rust text-white' : 'border-charcoal/10 dark:border-white/10 text-charcoal/40 dark:text-stone/40'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <Button fullWidth onClick={addExpense}>Record Payment</Button>
             </div>
          </Card>
        </div>
      )}

      <div className="p-12 bg-charcoal/5 dark:bg-[#1A1A1A] rounded-[54px] border border-charcoal/10 dark:border-white/[0.03] flex gap-8 items-start shadow-inner">
        <Receipt size={32} className="text-rust shrink-0 mt-1" />
        <div>
          <h4 className="text-[11px] font-black text-charcoal dark:text-stone uppercase tracking-[0.4em] mb-3">Commitment Shield</h4>
          <p className="text-xs text-charcoal/60 dark:text-stone/40 leading-relaxed font-semibold antialiased opacity-80">
            Folio treats your commitments as "Protected Debt." We calculate your monthly allocations only from your Surplus to ensure your lifestyle remains stable.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Flow;
