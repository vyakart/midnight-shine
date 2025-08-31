/**
 * donate.js
 * v2.1 — Complete donation system with Cashfree integration
 * - Frequency tabs (one-time / monthly) with full payment processing
 * - Horizontal preset slider with customizable amounts
 * - Live currency switching (USD, INR, EUR) with exchangerate.host API
 * - Donor information collection (phone required, email optional)
 * - Share module (Web Share API + clipboard fallback)
 * - Crypto wallet copy functionality with accessibility announcements
 * - Complete Cashfree payment integration for both donation types
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

// ---------- Cashfree integration helpers ----------
  async function cfCreateOrder(amountInRupees, donor) {
    var res = await fetch('/.netlify/functions/cf-create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: amountInRupees,        // rupees (Cashfree expects decimal rupees)
        currency: 'INR',
        donor: donor || {},
        notes: { page: 'donate' }
      })
    });
    if (!res.ok) {
      var txt = '';
      try { txt = await res.text(); } catch (_) {}
      throw new Error('cf-create-order failed (' + res.status + '): ' + txt);
    }
    return res.json(); // { mode, order_id, payment_session_id, order }
  }

  async function cfVerifyOrder(orderId) {
    var res = await fetch('/.netlify/functions/cf-verify-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId })
    });
    if (!res.ok) {
      var txt = '';
      try { txt = await res.text(); } catch (_) {}
      throw new Error('cf-verify-order failed: ' + txt);
    }
    return res.json(); // { verified, status, amount, currency, order }
  }

  function toInrAmountFromActiveCurrency(value) {
    var v = Number(value);
    if (!isFinite(v) || v <= 0) return 0;
    if (ACTIVE_CURRENCY === 'INR') {
      return Math.round(v * 100) / 100;
    }
    // Convert selected currency -> USD -> INR using current rates
    var rateSel = (CURRENCIES[ACTIVE_CURRENCY] && CURRENCIES[ACTIVE_CURRENCY].rate) || 1;
    var rateINR = (CURRENCIES.INR && CURRENCIES.INR.rate) || 83;
    var asUSD = ACTIVE_CURRENCY === 'USD' ? v : (v / rateSel);
    var inr = asUSD * rateINR;
    return Math.round(inr * 100) / 100;
  }
// Dynamically ensure Cashfree UI SDK is available
function loadScript(src) {
  return new Promise(function (resolve, reject) {
    try {
      var s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error('Failed to load ' + src)); };
      (document.head || document.documentElement).appendChild(s);
    } catch (e) {
      reject(e);
    }
  });
}

async function ensureCashfree(mode) {
  if (typeof window === 'undefined') throw new Error('Browser environment required');
  // If already available and has checkout(), use it
  if (window.cashfree && typeof window.cashfree.checkout === 'function') return window.cashfree;

  // Always load core first
  if (!window.cashfree && !window.Cashfree) {
    await loadScript('https://sdk.cashfree.com/js/ui/2.0.0/cashfree.js');
  }

  // Then load environment-specific bundle
  var isProd = String(mode || '').toLowerCase() === 'production';
  var envUrl = isProd
    ? 'https://sdk.cashfree.com/js/ui/2.0.0/cashfree.prod.js'
    : 'https://sdk.cashfree.com/js/ui/2.0.0/cashfree.sandbox.js';
  await loadScript(envUrl);

  // Prefer official loader if present
  var cf = null;
  if (window.Cashfree && typeof window.Cashfree.load === 'function') {
    try { cf = await window.Cashfree.load({ mode: isProd ? 'production' : 'sandbox' }); } catch (_) {}
  }
  if (!cf) cf = window.cashfree || window.Cashfree || null;

  if (!cf || typeof cf.checkout !== 'function') {
    throw new Error('Cashfree SDK failed to expose checkout()');
  }
  return cf;
}

  async function openCashfreeCheckout(inrAmount, donor) {
    if (typeof window === 'undefined') {
      throw new Error('Browser environment required');
    }

    var order = await cfCreateOrder(inrAmount, donor);
    var mode = (order && order.mode) || 'sandbox';
    var sessionId = order && order.payment_session_id;
    var orderId = order && order.order_id;
    if (!sessionId || !orderId) throw new Error('Invalid order response');

    try { console.debug('cf order', { mode: mode, sessionId: sessionId, orderId: orderId }); } catch (_) {}
    await ensureCashfree(mode);
 
    // Resolve the correct Cashfree object across SDK variants
    var cashfree = null;
    if (window.Cashfree && typeof window.Cashfree.load === 'function') {
      // Official v2 usage: await Cashfree.load({ mode })
      try { cashfree = await window.Cashfree.load({ mode: mode }); } catch (_) {}
    }
    if (!cashfree && window.cashfree && typeof window.cashfree.checkout === 'function') {
      cashfree = window.cashfree;
    }
    if (!cashfree && window.Cashfree && typeof window.Cashfree.checkout === 'function') {
      cashfree = window.Cashfree;
    }
    if (!cashfree || typeof cashfree.checkout !== 'function') {
      throw new Error('Cashfree checkout() API not available');
    }
 
    // Open Checkout; prefer hard redirect to top window
    try {
      var origin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : '';
      await cashfree.checkout({
        paymentSessionId: sessionId,
        redirectTarget: 'top',
        returnUrl: origin + '/pages/donate?order={order_id}'
      });
    } catch (err) {
      try { console.error('cashfree.checkout error', err); } catch (_) {}
      throw new Error('cashfree.checkout: ' + (err && (err.message || err.reason || JSON.stringify(err)) || 'unknown'));
    }

    // After checkout, verify status server-side
    try {
      var verify = await cfVerifyOrder(orderId);
      if (verify && verify.verified) {
        alert('Thank you! Your donation was successful.');
      } else {
        alert('Payment not verified yet. If debited, it may reflect shortly.');
      }
    } catch (e) {
      try { console.error(e); } catch (_) {}
      alert('Could not verify payment. If you completed payment, it may reflect soon.');
    }
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
  // Donor inputs (one-time)
  var phoneOnce = $('#phone-onetime');
  var emailOnce = $('#email-onetime');
  // Donor inputs (monthly)
  var phoneMonthly = $('#phone-monthly');
  var emailMonthly = $('#email-monthly');

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

  // ---------- Continue buttons (Cashfree integration) ----------
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
  if (btnOnce && inputOnce) {
  btnOnce.addEventListener('click', async function () {
    var val = parseNumberLocal(inputOnce.value);
    if (!(val > 0)) { inputOnce.focus(); inputOnce.select && inputOnce.select(); return; }

    // Convert active currency to INR (Cashfree expects INR rupees)
    var inrAmount = toInrAmountFromActiveCurrency(val);

    // Collect donor details (phone required by provider)
    var rawPhone = (phoneOnce && phoneOnce.value) || '';
    var phoneDigits = String(rawPhone).replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 14) {
      if (phoneOnce) { phoneOnce.focus(); phoneOnce.select && phoneOnce.select(); }
      alert('Please enter a valid phone number (10–14 digits).');
      return;
    }
    var emailVal = (emailOnce && emailOnce.value.trim()) || '';
    var donor = { email: emailVal, phone: phoneDigits };

    try {
      await openCashfreeCheckout(inrAmount, donor);
    } catch (e) {
      try { console.error('start payment error', e); } catch (_) {}
      var msg = (e && (e.message || e.reason)) || String(e) || 'unknown error';
      alert('Unable to start payment: ' + msg);
    }
  });
}
  if (btnMonthly && inputMonthly) {
    btnMonthly.addEventListener('click', async function () {
      var val = parseNumberLocal(inputMonthly.value);
      if (!(val > 0)) { inputMonthly.focus(); inputMonthly.select && inputMonthly.select(); return; }

      // Convert active currency to INR (Cashfree expects INR rupees)
      var inrAmount = toInrAmountFromActiveCurrency(val);

      // Collect donor details (phone required by provider)
      var rawPhone = (phoneMonthly && phoneMonthly.value) || '';
      var phoneDigits = String(rawPhone).replace(/\D/g, '');
      if (phoneDigits.length < 10 || phoneDigits.length > 14) {
        if (phoneMonthly) { phoneMonthly.focus(); phoneMonthly.select && phoneMonthly.select(); }
        alert('Please enter a valid phone number (10–14 digits).');
        return;
      }
      var emailVal = (emailMonthly && emailMonthly.value.trim()) || '';
      var donor = { email: emailVal, phone: phoneDigits };

      try {
        await openCashfreeCheckout(inrAmount, donor);
      } catch (e) {
        try { console.error('monthly payment error', e); } catch (_) {}
        var msg = (e && (e.message || e.reason)) || String(e) || 'unknown error';
        alert('Unable to start monthly payment: ' + msg);
      }
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

  // Verify order if arriving back from Cashfree (?order={order_id})
  try {
    var params = new URLSearchParams((typeof window !== 'undefined' && window.location && window.location.search) ? window.location.search : '');
    var returnedOrderId = params.get('order');
    if (returnedOrderId) {
      cfVerifyOrder(returnedOrderId)
        .then(function (res) {
          if (res && res.verified) {
            alert('Thank you! Your donation was successful.');
          } else {
            var status = (res && res.status) ? String(res.status) : 'pending';
            alert('Payment status: ' + status + '. If debited, it may reflect shortly.');
          }
        })
        .catch(function (e) {
          try { console.error('verify-on-return error', e); } catch (_){}
          alert('Could not verify payment right now. If you completed payment, it may reflect soon.');
        })
        .finally(function () {
          // Clean the URL by removing the order param
          try {
            var url = new URL(window.location.href);
            url.searchParams.delete('order');
            window.history.replaceState({}, document.title, url.pathname + (url.search ? url.search : '') + (url.hash || ''));
          } catch (_){}
        });
    }
  } catch (_){}
})();