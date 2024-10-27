/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#D9E7F7',
          100: '#C0D6F1',
          200: '#A0C2EA',
          300: '#81AEE3',
          400: '#6299DC',
          500: '#4285D5',
          600: '#376FB1',
          700: '#2C598E',
          800: '#21436B',
          900: '#162C47',
          950: '#0D1B2B',
        },
        secondary: {
          50: '#DCEEF1',
          100: '#C5E3E7',
          200: '#A8D5DB',
          300: '#8BC8D0',
          400: '#6EBAC4',
          500: '#51ACB8',
          600: '#448F99',
          700: '#36737B',
          800: '#29565C',
          900: '#1B393D',
          950: '#102225',
        },
        background: '#F1F1F1',
        dark: '#222222',
        light: '#808080',
        'sepia-content': '#5F5033',
        'sepia-bg': '#F0E8DC',
      },
    },
    fontFamily: {
      sans: ['Lato', 'sans-serif'],
      serif: ['Playfair Display', 'sefif'],
      mono: ['Fira Code', 'monospace'],
    },
  },
  plugins: [],
};
