/**
 * timeline.js
 * Horizontal timeline with accessible tabs:
 * - Work, Projects, Talks & Shows, Side Quests, Volunteering
 *
 * Behavior:
 * - No autoplay/PIXI; simple horizontal scroll row
 * - Keyboard: Left/Right/Home/End to move between nodes; Enter/Space toggles details
 * - One expanded card at a time per row
 * - Lazy initialize when section enters viewport
 */

(function () {
  'use strict';

  var DATA_URL = '/data/timeline.json';

  function initTimelineSection() {
    var section = document.getElementById('timeline');
    if (!section) return;

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
      boot(section);
    }
  }

  function boot(section) {
    loadTimeline()
      .then(function (data) {
        initTabs(section, data);
      })
      .catch(function (err) {
        console.warn('Failed to load timeline.json:', err);
      });
  }

  function loadTimeline() {
    return fetch(DATA_URL, { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status)); });
  }

  // --------------------
  // Tabs wiring
  // --------------------
  function initTabs(sectionRoot, data) {
    var tabs = [
      { key: 'work', id: 'tab-work', panel: 'panel-work' },
      { key: 'projects', id: 'tab-proj', panel: 'panel-proj' },
      { key: 'talks', id: 'tab-talks', panel: 'panel-talks' },
      { key: 'sideQuests', id: 'tab-side', panel: 'panel-side' },
      { key: 'volunteering', id: 'tab-vol', panel: 'panel-vol' }
    ];

    var state = { activeKey: 'work', runners: {} };

    function activate(whichKey) {
      state.activeKey = whichKey;

      tabs.forEach(function (t) {
        var tabEl = sectionRoot.querySelector('#' + t.id);
        var panelEl = sectionRoot.querySelector('#' + t.panel);
        var isActive = t.key === whichKey;

        if (tabEl) {
          tabEl.setAttribute('aria-selected', String(isActive));
          tabEl.tabIndex = isActive ? 0 : -1;
        }
        if (panelEl) {
          panelEl.hidden = !isActive;
        }

        if (isActive) {
          renderCategory(panelEl, data, whichKey);
        }
      });
    }

    // Click and keyboard for tabs
    tabs.forEach(function (t) {
      var tabEl = sectionRoot.querySelector('#' + t.id);
      if (!tabEl) return;
      tabEl.addEventListener('click', function () {
        activate(t.key);
        tabEl.focus();
      });
    });

    var tablist = sectionRoot.querySelector('.tabs');
    if (tablist) {
      tablist.addEventListener('keydown', function (e) {
        var order = tabs.map(function (t) { return sectionRoot.querySelector('#' + t.id); }).filter(Boolean);
        var idx = order.indexOf(document.activeElement);
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          var next = order[(idx + 1 + order.length) % order.length];
          next.click(); next.focus();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          var prev = order[(idx - 1 + order.length) % order.length];
          prev.click(); prev.focus();
        } else if (e.key === 'Home') {
          e.preventDefault();
          order[0].click(); order[0].focus();
        } else if (e.key === 'End') {
          e.preventDefault();
          var last = order[order.length - 1];
          last.click(); last.focus();
        }
      });
    }

    // Initial activation
    activate('work');
  }

  // --------------------
  // Rendering a category as horizontal timeline
  // --------------------
  function renderCategory(panelEl, data, key) {
    if (!panelEl) return;
    var row = panelEl.querySelector('.tl-row[data-category="' + key + '"]');
    if (!row) return;

    // Clear row
    row.innerHTML = '';

    var items = Array.isArray(data[key]) ? data[key].slice() : [];
    // Sort newest first using 'sort' numeric; fallback to parseInt(year)
    items.sort(function (a, b) {
      var sa = Number(a.sort || parseInt(String(a.year || 0), 10) || 0);
      var sb = Number(b.sort || parseInt(String(b.year || 0), 10) || 0);
      return sb - sa;
    });

    // Build nodes
    var nodes = items.map(function (item, idx) {
      var node = buildNode(item, idx);
      row.appendChild(node);
      return node;
    });

    // Roving tabindex
    setRoving(nodes, 0);

    // Keyboard navigation on viewport
    var viewport = panelEl.querySelector('.tl-viewport');
    if (viewport) {
      viewport.addEventListener('keydown', function (e) {
        var currentIdx = nodes.indexOf(document.activeElement.closest('.tl-node'));
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          focusNode(nodes, (currentIdx + 1 + nodes.length) % nodes.length);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          focusNode(nodes, (currentIdx - 1 + nodes.length) % nodes.length);
        } else if (e.key === 'Home') {
          e.preventDefault();
          focusNode(nodes, 0);
        } else if (e.key === 'End') {
          e.preventDefault();
          focusNode(nodes, nodes.length - 1);
        }
      });
    }
  }

  function setRoving(nodes, focusIdx) {
    nodes.forEach(function (n, i) {
      n.tabIndex = i === focusIdx ? 0 : -1;
    });
  }

  function focusNode(nodes, idx) {
    setRoving(nodes, idx);
    var n = nodes[idx];
    if (!n) return;
    n.focus({ preventScroll: true });
    // Ensure visibility in viewport
    try {
      n.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } catch (_) {}
  }

  function buildNode(item, idx) {
    var li = document.createElement('li');
    li.className = 'tl-node';
    li.setAttribute('role', 'listitem');
    li.tabIndex = idx === 0 ? 0 : -1;

    var uid = uniqueId('tl-card-');

    // Dot button (marker on the axis)
    var btn = document.createElement('button');
    btn.className = 'tl-dot';
    btn.type = 'button';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', uid);

    var sr = document.createElement('span');
    sr.className = 'visually-hidden';
    sr.textContent = 'Toggle ' + (item.title || 'entry') + (item.year ? ' (' + item.year + ')' : '');
    btn.appendChild(sr);

    // Label (title + year) under axis
    var label = document.createElement('div');
    label.className = 'tl-label';
    var title = document.createElement('div');
    title.className = 'tl-title';
    title.textContent = String(item.title || '').trim();
    var year = document.createElement('div');
    year.className = 'tl-year';
    year.textContent = String(item.year || '').trim();
    label.appendChild(title);
    label.appendChild(year);

    // Card (floating above axis)
    var card = document.createElement('div');
    card.className = 'tl-card';
    card.id = uid;
    card.hidden = true;
    var p = document.createElement('p');
    p.textContent = String(item.summary || '').trim();
    card.appendChild(p);

    // Toggle logic (one open at a time within this row)
    btn.addEventListener('click', function () {
      var row = li.parentElement;
      if (!row) return;
      // Close others
      row.querySelectorAll('.tl-card:not([hidden])').forEach(function (open) {
        if (open !== card) {
          open.hidden = true;
          var ownerBtn = row.querySelector('.tl-dot[aria-controls="' + open.id + '"]');
          if (ownerBtn) ownerBtn.setAttribute('aria-expanded', 'false');
        }
      });
      // Toggle this
      var openNow = card.hidden;
      card.hidden = !openNow;
      btn.setAttribute('aria-expanded', String(openNow));
      if (openNow) {
        try { li.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); } catch (_) {}
      }
    });

    // Keyboard: Enter/Space on the node toggles button
    li.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });

    li.appendChild(btn);
    li.appendChild(label);
    li.appendChild(card);
    return li;
  }

  var __uid = 0;
  function uniqueId(prefix) {
    __uid += 1;
    return (prefix || 'id-') + String(__uid);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTimelineSection);
  } else {
    initTimelineSection();
  }
})();