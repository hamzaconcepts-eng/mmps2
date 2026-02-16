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
        // ── Surface (glass-friendly deep teal base) ──
        surface: {
          DEFAULT: '#1B4A54',
          card: 'rgba(255,255,255,0.12)',
          raised: 'rgba(255,255,255,0.18)',
          hover: 'rgba(255,255,255,0.22)',
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
        success: { DEFAULT: '#5DD99A', soft: '#1A3D2C' },
        warning: { DEFAULT: '#F0C34E', soft: '#3D3520' },
        danger:  { DEFAULT: '#F87171', soft: '#3D1E1E' },
        // ── Text ──
        text: {
          primary: '#FFFFFF',
          secondary: 'rgba(255,255,255,0.6)',
          tertiary: 'rgba(255,255,255,0.35)',
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
        // Dreamy background gradient
        'gradient-dreamy': 'linear-gradient(135deg, #1B4A54 0%, #254E58 30%, #2D6A6F 60%, #1B4A54 100%)',
        'gradient-sidebar': 'linear-gradient(180deg, rgba(37,78,88,0.95), rgba(27,74,84,0.98))',
        // Button gradients
        'gradient-brand-btn': 'linear-gradient(135deg, #254E58, #35707C)',
        'gradient-teal-btn':  'linear-gradient(135deg, #73C0CF, #96C7D3)',
        'gradient-orange-btn':'linear-gradient(135deg, #F09021, #F5A946)',
      },
      boxShadow: {
        glass: '0 4px 30px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
        'glass-hover': '0 8px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
        'glass-strong': '0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.12)',
        glow: '0 0 50px rgba(115,192,207,0.2)',
        'glow-orange': '0 0 50px rgba(240,144,33,0.2)',
        'glow-soft': '0 0 80px rgba(115,192,207,0.1)',
        card: '0 2px 12px rgba(0,0,0,0.15)',
        'card-hover': '0 12px 40px rgba(0,0,0,0.2)',
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
