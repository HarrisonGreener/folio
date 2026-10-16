import React, { useState } from 'react';
import { UserData, Vault, VaultType } from '../types';
import { SectionHeader, Card, Badge, Button, Input, Label } from '../components/UI';
import { Stagger, StaggerItem, AnimatedNumber } from '../components/Motion';
import { Plus, Info, Vault as VaultIcon, TrendingUp, Landmark, Shield, Wallet, X, Quote } from 'lucide-react';

interface Props {
  userData: UserData;
  onSelectVault: (id: string) => void;
  onAddVault: (v: Vault) => void;
}

const Vaults: React.FC<Props> = ({ userData, onSelectVault, onAddVault }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newVault, setNewVault] = useState({
    name: '',
    type: 'Savings' as VaultType,
    description: ''
  });

  const getIcon = (type: string, assetClass?: string) => {
    if (assetClass === 'Crypto') return <Wallet size={24} className="text-rust" />;
    switch(type) {
      case 'Savings': return <Landmark size={24} className="text-rust" />;
      case 'ISA': return <TrendingUp size={24} className="text-rust" />;
      case 'Premium Bonds': return <Shield size={24} className="text-rust" />;
      default: return <VaultIcon size={24} className="text-rust" />;
    }
  };

  const handleAddVault = () => {
    if (!newVault.name) return;
    const isInvested = ['ISA', 'Investment'].includes(newVault.type);
    const vault: Vault = {
      id: `v-${Date.now()}`,
      name: newVault.name,
      type: newVault.type,
      balance: 0,
      available: 0,
      description: newVault.description || `Target container for ${newVault.type} growth.`,
      isInvested,
      assetClass: isInvested ? 'Equity' : 'Cash'
    };
    onAddVault(vault);
    setIsAdding(false);
    setNewVault({ name: '', type: 'Savings', description: '' });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 pb-20">
      <SectionHeader 
        title="Vault Spaces" 
        subtitle="Dedicated containers for specific financial intentions, from liquid cash to high-growth crypto." 
      />

      <Stagger className="space-y-6">
        {userData.vaults.map(v => (
          <StaggerItem key={v.id}>
          <Card 
            key={v.id} 
            onClick={() => onSelectVault(v.id)}
            className="group relative overflow-hidden border-2 border-transparent hover:border-rust/20 p-8 transition-all active:scale-[0.99]"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-rust/5 rounded-bl-[120px] -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
            
            <div className="flex justify-between items-start mb-10 relative z-10">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-12 h-12 shrink-0 bg-charcoal/5 dark:bg-charcoal-lighter rounded-[18px] flex items-center justify-center border border-charcoal/5 dark:border-white/5 shadow-inner">
                  {getIcon(v.type, v.assetClass)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-black text-charcoal dark:text-stone tracking-tighter leading-[1.1] mb-1.5">{v.name}</h3>
                  <div className="flex gap-2">
                    <Badge variant={v.isInvested ? 'rust' : 'default'}>{v.type}</Badge>
                    {v.assetClass && <span className="text-[9px] font-black uppercase text-charcoal/30 dark:text-stone/30 tracking-[0.2em] self-center">{v.assetClass}</span>}
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0 pl-3">
                <p className="text-2xl font-black text-charcoal dark:text-stone tracking-tighter whitespace-nowrap">£<AnimatedNumber value={v.balance} /></p>
                {v.change24h !== undefined && (
                  <p className={`text-[10px] font-black uppercase tracking-widest mt-1.5 ${v.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {v.change24h >= 0 ? '+' : ''}{v.change24h}%
                  </p>
                )}
              </div>
            </div>
            
            <div className="p-6 bg-charcoal/5 dark:bg-charcoal-lighter/50 rounded-3xl border border-charcoal/5 dark:border-white/[0.03] relative z-10">
              <p className="text-sm text-charcoal/60 dark:text-stone/40 leading-relaxed font-semibold italic">
                "{v.description}"
              </p>
            </div>
          </Card>
          </StaggerItem>
        ))}

        <StaggerItem>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full py-16 rounded-[54px] border-4 border-dashed border-charcoal/5 dark:border-white/10 flex flex-col items-center justify-center gap-5 text-charcoal/20 dark:text-stone/20 hover:text-rust hover:border-rust/30 transition-all active:scale-98 group"
        >
          <div className="w-20 h-20 rounded-full border-4 border-dashed border-current flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
            <Plus size={40} strokeWidth={3} />
          </div>
          <span className="text-base font-black uppercase tracking-[0.4em]">Establish Space</span>
        </button>
        </StaggerItem>
      </Stagger>

      {isAdding && (
        <div className="fixed inset-0 z-[100] bg-charcoal/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
          <Card className="w-full max-w-sm p-10 bg-stone dark:bg-charcoal-lighter rounded-[48px] border-rust/20">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-2xl font-black tracking-tighter">Establish Space</h3>
               <button onClick={() => setIsAdding(false)} className="text-charcoal/40 dark:text-stone/40 hover:text-rust transition-colors"><X size={28} /></button>
             </div>
             
             <div className="space-y-6">
                <div>
                   <Label>Space Name</Label>
                   <Input 
                    placeholder="e.g. Dream Loft Fund" 
                    value={newVault.name} 
                    onChange={e => setNewVault({...newVault, name: e.target.value})}
                   />
                </div>
                <div>
                  <Label>Space Type</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Savings', 'ISA', 'Premium Bonds', 'Investment'].map(type => (
                      <button 
                        key={type}
                        onClick={() => setNewVault({...newVault, type: type as VaultType})}
                        className={`p-3 rounded-xl border text-[9px] font-black uppercase tracking-widest ${newVault.type === type ? 'bg-rust border-rust text-white' : 'border-charcoal/10 dark:border-white/10 text-charcoal/40 dark:text-stone/40'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                   <Label>Intention Description</Label>
                   <Input 
                    placeholder="What is this capital for?" 
                    value={newVault.description} 
                    onChange={e => setNewVault({...newVault, description: e.target.value})}
                   />
                </div>
                <Button fullWidth onClick={handleAddVault}>Establish Vault</Button>
             </div>
          </Card>
        </div>
      )}

      <Card className="mt-20 bg-rust/5 p-12 rounded-[54px] border border-rust/10 flex gap-8 items-start shadow-inner">
        <Info size={40} className="text-rust shrink-0" />
        <div>
          <h4 className="text-xl font-black text-charcoal dark:text-stone mb-4 uppercase tracking-[0.2em]">Protocol Layer</h4>
          <p className="text-base text-charcoal/50 dark:text-stone/40 leading-relaxed font-medium">
            Spaces in Folio are logic containers. They don't require new bank accounts; they orchestrate movements across your connected financial ecosystem.
          </p>
        </div>
      </Card>

      {/* Quote Section */}
      <div className="mt-20 p-16 bg-white/5 dark:bg-[#151515] rounded-[64px] border border-white/5 flex flex-col items-center text-center">
        <Quote className="text-rust/20 mb-8" size={48} />
        <p className="text-2xl text-charcoal/50 dark:text-stone/30 italic font-black leading-tight max-w-[320px] mx-auto antialiased tracking-tight">
          "A budget is telling your money where to go instead of wondering where it went."
        </p>
        <p className="text-[10px] font-black text-rust uppercase tracking-[0.4em] mt-8">
          — John Maxwell
        </p>
      </div>
    </div>
  );
};

export default Vaults;