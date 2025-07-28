/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0F',
        surface: '#12121A',
        primary: '#00E6FE',
        secondary: '#A020F0',
        accent: '#39FF14',
        textLight: '#EAEAEA',
        textMuted: '#7A7A8C',
        error: '#FF5555'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Orbitron', 'sans-serif'],
        mono: ['MesloLGS NF', 'monospace']
      }
    }
  },
  plugins: []
};