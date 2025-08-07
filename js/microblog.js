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
  const PAGE_SIZE = 10;

  const TYPE_ICONS = {
    text: '💭',
    link: '🔗',
    image: '📷',
    code: '💻',
    quote: '💬',
    video: '🎬',
    thought: '🧠'
  };

  class Microblog {
    constructor(opts = {}) {
      this.feedSel = opts.container || '#microblog-feed';
      this.feed = document.querySelector(this.feedSel);
      if (!this.feed) return;

      this.template = document.getElementById('micro-post-template');
      this.searchInput = document.getElementById('microblog-search');
      this.tagCloud = null; // tag cloud removed with "Popular" section
      this.sentinel = document.getElementById('microblog-sentinel');

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
      node.className = 'micro-post';
      node.dataset.type = post.type || 'text';
      node.id = post.id || '';

      // Header
      const timeEl = node.querySelector('.micro-post-time') || document.createElement('time');
      timeEl.setAttribute('datetime', post.timestamp);
      timeEl.textContent = this._formatDate(new Date(post.timestamp));
      const typeEl = node.querySelector('.micro-post-type') || document.createElement('span');
      typeEl.textContent = `${TYPE_ICONS[post.type] || '📝'} ${post.type}`;

      // Media
      const mediaEl = node.querySelector('.micro-post-media');
      if (mediaEl) {
        mediaEl.innerHTML = this._renderMedia(post.media);
      }

      // Content
      const contentEl = node.querySelector('.micro-post-content') || document.createElement('div');
      contentEl.innerHTML = this._renderContent(post);

      // Footer: tags + share
      const tagsEl = node.querySelector('.micro-post-tags') || document.createElement('div');
      tagsEl.innerHTML = (post.metadata?.tags || [])
        .map(t => `<span class="tag" tabindex="0" role="button" aria-label="Filter by tag ${this._esc(t)}">#${this._esc(t)}</span>`)
        .join('');
      tagsEl.querySelectorAll('.tag').forEach(el => {
        el.addEventListener('click', () => {
          const tag = el.textContent.replace('#', '');
          if (this.searchInput) this.searchInput.value = tag;
          this._search(tag);
        });
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            el.click();
          }
        });
      });

      const shareBtn = node.querySelector('.micro-post-share');
      if (shareBtn) {
        shareBtn.addEventListener('click', () => this._share(post));
      }

      // If template not present, assemble structure for safety
      if (!tpl) {
        const header = document.createElement('header');
        header.className = 'micro-post-header';
        header.appendChild(timeEl);
        header.appendChild(typeEl);

        const footer = document.createElement('footer');
        footer.className = 'micro-post-footer';
        footer.appendChild(tagsEl);
        const btn = document.createElement('button');
        btn.className = 'micro-post-share button outline';
        btn.textContent = 'Share';
        btn.setAttribute('aria-label', 'Share post');
        btn.addEventListener('click', () => this._share(post));
        footer.appendChild(btn);

        node.appendChild(header);
        if (mediaEl && mediaEl.innerHTML) node.appendChild(mediaEl);
        node.appendChild(contentEl);
        node.appendChild(footer);
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

    _renderMedia(media) {
      if (!media) return '';
      if (Array.isArray(media.images) && media.images.length) {
        return media.images.map(img => `
          <figure>
            <img src="${this._esc(img.url)}" alt="${this._esc(img.alt || '')}" loading="lazy" decoding="async">
            ${img.caption ? `<figcaption class="muted">${this._esc(img.caption)}</figcaption>` : ''}
          </figure>
        `).join('');
      }
      if (media.video?.url) {
        const v = media.video;
        const poster = v.poster ? ` poster="${this._esc(v.poster)}"` : '';
        return `
          <video controls playsinline${poster}>
            <source src="${this._esc(v.url)}" type="video/mp4">
          </video>
        `;
      }
      return '';
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