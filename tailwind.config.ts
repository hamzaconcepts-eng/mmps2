import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Surface (light theme) ──
        surface: {
          DEFAULT: '#F5F7FA',
          card: '#FFFFFF',
          raised: '#FFFFFF',
          hover: 'rgba(0,0,0,0.04)',
        },
        // ── Brand (isometric gradient palette) ──
        brand: {
          deep: '#254E58',
          teal: '#73C0CF',
          'teal-soft': '#A8D8E3',
          ice: '#96C7D3',
          light: '#E4E4E4',
          orange: '#F09021',
          'orange-warm': '#F5A946',
        },
        // ── Accent cards (teal / ice / orange / light) ──
        accent: {
          teal: '#73C0CF',
          'teal-soft': '#A8D8E3',
          ice: '#96C7D3',
          'ice-soft': '#C8E2EA',
          orange: '#F09021',
          'orange-soft': '#F5C882',
          light: '#E4E4E4',
          'light-soft': '#F0F0F0',
        },
        // ── Semantic ──
        success: { DEFAULT: '#16A34A', soft: '#ECFDF5' },
        warning: { DEFAULT: '#D97706', soft: '#FFFBEB' },
        danger:  { DEFAULT: '#DC2626', soft: '#FEF2F2' },
        // ── Text (dark on light) ──
        text: {
          primary: '#1E3A40',
          secondary: 'rgba(30,58,64,0.60)',
          tertiary: 'rgba(30,58,64,0.40)',
          dark: '#1E3A40',
          'dark-secondary': 'rgba(30,58,64,0.7)',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        arabic: ['Noto Kufi Arabic', 'Nunito', 'sans-serif'],
      },
      borderRadius: {
        sm: '10px',
        md: '14px',
        lg: '20px',
        xl: '28px',
        '2xl': '32px',
        full: '999px',
      },
      backgroundImage: {
        // Light background
        'gradient-dreamy': 'linear-gradient(135deg, #F5F7FA 0%, #EEF2F5 30%, #E8EEF2 60%, #F5F7FA 100%)',
        // Sidebar stays dark teal
        'gradient-sidebar': 'linear-gradient(180deg, rgba(37,78,88,0.95), rgba(27,74,84,0.98))',
        // Button gradients
        'gradient-brand-btn': 'linear-gradient(135deg, #254E58, #35707C)',
        'gradient-teal-btn':  'linear-gradient(135deg, #73C0CF, #96C7D3)',
        'gradient-orange-btn':'linear-gradient(135deg, #F09021, #F5A946)',
      },
      boxShadow: {
        glass: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'glass-hover': '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        'glass-strong': '0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)',
        glow: '0 0 50px rgba(115,192,207,0.15)',
        'glow-orange': '0 0 50px rgba(240,144,33,0.15)',
        'glow-soft': '0 0 80px rgba(115,192,207,0.08)',
        card: '0 1px 3px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.1)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
