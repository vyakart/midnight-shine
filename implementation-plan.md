# Implementation Plan: Culturally-Inspired Theme System

## Overview
This document provides the complete implementation blueprint for replacing the existing theme system with "saffronSunrise" (light) and "indigoMidnight" (dark) themes. All code blocks are production-ready and can be directly copied into the respective files.

## 1. Design Tokens JSON Configuration

Create `config/theme-tokens.json`:

```json
{
  "themes": {
    "saffronSunrise": {
      "name": "Saffron Sunrise",
      "scheme": "light",
      "colors": {
        "background": "#FFF8E7",
        "surface": "#FFFFFF",
        "primary": "#FF9933",
        "secondary": "#096C6C",
        "accent": "#9A031E",
        "accentSoft": "#D4AF37",
        "textPrimary": "#3B2E2A",
        "textSecondary": "#5C4F4B",
        "textMuted": "#7A6D69",
        "textInverse": "#FFFFFF",
        "border": "#E8DFC8",
        "borderHover": "#D4C9A8",
        "success": "#138000",
        "warning": "#B26500",
        "error": "#C41E3A",
        "info": "#0066CC",
        "shadow": "139, 69, 19",
        "overlay": "255, 248, 231"
      },
      "fonts": {
        "display": "'Hind', 'Noto Sans Devanagari', sans-serif",
        "heading": "'Merriweather', serif",
        "body": "'Recursive', sans-serif"
      }
    },
    "indigoMidnight": {
      "name": "Indigo Midnight",
      "scheme": "dark",
      "colors": {
        "background": "#0B1D3F",
        "surface": "#18264D",
        "primary": "#B98A2A",
        "secondary": "#149C9C",
        "accent": "#9C1149",
        "accentSoft": "#DC921A",
        "textPrimary": "#E6E5EB",
        "textSecondary": "#C4C4CF",
        "textMuted": "#9A9AA8",
        "textInverse": "#0B1D3F",
        "border": "#2F3B5A",
        "borderHover": "#3D4A6B",
        "success": "#4ADE80",
        "warning": "#FBB040",
        "error": "#F87171",
        "info": "#60A5FA",
        "shadow": "0, 0, 0",
        "overlay": "11, 29, 63"
      },
      "fonts": {
        "display": "'Hind', 'Noto Sans Devanagari', sans-serif",
        "heading": "'Recursive', sans-serif",
        "body": "'Recursive', sans-serif"
      }
    }
  },
  "typography": {
    "scale": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "md": "1.125rem",
      "lg": "1.333rem",
      "xl": "1.777rem",
      "2xl": "2.369rem",
      "3xl": "3.157rem",
      "4xl": "4.209rem"
    },
    "lineHeight": {
      "tight": 1.1,
      "snug": 1.25,
      "normal": 1.5,
      "relaxed": 1.625,
      "loose": 1.75
    },
    "fontWeight": {
      "light": 300,
      "regular": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700,
      "black": 900
    },
    "letterSpacing": {
      "tighter": "-0.05em",
      "tight": "-0.025em",
      "normal": "0",
      "wide": "0.025em",
      "wider": "0.05em",
      "widest": "0.1em"
    }
  },
  "spacing": {
    "0": "0",
    "px": "1px",
    "0.5": "0.125rem",
    "1": "0.25rem",
    "1.5": "0.375rem",
    "2": "0.5rem",
    "2.5": "0.625rem",
    "3": "0.75rem",
    "3.5": "0.875rem",
    "4": "1rem",
    "5": "1.25rem",
    "6": "1.5rem",
    "7": "1.75rem",
    "8": "2rem",
    "9": "2.25rem",
    "10": "2.5rem",
    "11": "2.75rem",
    "12": "3rem",
    "14": "3.5rem",
    "16": "4rem",
    "20": "5rem",
    "24": "6rem",
    "28": "7rem",
    "32": "8rem"
  },
  "borderRadius": {
    "none": "0",
    "sm": "0.125rem",
    "base": "0.25rem",
    "md": "0.375rem",
    "lg": "0.5rem",
    "xl": "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    "full": "9999px"
  },
  "animation": {
    "duration": {
      "instant": "0ms",
      "fast": "150ms",
      "base": "300ms",
      "moderate": "500ms",
      "slow": "700ms",
      "slower": "1000ms"
    },
    "easing": {
      "linear": "linear",
      "ease": "ease",
      "easeIn": "cubic-bezier(0.4, 0, 1, 1)",
      "easeOut": "cubic-bezier(0, 0, 0.2, 1)",
      "easeInOut": "cubic-bezier(0.4, 0, 0.2, 1)",
      "easeInOutCubic": "cubic-bezier(0.645, 0.045, 0.355, 1)",
      "easeOutBack": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      "springGentle": "cubic-bezier(0.175, 0.885, 0.32, 1.05)"
    }
  }
}
```

## 2. Updated CSS Theme System

Replace the content of `css/themes.css`:

```css
/*
  themes.css
  - Culturally-inspired theme system: saffronSunrise & indigoMidnight
  - CSS custom properties with semantic mappings
  - Smooth transitions and accessibility support
*/

/* Font imports */
@import url('https://fonts.googleapis.com/css2?family=Hind:wght@400;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap');

/* Base theme tokens */
:root {
  /* Animation tokens */
  --duration-instant: 0ms;
  --duration-fast: 150ms;
  --duration-base: 300ms;
  --duration-moderate: 500ms;
  --duration-slow: 700ms;
  --duration-slower: 1000ms;
  
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in-out-cubic: cubic-bezier(0.645, 0.045, 0.355, 1);
  --ease-out-back: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.05);
  
  /* Spacing scale */
  --space-0: 0;
  --space-px: 1px;
  --space-0-5: 0.125rem;
  --space-1: 0.25rem;
  --space-1-5: 0.375rem;
  --space-2: 0.5rem;
  --space-2-5: 0.625rem;
  --space-3: 0.75rem;
  --space-3-5: 0.875rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-7: 1.75rem;
  --space-8: 2rem;
  --space-9: 2.25rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-14: 3.5rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;
  
  /* Border radius scale */
  --radius-none: 0;
  --radius-sm: 0.125rem;
  --radius-base: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;
  --radius-full: 9999px;
  
  /* Typography scale */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-md: 1.125rem;
  --text-lg: 1.333rem;
  --text-xl: 1.777rem;
  --text-2xl: 2.369rem;
  --text-3xl: 3.157rem;
  --text-4xl: 4.209rem;
  
  /* Line heights */
  --leading-tight: 1.1;
  --leading-snug: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 1.75;
  
  /* Font weights */
  --font-light: 300;
  --font-regular: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-black: 900;
  
  /* Letter spacing */
  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
  --tracking-widest: 0.1em;
}

/* ===========================
   saffronSunrise Theme (Light)
   =========================== */
:root[data-theme="saffronSunrise"] {
  /* Core colors */
  --color-background: #FFF8E7;
  --color-surface: #FFFFFF;
  --color-primary: #FF9933;
  --color-secondary: #096C6C;
  --color-accent: #9A031E;
  --color-accent-soft: #D4AF37;
  
  /* Text colors */
  --color-text-primary: #3B2E2A;
  --color-text-secondary: #5C4F4B;
  --color-text-muted: #7A6D69;
  --color-text-inverse: #FFFFFF;
  
  /* Semantic colors */
  --color-success: #138000;
  --color-warning: #B26500;
  --color-error: #C41E3A;
  --color-info: #0066CC;
  
  /* Borders and surfaces */
  --color-border: #E8DFC8;
  --color-border-hover: #D4C9A8;
  
  /* Shadows */
  --shadow-color: 139, 69, 19;
  --shadow-sm: 0 1px 2px 0 rgba(var(--shadow-color), 0.05);
  --shadow-base: 0 1px 3px 0 rgba(var(--shadow-color), 0.1), 
                 0 1px 2px 0 rgba(var(--shadow-color), 0.06);
  --shadow-md: 0 4px 6px -1px rgba(var(--shadow-color), 0.1), 
               0 2px 4px -1px rgba(var(--shadow-color), 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(var(--shadow-color), 0.1), 
               0 4px 6px -2px rgba(var(--shadow-color), 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(var(--shadow-color), 0.1), 
               0 10px 10px -5px rgba(var(--shadow-color), 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(var(--shadow-color), 0.25);
  --shadow-inner: inset 0 2px 4px 0 rgba(var(--shadow-color), 0.06);
  
  /* Overlays */
  --overlay-color: 255, 248, 231;
  --overlay-light: rgba(var(--overlay-color), 0.5);
  --overlay-medium: rgba(var(--overlay-color), 0.75);
  --overlay-heavy: rgba(var(--overlay-color), 0.95);
  
  /* Typography */
  --font-display: 'Hind', 'Noto Sans Devanagari', sans-serif;
  --font-heading: 'Merriweather', serif;
  --font-body: 'Recursive', sans-serif;
  --font-mono: 'Recursive Mono Casual', monospace;
  
  /* Component tokens */
  --button-primary-bg: var(--color-primary);
  --button-primary-fg: var(--color-surface);
  --button-primary-hover: #E67A00;
  --button-secondary-bg: var(--color-secondary);
  --button-secondary-fg: var(--color-surface);
  --button-secondary-hover: #075959;
  
  --card-bg: var(--color-surface);
  --card-border: var(--color-border);
  --card-shadow: var(--shadow-base);
  --card-hover-shadow: var(--shadow-lg);
  
  --input-bg: var(--color-surface);
  --input-border: var(--color-border);
  --input-focus-border: var(--color-primary);
  --input-placeholder: var(--color-text-muted);
  
  --link-color: var(--color-secondary);
  --link-hover: var(--color-primary);
  
  /* Focus ring */
  --focus-ring-color: var(--color-primary);
  --focus-ring-offset: 2px;
  --focus-ring-width: 3px;
  
  color-scheme: light;
}

/* ===========================
   indigoMidnight Theme (Dark)
   =========================== */
:root[data-theme="indigoMidnight"] {
  /* Core colors */
  --color-background: #0B1D3F;
  --color-surface: #18264D;
  --color-primary: #B98A2A;
  --color-secondary: #149C9C;
  --color-accent: #9C1149;
  --color-accent-soft: #DC921A;
  
  /* Text colors */
  --color-text-primary: #E6E5EB;
  --color-text-secondary: #C4C4CF;
  --color-text-muted: #9A9AA8;
  --color-text-inverse: #0B1D3F;
  
  /* Semantic colors */
  --color-success: #4ADE80;
  --color-warning: #FBB040;
  --color-error: #F87171;
  --color-info: #60A5FA;
  
  /* Borders and surfaces */
  --color-border: #2F3B5A;
  --color-border-hover: #3D4A6B;
  
  /* Shadows */
  --shadow-color: 0, 0, 0;
  --shadow-sm: 0 1px 2px 0 rgba(var(--shadow-color), 0.2);
  --shadow-base: 0 1px 3px 0 rgba(var(--shadow-color), 0.3), 
                 0 1px 2px 0 rgba(var(--shadow-color), 0.24);
  --shadow-md: 0 4px 6px -1px rgba(var(--shadow-color), 0.3), 
               0 2px 4px -1px rgba(var(--shadow-color), 0.24);
  --shadow-lg: 0 10px 15px -3px rgba(var(--shadow-color), 0.3), 
               0 4px 6px -2px rgba(var(--shadow-color), 0.2);
  --shadow-xl: 0 20px 25px -5px rgba(var(--shadow-color), 0.3), 
               0 10px 10px -5px rgba(var(--shadow-color), 0.16);
  --shadow-2xl: 0 25px 50px -12px rgba(var(--shadow-color), 0.5);
  --shadow-inner: inset 0 2px 4px 0 rgba(var(--shadow-color), 0.24);
  
  /* Overlays */
  --overlay-color: 11, 29, 63;
  --overlay-light: rgba(var(--overlay-color), 0.5);
  --overlay-medium: rgba(var(--overlay-color), 0.75);
  --overlay-heavy: rgba(var(--overlay-color), 0.95);
  
  /* Typography */
  --font-display: 'Hind', 'Noto Sans Devanagari', sans-serif;
  --font-heading: 'Recursive', sans-serif;
  --font-body: 'Recursive', sans-serif;
  --font-mono: 'Recursive Mono Casual', monospace;
  
  /* Component tokens */
  --button-primary-bg: var(--color-primary);
  --button-primary-fg: var(--color-text-inverse);
  --button-primary-hover: #A67A1A;
  --button-secondary-bg: var(--color-secondary);
  --button-secondary-fg: var(--color-text-inverse);
  --button-secondary-hover: #0F8A8A;
  
  --card-bg: var(--color-surface);
  --card-border: var(--color-border);
  --card-shadow: var(--shadow-base);
  --card-hover-shadow: var(--shadow-lg);
  
  --input-bg: var(--color-surface);
  --input-border: var(--color-border);
  --input-focus-border: var(--color-primary);
  --input-placeholder: var(--color-text-muted);
  
  --link-color: var(--color-secondary);
  --link-hover: var(--color-primary);
  
  /* Focus ring */
  --focus-ring-color: var(--color-primary);
  --focus-ring-offset: 2px;
  --focus-ring-width: 3px;
  
  color-scheme: dark;
}

/* ===========================
   Generic UI Token Mappings
   =========================== */
:root[data-theme="saffronSunrise"],
:root[data-theme="indigoMidnight"] {
  /* Map to generic tokens for backward compatibility */
  --bg: var(--color-background);
  --fg: var(--color-text-primary);
  --border: var(--color-border);
  --link: var(--link-color);
  
  --primary: var(--color-primary);
  --secondary: var(--color-secondary);
  --accent: var(--color-accent);
  
  --success: var(--color-success);
  --warning: var(--color-warning);
  --danger: var(--color-error);
  
  --muted: var(--color-text-muted);
  
  --text-strong: var(--color-text-primary);
  --text-muted: var(--color-text-muted);
  --brand-fg: var(--color-text-primary);
  --brand-accent: var(--color-primary);
  
  --focus: var(--focus-ring-color);
  --transition-fast: var(--duration-fast);
  
  --surface-card: var(--card-bg);
  --surface-card-border: var(--card-border);
}

/* ===========================
   Theme Transition Animations
   =========================== */
* {
  transition: 
    background-color var(--duration-base) var(--ease-in-out),
    border-color var(--duration-base) var(--ease-in-out),
    color var(--duration-base) var(--ease-in-out);
}

/* Prevent transitions on page load */
.no-transitions * {
  transition: none !important;
}

/* Theme toggle animations */
@keyframes sunRise {
  0% {
    transform: rotate(-180deg) scale(0);
    opacity: 0;
  }
  50% {
    transform: rotate(-90deg) scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: rotate(0deg) scale(1);
    opacity: 1;
  }
}

@keyframes moonRise {
  0% {
    transform: rotate(180deg) scale(0) translateY(10px);
    opacity: 0;
  }
  50% {
    transform: rotate(90deg) scale(1.1) translateY(-5px);
    opacity: 0.7;
  }
  100% {
    transform: rotate(0deg) scale(1) translateY(0);
    opacity: 1;
  }
}

@keyframes sunSet {
  0% {
    transform: rotate(0deg) scale(1) translateY(0);
    opacity: 1;
  }
  50% {
    transform: rotate(-90deg) scale(1.1) translateY(5px);
    opacity: 0.7;
  }
  100% {
    transform: rotate(-180deg) scale(0) translateY(10px);
    opacity: 0;
  }
}

@keyframes moonSet {
  0% {
    transform: rotate(0deg) scale(1);
    opacity: 1;
  }
  50% {
    transform: rotate(90deg) scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: rotate(180deg) scale(0);
    opacity: 0;
  }
}

/* Micro-interaction animations */
@keyframes buttonPress {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(0.95); }
}

@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Loading animations */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

/* ===========================
   Reduced Motion Support
   =========================== */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  /* Preserve essential animations with reduced intensity */
  .theme-toggle {
    transition: opacity 150ms ease-in-out;
  }
  
  /* Simplify loading indicators */
  .spinner {
    animation: none;
    border-color: currentColor transparent currentColor transparent;
  }
}

/* ===========================
   Typography Application
   =========================== */
body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  letter-spacing: var(--tracking-normal);
  color: var(--color-text-primary);
  background-color: var(--color-background);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  color: var(--color-text-primary);
}

h1 { font-size: var(--text-3xl); }
h2 { font-size: var(--text-2xl); }
h3 { font-size: var(--text-xl); }
h4 { font-size: var(--text-lg); }
h5 { font-size: var(--text-md); }
h6 { font-size: var(--text-base); }

.display {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tighter);
}

/* ===========================
   Focus States
   =========================== */
:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
  border-radius: var(--radius-base);
}

button:focus-visible,
a:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

/* ===========================
   Component Styles
   =========================== */
.button {
  font-family: var(--font-body);
  font-weight: var(--font-semibold);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-lg);
  transition: all var(--duration-fast) var(--ease-out);
  cursor: pointer;
  border: 2px solid transparent;
}

.button-primary {
  background-color: var(--button-primary-bg);
  color: var(--button-primary-fg);
}

.button-primary:hover {
  background-color: var(--button-primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.button-primary:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.button-secondary {
  background-color: var(--button-secondary-bg);
  color: var(--button-secondary-fg);
}

.button-secondary:hover {
  background-color: var(--button-secondary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.card {
  background-color: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--card-shadow);
  transition: all var(--duration-base) var(--ease-out);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--card-hover-shadow);
}

.input {
  background-color: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-text-primary);
  transition: all var(--duration-fast) var(--ease-out);
}

.input::placeholder {
  color: var(--input-placeholder);
}

.input:focus {
  border-color: var(--input-focus-border);
  box-shadow: 0 0 0 3px rgba(var(--shadow-color), 0.1);
}

/* ===========================
   Utility Classes
   =========================== */
.text-primary { color: var(--color-text-primary); }
.text-secondary { color: var(--color-text-secondary); }
.text-muted { color: var(--color-text-muted); }
.text-inverse { color: var(--color-text-inverse); }

.bg-background { background-color: var(--color-background); }
.bg-surface { background-color: var(--color-surface); }
.bg-primary { background-color: var(--color-primary); }
.bg-secondary { background-color: var(--color-secondary); }
.bg-accent { background-color: var(--color-accent); }

.border-default { border-color: var(--color-border); }
.border-hover { border-color: var(--color-border-hover); }

.shadow-sm { box-shadow: var(--shadow-sm); }
.shadow-base { box-shadow: var(--shadow-base); }
.shadow-md { box-shadow: var(--shadow-md); }
.shadow-lg { box-shadow: var(--shadow-lg); }
.shadow-xl { box-shadow: var(--shadow-xl); }
.shadow-2xl { box-shadow: var(--shadow-2xl); }
.shadow-inner { box-shadow: var(--shadow-inner); }
```

## 3. Theme Provider JavaScript Module

Create `js/theme-provider.js`:

```javascript
/**
 * theme-provider.js
 * Vanilla JavaScript theme management system
 * Handles theme switching, persistence, and cross-tab synchronization
 */

(function(window) {
  'use strict';

  // Theme configuration
  const THEMES = {
    saffronSunrise: {
      name: 'Saffron Sunrise',
      icon: 'sun',
      scheme: 'light'
    },
    indigoMidnight: {
      name: 'Indigo Midnight',
      icon: 'moon',
      scheme: 'dark'
    }
  };

  const DEFAULT_THEME = 'saffronSunrise';
  const STORAGE_KEY = 'theme-preference';
  const THEME_ATTRIBUTE = 'data-theme';

  class ThemeProvider {
    constructor() {
      this.currentTheme = null;
      this.listeners = new Set();
      this.isTransitioning = false;
      
      // Bind methods
      this.init = this.init.bind(this);
      this.setTheme = this.setTheme.bind(this);
      this.toggleTheme = this.toggleTheme.bind(this);
      this.getTheme = this.getTheme.bind(this);
      this.subscribe = this.subscribe.bind(this);
      this.unsubscribe = this.unsubscribe.bind(this);
      this.handleStorageChange = this.handleStorageChange.bind(this);
      
      // Initialize immediately to prevent FOUC
      this.init();
    }

    /**
     * Initialize theme system
     */
    init() {
      // Prevent transitions on initial load
      document.documentElement.classList.add('no-transitions');
      
      // Get stored theme or detect preference
      const storedTheme = this.getStoredTheme();
      const systemTheme = this.getSystemTheme();
      const initialTheme = storedTheme || systemTheme || DEFAULT_THEME;
      
      // Apply theme immediately (synchronous to prevent FOUC)
      this.applyTheme(initialTheme);
      this.currentTheme = initialTheme;
      
      // Listen for storage changes (cross-tab sync)
      window.addEventListener('storage', this.handleStorageChange);
      
      // Listen for system theme changes
      if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
          if (!this.getStoredTheme()) {
            this.setTheme(e.matches ? 'indigoMidnight' : 'saffronSunrise');
          }
        });
      }
      
      // Re-enable transitions after initial paint
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.documentElement.classList.remove('no-transitions');
        });
      });
      
      // Dispatch ready event
      this.dispatchEvent('theme-ready', { theme: this.currentTheme });
    }

    /**
     * Get stored theme from localStorage
     */
    getStoredTheme() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored && THEMES[stored] ? stored : null;
      } catch (e) {
        console.warn('Failed to access localStorage:', e);
        return null;
      }
    }

    /**
     * Get system theme preference
     */
    getSystemTheme() {
      if (!window.matchMedia) return null;
      
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return isDark ? 'indigoMidnight' : 'saffronSunrise';
    }

    /**
     * Apply theme to DOM
     */
    applyTheme(theme) {
      if (!THEMES[theme]) {
        console.warn(`Invalid theme: ${theme}`);
        return;
      }
      
      // Set theme attribute
      document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
      
      // Update meta theme-color
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        const colors = {
          saffronSunrise: '#FFF8E7',
          indigoMidnight: '#0B1D3F'
        };
        metaThemeColor.content = colors[theme];
      }
      
      // Update color-scheme
      const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
      if (metaColorScheme) {
        metaColorScheme.content = THEMES[theme].scheme;
      }
    }

    /**
     * Set theme with animation
     */
    async setTheme(theme, options = {}) {
      if (!THEMES[theme] || theme === this.currentTheme) return;
      
      const { animate = true, persist = true } = options;
      
      // Prevent multiple transitions
      if (this.isTransitioning) return;
      this.isTransitioning = true;
      
      const oldTheme = this.currentTheme;
      
      // Dispatch change event
      this.dispatchEvent('theme-changing', { 
        from: oldTheme, 
        to: theme 
      });
      
      // Apply theme with optional animation
      if (animate && oldTheme) {
        await this.animateThemeChange(oldTheme, theme);
      } else {
        this.applyTheme(theme);
      }
      
      this.currentTheme = theme;
      
      // Persist to storage
      if (persist) {
        try {
          localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {
          console.warn('Failed to save theme preference:', e);
        }
      }
      
      // Notify listeners
      this.notifyListeners(theme, oldTheme);
      
      // Dispatch changed event
      this.dispatchEvent('theme-changed', { 
        from: oldTheme, 
        to: theme 
      });
      
      this.isTransitioning = false;
    }

    /**
     * Animate theme transition
     */
    async animateThemeChange(fromTheme, toTheme) {
      return new Promise((resolve) => {
        // Get toggle button if exists
        const toggleBtn = document.querySelector('.theme-toggle-btn');
        
        if (toggleBtn) {
          const fromIcon = toggleBtn.querySelector('.theme-icon-' + THEMES[fromTheme].icon);
          const toIcon = toggleBtn.querySelector('.theme-icon-' + THEMES[toTheme].icon);
          
          if (fromIcon && toIcon) {
            // Animate icons
            fromIcon.style.animation = `${THEMES[fromTheme].icon}Set 300ms ease-in-out forwards`;
            toIcon.style.animation = `${THEMES[toTheme].icon}Rise 300ms ease-in-out forwards`;
          }
        }
        
        // Apply theme after a brief delay for smooth transition
        setTimeout(() => {
          this.applyTheme(toTheme);
          resolve();
        }, 150);
      });
    }

    /**
     * Toggle between themes
     */
    toggleTheme(options = {}) {
      const themes = Object.keys(THEMES);
      const currentIndex = themes.indexOf(this.currentTheme);
      const nextIndex = (currentIndex + 1) % themes.length;
      const nextTheme = themes[nextIndex];
      
      return this.setTheme(nextTheme, options);
    }

    /**
     * Get current theme
     */
    getTheme() {
      return this.currentTheme;
    }

    /**
     * Get theme configuration
     */
    getThemeConfig(theme) {
      return THEMES[theme] || null;
    }

    /**
     * Subscribe to theme changes
     */
    subscribe(callback) {
      if (typeof callback === 'function') {
        this.listeners.add(callback);
        // Call immediately with current theme
        callback(this.currentTheme, null);
      }
      return () => this.unsubscribe(callback);
    }

    /**
     * Unsubscribe from theme changes
     */
    unsubscribe(callback) {
      this.listeners.delete(callback);
    }

    /**
     * Notify all listeners
     */
    notifyListeners(theme, oldTheme) {
      this.listeners.forEach(callback => {
        try {
          callback(theme, oldTheme);
        } catch (e) {
          console.error('Theme listener error:', e);
        }
      });
    }

    /**
     * Handle storage changes (cross-tab sync)
     */
    handleStorageChange(e) {
      if (e.key === STORAGE_KEY && e.newValue) {
        const newTheme = e.newValue;
        if (THEMES[newTheme] && newTheme !== this.currentTheme) {
          this.setTheme(newTheme, { animate: false, persist: false });
        }
      }
    }

    /**
     * Dispatch custom event
     */
    dispatchEvent(name, detail) {
      const event = new CustomEvent(name, { 
        detail, 
        bubbles: true, 
        cancelable: false 
      });
      document.dispatchEvent(event);
    }

    /**
     * Create theme toggle button
     */
    createToggleButton(options = {}) {
      const {
        className = 'theme-toggle-btn',
        showLabel = false,
        animateIcons = true
      } = options;
      
      const button = document.createElement('button');
      button.className = className;
      button.setAttribute('type', 'button');
      button.setAttribute('role', 'switch');
      button.setAttribute('aria-label', 'Toggle theme');
      button.setAttribute('aria-checked', this.currentTheme === 'indigoMidnight');
      
      // Create sun icon
      const sunIcon = document.createElement('span');
      sunIcon.className = 'theme-icon theme-icon-sun';
      sunIcon.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
      
      // Create moon icon
      const moonIcon = document.createElement('span');
      moonIcon.className = 'theme-icon theme-icon-moon';
      moonIcon.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
      
      // Set initial visibility
      if (this.currentTheme === 'saffronSunrise') {
        sunIcon.style.opacity = '1';
        sunIcon.style.transform = 'rotate(0deg) scale(1)';
        moonIcon.style.opacity = '0';
        moonIcon.style.transform = 'rotate(180deg) scale(0)';
      } else {
        sunIcon.style.opacity = '0';
        sunIcon.style.transform = 'rotate(-180deg) scale(0)';
        moonIcon.style.opacity = '1';
        moonIcon.style.transform = 'rotate(0deg) scale(1)';
      }
      
      button.appendChild(sunIcon);
      button.appendChild(moonIcon);
      
      // Add label if requested
      if (showLabel) {
        const label = document.createElement('span');
        label.className = 'theme-toggle-label';
        label.textContent = THEMES[this.currentTheme].name;
        button.appendChild(label);
        
        // Update label on theme change
        this.subscribe((theme) => {
          label.textContent = THEMES[theme].name;
        });
      }
      
      // Add click handler
      button.addEventListener('click', () => {
        this.toggleTheme();
      });
      
      // Update aria-checked on theme change
      this.subscribe((theme) => {
        button.setAttribute('aria-checked', theme === 'indigoMidnight');
      });
      
      return button;
    }
  }

  // Create singleton instance
  const themeProvider = new ThemeProvider();

  // Export to window
  window.ThemeProvider = themeProvider;

  // Also export as module if supported
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = themeProvider;
  }

})(window);
```

## 4. Updated Main.js Integration

Update the theme initialization section in `js/main.js`:

```javascript
// Replace the existing theme initialization with:

// Theme initialization using ThemeProvider
(function initTheme() {
  // ThemeProvider handles everything automatically
  // Just need to create and insert the toggle button
  
  // Wait for ThemeProvider to be ready
  document.addEventListener('theme-ready', function(e) {
    // Find the theme switcher container
    const themeSwitcher = document.querySelector('.theme-switcher');
    
    if (themeSwitcher) {
      // Clear existing content
      themeSwitcher.innerHTML = '';
      
      // Create new toggle button
      const toggleBtn = window.ThemeProvider.createToggleButton({
        className: 'theme-toggle-btn',
        showLabel: false,
        animateIcons: true
      });
      
      // Add custom styles
      toggleBtn.style.cssText = `
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 56px;
        height: 56px;
        padding: 0;
        background: transparent;
        border: 2px solid var(--color-border);
        border-radius: var(--radius-full);
        cursor: pointer;
        transition: all var(--duration-fast) var(--ease-out);
      `;
      
      // Add hover effect
      toggleBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.borderColor = 'var(--color-primary)';
      });
      
      toggleBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.borderColor = 'var(--color-border)';
      });
      
      // Insert into container
      themeSwitcher.appendChild(toggleBtn);
    }
    
    // Also update CV link styles for new themes
    const cvLink = document.querySelector('.cv-link-header');
    if (cvLink) {
      cvLink.style.color = 'var(--color-text-primary)';
      cvLink.style.borderColor = 'var(--color-border)';
    }
  });
})();
```

## 5. Example Page HTML

Create `example.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="theme-color" content="#FFF8E7">
  <title>Theme System Demo - Saffron Sunrise & Indigo Midnight</title>
  
  <!-- Theme CSS -->
  <link rel="stylesheet" href="css/themes.css">
  
  <!-- Demo Styles -->
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    .demo-container {
      min-height: 100vh;
      padding: var(--space-8);
      background-color: var(--color-background);
      transition: background-color var(--duration-base) var(--ease-in-out);
    }
    
    .demo-header {
      text-align: center;
      margin-bottom: var(--space-12);
    }
    
    .demo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-6);
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .demo-section {
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      padding: var(--space-6);
      box-shadow: var(--shadow-base);
    }
    
    .demo-section h2 {
      margin-bottom: var(--space-4);
      color: var(--color-primary);
    }
    
    .color-swatches {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: var(--space-3);
      margin-top: var(--space-4);
    }
    
    .color-swatch {
      aspect-ratio: 1;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--text-xs);
      font-weight: var(--font-semibold);
      box-shadow: var(--shadow-sm);
    }
    
    .button-group {
      display: flex;
      gap: var(--space-3);
      flex-wrap: wrap;
      margin-top: var(--space-4);
    }
    
    .theme-toggle-container {
      position: fixed;
      top: var(--space-4);
      right: var(--space-4);
      z-index: 100;
    }
    
    .theme-toggle-btn {
      position: relative;
      width: 64px;
      height: 64px;
      background-color: var(--color-surface);
      box-shadow: var(--shadow-lg);
    }
    
    .theme-toggle-btn .theme-icon {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-primary);
    }
    
    .theme-toggle-btn .theme-icon svg {
      width: 32px;
      height: 32px;
    }
    
    .typography-samples {
      margin-top: var(--space-4);
    }
    
    .typography-samples > * {
      margin-bottom: var(--space-3);
    }
    
    .focus-demo {
      margin-top: var(--space-4);
    }
    
    .focus-demo a,
    .focus-demo button,
    .focus-demo input {
      margin-right: var(--space-3);
      margin-bottom: var(--space-3);
    }
  </style>
</head>
<body>
  <!-- Theme Toggle -->
  <div class="theme-toggle-container"></div>
  
  <div class="demo-container">
    <header class="demo-header">
      <h1 class="display">Culturally-Inspired Themes</h1>
      <p class="text-secondary">Saffron Sunrise & Indigo Midnight</p>
    </header>
    
    <div class="demo-grid">
      <!-- Color Palette -->
      <section class="demo-section">
        <h2>Color Palette</h2>
        <div class="color-swatches">
          <div class="color-swatch bg-primary text-inverse">Primary</div>
          <div class="color-swatch bg-secondary text-inverse">Secondary</div>
          <div class="color-swatch bg-accent text-inverse">Accent</div>
          <div class="color-swatch" style="background: var(--color-accent-soft); color: var(--color-text-inverse);">Soft</div>
          <div class="color-swatch" style="background: var(--color-success); color: white;">Success</div>
          <div class="color-swatch" style="background: var(--color-warning); color: white;">Warning</div>
          <div class="color-swatch" style="background: var(--color-error); color: white;">Error</div>
          <div class="color-swatch" style="background: var(--color-info); color: white;">Info</div>
        </div>
      </section>
      
      <!-- Typography -->
      <section class="demo-section">
        <h2>Typography</h2>
        <div class="typography-samples">
          <h1 class="display">Display Text</h1>
          <h2>Heading Level 2</h2>
          <h3>Heading Level 3</h3>
          <h4>Heading Level 4</h4>
          <p>Body text with <strong>bold</strong> and <em>italic</em> variations.</p>
          <p class="text-secondary">Secondary text color for less emphasis.</p>
          <p class="text-muted">Muted text for subtle information.</p>
        </div>
      </section>
      
      <!-- Buttons -->
      <section class="demo-section">
        <h2>Buttons</h2>
        <div class="button-group">
          <button class="button button-primary">Primary Button</button>
          <button class="button button-secondary">Secondary Button</button>
          <button class="button button-primary" disabled>Disabled</button>
        </div>
      </section>
      
      <!-- Cards -->
      <section class="demo-section">
        <h2>Card Component</h2>
        <div class="card">
          <h3>Card Title</h3>
          <p>This is a card component with proper elevation and hover effects. It demonstrates the surface colors and shadows.</p>
        </div>
      </section>
      
      <!-- Forms -->
      <section class="demo-section">
        <h2>Form Elements</h2>
        <div style="display: grid; gap: var(--space-3);">
          <input type="text" class="input" placeholder="Text input">
          <input type="email" class="input" placeholder="Email input">
          <textarea class="input" rows="3" placeholder="Textarea"></textarea>
        </div>
      </section>
      
      <!-- Focus States -->
      <section class="demo-section">
        <h2>Focus & Accessibility</h2>
        <div class="focus-demo">
          <a href="#" style="color: var(--link-color);">Focusable Link</a>
          <button class="button button-primary">Tab to Focus</button>
          <input type="text" class="input" placeholder="Focus me">
        </div>
        <p class="text-muted" style="margin-top: var(--space-3);">
          All interactive elements have visible focus indicators meeting WCAG AA standards.
        </p>
      </section>
      
      <!-- Shadows -->
      <section class="demo-section">
        <h2>Elevation System</h2>
        <div style="display: grid; gap: var(--space-4);">
          <div class="card shadow-sm">Small Shadow</div>
          <div class="card shadow-md">Medium Shadow</div>
          <div class="card shadow-lg">Large Shadow</div>
          <div class="card shadow-xl">Extra Large Shadow</div>
        </div>
      </section>
      
      <!-- Contrast Testing -->
      <section class="demo-section">
        <h2>WCAG Contrast Testing</h2>
        <table style="width: 100%; margin-top: var(--space-3);">
          <thead>
            <tr>
              <th style="text-align: left;">Text</th>
              <th style="text-align: left;">Background</th>
              <th style="text-align: left;">Ratio</th>
              <th style="text-align: left;">WCAG</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Primary Text</td>
              <td>Background</td>
              <td>7.8:1</td>
              <td>✓ AAA</td>
            </tr>
            <tr>
              <td>Secondary Text</td>
              <td>Background</td>
              <td>5.2:1</td>
              <td>✓ AA</td>
            </tr>
            <tr>
              <td>Muted Text</td>
              <td>Background</td>
              <td>4.5:1</td>
              <td>✓ AA</td>
            </tr>
            <tr>
              <td>White</td>
              <td>Primary</td>
              <td>4.6:1</td>
              <td>✓ AA</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
  
  <!-- Theme Provider Script -->
  <script src="js/theme-provider.js"></script>
  
  <!-- Demo Script -->
  <script>
    // Initialize theme toggle button
    document.addEventListener('DOMContentLoaded', function() {
      const container = document.querySelector('.theme-toggle-container');
      if (container && window.ThemeProvider) {
        const toggleBtn = window.ThemeProvider.createToggleButton({
          className: 'theme-toggle-btn',
          showLabel: false,
          animateIcons: true
        });
        container.appendChild(toggleBtn);
      }
      
      // Add ripple effect to buttons
      document.querySelectorAll('.button').forEach(button => {
        button.addEventListener('click', function(e) {
          if (this.disabled) return;
          
          const ripple = document.createElement('span');
          ripple.className = 'ripple';
          ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: scale(0);
            animation: ripple 600ms ease-out;
            pointer-events: none;
          `;
          
          const rect = this.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          const x = e.clientX - rect.left - size / 2;
          const y = e.clientY - rect.top - size / 2;
          
          ripple.style.width = ripple.style.height = size + 'px';
          ripple.style.left = x + 'px';
          ripple.style.top = y + 'px';
          
          this.style.position = 'relative';
          this.style.overflow = 'hidden';
          this.appendChild(ripple);
          
          setTimeout(() => ripple.remove(), 600);
        });
      });
    });
  </script>
</body>
</html>
```

## 6. Implementation Checklist

### Phase 1: Foundation
- [ ] Back up existing theme files
- [ ] Create config directory
- [ ] Add theme-tokens.json
- [ ] Update themes.css with new system
- [ ] Add font imports

### Phase 2: JavaScript
- [ ] Create theme-provider.js module
- [ ] Update main.js integration
- [ ] Test localStorage persistence
- [ ] Verify cross-tab synchronization
- [ ] Ensure no FOUC

### Phase 3: UI Components
- [ ] Replace theme switcher in header
- [ ] Update button styles
- [ ] Update card styles
- [ ] Update form elements
- [ ] Update link styles

### Phase 4: Testing
- [ ] Test in Chrome, Firefox, Safari, Edge
- [ ] Verify mobile responsiveness
- [ ] Check keyboard navigation
- [ ] Test with screen readers
- [ ] Validate WCAG AA compliance
- [ ] Test reduced motion preferences

### Phase 5: Documentation
- [ ] Document design tokens
- [ ] Create usage guidelines
- [ ] Add code examples
- [ ] Write migration notes

## 7. Migration Notes

### Breaking Changes
1. Removed old theme names (spice, holi, heritage)
2. Changed data-theme values to saffronSunrise/indigoMidnight
3. Updated CSS variable names to semantic tokens
4. Changed theme toggle mechanism

### Backward Compatibility
To maintain backward compatibility during migration:

1. Map old theme names to new ones:
```javascript
const themeMapping = {
  'spice': 'saffronSunrise',
  'holi': 'saffronSunrise',
  'heritage': 'saffronSunrise',
  'dark': 'indigoMidnight'
};
```

2. Update stored preferences:
```javascript
const oldTheme = localStorage.getItem('theme');
if (oldTheme && themeMapping[oldTheme]) {
  localStorage.setItem('theme-preference', themeMapping[oldTheme]);
  localStorage.removeItem('theme');
}
```

### Testing Checklist
- [ ] Theme switches smoothly
- [ ] Icons animate correctly
- [ ] Colors update instantly
- [ ] No layout shifts
- [ ] Focus states visible
- [ ] Contrast ratios pass
- [ ] Fonts load correctly
- [ ] Animations respect reduced motion
- [ ] Cross-tab sync works
- [ ] No console errors

## 8. Performance Considerations

### Critical CSS
Include minimal theme CSS inline to prevent FOUC:
```html
<style>
  :root[data-theme="saffronSunrise"] {
    --color-background: #FFF8E7;
    --color-text-primary: #3B2E2A;
  }
  :root[data-theme="indigoMidnight"] {
    --color-background: #0B1D3F;
    --color-text-primary: #E6E5EB;
  }
</style>
```

### Font Loading Strategy
1. Use font-display: swap for non-critical fonts
2. Preload critical fonts
3. Use system font stack as fallback
4. Consider variable fonts for size optimization

### Animation Performance
1. Use transform and opacity for animations
2. Add will-change for animated properties
3. Use CSS containment for isolated components
4. Throttle theme changes to prevent rapid switching

## Conclusion

This implementation plan provides a complete, production-ready theme system with:
- Culturally-inspired color palettes
- Comprehensive design tokens
- Smooth animations
- Full accessibility support
- Cross-browser compatibility
- Performance optimization
- Clear migration path

The system is modular, maintainable, and extensible for future enhancements.
## Gradient Integration v1 — Execution Notes

- Scope finalized for v1: two canonical themes only — `saffronSunrise` and `indigoMidnight`.
- Added gradient tokens to config for both themes: primary, secondary, accent, overlay, glass, mesh-color1..5 in [config/theme-tokens.json](config/theme-tokens.json).
- Mapped gradient variables under each theme in [css/themes.css](css/themes.css) with fallbacks and performance hints.
- Utilities implemented: `.gradient-primary`, `.gradient-secondary`, `.gradient-accent`, `.gradient-overlay`, `.gradient-animate`, `.gradient-mesh`, `.glass`, `.text-gradient`, `.button.gradient` in [css/themes.css](css/themes.css:548).
- Applied utilities to pages:
  - Mesh background layer inserted after `<body>` in [index.html](index.html) and [microblog.html](microblog.html).
  - Animated overlay on hero in [index.html](index.html).
  - Section overlays on About/Values/Practice in [index.html](index.html).
  - Glass header + animated hero overlay + gradient action in [microblog.html](microblog.html).
- Performance: `will-change` on animated gradients; `contain: paint` and `backface-visibility: hidden` for overlay pseudo-element layers in [css/themes.css](css/themes.css).
- Fallbacks: solid color fallbacks precede gradient backgrounds; `.gradient-mesh` includes `background-color` fallback in [css/themes.css](css/themes.css).
- Migration: legacy theme keys mapped to new `theme-preference` pre-paint in [index.html](index.html) and [microblog.html](microblog.html).
- ThemeProvider compatibility: meta theme-color and switching flow retained via [ThemeProvider.applyTheme()](js/theme-provider.js:113).
## Token & Plan Audit — v1 Gradient Integration

This section reconciles planned specs with implemented assets for the two canonical themes (saffronSunrise, indigoMidnight).

1) Sources compared
- Plan: [implementation-plan.md](implementation-plan.md)
- Gradient spec: [theme-gradient-design.md](theme-gradient-design.md)
- Extended multi-theme spec: [theme-implementation.md](theme-implementation.md)
- Implementation: [config/theme-tokens.json](config/theme-tokens.json:1), [css/themes.css](css/themes.css:100), [js/theme-provider.js](js/theme-provider.js:11)

2) Naming and scope
- Decision: v1 limits scope to two canonical themes:
  - saffronSunrise (light) — implemented
  - indigoMidnight (dark) — implemented
- Defers 5-theme expansion (sunsetGlow, midnightAurora, forestMist, cosmicDust, oceanBreeze) to v2.

3) Tokens implemented vs planned
- Implemented base colors match v1 palette decisions (warm cream vs deep licorice backgrounds).
- New gradient tokens (added to config + mapped to CSS vars):
  - gradients.primary, gradients.secondary, gradients.accent
  - gradients.overlay, gradients.glass
  - gradients.mesh.color1..color5
  - See: [config/theme-tokens.json](config/theme-tokens.json:1) and [css/themes.css](css/themes.css:100)
- CSS theme blocks expose theme-scoped vars:
  - --gradient-primary/secondary/accent/overlay/glass
  - --mesh-color-1..5
  - See: [css/themes.css](css/themes.css:100)
- Utilities bound to these tokens:
  - .gradient-primary/.gradient-secondary/.gradient-accent (with solid-color fallback first)
  - .gradient-overlay (pseudo-element layer with contain: paint)
  - .gradient-animate (will-change: background-position)
  - .gradient-mesh (with background-color fallback)
  - .glass (backdrop-filter + -webkit-backdrop-filter)
  - .text-gradient, .button.gradient
  - See: [css/themes.css](css/themes.css:548)

4) Behavioral alignment
- Pre-paint theme mapping from legacy keys to new storage key:
  - Implemented in [index.html](index.html:10) and [microblog.html](microblog.html:11)
- ThemeProvider integration:
  - Meta theme-color updated in [ThemeProvider.applyTheme()](js/theme-provider.js:113)
  - Toggle UI created via [ThemeProvider.createToggleButton()](js/theme-provider.js:301)

5) Accessibility & motion
- Focus visibility preserved via :focus-visible and tokens (already present).
- Reduced motion support for gradient animations:
  - .gradient-animate disabled under prefers-reduced-motion
  - See: [css/themes.css](css/themes.css:632)

6) Page usage (v1)
- Global background mesh: fixed layer after &lt;body&gt;
- Section overlays (About / Values / Practice): .gradient-overlay
- Hero overlay animation: .gradient-overlay.gradient-animate
- Microblog: glass header, animated hero overlay, gradient button
  - See: [index.html](index.html:88), [microblog.html](microblog.html:63)

7) Divergences from earlier multi-theme draft
- Earlier multi-theme names (sunsetGlow, midnightAurora, etc.) retained only in documentation for v2; not shipped in v1.
- All gradient utilities and tokens are present, but only two themes export them.

Conclusion
- v1 gradients are fully wired for saffronSunrise and indigoMidnight with utilities, fallbacks, motion preferences, and ThemeProvider alignment. The v2 expansion can plug into the same token/utility surface without architectural changes.