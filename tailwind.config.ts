import type { Config } from 'tailwindcss';

import { default as flattenColorPalette } from 'tailwindcss/lib/util/flattenColorPalette';

const config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: '80ch',
          },
        },
      }),
      colors: {
        black: {
          DEFAULT: '#000',
          100: '#202125',
          200: '#3B414D',
        },
        white: {
          DEFAULT: '#FFF',
          100: '#BEC1DD',
          200: '#C1C2D3',
          300: '#c5c6c7',
        },
        blue: {
          100: '#08182D',
        },
        mint: {
          100: '#66fcf1',
          200: '#205566',
          300: '#129793',
        },
        orange: {
          100: '#f88379',
        },
        yellow: {
          DEFAULT: '#FFBF00',
        },
        red: {
          100: '#EB5757',
        },
        gray: {
          400: '#282c34',
        },
        purple: '#CBACF9',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        fugaz: ['var(--fugaz)'],
        nanum: ['var(--nanum)'],
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    addVariablesForColors,
    function ({ addUtilities }) {
      const newUtilities = {
        '.word-break-keep-all': {
          'word-break': 'keep-all',
        },
      };

      addUtilities(newUtilities);
    },
  ],
} satisfies Config;

function addVariablesForColors({ addBase, theme }: any) {
  const allColors = flattenColorPalette(theme('colors'));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ':root': newVars,
  });
}

export default config;
