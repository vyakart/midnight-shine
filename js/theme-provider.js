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