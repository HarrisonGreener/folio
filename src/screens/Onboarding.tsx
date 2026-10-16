
import React, { useState } from 'react';
import { UserData, EmploymentType, Intention, ExternalAsset, Vault, Expense } from '../types';
import { Button, Input, Label, SectionHeader, Logo, Badge, Card } from '../components/UI';
import { coinLogo } from '../components/CoinMark';
import { Target, ArrowRight, Layers, Zap, CreditCard, Home, Bitcoin, Wallet } from 'lucide-react';
import { MOCK_EXTERNAL_ASSETS } from '../constants';

interface Props {
  onComplete: () => void;
  updateUserData: (data: Partial<UserData>) => void;
  userData: UserData;
}

const CryptoLogos = {
  BTC: coinLogo('BTC'),
  ETH: coinLogo('ETH'),
  SOL: coinLogo('SOL'),
};

const COIN_LIST = [
  { id: 'BTC', name: 'Bitcoin', logo: CryptoLogos.BTC },
  { id: 'ETH', name: 'Ethereum', logo: CryptoLogos.ETH },
  { id: 'SOL', name: 'Solana', logo: CryptoLogos.SOL }
];

const Onboarding: React.FC<Props> = ({ onComplete, updateUserData, userData }) => {
  const [step, setStep] = useState(0);
  const [vaultBalances, setVaultBalances] = useState<Record<string, number>>({
    'v0': 3000,
    'v2': 0,
    'v4': 0,
  });
  const [cryptoBalances, setCryptoBalances] = useState<Record<string, number>>({
    'BTC': 0,
    'ETH': 0,
    'SOL': 0
  });
  
  const [commitments, setCommitments] = useState<Record<string, number>>({
    'housing': 1200,
    'bills': 250,
    'subscriptions': 80
  });

  const finish = () => {
    // Total crypto balance calculation - Fix line 69
    const totalCrypto = (Object.values(cryptoBalances) as number[]).reduce((a: number, b: number) => a + b, 0);

    // Generate vaults with entered balances
    const finalVaults = userData.vaults.map(v => {
      let balance = vaultBalances[v.id] || 0;
      if (v.id === 'v3') balance = totalCrypto;
      return {
        ...v,
        balance: balance,
        available: balance
      };
    });

    // Generate external assets based on user inputs
    const finalAssets: ExternalAsset[] = [];
    
    // Seed specific coins entered - Fix lines 87-92
    (Object.entries(cryptoBalances) as [string, number][]).forEach(([symbol, balance]) => {
      if (balance > 0) {
        const mockBase = MOCK_EXTERNAL_ASSETS.find(a => a.symbol === symbol);
        if (mockBase) {
          finalAssets.push({
            ...mockBase,
            value: balance
          });
        }
      }
    });

    // Seed ISA assets if ISA vault has balance
    const isaBalance = vaultBalances['v2'] || 0;
    if (isaBalance > 0) {
      finalAssets.push({
        ...MOCK_EXTERNAL_ASSETS[3], // Global Equity
        value: isaBalance
      });
    }

    const finalExpenses: Expense[] = [
      { id: 'h1', name: 'Housing (Rent/Mortgage)', amount: commitments.housing, category: 'housing', isFixed: true },
      { id: 'b1', name: 'Essential Bills', amount: commitments.bills, category: 'utility', isFixed: true },
      { id: 's1', name: 'Subscriptions', amount: commitments.subscriptions, category: 'subscription', isFixed: false },
    ];
    
    updateUserData({ 
      onboarded: true, 
      externalAssets: finalAssets,
      vaults: finalVaults,
      monthlyExpenses: finalExpenses
    });
    onComplete();
  };

  const updateVaultBalance = (id: string, val: string) => {
    const num = val === '' ? 0 : Number(val);
    setVaultBalances(prev => ({ ...prev, [id]: num }));
  };

  const updateCryptoBalance = (symbol: string, val: string) => {
    const num = val === '' ? 0 : Number(val);
    setCryptoBalances(prev => ({ ...prev, [symbol]: num }));
  };

  const updateCommitment = (cat: string, val: string) => {
    const num = val === '' ? 0 : Number(val);
    setCommitments(prev => ({ ...prev, [cat]: num }));
  };

  const TOTAL_STEPS = 4;

  return (
    <div className="min-h-screen p-8 max-w-md mx-auto flex flex-col bg-stone dark:bg-[#0A0A0A] overflow-x-hidden transition-colors duration-500">
      <div className="flex-1 flex flex-col justify-center py-10">
        {step === 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
            <Logo className="mb-14" large />
            <SectionHeader 
              title="A clear lens for your money." 
              subtitle="Folio doesn't hold your cash. We wrap your existing banks in a layer of clarity and intent." 
            />
            
            <div className="space-y-4 mt-8">
              <div className="flex items-center gap-6 p-2">
                <div className="w-14 h-14 rounded-2xl bg-charcoal/5 dark:bg-[#141414] flex items-center justify-center shrink-0 border border-charcoal/5 dark:border-white/5 shadow-sm">
                  <Layers className="text-rust" size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-charcoal dark:text-stone text-lg antialiased">Unified View</h4>
                  <p className="text-sm text-charcoal/40 dark:text-stone/30 mt-1 antialiased">See your Savings, ISAs, and Bonds in one calm place.</p>
                </div>
              </div>
              <div className="flex items-center gap-6 p-2">
                <div className="w-14 h-14 rounded-2xl bg-charcoal/5 dark:bg-[#141414] flex items-center justify-center shrink-0 border border-charcoal/5 dark:border-white/5 shadow-sm">
                  <Target className="text-rust" size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-charcoal dark:text-stone text-lg antialiased">Smart Allocations</h4>
                  <p className="text-sm text-charcoal/40 dark:text-stone/30 mt-1 antialiased">Auto-split your income into Vaults the second you're paid.</p>
                </div>
              </div>
            </div>
            
            <Button fullWidth onClick={() => setStep(1)} className="mt-16 group h-20 text-lg rounded-[32px] shadow-2xl shadow-rust/30">
              Start Simulation
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="text-center text-[10px] text-charcoal/20 dark:text-stone/20 uppercase tracking-[0.2em] mt-8 antialiased font-black">Vision Prototype • No Live Accounts</p>
          </div>
        )}

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-10 duration-500">
            <Badge variant="rust" className="mb-6">STEP 1 OF {TOTAL_STEPS}</Badge>
            <SectionHeader 
              title="Baseline flow." 
              subtitle="What is your starting capital? This represents the money currently in your primary spending account." 
            />
            
            <div className="space-y-12">
              <div>
                <Label>Main Account Balance</Label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-rust text-3xl font-black">£</span>
                  <Input 
                    type="number" 
                    className="pl-14 text-4xl font-black h-22 !bg-[#151515] !border-none !text-white rounded-[32px] shadow-inner" 
                    value={vaultBalances['v0']}
                    onChange={(e) => updateVaultBalance('v0', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label>Monthly Income</Label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 text-2xl font-black">£</span>
                  <Input 
                    type="number" 
                    className="pl-12 text-3xl font-black h-18 !bg-[#151515] !border-none !text-white rounded-[28px] shadow-inner" 
                    value={userData.monthlyIncome}
                    onChange={(e) => updateUserData({ monthlyIncome: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <Label>Verification</Label>
                <button 
                  onClick={() => updateUserData({ ageConfirmed: !userData.ageConfirmed })}
                  className={`w-full flex items-center justify-between p-7 rounded-[32px] border-2 transition-all duration-300 ${userData.ageConfirmed ? 'border-rust bg-rust/10 shadow-lg' : 'border-white/5 bg-[#151515]'}`}
                >
                  <span className="text-base font-black text-white antialiased uppercase tracking-widest">I am 18 or older</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${userData.ageConfirmed ? 'bg-rust shadow-glow' : 'bg-white/10'}`}>
                    {userData.ageConfirmed && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                  </div>
                </button>
              </div>
            </div>

            <Button fullWidth onClick={() => setStep(2)} className="mt-16 h-20 text-lg rounded-[32px] shadow-2xl shadow-rust/30" disabled={!userData.ageConfirmed || !userData.monthlyIncome}>
              NEXT STEP
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-10 duration-500">
            <Badge variant="rust" className="mb-6">STEP 2 OF {TOTAL_STEPS}</Badge>
            <SectionHeader 
              title="Vault Starting Capital." 
              subtitle="Do you already have funds in your existing ISAs or other accounts? Enter them here." 
            />
            
            <div className="space-y-10 pb-4">
              {userData.vaults.filter(v => ['v2', 'v4'].includes(v.id)).map(v => (
                <div key={v.id}>
                  <Label>{v.name.toUpperCase()} BALANCE</Label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-rust text-xl font-black">£</span>
                    <Input 
                      type="number" 
                      placeholder="0"
                      className="pl-12 h-18 text-2xl !bg-[#151515] !border-white/[0.05] !text-white rounded-[28px] shadow-inner"
                      value={vaultBalances[v.id] || ''}
                      onChange={(e) => updateVaultBalance(v.id, e.target.value)}
                    />
                  </div>
                </div>
              ))}

              <div className="space-y-4">
                <Label>CRYPTO ASSETS</Label>
                <div className="space-y-4">
                  {COIN_LIST.map((coin) => (
                    <div key={coin.id} className="flex items-center gap-4 bg-[#151515] p-5 rounded-[28px] border border-white/[0.05]">
                      <div className="w-10 h-10 flex items-center justify-center shrink-0">
                        <coin.logo />
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1">{coin.name}</span>
                        <div className="relative">
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-rust text-lg font-black">£</span>
                          <input 
                            type="number" 
                            className="w-full pl-6 bg-transparent border-none text-xl font-black text-white focus:outline-none" 
                            placeholder="0"
                            value={cryptoBalances[coin.id] || ''}
                            onChange={(e) => updateCryptoBalance(coin.id, e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Button fullWidth onClick={() => setStep(3)} className="mt-16 h-20 text-lg rounded-[32px] shadow-2xl shadow-rust/40">
              NEXT STEP
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-10 duration-500">
            <Badge variant="rust" className="mb-6">STEP 3 OF {TOTAL_STEPS}</Badge>
            <SectionHeader 
              title="Commitments." 
              subtitle="List your recurring payments to visualize your true monthly surplus." 
            />
            
            <div className="space-y-6">
              <div>
                <Label>RENT / MORTGAGE</Label>
                <div className="relative flex items-center">
                  <Home className="absolute left-6 text-rust" size={20} />
                  <Input 
                    type="number" 
                    className="pl-14 h-18 text-xl !bg-[#151515] !border-none !text-white rounded-[28px] shadow-inner" 
                    value={commitments.housing} 
                    onChange={e => updateCommitment('housing', e.target.value)} 
                  />
                </div>
              </div>
              <div>
                <Label>BILLS & UTILITIES</Label>
                <div className="relative flex items-center">
                  <Zap className="absolute left-6 text-rust" size={20} />
                  <Input 
                    type="number" 
                    className="pl-14 h-18 text-xl !bg-[#151515] !border-none !text-white rounded-[28px] shadow-inner" 
                    value={commitments.bills} 
                    onChange={e => updateCommitment('bills', e.target.value)} 
                  />
                </div>
              </div>
              <div>
                <Label>SUBSCRIPTIONS</Label>
                <div className="relative flex items-center">
                  <CreditCard className="absolute left-6 text-rust" size={20} />
                  <Input 
                    type="number" 
                    className="pl-14 h-18 text-xl !bg-[#151515] !border-none !text-white rounded-[28px] shadow-inner" 
                    value={commitments.subscriptions} 
                    onChange={e => updateCommitment('subscriptions', e.target.value)} 
                  />
                </div>
              </div>
            </div>

            <Button fullWidth onClick={() => setStep(4)} className="mt-16 h-20 text-lg rounded-[32px] shadow-2xl shadow-rust/30">
              NEXT STEP
            </Button>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-10 duration-500">
            <Badge variant="rust" className="mb-6">STEP 4 OF {TOTAL_STEPS}</Badge>
            <SectionHeader 
              title="The final lens." 
              subtitle="What is your primary financial intention? This calibrates your growth engine." 
            />
            
            <div className="space-y-12">
              <div className="grid grid-cols-1 gap-4">
                <Label>Employment Profile</Label>
                <div className="grid grid-cols-2 gap-3">
                  {(['employed', 'self-employed', 'student', 'other'] as EmploymentType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => updateUserData({ employmentType: t })}
                      className={`p-6 rounded-[28px] border-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                        userData.employmentType === t 
                        ? 'border-rust bg-rust/10 text-rust shadow-xl' 
                        : 'border-white/5 bg-[#151515] text-white/30 hover:border-rust/30'
                      }`}
                    >
                      {t.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Main Focus</Label>
                <div className="flex gap-4">
                  {(['saving', 'investing', 'both'] as Intention[]).map((i) => (
                    <button
                      key={i}
                      onClick={() => updateUserData({ intention: i })}
                      className={`flex-1 p-6 rounded-[28px] border-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                        userData.intention === i 
                        ? 'border-rust bg-rust/10 text-rust shadow-xl' 
                        : 'border-white/5 bg-[#151515] text-white/30 hover:border-rust/30'
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button fullWidth onClick={finish} className="mt-20 h-22 text-xl shadow-2xl shadow-rust/40 rounded-[36px] font-black tracking-widest">
              ESTABLISH FOLIO
            </Button>
          </div>
        )}
      </div>
      
      <div className="flex justify-center gap-3 mb-8">
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-1000 ${step === i ? 'w-14 bg-rust' : 'w-2.5 bg-white/10'}`} />
        ))}
      </div>
    </div>
  );
};

export default Onboarding;
