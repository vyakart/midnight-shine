/**
 * projects-carousel.js
 * Ruler-style infinite carousel for Projects (vanilla JS).
 *
 * Enhanced to support category tabs inside the Projects section:
 * - Work, Projects, Talks & shows, Side quests, Volunteering
 * Data source: /data/timeline.json → arrays by key.
 *
 * Public API (returned from initRulerCarousel):
 *   - updateTitles(newTitles: string[]): void
 */
(function () {
  'use strict';

  var DATA_URL = './data/timeline.json';

  // Keep per-container API/state if needed later
  var CONTAINER_STATE = new WeakMap();

  // Expose public init for external usage if ever needed
  window.JavaScript = window.JavaScript || {};
  window.JavaScript.initRulerCarousel = initRulerCarousel;

  // Auto-bootstrap when on homepage Projects section exists
  function bootstrap() {
    var container = document.getElementById('projects-carousel');
    if (!container) return;

    fetch(DATA_URL, { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status)); })
      .then(function (json) {
        // Helper to extract titles from a category in timeline.json
        function getTitlesFrom(json, category) {
          var map = {
            work: 'work',
            projects: 'projects',
            talks: 'talks',
            side: 'sideQuests',
            sideQuests: 'sideQuests',
            volunteering: 'volunteering'
          };
          var key = map[category] || category;
          var arr = (json && Array.isArray(json[key])) ? json[key].slice() : [];
          // Sort newest first by 'sort' desc (fallback year)
          arr.sort(function (a, b) {
            var sa = Number(a.sort || parseInt(String(a.year || 0), 10) || 0);
            var sb = Number(b.sort || parseInt(String(b.year || 0), 10) || 0);
            return sb - sa;
          });
          return arr.map(function (p) { return String(p.title || '').trim(); }).filter(Boolean);
        }

        // Default category
        var currentCategory = 'work';
        var titles = getTitlesFrom(json, currentCategory);
        if (!titles.length) titles = ['Projects'];

        // Initialize the ruler carousel
        var api = initRulerCarousel({
          container: container,
          titles: titles,
          initialIndex: Math.min(1, titles.length - 1),
          totalLines: 101
        });

        // Wire category tabs within Projects section, if present
        wireCategoryTabs(json, api);

        function wireCategoryTabs(json, api) {
          var section = document.getElementById('projects');
          if (!section) return;

          var tabsRoot = section.querySelector('.tabs');
          var tabWork = section.querySelector('#projtab-work');
          var tabProj = section.querySelector('#projtab-projects');
          var tabTalks = section.querySelector('#projtab-talks');
          var tabSide = section.querySelector('#projtab-side');
          var tabVol = section.querySelector('#projtab-vol');

          var tabs = [tabWork, tabProj, tabTalks, tabSide, tabVol].filter(Boolean);
          if (!tabs.length) return;

          // Helper: hard re-init the carousel to guarantee visual update
          function hardReinit(newTitles) {
            try {
              // Remove viewport and ruler lines so init can rebuild cleanly
              var vp = container.querySelector('.ruler-viewport');
              var t = container.querySelector('.ruler-lines.top');
              var b = container.querySelector('.ruler-lines.bottom');
              if (vp) vp.parentElement.removeChild(vp);
              if (t) t.parentElement.removeChild(t);
              if (b) b.parentElement.removeChild(b);
            } catch (_) {}
            return initRulerCarousel({
              container: container,
              titles: newTitles,
              initialIndex: Math.min(1, newTitles.length - 1),
              totalLines: 101
            });
          }

          // Initial selection: Work
          setActive(tabWork);

          tabs.forEach(function (btn) {
            btn.addEventListener('click', function () {
              setActive(btn);
            });
          });

          // Keyboard navigation for tabs
          if (tabsRoot) {
            tabsRoot.addEventListener('keydown', function (e) {
              var idx = tabs.indexOf(document.activeElement);
              if (e.key === 'ArrowRight') {
                e.preventDefault();
                var next = tabs[(idx + 1 + tabs.length) % tabs.length];
                next.click(); next.focus();
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                var prev = tabs[(idx - 1 + tabs.length) % tabs.length];
                prev.click(); prev.focus();
              } else if (e.key === 'Home') {
                e.preventDefault();
                tabs[0].click(); tabs[0].focus();
              } else if (e.key === 'End') {
                e.preventDefault();
                var last = tabs[tabs.length - 1];
                last.click(); last.focus();
              }
            });
          }

          function setActive(btn) {
            tabs.forEach(function (t) {
              var isActive = (t === btn);
              t.setAttribute('aria-selected', String(isActive));
              t.tabIndex = isActive ? 0 : -1;
            });

            // Determine category by id
            var id = btn.id || '';
            var cat = 'projects';
            if (id.indexOf('projtab-work') >= 0) cat = 'work';
            else if (id.indexOf('projtab-projects') >= 0) cat = 'projects';
            else if (id.indexOf('projtab-talks') >= 0) cat = 'talks';
            else if (id.indexOf('projtab-side') >= 0) cat = 'sideQuests';
            else if (id.indexOf('projtab-vol') >= 0) cat = 'volunteering';

            var newTitles = getTitlesFrom(json, cat);
            if (!newTitles.length) newTitles = ['No items'];

            // Prefer hard re-init to eliminate any stale state
            api = hardReinit(newTitles);
          }
        }
      })
      .catch(function (err) {
        console.warn('Projects carousel: failed to load timeline.json:', err);

        // Offline/no-server fallback: use built-in titles per category
        var fallbackData = {
          work: [
            { title: 'Voicedeck' },
            { title: 'EAGxIndia ’24' },
            { title: 'Impact Academy' },
            { title: 'Kaya Guides' },
            { title: 'Superkit' },
            { title: 'StackOS' },
            { title: 'CFAL' },
            { title: 'IISc (Aerospace)' },
            { title: 'Orxa Energies' }
          ],
          projects: [
            { title: '0xNARC' },
            { title: 'Mario in the StacyVerse' },
            { title: '65° Delta Wing' },
            { title: 'E‑bike' }
          ],
          talks: [
            { title: 'Decloud 101 Kochi' },
            { title: 'Expo Circuit' },
            { title: 'Blockchain Roadshow' }
          ],
          sideQuests: [
            { title: 'Midjourney Magazine' },
            { title: 'Blue belt BJJ' },
            { title: 'Photography' },
            { title: 'Amateur Astronomy' },
            { title: 'Newsletter dabbling' }
          ],
          volunteering: [
            { title: 'EA Bangalore' },
            { title: 'Centre for Effective Altruism (Jaipur)' },
            { title: 'EA Architects & Planners' },
            { title: 'Institute of Jiujitsu' },
            { title: 'CFAL Observatory' }
          ]
        };

        function titlesOf(cat) { return (fallbackData[cat] || []).map(function (o) { return o.title; }); }

        var fbTitles = titlesOf('work');
        if (!fbTitles.length) fbTitles = ['Work'];

        // Initialize with fallback Projects titles
        var api = initRulerCarousel({
          container: container,
          titles: fbTitles,
          initialIndex: Math.min(1, fbTitles.length - 1),
          totalLines: 101
        });

        // Wire tabs using fallback data
        (function wireCategoryTabsFallback(fb, apiRef) {
          var section = document.getElementById('projects');
          if (!section) return;

          var tabsRoot = section.querySelector('.tabs');
          var tabWork = section.querySelector('#projtab-work');
          var tabProj = section.querySelector('#projtab-projects');
          var tabTalks = section.querySelector('#projtab-talks');
          var tabSide = section.querySelector('#projtab-side');
          var tabVol = section.querySelector('#projtab-vol');

          var tabs = [tabWork, tabProj, tabTalks, tabSide, tabVol].filter(Boolean);
          if (!tabs.length) return;

          function setActive(btn) {
            tabs.forEach(function (t) {
              var isActive = (t === btn);
              t.setAttribute('aria-selected', String(isActive));
              t.tabIndex = isActive ? 0 : -1;
            });

            var id = btn.id || '';
            var cat = 'projects';
            if (id.indexOf('projtab-work') >= 0) cat = 'work';
            else if (id.indexOf('projtab-projects') >= 0) cat = 'projects';
            else if (id.indexOf('projtab-talks') >= 0) cat = 'talks';
            else if (id.indexOf('projtab-side') >= 0) cat = 'sideQuests';
            else if (id.indexOf('projtab-vol') >= 0) cat = 'volunteering';

            var newTitles = titlesOf(cat);
            if (!newTitles.length) newTitles = ['No items'];

            // Hard re-init with new titles
            try {
              var vp = container.querySelector('.ruler-viewport');
              var t = container.querySelector('.ruler-lines.top');
              var b = container.querySelector('.ruler-lines.bottom');
              if (vp) vp.parentElement.removeChild(vp);
              if (t) t.parentElement.removeChild(t);
              if (b) b.parentElement.removeChild(b);
            } catch (_) {}

            apiRef = initRulerCarousel({
              container: container,
              titles: newTitles,
              initialIndex: Math.min(1, newTitles.length - 1),
              totalLines: 101
            });
          }

          // Initial selection: Work
          if (tabWork) setActive(tabWork);

          tabs.forEach(function (btn) {
            btn.addEventListener('click', function () { setActive(btn); });
          });

          if (tabsRoot) {
            tabsRoot.addEventListener('keydown', function (e) {
              var idx = tabs.indexOf(document.activeElement);
              if (e.key === 'ArrowRight') {
                e.preventDefault();
                var next = tabs[(idx + 1 + tabs.length) % tabs.length];
                next.click(); next.focus();
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                var prev = tabs[(idx - 1 + tabs.length) % tabs.length];
                prev.click(); prev.focus();
              } else if (e.key === 'Home') {
                e.preventDefault();
                tabs[0].click(); tabs[0].focus();
              } else if (e.key === 'End') {
                e.preventDefault();
                var last = tabs[tabs.length - 1];
                last.click(); last.focus();
              }
            });
          }
        })(fallbackData, api);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }

  /**
   * Initialize the ruler carousel in a container.
   * Returns an API with updateTitles(newTitles: string[]).
   */
  function initRulerCarousel(options) {
    var container = options.container;
    var titles = Array.isArray(options.titles) ? options.titles.slice() : [];
    var itemsPerSet = titles.length;
    if (!container || !itemsPerSet) return { updateTitles: function(){} };

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

    // Ensure base structure exists (and correct DOM order: top lines, viewport, bottom lines)
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

    // Ensure ruler lines exist
    if (!topLines)  topLines = createLines(container, 'top');
    if (!bottomLines) bottomLines = createLines(container, 'bottom');

    // Reorder: top before viewport, bottom after viewport
    try {
      if (topLines.nextSibling !== viewport) {
        container.insertBefore(topLines, viewport);
      }
      if (bottomLines.previousSibling !== viewport) {
        // insert after viewport
        container.insertBefore(bottomLines, viewport.nextSibling);
      }
    } catch (_) {}

    // Render ruler ticks (top and bottom)
    renderRulerLines(topLines, totalLines);
    renderRulerLines(bottomLines, totalLines);

    // Triplicate items for seamless infinite loop
    var infiniteItems = createInfiniteItems(titles);
    var itemButtons = buildItems(track, infiniteItems);
    // Ensure preview engine wires to freshly built items even if it loaded after us
    try { if (window.PreviewCard && typeof window.PreviewCard.scan === 'function') window.PreviewCard.scan(track); } catch (_) {}

    // State
    var activeIndex = itemsPerSet + initialWithinSet; // start from middle copy
    var isJumping = false;

    // Sizing cache
    var stepWidth = 0; // item width + gap
    var itemWidth = 0;
    var gap = 0;

    // Initialize counter
    if (totalEl) totalEl.textContent = String(itemsPerSet);
 
    // Apply initial layout (after layout settles)
    layoutAndCenter(true); // no transition on first paint

    // Wire item clicks
    wireButtons();

    // Controls (avoid stacking duplicate listeners by removing previous via clone or flag)
    // To keep it simple and idempotent, remove previous listeners by cloning nodes
    function replaceWithClone(btn, handler) {
      if (!btn) return null;
      var clone = btn.cloneNode(true);
      btn.parentNode.replaceChild(clone, btn);
      clone.addEventListener('click', handler);
      return clone;
    }
    prevBtn = replaceWithClone(prevBtn, function () { go(-1); });
    nextBtn = replaceWithClone(nextBtn, function () { go(+1); });

    // Keyboard on viewport (bind once)
    if (viewport && !viewport.__keydownBound) {
      viewport.addEventListener('keydown', function (e) {
        if (isJumping) return;
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); go(+1); }
        else if (e.key === 'Home') { e.preventDefault(); setToOriginal(0); }
        else if (e.key === 'End') { e.preventDefault(); setToOriginal(itemsPerSet - 1); }
      });
      // mark as bound
      try { viewport.__keydownBound = true; } catch(_) {}
    }

    // Resize
    window.addEventListener('resize', throttle(function () {
      var prevStep = stepWidth;
      measure();
      // After measurement changes, re-apply transform (no transition)
      if (stepWidth !== prevStep) applyTransform(true);
    }, 80));

    // Helpers

    function wireButtons() {
      itemButtons.forEach(function (btn, idx) {
        btn.addEventListener('click', function () {
          if (isJumping) return;
          handleItemClick(idx);
        });
      });
    }

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
      if (totalEl) totalEl.textContent = String(itemsPerSet);
    }

    function measure() {
      // Use first button for width; track gap via computed style
      var sample = itemButtons[0];
      if (!sample) return;
      var csTrack = getComputedStyle(track);

      itemWidth = sample.offsetWidth;
      // Prefer gap property; fallback to computed offset
      gap = parseFloat(csTrack.columnGap || csTrack.gap || '0');
      if (!gap && itemButtons.length > 1) {
        var s1 = itemButtons[0];
        var s2 = itemButtons[1];
        gap = Math.max(0, s2.offsetLeft - s1.offsetLeft - itemWidth);
      }
      if (!isFinite(itemWidth) || itemWidth <= 0) itemWidth = 300;
      if (!isFinite(gap) || gap < 0) gap = 80;

      stepWidth = itemWidth + gap;
    }
 
    // Layout then center the active item. Retries if width not ready.
    function layoutAndCenter(noTransition) {
      function doLayout() {
        measure();
        if (!isFinite(itemWidth) || itemWidth <= 0) {
          setTimeout(doLayout, 50);
          return;
        }
        applyActiveStyles();
        applyTransform(!!noTransition);
        updateCounter();
      }
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function(){ requestAnimationFrame(doLayout); }, { once: true });
      } else {
        requestAnimationFrame(doLayout);
      }
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
      data.forEach(function (item) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'rc-item';
        btn.setAttribute('role', 'listitem');
        btn.setAttribute('data-original-index', String(item.originalIndex));
        // Expose original title for targeted styling; support "/nextline" to split into two lines
        var rawTitle = String(item.title || '');
        var parts = rawTitle.split(/\s*\/\s*nextline\s*/i);
        var normTitle = rawTitle.replace(/\s*\/\s*nextline\s*/ig, ' ').trim();
        btn.setAttribute('data-title', normTitle);
 
        if (parts.length === 2 && parts[0] && parts[1]) {
          btn.classList.add('rc-item--twoLine');
          // Build spans safely with textContent
          var l1 = document.createElement('span'); l1.className = 'rc-line1'; l1.textContent = parts[0];
          var l2 = document.createElement('span'); l2.className = 'rc-line2'; l2.textContent = parts[1];
          btn.innerHTML = '';
          btn.appendChild(l1); btn.appendChild(l2);
          btn.style.fontKerning = 'normal';
        } else if (/^mario\s+in\s+the\s+stacyverse$/i.test(normTitle)) {
          // Special formatting for "Mario in the StacyVerse" → two lines without "the"
          btn.classList.add('rc-item--twoLine');
          btn.innerHTML = '<span class="rc-line1">Mario in</span><span class="rc-line2">Stacyverse</span>';
          btn.style.fontKerning = 'normal';
        } else {
          btn.textContent = rawTitle;
        }

        // Auto-attach hover preview for Questlog titles
        try { attachPreviewForTitle(btn, normTitle); } catch (_) {}

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

    // API: update titles dynamically (used by category tabs)
    function updateTitles(newTitles) {
      titles = Array.isArray(newTitles) ? newTitles.slice() : [];
      itemsPerSet = Math.max(1, titles.length);

      // Rebuild items
      infiniteItems = createInfiniteItems(titles);
      itemButtons = buildItems(track, infiniteItems);
      // Re-scan after rebuild so hover previews remain active across category switches
      try { if (window.PreviewCard && typeof window.PreviewCard.scan === 'function') window.PreviewCard.scan(track); } catch (_) {}

      // Reset state
      activeIndex = itemsPerSet + Math.min(1, itemsPerSet - 1);
      if (totalEl) totalEl.textContent = String(itemsPerSet);

      // Rewire button clicks
      wireButtons();

      // Re-measure and center
      layoutAndCenter(true);
    }

    var api = { updateTitles: updateTitles };
    CONTAINER_STATE.set(container, api);
    return api;
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

  // -----------------------
  // Preview mapping for Questlog titles → text + assets
  // -----------------------

  function canonicalizeTitle(s) {
    if (!s) return '';
    // Lowercase, strip diacritics, collapse non-alphanumerics to spaces
    try { s = s.normalize('NFKD'); } catch (_) {}
    s = String(s).toLowerCase()
      .replace(/[\u2018\u2019\u201A\u201B\u2032]/g, "'")   // various single quotes → '
      .replace(/[\u201C\u201D\u201E\u2033]/g, '"')       // double quotes
      .replace(/[\u2013\u2014\u2212]/g, '-')             // dashes → hyphen
      .replace(/\s*\/\s*nextline\s*/g, ' ')              // collapse explicit nextline markers
      .replace(/[^a-z0-9]+/g, ' ')                       // non-alphanumerics → space
      .trim()
      .replace(/\s+/g, ' ');
    return s;
  }

  // Data pulled from your brief. Pictures sourced from /assets/projects when available.
  var PV_MAP = (function () {
    var A = './assets/projects/';
    // Helper to prefix
    function P() {
      var arr = [];
      for (var i = 0; i < arguments.length; i++) arr.push(A + arguments[i]);
      return arr;
    }

    var map = {
      // Work
      'voicedeck': {
        text: "evaluator, aka “does this actually matter?” helped measure journalism impact with llms, picked artwork via diffusion models, and co-authored the paper the team shipped. receipts > vibes.",
        srcs: P('Evaluator-at-VoiceDeck.jpg')
      },
      'eagxindia 24': {
        text: "production lead for ~300 people at conrad. ran the run-sheet, safety plan, risk trees, av, vendors, vegan menu, and design direction. made chaos look like choreography."
      },
      'impact academy': {
        text: "ops for a 3-day summit: inventory, travel, dietary flows, and on-ground wrangling. also shot the story so the week lived beyond the week."
      },
      'kaya guides': {
        text: "pilot lead, one intense month. built the ops spine, tracked data, researched digital health, and prettied a fundraising deck that didn’t lie."
      },
      'superkit': {
        text: "consultant. wrote bd playbooks and case-study kits (istanbul tulip fest, hornbill, token2049). the job: turn “we should” into “here’s how”."
      },
      'stackos': {
        text: "dev-rel doing five jobs: docs for v2, community + ambassador program, event ops at token2049 + web3 conclave, and enough graphics/motion to break figma auto-save. also judged ethindia."
      },
      'centre for advanced learning': {
        text: "teaching assistant for physics + maths (11th/12th). nights at the observatory cataloguing galaxies to stay honest about scale.",
        srcs: P(
          'Observatory-Volunteer-at-Centre-for-Advanced-Learning-1.jpg',
          'Observatory-Volunteer-at-Centre-for-Advanced-Learning-2.jpg'
        )
      },
      'cfal': {
        text: "teaching assistant for physics + maths (11th/12th). nights at the observatory cataloguing galaxies to stay honest about scale.",
        srcs: P(
          'Observatory-Volunteer-at-Centre-for-Advanced-Learning-1.jpg',
          'Observatory-Volunteer-at-Centre-for-Advanced-Learning-2.jpg'
        )
      },
      'iisc aerospace': {
        text: "research assistant in biomechanics (aero). modeled how bodies move in simulated space conditions with md adams, mocap, lifemod. learned that “almost right” is still wrong."
      },
      'orxa energies': {
        text: "mech systems intern. fea on a reverse trike: braking, load transfer, steering effort, the whole force buffet.",
        srcs: P(
          'Mechanical-Systems-Intern-at-Orxa-Energies-PvtLtd-1.jpg',
          'Mechanical-Systems-Intern-at-Orxa-Energies-PvtLtd-2.jpg'
        )
      },

      // Projects
      '0xnarc': {
        text: "hackathon judge that reads messy repos with gpt, scores them and mints soulbound “you did the thing badly or well” receipts. fewer arguments, faster results..",
        captions: ["0xnarc — hackathon judge that reads messy repos with gpt, scores them and mints soulbound “you did the thing badly or well” receipts. fewer arguments, faster results.."],
        srcs: P('OxNARC.png')
      },
      'mario in the stacyverse': {
        text: "a trippy fan level on a low-bandwidth multiplayer engine that my friend made from scratch.I did the look, the cuts and the background score; mario took a pill and reality blinked.A tribute to the pillheads community",
        captions: ["a trippy fan level on a low-bandwidth multiplayer engine that my friend made from scratch.I did the look, the cuts and the background score; mario took a pill and reality blinked.A tribute to the pillheads community"],
        srcs: P('Mario-in-the-StacyVerse-at-Self.mp4') // video supported by preview engine
      },
      '65 delta wing': {
        text: "added a tiny step on the upper surface; simulations smiled: ~6% lift bump. vortices, befriended.",
        captions: ["65° delta wing — added a tiny step on the upper surface; simulations smiled: ~6% lift bump. vortices, befriended."],
        srcs: P('Numerical-Analysis-of-a-65-Delta-Wing-1.png', 'Numerical-Analysis-of-a-65-Delta-Wing-2.png')
      },
      'e bike': {
        text: "8 friends, one dirt track. i owned “make it lighter but don’t snap it” (FEA), then helped people to actually want to ride it.",
        captions: ["e-bike — 8 friends, one dirt track. i owned “make it lighter but don’t snap it” (FEA), then helped people to actually want to ride it."],
        srcs: P('E-bike-1.jpg', 'E-bike-2.jpg', 'E-bike-3.jpg', 'E-bike-4.jpg')
      },

      // Talks & shows
      'decloud 101 kochi': {
        text: "why decentralized cloud beats the usual suspects, without sounding like a brochure."
      },
      'decloud 101': {
        text: "why decentralized cloud beats the usual suspects, without sounding like a brochure."
      },
      'expo circuit': {
        text: "eth india (ktpo), web3 conclave (hyderabad), web3 conf (goa), token2049 (singapore). set up booths, tuned decks, and herded humans with a smile."
      },
      'blockchain roadshow': {
        text: "ran talks and micro-events across tier-1 and tier-2 cities."
      },

      // Easter Eggs (side quests)
      'midjourney magazine': {
        text: "landed in midjourney magazine, issue 24. nice."
      },
      'blue belt bjj': {
        text: "under coach rohit vasudevan. learned the ancient art of losing slowly and breathing on bottom. progress!"
      },
      'photography': {
        text: "three days, one retreat, story-first set the team could actually use for impact academy and india network for impact.\nFTCIndia: one power packed day filled with discussions about blockchain, impact and many other utilities happening at a sanctuary right in the heart of the city."
      },
      'amateur astronomy': {
        text: "shot planets, comets, nebulae, galaxies; remembered we are very, very small."
      },
      'newsletter dabbling': {
        text: "wrote gameswala, resourcewala, and cryptodoodhshots for doodhwala—kept it useful, not noisy."
      },
      'doodhwala': {
        text: "wrote gameswala, resourcewala, and cryptodoodhshots for doodhwala—kept it useful, not noisy."
      },

      // Volunteering
      'ea bangalore': {
        text: "community builder. keep the lights on: meetups, talks, ops, and the “is this useful?” filter."
      },
      'centre for effective altruism jaipur': {
        text: "full-time volunteer for a week: ops, logistics, speaker liaison, attendee care. quiet glue work."
      },
      'eagxindia jaipur': {
        text: "full-time volunteer for a week: ops, logistics, speaker liaison, attendee care. quiet glue work."
      },
      'ea architects planners': {
        text: "coordinated speakers and schedules so panels didn’t collide."
      },
      'institute of jiujitsu': {
        text: "ongoing help with ops/programming; occasionally tape wrists and egos."
      },
      'cfal observatory': {
        text: "cataloguing deep-sky objects with a tiny crew and colder fingers.",
        srcs: P(
          'Observatory-Volunteer-at-Centre-for-Advanced-Learning-3.jpg',
          'Observatory-Volunteer-at-Centre-for-Advanced-Learning-4.jpg'
        )
      }
    };

    return map;
  })();

  function attachPreviewForTitle(el, normTitle) {
    if (!el || !normTitle) return;
    var key = canonicalizeTitle(normTitle);

    // Some titles include location or year variants; try relaxed fallbacks
    var candidateKeys = [key];
    // Drop trailing years like " 24" or "( 24 )"
    var k2 = key.replace(/\s*\(?\d{2,4}\)?$/, '').trim();
    if (k2 && k2 !== key) candidateKeys.push(k2);
    // Remove words like "kochi", "blr" to match base talk
    var k3 = key.replace(/\b(kochi|blr|bangalore|jaipur)\b/g, '').replace(/\s+/g, ' ').trim();
    if (k3 && candidateKeys.indexOf(k3) === -1) candidateKeys.push(k3);

    var meta = null;
    for (var i = 0; i < candidateKeys.length; i++) {
      meta = PV_MAP[candidateKeys[i]];
      if (meta) break;
    }
    if (!meta) return;

    // Apply data- attributes for preview-card.js to pick up
    if (meta.text) el.setAttribute('data-preview-text', meta.text);
    if (Array.isArray(meta.srcs) && meta.srcs.length) {
      el.setAttribute('data-preview-srcs', meta.srcs.join(','));
    }
    if (Array.isArray(meta.captions) && meta.captions.length) {
      try {
        el.setAttribute('data-preview-captions', JSON.stringify(meta.captions));
      } catch (_) {
        // Fallback (less safe for commas inside captions)
        el.setAttribute('data-preview-captions', meta.captions.join(','));
      }
    }
    // Also add a marker so the preview engine scan always includes this element
    el.setAttribute('data-preview', '1');
    el.setAttribute('data-preview-placement', 'top');
    el.setAttribute('data-preview-width', '380');

    // Lightweight debug marker to verify mapping in dev tools
    try { el.setAttribute('title', 'Preview attached'); } catch (_) {}
    try { console.debug('[PV] attached', { key: key, candidateKeys: candidateKeys, text: !!meta.text, srcs: (meta.srcs||[]).length }); } catch(_) {}
  }

})();