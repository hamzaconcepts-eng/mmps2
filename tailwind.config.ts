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
        // MMPS Brand — Dreamy Shift
        brand: {
          deep: '#1B5E6B',
          'deep-soft': '#2A7A8A',
          sky: '#6FBDD1',
          'sky-soft': '#8ECEE0',
          ice: '#AEDAE5',
          'ice-light': '#D2ECF2',
          silver: '#C8CDD0',
          orange: '#E8941A',
          'orange-warm': '#F0A63E',
        },
        // Dreamy Palette
        dream: {
          pink: '#F5D5E0',
          'pink-soft': '#FAEAF0',
          lavender: '#E8DFF5',
          'lavender-soft': '#F3EEFA',
          peach: '#FDE8D8',
          'peach-soft': '#FFF4EC',
          mint: '#D5F0E8',
          'mint-soft': '#EAFAF5',
          sky: '#D8EEF8',
          'sky-soft': '#EDF7FC',
          yellow: '#FFF3D6',
          'yellow-soft': '#FFFAED',
        },
        // Text Colors
        text: {
          primary: '#2D3748',
          secondary: 'rgba(45, 55, 72, 0.6)',
          tertiary: 'rgba(45, 55, 72, 0.35)',
        },
      },
      fontFamily: {
        sans: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-noto-kufi)', 'var(--font-nunito)', 'sans-serif'],
      },
      borderRadius: {
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
      },
      backgroundImage: {
        'gradient-dreamy': 'linear-gradient(135deg, #FAEAF0 0%, #EDF7FC 30%, #F3EEFA 60%, #FFF4EC 100%)',
        'gradient-card': 'linear-gradient(145deg, rgba(255,255,255,0.85), rgba(255,255,255,0.55))',
        'gradient-warm': 'linear-gradient(135deg, #FDE8D8, #F5D5E0, #E8DFF5)',
        'gradient-cool': 'linear-gradient(135deg, #D8EEF8, #D5F0E8, #E8DFF5)',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(27, 94, 107, 0.08)',
        'glass-hover': '0 12px 40px rgba(27, 94, 107, 0.12)',
      },
      backdropBlur: {
        glass: '20px',
      },
    },
  },
  plugins: [],
};

export default config;
