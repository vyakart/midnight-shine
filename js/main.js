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

  // CAROUSEL — poster first (5s), then video plays for 10s; fix filenames with '&', distinct posters, robust fallbacks
  var carouselRoot = document.getElementById('showcase-carousel');
  if (carouselRoot) {
    var order = ['meditation','bjj','astro','art&design','ea'];
    var copy = {
      'meditation': { title: 'Meditation', sub: 'Awareness as Craft', desc: 'Cultivating quiet attention and making space to listen deeply; perceive clearly with equanimity; be aware of the present moment.' },
      'bjj':        { title: 'Brazilian Jiu‑Jitsu', sub: 'Dialogue in Movement', desc: 'A physical conversation of frames, levers, and timing; finding flow in resistance, truth in technique.' },
      'astro':      { title: 'Photography', sub: 'The Art of Noticing', desc: 'Patiently observing and capturing visually striking images, from intimate micro details to expansive cosmic views.' },
      'art&design': { title: 'Art & Design', sub: 'Form That Speaks', desc: 'Balancing minimal surfaces and bold edges so that design is distilled to clarity, art articulated with courage.' },
      'ea':         { title: 'Effective Altruism', sub: 'Depth of Impact', desc: 'Navigating complexity with evidence and compassion, directing resources where thoughtful effort multiplies meaningfully.' }
    };

    var mediaFrame = carouselRoot.querySelector('.media-frame');
    var tickerWrap = carouselRoot.querySelector('.carousel-ticker');
    var capWrap = carouselRoot.querySelector('.carousel-aside');
    var capTitle = capWrap ? capWrap.querySelector('.carousel-cap-title') : null;
    var capSub = capWrap ? capWrap.querySelector('.carousel-cap-sub') : null;
    var capDesc = capWrap ? capWrap.querySelector('.carousel-cap-desc') : null;

    // Path helpers with URL-encoding for special characters like '&'
    function encodeFile(name) { return encodeURIComponent(name); }
    function moviePath(name) { return '/assets/movies/' + encodeFile(name) + '.mp4'; }
    function posterPath(name){ return '/assets/posters/' + encodeFile(name) + '.png'; }

    if (!mediaFrame) return;
    mediaFrame.innerHTML = '';

    // Stage container
    var stage = document.createElement('div');
    stage.className = 'stage-viewport';
    mediaFrame.appendChild(stage);

    // Conveyor viewport (below stage, continuous scrolling)
    var conveyorViewport = document.createElement('div');
    conveyorViewport.className = 'conveyor-viewport';
    mediaFrame.appendChild(conveyorViewport);

    var conveyorTrack = document.createElement('div');
    conveyorTrack.className = 'conveyor-track';
    conveyorViewport.appendChild(conveyorTrack);

    // Prev/Next controls
    var prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'button outline';
    prevBtn.setAttribute('aria-label', 'Previous slide');
    prevBtn.textContent = 'Prev';

    var nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'button outline';
    nextBtn.setAttribute('aria-label', 'Next slide');
    nextBtn.textContent = 'Next';

    // Place controls above ticker
    var controlsWrap = document.createElement('div');
    controlsWrap.style.display = 'flex';
    controlsWrap.style.gap = '12px';
    controlsWrap.style.justifyContent = 'center';
    controlsWrap.style.paddingTop = '6px';

    controlsWrap.appendChild(prevBtn);
    controlsWrap.appendChild(nextBtn);

    // Insert controls before ticker if possible
    if (tickerWrap && tickerWrap.parentElement) {
      tickerWrap.parentElement.insertBefore(controlsWrap, tickerWrap);
    } else if (mediaFrame && mediaFrame.parentElement) {
      mediaFrame.parentElement.appendChild(controlsWrap);
    }

    // Create slides using per-topic posters, then a video element
    var slides = order.map(function(name, idx){
      var data = copy[name] || { title: name, sub: '', desc: '' };
      var slide = document.createElement('figure');
      slide.className = 'stage-slide';
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-label', data.title);
      // Make slide focusable for keyboard hover-preview parity
      slide.tabIndex = 0;

      var img = document.createElement('img');
      img.alt = data.title + ' poster';
      img.decoding = 'async';
      img.loading = idx === 0 ? 'eager' : 'lazy';
      img.src = posterPath(name);

      var video = document.createElement('video');
      video.setAttribute('playsinline', '');
      video.setAttribute('muted', '');
      video.setAttribute('preload', 'metadata');
      video.setAttribute('loop', '');
      // Looping enabled; carousel timing still controls slide advance
      video.className = 'stage-video';
      video.style.display = 'none';
      // Hint mobile Safari to allow inline playback
      video.playsInline = true;
      video.muted = true;
      video.loop = true;

      var src = document.createElement('source');
      src.src = moviePath(name);
      src.type = 'video/mp4';
      video.appendChild(src);

      // If the poster fails for some reason, keep layout stable
      img.addEventListener('error', function(){
        img.removeAttribute('src'); // prevents continuous error loop
        img.style.background = '#000';
      });

      // Robust error handling for video load
      var videoFailed = false;
      video.addEventListener('error', function(){ videoFailed = true; });
      src.addEventListener('error', function(){ videoFailed = true; });

      var alt = document.createElement('span');
      alt.className = 'visually-hidden';
      alt.textContent = data.title + ' preview video';

      slide.appendChild(img);
      slide.appendChild(video);
      slide.appendChild(alt);
      stage.appendChild(slide);
      return { el: slide, img: img, video: video, key: name, idx: idx, failed: function(){ return videoFailed; } };
    });

    function updateCaption(idx) {
      if (!capWrap) return;
      var key = order[idx] || order[0];
      var data = copy[key];
      if (capTitle) capTitle.textContent = data.title;
      if (capSub) capSub.textContent = data.sub;
      if (capDesc) capDesc.textContent = data.desc;
    }

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var activeIdx = 0;

    // Timers for poster phase and video phase
    var PHASE_POSTER_MS = 5000; // 5s poster
    var PHASE_VIDEO_MS = 10000; // 10s video
    var phaseTimer = null;

    function clearPhaseTimer() {
      if (phaseTimer) { clearTimeout(phaseTimer); phaseTimer = null; }
    }

    function showPoster(s) {
      s.video.pause();
      s.video.currentTime = 0;
      s.video.style.display = 'none';
      s.img.style.display = '';
    }

    function showVideo(s) {
      s.img.style.display = 'none';
      s.video.style.display = '';
      if (!prefersReduced) s.video.play().catch(function(){});
    }

    function setActive(idx) {
      if (idx === activeIdx) return;
      // Reset previous
      var prev = slides[activeIdx];
      if (prev) showPoster(prev);

      activeIdx = (idx + slides.length) % slides.length;
      slides.forEach(function(s, i) {
        s.el.classList.toggle('is-active', i === activeIdx);
      });
      updateCaption(activeIdx);
      setActiveTicker(activeIdx);
      schedulePhases();
    }

    // Phase scheduling: poster 5s, then video 10s, then advance
    function schedulePhases() {
      clearPhaseTimer();
      var s = slides[activeIdx];
      if (!s) return;
      showPoster(s);

      // Prime autoplay pipeline on iOS/Safari: muted + playsinline + quick play/pause
      try {
        s.video.muted = true;
        s.video.setAttribute('muted', '');
        s.video.setAttribute('playsinline', '');
        var p = s.video.play();
        if (p && typeof p.then === 'function') {
          p.then(function(){ s.video.pause(); s.video.currentTime = 0; }).catch(function(){ /* ignore */ });
        } else {
          s.video.pause();
          s.video.currentTime = 0;
        }
      } catch (_) {}

      // If video load fails, skip video phase quickly to next slide
      var posterDeadline = Date.now() + PHASE_POSTER_MS;

      phaseTimer = setTimeout(function(){
        // If this slide's video failed to load, jump to next slide
        if (typeof s.failed === 'function' && s.failed()) {
          setActive((activeIdx + 1) % slides.length);
          return;
        }

        showVideo(s);

        // As an extra guard, if play() was blocked, try again shortly
        setTimeout(function(){
          if (!prefersReduced && s.video.paused) {
            s.video.play().catch(function(){});
          }
        }, 150);

        // If the video still won’t play after 1s, don’t stall the carousel
        setTimeout(function(){
          if (s.video.paused) {
            setActive((activeIdx + 1) % slides.length);
          }
        }, 1000);

        clearPhaseTimer();
        phaseTimer = setTimeout(function(){
          // advance to next
          setActive((activeIdx + 1) % slides.length);
        }, PHASE_VIDEO_MS);
      }, Math.max(0, posterDeadline - Date.now()));
    }

    // Init first slide
    slides.forEach(function(s, i) {
      s.el.classList.toggle('is-active', i === 0);
      // Ensure every slide starts on poster so we always see poster before video
      showPoster(s);
    });
    updateCaption(activeIdx);
    // Kick scheduling after a short delay to make sure first poster paints
    setTimeout(schedulePhases, 250);

    // Periodic sync to ensure aside caption and dots reflect current active slide
    // even if hover preview is ongoing
    var captionSyncId = setInterval(function(){
      updateCaption(activeIdx);
      setActiveTicker(activeIdx);
    }, 2000);

    // Sync aside caption to active slide periodically so captions don't lag due to hover playback
    setInterval(function(){
      updateCaption(activeIdx);
      setActiveTicker(activeIdx);
    }, 2000);

    // Build conveyor items: duplicate the 4 topics several times for seamless loop
    (function buildConveyor(){
      if (!conveyorTrack) return;
      var sequence = order.slice(0, 4); // 4 movies
      var loops = 4; // total items = 16 for smoothness
      for (var l = 0; l < loops; l++) {
        sequence.forEach(function(name){
          var item = document.createElement('div');
          item.className = 'conveyor-item';

          var v = document.createElement('video');
          v.setAttribute('playsinline', '');
          v.setAttribute('muted', '');
          v.setAttribute('loop', '');
          v.setAttribute('preload', 'metadata');
          v.muted = true; v.loop = true; v.playsInline = true;

          var source = document.createElement('source');
          source.src = moviePath(name);
          source.type = 'video/mp4';
          v.appendChild(source);

          // start playback when possible
          v.addEventListener('canplay', function(){
            try { if (v.currentTime < 0.05) v.currentTime = 0.05; } catch(_){}
            v.play().catch(function(){});
          });

          // Click to jump main stage to this item
          item.addEventListener('click', function(){
            var idx = order.indexOf(name);
            if (idx > -1) setActive(idx);
          });

          item.appendChild(v);

          // Text label overlay (small)
          var label = document.createElement('span');
          label.className = 'conveyor-label';
          label.textContent = (copy[name] ? copy[name].title : name);
          item.appendChild(label);

          conveyorTrack.appendChild(item);
        });
      }
    })();

    // Dots
    var tickerItems = [];
    function setActiveTicker(idx) {
      tickerItems.forEach(function(el, i){
        var selected = (i === idx);
        el.setAttribute('aria-selected', String(selected));
        el.tabIndex = selected ? 0 : -1;
      });
    }
    (function createTicker(){
      if (!tickerWrap) return;
      tickerWrap.innerHTML = '';
      tickerItems = order.map(function(_key, i){
        var btn = document.createElement('button');
        btn.className = 'ticker-item';
        btn.type = 'button';
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        btn.addEventListener('click', function(){
          if (i === activeIdx) return;
          setActive(i);
          schedulePhases();
        });
        btn.addEventListener('keydown', function(e){
          if (e.key === 'ArrowRight') { e.preventDefault(); setActive((activeIdx + 1) % slides.length); schedulePhases(); }
          if (e.key === 'ArrowLeft')  { e.preventDefault(); setActive((activeIdx - 1 + slides.length) % slides.length); schedulePhases(); }
          if (e.key === 'Home')       { e.preventDefault(); setActive(0); schedulePhases(); }
          if (e.key === 'End')        { e.preventDefault(); setActive(slides.length - 1); schedulePhases(); }
        });
        tickerWrap.appendChild(btn);
        return btn;
      });
      setActiveTicker(activeIdx);
      // Keep ticker state in sync after tab restores
      document.addEventListener('visibilitychange', function(){
        if (!document.hidden) setActiveTicker(activeIdx);
      });
    })();

    // Prev/Next handlers
    prevBtn.addEventListener('click', function(){
      setActive(activeIdx - 1);
    });
    nextBtn.addEventListener('click', function(){
      setActive(activeIdx + 1);
    });

    // Ensure auto-run even if timers were interrupted by quick navigations or tab restore
    window.addEventListener('pageshow', function(){
      // Safari bfcache restore can skip timers; restart them
      setTimeout(schedulePhases, 50);
      // Also kick conveyor videos after restore
      try {
        var vids = carouselRoot.querySelectorAll('.conveyor-item video');
        vids.forEach(function(v){
          v.muted = true; v.playsInline = true;
          if (v.readyState >= 1 && v.paused) v.play().catch(function(){});
        });
      } catch(_) {}
    });

    // Hover-to-preview: play video on hover/focus and KEEP PLAYING on leave; overlay stays visible
    function ensureOverlay(slide) {
      // Create a per-slide overlay containing title/sub
      if (!slide || slide.el.querySelector('.stage-overlay')) return;
      var data = copy[slide.key] || { title: slide.key, sub: '' };
      var ov = document.createElement('figcaption');
      ov.className = 'stage-overlay';
      var t = document.createElement('div');
      t.className = 'stage-overlay-title';
      t.textContent = data.title;
      var s = document.createElement('div');
      s.className = 'stage-overlay-sub';
      s.textContent = data.sub || '';
      ov.appendChild(t);
      ov.appendChild(s);
      slide.el.appendChild(ov);
    }

    function wireHoverPreview(slide){
      if (!slide) return;
      ensureOverlay(slide);
      var el = slide.el;
      var vid = slide.video;
      var img = slide.img;

      function startPlaybackIfPossible(v){
        v.muted = true;
        v.playsInline = true;
        if (v.readyState < 2) {
          try { v.load(); } catch (_) {}
        }
        var go = function(){
          try { if (v.currentTime < 0.05) v.currentTime = 0.05; } catch(_){}
          if (!prefersReduced) {
            var p = v.play();
            if (p && typeof p.then === 'function') {
              p.catch(function(){ requestAnimationFrame(function(){ v.play().catch(function(){}); }); });
            }
          }
        };
        if (v.readyState >= 1) go(); else {
          var once = function(){ v.removeEventListener('loadedmetadata', once); go(); };
          v.addEventListener('loadedmetadata', once);
        }
      }

      el.addEventListener('pointerenter', function(){
        // Show video immediately for preview
        img.style.display = 'none';
        vid.style.display = '';
        startPlaybackIfPossible(vid);
        // Do NOT clear or pause global timers; let carousel continue
      });

      el.addEventListener('pointerleave', function(){
        // Keep video playing and overlay visible; no pause/reset
        vid.style.display = '';
        img.style.display = 'none';
        startPlaybackIfPossible(vid);
        // No reschedulePhases() here; avoid jitter
      });

      // Keyboard parity
      el.addEventListener('focusin', function(){
        img.style.display = 'none';
        vid.style.display = '';
        startPlaybackIfPossible(vid);
      });
      el.addEventListener('focusout', function(){
        // Keep playing after focus leaves
        vid.style.display = '';
        img.style.display = 'none';
        startPlaybackIfPossible(vid);
      });
    }
    slides.forEach(wireHoverPreview);

    // Visibility handling
    document.addEventListener('visibilitychange', function(){
      if (document.hidden) {
        clearPhaseTimer();
        slides.forEach(function(s){ s.video.pause(); });
      } else {
        schedulePhases();
        // Nudge conveyor videos to ensure they remain playing after tab restore
        try {
          var vids = carouselRoot.querySelectorAll('.conveyor-item video');
          vids.forEach(function(v){
            v.muted = true; v.playsInline = true;
            if (v.readyState >= 1 && v.paused) v.play().catch(function(){});
          });
        } catch(_) {}
      }
    });

    // Clean up on unload
    window.addEventListener('beforeunload', function(){
      try { clearInterval(captionSyncId); } catch(_) {}
      clearPhaseTimer();
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