/**
 * donate.js
 * v2 — Frequency tabs (one-time / monthly), horizontal preset slider, and live currency switching.
 * - Preset labels provided by user (base currency: USD)
 * - Currencies: USD (default), INR, EUR with live rates (exchangerate.host) and offline fallbacks
 * - Share module (Web Share API + clipboard)
 * - Wallet rows: copy/open behavior with polite SR announcements
 *
 * Notes:
 * - No provider wiring yet (Razorpay/UPI removed). "Continue" buttons are placeholders.
 */

(function () {
  'use strict';

  // ---------- Config ----------
  var PRESETS_USD = [
    { amount: 5,    label: 'fuel for the road' },
    { amount: 11,   label: 'a used library book' },
    { amount: 33,   label: 'archive & backups' },
    { amount: 55,   label: 'community meetups + snacks' },
    { amount: 150,  label: 'field day travel' },
    { amount: 250,  label: 'AI tools license' },
    { amount: 500,  label: 'mini library upgrade' },
    { amount: 900,  label: 'one month of rent' },
    { amount: 1100, label: 'Ricoh GR IIIx (camera fund)' },
    { amount: 5000, label: 'down-payment for an apartment' }
  ];
  var MIN_USD = 2;

  // Currency config with fallbacks (in case fetch fails)
  var CURRENCIES = {
    USD: { code: 'USD', symbol: '$', rate: 1 },
    INR: { code: 'INR', symbol: '₹', rate: 83 },    // fallback approx
    EUR: { code: 'EUR', symbol: '€', rate: 0.92 }   // fallback approx
  };
  var ACTIVE_CURRENCY = 'USD';

  // ---------- Helpers ----------
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function fetchRates() {
    try {
      var url = 'https://api.exchangerate.host/latest?base=USD&symbols=INR,EUR';
      fetch(url).then(function (r) { return r.ok ? r.json() : null; }).then(function (json) {
        if (!json || !json.rates) return;
        if (json.rates.INR) CURRENCIES.INR.rate = json.rates.INR;
        if (json.rates.EUR) CURRENCIES.EUR.rate = json.rates.EUR;
        // Re-render amounts after async load
        renderAll();
      }).catch(function () { /* ignore */ });
    } catch (_) { /* ignore */ }
  }

  function convertFromUSD(usd, code) {
    var rate = (CURRENCIES[code] && CURRENCIES[code].rate) || 1;
    return usd * rate;
  }

  function minInCurrency(code) {
    return convertFromUSD(MIN_USD, code);
  }

  function formatCurrencyFromUSD(usd, code) {
    var value = convertFromUSD(usd, code);
    // Formatting strategy: 0 decimals for INR, 2 for USD/EUR
    var minFrac = code === 'INR' ? 0 : 2;
    var maxFrac = code === 'INR' ? 0 : 2;
    try {
      // Use currency-specific locale formatting when possible
      return new Intl.NumberFormat(undefined, { style: 'currency', currency: code, minimumFractionDigits: minFrac, maximumFractionDigits: maxFrac }).format(value);
    } catch (_) {
      // Fallback manual format
      var sym = (CURRENCIES[code] && CURRENCIES[code].symbol) || '$';
      var fixed = value.toFixed(maxFrac);
      return sym + fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  }

  function parseNumberLocal(input) {
    // Strip non-numeric except dot/comma; normalize comma to dot
    var s = String(input || '').trim().replace(/,/g, '.');
    var n = parseFloat(s);
    return isFinite(n) ? n : 0;
  }

  function announce(el, msg) {
    if (!el) return;
    el.textContent = msg;
    setTimeout(function () { el.textContent = ''; }, 1800);
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (_) {}
    document.body.removeChild(ta);
    return Promise.resolve();
  }

  function setQR(imgEl, data, size) {
    if (!imgEl) return;
    var s = size || 180;
    var url = 'https://api.qrserver.com/v1/create-qr-code/?size=' + s + 'x' + s + '&data=' + encodeURIComponent(data);
    imgEl.src = url;
    imgEl.alt = 'QR code';
  }

  // ---------- Tabs (one-time / monthly) ----------
  var tabOnce = $('#tab-onetime');
  var tabMonthly = $('#tab-monthly');
  var panelOnce = $('#panel-onetime');
  var panelMonthly = $('#panel-monthly');

  function selectTab(which) {
    var isOnce = which === 'onetime';
    tabOnce.setAttribute('aria-selected', String(isOnce));
    tabMonthly.setAttribute('aria-selected', String(!isOnce));
    tabMonthly.setAttribute('tabindex', isOnce ? '-1' : '0');

    if (isOnce) {
      panelOnce.hidden = false;
      panelOnce.classList.remove('hidden');
      panelMonthly.hidden = true;
      panelMonthly.classList.add('hidden');
      tabOnce.focus();
    } else {
      panelMonthly.hidden = false;
      panelMonthly.classList.remove('hidden');
      panelOnce.hidden = true;
      panelOnce.classList.add('hidden');
      tabMonthly.focus();
    }
  }
  if (tabOnce && tabMonthly) {
    tabOnce.addEventListener('click', function () { selectTab('onetime'); });
    tabMonthly.addEventListener('click', function () { selectTab('monthly'); });
    [tabOnce, tabMonthly].forEach(function (t, idx, arr) {
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          var next = (idx + (e.key === 'ArrowRight' ? 1 : -1) + arr.length) % arr.length;
          selectTab(next === 0 ? 'onetime' : 'monthly');
        }
      });
    });
  }

  // ---------- Preset slider ----------
  function buildSlider(scrollerRoot, type) {
    if (!scrollerRoot) return { setPressed: function(){}, setCurrency: function(){} };

    var viewport = scrollerRoot.querySelector('.preset-viewport');
    var track = scrollerRoot.querySelector('.preset-track');
    var prev = scrollerRoot.querySelector('.scroll-btn.prev');
    var next = scrollerRoot.querySelector('.scroll-btn.next');

    track.innerHTML = '';
    PRESETS_USD.forEach(function (p, idx) {
      var btn = document.createElement('button');
      btn.className = 'preset preset-card';
      btn.setAttribute('role', 'listitem');
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('data-amount-usd', String(p.amount));
      btn.setAttribute('data-index', String(idx));

      var price = document.createElement('div');
      price.className = 'preset-price';
      price.textContent = formatCurrencyFromUSD(p.amount, ACTIVE_CURRENCY);

      var sub = document.createElement('div');
      sub.className = 'preset-sub';
      sub.textContent = p.label;

      btn.appendChild(price);
      btn.appendChild(sub);
      track.appendChild(btn);
    });

    function scrollByViewport(dir) {
      if (!viewport) return;
      var dx = viewport.clientWidth * 0.9 * (dir === 'next' ? 1 : -1);
      viewport.scrollBy({ left: dx, behavior: 'smooth' });
    }
    if (prev) prev.addEventListener('click', function(){ scrollByViewport('prev'); });
    if (next) next.addEventListener('click', function(){ scrollByViewport('next'); });

    // Keyboard scroll on viewport
    if (viewport) {
      viewport.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); scrollByViewport('next'); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); scrollByViewport('prev'); }
      });
    }

    function setPressedAmount(amountUSD) {
      $all('.preset', track).forEach(function (b) {
        var a = parseFloat(b.getAttribute('data-amount-usd') || '0');
        b.setAttribute('aria-pressed', String(a === amountUSD));
      });
    }

    function updateCurrency() {
      $all('.preset', track).forEach(function (b) {
        var a = parseFloat(b.getAttribute('data-amount-usd') || '0');
        var priceEl = b.querySelector('.preset-price');
        if (priceEl) priceEl.textContent = formatCurrencyFromUSD(a, ACTIVE_CURRENCY);
      });
    }

    return {
      root: scrollerRoot,
      track: track,
      setPressed: setPressedAmount,
      setCurrency: updateCurrency
    };
  }

  // Instances for both panels
  var onceSlider = buildSlider($('#panel-onetime .preset-scroller'), 'onetime');
  var monthlySlider = buildSlider($('#panel-monthly .preset-scroller'), 'monthly');

  // ---------- Currency switch ----------
  var currencySelect = $('#currency');
  var symbolOnce = $('#currency-symbol-onetime');
  var symbolMonthly = $('#currency-symbol-monthly');
  var inputOnce = $('#amount-onetime');
  var inputMonthly = $('#amount-monthly');

  function updateCurrencyUI() {
    var sym = (CURRENCIES[ACTIVE_CURRENCY] && CURRENCIES[ACTIVE_CURRENCY].symbol) || '$';
    if (symbolOnce) symbolOnce.textContent = sym;
    if (symbolMonthly) symbolMonthly.textContent = sym;

    // No minimums in placeholder per user request
    if (inputOnce) inputOnce.placeholder = 'custom amount';
    if (inputMonthly) inputMonthly.placeholder = 'custom amount';

    // Update card prices
    if (onceSlider && onceSlider.setCurrency) onceSlider.setCurrency();
    if (monthlySlider && monthlySlider.setCurrency) monthlySlider.setCurrency();
  }

  if (currencySelect) {
    currencySelect.addEventListener('change', function () {
      var v = currencySelect.value;
      if (!CURRENCIES[v]) return;
      ACTIVE_CURRENCY = v;
      updateCurrencyUI();
    });
  }
  updateCurrencyUI(); // initial
  fetchRates();       // async refresh when network available

  // ---------- Preset click handling ----------
  function wirePresetClicks(panelEl, slider, inputEl) {
    if (!panelEl || !slider || !slider.track || !inputEl) return;
    slider.track.addEventListener('click', function (e) {
      var target = e.target;
      while (target && target !== slider.track && !target.classList.contains('preset')) target = target.parentElement;
      if (!target || target === slider.track) return;
      var amountUSD = parseFloat(target.getAttribute('data-amount-usd') || '0');
      slider.setPressed(amountUSD);
      // Set input in localized currency value (number only)
      var localized = convertFromUSD(amountUSD, ACTIVE_CURRENCY);
      inputEl.value = ACTIVE_CURRENCY === 'INR' ? String(Math.round(localized)) : String(localized.toFixed(2));
      inputEl.focus();
    });
  }

  wirePresetClicks(panelOnce, onceSlider, inputOnce);
  wirePresetClicks(panelMonthly, monthlySlider, inputMonthly);

  // ---------- Continue buttons (placeholders) ----------
  var btnOnce = $('#go-onetime');
  var btnMonthly = $('#go-monthly');
  function continueHandler(kind, inputEl) {
    return function () {
      var val = parseNumberLocal(inputEl.value);
      // Allow any positive amount; no minimum validation
      if (!(val > 0)) { inputEl.focus(); inputEl.select && inputEl.select(); return; }

      // Placeholder behavior: copy a summary to clipboard
      var sym = (CURRENCIES[ACTIVE_CURRENCY] && CURRENCIES[ACTIVE_CURRENCY].symbol) || '$';
      var summary = (kind === 'monthly' ? 'Monthly ' : 'One-time ') + sym + val + ' (' + ACTIVE_CURRENCY + ')';
      copyToClipboard(summary);
      try { console.log('Donation summary copied:', summary); } catch(_) {}
    };
  }
  if (btnOnce && inputOnce) btnOnce.addEventListener('click', continueHandler('onetime', inputOnce));
  if (btnMonthly && inputMonthly) btnMonthly.addEventListener('click', continueHandler('monthly', inputMonthly));

  // ---------- Share module ----------
  var pageQR = $('#page-qr');
  var shareBtn = $('#share');
  var copyLinkBtn = $('#copy-link');
  var shareUrl = (typeof window !== 'undefined' && window.location) ? window.location.href : 'https://example.netlify.app/pages/donate.html';
  if (pageQR) setQR(pageQR, shareUrl, 140);

  if (shareBtn) {
    shareBtn.addEventListener('click', function () {
      var data = {
        title: 'Dāna — Donate',
        text: 'Fuel the library, fieldwork, and community spaces.',
        url: shareUrl
      };
      if (navigator.share) {
        navigator.share(data).catch(function () { /* user cancelled */ });
      } else {
        copyToClipboard(shareUrl);
      }
    });
  }
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', function () { copyToClipboard(shareUrl); });
  }

  // ---------- Wallet rows ----------
  var live = $('#copy-status');
  $all('.wallet-list .wallet').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var type = btn.getAttribute('data-type');
      var name = btn.getAttribute('data-name') || 'wallet';
      var address = btn.getAttribute('data-address') || '';
      if (!address) return;
      if (type === 'open') {
        try {
          var url = address;
          if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
          var a = document.createElement('a');
          a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
          document.body.appendChild(a); a.click(); a.remove();
        } catch (_) {}
      } else {
        copyToClipboard(address).then(function () { announce(live, 'Copied ' + name + ' address'); });
      }
    });
    // Keyboard support
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
    });
  });

  // ---------- Initial render ----------
  function renderAll() {
    updateCurrencyUI();
  }
  renderAll();
})();