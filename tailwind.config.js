/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // Core palette — keep it tight
        primary: '#D4AF37',
        deepBlack: '#0A0A0A',
        
        // Functional
        success: '#10B981',
        error: '#EF4444',
        
        // Gold scale
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F5E7B2',
          dark: '#B38728',
          muted: '#D4AF37',
        },
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
