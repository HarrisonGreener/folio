
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Page } from './components/Motion';
import { UserData, AppScreen, Vault } from './types';
import { INITIAL_VAULTS, MOCK_EXTERNAL_ASSETS } from './constants';
import { Layout } from './components/Layout';
import Onboarding from './screens/Onboarding';
import Consent from './screens/Consent';
import Home from './screens/Home';
import Vaults from './screens/Vaults';
import VaultDetail from './screens/VaultDetail';
import Allocate from './screens/Allocate';
import Scope from './screens/Scope';
import Activity from './screens/Activity';
import Settings from './screens/Settings';
import Withdraw from './screens/Withdraw';
import Holdings from './screens/Holdings';
import Growth from './screens/Growth';
import MonthlySummary from './screens/MonthlySummary';
import Timeline from './screens/Timeline';
import ConnectionsScreen from './screens/Connections';
import Flow from './screens/Flow';

const INITIAL_DATA: UserData = {
  onboarded: false,
  ageConfirmed: false,
  employmentType: 'employed',
  monthlyIncome: 3000,
  monthlyExpenses: [],
  payFrequency: 'monthly',
  comfortLevel: 'medium',
  intention: 'both',
  vaults: INITIAL_VAULTS,
  externalAssets: [],
  allocation: {
    roundUpsEnabled: true,
    roundTo: 1,
    monthlyCap: 50,
    minBalanceThreshold: 100,
    incomeAllocationPercent: 10,
    splits: { 'v1': 50, 'v2': 50 }
  },
  isDarkMode: true
};

/** Populated profile used when a demo shortcut skips onboarding. */
const demoProfile = (prev: UserData): UserData => {
  const balances: Record<string, number> = { v0: 6000, v1: 1800, v2: 4200, v4: 1000, v3: 900 };
  const pick = (sym: string, value: number) => ({ ...MOCK_EXTERNAL_ASSETS.find(a => a.symbol === sym)!, value });
  return {
    ...prev,
    onboarded: true,
    ageConfirmed: true,
    vaults: prev.vaults.map(v => ({ ...v, balance: balances[v.id] ?? v.balance, available: balances[v.id] ?? v.available })),
    externalAssets: [pick('BTC', 600), pick('ETH', 300), pick('VWRL', 4200)],
    monthlyExpenses: [
      { id: 'h1', name: 'Housing (Rent/Mortgage)', amount: 1200, category: 'housing', isFixed: true },
      { id: 'b1', name: 'Essential Bills', amount: 250, category: 'utility', isFixed: true },
      { id: 's1', name: 'Subscriptions', amount: 80, category: 'subscription', isFixed: false },
    ],
  };
};

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>('onboarding');
  const [selectedVaultId, setSelectedVaultId] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [userData, setUserData] = useState<UserData>(INITIAL_DATA);
  const _unused = {
    onboarded: false,
    ageConfirmed: false,
    employmentType: 'employed',
    monthlyIncome: 3000,
    monthlyExpenses: [],
    payFrequency: 'monthly',
    comfortLevel: 'medium',
    intention: 'both',
    vaults: INITIAL_VAULTS,
    externalAssets: [],
    allocation: {
      roundUpsEnabled: true,
      roundTo: 1,
      monthlyCap: 50,
      minBalanceThreshold: 100,
      incomeAllocationPercent: 10,
      splits: { 'v1': 50, 'v2': 50 }
    },
    isDarkMode: true
  };
  void _unused;

  useEffect(() => {
    if (userData.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [userData.isDarkMode]);

  // ---- Demo shortcuts (see components/DemoShell.tsx) ----
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('folio:screen', { detail: { screen, vault: selectedVaultId } }));
    const scroller = document.getElementById('folio-scroll');
    if (scroller) scroller.scrollTop = 0; else window.scrollTo(0, 0);
  }, [screen, selectedVaultId, nonce]);

  useEffect(() => {
    const onJump = (e: Event) => {
      const { screen: target, vault } = (e as CustomEvent<{ screen: AppScreen | 'intro'; vault?: string }>).detail;
      if (target === 'intro') {
        setUserData(INITIAL_DATA);
        setShowTutorial(false);
        setSelectedVaultId(null);
        setScreen('onboarding');
        setNonce(n => n + 1);
        return;
      }
      setUserData(prev => (prev.onboarded ? prev : demoProfile(prev)));
      if (vault) setSelectedVaultId(vault);
      if (target === 'home') setShowTutorial(true);
      setScreen(target);
      setNonce(n => n + 1);
    };
    window.addEventListener('folio:jump', onJump);
    return () => window.removeEventListener('folio:jump', onJump);
  }, []);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  const addVault = (vault: Vault) => {
    setUserData(prev => ({
      ...prev,
      vaults: [...prev.vaults, vault]
    }));
  };

  const simulatePayday = () => {
    setUserData(prev => {
      const updatedVaults = prev.vaults.map(v => {
        if (v.id === 'v0') {
          return { ...v, balance: v.balance + prev.monthlyIncome, available: v.available + prev.monthlyIncome };
        }
        return v;
      });
      return { ...prev, vaults: updatedVaults, onboarded: true };
    });
    setShowTutorial(true);
  };

  const executeAllocation = () => {
    setUserData(prev => {
      const mainAccount = prev.vaults.find(v => v.id === 'v0');
      if (!mainAccount || mainAccount.balance < 1) return prev;
      const savingsAmount = prev.monthlyIncome * (prev.allocation.incomeAllocationPercent / 100);
      const updatedVaults = prev.vaults.map(v => {
        if (v.id === 'v0') {
          return { ...v, balance: v.balance - savingsAmount, available: v.available - savingsAmount };
        }
        const splitPercent = prev.allocation.splits[v.id] || 0;
        if (splitPercent > 0) {
          const allocation = savingsAmount * (splitPercent / 100);
          return { ...v, balance: v.balance + allocation, available: v.available + allocation };
        }
        return v;
      });
      return { ...prev, vaults: updatedVaults };
    });
    setShowTutorial(false);
  };

  const navigateToVault = (id: string) => {
    setSelectedVaultId(id);
    setScreen('vault-detail');
  };

  const renderScreen = () => {
    const activeVault = userData.vaults.find(v => v.id === selectedVaultId);

    switch (screen) {
      case 'onboarding':
        return <Onboarding onComplete={() => setScreen('consent')} updateUserData={updateUserData} userData={userData} />;
      case 'consent':
        return <Consent onConfirm={() => { simulatePayday(); setScreen('home'); }} userData={userData} />;
      case 'home':
        return <Home userData={userData} setScreen={setScreen} navigateToVault={navigateToVault} showTutorial={showTutorial} />;
      case 'vaults':
        return <Vaults userData={userData} onSelectVault={navigateToVault} onAddVault={addVault} />;
      case 'vault-detail':
        return activeVault ? <VaultDetail vault={activeVault} userData={userData} onBack={() => setScreen('home')} setScreen={setScreen} /> : null;
      case 'allocate':
        return <Allocate userData={userData} updateUserData={updateUserData} onBack={() => setScreen('home')} onExecute={executeAllocation} />;
      case 'scope':
        return <Scope userData={userData} onAddVault={addVault} setScreen={setScreen} />;
      case 'activity':
        return <Activity />;
      case 'timeline':
        return <Timeline userData={userData} onBack={() => setScreen('home')} />;
      case 'connections':
        return <ConnectionsScreen userData={userData} updateUserData={updateUserData} onBack={() => setScreen('settings')} />;
      case 'holdings':
        return <Holdings userData={userData} onBack={() => setScreen('home')} onManageConnections={() => setScreen('connections')} />;
      case 'flow':
        return <Flow userData={userData} onBack={() => setScreen('home')} updateUserData={updateUserData} />;
      case 'growth':
        return <Growth onBack={() => setScreen('vault-detail')} vault={activeVault} />;
      case 'settings':
        return <Settings userData={userData} updateUserData={updateUserData} setScreen={setScreen} />;
      default:
        return <Home userData={userData} setScreen={setScreen} navigateToVault={navigateToVault} />;
    }
  };

  const hideLayout = ['onboarding', 'consent', 'withdraw', 'monthly-summary'].includes(screen);

  return (
    <div className={userData.isDarkMode ? 'dark' : ''}>
      <Layout activeScreen={screen} setScreen={setScreen} hideNav={hideLayout}>
        <AnimatePresence mode="wait" initial={false}>
          <Page id={screen} key={`${screen}-${nonce}`}>
            {renderScreen()}
          </Page>
        </AnimatePresence>
      </Layout>
    </div>
  );
};

export default App;
