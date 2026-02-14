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
        // MMPS Brand — Isometric Gradient Style
        brand: {
          deep: '#0D3B52',      // Deep navy (darker than original)
          'deep-teal': '#254E58', // Navy teal
          teal: '#4A8A99',      // Medium teal
          'teal-light': '#73C0CF', // Light teal
          cyan: '#96C7D3',      // Cyan
          ice: '#AEDAE5',       // Ice blue
          'ice-light': '#D2ECF2', // Very light ice
          silver: '#C8CDD0',    // Silver gray
          white: '#E4E4E4',     // Off-white
          orange: '#F09021',    // Vibrant orange
          'orange-soft': '#FFB366', // Soft orange
        },
        // Dreamy Palette - Updated with new scheme
        dream: {
          navy: '#0A2532',      // Dark navy background
          'navy-light': '#173A4D',
          teal: '#254E58',      // Teal from gradient
          'teal-soft': '#73C0CF',
          cyan: '#96C7D3',      // Cyan
          'cyan-soft': '#B8DCE5',
          orange: '#F09021',    // Orange from gradient
          'orange-soft': '#FFB366',
          peach: '#FDE8D8',
          cream: '#E4E4E4',     // Cream white
        },
        // Text Colors
        text: {
          primary: '#0D3B52',   // Deep navy for text
          secondary: 'rgba(13, 59, 82, 0.7)',
          tertiary: 'rgba(13, 59, 82, 0.4)',
          light: '#E4E4E4',     // Light text for dark backgrounds
        },
      },
      fontFamily: {
        sans: ['var(--font-poppins)'],
        poppins: ['var(--font-poppins)'],
      },
      borderRadius: {
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
      },
      backgroundImage: {
        'gradient-dreamy': 'linear-gradient(135deg, #D2ECF2 0%, #B8DCE5 30%, #E4E4E4 60%, #FFE8D8 100%)',
        'gradient-card': 'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6))',
        'gradient-teal': 'linear-gradient(135deg, #254E58 0%, #73C0CF 100%)',
        'gradient-cyan': 'linear-gradient(135deg, #96C7D3 0%, #E4E4E4 100%)',
        'gradient-orange': 'linear-gradient(135deg, #E4E4E4 0%, #F09021 100%)',
        'gradient-isometric': 'linear-gradient(135deg, #0A2532 0%, #173A4D 50%, #254E58 100%)',
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
