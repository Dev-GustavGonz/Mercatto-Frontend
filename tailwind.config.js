/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mercatto: {
          primary: '#7655D6',
          deep: '#4C2FA0',
          lavender: '#DCD3F7',
          soft: '#E9E3FB',
          surface: '#F3F0FC',
          bg: '#FAF8FF',
          dark: '#25204F',
          'on-dark': '#B8A9F0',
          'btn-dark': '#EDE8FD',
          offer: '#E0629F',
          'offer-text': '#A8285F',
          'offer-bg': '#FCE4EF',
          elite: '#B8700A',
          'elite-bg': '#FEF3D4',
          'elite-text': '#7A4B05',
          text: '#1F1637',
          muted: '#645D80',
          border: '#E6E1F3',
          accent: '#7655D6',
          neon: '#7C3AED',
          light: '#F8F7FF',
          glow: '#A855F7'
        },
        header: {
          core: '#7C3AED',
          accent: '#8B5CF6',
          deep: '#6D28D9',
          soft: '#F5F3FF',
          border: '#E2E8F0',
          muted: '#64748B',
          text: '#0F172A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-8px) rotate(2deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.08)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 5s ease-in-out infinite',
        shimmer: 'shimmer 1.5s infinite',
      }
    },
  },
  plugins: [],
}
