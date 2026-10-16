
import React, { useState } from 'react';
import { UserData, ExternalAsset } from '../types';
import { SectionHeader, Card, Button, Label, Badge, Input } from '../components/UI';
import { ChevronLeft, Plus, Link2, ExternalLink, ShieldCheck, TrendingUp, AlertCircle, Loader2, Wallet, X, Pencil, Save } from 'lucide-react';

interface Props {
  userData: UserData;
  updateUserData: (d: Partial<UserData>) => void;
  onBack: () => void;
}

const ConnectionsScreen: React.FC<Props> = ({ userData, updateUserData, onBack }) => {
  const [linking, setLinking] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [address, setAddress] = useState('');

  const providers = [
    { name: 'Browser Wallet', symbol: 'ETH', type: 'Crypto', icon: Wallet, color: 'text-orange-500' },
    { name: 'Hardware Wallet', symbol: 'BTC', type: 'Crypto', icon: ShieldCheck, color: 'text-blue-500' },
    { name: 'Crypto Exchange', symbol: 'VAR', type: 'Crypto', icon: Link2, color: 'text-blue-600' },
    { name: 'Index Fund Platform', symbol: 'ISA', type: 'Equity', icon: TrendingUp, color: 'text-red-600' },
    { name: 'Manual Asset', symbol: '', type: 'Manual', icon: Plus, color: 'text-charcoal/40' },
  ];

  const handleOpenLink = (provider: any) => {
    setSelectedProvider(provider);
    if (provider.type === 'Crypto') {
      setShowModal(true);
    } else {
      connectProvider(provider.name);
    }
  };

  const connectProvider = (name: string) => {
    setLinking(name);
    setTimeout(() => {
      setLinking(null);
      setShowModal(false);
      setAddress('');
      
      // In a prototype, we add a mock asset based on selection
      const provider = providers.find(p => p.name === name);
      if (provider) {
        const newAsset: ExternalAsset = {
          id: `ext-${Date.now()}`,
          name: provider.name,
          symbol: provider.symbol,
          provider: provider.name,
          type: provider.type as any,
          value: 0,
          volatility: 'medium',
          change24h: 0,
          history: Array.from({ length: 10 }).map((_, i) => ({ date: `${i}`, value: 100 + Math.random() * 20 }))
        };
        updateUserData({ externalAssets: [...userData.externalAssets, newAsset] });
      }
    }, 1500);
  };

  const startEdit = (asset: ExternalAsset) => {
    setEditingId(asset.id);
    setEditValue(asset.value.toString());
  };

  const saveEdit = () => {
    if (editingId === null) return;
    const updated = userData.externalAssets.map(a => 
      a.id === editingId ? { ...a, value: Number(editValue) } : a
    );
    updateUserData({ externalAssets: updated });
    setEditingId(null);
  };

  const removeAsset = (id: string) => {
    updateUserData({ externalAssets: userData.externalAssets.filter(a => a.id !== id) });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 relative">
      <button onClick={onBack} className="mb-6 flex items-center gap-1 text-charcoal/40 dark:text-stone/30 hover:text-rust transition-colors group">
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-black uppercase tracking-widest">Settings</span>
      </button>

      <SectionHeader 
        title="Connections" 
        subtitle="Manage your read-only visibility links. Adjust your holdings manually if sync is offline." 
      />

      <Card className="mb-10 bg-rust/5 border-rust/20 p-8 flex gap-5 items-start rounded-[40px]">
        <ShieldCheck className="text-rust shrink-0 mt-1" size={24} />
        <div>
          <h4 className="text-sm font-black uppercase tracking-widest mb-1">Safety First</h4>
          <p className="text-xs text-charcoal/60 dark:text-stone/40 leading-relaxed font-medium">
            Folio never touches your keys. We only visualize public data or user-defined values to build your holistic wealth map.
          </p>
        </div>
      </Card>

      <div className="flex items-center gap-3 mb-6 px-2">
        <h4 className="text-[11px] font-black text-charcoal/30 dark:text-stone/30 uppercase tracking-[0.4em]">Active Connections</h4>
      </div>

      <div className="space-y-4 mb-12">
        {userData.externalAssets.length > 0 ? (
          userData.externalAssets.map((asset) => (
            <Card key={asset.id} className="flex justify-between items-center py-8 px-8 dark:bg-charcoal-lighter border-white/[0.04]">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-charcoal/5 dark:bg-charcoal rounded-2xl flex items-center justify-center text-rust border border-white/5">
                  <ExternalLink size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-black text-lg tracking-tight">{asset.name}</h5>
                    {asset.symbol && <span className="text-[10px] font-black text-charcoal/40 dark:text-stone/40 mt-0.5">{asset.symbol}</span>}
                  </div>
                  <Badge variant="default" className="mt-1">{asset.provider}</Badge>
                </div>
              </div>
              
              <div className="text-right">
                {editingId === asset.id ? (
                  <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-2">
                    <Input 
                      type="number" 
                      className="h-10 w-24 text-sm px-3 bg-charcoal" 
                      value={editValue} 
                      onChange={e => setEditValue(e.target.value)}
                    />
                    <button onClick={saveEdit} className="text-rust hover:scale-110 transition-transform"><Save size={20} /></button>
                  </div>
                ) : (
                  <div className="group flex items-center gap-4">
                    <div>
                      <p className="text-2xl font-black tracking-tighter">£{asset.value.toLocaleString()}</p>
                      <p className={`text-[9px] font-black uppercase tracking-widest ${asset.volatility === 'high' ? 'text-red-500' : 'text-green-500'}`}>
                        {asset.volatility} volatility
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(asset)} className="text-rust/40 hover:text-rust"><Pencil size={16} /></button>
                      <button onClick={() => removeAsset(asset.id)} className="text-red-500/40 hover:text-red-500"><X size={16} /></button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))
        ) : (
          <div className="py-12 text-center text-charcoal/40 dark:text-stone/30 font-bold italic border-2 border-dashed border-charcoal/5 dark:border-white/5 rounded-[40px]">
            No external assets yet. Add one below.
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 mb-6 px-2">
        <h4 className="text-[11px] font-black text-charcoal/30 dark:text-stone/30 uppercase tracking-[0.4em]">Establish Connection</h4>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-12">
        {providers.map((p, i) => (
          <Card 
            key={i} 
            onClick={() => handleOpenLink(p)}
            className="flex flex-col items-center justify-center text-center p-8 hover:border-rust/40 transition-all cursor-pointer group rounded-[36px]"
          >
            {linking === p.name ? (
              <Loader2 className="text-rust animate-spin mb-4" size={32} />
            ) : (
              <p.icon className={`${p.color} opacity-40 group-hover:opacity-100 transition-all mb-4`} size={32} />
            )}
            <h5 className="font-black text-sm mb-1 tracking-tight">{p.name}</h5>
            <span className="text-[9px] font-black text-charcoal/30 dark:text-stone/30 uppercase tracking-widest">{p.type}</span>
          </Card>
        ))}
      </div>

      {/* Modal for Crypto Address Integration */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-charcoal/60 backdrop-blur-md animate-in fade-in duration-300">
          <Card className="w-full max-w-sm relative overflow-hidden p-10 border-none shadow-2xl bg-stone dark:bg-charcoal-lighter rounded-[48px]">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-8 right-8 text-charcoal/40 dark:text-stone/40 hover:text-rust"
            >
              <X size={28} />
            </button>
            
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-rust/10 rounded-[32px] flex items-center justify-center text-rust mx-auto mb-6 border border-rust/10 shadow-inner">
                <selectedProvider.icon size={40} />
              </div>
              <h3 className="text-2xl font-black tracking-tighter mb-2">Connect {selectedProvider.name}</h3>
              <p className="text-sm text-charcoal/60 dark:text-stone/40 font-medium">Enter your public wallet address to sync balance and growth.</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label>Public Wallet Address</Label>
                <Input 
                  placeholder="0x... or btc..." 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="text-sm h-14"
                />
              </div>

              <Button 
                fullWidth 
                onClick={() => connectProvider(selectedProvider.name)}
                disabled={!address || linking !== null}
              >
                {linking ? <Loader2 size={18} className="animate-spin" /> : <Link2 size={18} />}
                {linking ? 'Establishing...' : 'Link Read-Only'}
              </Button>
              
              <p className="text-[10px] text-center font-black uppercase tracking-widest opacity-40 mt-4">
                Folio only syncs balance and history.
              </p>
            </div>
          </Card>
        </div>
      )}

      <div className="p-10 bg-charcoal/5 dark:bg-charcoal-card rounded-[40px] border border-charcoal/10 dark:border-white/5 flex gap-5 items-start">
        <AlertCircle size={28} className="text-rust shrink-0 mt-0.5" />
        <p className="text-xs text-charcoal/40 dark:text-stone/40 leading-relaxed font-bold uppercase tracking-wider">
          Links refresh every 24 hours. Volatility levels are based on historical 30-day standard deviation.
        </p>
      </div>
    </div>
  );
};

export default ConnectionsScreen;
