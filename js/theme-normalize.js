/**
 * theme-normalize.js
 * Keep the theme toggle clean and consistent between localhost and production.
 *
 * Behavior:
 * - Finds .theme-toggle-btn and removes its native title unless data-keep-title="1" is present.
 * - Re-applies the above on ThemeProvider updates and DOM mutations.
 */
(function () {
  'use strict';

  function removeTitle(el) {
    try {
      // Respect explicit opt-out from stripping the native title
      if (el && typeof el.getAttribute === 'function' && el.getAttribute('data-keep-title') === '1') return;
      el.removeAttribute('title');
    } catch (_) {}
  }




  function sanitizeButton(btn) {
    if (!btn) return;
    // Preserve title when data-keep-title="1"; otherwise remove stray legacy titles
    removeTitle(btn);
  }

  function locateAndSanitize() {
    var btn = document.querySelector('.theme-toggle-btn');
    if (btn) sanitizeButton(btn);
    // If ThemeProvider exists, subscribe to keep state clean on theme change
    if (window.ThemeProvider && typeof window.ThemeProvider.subscribe === 'function') {
      // Guard: only subscribe once
      if (!window.__themeNormalizeSub) {
        window.__themeNormalizeSub = window.ThemeProvider.subscribe(function () {
          var b = document.querySelector('.theme-toggle-btn');
          if (b) sanitizeButton(b);
        });
      }
    }
  }

  function start() {
    locateAndSanitize();
  
    // Observe dynamic changes where the toggle might be re-rendered by other scripts
    try {
      var mo = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
          var m = mutations[i];
          if (m.type === 'childList') {
            // If the toggle appears, sanitize again
            if (document.querySelector('.theme-toggle-btn')) {
              locateAndSanitize();
            }
          }
        }
      });
      mo.observe(document.body, { childList: true, subtree: true });
    } catch (_) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }

  // Also run when ThemeProvider reports ready
  document.addEventListener('theme-ready', function () {
    setTimeout(start, 0);
  });
})();