/**
 * main.js
 * - Baseline enhancements (year, theme, hero, terminal).
 * - Accessible carousel reworked to poster-first then timed video.
 *   Poster placeholder path now points to a known file to avoid 404s.
 */
(function () {
  // Update year in footer
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme init via ThemeProvider: render toggle, load tokens/sprites, and react to theme events.
  (function initTheme() {
    'use strict';
  try { document.documentElement.classList.add('js'); } catch(_) {}
    try {
      // Render a single toggle button into the header once ThemeProvider is ready
      document.addEventListener('theme-ready', function(e) {
        var themeSwitcher = document.querySelector('.theme-switcher');
        if (themeSwitcher && window.ThemeProvider) {
          // Replace any legacy multi-button UI
          themeSwitcher.innerHTML = '';

          // Create new toggle using ThemeProvider
          var toggleBtn = window.ThemeProvider.createToggleButton({
            className: 'theme-toggle-btn',
            showLabel: false,
            animateIcons: true
          });

          // Square toggle; inner swatch from ThemeProvider reflects theme colors
          toggleBtn.style.cssText = [
            'position: relative',
            'display: inline-flex',
            'align-items: center',
            'justify-content: center',
            'width: 40px',
            'height: 40px',
            'padding: 0',
            'background: transparent',
            'border: none',
            'border-radius: var(--radius-md)',
            'cursor: pointer',
            'transition: transform var(--duration-fast,150ms) var(--ease-out, ease)'
          ].join(';') + ';';

          toggleBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
          });
          toggleBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
          });

          themeSwitcher.appendChild(toggleBtn);
        }

        // Harmonize header link color with theme
        var cvLink = document.querySelector('.cv-link-header');
        if (cvLink) {
          cvLink.style.color = 'var(--color-text-primary)';
          cvLink.style.borderColor = 'var(--color-border)';
        }
      });

      // JSON token + icon sprite loader: reflect config/theme-tokens.json into CSS vars and load per-theme icon sprite
      (function loadDesignTokens() {
        try {
          var html = document.documentElement;
          var tokensUrl = '/config/theme-tokens.json';

          // Inject/replace the inline SVG sprite for the active theme (static compiled subset)
          function ensureIconSprite(url) {
            if (!url) return;
            var current = html.getAttribute('data-icon-sprite');
            if (current === url) return;
            fetch(url, { cache: 'no-cache' })
              .then(function (r) { return r.ok ? r.text() : ''; })
              .then(function (svg) {
                if (!svg) return;
                var holder = document.getElementById('icon-sprite');
                if (!holder) {
                  holder = document.createElement('div');
                  holder.id = 'icon-sprite';
                  holder.setAttribute('aria-hidden', 'true');
                  holder.style.position = 'absolute';
                  holder.style.width = '0';
                  holder.style.height = '0';
                  holder.style.overflow = 'hidden';
                  // Insert at top of body so <use> works anywhere
                  document.body.insertBefore(holder, document.body.firstChild || null);
                }
                holder.innerHTML = svg;
                html.setAttribute('data-icon-sprite', url);
              })
              .catch(function () { /* ignore sprite errors */ });
          }

          function applyTokenVars(themeKey, tokens) {
            if (!tokens || !tokens.themes || !tokens.themes[themeKey]) return null;
            var t = tokens.themes[themeKey];
            var c = t.colors || {};
            var f = t.fonts || {};
            var i = t.icons || null;

            // Apply core color variables (kept in sync with css/themes.css names)
            if (c.background)    html.style.setProperty('--color-background', c.background);
            if (c.surface)       html.style.setProperty('--color-surface', c.surface);
            if (c.primary)       html.style.setProperty('--color-primary', c.primary);
            if (c.secondary)     html.style.setProperty('--color-secondary', c.secondary);
            if (c.accent)        html.style.setProperty('--color-accent', c.accent);
            if (c.accentSoft)    html.style.setProperty('--color-accent-soft', c.accentSoft);

            if (c.textPrimary)   html.style.setProperty('--color-text-primary', c.textPrimary);
            if (c.textSecondary) html.style.setProperty('--color-text-secondary', c.textSecondary);
            if (c.textMuted)     html.style.setProperty('--color-text-muted', c.textMuted);
            if (c.textInverse)   html.style.setProperty('--color-text-inverse', c.textInverse);

            if (c.success)       html.style.setProperty('--color-success', c.success);
            if (c.warning)       html.style.setProperty('--color-warning', c.warning);
            if (c.error)         html.style.setProperty('--color-error', c.error);
            if (c.info)          html.style.setProperty('--color-info', c.info);

            if (c.border)        html.style.setProperty('--color-border', c.border);
            if (c.borderHover)   html.style.setProperty('--color-border-hover', c.borderHover);

            if (c.shadowRGB) {
              html.style.setProperty('--shadow-color', c.shadowRGB);
            }
            if (c.overlayRGB) {
              html.style.setProperty('--overlay-color', c.overlayRGB);
            }

            // Typography families
            if (f.display) html.style.setProperty('--font-display', f.display);
            if (f.heading) html.style.setProperty('--font-heading', f.heading);
            if (f.body)    html.style.setProperty('--font-body', f.body);
            if (f.mono)    html.style.setProperty('--font-mono', f.mono);

            return i;
          }

          function fetchAndApply(themeKey) {
            fetch(tokensUrl, { cache: 'no-cache' })
              .then(function (r) { return r.ok ? r.json() : null; })
              .then(function (json) {
                if (!json) return;
                var iconsConf = applyTokenVars(themeKey, json);
                if (iconsConf && iconsConf.sprite) ensureIconSprite(iconsConf.sprite);
              })
              .catch(function () { /* silent fail to avoid blocking paint */ });
          }

          // Initial load using current DOM theme (set pre-paint)
          var initialTheme = document.documentElement.getAttribute('data-theme') || 'sunsetGlow';
          fetchAndApply(initialTheme);

          // Re-apply on ThemeProvider changes
          document.addEventListener('theme-changed', function (e) {
            var det = (e && e.detail) || {};
            var to = det.theme || det.to || document.documentElement.getAttribute('data-theme') || 'sunsetGlow';
            fetchAndApply(to);
          });
        } catch (_) {}
      })();

      // Remove legacy single toggle if still present
      var legacyToggle = document.getElementById('theme-toggle');
      if (legacyToggle) legacyToggle.replaceWith(document.createComment('legacy theme toggle removed'));
    } catch (err) {
      console.warn('Theme init error:', err);
    }
  })();

  // Motion preference
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero media: prepare video on visibility and play on user gesture; poster is the LCP
  var video = document.getElementById('hero-video');
  var heroMedia = document.querySelector('.hero-media');
  var posterImg = document.getElementById('hero-poster');
  if (video) {
    // Ensure smooth fade between poster <img> and <video>
    if (posterImg) {
      try {
        posterImg.style.transition = 'opacity 200ms ease';
        posterImg.style.opacity = '1';
      } catch (_) {}
    }

    function prepareVideo() {
      if (video.dataset.prepared === '1') return;
      video.dataset.prepared = '1';
      try { video.load(); } catch (_) {}
    }
    function playOnGesture() {
      prepareVideo();
      try {
        var p = video.play();
        if (p && typeof p.then === 'function') p.catch(function(){});
      } catch (_) {}
    }

    // Show/hide poster based on playback state
    function hidePoster() {
      if (!posterImg) return;
      posterImg.style.opacity = '0';
      posterImg.setAttribute('aria-hidden', 'true');
    }
    function showPoster() {
      if (!posterImg) return;
      posterImg.style.opacity = '1';
      posterImg.setAttribute('aria-hidden', 'false');
    }

    // Prefer going back to poster when motion is reduced
    if (reduceMotion) {
      try { video.loop = false; } catch (_) {}
    }

    video.addEventListener('playing', hidePoster);
    video.addEventListener('pause', showPoster);
    video.addEventListener('ended', showPoster);
    video.addEventListener('error', showPoster);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) showPoster();
    });

    // Prepare when near viewport; keep paused to avoid autoplay at first paint
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            prepareVideo();
            io.disconnect();
          }
        });
      }, { rootMargin: '200px' });
      io.observe(video);
    }
    // Start playback only after explicit user gesture on hero
    ['click', 'touchstart', 'keydown'].forEach(function(evt) {
      (heroMedia || video).addEventListener(evt, function onFirst() {
        playOnGesture();
        (heroMedia || video).removeEventListener(evt, onFirst);
      });
    });
  }

  // Terminal toggle (kept)
  var terminalEl = document.getElementById('terminal');
  var toggleBtn = document.getElementById('terminal-toggle');
  if (terminalEl && toggleBtn) {
    terminalEl.classList.add('collapsed');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.addEventListener('click', function () {
      var open = toggleBtn.getAttribute('aria-expanded') === 'true';
      terminalEl.classList.toggle('collapsed', open);
      toggleBtn.setAttribute('aria-expanded', String(!open));
      if (!open) {
        var input = terminalEl.querySelector('#terminal-input');
        if (input) input.focus();
      }
    });
  }

  // NETFLIX-STYLE INFINITE ROW (square cards, hover overlay, continuous autoscroll)
  var carouselRoot = document.getElementById('showcase-carousel');
  if (carouselRoot) {
    var order = ['meditation','bjj','astro','art&design','ea'];
    var copy = {
      'meditation': { title: 'Meditation', sub: 'Awareness as Craft' },
      'bjj':        { title: 'Brazilian Jiu‑Jitsu', sub: 'Dialogue in Movement' },
      'astro':      { title: 'Photography', sub: 'The Art of Noticing' },
      'art&design': { title: 'Art & Design', sub: 'Form That Speaks' },
      'ea':         { title: 'Effective Altruism', sub: 'Depth of Impact' }
    };

    function encodeFile(name) { return encodeURIComponent(name); }
    function moviePath(name) { return '/assets/movies/' + encodeFile(name) + '.mp4'; }
    function posterPath(name){ return '/assets/posters/' + encodeFile(name) + '.png'; }
    // Optimized poster helper paths (AVIF/WebP variants generated under assets/posters/optimized/)
    function optPath(name, w, ext) {
      return '/assets/posters/optimized/' + w + '/' + encodeFile(name) + '-' + w + '.' + ext;
    }
    function cardSrcset(name, ext) {
      return optPath(name, 320, ext) + ' 320w, ' + optPath(name, 640, ext) + ' 640w';
    }

    // Prepare container
    var viewport = carouselRoot.querySelector('.nf-viewport');
    var track = carouselRoot.querySelector('.nf-track');
    if (!viewport || !track) {
      // Fallback: create required structure if not present
      viewport = document.createElement('div');
      viewport.className = 'nf-viewport';
      viewport.setAttribute('role', 'region');
      viewport.setAttribute('aria-label', 'Interests carousel');
      track = document.createElement('div');
      track.className = 'nf-track';
      track.setAttribute('role', 'list');
      viewport.appendChild(track);
      carouselRoot.innerHTML = '';
      carouselRoot.appendChild(viewport);
    } else {
      // Clear any fallback cards from HTML
      track.innerHTML = '';
    }

    // Build a single set of cards
    function buildSet(targetTrack) {
      var items = [];
      order.forEach(function(name, idx){
        var meta = copy[name] || { title: name, sub: '' };
        var card = document.createElement('div');
        card.className = 'nf-card';
        card.setAttribute('role', 'listitem');
        card.setAttribute('tabindex', idx === 0 ? '0' : '-1');
        card.setAttribute('aria-labelledby', 'nf-title-' + name);
        card.setAttribute('aria-describedby', 'nf-sub-' + name);

        // Optimized poster with AVIF/WebP + PNG fallback
        var picture = document.createElement('picture');

        var sAvif = document.createElement('source');
        sAvif.type = 'image/avif';
        sAvif.setAttribute('srcset', cardSrcset(name, 'avif'));
        sAvif.setAttribute('sizes', '(max-width: 480px) 120px, (max-width: 768px) 180px, 240px');
        picture.appendChild(sAvif);

        var sWebp = document.createElement('source');
        sWebp.type = 'image/webp';
        sWebp.setAttribute('srcset', cardSrcset(name, 'webp'));
        sWebp.setAttribute('sizes', '(max-width: 480px) 120px, (max-width: 768px) 180px, 240px');
        picture.appendChild(sWebp);

        var img = document.createElement('img');
        img.className = 'poster';
        img.alt = meta.title + ' poster';
        img.decoding = 'async';
        img.loading = idx === 0 ? 'eager' : 'lazy';
        img.src = posterPath(name);
        // Explicit dimensions to avoid layout shifts; matches CSS square aspect
        img.width = 240;
        img.height = 240;

        picture.appendChild(img);

        var video = document.createElement('video');
        video.className = 'preview';
        video.setAttribute('playsinline', '');
        video.setAttribute('muted', '');
        video.setAttribute('preload', 'metadata');
        video.setAttribute('loop', '');
        video.muted = true; video.loop = true; video.playsInline = true;

        var source = document.createElement('source');
        source.src = moviePath(name);
        source.type = 'video/mp4';
        video.appendChild(source);

        var overlay = document.createElement('div');
        overlay.className = 'nf-overlay';
        var t = document.createElement('div');
        t.className = 'nf-title';
        t.id = 'nf-title-' + name;
        t.textContent = meta.title;
        var s = document.createElement('div');
        s.className = 'nf-sub';
        s.id = 'nf-sub-' + name;
        s.textContent = meta.sub || '';
        overlay.appendChild(t);
        overlay.appendChild(s);

        card.appendChild(picture);
        card.appendChild(video);
        card.appendChild(overlay);
        targetTrack.appendChild(card);

        // Hover/focus preview: lazy start playback
        function startPreview() {
          try { if (video.currentTime < 0.05) video.currentTime = 0.05; } catch(_){}
          var p = video.play();
          if (p && typeof p.then === 'function') p.catch(function(){});
        }
        card.addEventListener('pointerenter', startPreview);
        card.addEventListener('focusin', startPreview);

        items.push(card);
      });
      return items;
    }

    // Build originals + clones to enable seamless loop
    var originals = buildSet(track);
    var clones1 = buildSet(track);
    var clones2 = buildSet(track);

    // Measure width of one set after layout
    function setWidth() {
      var firstIdx = 0;
      var lastIdx = order.length - 1;
      var first = originals[firstIdx];
      var last = originals[lastIdx];
      if (!first || !last) return 0;
      var left = first.offsetLeft;
      var right = last.offsetLeft + last.offsetWidth;
      return right - left + (parseFloat(getComputedStyle(track).gap) || 0);
    }

    var translateX = 0;
    var speedPxPerSec = 60; // constant speed across devices
    var setW = 0;
    var running = !reduceMotion; // respect prefers-reduced-motion
    var lastTs = 0;

    function ensureMeasurements() {
      setW = setWidth();
    }

    function step(ts) {
      if (!running) { lastTs = ts; return requestAnimationFrame(step); }
      if (!lastTs) lastTs = ts;
      var dt = (ts - lastTs) / 1000;
      lastTs = ts;

      translateX -= speedPxPerSec * dt;
      // When we moved one full set to the left, reset to seamless position
      if (setW > 0 && -translateX >= setW) {
        translateX += setW;
      }
      track.style.transform = 'translateX(' + translateX.toFixed(2) + 'px)';
      requestAnimationFrame(step);
    }

    // Pause/resume on interaction/visibility
    viewport.addEventListener('pointerenter', function(){ running = false; });
    viewport.addEventListener('pointerleave', function(){ running = true; });
    viewport.addEventListener('focusin', function(){ running = false; });
    viewport.addEventListener('focusout', function(e){
      // Resume only if focus left the viewport entirely
      if (!viewport.contains(document.activeElement)) running = true;
    });
    document.addEventListener('visibilitychange', function(){
      running = !document.hidden;
    });

    // Keyboard roving tabindex within the originals set
    var focusIdx = 0;
    function focusCard(i) {
      focusIdx = (i + originals.length) % originals.length;
      originals.forEach(function(card, idx){
        card.tabIndex = idx === focusIdx ? 0 : -1;
      });
      originals[focusIdx].focus();
    }
    viewport.addEventListener('keydown', function(e){
      if (e.key === 'ArrowRight') { e.preventDefault(); focusCard(focusIdx + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); focusCard(focusIdx - 1); }
      else if (e.key === 'Home') { e.preventDefault(); focusCard(0); }
      else if (e.key === 'End') { e.preventDefault(); focusCard(originals.length - 1); }
    });

    // Images robust fallback
    track.querySelectorAll('img.poster').forEach(function(img){
      img.addEventListener('error', function(){
        img.removeAttribute('src');
        img.style.background = '#000';
      });
    });

    // Start (disable autoscroll when prefers-reduced-motion is enabled)
    if (!reduceMotion) {
      requestAnimationFrame(function(){
        ensureMeasurements();
        // If measurement zero (not laid out yet), try again shortly
        if (!setW) setTimeout(ensureMeasurements, 50);
        requestAnimationFrame(step);
      });
    }

    // On resize, re-measure set width to keep loop seamless
    window.addEventListener('resize', function(){
      var prev = setW;
      ensureMeasurements();
      // Adjust translateX into new modulo space
      if (setW > 0 && prev > 0) {
        translateX = translateX % setW;
      }
    });
  }

  // Floating Theme Toggle Button removed per request

  // Header rotator (kept)
  var rotator = document.getElementById('vyakart-rotator');
  if (rotator) {
    var translations = [
      { lang: 'Sanskrit',   text: 'स्रष्टा' },
      { lang: 'Kannada',    text: 'ಸೃಷ್ಟಿಕರ್ತ' },
      { lang: 'Chakma',     text: '𑄥𑄲𑄢𑄴𑄔𑄚𑄨' },
      { lang: 'Japanese',   text: 'クリエーター' },
      { lang: 'Arabic',     text: 'المُبدِع' },
      { lang: 'Tamil',      text: 'உருவாக்குநர்' },
      { lang: 'Malayalam',  text: 'സൃഷ്ടികർത്താവ്' },
      { lang: 'Hindi',      text: 'निर्माता' },
      { lang: 'Bengali',    text: 'স্রষ্টা' },
      { lang: 'Russian',    text: 'создатель' },
      { lang: 'Yoruba',     text: 'ẹlẹda' }
    ];
    var a = translations.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    var iIdx = 0, intervalMs = 2500, inFlight = false;
    function showNext() {
      if (inFlight) return;
      inFlight = true;
      var next = a[iIdx % a.length]; iIdx++;
      var current = rotator.querySelector('.brand-rotate-item');
      if (current) {
        current.classList.add('exit');
        setTimeout(function () { if (current.parentElement) current.parentElement.removeChild(current); }, 400);
      }
      var span = document.createElement('span');
      span.className = 'brand-rotate-item';
      span.textContent = next.text;
      span.setAttribute('data-lang', next.lang);
      rotator.appendChild(span);
      var w = span.offsetWidth;
      var currentMin = parseFloat(getComputedStyle(rotator).minWidth);
      if (!Number.isNaN(w) && (!currentMin || w > currentMin)) rotator.style.minWidth = w + 'px';
      setTimeout(function () { inFlight = false; }, 410);
    }
    rotator.innerHTML = '';
    showNext();
    if (!reduceMotion) setInterval(showNext, intervalMs);
  }
  // 88x31 footer badges removed per request

})();
/* Idempotent header toggle render to ensure replacement even if theme-ready fired before this script bound */
(function () {
  'use strict';
  function renderHeaderThemeToggleNow() {
    try {
      var themeSwitcher = document.querySelector('.theme-switcher');
      if (themeSwitcher && window.ThemeProvider) {
        // If already rendered, bail
        if (themeSwitcher.querySelector('.theme-toggle-btn')) return;
        // Replace any legacy multi-button UI
        themeSwitcher.innerHTML = '';
        var toggleBtn = window.ThemeProvider.createToggleButton({
          className: 'theme-toggle-btn',
          showLabel: false,
          animateIcons: true
        });
        // Square toggle; inner swatch from ThemeProvider reflects theme colors
        toggleBtn.style.cssText = [
          'position: relative',
          'display: inline-flex',
          'align-items: center',
          'justify-content: center',
          'width: 40px',
          'height: 40px',
          'padding: 0',
          'background: transparent',
          'border: none',
          'border-radius: var(--radius-md)',
          'cursor: pointer',
          'transition: transform var(--duration-fast,150ms) var(--ease-out, ease)'
        ].join(';') + ';';
        toggleBtn.addEventListener('mouseenter', function() {
          this.style.transform = 'scale(1.02)';
        });
        toggleBtn.addEventListener('mouseleave', function() {
          this.style.transform = 'scale(1)';
        });
        themeSwitcher.appendChild(toggleBtn);
      }
      var cvLink = document.querySelector('.cv-link-header');
      if (cvLink) {
        cvLink.style.color = 'var(--color-text-primary)';
        cvLink.style.borderColor = 'var(--color-border)';
      }
    } catch (_) {}
  }
  // Run after DOM ready and also if ThemeProvider was already ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      if (window.ThemeProvider) renderHeaderThemeToggleNow();
    });
  } else {
    if (window.ThemeProvider) renderHeaderThemeToggleNow();
  }
  // Also respond to future theme-ready events
  document.addEventListener('theme-ready', renderHeaderThemeToggleNow);
})();
// Flip-link per-letter hover animation (no React)
(function () {
  'use strict';
  function setupFlipLinks() {
    try {
      var links = document.querySelectorAll('.flip-link');
      links.forEach(function (link) {
        var text = link.getAttribute('data-text') || (link.textContent || '').trim();
        if (!text) return;

        // Ensure visual container
        var vis = link.querySelector('.flip-vis');
        if (!vis) {
          vis = document.createElement('span');
          vis.className = 'flip-vis';
          vis.setAttribute('aria-hidden', 'true');
          link.insertBefore(vis, link.firstChild || null);
        }

        // Build rows
        vis.innerHTML = '';
        var front = document.createElement('span');
        front.className = 'flip-row front';
        var back = document.createElement('span');
        back.className = 'flip-row back';

        // Use Array.from to better handle surrogate pairs
        var letters = Array.from(text);
        letters.forEach(function (ch, i) {
          var s1 = document.createElement('span');
          s1.textContent = ch;
          s1.style.transitionDelay = (i * 25) + 'ms';

          var s2 = document.createElement('span');
          s2.textContent = ch;
          s2.style.transitionDelay = (i * 25) + 'ms';

          front.appendChild(s1);
          back.appendChild(s2);
        });

        vis.appendChild(front);
        vis.appendChild(back);

        // Ensure accessible label
        if (!link.querySelector('.visually-hidden')) {
          var sr = document.createElement('span');
          sr.className = 'visually-hidden';
          sr.textContent = text;
          link.appendChild(sr);
        }
      });
    } catch (_) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupFlipLinks, { once: true });
  } else {
    setupFlipLinks();
  }
})();
// PerformanceObserver: collect basic field metrics (LCP, CLS, TBT approx)
(function () {
  'use strict';
  if (window.__perfObsInstalled) return;
  window.__perfObsInstalled = true;

  var lcp = 0;
  var cls = 0;
  var tbt = 0;

  // Largest Contentful Paint (ms)
  try {
    var poLCP = new PerformanceObserver(function (list) {
      list.getEntries().forEach(function (e) {
        var ts = e.renderTime || e.loadTime || 0;
        if (ts > lcp) lcp = ts;
      });
    });
    poLCP.observe({ type: 'largest-contentful-paint', buffered: true });
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') {
        try { poLCP.disconnect(); } catch (_) {}
      }
    });
  } catch (_) {}

  // Cumulative Layout Shift
  try {
    var poCLS = new PerformanceObserver(function (list) {
      list.getEntries().forEach(function (e) {
        if (!e.hadRecentInput) cls += e.value;
      });
    });
    poCLS.observe({ type: 'layout-shift', buffered: true });
  } catch (_) {}

  // Total Blocking Time (approx from Long Tasks)
  try {
    var poLT = new PerformanceObserver(function (list) {
      list.getEntries().forEach(function (e) {
        var block = e.duration - 50;
        if (block > 0) tbt += block;
      });
    });
    poLT.observe({ entryTypes: ['longtask'] });
  } catch (_) {}

  function report() {
    // Skip during Lighthouse synthetic runs
    if ((navigator.userAgent || '').includes('Chrome-Lighthouse')) return;
    var data = {
      lcp: Math.round(lcp),
      cls: +cls.toFixed(3),
      tbt: Math.round(tbt)
    };
    try { console.info('[Perf]', data); } catch (_) {}
    // Hook: send to your analytics endpoint if needed
    // navigator.sendBeacon('/perf', JSON.stringify(data));
  }

  window.addEventListener('pagehide', report, { once: true });
})();