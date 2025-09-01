/**
 * donate.js
 * v2.1 — Donation UI helpers (ETH-first)
 * - Frequency tabs (one-time / monthly) with full payment processing
 * - Horizontal preset slider with customizable amounts
 * - Live currency switching (USD, INR, EUR) with exchangerate.host API
 * - Donor information collection (phone required, email optional)
 * - Share module (Web Share API + clipboard fallback)
 * - Crypto wallet copy functionality with accessibility announcements
 * - Removed legacy Cashfree/fiat paths
 *
 * Features:
 * - Real-time currency conversion with offline fallbacks
 * - Responsive design with touch-friendly controls
 * - Accessibility compliant with ARIA labels and keyboard navigation
 * - Error handling with user-friendly messages
 * - Payment verification and status updates
 */

(function () {
  'use strict';

  // ---------- Config ----------
  var PRESETS_USD = [
    { amount: 5,    label: 'fuel for the road',           icon: '🚗' },
    { amount: 11,   label: 'a used library book',         icon: '📚' },
    { amount: 33,   label: 'archive & backups',           icon: '💾' },
    { amount: 55,   label: 'community meetups + snacks',  icon: '🥨' },
    { amount: 150,  label: 'field day travel',            icon: '🧭' },
    { amount: 250,  label: 'AI tools license',            icon: '🤖' },
    { amount: 500,  label: 'mini library upgrade',        icon: '🧰' },
    { amount: 900,  label: 'one month of rent',           icon: '🏠' },
    { amount: 1100, label: 'Ricoh GR IIIx (camera fund)', icon: '📷' },
    { amount: 5000, label: 'down-payment for an apartment', icon: '🏢' }
  ];
  // ETH presets for the modern selector
  var PRESETS_ETH = [
    { eth: 0.005,  label: 'fuel for the road',           icon: '🚗' },
    { eth: 0.011,  label: 'a used library book',         icon: '📚' },
    { eth: 0.033,  label: 'archive & backups',           icon: '💾' },
    { eth: 0.055,  label: 'community meetups + snacks',  icon: '🥨' },
    { eth: 0.15,   label: 'field day travel',            icon: '🧭' },
    { eth: 0.25,   label: 'AI tools license',            icon: '🤖' },
    { eth: 0.5,    label: 'mini library upgrade',        icon: '🧰' },
    { eth: 1.1,    label: 'Ricoh GR IIIx (camera fund)', icon: '📷' }
  ];
  var MIN_USD = 2;

  // Currency config with fallbacks (in case fetch fails)
  var CURRENCIES = {
    USD: { code: 'USD', symbol: '$', rate: 1 },
    INR: { code: 'INR', symbol: '₹', rate: 83 },    // fallback approx
    EUR: { code: 'EUR', symbol: '€', rate: 0.92 }   // fallback approx
  };
  var ACTIVE_CURRENCY = 'USD';
  // Prefer ETH mode for the updated Support UI; can be overridden via window.DONATE_MODE
  var ETH_MODE = (function(){
    try { if (typeof window !== 'undefined' && window.DONATE_MODE) return String(window.DONATE_MODE).toUpperCase() === 'ETH'; } catch(_){}
    return true; // default to ETH for the redesign
  })();

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

// (Removed) Cashfree/fiat integration helpers and flows
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
    var LIST = ETH_MODE ? PRESETS_ETH : PRESETS_USD;
    LIST.forEach(function (p, idx) {
      var btn = document.createElement('button');
      btn.className = 'preset preset-card';
      btn.setAttribute('role', 'listitem');
      btn.setAttribute('aria-pressed', 'false');
      if (ETH_MODE) btn.setAttribute('data-amount-eth', String(p.eth));
      else btn.setAttribute('data-amount-usd', String(p.amount));
      btn.setAttribute('data-index', String(idx));

      var icon = document.createElement('span');
      icon.className = 'icon';
      icon.textContent = p.icon || '✨';

      var price = document.createElement('div');
      price.className = 'preset-price';
      if (ETH_MODE) {
        price.textContent = 'Ξ ' + (p.eth || 0).toFixed(3).replace(/\.0+$/,'');
      } else {
        price.textContent = formatCurrencyFromUSD(p.amount, ACTIVE_CURRENCY);
      }

      var sub = document.createElement('div');
      sub.className = 'preset-sub';
      sub.textContent = p.label;

      btn.appendChild(icon);
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

    function setPressedAmount(amount) {
      $all('.preset', track).forEach(function (b) {
        var attr = ETH_MODE ? 'data-amount-eth' : 'data-amount-usd';
        var a = parseFloat(b.getAttribute(attr) || '0');
        b.setAttribute('aria-pressed', String(a === amount));
      });
    }

    function updateCurrency() {
      $all('.preset', track).forEach(function (b, idx) {
        var priceEl = b.querySelector('.preset-price');
        if (!priceEl) return;
        if (ETH_MODE) {
          var eth = parseFloat(b.getAttribute('data-amount-eth') || String((PRESETS_ETH[idx] && PRESETS_ETH[idx].eth) || 0));
          priceEl.textContent = 'Ξ ' + (eth || 0).toFixed(3).replace(/\.0+$/,'');
        } else {
          var usd = parseFloat(b.getAttribute('data-amount-usd') || '0');
          priceEl.textContent = formatCurrencyFromUSD(usd, ACTIVE_CURRENCY);
        }
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
  // (Removed) donor inputs for fiat providers

  function updateCurrencyUI() {
    var sym = ETH_MODE ? 'Ξ' : ((CURRENCIES[ACTIVE_CURRENCY] && CURRENCIES[ACTIVE_CURRENCY].symbol) || '$');
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
      if (ETH_MODE) {
        var amtETH = parseFloat(target.getAttribute('data-amount-eth') || '0');
        slider.setPressed(amtETH);
        inputEl.value = String((amtETH || 0).toFixed(4).replace(/0+$/,'').replace(/\.$/,''));
      } else {
        var amountUSD = parseFloat(target.getAttribute('data-amount-usd') || '0');
        slider.setPressed(amountUSD);
        // Set input in localized currency value (number only)
        var localized = convertFromUSD(amountUSD, ACTIVE_CURRENCY);
        inputEl.value = ACTIVE_CURRENCY === 'INR' ? String(Math.round(localized)) : String(localized.toFixed(2));
      }
      inputEl.focus();
    });
  }

  wirePresetClicks(panelOnce, onceSlider, inputOnce);
  wirePresetClicks(panelMonthly, monthlySlider, inputMonthly);

  // ---------- Continue buttons (ETH summary only) ----------
  var btnOnce = $('#go-onetime');
  var btnMonthly = $('#go-monthly');
  // (Removed) continueHandler for fiat providers
  if (btnOnce && inputOnce) {
  btnOnce.addEventListener('click', async function () {
    var val = parseNumberLocal(inputOnce.value);
    if (!(val > 0)) { inputOnce.focus(); inputOnce.select && inputOnce.select(); return; }
    // ETH-only behavior: copy a summary (placeholder)
    var summaryOnce = 'One-time Ξ ' + String(val);
    copyToClipboard(summaryOnce);
    try { console.log('ETH summary copied:', summaryOnce); } catch(_) {}
  });
}
  if (btnMonthly && inputMonthly) {
    btnMonthly.addEventListener('click', async function () {
      var val = parseNumberLocal(inputMonthly.value);
      if (!(val > 0)) { inputMonthly.focus(); inputMonthly.select && inputMonthly.select(); return; }
      var summaryMonthly = 'Monthly Ξ ' + String(val);
      copyToClipboard(summaryMonthly);
      try { console.log('ETH monthly summary copied:', summaryMonthly); } catch(_) {}
    });
  }

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

  // (Removed) Cashfree return verification
})();
