/**
 * theme-provider.js
 * Vanilla JavaScript theme management system
 * Handles theme switching, persistence, and cross-tab synchronization
 */

(function(window) {
  'use strict';

  // Theme configuration
  const THEMES = {
    sunsetGlow: {
      name: 'Sunset Glow',
      icon: 'sun',
      scheme: 'light'
    },
    midnightAurora: {
      name: 'Midnight Aurora',
      icon: 'moon',
      scheme: 'dark'
    },
    forestMist: {
      name: 'Forest Mist',
      icon: 'leaf',
      scheme: 'light'
    },
    cosmicDust: {
      name: 'Cosmic Dust',
      icon: 'star',
      scheme: 'dark'
    },
    oceanBreeze: {
      name: 'Ocean Breeze',
      icon: 'wave',
      scheme: 'light'
    }
  };

  const DEFAULT_THEME = 'sunsetGlow';
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
            this.setTheme(e.matches ? 'midnightAurora' : 'sunsetGlow');
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
      return isDark ? 'midnightAurora' : 'sunsetGlow';
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
          sunsetGlow: '#FFFBF5',
          midnightAurora: '#0A0E27',
          forestMist: '#F7FFF7',
          cosmicDust: '#0C0C1E',
          oceanBreeze: '#F0F9FF'
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
        const toggleBtn = document.querySelector('.theme-toggle-btn');
        const swatch = toggleBtn ? toggleBtn.querySelector('.color-swatch') : null;

        if (swatch) {
          swatch.style.transition = 'transform 150ms var(--ease-out, ease)';
          swatch.style.transform = 'scale(0.85)';
        }

        setTimeout(() => {
          this.applyTheme(toTheme);
          if (swatch) {
            requestAnimationFrame(() => {
              swatch.style.transform = 'scale(1)';
            });
          }
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
        showLabel = false
      } = options;

      const button = document.createElement('button');
      button.className = className;
      button.setAttribute('type', 'button');
      button.setAttribute('role', 'switch');
      button.setAttribute('aria-label', 'Toggle theme');
      button.setAttribute('aria-checked', (THEMES[this.currentTheme]?.scheme === 'dark'));

      // Color box (outer) + inner swatch that reflects current theme
      const box = document.createElement('span');
      box.className = 'color-box';
      box.style.cssText = [
        'display:inline-flex',
        'align-items:center',
        'justify-content:center',
        'width:28px',
        'height:28px',
        'border-radius: var(--radius-md, 6px)',
        'border: 2px solid var(--color-border)',
        'background: var(--color-surface)',
        'box-shadow: var(--shadow-sm, 0 1px 2px rgba(0,0,0,.06))'
      ].join(';') + ';';

      const swatch = document.createElement('span');
      swatch.className = 'color-swatch';
      swatch.style.cssText = [
        'display:block',
        'width:18px',
        'height:18px',
        'border-radius: var(--radius-sm, 4px)',
        'background: var(--gradient-primary, var(--color-primary))',
        'transition: transform 150ms var(--ease-out, ease), background 150ms var(--ease-out, ease)'
      ].join(';') + ';';

      box.appendChild(swatch);
      button.appendChild(box);

      if (showLabel) {
        const label = document.createElement('span');
        label.className = 'theme-toggle-label';
        label.style.marginLeft = '8px';
        label.textContent = THEMES[this.currentTheme].name;
        button.appendChild(label);

        this.subscribe((theme) => {
          label.textContent = THEMES[theme].name;
        });
      }

      // Click toggles to next theme (cycles across all registered themes)
      button.addEventListener('click', () => {
        this.toggleTheme();
      });

      // Update aria-checked (true when current scheme is dark)
      this.subscribe((theme) => {
        const isDark = !!(THEMES[theme] && THEMES[theme].scheme === 'dark');
        button.setAttribute('aria-checked', String(isDark));
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