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
        // Core BitGold colors (from your CSS variables)
        primary: '#D4AF37',       // Gold
        secondary: '#0F172A',     // Navy
        background: '#F8FAFC',    // Light background
        success: '#10B981',
        error: '#EF4444',
        light: '#ffffff',
        dark: '#171717',
        deepBlack: '#0D0D0D', // Added for premium dark gold aesthetic
        darkGray: '#9CA3AF', // Added for subheader text
        
        // BitGold specific palette
        bitgold: {
          900: '#0A0F2B',       // Deep Navy
          800: '#0F172A',       // Dark Navy  
          700: '#1E293B',       // Medium Navy
          gold: '#D4AF37',      // Primary Gold
          lightGold: '#F5E7B2', // Light Gold
        }
      },
      borderRadius: {
        'container': '0.75rem',
      },
      dropShadow: {
        'gold': '0 0 10px rgba(212, 175, 55, 0.7)',
      }
    },
  },
  plugins: [],
}
