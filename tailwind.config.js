/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F2F0FF',
          100: '#E6E1FF',
          200: '#C9BFFF',
          300: '#AC9DFF',
          400: '#8F7BFF',
          500: '#7159FF',
          600: '#5A47CC',
          700: '#433599',
          800: '#2C2366',
          900: '#151233',
        },
        secondary: {
          50: '#FFF0F7',
          100: '#FFE1EF',
          200: '#FFC3DF',
          300: '#FFA5CF',
          400: '#FF87BF',
          500: '#FF69AF',
          600: '#CC548C',
          700: '#993F69',
          800: '#662A46',
          900: '#331523',
        },
        accent: {
          50: '#F0FBFF',
          100: '#E1F7FF',
          200: '#C3EEFF',
          300: '#A5E5FF',
          400: '#87DCFF',
          500: '#69D3FF',
          600: '#54A6CC',
          700: '#3F7C99',
          800: '#2A5366',
          900: '#152933',
        },
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'border-flow': 'border-flow 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'border-flow': {
          '0%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '100% 0%' },
          '100%': { backgroundPosition: '0% 0%' },
        },
      },
      boxShadow: {
        'neo': '20px 20px 60px #d1d1d1, -20px -20px 60px #ffffff',
        'neo-inner': 'inset 5px 5px 10px #d1d1d1, inset -5px -5px 10px #ffffff',
        'glow': '0 0 15px rgba(113, 89, 255, 0.5)',
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
};
