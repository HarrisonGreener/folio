import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { LogoMark } from './UI';

/**
 * Desktop presentation shell, same pattern as Stack: the app runs inside a
 * phone-sized frame on a quiet stage, with demo shortcuts beside it.
 * On real phones (≤560px) the frame drops away and the app runs full screen.
 */

type Target = { label: string; screen: string; vault?: string };

const SHORTCUTS: Target[] = [
  { label: 'Intro', screen: 'intro' },
  { label: 'Connect your bank', screen: 'consent' },
  { label: 'Home', screen: 'home' },
  { label: 'Cash flow', screen: 'flow' },
  { label: 'Allocations', screen: 'allocate' },
  { label: 'Vault Spaces', screen: 'vaults' },
  { label: 'Global Equity ISA', screen: 'vault-detail', vault: 'v2' },
  { label: 'Crypto Vault', screen: 'vault-detail', vault: 'v3' },
  { label: 'Growth projection', screen: 'growth', vault: 'v2' },
  { label: 'Scope Lens (AI)', screen: 'scope' },
  { label: 'Timeline', screen: 'timeline' },
  { label: 'Holdings ledger', screen: 'holdings' },
  { label: 'Connections', screen: 'connections' },
  { label: 'Settings', screen: 'settings' },
];

const PHONE_W = 390;
const PHONE_H = 844;

export const DemoShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scale, setScale] = useState(1);
  const [full, setFull] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<{ screen: string; vault?: string | null }>({ screen: 'onboarding' });
  const [time, setTime] = useState('9:41');
  const phoneRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const fit = () => {
      if (window.innerWidth <= 560) { setFull(true); setScale(1); return; }
      setFull(false);
      setScale(Math.min(1, (window.innerHeight - 56) / PHONE_H));
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('folio-framed', !full);
  }, [full]);

  useEffect(() => {
    const onScreen = (e: Event) => setActive((e as CustomEvent).detail);
    window.addEventListener('folio:screen', onScreen);
    const tick = () => setTime(new Date().toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit' }));
    tick();
    const t = window.setInterval(tick, 30_000);
    return () => { window.removeEventListener('folio:screen', onScreen); window.clearInterval(t); };
  }, []);

  const jump = (t: Target) => {
    window.dispatchEvent(new CustomEvent('folio:jump', { detail: { screen: t.screen, vault: t.vault } }));
    setOpen(false);
  };

  const isActive = (t: Target) => {
    if (t.screen === 'intro') return active.screen === 'onboarding';
    if (t.vault) return active.screen === t.screen && active.vault === t.vault;
    return active.screen === t.screen;
  };

  return (
    <div className="folio-wrap">
      {!full && (
        <button className="folio-fab" aria-expanded={open} onClick={() => setOpen(o => !o)}>
          {open ? 'Close' : 'Demo shortcuts'}
        </button>
      )}

      {!full && (
        <aside className={`folio-side ${open ? 'open' : ''}`} aria-label="Demo shortcuts">
          <div className="folio-brand">
            <LogoMark size={44} />
            <span className="folio-word" aria-label="Folio">
              <span className="folio-bar" aria-hidden="true" />
              <span className="relative">FOLIO</span>
            </span>
          </div>
          <div className="folio-lbl">Demo shortcuts</div>
          <nav className="folio-jump">
            {SHORTCUTS.map((t, i) => (
              <button key={t.label} onClick={() => jump(t)} aria-current={isActive(t) ? 'page' : undefined}>
                {t.label} <span>{String(i + 1).padStart(2, '0')}</span>
              </button>
            ))}
          </nav>
          <p className="folio-pitch">A clear lens for your money.</p>
          <p>
            Folio doesn't hold your cash. It wraps the banks you already use in a layer of clarity, splits every
            payday into Vault Spaces, and shows where your money is heading.
          </p>
          <p>
            Scope Lens runs a free, open-source AI model privately in your browser to turn a goal into three
            costed plans.
          </p>
          <p className="folio-note">Vision prototype. All accounts and figures are simulated. Not financial advice.</p>
        </aside>
      )}

      <div
        className="folio-stage"
        style={full ? undefined : { width: PHONE_W * scale, height: PHONE_H * scale }}
      >
        <div
          ref={phoneRef}
          className={`folio-phone ${full ? 'full' : ''}`}
          style={full ? undefined : { transform: `scale(${scale})` }}
        >
          {!full && (
            <div className="folio-status" aria-hidden="true">
              <span>{time}</span>
              <span className="folio-island" />
              <span className="folio-signal">
                <svg width="17" height="11" viewBox="0 0 17 11"><rect x="0" y="7" width="3" height="4" rx="1" /><rect x="4.5" y="5" width="3" height="6" rx="1" /><rect x="9" y="2.5" width="3" height="8.5" rx="1" /><rect x="13.5" y="0" width="3" height="11" rx="1" /></svg>
                <svg width="25" height="12" viewBox="0 0 25 12"><rect x="0.5" y="0.5" width="21" height="11" rx="3.5" fill="none" stroke="currentColor" opacity=".4" /><rect x="2" y="2" width="16" height="8" rx="2" /><rect x="22.5" y="4" width="1.8" height="4" rx="1" opacity=".4" /></svg>
              </span>
            </div>
          )}
          <div id="folio-scroll" className="folio-scroll no-scrollbar">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
