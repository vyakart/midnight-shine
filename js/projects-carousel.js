/**
 * projects-carousel.js
 * Ruler-style infinite carousel for Projects (vanilla JS).
 * Data source: /data/timeline.json → projects[].title
 *
 * Public API:
 *   - JavaScript.initRulerCarousel(options)
 *     options: {
 *       container: HTMLElement (required),
 *       titles: string[] (required),
 *       initialIndex?: number (0-based index within original set),
 *       totalLines?: number (default 101) // ticks across the ruler width
 *     }
 */
(function () {
  'use strict';

  var DATA_URL = '/data/timeline.json';

  // Expose public init
  window.JavaScript = window.JavaScript || {};
  window.JavaScript.initRulerCarousel = initRulerCarousel;

  // Auto-bootstrap when on homepage section exists
  function bootstrap() {
    var container = document.getElementById('projects-carousel');
    if (!container) return;

    fetch(DATA_URL, { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status)); })
      .then(function (json) {
        var titles = [];
        if (json && Array.isArray(json.projects)) {
          // Keep newest-first similar to timeline.js (sort desc by 'sort' or year)
          var arr = json.projects.slice();
          arr.sort(function (a, b) {
            var sa = Number(a.sort || parseInt(String(a.year || 0), 10) || 0);
            var sb = Number(b.sort || parseInt(String(b.year || 0), 10) || 0);
            return sb - sa;
          });
          titles = arr.map(function (p) { return String(p.title || '').trim(); }).filter(Boolean);
        }
        if (!titles.length) {
          titles = ['Projects'];
        }
        initRulerCarousel({
          container: container,
          titles: titles,
          initialIndex: Math.min(1, titles.length - 1), // center 2nd if exists
          totalLines: 101
        });
      })
      .catch(function (err) {
        console.warn('Projects carousel: failed to load timeline.json:', err);
        // Fallback minimal mount with placeholder
        initRulerCarousel({
          container: container,
          titles: ['Projects'],
          initialIndex: 0,
          totalLines: 61
        });
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }

  /**
   * Initialize the ruler carousel in a container.
   */
  function initRulerCarousel(options) {
    var container = options.container;
    var titles = Array.isArray(options.titles) ? options.titles.slice() : [];
    var itemsPerSet = titles.length;
    if (!container || !itemsPerSet) return;

    var initialWithinSet = clampInt(options.initialIndex || 0, 0, Math.max(0, itemsPerSet - 1));
    var totalLines = clampInt(options.totalLines || 101, 21, 501); // sane defaults

    // DOM references
    var viewport = container.querySelector('.ruler-viewport');
    var track = container.querySelector('.ruler-track');
    var topLines = container.querySelector('.ruler-lines.top');
    var bottomLines = container.querySelector('.ruler-lines.bottom');

    // Controls and counter live region
    var section = container.closest('.projects');
    var controls = section ? section.querySelector('.ruler-controls') : null;
    var prevBtn = controls ? controls.querySelector('.ruler-prev') : null;
    var nextBtn = controls ? controls.querySelector('.ruler-next') : null;
    var currentEl = controls ? controls.querySelector('.ruler-current') : null;
    var totalEl = controls ? controls.querySelector('.ruler-total') : null;

    // Ensure base structure exists
    if (!viewport) {
      viewport = document.createElement('div');
      viewport.className = 'ruler-viewport';
      viewport.tabIndex = 0;
      container.appendChild(viewport);
    }
    if (!track) {
      track = document.createElement('div');
      track.className = 'ruler-track';
      track.setAttribute('role', 'list');
      viewport.appendChild(track);
    }

    // Render ruler ticks (top and bottom)
    renderRulerLines(topLines || createLines(container, 'top'), totalLines);
    renderRulerLines(bottomLines || createLines(container, 'bottom'), totalLines);

    // Triplicate items for seamless infinite loop
    var infiniteItems = createInfiniteItems(titles);
    var itemButtons = buildItems(track, infiniteItems);

    // State
    var activeIndex = itemsPerSet + initialWithinSet; // start from middle copy
    var isJumping = false;

    // Sizing cache
    var stepWidth = 0; // item width + gap
    var itemWidth = 0;
    var gap = 0;

    // Initialize counter
    if (totalEl) totalEl.textContent = String(itemsPerSet);

    // Apply initial layout
    measure();
    applyActiveStyles();
    applyTransform(true); // no transition on first paint
    updateCounter();

    // Wire item clicks
    itemButtons.forEach(function (btn, idx) {
      btn.addEventListener('click', function () {
        if (isJumping) return;
        handleItemClick(idx);
      });
    });

    // Controls
    if (prevBtn) prevBtn.addEventListener('click', function () { go(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(+1); });

    // Keyboard on viewport
    viewport.addEventListener('keydown', function (e) {
      if (isJumping) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(+1); }
      else if (e.key === 'Home') { e.preventDefault(); setToOriginal(0); }
      else if (e.key === 'End') { e.preventDefault(); setToOriginal(itemsPerSet - 1); }
    });

    // Resize
    window.addEventListener('resize', throttle(function () {
      var prevStep = stepWidth;
      measure();
      // After measurement changes, re-apply transform (no transition)
      if (stepWidth !== prevStep) applyTransform(true);
    }, 80));

    // Visibility pause of transitions not required; only transform animates

    // Helpers

    function handleItemClick(newIndex) {
      // Map arbitrary index to closest instance of its original item
      var targetOriginalIndex = mod(newIndex, itemsPerSet);
      var possible = [
        targetOriginalIndex, // first copy
        targetOriginalIndex + itemsPerSet, // middle copy
        targetOriginalIndex + itemsPerSet * 2 // last copy
      ];

      var closest = possible[0];
      var smallest = Math.abs(possible[0] - activeIndex);
      for (var i = 1; i < possible.length; i++) {
        var d = Math.abs(possible[i] - activeIndex);
        if (d < smallest) { smallest = d; closest = possible[i]; }
      }
      setActiveIndex(closest);
    }

    function go(delta) {
      setActiveIndex(activeIndex + (delta < 0 ? -1 : +1));
    }

    function setToOriginal(origIdx) {
      var target = itemsPerSet + clampInt(origIdx, 0, itemsPerSet - 1);
      setActiveIndex(target);
    }

    function setActiveIndex(nextIndex) {
      if (isJumping) return;
      activeIndex = nextIndex;
      applyActiveStyles();
      applyTransform(false);
      updateCounter();
      // If we left the middle copy, schedule a seamless jump back
      if (activeIndex < itemsPerSet || activeIndex >= itemsPerSet * 2) {
        seamlessRecenter();
      }
    }

    function seamlessRecenter() {
      // Jump to equivalent in the middle copy with no transition
      isJumping = true;
      requestAnimationFrame(function () {
        if (activeIndex < itemsPerSet) {
          activeIndex += itemsPerSet;
        } else if (activeIndex >= itemsPerSet * 2) {
          activeIndex -= itemsPerSet;
        }
        applyActiveStyles();
        applyTransform(true);
        // Allow transitions again on a separate tick
        setTimeout(function () { isJumping = false; }, 0);
      });
    }

    function applyActiveStyles() {
      itemButtons.forEach(function (btn, idx) {
        var isActive = idx === activeIndex;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-current', isActive ? 'true' : 'false');
        // Roving tabindex only on active
        btn.tabIndex = isActive ? 0 : -1;
      });
    }

    function updateCounter() {
      if (!currentEl) return;
      var currentPage = mod(activeIndex, itemsPerSet) + 1;
      currentEl.textContent = String(currentPage);
    }

    function measure() {
      // Use first button for width; track gap via computed style
      var sample = itemButtons[0];
      if (!sample) return;
      var csTrack = getComputedStyle(track);
      var csSample = getComputedStyle(sample);

      itemWidth = sample.offsetWidth;
      // Prefer gap property; fallback to margin-right
      gap = parseFloat(csTrack.columnGap || csTrack.gap || '0');
      if (!gap && itemButtons.length > 1) {
        var s1 = itemButtons[0];
        var s2 = itemButtons[1];
        gap = Math.max(0, s2.offsetLeft - s1.offsetLeft - itemWidth);
      }
      // If font scales changed, ensure minimums
      if (!isFinite(itemWidth) || itemWidth <= 0) itemWidth = 300;
      if (!isFinite(gap) || gap < 0) gap = 80;

      stepWidth = itemWidth + gap;
    }

    function applyTransform(noTransition) {
      var centerOffset = viewport.clientWidth / 2 - itemWidth / 2;
      var x = centerOffset - activeIndex * stepWidth;

      if (noTransition) track.classList.add('no-transition');
      track.style.transform = 'translate3d(' + x.toFixed(2) + 'px, 0, 0)';
      if (noTransition) {
        // Force reflow to commit transform without transition
        void track.offsetWidth;
        track.classList.remove('no-transition');
      }
    }

    // DOM builders

    function buildItems(target, data) {
      target.innerHTML = '';
      var btns = [];
      data.forEach(function (item, idx) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'rc-item';
        btn.setAttribute('role', 'listitem');
        btn.setAttribute('data-original-index', String(item.originalIndex));
        // Expose original title for targeted styling if needed
        var title = String(item.title || '');
        btn.setAttribute('data-title', title);

        // Special formatting for "Mario in the StacyVerse" → two lines without "the"
        if (/^mario\s+in\s+the\s+stacyverse$/i.test(title)) {
          btn.classList.add('rc-item--twoLine');
          btn.innerHTML = '<span class="rc-line1">Mario in</span><span class="rc-line2">Stacyverse</span>';
          // Ensure kerning for cleaner look
          btn.style.fontKerning = 'normal';
        } else {
          btn.textContent = title;
        }

        target.appendChild(btn);
        btns.push(btn);
      });
      return btns;
    }

    function createInfiniteItems(srcTitles) {
      var res = [];
      var N = srcTitles.length;
      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < N; j++) {
          res.push({
            id: String(i) + '-' + String(j),
            title: srcTitles[j],
            originalIndex: j
          });
        }
      }
      return res;
    }

    function createLines(root, where) {
      var el = document.createElement('div');
      el.className = 'ruler-lines ' + where;
      el.setAttribute('aria-hidden', 'true');
      root.appendChild(el);
      return el;
    }

    function renderRulerLines(linesEl, total) {
      if (!linesEl) return;
      linesEl.innerHTML = '';
      var totalLines = Math.max(3, total);
      var spacingPct = 100 / (totalLines - 1);
      for (var i = 0; i < totalLines; i++) {
        var tick = document.createElement('div');
        tick.className = 'tick';
        // Center and every 5th emphasized
        var isCenter = (i === Math.floor(totalLines / 2));
        var isFifth = (i % 5 === 0);
        if (isCenter) {
          tick.classList.add('center');
        } else if (isFifth) {
          tick.classList.add('major');
        } else {
          tick.classList.add('minor');
        }
        tick.style.left = (i * spacingPct) + '%';
        linesEl.appendChild(tick);
      }
    }
  }

  // Utilities

  function clampInt(n, min, max) {
    n = Number(n | 0);
    if (n < min) return min;
    if (n > max) return max;
    return n;
  }

  function mod(n, m) {
    return ((n % m) + m) % m;
  }

  function throttle(fn, wait) {
    var t = 0;
    return function () {
      var now = Date.now();
      if (now - t >= wait) {
        t = now;
        fn.apply(this, arguments);
      }
    };
  }

})();