/**
 * preview-card.js
 * Inline-only Preview Cards via data-* attributes (vanilla JS).
 *
 * Triggers:
 *  - data-preview          (shorthand; same as data-preview-text when no srcs)
 *  - data-preview-srcs     (comma-separated or JSON array of URLs; supports image/video)
 *  - data-preview-alts     (comma-separated or JSON array; aligns with srcs)
 *  - data-preview-captions (comma-separated or JSON array; aligns with srcs)
 *  - data-preview-text     (text-only popup content)
 *  - data-preview-type     ("image" | "video") optional blanket type when no extension inference
 *  - data-preview-placement("top" | "bottom" | "left" | "right") preferred placement; auto-flips on collision
 *  - data-preview-width    (numeric px hint; constrained by CSS)
 *
 * Behavior:
 *  - Hover/focus open; pointer leave/blur/outside-click/Escape close
 *  - Click on trigger toggles "pinned" state (dialog-like); Escape/outside click unpins
 *  - 1 item => single layout; 2 items => 2-up grid; 3+ => mini slider (with Arrow keys)
 *  - One portal reused for all triggers (single .pv-portal in body)
 *
 * Accessibility:
 *  - role="tooltip" when hover/focus; aria-describedby ties to trigger
 *  - role="dialog" + aria-modal when pinned
 *  - ArrowLeft/ArrowRight navigate slider; focus-visible styles honored
 *
 * Security:
 *  - Reject javascript: and data: schemes; allow same-origin or relative URLs
 *
 * Authoring Examples:
 *  - <a data-preview-srcs="/assets/projects/E-bike-1.jpg" data-preview-alts="E-bike prototype">E-bike</a>
 *  - <a data-preview-srcs='["/a.jpg","/b.jpg"]' data-preview-captions='["Front","Rear"]'>Bike</a>
 *  - <span data-preview-text="Impact Academy photo essay">Photography set</span>
 */

(function () {
  'use strict';

  // Public entry on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup, { once: true });
  } else {
    setup();
  }

  // ------------------------
  // State & Portal
  // ------------------------
  var portal = null;
  var card = null;
  var contentEl = null;
  var arrowEl = null;
  var currentTrigger = null;
  var isPinned = false;
  var closeTimer = 0;
  var openTimer = 0;
  var slider = null; // { idx, total, track, dots[] }
  var describedById = 'pv-desc-' + Math.random().toString(36).slice(2);
  var cardListenersBound = false; // ensure we don't attach duplicate listeners to singleton card

  function ensurePortal() {
    if (portal) return portal;

    portal = document.createElement('div');
    portal.className = 'pv-portal';
    portal.setAttribute('aria-hidden', 'true');

    card = document.createElement('div');
    card.className = 'pv-card';
    card.setAttribute('data-state', 'closed');

    // Arrow
    arrowEl = document.createElement('div');
    arrowEl.className = 'pv-arrow';
    arrowEl.setAttribute('aria-hidden', 'true');
    arrowEl.innerHTML = [
      '<svg viewBox="0 0 20 10" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">',
      '  <path class="border" d="M0 10h20v-2h-1.465c-.788 0-1.545-.303-2.121-.84L11.67 1.86c-.76-.685-1.914-.685-2.675 0L3.586 7.16C3.01 7.697 2.253 8 1.465 8H0v2z"/>',
      '  <path class="bg" d="M1.465 8c.788 0 1.545-.303 2.121-.84L9.0 1.86c.76-.685 1.914-.685 2.675 0l5.414 5.3c.576.537 1.333.84 2.121.84H1.465z"/>',
      '</svg>'
    ].join('');

    // Content
    contentEl = document.createElement('div');
    contentEl.className = 'pv-content';
    contentEl.id = describedById;

    card.appendChild(arrowEl);
    card.appendChild(contentEl);
    portal.appendChild(card);
    document.body.appendChild(portal);

    // Global listeners
    document.addEventListener('keydown', onDocKeyDown);
    document.addEventListener('pointerdown', onDocPointerDown, true);

    // Defensive cleanup on navigation
    window.addEventListener('blur', closeNow);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) closeNow();
    });

    return portal;
  }

  // ------------------------
  // Setup: attach triggers
  // ------------------------
  function setup() {
    ensurePortal();
    // Attach to any element with preview attributes
    var triggers = document.querySelectorAll('[data-preview], [data-preview-srcs], [data-preview-text]');
    for (var i = 0; i < triggers.length; i++) {
      wireTrigger(triggers[i]);
    }

    // Optional: observe future additions
    var mo = new MutationObserver(function (list) {
      list.forEach(function (m) {
        forEachNode(m.addedNodes, function (node) {
          if (!(node instanceof Element)) return;
          if (hasPreviewAttrs(node)) wireTrigger(node);
          // Also scan descendants
          node.querySelectorAll && node.querySelectorAll('[data-preview], [data-preview-srcs], [data-preview-text]').forEach(wireTrigger);
        });
      });
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  // Expose a minimal public API so other scripts can force a (re)scan after dynamic DOM updates.
  try {
    window.PreviewCard = window.PreviewCard || {};
    window.PreviewCard.wire = function (el) {
      if (el && hasPreviewAttrs(el)) wireTrigger(el);
    };
    window.PreviewCard.scan = function (root) {
      var scope = root && root.querySelectorAll ? root : document;
      scope.querySelectorAll('[data-preview], [data-preview-srcs], [data-preview-text]').forEach(function (el) {
        if (!el.__pvBound) wireTrigger(el);
      });
    };
  } catch (_) {}

  function hasPreviewAttrs(el) {
    return el.hasAttribute('data-preview') || el.hasAttribute('data-preview-srcs') || el.hasAttribute('data-preview-text');
  }

  function wireTrigger(el) {
    // Ensure portal/card exists before wiring
    ensurePortal();

    // Avoid double wiring
    if (el.__pvBound) return;
    el.__pvBound = true;

    // Accessibility hint
    try { el.setAttribute('aria-haspopup', 'dialog'); } catch (_) {}

    // Pointer Events
    el.addEventListener('pointerenter', function () { scheduleOpen(el); });
    el.addEventListener('pointerleave', scheduleClose);

    // Mouse fallback (older/non-PE browsers)
    el.addEventListener('mouseenter', function () { scheduleOpen(el); });
    el.addEventListener('mouseleave', scheduleClose);

    // Keyboard focus
    el.addEventListener('focusin', function () { openFrom(el); });
    el.addEventListener('blur', function () {
      if (card && !card.contains(document.activeElement)) scheduleClose();
    });

    // Touch: tap to pin
    el.addEventListener('touchstart', function () { openFrom(el, true); }, { passive: true });

    // Click toggles pinning
    el.addEventListener('click', function () {
      if (currentTrigger !== el || !isPinned) {
        openFrom(el, true);
      } else {
        unpin();
      }
    });

    // When pointer leaves the card itself, consider closing unless pinned (bind once)
    if (!cardListenersBound && card) {
      card.addEventListener('pointerleave', function () {
        if (!isPinned) scheduleClose();
      });
      card.addEventListener('pointerenter', clearCloseTimer);
      // Mouse fallback for the card, too
      card.addEventListener('mouseleave', function () {
        if (!isPinned) scheduleClose();
      });
      card.addEventListener('mouseenter', clearCloseTimer);
      cardListenersBound = true;
    }
  }

  // ------------------------
  // Open/Close
  // ------------------------
  function scheduleOpen(el) {
    clearTimeout(openTimer);
    openTimer = setTimeout(function () { openFrom(el); }, 90);
  }
  function clearOpenTimer() { clearTimeout(openTimer); }

  function scheduleClose() {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(function () {
      if (!isPinned) closeNow();
    }, 120);
  }
  function clearCloseTimer() { clearTimeout(closeTimer); }

  function openFrom(trigger, pin) {
    clearOpenTimer();
    clearCloseTimer();
    ensurePortal();

    // Build content from attributes
    var cfg = parseConfig(trigger);

    // If no content, close and return
    if (!cfg.items.length && !cfg.text) {
      closeNow();
      return;
    }

    // Render
    renderContent(cfg);

    // Position
    placeCard(trigger, cfg);

    // Accessibility wiring
    card.setAttribute('role', pin ? 'dialog' : 'tooltip');
    card.setAttribute('aria-modal', pin ? 'true' : 'false');
    card.setAttribute('data-state', 'open');
    card.setAttribute('data-pinned', pin ? 'true' : 'false');
    currentTrigger = trigger;
    isPinned = !!pin;

    // Tooltip relationship
    try {
      var prev = (trigger.getAttribute('aria-describedby') || '').trim();
      var list = prev ? prev.split(/\s+/) : [];
      if (list.indexOf(describedById) === -1) {
        list.push(describedById);
        trigger.setAttribute('aria-describedby', list.join(' ').trim());
      }
    } catch (_) {}

    // Focus management when pinned (do not trap for hover-only)
    if (isPinned) {
      // Move focus into first interactive element if user clicked trigger with keyboard
      var first = findFirstFocusable(card);
      if (first) first.focus();
    }
  }

  function closeNow() {
    clearOpenTimer();
    clearCloseTimer();
    isPinned = false;
    slider = null;
    if (card) {
      card.setAttribute('data-state', 'closed');
      card.removeAttribute('data-pinned');
      card.removeAttribute('data-side');
      card.removeAttribute('style');
      card.setAttribute('aria-modal', 'false');
      contentEl.innerHTML = '';
    }
    currentTrigger = null;
  }

  function unpin() {
    isPinned = false;
    // Remain open as tooltip while pointer/focus is still on trigger; otherwise close
    if (!currentTrigger || (!isHovering(currentTrigger) && document.activeElement !== currentTrigger)) {
      closeNow();
    } else {
      card.setAttribute('role', 'tooltip');
      card.setAttribute('aria-modal', 'false');
      card.setAttribute('data-pinned', 'false');
    }
  }

  function onDocKeyDown(e) {
    if (e.key === 'Escape') {
      if (isPinned || card.getAttribute('data-state') === 'open') {
        e.stopPropagation();
        closeNow();
        if (currentTrigger) { try { currentTrigger.focus(); } catch(_) {} }
      }
      return;
    }
    // Slider keys
    if (!slider) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); sliderGo(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); sliderGo(-1); }
  }

  function onDocPointerDown(e) {
    if (isPinned && card && !card.contains(e.target) && currentTrigger && !currentTrigger.contains(e.target)) {
      closeNow();
    }
  }

  // ------------------------
  // Config parsing
  // ------------------------
  function parseConfig(trigger) {
    var placement = (trigger.getAttribute('data-preview-placement') || 'top').toLowerCase();
    var widthHint = clampInt(trigger.getAttribute('data-preview-width') || '0', 0, 2000);
    var blanketType = (trigger.getAttribute('data-preview-type') || '').toLowerCase().trim();

    // text sources
    var text = trigger.getAttribute('data-preview-text') || trigger.getAttribute('data-preview') || '';

    // media sources
    var srcs = parseList(trigger.getAttribute('data-preview-srcs'));
    var alts = parseList(trigger.getAttribute('data-preview-alts'));
    var captions = parseList(trigger.getAttribute('data-preview-captions'));

    // Build item objects
    var items = [];
    for (var i = 0; i < srcs.length; i++) {
      var raw = String(srcs[i] || '').trim();
      var safe = sanitizeUrl(raw);
      if (!safe) continue;
      var type = blanketType || inferTypeFromExt(safe);
      items.push({
        url: safe,
        type: type, // 'image' | 'video'
        alt: String(alts[i] || alts[0] || text || trigger.textContent || 'Preview').trim(),
        caption: String(captions[i] || '').trim()
      });
    }

    return {
      placement: placement,
      widthHint: widthHint,
      items: items,
      text: String(text || '').trim()
    };
  }

  function parseList(val) {
    if (!val) return [];
    var s = String(val).trim();
    // JSON array?
    if ((s.startsWith('[') && s.endsWith(']')) || (s.startsWith('{') && s.endsWith('}'))) {
      try {
        var j = JSON.parse(s);
        if (Array.isArray(j)) return j.map(String);
      } catch (_) {}
    }
    // Comma-separated
    return s.split(',').map(function (x) { return String(x).trim(); }).filter(Boolean);
  }

  function sanitizeUrl(url) {
    if (!url) return '';
    try {
      // Allow relative paths
      if (/^[./]/.test(url)) return url;
      var u = new URL(url, window.location.origin);
      if (u.protocol === 'http:' || u.protocol === 'https:') {
        // Same-origin or cross-origin allowed; rely on browser CORS for fetch/display
        return u.href;
      }
      return '';
    } catch (_) {
      return '';
    }
  }

  function inferTypeFromExt(url) {
    var m = url.toLowerCase().match(/\.(\w+)(?:\?|#|$)/);
    if (!m) return 'image';
    var ext = m[1];
    if (ext === 'mp4' || ext === 'webm' || ext === 'ogg') return 'video';
    return 'image';
  }

  // ------------------------
  // Renderers
  // ------------------------
  function renderContent(cfg) {
    contentEl.innerHTML = '';
    slider = null;

    // Text-only
    if (!cfg.items.length && cfg.text) {
      var textEl = document.createElement('div');
      textEl.className = 'pv-text';
      textEl.textContent = cfg.text;
      contentEl.appendChild(textEl);
      return;
    }

    // One item
    if (cfg.items.length === 1) {
      var wrap = document.createElement('div');
      wrap.className = 'pv-single';
      wrap.appendChild(buildItem(cfg.items[0]));
      contentEl.appendChild(wrap);
      return;
    }

    // Two items grid
    if (cfg.items.length === 2) {
      var grid = document.createElement('div');
      grid.className = 'pv-grid';
      grid.appendChild(buildItem(cfg.items[0]));
      grid.appendChild(buildItem(cfg.items[1]));
      contentEl.appendChild(grid);
      return;
    }

    // 3+ slider
    buildSlider(cfg.items);
  }

  function buildItem(item) {
    var root = document.createElement('div');
    root.className = 'pv-item';

    var media = document.createElement('div');
    media.className = 'pv-media';

    if (item.type === 'video') {
      var vid = document.createElement('video');
      vid.playsInline = true;
      vid.controls = true;
      vid.preload = 'metadata';
      var source = document.createElement('source');
      source.src = item.url;
      source.type = 'video/mp4'; // generic; browser will validate
      vid.appendChild(source);
      media.appendChild(vid);
    } else {
      var img = document.createElement('img');
      img.decoding = 'async';
      img.loading = 'lazy';
      img.alt = item.alt || 'Preview';
      img.src = item.url;
      media.appendChild(img);
    }

    root.appendChild(media);

    if (item.caption) {
      var cap = document.createElement('div');
      cap.className = 'pv-caption';
      // Allow limited inline formatting in captions (e.g., <strong>, <em>, line breaks)
      cap.innerHTML = sanitizeCaption(item.caption);
      root.appendChild(cap);
    }

    return root;
  }

  function buildSlider(items) {
    var sliderEl = document.createElement('div');
    sliderEl.className = 'pv-slider';

    var track = document.createElement('div');
    track.className = 'pv-track';
    items.forEach(function (it) {
      var slide = document.createElement('div');
      slide.className = 'pv-slide';
      slide.appendChild(buildItem(it));
      track.appendChild(slide);
    });
    sliderEl.appendChild(track);

    var nav = document.createElement('div');
    nav.className = 'pv-nav';

    var prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'prev';
    prev.setAttribute('aria-label', 'Previous');
    prev.textContent = '‹';

    var next = document.createElement('button');
    next.type = 'button';
    next.className = 'next';
    next.setAttribute('aria-label', 'Next');
    next.textContent = '›';

    nav.appendChild(prev);
    nav.appendChild(next);
    sliderEl.appendChild(nav);

    var dots = document.createElement('div');
    dots.className = 'pv-dots';
    var dotEls = [];
    for (var i = 0; i < items.length; i++) {
      var d = document.createElement('button');
      d.type = 'button';
      d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      if (i === 0) d.setAttribute('aria-current', 'true');
      (function (idx) {
        d.addEventListener('click', function () { sliderGoTo(idx); });
      })(i);
      dots.appendChild(d);
      dotEls.push(d);
    }

    contentEl.appendChild(sliderEl);
    contentEl.appendChild(dots);

    slider = {
      idx: 0,
      total: items.length,
      track: track,
      dots: dotEls
    };

    prev.addEventListener('click', function () { sliderGo(-1); });
    next.addEventListener('click', function () { sliderGo(1); });
    updateSlider();
  }

  function sliderGo(delta) {
    if (!slider) return;
    slider.idx = (slider.idx + delta + slider.total) % slider.total;
    updateSlider();
  }

  function sliderGoTo(idx) {
    if (!slider) return;
    slider.idx = Math.max(0, Math.min(slider.total - 1, idx));
    updateSlider();
  }

  function updateSlider() {
    if (!slider) return;
    var x = -slider.idx * 100;
    slider.track.style.setProperty('--pv-x', x + '%');
    for (var i = 0; i < slider.dots.length; i++) {
      if (i === slider.idx) slider.dots[i].setAttribute('aria-current', 'true');
      else slider.dots[i].removeAttribute('aria-current');
    }
  }

  // ------------------------
  // Positioning
  // ------------------------
  function placeCard(trigger, cfg) {
    // Initial side preference
    var preferred = cfg.placement || 'top';
    var side = preferred;

    // Reset styles
    card.style.left = '0px';
    card.style.top = '0px';
    card.style.maxWidth = cfg.widthHint ? Math.max(220, cfg.widthHint) + 'px' : '';
    // Wait a tick for content to size
    // Use requestAnimationFrame for layout flush
    requestAnimationFrame(function () {
      var rect = trigger.getBoundingClientRect();
      var cRect = card.getBoundingClientRect();
      var vw = document.documentElement.clientWidth;
      var vh = document.documentElement.clientHeight;

      // Side fallback if collision
      function fitsTop() { return rect.top - cRect.height - 10 >= 0; }
      function fitsBottom() { return rect.bottom + cRect.height + 10 <= vh; }
      function fitsLeft() { return rect.left - cRect.width - 10 >= 0; }
      function fitsRight() { return rect.right + cRect.width + 10 <= vw; }

      if (side === 'top' && !fitsTop()) side = fitsBottom() ? 'bottom' : (fitsRight() ? 'right' : (fitsLeft() ? 'left' : 'bottom'));
      else if (side === 'bottom' && !fitsBottom()) side = fitsTop() ? 'top' : (fitsRight() ? 'right' : (fitsLeft() ? 'left' : 'top'));
      else if (side === 'left' && !fitsLeft()) side = fitsRight() ? 'right' : (fitsTop() ? 'top' : (fitsBottom() ? 'bottom' : 'right'));
      else if (side === 'right' && !fitsRight()) side = fitsLeft() ? 'left' : (fitsTop() ? 'top' : (fitsBottom() ? 'bottom' : 'left'));

      // Compute x,y
      var x = 0, y = 0;
      var gap = 8;
      if (side === 'top') {
        x = rect.left + rect.width / 2 - cRect.width / 2;
        y = rect.top - cRect.height - gap;
        card.style.setProperty('--pv-origin', '50% 100%');
      } else if (side === 'bottom') {
        x = rect.left + rect.width / 2 - cRect.width / 2;
        y = rect.bottom + gap;
        card.style.setProperty('--pv-origin', '50% 0%');
      } else if (side === 'left') {
        x = rect.left - cRect.width - gap;
        y = rect.top + rect.height / 2 - cRect.height / 2;
        card.style.setProperty('--pv-origin', '100% 50%');
      } else {
        // right
        x = rect.right + gap;
        y = rect.top + rect.height / 2 - cRect.height / 2;
        card.style.setProperty('--pv-origin', '0% 50%');
      }

      // Clamp horizontally
      var maxX = vw - cRect.width - 4;
      var minX = 4;
      if (x < minX) x = minX;
      if (x > maxX) x = maxX;

      // Clamp vertically
      var maxY = vh - cRect.height - 4;
      var minY = 4;
      if (y < minY) y = minY;
      if (y > maxY) y = maxY;

      // Apply
      card.style.left = Math.round(x) + 'px';
      card.style.top = Math.round(y) + 'px';
      card.setAttribute('data-side', side);
    });
  }

  // ------------------------
  // Utils
  // ------------------------
  function clampInt(val, min, max) {
    var n = parseInt(val, 10);
    if (!isFinite(n)) n = 0;
    if (n < min) n = min;
    if (n > max) n = max;
    return n;
  }

  function forEachNode(list, fn) {
    if (!list) return;
    for (var i = 0; i < list.length; i++) fn(list[i], i);
  }

  function isHovering(el) {
    // Basic check via :hover; not universally reliable but adequate for UI hint
    try { return el.matches(':hover'); } catch(_) { return false; }
  }

  function findFirstFocusable(root) {
    var selectors = [
      'button', 'a[href]', 'input', 'select', 'textarea', '[tabindex]:not([tabindex="-1"])'
    ].join(',');
    return root.querySelector(selectors);
  }

// Minimal HTML sanitizer for captions: allow only strong/b/em/i/br and strip all attributes.
// This keeps author-controlled markup while preventing unexpected HTML.
function sanitizeCaption(html) {
  try {
    var allowed = { STRONG:1, B:1, EM:1, I:1, BR:1 };
    var container = document.createElement('div');
    container.innerHTML = String(html || '');

    (function walk(node) {
      var child = node.firstChild;
      while (child) {
        var next = child.nextSibling;
        if (child.nodeType === 1) { // Element
          if (!allowed[child.nodeName]) {
            // Replace disallowed element with its text
            var text = document.createTextNode(child.textContent || '');
            node.replaceChild(text, child);
          } else {
            // Strip all attributes on allowed tags
            var atts = child.attributes;
            for (var i = atts.length - 1; i >= 0; i--) {
              child.removeAttribute(atts[i].name);
            }
            walk(child);
          }
        } else if (child.nodeType === 8) {
          // Remove comments
          node.removeChild(child);
        }
        child = next;
      }
    })(container);

    return container.innerHTML;
  } catch (_) {
    return String(html || '');
  }
}

})();