/**
 * microblog.js
 * Stream-style microblog loader with filtering, search, tags, and infinite scroll.
 * - Uses design tokens from css/themes.css
 * - No external deps
 * - Accessible-by-default (role="feed", aria-live, focusable tags)
 */

(function () {
  'use strict';

  const POSTS_URL = '/data/microblog/posts.json';
  const PAGE_SIZE = 9;

  const TYPE_ICONS = {
    text: '💭',
    link: '🔗',
    image: '📷',
    code: '💻',
    quote: '💬',
    video: '🎬',
    thought: '🧠'
  };

/**
   * Pantone-style Tag Color System + Utilities
   * - Maps common tags to Pantone-like codes and hex colors
   * - Deterministic fallback for unknown tags
   * - SVG placeholder generator for posts without images
   */

  const TAG_COLORS = {
    // Creative & Design
    design:   { code: '17-3938', name: 'Very Peri',     color: '#6667AB' },
    art:      { code: '17-1755', name: 'Paradise Pink', color: '#E8537A' },
    photography: { code: '15-1040', name: 'Iced Coffee', color: '#B08D74' },

    // Technical
    code:     { code: '19-4052', name: 'Classic Blue',  color: '#0F4C81' },
    javascript:{ code: '13-0932', name: 'Cornsilk',     color: '#E4C16F' },
    snippets: { code: '15-3919', name: 'Serenity',      color: '#91A8D0' },
    performance:{ code: '16-1546', name: 'Living Coral', color: '#FF6F61' },

    // Lifestyle / Body
    bjj:      { code: '18-3949', name: 'Purple Haze',   color: '#7C4789' },
    movement: { code: '16-4411', name: 'Tourmaline',    color: '#86A8A3' },
    training: { code: '15-4003', name: 'Storm Gray',    color: '#B5BAB6' },
    meditation:{ code: '14-4318', name: 'Serenity',     color: '#91A8D0' },

    // Content & Reading
    reading:  { code: '17-1755', name: 'Paradise Pink', color: '#E8537A' },
    quotes:   { code: '15-2718', name: 'Fuchsia Pink',  color: '#D77FA1' },

    // Nature / Time
    morning:  { code: '17-1341', name: 'Tawny Orange',  color: '#D68A59' },
    astro:    { code: '19-3832', name: 'Galaxy Blue',   color: '#2A4B7C' },

    // Concepts
    simplicity:{ code: '11-4001', name: 'Bright White', color: '#F4F5F0' },
    practice: { code: '13-0932', name: 'Cornsilk',      color: '#E4D96F' },

    // Media types (fallbacks)
    video:    { code: '18-2133', name: 'Pink Flamb\u00E9', color: '#CC5490' },
    link:     { code: '14-4318', name: 'Serenity',      color: '#91A8D0' },
    image:    { code: '16-1546', name: 'Living Coral',  color: '#FF6F61' },
    text:     { code: '17-3938', name: 'Very Peri',     color: '#6667AB' },
    thought:  { code: '16-4411', name: 'Tourmaline',    color: '#86A8A3' }
  };
// Runtime tag map loaded from JSON (overrides defaults when present)
  const TAG_MAP_URL = '/config/tag-pantone-map.json';
  let RUNTIME_TAG_MAP = null;
  async function loadTagPantoneMap() {
    try {
      const res = await fetch(TAG_MAP_URL, { cache: 'no-cache' });
      if (res.ok) {
        RUNTIME_TAG_MAP = await res.json();
      }
    } catch (_) {
      // non-fatal; fall back to built-in TAG_COLORS
    }
  }

  const TYPE_EMOJI = {
    text: '📝', link: '🔗', image: '🖼️', code: '💻', quote: '❝', video: '🎬', thought: '💡'
  };

  function _hexToRgb(hex) {
    const h = hex.replace('#', '');
    const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
  }

  function _luminance({ r, g, b }) {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }

  function idealTextColor(bgHex) {
    try {
      const L = _luminance(_hexToRgb(bgHex));
      // Contrast with white vs black; threshold ~0.5 for practical readability
      return L > 0.45 ? '#111111' : '#FFFFFF';
    } catch {
      return '#111111';
    }
  }

  // Simple deterministic color/code from string when tag not mapped
  function fallbackPantoneFromString(s = 'default') {
    // hash to hue
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    const hue = h % 360;
    const sat = 55 + (h % 20); // 55-74
    const light = 50 + (h % 10); // 50-59
    const hex = hslToHex(hue, sat / 100, light / 100);
    const code = String(10 + Math.floor(hue / 24)).padStart(2, '0') + '-' + String(1000 + (h % 9000));
    return { code, name: s.charAt(0).toUpperCase() + s.slice(1), color: hex };
  }

  function hslToHex(h, s, l) {
    const a = s * Math.min(l, 1 - l);
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return '#' + f(0) + f(8) + f(4);
  }

  function getPantoneForTag(tag) {
    if (!tag) return fallbackPantoneFromString('untagged');
    const key = String(tag).toLowerCase();
    const runtime = (RUNTIME_TAG_MAP && RUNTIME_TAG_MAP[key]) ? RUNTIME_TAG_MAP[key] : null;
    if (runtime && runtime.color && runtime.code) return runtime;
    return TAG_COLORS[key] || fallbackPantoneFromString(key);
  }

  function primaryTagFor(post) {
    const tags = post?.metadata?.tags || [];
    if (tags.length) return tags[0];
    return post?.type || 'text';
  }

  function deriveTitle(post) {
    const t = post?.type || 'text';
    if (t === 'link') {
      const metaTitle = post?.metadata?.title;
      const url = post?.metadata?.url;
      if (metaTitle) return metaTitle;
      if (url) try { return new URL(url).hostname.replace('www.', ''); } catch {}
    }
    const text = (post?.content?.text || '').trim();
    const html = (post?.content?.html || '').replace(/<[^>]+>/g, '').trim();
    const base = text || html || (t.charAt(0).toUpperCase() + t.slice(1));
    // first sentence or 80 chars
    const m = base.match(/^(.+?[.!?])(?:\s|$)/);
    const first = (m ? m[1] : base).trim();
    return first.length > 80 ? first.slice(0, 77) + '…' : first;
  }

  function svgPlaceholder({ hex = '#CCCCCC', emoji = '🎨', label = '' } = {}) {
    const fg = idealTextColor(hex);
    const safeLabel = (label || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const svg =
      "&lt;svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600' width='800' height='600'&gt;" +
      `&lt;defs&gt;&lt;linearGradient id='g' x1='0' y1='0' x2='1' y2='1'&gt;&lt;stop offset='0%' stop-color='${hex}' /&gt;&lt;stop offset='100%' stop-color='${hex}99' /&gt;&lt;/linearGradient&gt;&lt;/defs&gt;` +
      `&lt;rect width='800' height='600' fill='url(#g)' /&gt;` +
      `&lt;g opacity='0.12'&gt;&lt;path d='M0 540 L800 60' stroke='${fg}' stroke-width='40' /&gt;&lt;path d='M-80 600 L880 0' stroke='${fg}' stroke-width='20' /&gt;&lt;/g&gt;` +
      `&lt;text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='140'&gt;${emoji}&lt;/text&gt;` +
      `&lt;text x='50%' y='88%' fill='${fg}' font-family='system-ui, -apple-system, Segoe UI, Roboto, Arial' font-size='28' text-anchor='middle'&gt;${safeLabel}&lt;/text&gt;` +
      '&lt;/svg&gt;';

    return 'data:image/svg+xml;charset=utf-8,' + svg;
  }
// Improved SVG placeholder that returns a properly encoded XML data URI
  function svgPlaceholderURI({ hex = '#CCCCCC', emoji = '🎨', label = '' } = {}) {
    const fg = idealTextColor(hex);
    const safe = String(label || '').replace(/[<>&]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600" role="img" aria-label="${safe}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${hex}"/>
      <stop offset="100%" stop-color="${hex}99"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#g)"/>
  <g opacity="0.12">
    <path d="M0 540 L800 60" stroke="${fg}" stroke-width="40"/>
    <path d="M-80 600 L880 0" stroke="${fg}" stroke-width="20"/>
  </g>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="140">${emoji}</text>
  <text x="50%" y="88%" fill="${fg}" font-family="system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="28" text-anchor="middle">${safe}</text>
</svg>`;
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }
// --- ShaderGradient variable helpers (per-stream variation) ---
  function hexToHsl(hex) {
    const { r, g, b } = _hexToRgb(hex);
    const r1 = r / 255, g1 = g / 255, b1 = b / 255;
    const max = Math.max(r1, g1, b1), min = Math.min(r1, g1, b1);
    let h, s, l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r1: h = (g1 - b1) / d + (g1 < b1 ? 6 : 0); break;
        case g1: h = (b1 - r1) / d + 2; break;
        case b1: h = (r1 - g1) / d + 4; break;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: s, l: l };
  }
  function clamp01(x) { return Math.max(0, Math.min(1, x)); }
  function adjustHslHex(hex, dh = 0, ds = 0, dl = 0) {
    const { h, s, l } = hexToHsl(hex);
    const nh = (h + dh + 360) % 360;
    const ns = clamp01(s + ds);
    const nl = clamp01(l + dl);
    return hslToHex(nh, ns, nl);
  }
  function stringHash(s) {
    let h = 2166136261 >>> 0; // FNV-like
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function gradientParamsFromPantone(hex, seedStr = '') {
    const seed = stringHash(seedStr + hex);
    // derive small, pleasant shifts
    const dh1 = (seed % 60) - 30; // -30..+29
    const dh2 = ((seed >> 6) % 90) - 45; // -45..+44
    const ds1 = (((seed >> 12) % 20) - 10) / 100; // -0.10..+0.09
    const dl1 = (((seed >> 18) % 20) - 10) / 100; // -0.10..+0.09

    const c1 = adjustHslHex(hex, dh1, ds1, dl1);
    const c2 = adjustHslHex(hex, dh2, -ds1 * 0.5, -dl1 * 0.5);
    const c3 = adjustHslHex(hex, -dh1 * 0.6, ds1 * 0.4, dl1 * 0.6);

    const speed = 14 + (seed % 10); // 14s..23s
    const rot = ((seed >> 8) % 5) - 2; // -2..+2 deg
    const scale = 1 + (((seed >> 16) % 4) / 100); // 1.00..1.03
    const opacity = 0.5 + (((seed >> 24) % 25) / 100); // 0.50..0.74

    return { c1, c2, c3, speed, rot, scale, opacity };
  }
  function applyGradientVars(el, params) {
    if (!el || !params) return;
    el.style.setProperty('--sg-c1', params.c1);
    el.style.setProperty('--sg-c2', params.c2);
    el.style.setProperty('--sg-c3', params.c3);
    el.style.setProperty('--sg-speed', params.speed + 's');
    el.style.setProperty('--sg-rot', params.rot + 'deg');
    el.style.setProperty('--sg-scale', String(params.scale));
    el.style.setProperty('--sg-opacity', String(params.opacity));
  }
  class Microblog {
    constructor(opts = {}) {
      this.feedSel = opts.container || '#microblog-feed';
      this.feed = document.querySelector(this.feedSel);
      if (!this.feed) return;

      this.template = document.getElementById('micro-post-template');
      this.searchInput = document.getElementById('microblog-search');
      this.tagCloud = null; // tag cloud removed with "Popular" section
      this.sentinel = document.getElementById('microblog-sentinel');
      loadTagPantoneMap();

      this.posts = [];
      this.filtered = [];
      this.currentType = 'all';
      this.page = 0;
      this.loading = false;

      this._bindFilters();
      this._bindTypeDock(); // bind the horizontal dock buttons
      this._bindSearch();
      this._bindSearchCategories(); // wire up category chips in new search bar
      this._initObserver();

      this._load();
    }

    async _load() {
      this.feed.setAttribute('aria-busy', 'true');
      try {
        const res = await fetch(POSTS_URL, { cache: 'no-cache' });
        if (!res.ok) throw new Error('Failed to fetch posts');
        const json = await res.json();
        this.posts = Array.isArray(json.posts) ? json.posts : [];
        // Sort newest first
        this.posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        // Popular tag cloud removed
        this._applyFilter('all');
      } catch (err) {
        console.error('[microblog] load error', err);
        this.feed.innerHTML = '<p class="muted">Could not load the stream.</p>';
      } finally {
        this.feed.setAttribute('aria-busy', 'false');
      }
    }

    // Popular tag cloud feature removed

    _bindFilters() {
      document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
          const type = btn.dataset.filter || 'all';
          document.querySelectorAll('.filter-btn[data-filter]').forEach(b => {
            const active = b.dataset.filter === type;
            b.classList.toggle('active', active);
            b.setAttribute('aria-pressed', String(active));
          });
          // keep dock in sync
          this._syncDockActive(type);
          this._applyFilter(type);
        });
      });
    }

    _bindTypeDock() {
      const dockBtns = document.querySelectorAll('.type-dock-btn[data-filter]');
      if (!dockBtns.length) return;
      dockBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const type = btn.dataset.filter;
          this._syncDockActive(type);
          // sync sidebar filter buttons if present
          document.querySelectorAll('.filter-btn[data-filter]').forEach(b => {
            const active = b.dataset.filter === type;
            b.classList.toggle('active', active);
            b.setAttribute('aria-pressed', String(active));
          });
          this._applyFilter(type);
          // ensure dock stays visible as feedback
          const dock = document.querySelector('.type-dock');
          if (dock) dock.scrollIntoView({ block: 'nearest' });
        });
      });
      // initialize with 'all' not present in dock; keep first button active for current type
      this._syncDockActive(this.currentType);
    }

    _syncDockActive(type) {
      document.querySelectorAll('.type-dock-btn[data-filter]').forEach(b => {
        b.classList.toggle('active', b.dataset.filter === type);
        b.setAttribute('aria-pressed', String(b.dataset.filter === type));
      });
    }

    _bindSearch() {
      if (!this.searchInput) return;
      let timer = null;
      this.searchInput.addEventListener('input', e => {
        clearTimeout(timer);
        const q = e.target.value || '';
        timer = setTimeout(() => this._search(q), 250);
      });
    }

    _bindSearchCategories() {
      const chips = document.querySelectorAll('.search-categories .chip[data-filter]');
      if (!chips.length) return;
      chips.forEach(chip => {
        chip.addEventListener('click', () => {
          const type = chip.dataset.filter || 'all';
          // toggle chip active states
          chips.forEach(c => {
            const active = c.dataset.filter === type;
            c.classList.toggle('active', active);
            c.setAttribute('aria-pressed', String(active));
          });
          // sync dock + sidebar buttons
          this._syncDockActive(type);
          document.querySelectorAll('.filter-btn[data-filter]').forEach(b => {
            const active = b.dataset.filter === type;
            b.classList.toggle('active', active);
            b.setAttribute('aria-pressed', String(active));
          });
          this._applyFilter(type);
        });
      });
      // initialize "All" active by default
      chips.forEach(c => {
        const active = c.dataset.filter === 'all';
        c.classList.toggle('active', active);
        c.setAttribute('aria-pressed', String(active));
      });
    }

    _applyFilter(type = 'all') {
      this.currentType = type;
      const q = this.searchInput ? (this.searchInput.value || '').trim() : '';
      // Filter by type then search
      let base = type === 'all' ? this.posts : this.posts.filter(p => p.type === type);
      if (q) {
        const ql = q.toLowerCase();
        base = base.filter(p => {
          const text = [
            p.content?.text || '',
            p.content?.html || '',
            ...(p.metadata?.tags || [])
          ].join(' ').toLowerCase();
          return text.includes(ql);
        });
      }

      this.filtered = base;
      this.page = 0;
      this.feed.innerHTML = '';
      this._renderNext();
    }

    _search(q) {
      // Re-run filter with current type and query
      this._applyFilter(this.currentType);
    }

    _initObserver() {
      if (!('IntersectionObserver' in window) || !this.sentinel) return;
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) this._renderNext();
        });
      }, { rootMargin: '120px' });
      io.observe(this.sentinel);
    }

    async _renderNext() {
      if (this.loading) return;
      const start = this.page * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      const slice = this.filtered.slice(start, end);
      if (slice.length === 0) return;

      this.loading = true;
      // Simulate light delay to show spinner
      await new Promise(r => setTimeout(r, 60));

      const frag = document.createDocumentFragment();
      slice.forEach(p => frag.appendChild(this._renderPostNode(p)));
      this.feed.appendChild(frag);

      this.page += 1;
      this.loading = false;
    }

    _renderPostNode(post) {
      const tpl = this.template?.content?.firstElementChild;
      const node = tpl ? tpl.cloneNode(true) : document.createElement('article');
      node.className = 'micro-post pantone-card';
      node.dataset.type = post.type || 'text';
      node.id = post.id || '';

      // Determine primary tag and Pantone mapping
      const tags = post.metadata?.tags || [];
      const primary = primaryTagFor(post);
      const pantone = getPantoneForTag(primary);

      // Expose CSS variables for styling
      node.style.setProperty('--card-color', pantone.color);
      node.style.setProperty('--card-fg', idealTextColor(pantone.color));

      // Label: code + title
      const codeEl = node.querySelector('.pantone-card__code');
      if (codeEl) {
        let suffix = '';
        if (tags.length > 1) {
          suffix = '-' + tags.slice(1, 4).map(t => String(t)[0]?.toUpperCase() || '').join('');
        }
        codeEl.textContent = `${pantone.code}${suffix}`;
      }
      const titleEl = node.querySelector('.pantone-card__title');
      if (titleEl) {
        const titleText = deriveTitle(post);
        titleEl.textContent = titleText;
        const titleId = `${post.id || 'post'}-title`;
        titleEl.id = titleId;
        node.setAttribute('role', 'article');
        node.setAttribute('aria-labelledby', titleId);
      }

      // Meta: time + type
      const timeEl = node.querySelector('.micro-post-time') || document.createElement('time');
      timeEl.setAttribute('datetime', post.timestamp);
      timeEl.textContent = this._formatDate(new Date(post.timestamp));
      const typeEl = node.querySelector('.micro-post-type') || document.createElement('span');
      typeEl.textContent = `${TYPE_ICONS[post.type] || '📝'} ${post.type}`;

      // Media (with placeholder if needed)
      const mediaEl = node.querySelector('.micro-post-media');
      if (mediaEl) {
        mediaEl.innerHTML = this._renderMedia(post, pantone);
        // Per-stream ShaderGradient overlay variables applied to the media container
        const seedStr = (post.id || '') + '|' + deriveTitle(post);
        const g = gradientParamsFromPantone(pantone.color, seedStr);
        applyGradientVars(mediaEl, g);
      }

      // Content (kept for accessibility and future detail view)
      const contentEl = node.querySelector('.micro-post-content') || document.createElement('div');
      contentEl.innerHTML = this._renderContent(post);

      // Tags removed per user request - commented out for potential future use
      // const tagsEl = node.querySelector('.micro-post-tags') || document.createElement('div');
      // tagsEl.innerHTML = tags.map(t => {
      //   const p = getPantoneForTag(t);
      //   const rgb = _hexToRgb(p.color);
      //   const bg = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.14)`;
      //   const border = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.35)`;
      //   const fg = p.color;
      //   return `<span class="tag" style="--chip-bg:${bg};--chip-border:${border};--chip-fg:${fg}" tabindex="0" role="button" aria-label="Filter by tag ${this._esc(t)}">#${this._esc(t)}</span>`;
      // }).join('');

      // Action buttons: like and share
      const likeBtn = node.querySelector('.pantone-like');
      if (likeBtn) {
        likeBtn.addEventListener('click', (e) => {
          e.currentTarget.classList.toggle('liked');
          const isLiked = e.currentTarget.classList.contains('liked');
          e.currentTarget.setAttribute('aria-label', isLiked ? 'Unlike post' : 'Like post');
        });
      }

      const shareBtn = node.querySelector('.pantone-share');
      if (shareBtn) {
        shareBtn.addEventListener('click', () => this._share(post));
      }

      // If template not present (hard fallback), assemble structure
      if (!tpl) {
        const header = document.createElement('div');
        header.className = 'pantone-card__label';
        // Brand removed per user request
        const code = document.createElement('div');
        code.className = 'pantone-card__code';
        code.textContent = codeEl?.textContent || pantone.code;
        const h3 = document.createElement('h3');
        h3.className = 'pantone-card__title';
        h3.textContent = deriveTitle(post);
        const meta = document.createElement('div');
        meta.className = 'pantone-card__meta';
        meta.appendChild(timeEl);
        meta.appendChild(typeEl);
        header.appendChild(code);
        header.appendChild(h3);
        header.appendChild(meta);
        
        // Action buttons container
        const actions = document.createElement('div');
        actions.className = 'pantone-card__actions';
        
        // Like button
        const likeBtn = document.createElement('button');
        likeBtn.className = 'pantone-action-btn pantone-like';
        likeBtn.setAttribute('aria-label', 'Like post');
        likeBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>`;
        likeBtn.addEventListener('click', (e) => {
          e.currentTarget.classList.toggle('liked');
          const isLiked = e.currentTarget.classList.contains('liked');
          e.currentTarget.setAttribute('aria-label', isLiked ? 'Unlike post' : 'Like post');
        });
        
        // Share button
        const shareBtn = document.createElement('button');
        shareBtn.className = 'pantone-action-btn pantone-share';
        shareBtn.setAttribute('aria-label', 'Share post');
        shareBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>`;
        shareBtn.addEventListener('click', () => this._share(post));
        
        actions.appendChild(likeBtn);
        actions.appendChild(shareBtn);
        header.appendChild(actions);

        const imgWrap = document.createElement('div');
        imgWrap.className = 'pantone-card__image micro-post-media';
        imgWrap.innerHTML = this._renderMedia(post, pantone);

        node.appendChild(imgWrap);
        node.appendChild(header);
      }

      return node;
    }

    _renderContent(post) {
      const t = post.type || 'text';
      if (t === 'code') {
        const code = this._esc(post.content?.text || '');
        return `<pre><code>${code}</code></pre>`;
      }
      if (t === 'quote') {
        const html = post.content?.html || this._p(post.content?.text || '');
        return `<blockquote>${html}</blockquote>`;
      }
      if (t === 'link') {
        const html = post.content?.html || this._p(post.content?.text || '');
        const url = this._esc(post.metadata?.url || '#');
        const title = this._esc(post.metadata?.title || post.metadata?.url || 'Link');
        return `${html}<p><a class="micro-post-link" href="${url}" target="_blank" rel="noopener noreferrer">${title}</a></p>`;
      }
      // default text, thought, image/video rely on media block
      return post.content?.html || this._p(post.content?.text || '');
    }

    _renderMedia(post, pantone) {
      const media = post?.media || null;

      // Prefer images
      if (media && Array.isArray(media.images) && media.images.length) {
        return media.images.map(img => `
          <figure>
            <img src="${this._esc(img.url)}" alt="${this._esc(img.alt || '')}" loading="lazy" decoding="async">
            ${img.caption ? `<figcaption class="muted">${this._esc(img.caption)}</figcaption>` : ''}
          </figure>
        `).join('');
      }

      // Video with poster
      if (media?.video?.url) {
        const v = media.video;
        const poster = v.poster ? ` poster="${this._esc(v.poster)}"` : '';
        return `
          <video controls playsinline preload="metadata"${poster}>
            <source src="${this._esc(v.url)}" type="video/mp4">
          </video>
        `;
      }

      // ShaderGradient-inspired placeholder for imageless posts
      const title = deriveTitle(post);
      return `
        <figure class="pantone-placeholder">
          <div class="shadergradient-bg shadergradient-animate" role="img" aria-label="${this._esc(title)}"></div>
        </figure>
      `;
    }

    async _share(post) {
      const url = `${location.origin}${location.pathname}#${post.id || ''}`;
      try {
        if (navigator.share) {
          await navigator.share({ title: 'Microblog', url });
        } else if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(url);
          this._toast('Link copied to clipboard');
        }
      } catch (_) {
        // ignore user cancel
      }
    }

    _toast(msg) {
      const el = document.createElement('div');
      el.className = 'toast';
      el.textContent = msg;
      document.body.appendChild(el);
      requestAnimationFrame(() => el.classList.add('show'));
      setTimeout(() => {
        el.classList.remove('show');
        setTimeout(() => el.remove(), 280);
      }, 2200);
    }

    _formatDate(d) {
      const now = new Date();
      const diff = now - d;
      const min = 60 * 1000;
      const hr = 60 * min;
      const day = 24 * hr;

      if (diff < hr) return `${Math.max(1, Math.floor(diff / min))}m ago`;
      if (diff < day) return `${Math.floor(diff / hr)}h ago`;
      const opts = { month: 'short', day: 'numeric' };
      if (d.getFullYear() !== now.getFullYear()) opts.year = 'numeric';
      return d.toLocaleDateString('en-US', opts);
    }

    _p(text) {
      const esc = this._esc(text);
      return `<p>${esc.replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br>')}</p>`;
    }

    _esc(s) {
      const div = document.createElement('div');
      div.textContent = String(s || '');
      return div.innerHTML;
    }
  }

  // Bootstrap
  document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('#microblog-feed')) {
      new Microblog({ container: '#microblog-feed' });
    }
  });
})();