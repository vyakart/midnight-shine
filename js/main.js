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

  // Theme init
  (function initTheme() {
    try {
      var stored = localStorage.getItem('theme');
      var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      var html = document.documentElement;
      var isDark = stored ? stored === 'dark' : prefersDark;
      html.classList.toggle('dark', isDark);
      var btn = document.getElementById('theme-toggle');
      if (btn) {
        btn.setAttribute('aria-pressed', String(isDark));
        btn.addEventListener('click', function () {
          var nowDark = !html.classList.contains('dark');
          html.classList.toggle('dark', nowDark);
          localStorage.setItem('theme', nowDark ? 'dark' : 'light');
          btn.setAttribute('aria-pressed', String(nowDark));
        });
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
    });

    // Hover-to-preview: play video while hovering over the poster; pause on leave
    function wireHoverPreview(slide){
      if (!slide) return;
      var el = slide.el;
      var vid = slide.video;
      var img = slide.img;
      el.addEventListener('pointerenter', function(){
        // Show video immediately for preview
        img.style.display = 'none';
        vid.style.display = '';
        // Ensure playback flags are set for autoplay policies
        vid.muted = true;
        vid.playsInline = true;
        // If not sufficiently loaded, nudge buffering before play
        if (vid.readyState < 2) {
          try { vid.load(); } catch (_) {}
        }
        // Skip initial black frame by seeking a tiny offset once metadata is ready
        var startPlayback = function() {
          try {
            if (vid.currentTime < 0.05) vid.currentTime = 0.05;
          } catch (_) {}
          if (!prefersReduced) {
            var p = vid.play();
            if (p && typeof p.then === 'function') {
              p.catch(function(){
                requestAnimationFrame(function(){ vid.play().catch(function(){}); });
              });
            }
          }
        };
        if (vid.readyState >= 1) {
          startPlayback();
        } else {
          var onceCanPlay = function() {
            vid.removeEventListener('loadedmetadata', onceCanPlay);
            startPlayback();
          };
          vid.addEventListener('loadedmetadata', onceCanPlay);
        }
        clearPhaseTimer(); // don't fight the user's hover
      });
      el.addEventListener('pointerleave', function(){
        // Return to poster and resume carousel scheduling
        try { vid.pause(); } catch(_) {}
        try { vid.currentTime = 0; } catch(_) {}
        vid.style.display = 'none';
        img.style.display = '';
        schedulePhases();
      });
      // Keyboard focus also previews; blur restores
      el.addEventListener('focusin', function(){
        img.style.display = 'none';
        vid.style.display = '';
        vid.muted = true;
        vid.playsInline = true;
        if (vid.readyState < 2) {
          try { vid.load(); } catch (_) {}
        }
        var startPlayback2 = function() {
          try {
            if (vid.currentTime < 0.05) vid.currentTime = 0.05;
          } catch (_) {}
          if (!prefersReduced) {
            var p2 = vid.play();
            if (p2 && typeof p2.then === 'function') {
              p2.catch(function(){
                requestAnimationFrame(function(){ vid.play().catch(function(){}); });
              });
            }
          }
        };
        if (vid.readyState >= 1) {
          startPlayback2();
        } else {
          var onceMeta = function(){
            vid.removeEventListener('loadedmetadata', onceMeta);
            startPlayback2();
          };
          vid.addEventListener('loadedmetadata', onceMeta);
        }
        clearPhaseTimer();
      });
      el.addEventListener('focusout', function(){
        vid.pause();
        vid.currentTime = 0;
        vid.style.display = 'none';
        img.style.display = '';
        schedulePhases();
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
      }
    });
  }

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
})();