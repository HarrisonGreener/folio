
import React from 'react';
import { Home, History, Zap, Settings, Vault } from 'lucide-react';
import { AppScreen } from '../types';
import { Logo } from './UI';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  activeScreen: AppScreen;
  setScreen: (screen: AppScreen) => void;
  hideNav?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeScreen, setScreen, hideNav = false }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'vaults', label: 'Vaults', icon: Vault },
    { id: 'scope', label: 'Scope', icon: Zap },
    { id: 'timeline', label: 'Timeline', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (hideNav) return <main className="min-h-screen bg-stone dark:bg-charcoal overflow-x-hidden transition-colors duration-500">{children}</main>;

  return (
    <div className="min-h-screen bg-stone dark:bg-charcoal flex flex-col max-w-md mx-auto relative overflow-hidden text-charcoal dark:text-stone transition-colors duration-500">
      <header className="px-8 pt-12 pb-6 flex justify-between items-center">
        <Logo />
        <button 
          onClick={() => setScreen('settings')}
          aria-label="Settings"
          className="w-14 h-14 bg-charcoal/5 dark:bg-charcoal-lighter rounded-[24px] flex items-center justify-center border border-charcoal/10 dark:border-white/10 shadow-sm"
        >
          <div className="w-3 h-3 bg-rust rounded-full animate-pulse shadow-[0_0_16px_rgba(179,89,59,0.8)]"></div>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-48">
        <div className="p-8 pt-4">
          {children}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-stone/95 dark:bg-charcoal/95 backdrop-blur-3xl border-t border-charcoal/5 dark:border-white/[0.05] px-8 py-10 flex justify-between items-center z-50 rounded-t-[54px] shadow-[0_-12px_48px_rgba(0,0,0,0.06)] dark:shadow-[0_-12px_64px_rgba(0,0,0,0.5)] transition-all duration-500">
        {navItems.map((item) => {
          const isActive = activeScreen === item.id || (item.id === 'vaults' && activeScreen === 'vault-detail');
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setScreen(item.id as AppScreen)}
              className={`flex flex-col items-center gap-3 transition-all duration-300 ${
                isActive ? 'text-rust scale-105' : 'text-charcoal/30 dark:text-stone/30 hover:text-rust/60'
              }`}
            >
              <span className="relative flex items-center justify-center w-14 h-14 -my-3">
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-[20px] bg-rust/10 dark:bg-rust/15 border border-rust/20"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                <Icon size={28} strokeWidth={isActive ? 3 : 2.5} className="relative" />
              </span>
              <span className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-500 ease-silk ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
