/**
 * projects.js
 * Horizontal scroller (LandLines/Netflix style) with accessible tabs for:
 * - Projects
 * - Side Projects
 *
 * Implementation notes:
 * - Reuses existing .nf-row/.nf-viewport/.nf-track/.nf-card styles from css/styles.css
 * - Initializes lazily via IntersectionObserver when the section enters the viewport
 * - Renders originals + clones to enable seamless continuous scroll
 * - Pauses on hover/focus/visibilitychange
 * - Keyboard navigation: roving tabindex across originals set
 * - Media: supports first attachment (image or video) as preview; more media may be added later via lightbox
 */

(function () {
  'use strict';

  var DATA_URL = '/data/profile.json';

  // Public entrypoint
  function initProjectsSection() {
    var section = document.getElementById('projects');
    if (!section) return;

    // Lazy init when section is near viewport
    if ('IntersectionObserver' in window) {
      var inited = false;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!inited && entry.isIntersecting) {
            inited = true;
            io.disconnect();
            boot(section);
          }
        });
      }, { rootMargin: '200px' });
      io.observe(section);
    } else {
      // Fallback: init immediately
      boot(section);
    }
  }

  function boot(section) {
    loadProfile()
      .then(function (profile) {
        initTabs(section, profile);
      })
      .catch(function (err) {
        console.warn('Failed to load profile.json:', err);
      });
  }

  // --------------------
  // Data helpers
  // --------------------
  function loadProfile() {
    return fetch(DATA_URL, { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status)); });
  }

  function selectCollection(profile, name) {
    // Prefer dedicated top-level arrays if present
    if (name === 'Projects' && Array.isArray(profile.projects)) return profile.projects;
    if (name === 'Side Projects' && Array.isArray(profile.sideProjects)) return profile.sideProjects;

    // Fallback to allCollections by name
    if (Array.isArray(profile.allCollections)) {
      var col = profile.allCollections.find(function (c) { return c && c.name === name; });
      if (col && Array.isArray(col.items)) return col.items;
    }
    return [];
  }

  function normalizeAttachmentUrl(url) {
    if (!url || typeof url !== 'string') return '';
    // Remap /content/media/... to /assets/projects/...
    if (url.indexOf('/content/media/') === 0) {
      return url.replace('/content/media/', '/assets/projects/');
    }
    return url;
  }

  // --------------------
  // Rendering
  // --------------------
  function renderCategory(sectionRoot, profile, categoryName) {
    var panel = sectionRoot.querySelector('.tabpanel #' + slugId(categoryName));
    // Our markup nests the nf-row inside each tabpanel; select by data-category instead
    var row = sectionRoot.querySelector('.nf-row[data-category="' + categoryName + '"]');
    if (!row) return;

    var viewport = row.querySelector('.nf-viewport');
    var track = row.querySelector('.nf-track');
    if (!viewport || !track) return;

    // Clear track
    track.innerHTML = '';

    var items = selectCollection(profile, categoryName);
    // Build one set
    var originals = buildSet(track, items);
    // If empty, leave a subtle placeholder
    if (!originals.length) {
      var empty = document.createElement('div');
      empty.setAttribute('role', 'note');
      empty.style.color = 'var(--color-text-muted, #666)';
      empty.style.padding = '8px 12px';
      empty.textContent = 'No items found in ' + categoryName + '.';
      track.appendChild(empty);
      return { stop: function () {} };
    }

    // Build clones to enable seamless loop
    buildSet(track, items);
    buildSet(track, items);

    // Start continuous scroll
    var runner = initAutoScroll(viewport, track, originals);
    return runner;
  }

  function slugId(categoryName) {
    return 'panel-' + categoryName.toLowerCase().replace(/\s+/g, '-');
  }

  function buildSet(track, items) {
    var created = [];
    items.forEach(function (item, idx) {
      var card = buildCard(item, idx);
      track.appendChild(card);
      created.push(card);
    });
    return created;
  }

  // --------------------
  // Lightbox (optional enhancement)
  // --------------------
  var cardToItem = new WeakMap();
  var lightbox = null;
  var lightboxEls = null;
  var lightboxOpen = false;
  var lightboxIndex = 0;
  var lightboxItem = null;
  var lightboxRestoreFocusEl = null;

  function ensureLightbox() {
    if (lightbox) return lightbox;
    var backdrop = document.createElement('div');
    backdrop.className = 'lightbox-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-label', 'Project media viewer');

    var content = document.createElement('div');
    content.className = 'lightbox-content';

    var closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Close viewer');
    closeBtn.innerHTML = '&times;';

    var prevBtn = document.createElement('button');
    prevBtn.className = 'lightbox-nav prev';
    prevBtn.type = 'button';
    prevBtn.setAttribute('aria-label', 'Previous media');
    prevBtn.textContent = '‹';

    var nextBtn = document.createElement('button');
    nextBtn.className = 'lightbox-nav next';
    nextBtn.type = 'button';
    nextBtn.setAttribute('aria-label', 'Next media');
    nextBtn.textContent = '›';

    var slide = document.createElement('div');
    slide.className = 'lightbox-slide';

    var counter = document.createElement('div');
    counter.className = 'lightbox-counter';
    counter.setAttribute('aria-live', 'polite');

    content.appendChild(closeBtn);
    content.appendChild(prevBtn);
    content.appendChild(nextBtn);
    content.appendChild(slide);
    content.appendChild(counter);
    backdrop.appendChild(content);

    document.body.appendChild(backdrop);

    // Events
    backdrop.addEventListener('click', function(e){
      if (e.target === backdrop) closeLightbox();
    });
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    document.addEventListener('keydown', onDocKey);

    lightbox = backdrop;
    lightboxEls = { content: content, slide: slide, closeBtn: closeBtn, prevBtn: prevBtn, nextBtn: nextBtn, counter: counter };
    return lightbox;
  }

  function onDocKey(e){
    if (!lightboxOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); closeLightbox(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); nextSlide(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
  }

  function openLightbox(item, originEl){
    ensureLightbox();
    lightboxItem = item;
    lightboxIndex = 0;
    lightboxRestoreFocusEl = originEl || null;
    lightbox.classList.add('open');
    lightboxOpen = true;
    document.documentElement.setAttribute('data-projects-modal', 'open');
    renderSlide();
    requestAnimationFrame(function(){ lightboxEls.closeBtn.focus(); });
  }

  function closeLightbox(){
    if (!lightboxOpen) return;
    lightbox.classList.remove('open');
    lightboxOpen = false;
    document.documentElement.removeAttribute('data-projects-modal');
    // Stop any playing video
    var v = lightboxEls.slide.querySelector('video');
    if (v) { try { v.pause(); } catch(_){} }
    if (lightboxRestoreFocusEl) {
      try { lightboxRestoreFocusEl.focus(); } catch(_){}
      lightboxRestoreFocusEl = null;
    }
  }

  function renderSlide(){
    if (!lightboxItem || !lightboxEls) return;
    var atts = Array.isArray(lightboxItem.attachments) ? lightboxItem.attachments : [];
    if (!atts.length) { lightboxEls.slide.innerHTML = ''; return; }
    if (lightboxIndex < 0) lightboxIndex = atts.length - 1;
    if (lightboxIndex >= atts.length) lightboxIndex = 0;
    var att = atts[lightboxIndex];
    var url = normalizeAttachmentUrl(att && att.url);
    lightboxEls.slide.innerHTML = '';
    var node = null;
    if (att && att.type === 'video') {
      var vid = document.createElement('video');
      vid.controls = true;
      vid.playsInline = true;
      vid.preload = 'metadata';
      var src = document.createElement('source');
      src.src = url;
      src.type = 'video/mp4';
      vid.appendChild(src);
      node = vid;
    } else {
      var img = document.createElement('img');
      img.alt = altTextFromItem(lightboxItem) + ' (' + (lightboxIndex + 1) + '/' + atts.length + ')';
      img.decoding = 'async';
      img.loading = 'eager';
      img.src = url;
      node = img;
    }
    lightboxEls.slide.appendChild(node);
    lightboxEls.counter.textContent = (lightboxIndex + 1) + ' / ' + atts.length;
  }

  function nextSlide(){ lightboxIndex += 1; renderSlide(); }
  function prevSlide(){ lightboxIndex -= 1; renderSlide(); }

  function buildCard(item, idx) {
    var card = document.createElement('div');
    card.className = 'nf-card';
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', idx === 0 ? '0' : '-1');

    var title = String(item.title || item.heading || 'Untitled');
    var year = item.year ? String(item.year) : '';
    var desc = item.description ? String(item.description).replace(/\s+/g, ' ').trim() : '';

    var labelId = uniqueId('proj-title-');
    var subId = uniqueId('proj-sub-');

    card.setAttribute('aria-labelledby', labelId);
    card.setAttribute('aria-describedby', subId);

    var attachment = (Array.isArray(item.attachments) ? item.attachments[0] : null) || null;

    // Image or video element
    var hasMedia = false;
    var videoEl = null;

    if (attachment && attachment.type === 'video') {
      var vUrl = normalizeAttachmentUrl(attachment.url);
      videoEl = document.createElement('video');
      videoEl.className = 'preview';
      videoEl.setAttribute('playsinline', '');
      videoEl.setAttribute('muted', '');
      videoEl.setAttribute('preload', 'metadata');
      videoEl.setAttribute('loop', '');
      videoEl.muted = true; videoEl.loop = true; videoEl.playsInline = true;

      var source = document.createElement('source');
      source.src = vUrl;
      source.type = 'video/mp4';
      videoEl.appendChild(source);

      card.appendChild(videoEl);
      hasMedia = true;
    } else if (attachment && attachment.type === 'image') {
      var iUrl = normalizeAttachmentUrl(attachment.url);
      var img = document.createElement('img');
      img.className = 'poster';
      img.alt = altTextFromItem(item);
      img.decoding = 'async';
      img.loading = idx === 0 ? 'eager' : 'lazy';
      // Provide intrinsic dimensions to reduce CLS when available
      if (attachment.width && attachment.height) {
        img.width = Number(attachment.width);
        img.height = Number(attachment.height);
      }
      img.src = iUrl;
      // fallback background on error
      img.addEventListener('error', function () {
        img.removeAttribute('src');
        img.style.background = '#000';
      });
      card.appendChild(img);
      hasMedia = true;
    }

    // Overlay
    var overlay = document.createElement('div');
    overlay.className = 'nf-overlay';

    var t = document.createElement('div');
    t.className = 'nf-title';
    t.id = labelId;
    t.textContent = title + (year ? ' · ' + year : '');

    var s = document.createElement('div');
    s.className = 'nf-sub';
    s.id = subId;
    s.textContent = desc || '';

    overlay.appendChild(t);
    overlay.appendChild(s);
    card.appendChild(overlay);

    // Interactions for video preview
    if (videoEl) {
      function startPreview() {
        try { if (videoEl.currentTime < 0.05) videoEl.currentTime = 0.05; } catch (_){}
        var p = videoEl.play();
        if (p && typeof p.then === 'function') p.catch(function(){});
      }
      function stopPreview() {
        try { videoEl.pause(); videoEl.currentTime = 0; } catch (_){}
      }
      card.addEventListener('pointerenter', startPreview);
      card.addEventListener('focusin', startPreview);
      card.addEventListener('pointerleave', stopPreview);
      card.addEventListener('focusout', function (e) {
        if (!card.contains(document.activeElement)) stopPreview();
      });
      document.addEventListener('visibilitychange', function(){
        if (document.hidden) {
          stopPreview();
        }
      });
    }

    // If no media, ensure a visible background
    if (!hasMedia) {
      card.style.background = '#111';
    }

    // Map card to its item for the lightbox
    try { cardToItem.set(card, item); } catch (_) {}

    // Click/keyboard to open lightbox
    card.addEventListener('click', function(){
      openLightbox(item, card);
    });
    card.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(item, card);
      }
    });

    return card;
  }

  function altTextFromItem(item) {
    var base = String(item.title || item.heading || 'Project');
    return base + ' preview';
  }

  // --------------------
  // Motion
  // --------------------
  function initAutoScroll(viewport, track, originals) {
    // Measure width of originals set
    function setWidth() {
      var firstIdx = 0;
      var lastIdx = originals.length - 1;
      var first = originals[firstIdx];
      var last = originals[lastIdx];
      if (!first || !last) return 0;
      var left = first.offsetLeft;
      var right = last.offsetLeft + last.offsetWidth;
      var gap = parseFloat(getComputedStyle(track).gap) || 0;
      return right - left + gap;
    }

    var translateX = 0;
    var speedPxPerSec = 60;
    var setW = 0;
    var running = true;
    var lastTs = 0;

    function ensureMeasurements() {
      setW = setWidth();
    }

    function step(ts) {
      // If modal is open, pause autoscroll
      if (document.documentElement.getAttribute('data-projects-modal') === 'open') {
        lastTs = ts;
        return requestAnimationFrame(step);
      }
      if (!running) { lastTs = ts; return requestAnimationFrame(step); }
      if (!lastTs) lastTs = ts;
      var dt = (ts - lastTs) / 1000;
      lastTs = ts;

      translateX -= speedPxPerSec * dt;
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
    viewport.addEventListener('focusout', function(){
      if (!viewport.contains(document.activeElement)) running = true;
    });
    document.addEventListener('visibilitychange', function(){
      running = !document.hidden;
    });

    // Roving tabindex across originals
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
      else if (e.key === 'Escape') {
        // Accessibility: allow ESC to pause any playing previews
        e.preventDefault();
        track.querySelectorAll('video.preview').forEach(function(v){
          try { v.pause(); } catch(_){}
        });
      }
    });

    // Start loop
    requestAnimationFrame(function(){
      ensureMeasurements();
      if (!setW) setTimeout(ensureMeasurements, 50);
      requestAnimationFrame(step);
    });

    // On resize, re-measure
    var onResize = function(){
      var prev = setW;
      ensureMeasurements();
      if (setW > 0 && prev > 0) translateX = translateX % setW;
    };
    window.addEventListener('resize', onResize);

    // Return a small API to stop if needed
    return {
      stop: function(){
        running = false;
        window.removeEventListener('resize', onResize);
      }
    };
  }

  // --------------------
  // Tabs
  // --------------------
  function initTabs(sectionRoot, profile) {
    var tabProjects = sectionRoot.querySelector('#tab-projects');
    var tabSide = sectionRoot.querySelector('#tab-side-projects');
    var panelProjects = sectionRoot.querySelector('#panel-projects');
    var panelSide = sectionRoot.querySelector('#panel-side-projects');

    if (!tabProjects || !tabSide || !panelProjects || !panelSide) return;

    var runners = {
      'Projects': null,
      'Side Projects': null
    };

    function activateTab(which) {
      var isProjects = which === 'Projects';

      // aria-selected and tabindex
      tabProjects.setAttribute('aria-selected', String(isProjects));
      tabProjects.tabIndex = isProjects ? 0 : -1;
      tabSide.setAttribute('aria-selected', String(!isProjects));
      tabSide.tabIndex = !isProjects ? 0 : -1;

      // panels visibility
      panelProjects.hidden = !isProjects;
      panelSide.hidden = isProjects;

      // Stop previous runner for the other tab to avoid background RAF
      var other = isProjects ? 'Side Projects' : 'Projects';
      if (runners[other] && runners[other].stop) {
        runners[other].stop();
        runners[other] = null;
      }

      // Render or re-render the active category
      if (runners[which]) {
        // already running: ignore
        return;
      }
      runners[which] = renderCategory(sectionRoot, profile, which);
    }

    // Click handlers
    tabProjects.addEventListener('click', function(){
      activateTab('Projects');
      tabProjects.focus();
    });
    tabSide.addEventListener('click', function(){
      activateTab('Side Projects');
      tabSide.focus();
    });

    // Keyboard support for tabs (Left/Right/Home/End)
    sectionRoot.querySelector('.tabs').addEventListener('keydown', function(e){
      var tabs = [tabProjects, tabSide];
      var currentIdx = tabs.indexOf(document.activeElement);
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        var next = tabs[(currentIdx + 1 + tabs.length) % tabs.length];
        next.click();
        next.focus();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        var prev = tabs[(currentIdx - 1 + tabs.length) % tabs.length];
        prev.click();
        prev.focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        tabs[0].click();
        tabs[0].focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        tabs[tabs.length - 1].click();
        tabs[tabs.length - 1].focus();
      }
    });

    // Initial activation
    activateTab('Projects');
  }

  // --------------------
  // Utilities
  // --------------------
  var __uid = 0;
  function uniqueId(prefix) {
    __uid += 1;
    return (prefix || 'id-') + String(__uid);
  }

  // Init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjectsSection);
  } else {
    initProjectsSection();
  }
})();