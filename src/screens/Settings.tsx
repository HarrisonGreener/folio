
import React from 'react';
import { UserData, AppScreen } from '../types';
import { SectionHeader, Card, Label, Button } from '../components/UI';
import { Moon, Sun, Info, Eye, LogOut, ChevronRight } from 'lucide-react';

interface Props {
  userData: UserData;
  updateUserData: (d: Partial<UserData>) => void;
  setScreen: (s: AppScreen) => void;
}

const Settings: React.FC<Props> = ({ userData, updateUserData, setScreen }) => {
  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <SectionHeader 
        title="Interface" 
        subtitle="Manage your experience and data preferences." 
      />

      <div className="space-y-10">
        <div>
          <Label>Preferences</Label>
          <Card 
            className="flex items-center justify-between py-8 cursor-pointer border-none shadow-xl dark:shadow-2xl"
            onClick={() => updateUserData({ isDarkMode: !userData.isDarkMode })}
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-charcoal/5 dark:bg-charcoal-lighter rounded-[24px] flex items-center justify-center text-charcoal dark:text-stone shadow-inner">
                {userData.isDarkMode ? <Sun size={28} /> : <Moon size={28} />}
              </div>
              <div>
                <p className="text-xl font-black tracking-tight text-charcoal dark:text-stone">Dark Mode</p>
                <p className="text-xs font-bold text-charcoal/40 dark:text-stone/40 uppercase tracking-widest">{userData.isDarkMode ? 'Currently On' : 'Currently Off'}</p>
              </div>
            </div>
            <div className={`w-16 h-10 rounded-full p-2 transition-colors duration-500 flex items-center ${userData.isDarkMode ? 'bg-rust shadow-lg shadow-rust/40' : 'bg-charcoal/10'}`}>
              <div className={`w-6 h-6 rounded-full bg-white transition-transform duration-500 transform ${userData.isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </Card>
        </div>

        <div>
          <Label>Prototype Setup</Label>
          <div className="space-y-4">
            <Card className="flex items-center justify-between py-8 group hover:bg-charcoal/5 dark:hover:bg-white/5 transition-colors" onClick={() => setScreen('onboarding')}>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-charcoal/5 dark:bg-charcoal-lighter rounded-[24px] flex items-center justify-center text-charcoal dark:text-stone">
                  <Info size={28} />
                </div>
                <div>
                    <span className="text-xl font-black tracking-tight text-charcoal dark:text-stone">Persona Settings</span>
                    <p className="text-xs font-bold text-charcoal/40 dark:text-stone/40 uppercase tracking-widest mt-1">Simulated Profile</p>
                </div>
              </div>
              <ChevronRight size={24} className="text-rust group-hover:translate-x-1 transition-transform" strokeWidth={4} />
            </Card>

            <Card className="flex items-center justify-between py-8 group hover:bg-charcoal/5 dark:hover:bg-white/5 transition-colors" onClick={() => setScreen('holdings')}>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-charcoal/5 dark:bg-charcoal-lighter rounded-[24px] flex items-center justify-center text-charcoal dark:text-stone">
                  <Eye size={28} />
                </div>
                <div>
                    <span className="text-xl font-black tracking-tight text-charcoal dark:text-stone">Transparency Hub</span>
                    <p className="text-xs font-bold text-charcoal/40 dark:text-stone/40 uppercase tracking-widest mt-1">Provider Assumptions</p>
                </div>
              </div>
              <ChevronRight size={24} className="text-rust group-hover:translate-x-1 transition-transform" strokeWidth={4} />
            </Card>
          </div>
        </div>

        <div className="p-12 bg-charcoal/5 dark:bg-charcoal-card rounded-[50px] border border-charcoal/10 dark:border-white/5 shadow-2xl">
          <h4 className="text-[10px] font-black text-charcoal/30 dark:text-stone/30 uppercase tracking-[0.4em] mb-6">Prototype Session</h4>
          <p className="text-base text-charcoal/60 dark:text-stone/40 leading-relaxed mb-10 font-medium">
            This vision prototype runs entirely in your local session. All financial calculations and projections are illustrative simulations.
          </p>
          <Button variant="secondary" fullWidth className="text-red-500 !bg-red-500/5 hover:!bg-red-500/10 border-red-500/10 h-16">
            <LogOut size={22} strokeWidth={3} /> Clear Experience
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
