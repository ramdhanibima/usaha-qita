import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      xs: '360px',
      sm: '390px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
    },
    extend: {
      colors: {
        brand: {
          navy: {
            50: '#EBF3FA',
            100: '#D2E3F4',
            600: '#00529C',
            700: '#00407A',
            900: '#0B2A4A',
          },
          emerald: {
            50: '#ECFDF5',
            100: '#D1FAE5',
            600: '#059669',
            700: '#047857',
          },
          amber: {
            50: '#FFFBEB',
            100: '#FEF3C7',
            600: '#D97706',
            700: '#B45309',
          },
          danger: {
            50: '#FEF2F2',
            100: '#FEE2E2',
            600: '#DC2626',
            700: '#B91C1C',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;

