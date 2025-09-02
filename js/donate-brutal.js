/**
 * Donation Modules (Neobrutalist) — Tailwind-free interactions
 * - ETH: tabs + preset amount selection wired to #eth-amount (keeps existing integration)
 * - BTC: UI-only; preset selection wires to #btc-amount
 * - Keyboard: Arrow navigation across cards, Space/Enter to select
 * Accessibility: role=tablist/tab/tabpanels; aria-selected on tabs; aria-pressed on cards
 */

(function () {
  "use strict";

  // Utilities
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function formatAmount(n, decimals) {
    const num = Number(n);
    if (!isFinite(num) || num <= 0) return "";
    let s = num.toFixed(decimals);
    s = s.replace(/0+$/, "").replace(/\.$/, "");
    return s;
  }

  // Tabs
  function initTabs(prefix) {
    const tabOnce = document.getElementById(`${prefix}-tab-once`);
    const tabRecur = document.getElementById(`${prefix}-tab-recur`);
    const panelOnce = document.getElementById(`${prefix}-panel-once`);
    const panelRecur = document.getElementById(`${prefix}-panel-recur`);

    if (!tabOnce || !tabRecur || !panelOnce || !panelRecur) return;

    function activate(target) {
      const isOnce = target === tabOnce;
      tabOnce.classList.toggle("is-active", isOnce);
      tabRecur.classList.toggle("is-active", !isOnce);
      tabOnce.setAttribute("aria-selected", String(isOnce));
      tabRecur.setAttribute("aria-selected", String(!isOnce));
      panelOnce.hidden = !isOnce;
      panelRecur.hidden = isOnce;
    }

    tabOnce.addEventListener("click", () => activate(tabOnce));
    tabRecur.addEventListener("click", () => activate(tabRecur));

    // Keyboard support: arrow left/right switches tabs
    [tabOnce, tabRecur].forEach((tab) => {
      tab.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        e.preventDefault();
        activate(tab === tabOnce ? tabRecur : tabOnce);
        (tab === tabOnce ? tabRecur : tabOnce).focus();
      });
    });

    // Default active = once
    activate(tabOnce);
  }

  // Amount Cards
  function initAmounts(group, inputId, decimals) {
    const grid = document.querySelector(`.amount-grid[data-group="${group}"]`);
    const input = document.getElementById(inputId);
    if (!grid || !input) return;

    const cards = $$(".amount-card", grid);

    function clearSelection() {
      cards.forEach((c) => {
        c.classList.remove("is-selected");
        c.setAttribute("aria-pressed", "false");
      });
    }

    function selectCard(card) {
      clearSelection();
      card.classList.add("is-selected");
      card.setAttribute("aria-pressed", "true");
      const amt = Number(card.getAttribute("data-amount") || "0");
      input.value = formatAmount(amt, decimals);
      // Fire input event so any listeners can react
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }

    // Click selection
    cards.forEach((card, idx) => {
      card.setAttribute("tabindex", "0"); // focusable for keyboard users
      card.addEventListener("click", () => selectCard(card));

      // Keyboard navigation between cards
      card.addEventListener("keydown", (e) => {
        const code = e.key;
        if (code === " " || code === "Enter") {
          e.preventDefault();
          selectCard(card);
          return;
        }
        if (code === "ArrowLeft" || code === "ArrowUp") {
          e.preventDefault();
          const prev = cards[(idx - 1 + cards.length) % cards.length];
          prev.focus();
          return;
        }
        if (code === "ArrowRight" || code === "ArrowDown") {
          e.preventDefault();
          const next = cards[(idx + 1) % cards.length];
          next.focus();
          return;
        }
      });
    });

    // Typing a custom amount clears preset selection
    input.addEventListener("input", () => {
      clearSelection();
    });
  }

  // Public wrappers (requested names)
  function ethTabSwitch() {
    initTabs("eth");
  }
  function btcTabSwitch() {
    initTabs("btc");
  }
  function ethAmountSelect() {
    // ETH typically shows up to 4 decimals in the UI spec
    initAmounts("eth", "eth-amount", 4);
  }
  function btcAmountSelect() {
    // BTC small amounts — 4 decimals covers required presets
    initAmounts("btc", "btc-amount", 4);
  }

  // Initialize on DOM ready (defer script tag already ensures document parsed)
  ethTabSwitch();
  btcTabSwitch();
  ethAmountSelect();
  btcAmountSelect();

  // Optional: reflect chain + contract link if config is present
  try {
    const cfg = window.DONATE_CFG || null;
    const chainEl = document.getElementById("eth-chain");
    const linkEl = document.getElementById("eth-contract-link");
    if (cfg && chainEl) {
      const chainName = (cfg.chain || "ethereum").toString();
      chainEl.textContent = chainName.charAt(0).toUpperCase() + chainName.slice(1);
    }
    if (cfg && linkEl && cfg.contract) {
      const addr = String(cfg.contract);
      const short = addr.slice(0, 5) + "..." + addr.slice(-4);
      let href = "#";
      if ((cfg.chain || "").toLowerCase() === "sepolia") {
        href = `https://sepolia.etherscan.io/address/${addr}`;
      } else {
        href = `https://etherscan.io/address/${addr}`;
      }
      linkEl.href = href;
      linkEl.textContent = short;
    }
  } catch (_) {}

  // Expose in window for potential reuse/tests
  window.ethTabSwitch = ethTabSwitch;
  window.btcTabSwitch = btcTabSwitch;
  window.ethAmountSelect = ethAmountSelect;
  window.btcAmountSelect = btcAmountSelect;
})();