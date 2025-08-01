/**
 * main.js
 * - Minimal enhancements: current year, reduced-motion handling, lazy video.
 * - Also wires Bento GIFs from local assets based on data-topic attributes.
 * - Terminal toggle: ensure terminal starts collapsed and toggle button is always visible.
 * - No framework. Accessibility-first.
 */

(function () {
  // Update year in footer
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Respect prefers-reduced-motion: avoid autoplay or aggressive animations
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Lazy load video on intersection (if supported)
  var video = document.getElementById('hero-video');
  if (video && 'IntersectionObserver' in window) {
    var loaded = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!loaded && entry.isIntersecting) {
          // Defer any heavy operations; here we could swap to higher-quality source if needed
          loaded = true;
          io.disconnect();
        }
      });
    }, { rootMargin: '200px' });
    io.observe(video);
  }

  // Keyboard focus ring helper: only show focus outlines when using keyboard
  var usingMouse = false;
  document.addEventListener('mousedown', function () { usingMouse = true; }, { passive: true });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') usingMouse = false;
  }, { passive: true });

  // Ensure terminal starts minimized and toggle works even if JS loads late
  var terminalEl = document.getElementById('terminal');
  var toggleBtn = document.getElementById('terminal-toggle');
  if (terminalEl && toggleBtn) {
    terminalEl.classList.add('collapsed');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.addEventListener('click', function () {
      var open = toggleBtn.getAttribute('aria-expanded') === 'true';
      if (open) {
        terminalEl.classList.add('collapsed');
        toggleBtn.setAttribute('aria-expanded', 'false');
      } else {
        terminalEl.classList.remove('collapsed');
        toggleBtn.setAttribute('aria-expanded', 'true');
        var input = terminalEl.querySelector('#terminal-input');
        if (input) input.focus();
      }
    });
  }

  // Map topics to local GIF filenames as provided
  // Note: Ensure filenames exactly match files placed in /assets/gifs/
  var topicToGif = {
    bjj: '/assets/gifs/bjj.gif',
    astro: '/assets/gifs/astro.gif',
    // Exact filenames provided by user
    mathphys: '/assets/gifs/mathematics&physics.gif',
    ea: '/assets/gifs/ea.gif',
    meditation: '/assets/gifs/meditation.gif',
    art_design: '/assets/gifs/art&design.gif'
  };

  // Apply GIF sources to each .gif-corner with data-topic
  document.querySelectorAll('.gif-corner[data-topic]').forEach(function (corner) {
    var topic = corner.getAttribute('data-topic');
    var img = corner.querySelector('img');
    if (!img) return;
    var src = topicToGif[topic];
    if (src) {
      img.src = src;
    }
    // Accessibility: ensure alt exists (fallback to topic label)
    if (!img.getAttribute('alt')) {
      var labelEl = corner.parentElement && corner.parentElement.querySelector('h3');
      var label = labelEl ? labelEl.textContent.trim() : (topic || 'Topic');
      img.setAttribute('alt', label + ' illustrative animation.');
    }
    // Reduced motion: if user prefers reduced motion, avoid loading animated GIFs
    if (reduceMotion) {
      // Replace with a static placeholder by pausing load via data-src
      var currentSrc = img.getAttribute('src');
      if (currentSrc && /\.gif(\?.*)?$/.test(currentSrc)) {
        img.setAttribute('data-src', currentSrc);
        img.removeAttribute('src');
        img.setAttribute('alt', (img.getAttribute('alt') || 'Topic') + ' (animation disabled due to reduced motion preference).');
        // Optionally, we could point to a static PNG/WebP thumbnail if available
      }
    }
  });
})();