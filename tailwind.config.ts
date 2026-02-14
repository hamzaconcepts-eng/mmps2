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
        // Teal - Primary Brand (from brand guide + gradients)
        teal: {
          900: '#0C3B3B',
          800: '#0E4D4D',
          700: '#147272',
          600: '#1A8A8A',
          500: '#1FA5A5',
          400: '#3CC0C0',
          300: '#67D4D4',
          200: '#9AE6E6',
          100: '#D0F5F5',
          50: '#EEFBFB',
        },
        // Dark Shades
        dark: {
          900: '#111318',
          800: '#1A1D25',
          700: '#262A35',
          600: '#343846',
          500: '#4A4F60',
        },
        // Orange - Accent
        orange: {
          600: '#C46A1A',
          500: '#E07C20',
          400: '#F0922E',
          300: '#F5AD5C',
          200: '#FAD0A0',
          100: '#FEF0DC',
        },
        // Grays (from brand guide)
        gray: {
          50: '#F8FAFB',
          100: '#F1F4F6',
          200: '#E2E7EB',
          300: '#CDD4DA',
          400: '#9BA5B0',
          500: '#6B7785',
          600: '#4A5462',
          700: '#333C48',
        },
        // Legacy aliases for compatibility
        brand: {
          deep: '#0C3B3B',
          'deep-teal': '#147272',
          teal: '#1A8A8A',
          'teal-light': '#1FA5A5',
          cyan: '#3CC0C0',
          orange: '#E07C20',
          'orange-soft': '#F0922E',
        },
        text: {
          primary: '#1A1D25',
          secondary: '#6B7785',
          tertiary: '#9BA5B0',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        inter: ['var(--font-inter)'],
        arabic: ['var(--font-arabic)'],
      },
      borderRadius: {
        xs: '6px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        full: '999px',
      },
      backgroundImage: {
        'gradient-dreamy': 'linear-gradient(to bottom, #F8FAFB, #FFFFFF)',
        'gradient-teal': 'linear-gradient(135deg, #147272 0%, #1FA5A5 100%)',
        'gradient-cyan': 'linear-gradient(135deg, #3CC0C0 0%, #67D4D4 100%)',
        'gradient-orange': 'linear-gradient(135deg, #E07C20 0%, #F0922E 100%)',
        'gradient-isometric': 'linear-gradient(135deg, #0C3B3B 0%, #147272 50%, #1A8A8A 100%)',
      },
      boxShadow: {
        glass: '0 10px 40px rgba(27, 94, 107, 0.1), 0 2px 8px rgba(27, 94, 107, 0.06)',
        'glass-hover': '0 20px 60px rgba(27, 94, 107, 0.15), 0 4px 12px rgba(27, 94, 107, 0.08)',
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      },
      backdropBlur: {
        glass: '24px',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
