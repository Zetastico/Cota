/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4F46E5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
      },
      boxShadow: {
        'premium':      '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px -2px rgba(0,0,0,0.06)',
        'premium-hover':'0 4px 24px -4px rgba(79,70,229,0.12), 0 8px 32px -8px rgba(0,0,0,0.08)',
        'card':         '0 0 0 1px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04)',
        'card-hover':   '0 0 0 1px rgba(79,70,229,0.1), 0 8px 24px -4px rgba(79,70,229,0.1)',
        'sidebar':      '1px 0 0 #f1f5f9',
        'glow-indigo':  '0 0 20px rgba(79,70,229,0.25)',
        'glow-emerald': '0 0 20px rgba(16,185,129,0.2)',
        'inner-xs':     'inset 0 1px 2px rgba(0,0,0,0.04)',
      },
      animation: {
        'fadeIn':     'fadeIn 0.4s ease forwards',
        'slideUp':    'slideUp 0.4s ease forwards',
        'slideIn':    'slideIn 0.3s ease forwards',
        'shimmer':    'shimmer 1.6s linear infinite',
        'scaleIn':    'scaleIn 0.25s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%':   { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      transitionTimingFunction: {
        'bounce-sm': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
        '3xs': ['0.575rem', { lineHeight: '0.875rem' }],
      },
    },
  },
  plugins: [],
}
