/**
 * main.js
 * - Minimal enhancements: current year, reduced-motion handling, lazy video.
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
          // For placeholder we simply mark as loaded
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
})();