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

  // Theme init (final): three named themes via html[data-theme] + buttons, with persistence + cross-tab sync.
  (function initTheme() {
    try {
      var html = document.documentElement;

      function applyNamedTheme(name) {
        var allowed = { spice:1, holi:1, heritage:1 };
        var finalName = allowed[name] ? name : 'spice';
        html.setAttribute('data-theme', finalName);
        html.classList.remove('dark'); // remove legacy class to avoid conflicts
        setPressed(finalName);
        try { localStorage.setItem('theme', finalName); } catch (_) {}
        document.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme: finalName } }));
      }

      function setPressed(active) {
        // Update aria-pressed on legacy buttons if present
        var buttons = document.querySelectorAll('.theme-btn[data-theme]');
        buttons.forEach(function(b) {
          var isActive = b.getAttribute('data-theme') === active;
          b.setAttribute('aria-pressed', String(isActive));
        });
        // Reflect selected state on SVG icons via aria-current
        var icons = document.querySelectorAll('.theme-icon[data-theme]');
        icons.forEach(function(i){
          var isActive = i.getAttribute('data-theme') === active;
          if (isActive) {
            i.setAttribute('aria-current', 'true');
          } else {
            i.removeAttribute('aria-current');
          }
        });
      }

      // Determine starting theme
      var stored = null;
      try { stored = localStorage.getItem('theme'); } catch (_) {}
      applyNamedTheme(stored || 'spice');

      // Wire up header theme switcher icons (img elements with data-theme)
      var iconButtons = document.querySelectorAll('.theme-icon[data-theme]');
      iconButtons.forEach(function(icon) {
        // Click/keyboard to apply
        icon.addEventListener('click', function() {
          var target = icon.getAttribute('data-theme');
          applyNamedTheme(target);
        });
        icon.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            var target = icon.getAttribute('data-theme');
            applyNamedTheme(target);
          }
        });
        // Press micro-interaction
        icon.addEventListener('pointerdown', function() {
          icon.classList.add('transition-transform','scale-90','rotate-15');
        });
        function resetMotion() {
          icon.classList.remove('scale-90','rotate-15');
        }
        icon.addEventListener('pointerup', resetMotion);
        icon.addEventListener('pointercancel', resetMotion);
        icon.addEventListener('mouseleave', resetMotion);
      });

      // Keep backward compatibility if .theme-btn still exists (no-op without elements)
      var switcherButtons = document.querySelectorAll('.theme-btn[data-theme]');
      switcherButtons.forEach(function(btn){
        btn.addEventListener('click', function(){
          var target = btn.getAttribute('data-theme');
          applyNamedTheme(target);
        });
      });

      // Cross‑tab sync
      window.addEventListener('storage', function(e) {
        if (e.key === 'theme' && e.newValue) {
          applyNamedTheme(e.newValue);
        }
      });

      // Remove legacy header toggle listeners if element still exists (header slider removed)
      var legacyToggle = document.getElementById('theme-toggle');
      if (legacyToggle) {
        legacyToggle.replaceWith(document.createComment('header theme toggle removed'));
      }
    } catch (_) {}
  })();

  // Motion preference
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero lazy observer (kept)
  var video = document.getElementById('hero-video');
  if (video && 'IntersectionObserver' in window) {
    var loaded = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!loaded && entry.isIntersecting) {
          loaded = true;
          io.disconnect();
        }
      });
    }, { rootMargin: '200px' });
    io.observe(video);
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

        var img = document.createElement('img');
        img.className = 'poster';
        img.alt = meta.title + ' poster';
        img.decoding = 'async';
        img.loading = idx === 0 ? 'eager' : 'lazy';
        img.src = posterPath(name);

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

        card.appendChild(img);
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
    var running = true;
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

    // Start
    requestAnimationFrame(function(){
      ensureMeasurements();
      // If measurement zero (not laid out yet), try again shortly
      if (!setW) setTimeout(ensureMeasurements, 50);
      requestAnimationFrame(step);
    });

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
  // Dynamically render available 88x31 badges in footer by listing known filenames and checking existence
  (function initBadges() {
    try {
      var footerList = document.querySelector('.site-footer .footer-links');
      if (!footerList) return;

      // Candidate assets (extendable). We’ll probe existence via HEAD requests.
      var candidates = [
        { file: '/assets/88x31/kilo.gif', alt: 'Kilo Code 88x31 badge' },
        { file: '/assets/88x31/edit.gif', alt: 'Edit 88x31 badge' },
        { file: '/assets/88x31/citizen.gif', alt: 'Citizen of the Web 88x31 badge' },
        { file: '/assets/88x31/kilo-anim.mp4', alt: 'Kilo animated 88x31' } // will fallback to link text if mp4
      ];

      // Helper to check if an asset exists using HEAD (served by the same server)
      function check(url) {
        return fetch(url, { method: 'HEAD' }).then(function (res) {
          return res.ok;
        }).catch(function () { return false; });
      }

      // Clear any static badges we may have in markup to avoid duplicates
      footerList.innerHTML = '';

      // For each candidate, if exists, append appropriate element
      Promise.all(candidates.map(function (c) { return check(c.file).then(function (ok) { return { ok: ok, meta: c }; }); }))
        .then(function (results) {
          results.filter(function (r) { return r.ok; }).forEach(function (r) {
            var li = document.createElement('li');

            if (r.meta.file.endsWith('.gif') || r.meta.file.endsWith('.png') || r.meta.file.endsWith('.jpg') || r.meta.file.endsWith('.webp')) {
              var img = document.createElement('img');
              img.src = r.meta.file;
              img.width = 88;
              img.height = 31;
              img.decoding = 'async';
              img.loading = 'lazy';
              img.alt = r.meta.alt;
              li.appendChild(img);
            } else if (r.meta.file.endsWith('.mp4')) {
              // Tiny video badge, muted inline looping; keep accessible name via aria-label
              var vid = document.createElement('video');
              vid.src = r.meta.file;
              vid.width = 88;
              vid.height = 31;
              vid.muted = true;
              vid.loop = true;
              vid.playsInline = true;
              vid.autoplay = true;
              vid.setAttribute('aria-label', r.meta.alt);
              vid.style.display = 'block';
              li.appendChild(vid);
            } else {
              // Fallback to a link text if unexpected extension
              var a = document.createElement('a');
              a.href = r.meta.file;
              a.textContent = r.meta.alt;
              li.appendChild(a);
            }

            footerList.appendChild(li);
          });
        });
    } catch (_) {}
  })();

})();