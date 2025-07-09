/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'recursive': ['Recursive', 'system-ui', 'sans-serif'],
        'clash': ['Clash Display', 'system-ui', 'sans-serif'],
        'array': ['Array', 'system-ui', 'sans-serif'], 
        'aktura': ['Aktura', 'system-ui', 'sans-serif'],
        'general': ['General Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          light: '#1a1a1a',
          dark: '#f9fafb',
        },
        secondary: {
          light: '#6b7280',
          dark: '#9ca3af',
        },
        accent: {
          light: '#3b82f6',
          dark: '#8b5cf6',
        },
        primary: '#3B5BDB',
        background: {
          light: '#ffffff',
          dark: '#0f172a',
        },
      },
      backgroundImage: {
        'gradient-light': 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        'gradient-accent-light': 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        'gradient-accent-dark': 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6%)' },
        },
      },
    },
  },
  plugins: [],
} 