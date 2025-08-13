/* Microblog page scripts */
'use strict';

// Data source (shared via window from js/microblog-data.js)
const microblogPosts = (window.microblogPosts && Array.isArray(window.microblogPosts)) ? window.microblogPosts : [];

// Create a microblog card
function createMicroblogCard(post, index) {
  var text = (post && typeof post.content === 'string') ? post.content.trim() : '';
  var endsWithEllipsis = text.endsWith('...') || text.endsWith('…');
  // If content is long enough to be visually clamped (≈4 lines), show Read more
  var isLong = text.length > 160;
  var needsReadMore = endsWithEllipsis || !!post.fullContent || isLong;
  var safeTitle = (post && post.title) ? post.title : 'this post';
  var readMoreHTML = needsReadMore
    ? `<a class="read-more" href="/pages/microblog-detail.html?slug=${encodeURIComponent(post.slug || String(post.id))}" aria-label="Read more about ${safeTitle}">Read more</a>`
    : '';
  return `
    <div class="microblog-card" data-id="${post.id}">
      <div class="color-block">
        <div class="base-gradient" style="background:
          radial-gradient(ellipse 100% 60% at 30% 20%, ${post.gradients[0]}, transparent 50%),
          radial-gradient(ellipse 80% 120% at 70% 80%, ${post.gradients[1]}, transparent 60%),
          radial-gradient(ellipse 120% 80% at 20% 60%, ${post.gradients[2]}, transparent 50%),
          linear-gradient(45deg, ${post.gradients[0]}20, ${post.gradients[1]}40, ${post.gradients[2]}20)
        "></div>
        <div class="blob-1" style="background: radial-gradient(ellipse 120% 80% at center, ${post.gradients[0]}, transparent 70%)"></div>
        <div class="blob-2" style="background: radial-gradient(ellipse 100% 120% at center, ${post.gradients[1]}, transparent 60%)"></div>
        <div class="blob-3" style="background: radial-gradient(ellipse 80% 100% at center, ${post.gradients[2]}, transparent 50%)"></div>
        <div class="grain-overlay">
          <div class="grain-primary"></div>
          <div class="grain-secondary"></div>
          <div class="grain-fine"></div>
        </div>
        <div class="depth-overlay"></div>
      </div>
      <div class="card-content">
        <div class="tag-section">
          <div class="tag-brand">STREAM ${index + 1}</div>
          <div class="tag-code">${post.tagCode}</div>
          <div class="tag-name">${post.tagName}</div>
        </div>
        <div class="blog-content">
          <h3 class="blog-title">${post.title}</h3>
          <p class="blog-excerpt">${post.content}</p>
          ${readMoreHTML}
        </div>
        <div class="card-meta">
          <span>by ${post.author}</span>
          <span>${post.timestamp}</span>
        </div>
      </div>
    </div>
  `;
}

// Render all cards
function renderMicroblogCards() {
  const grid = document.getElementById('microblog-grid');
  const cardsHTML = microblogPosts
    .slice()
    .sort((a, b) => a.id - b.id)
    .map((p, i) => createMicroblogCard(p, i))
    .join('');
  grid.innerHTML = cardsHTML;
  grid.querySelectorAll('.read-more').forEach(a => {
    a.addEventListener('click', function(e){ e.stopPropagation(); });
  });
  const cards = grid.querySelectorAll('.microblog-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const cardId = card.dataset.id;
      const post = microblogPosts.find(p => p.id.toString() === cardId);
      if (post) console.log('Card clicked:', post.title);
    });
  });
}

// Load more button
function setupLoadMoreButton() {
  const loadMoreBtn = document.querySelector('.load-more-btn');
  if (!loadMoreBtn) return;
  loadMoreBtn.addEventListener('click', () => {
    console.log('Load more posts clicked');
    loadMoreBtn.style.transform = 'scale(0.95)';
    setTimeout(() => { loadMoreBtn.style.transform = 'scale(1.05)'; }, 150);
    setTimeout(() => { loadMoreBtn.style.transform = 'scale(1)'; }, 300);
  });
}

// Staggered load animations
function addLoadAnimations() {
  const cards = document.querySelectorAll('.microblog-card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 100);
  });
}

// Scroll-trigger animation control
function setupScrollAnimations() {
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.style.animationPlayState = 'running';
    });
  }, observerOptions);
  document.querySelectorAll('.microblog-card').forEach(card => observer.observe(card));
}

// Random animation delays
function addRandomAnimationDelays() {
  const cards = document.querySelectorAll('.microblog-card');
  cards.forEach(card => {
    const colorBlock = card.querySelector('.color-block');
    if (!colorBlock) return;
    const blobs = colorBlock.querySelectorAll('.blob-1, .blob-2, .blob-3');
    const baseGradient = colorBlock.querySelector('.base-gradient');
    const randomDelay1 = Math.random() * 5;
    const randomDelay2 = Math.random() * 8;
    const randomDelay3 = Math.random() * 10;
    if (baseGradient) baseGradient.style.animationDelay = `${randomDelay1}s`;
    blobs.forEach((blob, i) => {
      const delay = [randomDelay1, randomDelay2, randomDelay3][i] || 0;
      blob.style.animationDelay = `${delay}s`;
    });
  });
}

// Interactive effects
function addInteractiveEffects() {
  document.querySelectorAll('.theme-dot').forEach(dot => {
    dot.addEventListener('mouseover', () => {
      dot.style.transform = 'scale(1.5)';
      dot.style.transition = 'transform 0.3s ease';
    });
    dot.addEventListener('mouseout', () => {
      dot.style.transform = 'scale(1)';
    });
  });
  document.querySelectorAll('.microblog-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      card.style.transform = `translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    });
  });
}

// Init
function init() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
    return;
  }
  renderMicroblogCards();
  setupLoadMoreButton();
  setTimeout(() => {
    addLoadAnimations();
    addRandomAnimationDelays();
    setupScrollAnimations();
  }, 100);
  addInteractiveEffects();
}

// Start the application
init();