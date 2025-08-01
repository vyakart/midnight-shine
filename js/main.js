/**
 * main.js
 * - Baseline enhancements (year, theme, hero, terminal).
 * - Replaces bento with an accessible carousel:
 *   • Poster PNG shown by default for every slide.
 *   • Active slide swaps to animated GIF and plays (if not reduced-motion).
 *   • Adjacent slides' GIFs are preloaded for smoothness.
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

  // CAROUSEL
  var carouselRoot = document.getElementById('showcase-carousel');
  if (carouselRoot) {
    // Desired custom order
    var order = ['meditation','bjj','astro','art&design','ea','mathematics&physics'];

    // Minimal slide copy; adjust later as needed
    var copy = {
      'meditation': {
        title: 'Meditation',
        sub: 'Perception Lab',
        desc: 'Quiet attention as performance tool for learning, making, and relating.'
      },
      'bjj': {
        title: 'Brazilian Jiu‑Jitsu',
        sub: 'Frames • Levers • Timing',
        desc: 'Embodied problem‑solving under resistance; ideas earn survival.'
      },
      'astro': {
        title: 'Astrophotography',
        sub: 'Scale in Long Exposure',
        desc: 'Tracking faint light across hours for structure and color beyond habit.'
      },
      'art&design': {
        title: 'Art & Design',
        sub: 'Minimal Surfaces, Bold Edges',
        desc: 'Economy of form, then a saturated strike that turns the image.'
      },
      'ea': {
        title: 'Effective Altruism',
        sub: 'Impact Over Optics',
        desc: 'Evidence, counterfactuals, tractability—effort where it compounds.'
      },
      'mathematics&physics': {
        title: 'Mathematics & Physics',
        sub: 'Models That Disappear',
        desc: 'Clarity through constraints; structure that compresses without flattening.'
      }
    };

    // Build DOM
    var viewport = carouselRoot.querySelector('.carousel-viewport');
    var track = document.createElement('div');
    track.className = 'carousel-track';
    viewport.appendChild(track);

    var dotsWrap = carouselRoot.querySelector('.carousel-dots');

    // Helpers to paths
    function posterPath(name) { return '/assets/posters/' + name + '.png'; }
    function gifPath(name) { return '/assets/gifs/' + name + '.gif'; }

    // Slides
    var slides = order.map(function(name, idx) {
      var data = copy[name] || { title: name, sub: '', desc: '' };
      var slide = document.createElement('article');
      slide.className = 'carousel-slide';
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', (idx+1) + ' of ' + order.length);

      // Media: start with poster <img>. When active we replace with <video> (GIF) using <img src=gif> is enough,
      // but using <video> gives future flexibility; however GIF doesn’t play in video. So we swap <img src> to GIF.
      var media = document.createElement('div');
      media.className = 'carousel-media';

      var img = document.createElement('img');
      img.alt = data.title + ' poster';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.src = posterPath(name);
      img.setAttribute('data-gif', gifPath(name));
      img.setAttribute('data-poster', posterPath(name));
      media.appendChild(img);

      var content = document.createElement('div');
      content.className = 'carousel-content';
      var h3 = document.createElement('h3'); h3.textContent = data.title;
      var sub = document.createElement('div'); sub.className = 'carousel-sub'; sub.textContent = data.sub;
      var p = document.createElement('p'); p.className = 'carousel-desc'; p.textContent = data.desc;
      content.appendChild(h3); content.appendChild(sub); content.appendChild(p);

      slide.appendChild(media);
      slide.appendChild(content);
      track.appendChild(slide);

      // Dot
      var dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-controls', ''); // not strictly needed without IDs
      dot.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
      dot.addEventListener('click', function(){ goTo(idx); });
      dotsWrap.appendChild(dot);

      return { slide: slide, img: img, dot: dot };
    });

    // Controls
    var prevBtn = carouselRoot.querySelector('.carousel-btn.prev');
    var nextBtn = carouselRoot.querySelector('.carousel-btn.next');

    var index = 0;
    function clamp(i){ var n = order.length; return (i + n) % n; }

    function swapMedia(activeIdx) {
      slides.forEach(function(s, i){
        var img = s.img;
        var poster = img.getAttribute('data-poster');
        var gif = img.getAttribute('data-gif');

        if (i === activeIdx && !reduceMotion) {
          // show gif
          if (img.src !== location.origin + gif && img.src.indexOf(gif) === -1) {
            img.src = gif;
          }
        } else {
          // revert to poster
          if (img.src !== location.origin + poster && img.src.indexOf(poster) === -1) {
            img.src = poster;
          }
        }
      });

      // Preload neighbors' GIFs
      [clamp(activeIdx+1), clamp(activeIdx-1)].forEach(function(i){
        var pre = new Image();
        pre.src = slides[i].img.getAttribute('data-gif');
      });
    }

    function updateUI() {
      track.style.transform = 'translateX(' + (-100 * index) + '%)';
      slides.forEach(function(s, i){
        s.dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });
      swapMedia(index);
    }

    function goTo(i) { index = clamp(i); updateUI(); }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);

    // Keyboard support
    carouselRoot.addEventListener('keydown', function(e){
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    });

    // Initialize
    updateUI();

    // Pause GIFs when offscreen by reverting to posters (optional optimization)
    if ('IntersectionObserver' in window) {
      var io2 = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (!entry.isIntersecting) {
            slides.forEach(function(s){
              var poster = s.img.getAttribute('data-poster');
              if (s.img.src.indexOf('.gif') !== -1) s.img.src = poster;
            });
          } else {
            swapMedia(index);
          }
        });
      }, { rootMargin: '0px' });
      io2.observe(carouselRoot);
    }
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