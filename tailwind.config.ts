import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'poly-night': '#050B14',
        'poly-night-light': '#0B1528',
        'poly-card': '#0B1528',
        'poly-card-hover': '#111F38',
        // Véritable or précieux et métallique doré (Logo)
        'poly-gold': '#D4AF37', // Or impérial classique
        'poly-gold-light': '#F3E5AB', // Reflet or champagne
        'poly-gold-dark': '#AA7A1E', // Or profond
        'poly-gold-hover': '#C59B27',
        'poly-gold-badge': '#996515',
        // Cyan technologique
        'poly-cyan': '#38BDF8',
        'poly-cyan-dark': '#0284C7',
        // Mode clair sophistiqué
        'poly-light-bg': '#F8FAFC',
        'poly-light-card': '#FFFFFF',
        'poly-light-border': '#E2E8F0',
        'poly-dark-text': '#0F172A',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2.5s ease-in-out infinite',
        'pulse-gold': 'pulse-gold 2.5s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
        'marquee-reverse': 'marquee-reverse 30s linear infinite',
        'shimmer': 'shimmer 2.5s infinite',
        'celebrate': 'celebrate 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 25px rgba(212, 175, 55, 0.25)' },
          '50%': { boxShadow: '0 0 45px rgba(212, 175, 55, 0.6)' },
        },
        'pulse-gold': {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        celebrate: {
          '0%': { opacity: '0', transform: 'scale(0.8) translateY(20px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse at top, #0F1D38 0%, #050B14 70%)',
        // Or authentique du logo Polytech (champagne doré vers or riche)
        'gold-gradient': 'linear-gradient(135deg, #F3E5AB 0%, #D4AF37 50%, #AA7A1E 100%)',
        'gold-metallic': 'linear-gradient(90deg, #D4AF37 0%, #FFF4D0 50%, #AA7A1E 100%)',
        'cyan-gradient': 'linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
