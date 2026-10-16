import animate from 'tailwindcss-animate';

/** Folio brand tokens, taken from the brand identity guide. */
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#0F0D0E', // Ink
          card: '#151314',
          lighter: '#1F1D1E',
          line: '#303030', // Charcoal
        },
        stone: {
          DEFAULT: '#FBFBFA', // Paper
          muted: '#666666',
          dark: '#E8E7E2',
        },
        rust: {
          DEFAULT: '#B3593B', // Copper
          hover: '#9E4E34',
          glow: '#D06B48',
        },
        gold: '#EAB308',
        growth: '#22C55E',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      letterSpacing: {
        compressed: '-0.044em',
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 3.2s cubic-bezier(0.45, 0, 0.55, 1) infinite',
        shimmer: 'shimmer 2.4s linear infinite',
      },
    },
  },
  plugins: [animate],
};
