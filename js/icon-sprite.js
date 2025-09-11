/**
 * icon-sprite.js
 * Runtime SVG symbol sprite injector, theme-aware.
 * Idempotent; integrates with ThemeProvider events.
 */
(function () {
  'use strict';
  var HTML = document.documentElement;
  var HOLDER_ID = 'icon-sprite';
  var ATTR = 'data-icon-sprite';
  var CFG_URL = '/config/theme-tokens.json';
  var cfg = null;

  // Run when DOM is ready
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  // Inject SVG markup into a hidden, zero-sized holder at top of <body>
  function inject(svg) {
    if (!svg) return;
    var holder = document.getElementById(HOLDER_ID);
    if (!holder) {
      holder = document.createElement('div');
      holder.id = HOLDER_ID;
      holder.setAttribute('aria-hidden', 'true');
      holder.style.position = 'absolute';
      holder.style.width = '0';
      holder.style.height = '0';
      holder.style.overflow = 'hidden';
      try {
        document.body.insertBefore(holder, document.body.firstChild || null);
      } catch (_) {
        document.body.appendChild(holder);
      }
    }
    holder.innerHTML = svg;
  }

  function cacheKey(url) { return 'icon-sprite::' + url; }

  // Load sprite with localStorage SWR (stale-while-revalidate)
  function loadSprite(url) {
    if (!url) return Promise.resolve();
    if (HTML.getAttribute(ATTR) === url) return Promise.resolve();
    var key = cacheKey(url);
    try {
      var cached = localStorage.getItem(key);
      if (cached) {
        inject(cached);
        HTML.setAttribute(ATTR, url);
        fetch(url, { cache: 'no-cache' })
          .then(function (r) { return r.ok ? r.text() : ''; })
          .then(function (svg) {
            if (svg && svg !== cached) {
              inject(svg);
              try { localStorage.setItem(key, svg); } catch (_) {}
            }
          })
          .catch(function () {});
        return Promise.resolve();
      }
    } catch (_) {}

    return fetch(url, { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.text() : ''; })
      .then(function (svg) {
        if (!svg) return;
        inject(svg);
        HTML.setAttribute(ATTR, url);
        try { localStorage.setItem(key, svg); } catch (_) {}
      })
      .catch(function () {});
  }

  function resolveSprite(theme) {
    if (cfg && cfg.themes && cfg.themes[theme] && cfg.themes[theme].icons && cfg.themes[theme].icons.sprite) {
      return cfg.themes[theme].icons.sprite;
    }
    // Fallback: conventional path
    return '/assets/icons/compiled/' + theme + '.svg';
  }

  function ensureForTheme(theme) {
    var url = resolveSprite(theme);
    return loadSprite(url);
  }

  function fetchConfigOnce() {
    if (cfg) return Promise.resolve(cfg);
    return fetch(CFG_URL, { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (json) { if (json) cfg = json; return cfg; })
      .catch(function () { return null; });
  }

  function init() {
    var theme = HTML.getAttribute('data-theme') || 'sunsetGlow';
    fetchConfigOnce().then(function () { ensureForTheme(theme); });

    // React to ThemeProvider changes
    document.addEventListener('theme-changed', function (e) {
      var det = (e && e.detail) || {};
      var to = det.to || det.theme || HTML.getAttribute('data-theme') || 'sunsetGlow';
      fetchConfigOnce().then(function () { ensureForTheme(to); });
    });
  }

  onReady(init);
})();