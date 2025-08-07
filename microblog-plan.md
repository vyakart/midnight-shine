# Microblog Implementation Plan

## Executive Summary

This document outlines a detailed plan for implementing a microblog feature on the existing portfolio site. The microblog will serve as a lightweight, stream-of-consciousness platform for sharing thoughts, updates, and insights while maintaining the site's existing design philosophy and technical architecture.

## 1. Concept & Requirements

### 1.1 Core Concept
A microblog that functions as a "digital stream" - a chronological feed of short-form posts that can include:
- Text updates (thoughts, observations, quotes)
- Links with commentary
- Images with captions
- Code snippets
- Short videos/GIFs
- Tags/categories for organization

### 1.2 Key Features
- **Lightweight posting**: Quick, frictionless content creation
- **Rich media support**: Text, images, code, embeds
- **Chronological feed**: Time-based organization with infinite scroll
- **Search & filtering**: By date, tags, content type
- **RSS feed**: For syndication
- **Responsive design**: Mobile-first approach
- **Theme integration**: Respects existing saffronSunrise/indigoMidnight themes
- **Accessibility**: WCAG AA compliant

### 1.3 Content Types
```javascript
const POST_TYPES = {
  TEXT: 'text',        // Plain text updates
  LINK: 'link',        // Shared links with commentary
  IMAGE: 'image',      // Photos with captions
  CODE: 'code',        // Code snippets
  QUOTE: 'quote',      // Quotations
  VIDEO: 'video',      // Short videos
  THOUGHT: 'thought'   // Longer-form thoughts
};
```

## 2. Technical Architecture

### 2.1 Data Structure

```javascript
// Post Schema
{
  id: "2024-01-15-001",           // YYYY-MM-DD-sequence
  timestamp: "2024-01-15T10:30:00Z",
  type: "text",                   // POST_TYPES enum
  content: {
    text: "Main content here",
    html: "<p>Rendered HTML</p>",  // Pre-rendered for performance
    markdown: "Original markdown"   // For editing
  },
  media: {
    images: [{
      url: "/assets/microblog/image.jpg",
      alt: "Description",
      caption: "Optional caption"
    }],
    video: {
      url: "/assets/microblog/video.mp4",
      poster: "/assets/microblog/poster.jpg"
    }
  },
  metadata: {
    tags: ["meditation", "design"],
    location: "Mumbai",
    mood: "contemplative",
    readingTime: "1 min"
  },
  interactions: {
    views: 0,
    reactions: []  // Future enhancement
  }
}
```

### 2.2 Storage Options

#### Option A: Static JSON (Recommended for Phase 1)
- Store posts in `/data/microblog/posts.json`
- Build-time generation of HTML
- Client-side filtering/search
- Simple deployment, no backend needed

```javascript
// /data/microblog/posts.json
{
  "posts": [
    { /* post object */ },
    { /* post object */ }
  ],
  "metadata": {
    "total": 150,
    "lastUpdated": "2024-01-15T10:30:00Z"
  }
}
```

#### Option B: Markdown Files (Alternative)
- Individual `.md` files in `/content/microblog/`
- Front matter for metadata
- Build-time processing
- Better for version control

```markdown
---
id: 2024-01-15-001
date: 2024-01-15T10:30:00Z
type: text
tags: [meditation, design]
---

Content goes here...
```

#### Option C: External CMS (Future)
- Headless CMS (Strapi, Contentful)
- API-based content delivery
- Real-time updates
- More complex setup

### 2.3 Posting Mechanism

#### Phase 1: Local Development
- Command-line tool for creating posts
- Markdown editor integration
- Git-based workflow

```bash
# CLI tool example
npm run microblog:new --type=text --content="Today's thought..."
```

#### Phase 2: Web-based Editor
- Protected admin route (`/microblog/compose`)
- Authentication via environment variables
- Rich text editor with markdown support
- Media upload capabilities

## 3. UI/UX Design

### 3.1 Page Layout

```
┌─────────────────────────────────────┐
│         Site Header                 │
├─────────────────────────────────────┤
│                                     │
│    Microblog Hero Section           │
│    "Stream of Consciousness"        │
│                                     │
├─────────────────────────────────────┤
│ Filters │                           │
│ & Tags  │     Post Feed             │
│         │                           │
│ [All]   │  ┌──────────────┐        │
│ [Text]  │  │ Post Card 1  │        │
│ [Links] │  └──────────────┘        │
│ [Code]  │  ┌──────────────┐        │
│         │  │ Post Card 2  │        │
│ Search  │  └──────────────┘        │
│ [____]  │  ┌──────────────┐        │
│         │  │ Post Card 3  │        │
│         │  └──────────────┘        │
│         │       ...                 │
│         │  [Load More]              │
└─────────┴───────────────────────────┘
```

### 3.2 Post Card Component

```html
<article class="micro-post" data-type="text" data-id="2024-01-15-001">
  <header class="micro-post-header">
    <time datetime="2024-01-15T10:30:00Z">Jan 15, 2024 • 10:30 AM</time>
    <span class="micro-post-type">💭 Thought</span>
  </header>
  
  <div class="micro-post-content">
    <p>Today I realized that design is not about making things beautiful, 
    but about making beauty functional.</p>
  </div>
  
  <footer class="micro-post-footer">
    <div class="micro-post-tags">
      <span class="tag">#design</span>
      <span class="tag">#philosophy</span>
    </div>
    <button class="micro-post-share" aria-label="Share post">
      <svg><!-- share icon --></svg>
    </button>
  </footer>
</article>
```

### 3.3 CSS Architecture

```css
/* Microblog-specific styles */
.microblog-page {
  --micro-max-width: 680px;
  --micro-card-gap: var(--space-6);
  --micro-sidebar-width: 200px;
}

.micro-post {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  margin-bottom: var(--micro-card-gap);
  transition: all var(--duration-base) var(--ease-out);
}

.micro-post:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Type-specific styling */
.micro-post[data-type="quote"] {
  border-left: 4px solid var(--color-accent);
  font-style: italic;
}

.micro-post[data-type="code"] {
  font-family: var(--font-mono);
  background: var(--color-background);
}

.micro-post[data-type="image"] .micro-post-media {
  margin: var(--space-4) calc(-1 * var(--space-5));
  border-radius: 0;
}

/* Responsive grid */
@media (min-width: 768px) {
  .microblog-layout {
    display: grid;
    grid-template-columns: var(--micro-sidebar-width) 1fr;
    gap: var(--space-8);
  }
}

@media (max-width: 767px) {
  .microblog-filters {
    position: sticky;
    top: 68px;
    background: var(--color-background);
    z-index: 5;
    padding: var(--space-3) 0;
    border-bottom: 1px solid var(--color-border);
  }
}
```

## 4. JavaScript Implementation

### 4.1 Core Module

```javascript
// js/microblog.js
class Microblog {
  constructor(options = {}) {
    this.container = options.container || '#microblog-feed';
    this.posts = [];
    this.filteredPosts = [];
    this.currentFilter = 'all';
    this.postsPerPage = options.postsPerPage || 10;
    this.currentPage = 0;
    this.isLoading = false;
    
    this.init();
  }
  
  async init() {
    await this.loadPosts();
    this.setupFilters();
    this.setupSearch();
    this.setupInfiniteScroll();
    this.render();
  }
  
  async loadPosts() {
    try {
      const response = await fetch('/data/microblog/posts.json');
      const data = await response.json();
      this.posts = data.posts.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
      this.filteredPosts = [...this.posts];
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  }
  
  filterPosts(type) {
    this.currentFilter = type;
    this.currentPage = 0;
    
    if (type === 'all') {
      this.filteredPosts = [...this.posts];
    } else {
      this.filteredPosts = this.posts.filter(post => post.type === type);
    }
    
    this.render();
  }
  
  searchPosts(query) {
    const lowerQuery = query.toLowerCase();
    this.filteredPosts = this.posts.filter(post => {
      const searchableText = [
        post.content.text,
        ...(post.metadata.tags || [])
      ].join(' ').toLowerCase();
      
      return searchableText.includes(lowerQuery);
    });
    
    this.currentPage = 0;
    this.render();
  }
  
  render() {
    const container = document.querySelector(this.container);
    const start = 0;
    const end = (this.currentPage + 1) * this.postsPerPage;
    const postsToShow = this.filteredPosts.slice(start, end);
    
    container.innerHTML = postsToShow.map(post => 
      this.renderPost(post)
    ).join('');
    
    this.attachEventListeners();
  }
  
  renderPost(post) {
    const date = new Date(post.timestamp);
    const formattedDate = this.formatDate(date);
    const typeIcon = this.getTypeIcon(post.type);
    
    return `
      <article class="micro-post" data-type="${post.type}" data-id="${post.id}">
        <header class="micro-post-header">
          <time datetime="${post.timestamp}">${formattedDate}</time>
          <span class="micro-post-type">${typeIcon} ${post.type}</span>
        </header>
        
        <div class="micro-post-content">
          ${this.renderContent(post)}
        </div>
        
        ${this.renderMedia(post)}
        
        <footer class="micro-post-footer">
          ${this.renderTags(post.metadata.tags)}
          <button class="micro-post-share" aria-label="Share post">
            <svg width="16" height="16"><!-- share icon --></svg>
          </button>
        </footer>
      </article>
    `;
  }
  
  renderContent(post) {
    switch(post.type) {
      case 'code':
        return `<pre><code>${this.escapeHtml(post.content.text)}</code></pre>`;
      case 'quote':
        return `<blockquote>${post.content.html}</blockquote>`;
      case 'link':
        return `
          <p>${post.content.html}</p>
          <a href="${post.metadata.url}" class="micro-post-link" 
             target="_blank" rel="noopener">
            ${post.metadata.title || post.metadata.url}
          </a>
        `;
      default:
        return post.content.html || `<p>${post.content.text}</p>`;
    }
  }
  
  renderMedia(post) {
    if (!post.media) return '';
    
    if (post.media.images && post.media.images.length > 0) {
      return `
        <div class="micro-post-media">
          ${post.media.images.map(img => `
            <figure>
              <img src="${img.url}" alt="${img.alt}" loading="lazy">
              ${img.caption ? `<figcaption>${img.caption}</figcaption>` : ''}
            </figure>
          `).join('')}
        </div>
      `;
    }
    
    if (post.media.video) {
      return `
        <div class="micro-post-media">
          <video controls poster="${post.media.video.poster}">
            <source src="${post.media.video.url}" type="video/mp4">
          </video>
        </div>
      `;
    }
    
    return '';
  }
  
  renderTags(tags) {
    if (!tags || tags.length === 0) return '';
    
    return `
      <div class="micro-post-tags">
        ${tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
      </div>
    `;
  }
  
  formatDate(date) {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return `${minutes}m ago`;
      }
      return `${hours}h ago`;
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  }
  
  getTypeIcon(type) {
    const icons = {
      text: '💭',
      link: '🔗',
      image: '📷',
      code: '💻',
      quote: '💬',
      video: '🎬',
      thought: '🧠'
    };
    return icons[type] || '📝';
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  setupInfiniteScroll() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.isLoading) {
          this.loadMore();
        }
      });
    }, { rootMargin: '100px' });
    
    const sentinel = document.querySelector('#microblog-sentinel');
    if (sentinel) observer.observe(sentinel);
  }
  
  async loadMore() {
    if (this.isLoading) return;
    
    const totalPages = Math.ceil(this.filteredPosts.length / this.postsPerPage);
    if (this.currentPage >= totalPages - 1) return;
    
    this.isLoading = true;
    this.currentPage++;
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const container = document.querySelector(this.container);
    const start = this.currentPage * this.postsPerPage;
    const end = start + this.postsPerPage;
    const newPosts = this.filteredPosts.slice(start, end);
    
    const newHTML = newPosts.map(post => this.renderPost(post)).join('');
    container.insertAdjacentHTML('beforeend', newHTML);
    
    this.attachEventListeners();
    this.isLoading = false;
  }
  
  setupFilters() {
    document.querySelectorAll('[data-filter]').forEach(button => {
      button.addEventListener('click', (e) => {
        const filter = e.target.dataset.filter;
        this.filterPosts(filter);
        
        // Update active state
        document.querySelectorAll('[data-filter]').forEach(btn => {
          btn.classList.toggle('active', btn.dataset.filter === filter);
        });
      });
    });
  }
  
  setupSearch() {
    const searchInput = document.querySelector('#microblog-search');
    if (!searchInput) return;
    
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        this.searchPosts(e.target.value);
      }, 300);
    });
  }
  
  attachEventListeners() {
    // Share buttons
    document.querySelectorAll('.micro-post-share').forEach(button => {
      button.addEventListener('click', async (e) => {
        const post = e.target.closest('.micro-post');
        const postId = post.dataset.id;
        const url = `${window.location.origin}/microblog#${postId}`;
        
        if (navigator.share) {
          try {
            await navigator.share({
              title: 'Microblog Post',
              url: url
            });
          } catch (err) {
            console.log('Share cancelled');
          }
        } else {
          // Fallback: copy to clipboard
          navigator.clipboard.writeText(url);
          // Show toast notification
          this.showToast('Link copied to clipboard');
        }
      });
    });
    
    // Tag clicks
    document.querySelectorAll('.micro-post-tags .tag').forEach(tag => {
      tag.addEventListener('click', (e) => {
        const tagText = e.target.textContent.replace('#', '');
        document.querySelector('#microblog-search').value = tagText;
        this.searchPosts(tagText);
      });
    });
  }
  
  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('#microblog-feed')) {
    window.microblog = new Microblog({
      container: '#microblog-feed',
      postsPerPage: 10
    });
  }
});
```

## 5. HTML Page Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Microblog - Stream of Consciousness</title>
  <meta name="description" content="Short-form thoughts, links, and observations from my daily practice.">
  
  <!-- Existing styles -->
  <link rel="stylesheet" href="./css/styles.css">
  <link rel="stylesheet" href="./css/themes.css">
  <link rel="stylesheet" href="./css/utilities.css">
  <link rel="stylesheet" href="./css/microblog.css">
  
  <!-- RSS Feed -->
  <link rel="alternate" type="application/rss+xml" title="Microblog RSS" href="/feed.xml">
</head>
<body>
  <!-- Existing header -->
  <header class="site-header">
    <!-- ... existing header content ... -->
    <nav class="site-nav">
      <a href="/">Home</a>
      <a href="/microblog" aria-current="page">Microblog</a>
      <a href="/assets/Nishit_cv.pdf">CV</a>
    </nav>
  </header>
  
  <main id="main" class="site-main microblog-page">
    <!-- Hero Section -->
    <section class="microblog-hero">
      <div class="container narrow">
        <h1>Stream of Consciousness</h1>
        <p class="hero-subtitle">
          Short-form thoughts, links, and observations from my daily practice.
        </p>
      </div>
    </section>
    
    <!-- Main Content -->
    <section class="microblog-content">
      <div class="container">
        <div class="microblog-layout">
          <!-- Sidebar Filters -->
          <aside class="microblog-filters" aria-label="Filter posts">
            <h2 class="visually-hidden">Filters</h2>
            
            <div class="filter-group">
              <h3>Type</h3>
              <button data-filter="all" class="filter-btn active">All</button>
              <button data-filter="text" class="filter-btn">Text</button>
              <button data-filter="link" class="filter-btn">Links</button>
              <button data-filter="image" class="filter-btn">Images</button>
              <button data-filter="code" class="filter-btn">Code</button>
              <button data-filter="quote" class="filter-btn">Quotes</button>
            </div>
            
            <div class="filter-group">
              <h3>Search</h3>
              <input 
                type="search" 
                id="microblog-search" 
                placeholder="Search posts..."
                aria-label="Search posts"
              >
            </div>
            
            <div class="filter-group">
              <h3>Popular Tags</h3>
              <div class="tag-cloud">
                <button class="tag-btn">#design</button>
                <button class="tag-btn">#meditation</button>
                <button class="tag-btn">#code</button>
                <button class="tag-btn">#photography</button>
                <button class="tag-btn">#bjj</button>
              </div>
            </div>
          </aside>
          
          <!-- Posts Feed -->
          <div class="microblog-feed-wrapper">
            <div id="microblog-feed" class="microblog-feed">
              <!-- Posts will be dynamically inserted here -->
            </div>
            
            <!-- Infinite scroll sentinel -->
            <div id="microblog-sentinel" class="loading-sentinel">
              <div class="spinner"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
  
  <!-- Existing footer -->
  <footer class="site-footer">
    <!-- ... existing footer content ... -->
  </footer>
  
  <!-- Scripts -->
  <script src="./js/main.js"></script>
  <script src="./js/microblog.js"></script>
</body>
</html>
```

## 6. Navigation Integration

### 6.1 Update Main Navigation
Add microblog link to the main site navigation in `index.html`:

```html
<nav class="site-nav" aria-label="Site navigation">
  <div class="nav-links">
    <a href="/">Home</a>
    <a href="/microblog">Microblog</a>
    <!-- existing links -->
  </div>
  <!-- existing theme switcher -->
</nav>
```

### 6.2 Add to Mobile Menu
Ensure microblog is accessible in mobile navigation.

## 7. Performance Optimization

### 7.1 Lazy Loading
- Images use native `loading="lazy"`
- Videos load on intersection
- Posts load in batches of 10

### 7.2 Caching Strategy
```javascript
// Service Worker for offline support
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/microblog')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((response) => {
          return caches.open('microblog-v1').then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  }
});
```

### 7.3 Build Optimization
- Pre-render posts at build time
- Generate static HTML for SEO
- Minify JSON payload

## 8. SEO & Metadata

### 8.1 Structured Data
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "Microblog - Stream of Consciousness",
  "description": "Short-form thoughts and observations",
  "author": {
    "@type": "Person",
    "name": "Nishit"
  },
  "blogPost": [
    {
      "@type": "BlogPosting",
      "headline": "Post title",
      "datePublished": "2024-01-15T10:30:00Z",
      "author": {
        "@type": "Person",
        "name": "Nishit"
      }
    }
  ]
}
</script>
```

### 8.2 RSS Feed Generation
```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Microblog - Stream of Consciousness</title>
    <link>https://example.com/microblog</link>
    <description>Short-form thoughts and observations</description>
    <atom:link href="https://example.com/feed.xml" rel="self" type="application/rss+xml"/>
    
    <item>
      <title>Post Title</title>
      <link>https://example.com/microblog#2024-01-15-001</link>
      <description>Post content here...</description>
      <pubDate>Mon, 15 Jan 2024 10:30:00 GMT</pubDate>
      <guid>https://example.com/microblog#2024-01-15-001</guid>
    </item>
  </channel>
</rss>
```

## 9. Accessibility Features

### 9.1 ARIA Labels
- Proper heading hierarchy
- Descriptive button labels
- Live regions for updates

### 9.2 Keyboard Navigation
- Tab through posts
- Enter to expand/interact
- Escape to close modals

### 9.3 Screen Reader Support
- Semantic HTML structure
- Alt text for all images
- Descriptive link text

## 10. Implementation Timeline

### Phase 1: Foundation (Week 1)
- [x] Create plan and specifications
- [ ] Set up data structure
- [ ] Create basic HTML/CSS
- [ ] Implement static post rendering

### Phase 2: Interactivity (Week 2)
- [ ] Add filtering system
- [ ] Implement search
- [ ] Add infinite scroll
- [ ] Create share functionality

### Phase 3: Content Management (Week 3)
- [ ] Build CLI posting tool
- [ ] Set up build pipeline
- [ ] Create RSS feed generator
- [ ] Add SEO optimizations

### Phase 4: Polish (Week 4)
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Cross-browser testing
- [ ] Documentation

## 11. Future Enhancements

### 11.1 Advanced Features
- Web Mentions integration
- ActivityPub support
- Email newsletter
- Analytics dashboard
- Comment system

### 11.2 Content Types
- Polls/surveys
- Audio notes
- Location check-ins
- Reading progress
- Mood tracking

### 11.3 Automation
- Cross-posting to social media
- Scheduled posts
- Auto-tagging
- Content suggestions

## 12. Testing Checklist

### 12.1 Functionality
- [ ] Posts load correctly
- [ ] Filtering works
- [ ] Search returns results
- [ ] Infinite scroll triggers
- [ ] Share buttons work
- [ ] Theme switching maintained

### 12.2 Performance
- [ ] Page loads < 3 seconds
- [ ] Lighthouse score > 90
- [ ] Images optimized
- [ ] JavaScript minified

### 12.3 Accessibility
- [ ] Keyboard navigable
- [ ] Screen reader tested
- [ ] Color contrast passes
- [ ] Focus indicators visible

### 12.4 Cross-browser
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

## Conclusion

This microblog implementation provides a lightweight, performant, and accessible platform for sharing short-form content while maintaining consistency with the existing portfolio site's design system and technical architecture. The phased approach allows for iterative development and testing, ensuring a stable and polished final product.