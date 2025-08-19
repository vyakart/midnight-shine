(function () {
  'use strict';

  const DEFAULTS = {
    animateOn: 'view',
    revealDirection: 'center',
    speed: 50,
    maxIterations: 20,
    characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*?'
  };
  // Restrict effect to: site header brand title and crypto wallet addresses only
  const TARGET_SELECTOR = '.brand-title, code.wallet-address';

  function getConfig(el) {
    const host = el.closest && el.closest(TARGET_SELECTOR) ? el.closest(TARGET_SELECTOR) : el;
    return {
      animateOn: host.dataset.animateOn || DEFAULTS.animateOn,
      revealDirection: host.dataset.revealDirection || DEFAULTS.revealDirection,
      speed: parseInt(host.dataset.speed || DEFAULTS.speed, 10),
      maxIterations: parseInt(host.dataset.maxIterations || DEFAULTS.maxIterations, 10),
      characters: host.dataset.characters || DEFAULTS.characters
    };
  }

  function prefersReduced() {
    try {
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (_) {
      return false;
    }
  }

  function measureCharWidth(refEl, char) {
    const span = document.createElement('span');
    span.textContent = char || ' ';
    span.style.visibility = 'hidden';
    span.style.position = 'fixed';
    span.style.top = '-9999px';
    span.style.whiteSpace = 'pre';
    const cs = window.getComputedStyle(refEl);
    span.style.fontFamily = cs.fontFamily;
    span.style.fontSize = cs.fontSize;
    span.style.fontWeight = cs.fontWeight;
    span.style.letterSpacing = cs.letterSpacing;
    span.style.textTransform = cs.textTransform;
    document.body.appendChild(span);
    const rect = span.getBoundingClientRect();
    span.remove();
    return rect.width;
  }

  function buildLetterSpans(targetEl, finalText) {
    const frag = document.createDocumentFragment();
    const letters = [];
    const uniq = new Map();
    for (const ch of finalText) {
      if (!uniq.has(ch)) {
        uniq.set(ch, measureCharWidth(targetEl, ch));
      }
    }
    for (let i = 0; i < finalText.length; i++) {
      const ch = finalText[i];
      const span = document.createElement('span');
      span.className = 'decrypt-letter decrypt-encrypted';
      span.dataset.final = ch;
      span.textContent = ch === ' ' ? ' ' : '•';
      span.style.display = 'inline-block';
      span.style.whiteSpace = 'pre';
      span.style.minWidth = (uniq.get(ch) || measureCharWidth(targetEl, ch)).toFixed(2) + 'px';
      letters.push(span);
      frag.appendChild(span);
    }
    return { container: frag, letters };
  }

  function makeOrder(n, direction) {
    const idx = [];
    if (direction === 'left') {
      for (let i = 0; i < n; i++) idx.push(i);
    } else if (direction === 'right') {
      for (let i = n - 1; i >= 0; i--) idx.push(i);
    } else {
      const c = Math.floor((n - 1) / 2);
      idx.push(c);
      for (let d = 1; idx.length < n; d++) {
        const left = c - d;
        const right = c + d;
        if (left >= 0) idx.push(left);
        if (right < n) idx.push(right);
      }
    }
    return idx;
  }

  function randomChar(chars) {
    return chars.charAt(Math.floor(Math.random() * chars.length));
  }

  function animateDecrypt(targetEl, opts) {
    if (!targetEl || targetEl.dataset.decrypted === 'true') return;
    const finalText = (targetEl.dataset.finalText || targetEl.textContent || '').toString();
    if (!finalText) { targetEl.dataset.decrypted = 'true'; return; }

    targetEl.setAttribute('aria-busy', 'true');
    const sr = document.createElement('span');
    sr.className = 'visually-hidden';
    sr.textContent = finalText;
    targetEl.appendChild(sr);

    const built = buildLetterSpans(targetEl, finalText);
    const visWrap = document.createElement('span');
    visWrap.className = 'decrypt-letters decrypt-all';
    visWrap.setAttribute('aria-hidden', 'true');
    visWrap.appendChild(built.container);

    const children = Array.from(targetEl.childNodes);
    for (const node of children) {
      if (node !== sr) node.remove();
    }
    targetEl.appendChild(visWrap);

    if (prefersReduced()) {
      for (let i = 0; i < built.letters.length; i++) {
        const span = built.letters[i];
        span.textContent = finalText[i];
        span.classList.remove('decrypt-encrypted');
        span.classList.add('decrypt-revealed');
      }
      targetEl.removeAttribute('aria-busy');
      targetEl.dataset.decrypted = 'true';
      targetEl.textContent = finalText;
      return;
    }

   const order = makeOrder(built.letters.length, opts.revealDirection);
   let orderPos = 0;
   const iterationsForIndex = new Array(built.letters.length).fill(0);
   let lastTick = performance.now();

   function tick(now) {
     const elapsed = now - lastTick;
     if (elapsed < opts.speed) {
       requestAnimationFrame(tick);
       return;
     }
     lastTick = now;

     for (let i = 0; i < built.letters.length; i++) {
       if (iterationsForIndex[i] === -1) continue;
       iterationsForIndex[i] += 1;
       if (iterationsForIndex[i] < opts.maxIterations) {
         const ch = finalText[i];
         if (ch === ' ') {
           built.letters[i].textContent = ' ';
         } else {
           built.letters[i].textContent = randomChar(opts.characters);
         }
       } else {
         const revealIdx = order[orderPos];
         if (iterationsForIndex[revealIdx] !== -1) {
           built.letters[revealIdx].textContent = finalText[revealIdx];
           built.letters[revealIdx].classList.remove('decrypt-encrypted');
           built.letters[revealIdx].classList.add('decrypt-revealed');
           iterationsForIndex[revealIdx] = -1;
           orderPos += 1;
         }
       }
     }

     if (orderPos >= order.length) {
       targetEl.removeAttribute('aria-busy');
       targetEl.dataset.decrypted = 'true';
       targetEl.textContent = finalText;
       return;
     }
     requestAnimationFrame(tick);
   }
   requestAnimationFrame(tick);
  }

  function observersFactory() {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const el = entry.target;
        if (entry.isIntersecting) {
          const host = el.closest(TARGET_SELECTOR) || el.parentElement || el;
          const cfg = getConfig(host);
          io.unobserve(el);
          animateDecrypt(el, cfg);
        }
      }
    }, { root: null, threshold: 0.6 });
    return {
      observe(el) { io.observe(el); }
    };
  }
  const observers = observersFactory();

  function setupForElement(rawEl) {
    if (!rawEl || rawEl.dataset.decrypt === 'off') return;
    let target = rawEl;
    if (rawEl.classList && rawEl.classList.contains('brand-title')) {
      const fixed = rawEl.querySelector('.brand-fixed');
      if (fixed) target = fixed;
    }
    if (target.dataset.decrypted === 'true') return;

    const cfg = getConfig(rawEl);
    const finalText = (target.textContent || '').trim();
    if (finalText) target.dataset.finalText = finalText;

    if (cfg.animateOn === 'load') {
      animateDecrypt(target, cfg);
      return;
    }
    if (cfg.animateOn === 'hover') {
      let ran = false;
      target.addEventListener('mouseenter', () => {
        if (ran) return;
        ran = true;
        animateDecrypt(target, cfg);
      }, { once: true });
      return;
    }
    observers.observe(target);
  }

  function initAll() {
    const targets = Array.from(document.querySelectorAll(TARGET_SELECTOR));
    targets.forEach(setupForElement);

    // Effect restricted to header brand title and crypto wallet addresses only.
    // No dynamic observers for other headings.
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  window.DecryptedText = {
    initAll,
    animate(el) {
      const host = el.closest && el.closest(TARGET_SELECTOR) ? el.closest(TARGET_SELECTOR) : el;
      const cfg = getConfig(host);
      animateDecrypt(el, cfg);
    }
  };
})();