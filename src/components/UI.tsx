import React from 'react';

/**
 * Folio wordmark from the brand guide: Inter Black, -44 tracking, with the
 * copper bar set behind the stem of the F.
 */
export const Logo: React.FC<{ className?: string, large?: boolean }> = ({ className = '', large = false }) => (
  <div className={`inline-block leading-none ${className}`} aria-label="Folio" role="img">
    <span className={`${large ? 'text-7xl' : 'text-4xl'} relative inline-block font-black tracking-compressed text-charcoal dark:text-stone uppercase select-none antialiased`} style={{ lineHeight: 1 }}>
      <span
        aria-hidden="true"
        className="absolute bg-rust"
        style={{ left: '-0.075em', top: '0.2em', width: '0.13em', height: '0.71em' }}
      />
      <span className="relative">Folio</span>
    </span>
  </div>
);

/** Standalone F mark (app icon) */
export const LogoMark: React.FC<{ size?: number; className?: string }> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
    <circle cx="32" cy="32" r="32" className="fill-charcoal dark:fill-stone" />
    <rect x="17" y="19" width="9" height="31" fill="#B3593B" />
    <rect x="22" y="16" width="10" height="32" className="fill-stone dark:fill-charcoal" />
    <rect x="22" y="16" width="24" height="9" className="fill-stone dark:fill-charcoal" />
    <rect x="22" y="29.5" width="19" height="8.5" className="fill-stone dark:fill-charcoal" />
  </svg>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const base = "px-6 py-4.5 rounded-[24px] font-bold transition-all duration-300 ease-silk active:scale-[0.96] hover:-translate-y-px disabled:opacity-50 disabled:bg-charcoal/10 dark:disabled:bg-white/5 disabled:text-charcoal/20 dark:disabled:text-white/20 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em]";
  const variants = {
    primary: "bg-rust text-white dark:text-stone hover:bg-rust-hover shadow-xl shadow-rust/20",
    secondary: "bg-charcoal/10 dark:bg-charcoal-lighter text-charcoal dark:text-stone border border-charcoal/10 dark:border-white/10 hover:bg-charcoal/15 dark:hover:bg-charcoal-lighter/80 shadow-sm",
    ghost: "bg-transparent text-charcoal/60 dark:text-stone/60 hover:text-rust"
  };
  
  return (
    <button 
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode, className?: string, onClick?: () => void }> = ({ 
  children, 
  className = '',
  onClick
}) => (
  <div 
    onClick={onClick}
    className={`bg-white dark:bg-charcoal-card rounded-[36px] p-6 border border-charcoal/15 dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] ${onClick ? 'folio-sheen cursor-pointer hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-500 ease-silk' : ''} ${className}`}
  >
    {children}
  </div>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => (
  <input 
    className={`w-full bg-white dark:bg-charcoal-lighter border border-charcoal/10 dark:border-white/[0.1] rounded-[24px] px-6 py-5 focus:outline-none focus:ring-2 focus:ring-rust/50 transition-all text-xl font-bold placeholder:text-charcoal/30 dark:placeholder:text-stone/30 text-charcoal dark:text-stone shadow-sm ${className}`}
    {...props}
  />
);

export const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="block text-[11px] font-black text-charcoal dark:text-stone/60 uppercase tracking-[0.3em] mb-4 ml-2 antialiased">
    {children}
  </label>
);

export const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="mb-14">
    <h2 className="text-4xl font-black text-charcoal dark:text-stone tracking-tighter leading-[1] antialiased">{title}</h2>
    {subtitle && <p className="text-charcoal/80 dark:text-stone/60 mt-5 text-lg font-medium leading-relaxed max-w-[95%] antialiased">{subtitle}</p>}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode, variant?: 'default' | 'rust', className?: string }> = ({ children, variant = 'rust', className = '' }) => {
  const styles = variant === 'rust' 
    ? "bg-rust/20 dark:bg-rust text-rust dark:text-stone font-black" 
    : "bg-charcoal/15 dark:bg-white/10 text-charcoal dark:text-stone/70 font-bold";
  return (
    <span className={`inline-flex items-center px-4 py-2 rounded-full text-[9px] uppercase tracking-[0.2em] ${styles} ${className}`}>
      {children}
    </span>
  );
};