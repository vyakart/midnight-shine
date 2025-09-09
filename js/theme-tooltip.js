/**
 * theme-tooltip.js
 * Progressive enhancement: accessible, localized tooltip for the theme toggle box.
 * - Hover: show after ~180ms; hide on mouseleave
 * - Keyboard: show on focus; hide on blur
 * - Touch: long-press (~500ms) to show; dismiss on outside tap or after 3s
 * - Role=tooltip; associated via aria-describedby; mirrored text in a visually hidden element
 * - Positions relative to trigger with top-preferred and smart flipping; 8–12px offset; clamped to viewport
 * - Updates text immediately on any theme change; no remounting of the selector element
 * - Respects prefers-reduced-motion and avoids pointer-event blocking/flicker on rapid toggles
 */
(function () {
  'use strict';

  // Known theme display names (English fallback)
  var THEME_NAMES = {
    sunsetGlow: 'Sunset Glow',
    midnightAurora: 'Midnight Aurora',
    forestMist: 'Forest Mist',
    cosmicDust: 'Cosmic Dust',
    oceanBreeze: 'Ocean Breeze'
  };

  function getI18n() {
    return window.I18N || window.i18n || window.__i18n || null;
  }

  function tryI18nKeys(i18n, keys) {
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      try {
        var v = null;
        if (i18n) {
          if (typeof i18n.t === 'function') v = i18n.t(k);
          else if (typeof i18n.get === 'function') v = i18n.get(k);
          else if (typeof i18n === 'object') v = i18n[k];
        }
        if (typeof v === 'string' && v.trim() && v !== k) {
          return v;
        }
      } catch (_) {}
    }
    return null;
  }

  function getLocalizedThemeName(themeKey) {
    try {
      var i18n = getI18n();
      var i18nVal = tryI18nKeys(i18n, [
        'themes.' + themeKey,
        'theme.' + themeKey,
        'ui.theme.' + themeKey,
        themeKey
      ]);
      if (i18nVal) return i18nVal;
      return THEME_NAMES[themeKey] || 'Default';
    } catch (_) {
      return THEME_NAMES[themeKey] || 'Default';
    }
  }

  function getThemeLabelText(themeKey) {
    var i18n = getI18n();
    var prefix = 'Theme';
    try {
      var p = tryI18nKeys(i18n, ['labels.theme', 'ui.themeLabel']);
      if (p) prefix = p;
    } catch (_) {}
    var name = getLocalizedThemeName(themeKey);
    var display = (name && name !== 'Default') ? name : 'Default';
    return prefix + ': ' + display;
  }

  function getCurrentThemeKey() {
    return document.documentElement.getAttribute('data-theme') || 'sunsetGlow';
  }

  function clamp(val, min, max) {
    return Math.min(max, Math.max(min, val));
  }

  function createTooltipElements(button) {
    // Hide any existing inline tooltip inside the button (from baseline implementation)
    var legacy = button.querySelector('.theme-tooltip');
    if (legacy) {
      legacy.style.display = 'none';
      legacy.setAttribute('aria-hidden', 'true');
    }

    // Visible tooltip appended to body for viewport-aware positioning
    var tooltipId = 'theme-tooltip-' + Date.now();
    var tooltip = document.createElement('div');
    tooltip.id = tooltipId;
    tooltip.className = 'theme-tooltip';
    tooltip.setAttribute('role', 'tooltip');
    tooltip.setAttribute('aria-live', 'polite');

    var prefersReduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    tooltip.style.cssText = [
      'position:fixed',
      'top:0',
      'left:0',
      'transform:none',
      'padding:6px 10px',
      'background:var(--color-surface,#fff)',
      'color:var(--color-text-primary,#111)',
      'border:1px solid var(--color-border,#e5e7eb)',
      'border-radius:6px',
      'font-size:12px',
      'font-weight:500',
      'white-space:nowrap',
      'opacity:0',
      'visibility:hidden',
      'pointer-events:none',
      'z-index:1000',
      'box-shadow:0 4px 12px rgba(0,0,0,0.1)',
      'max-width:calc(100vw - 16px)',
      'will-change:top,left,opacity',
      'transition:opacity ' + (prefersReduced ? '1ms' : '150ms') + ' ease, visibility ' + (prefersReduced ? '1ms' : '150ms') + ' ease'
    ].join(';') + ';';
    document.body.appendChild(tooltip);

    // Screen-reader only mirror element
    var srId = tooltipId + '-sr';
    var srOnly = document.createElement('span');
    srOnly.id = srId;
    srOnly.className = 'visually-hidden';
    button.appendChild(srOnly);

    // Associate both visible tooltip and sr mirror via aria-describedby
    button.setAttribute('aria-describedby', srId + ' ' + tooltipId);

    return { tooltip: tooltip, srOnly: srOnly };
  }

  function positionTooltipAround(button, tooltip, placementHint) {
    var rect = button.getBoundingClientRect();
    var vw = window.innerWidth || document.documentElement.clientWidth;
    var vh = window.innerHeight || document.documentElement.clientHeight;

    // Ensure measurable size
    var prevVis = tooltip.style.visibility;
    var prevOp = tooltip.style.opacity;
    var prevDisp = tooltip.style.display;
    tooltip.style.visibility = 'hidden';
    tooltip.style.opacity = '0';
    tooltip.style.display = 'block';

    var tw = tooltip.offsetWidth;
    var th = tooltip.offsetHeight;

    tooltip.style.visibility = prevVis;
    tooltip.style.opacity = prevOp;
    tooltip.style.display = prevDisp || '';

    var OFFSET = 10;
    var top = rect.top - th - OFFSET;
    var left = rect.left + rect.width / 2 - tw / 2;
    var placement = 'top';

    // If hint provided, try it first (e.g., persist same edge during rapid updates)
    if (placementHint === 'bottom') {
      top = rect.bottom + OFFSET;
      left = rect.left + rect.width / 2 - tw / 2;
      placement = 'bottom';
    } else if (placementHint === 'right') {
      top = rect.top + rect.height / 2 - th / 2;
      left = rect.right + OFFSET;
      placement = 'right';
    } else if (placementHint === 'left') {
      top = rect.top + rect.height / 2 - th / 2;
      left = rect.left - tw - OFFSET;
      placement = 'left';
    }

    // Smart flipping (prefer top, else bottom, then right, then left)
    var fitsTop = (rect.top - th - OFFSET) >= 4;
    var fitsBottom = (rect.bottom + OFFSET + th) <= (vh - 4);
    var fitsRight = (rect.right + OFFSET + tw) <= (vw - 4);
    var fitsLeft = (rect.left - tw - OFFSET) >= 4;

    if (placement === 'top' && !fitsTop) {
      if (fitsBottom) {
        placement = 'bottom';
        top = rect.bottom + OFFSET;
        left = rect.left + rect.width / 2 - tw / 2;
      } else if (fitsRight) {
        placement = 'right';
        top = rect.top + rect.height / 2 - th / 2;
        left = rect.right + OFFSET;
      } else if (fitsLeft) {
        placement = 'left';
        top = rect.top + rect.height / 2 - th / 2;
        left = rect.left - tw - OFFSET;
      } else {
        // Fallback: bottom clamped
        placement = 'bottom';
        top = clamp(rect.bottom + OFFSET, 4, vh - th - 4);
      }
    }

    // Clamp within viewport
    left = clamp(left, 4, vw - tw - 4);
    top = clamp(top, 4, vh - th - 4);

    tooltip.style.left = Math.round(left) + 'px';
    tooltip.style.top = Math.round(top) + 'px';
    tooltip.dataset.placement = placement;

    return placement;
  }

  function wireTooltip(button) {
    var parts = createTooltipElements(button);
    var tooltip = parts.tooltip;
    var srOnly = parts.srOnly;

    var isVisible = false;
    var hoverTimer = null;
    var longPressTimer = null;
    var autoHideTimer = null;
    var fromLongPress = false;
    var lastPlacement = 'top';
    var rafQueued = false;

    function setTooltipText(text) {
      tooltip.textContent = text;
      srOnly.textContent = text;
    }

    function updateTextFromTheme() {
      var key = getCurrentThemeKey();
      setTooltipText(getThemeLabelText(key));
    }

    function showWithDelay(delayMs) {
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(function () {
        updateTextFromTheme();
        actuallyShow();
      }, delayMs);
    }

    function actuallyShow() {
      isVisible = true;
      tooltip.style.visibility = 'visible';
      tooltip.style.opacity = '1';
      lastPlacement = positionTooltipAround(button, tooltip, lastPlacement);
    }

    function showImmediate() {
      clearTimeout(hoverTimer);
      updateTextFromTheme();
      actuallyShow();
    }

    function hideTooltip() {
      clearTimeout(hoverTimer);
      clearTimeout(longPressTimer);
      clearTimeout(autoHideTimer);
      tooltip.style.opacity = '0';
      tooltip.style.visibility = 'hidden';
      isVisible = false;
      fromLongPress = false;
    }

    // Mouse/pen hover
    button.addEventListener('pointerenter', function (e) {
      if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
        showWithDelay(180);
      }
    });
    button.addEventListener('pointerleave', function () {
      hideTooltip();
    });

    // Keyboard focus
    button.addEventListener('focus', function () {
      showImmediate();
    });
    button.addEventListener('blur', function () {
      hideTooltip();
    });

    // Touch long-press
    function onDocumentPointerDown(ev) {
      if (!button.contains(ev.target)) {
        hideTooltip();
      } else if (!fromLongPress) {
        clearTimeout(autoHideTimer);
      }
    }

    button.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch') {
        clearTimeout(longPressTimer);
        fromLongPress = false;
        longPressTimer = setTimeout(function () {
          fromLongPress = true;
          showImmediate();
          clearTimeout(autoHideTimer);
          autoHideTimer = setTimeout(hideTooltip, 3000);
          document.addEventListener('pointerdown', onDocumentPointerDown, { once: true, capture: true });
        }, 500);
      }
    }, { passive: true });

    button.addEventListener('pointerup', function (e) {
      if (e.pointerType === 'touch') {
        clearTimeout(longPressTimer);
      }
    }, { passive: true });

    button.addEventListener('pointercancel', function () {
      clearTimeout(longPressTimer);
    }, { passive: true });

    // Reposition while visible on scroll/resize
    function onWinChange() {
      if (!isVisible) return;
      if (rafQueued) return;
      rafQueued = true;
      requestAnimationFrame(function () {
        lastPlacement = positionTooltipAround(button, tooltip, lastPlacement);
        rafQueued = false;
      });
    }
    window.addEventListener('resize', onWinChange, { passive: true });
    window.addEventListener('scroll', onWinChange, { passive: true, capture: true });

    // React to theme changes
    // Prefer ThemeProvider.subscribe for immediate updates; fallback to event listener
    if (window.ThemeProvider && typeof window.ThemeProvider.subscribe === 'function') {
      window.ThemeProvider.subscribe(function () {
        // Update content; if visible, reposition without flicker
        updateTextFromTheme();
        if (isVisible) onWinChange();
      });
    } else {
      document.addEventListener('theme-changed', function () {
        updateTextFromTheme();
        if (isVisible) onWinChange();
      });
    }
  }

  function ensureWired() {
    var btn = document.querySelector('.theme-toggle-btn');
    if (!btn) return false;
    // Ensure button is keyboard-focusable and has appropriate role already
    if (!btn.hasAttribute('tabindex')) {
      // Buttons are natively focusable; no change required.
    }
    // Preserve action-oriented aria-label/title set by existing implementation
    wireTooltip(btn);
    return true;
  }

  // Run after DOM ready. If toggle renders later, observe DOM insertions.
  function start() {
    if (ensureWired()) return;
    var obs = new MutationObserver(function () {
      if (ensureWired()) {
        try { obs.disconnect(); } catch (_) {}
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }

  // Also react when ThemeProvider signals readiness; the toggle is created on 'theme-ready' in main bundle
  document.addEventListener('theme-ready', function () {
    // Slight microtask to let main.js insert the button first
    setTimeout(start, 0);
  });
})();