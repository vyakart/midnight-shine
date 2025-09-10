/**
 * theme-normalize.js
 * Ensure consistent UI between localhost and production by removing any native browser tooltips
 * and legacy tooltip remnants on the theme toggle produced by older bundles.
 *
 * Behavior:
 * - Finds .theme-toggle-btn and removes its title attribute (prevents native hover tooltip).
 * - Cleans aria-describedby of any theme-tooltip-* references.
 * - Removes any .theme-tooltip elements left in DOM.
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

  function stripTooltipDescribedBy(el) {
    try {
      var val = el.getAttribute('aria-describedby');
      if (!val) return;
      var ids = val.split(/\s+/).filter(Boolean);
      var filtered = ids.filter(function (id) { return !/^theme-tooltip-/.test(id); });
      if (filtered.length) {
        el.setAttribute('aria-describedby', filtered.join(' '));
      } else {
        el.removeAttribute('aria-describedby');
      }
    } catch (_) {}
  }

  function removeTooltipNodes() {
    try {
      var nodes = document.querySelectorAll('.theme-tooltip');
      nodes.forEach(function (n) { n.parentNode && n.parentNode.removeChild(n); });
    } catch (_) {}
  }

  // Inject minimal CSS so the theme name appears on hover/focus of the toggle.
  // This avoids depending on a rebuilt dist stylesheet.
  function ensureTooltipStyle() {
    try {
      var id = 'theme-toggle-tooltip-style';
      if (document.getElementById(id)) return;
      var css = [
        '.theme-toggle-btn::after{',
          'content:attr(data-tooltip);position:absolute;left:50%;bottom:-32px;',
          'transform:translateX(-50%) translateY(-2px);font:600 12px/1 var(--font-sans, system-ui);',
          'color:var(--color-text-primary);background:var(--color-surface);',
          'border:1px solid var(--color-border);border-radius:6px;padding:2px 6px;',
          'white-space:nowrap;box-shadow:var(--shadow-sm, 0 1px 2px rgba(0,0,0,.06));',
          'opacity:0;pointer-events:none;transition:opacity 120ms var(--ease-out, ease);',
          'z-index:9999;',
        '}',
        '.theme-toggle-btn:hover::after,.theme-toggle-btn:focus-visible::after{opacity:1;}'
      ].join('');
      var style = document.createElement('style');
      style.id = id;
      style.textContent = css;
      (document.head || document.documentElement).appendChild(style);
    } catch (_) {}
  }

  function sanitizeButton(btn) {
    if (!btn) return;
    removeTitle(btn);
    stripTooltipDescribedBy(btn);
    removeTooltipNodes();
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
    ensureTooltipStyle();
  
    // Observe dynamic changes where the toggle might be re-rendered by other scripts
    try {
      var mo = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
          var m = mutations[i];
          if (m.type === 'childList') {
            // If the toggle appears or tooltip nodes get added, sanitize again
            if (document.querySelector('.theme-toggle-btn') || document.querySelector('.theme-tooltip')) {
              locateAndSanitize();
              ensureTooltipStyle();
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