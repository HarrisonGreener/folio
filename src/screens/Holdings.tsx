
import React from 'react';
import { UserData, ExternalAsset, Vault } from '../types';
import { SectionHeader, Card, Badge, Button, Label } from '../components/UI';
import { ChevronLeft, Info, CheckCircle2, ExternalLink, ShieldAlert, TrendingUp, TrendingDown, ArrowUpRight, Shield, Landmark, Wallet, Vault as VaultIcon } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface Props {
  userData: UserData;
  onBack: () => void;
  onManageConnections: () => void;
}

const SmallSparkline: React.FC<{ data: any[], color: string }> = ({ data, color }) => (
  <div className="h-4 w-16 mx-4 opacity-80">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          strokeWidth={2} 
          dot={false} 
          isAnimationActive={true}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const Holdings: React.FC<Props> = ({ userData, onBack, onManageConnections }) => {
  const totalVaults = userData.vaults.reduce((a, b) => a + b.balance, 0);
  const totalExternal = userData.externalAssets.reduce((a, b) => a + b.value, 0);

  const getVaultIcon = (type: string, assetClass?: string) => {
    if (assetClass === 'Crypto') return <Wallet size={20} />;
    switch(type) {
      case 'Savings': return <Landmark size={20} />;
      case 'ISA': return <TrendingUp size={20} />;
      case 'Premium Bonds': return <Shield size={20} />;
      default: return <VaultIcon size={20} />;
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 pb-32">
      <button onClick={onBack} className="mb-8 flex items-center gap-2 text-charcoal/40 dark:text-stone/40 hover:text-rust transition-colors group">
        <ChevronLeft size={22} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-black uppercase tracking-widest">Dashboard</span>
      </button>

      <SectionHeader 
        title="Portfolio Ledger" 
        subtitle="A full breakdown of capital location, liquidity status, and external performance." 
      />

      <div className="grid grid-cols-2 gap-5 mb-16">
        <Card className="bg-charcoal dark:bg-charcoal-lighter text-stone border-none p-8 flex flex-col justify-between h-44 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full transition-transform group-hover:scale-110"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Internal Vaults</span>
          <p data-fit className="text-4xl font-black tracking-tighter">£{totalVaults.toLocaleString()}</p>
        </Card>
        <Card className="bg-charcoal dark:bg-charcoal-lighter text-stone border-none p-8 flex flex-col justify-between h-44 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rust/10 rounded-bl-full transition-transform group-hover:scale-110"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rust opacity-60">External Links</span>
          <p data-fit className="text-4xl font-black text-rust tracking-tighter">£{totalExternal.toLocaleString()}</p>
        </Card>
      </div>

      {/* Internal Vault Holdings Section */}
      <div className="flex items-center justify-between mb-8 px-2">
        <h4 className="text-[11px] font-black text-charcoal/40 dark:text-stone/30 uppercase tracking-[0.4em]">Vault Holdings</h4>
      </div>

      <div className="space-y-4 mb-16">
        {userData.vaults.filter(v => v.balance > 0).map((vault) => (
          <Card 
            key={vault.id} 
            className="flex justify-between items-center py-8 bg-charcoal dark:bg-[#141414] border-charcoal/10 dark:border-white/[0.04] shadow-[0_12px_48px_rgba(0,0,0,0.4)] rounded-[40px] px-8"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-charcoal-lighter dark:bg-white/[0.03] rounded-2xl flex items-center justify-center text-rust border border-white/5 shadow-inner">
                {getVaultIcon(vault.type, vault.assetClass)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="font-black text-lg text-stone tracking-tight leading-none">{vault.name}</h5>
                </div>
                <div className="flex gap-2 mt-1.5">
                  <Badge variant={vault.isInvested ? 'rust' : 'default'} className="!text-[8px] !px-2 !py-0.5">{vault.type}</Badge>
                  <span className="text-[9px] font-black uppercase text-stone/20 tracking-widest self-center">Internal</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-2xl font-black text-stone tracking-tighter">£{vault.balance.toLocaleString()}</p>
              <p className="text-[9px] font-black text-stone/30 uppercase tracking-[0.2em] mt-1">AVAILABLE</p>
            </div>
          </Card>
        ))}
      </div>

      {/* External Portfolio Section */}
      <div className="flex items-center justify-between mb-8 px-2">
        <h4 className="text-[11px] font-black text-charcoal/40 dark:text-stone/30 uppercase tracking-[0.4em]">External Portfolio</h4>
        <button onClick={onManageConnections} className="text-[11px] font-black text-rust uppercase tracking-[0.2em] active:opacity-50">Manage</button>
      </div>

      <div className="space-y-4 mb-16">
        {userData.externalAssets.length > 0 ? (
          userData.externalAssets.map((asset) => (
            <Card 
              key={asset.id} 
              className="flex justify-between items-center py-8 bg-charcoal dark:bg-[#141414] border-charcoal/10 dark:border-white/[0.04] shadow-[0_12px_48px_rgba(0,0,0,0.4)] rounded-[40px] px-8"
              onClick={onManageConnections}
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-charcoal-lighter dark:bg-white/[0.03] rounded-2xl flex items-center justify-center text-stone/20 border border-white/5 shadow-inner">
                  <ArrowUpRight size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-black text-lg text-stone tracking-tight leading-none">{asset.name}</h5>
                    {asset.symbol && <span className="text-[10px] font-black text-stone/20 uppercase tracking-widest mt-0.5">{asset.symbol}</span>}
                  </div>
                  <p className="text-[9px] font-black text-rust uppercase tracking-widest mt-1">External Connection</p>
                </div>
              </div>
              
              <div className="flex items-center">
                {asset.history && (
                  <SmallSparkline 
                    data={asset.history} 
                    color={(asset.change24h || 0) >= 0 ? '#22c55e' : '#ef4444'} 
                  />
                )}
                
                <div className="text-right">
                  <p className="text-2xl font-black text-stone tracking-tighter">£{asset.value.toLocaleString()}</p>
                  <div className="flex items-center justify-end gap-2 mt-1.5">
                    {asset.change24h !== undefined && (
                      <div className={`flex items-center text-[9px] font-black ${asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {asset.change24h >= 0 ? <TrendingUp size={10} className="mr-0.5" /> : <TrendingDown size={10} className="mr-0.5" />}
                        {Math.abs(asset.change24h)}%
                      </div>
                    )}
                    <div className={`w-1.5 h-1.5 rounded-full ${asset.change24h && asset.change24h >= 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="py-20 border-4 border-dashed border-charcoal/5 dark:border-white/5 rounded-[48px] flex flex-col items-center justify-center text-center px-10">
            <p className="text-charcoal/40 dark:text-stone/20 font-black uppercase tracking-widest text-[11px] mb-2">No External Assets Linked</p>
            <p className="text-sm text-charcoal/30 dark:text-stone/10 font-medium max-w-[240px]">Links are established in onboarding or via the Connections hub.</p>
          </div>
        )}
      </div>

      {/* Transparency Warning */}
      <div className="p-14 bg-charcoal/5 dark:bg-[#1A1A1A] rounded-[54px] border border-charcoal/10 dark:border-white/[0.03] flex gap-10 items-start shadow-inner">
        <div className="w-16 h-16 bg-rust/5 rounded-2xl flex items-center justify-center text-rust shrink-0 mt-1 border border-rust/10">
          <Shield size={32} />
        </div>
        <div>
          <h4 className="text-[11px] font-black text-charcoal/40 dark:text-stone/30 uppercase tracking-[0.4em] mb-4 leading-none">Transparency Warning</h4>
          <p className="text-sm text-charcoal/60 dark:text-stone/40 leading-relaxed font-semibold antialiased opacity-80">
            Folio visualises these assets for holistic context. Internal holdings are 100% secure. External values are synced via read-only APIs and may be delayed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Holdings;
