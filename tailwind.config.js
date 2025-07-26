/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // OSCS Design System
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        popover: "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        destructive: "var(--destructive)",
        "destructive-foreground": "var(--destructive-foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        
        // OSCS Neutral Scale
        neutral: {
          50: "var(--neutral-50)",
          100: "var(--neutral-100)",
          200: "var(--neutral-200)",
          300: "var(--neutral-300)",
          400: "var(--neutral-400)",
          500: "var(--neutral-500)",
          600: "var(--neutral-600)",
          700: "var(--neutral-700)",
          800: "var(--neutral-800)",
          900: "var(--neutral-900)",
        },
        
        // OSCS Accent Hierarchies
        "accent-primary": {
          300: "var(--accent-primary-300)",
          400: "var(--accent-primary-400)",
          500: "var(--accent-primary-500)",
          600: "var(--accent-primary-600)",
          700: "var(--accent-primary-700)",
        },
        "accent-success": {
          300: "var(--accent-success-300)",
          400: "var(--accent-success-400)",
          500: "var(--accent-success-500)",
          600: "var(--accent-success-600)",
          700: "var(--accent-success-700)",
        },
        "accent-info": {
          300: "var(--accent-info-300)",
          400: "var(--accent-info-400)",
          500: "var(--accent-info-500)",
          600: "var(--accent-info-600)",
          700: "var(--accent-info-700)",
        },
        "accent-warning": {
          300: "var(--accent-warning-300)",
          400: "var(--accent-warning-400)",
          500: "var(--accent-warning-500)",
          600: "var(--accent-warning-600)",
          700: "var(--accent-warning-700)",
        },
        "accent-error": {
          300: "var(--accent-error-300)",
          400: "var(--accent-error-400)",
          500: "var(--accent-error-500)",
          600: "var(--accent-error-600)",
          700: "var(--accent-error-700)",
        },
        
        // Semantic shortcuts
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",
        info: "var(--info)",
        
        // Chart colors for GitHub-style tiles
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
        },
        
        // Legacy support - backward compatibility
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['var(--font-noto)', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
        recursive: ['Recursive', 'sans-serif'],
      },
      gridTemplateColumns: {
        // ensures we have up to 4 cols on desktop.
        4: "repeat(4, minmax(0, 1fr))",
      },
      gridColumn: {
        'span-1': 'span 1 / span 1',
        'span-2': 'span 2 / span 2',
        'span-3': 'span 3 / span 3',
        'span-4': 'span 4 / span 4',
      },
      gridRow: {
        'span-1': 'span 1 / span 1',
        'span-2': 'span 2 / span 2',
        'span-3': 'span 3 / span 3',
        'span-4': 'span 4 / span 4',
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'highlight': 'highlight 0.6s ease forwards',
        'flash': 'flash 0.6s ease forwards',
      },
      keyframes: {
        'gradient-y': {
          '0%, 100%': {
            transform: 'translateY(0%)',
          },
          '50%': {
            transform: 'translateY(-100%)',
          },
        },
        'gradient-x': {
          '0%, 100%': {
            transform: 'translateX(0%)',
          },
          '50%': {
            transform: 'translateX(100%)',
          },
        },
        'gradient-xy': {
          '0%, 100%': {
            transform: 'translate(0%, 0%)',
          },
          '25%': {
            transform: 'translate(100%, 0%)',
          },
          '50%': {
            transform: 'translate(100%, 100%)',
          },
          '75%': {
            transform: 'translate(0%, 100%)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        highlight: {
          "0%": { backgroundColor: "transparent" },
          "100%": { backgroundColor: "var(--highlight)" },
        },
        flash: {
          "0%": { backgroundColor: "hsl(var(--card))" },
          "50%": { backgroundColor: "var(--highlight)" },
          "100%": { backgroundColor: "hsl(var(--card))" },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.5)',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}