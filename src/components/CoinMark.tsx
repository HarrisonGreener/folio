import React from 'react';

/**
 * Neutral asset monogram. Replaces third-party brand logos so the public
 * repo ships no trademarked artwork. Colour comes from the Folio palette.
 */
const TONES: Record<string, string> = {
  BTC: '#EAB308',
  ETH: '#B3593B',
  SOL: '#22C55E',
};

export const CoinMark: React.FC<{ symbol: string; size?: number }> = ({ symbol, size = 24 }) => {
  const tone = TONES[symbol] ?? '#666666';
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill={tone} fillOpacity="0.16" stroke={tone} strokeOpacity="0.55" strokeWidth="1.5" />
      <text
        x="16"
        y="16"
        textAnchor="middle"
        dominantBaseline="central"
        fill={tone}
        fontFamily="Inter, sans-serif"
        fontWeight={900}
        fontSize={symbol.length > 2 ? 9 : 11}
        letterSpacing="-0.4"
      >
        {symbol}
      </text>
    </svg>
  );
};

export const coinLogo = (symbol: string) => () => <CoinMark symbol={symbol} />;
