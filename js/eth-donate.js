import EthereumProvider from '@walletconnect/ethereum-provider';
import { WalletConnectModal } from '@walletconnect/modal';
import { parseEther } from 'viem';
import qrcode from 'qrcode-generator';

(function () {
  'use strict';

  // Configuration (provided from pages/donate.html)
  const cfg = (window.DONATE_CFG || {});
  let currentChain = String(cfg.chain || 'sepolia').toLowerCase(); // 'sepolia' | 'mainnet'
  const RECEIVER = String(cfg.receiver || '').trim();
  const WC_PROJECT_ID = String(cfg.wcProjectId || '').trim();
  const MIN_ETH = Number.isFinite(cfg.minEth) ? Number(cfg.minEth) : 0.001;

  // DOM elements
  const amountEl = document.getElementById('eth-amount');
  const donateBtn = document.getElementById('eth-donate');
  const connectBtn = document.getElementById('eth-connect');
  const openLinkA = document.getElementById('eth-open-link');
  const showQrBtn = document.getElementById('eth-show-qr');
  const copyAddrBtn = document.getElementById('eth-copy-address');
  const copyLinkBtn = document.getElementById('eth-copy-link');
  const toggleChainBtn = document.getElementById('eth-toggle-chain');

  const chainEl = document.getElementById('eth-chain');
  const receiverLinkEl = document.getElementById('eth-receiver-link');
  const statusEl = document.getElementById('eth-status');
  const txLink = document.getElementById('tx-link');

  // State
  let providerInjected = null; // window.ethereum (EIP-1193)
  let providerWC = null;       // WalletConnect Universal Provider
  let currentProvider = null;  // whichever is connected last
  let currentAccount = null;

  // Utilities
  function short(addr) {
    if (!addr) return '';
    const s = String(addr);
    return s.length > 12 ? s.slice(0, 6) + '...' + s.slice(-4) : s;
  }

  function chainInfo(name) {
    if ((name || '').toLowerCase() === 'mainnet') {
      return {
        key: 'mainnet',
        id: 1,
        name: 'Ethereum',
        hexId: '0x1',
        explorer: 'https://etherscan.io',
        addParams: {
          chainId: '0x1',
          chainName: 'Ethereum Mainnet',
          nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
          rpcUrls: ['https://cloudflare-eth.com'],
          blockExplorerUrls: ['https://etherscan.io']
        }
      };
    }
    // Default to Sepolia
    return {
      key: 'sepolia',
      id: 11155111,
      name: 'Sepolia',
      hexId: '0xaa36a7',
      explorer: 'https://sepolia.etherscan.io',
      addParams: {
        chainId: '0xaa36a7',
        chainName: 'Sepolia',
        nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://rpc.sepolia.org'],
        blockExplorerUrls: ['https://sepolia.etherscan.io']
      }
    };
  }

  function getExplorerUrl() {
    return chainInfo(currentChain).explorer;
  }

  function isValidAmount(v) {
    const n = Number(v);
    if (!Number.isFinite(n)) return false;
    if (n <= 0) return false;
    if (n < MIN_ETH) return false;
    return true;
  }

  function toHexWeiFromEthStr(ethStr) {
    const wei = parseEther(String(ethStr)); // BigInt
    return '0x' + wei.toString(16);
  }

  function buildEip681(amountEth) {
    try {
      const info = chainInfo(currentChain);
      const wei = parseEther(String(amountEth)).toString(); // decimal string in wei
      const receiver = RECEIVER;
      if (!/^0x[a-fA-F0-9]{40}$/.test(receiver)) {
        // ENS or invalid address - leave as-is; many wallets resolve ENS.
      }
      return `ethereum:${receiver}@${info.id}/transfer?value=${wei}`;
    } catch (_) {
      return '';
    }
  }

  function updateOpenLinkHref() {
    if (!openLinkA) return;
    const v = (amountEl && amountEl.value || '').trim();
    if (!isValidAmount(v)) {
      openLinkA.href = '#';
      openLinkA.setAttribute('aria-disabled', 'true');
      openLinkA.classList.add('is-disabled');
      return;
    }
    const link = buildEip681(v);
    if (link) {
      openLinkA.href = link;
      openLinkA.removeAttribute('aria-disabled');
      openLinkA.classList.remove('is-disabled');
    } else {
      openLinkA.href = '#';
      openLinkA.setAttribute('aria-disabled', 'true');
      openLinkA.classList.add('is-disabled');
    }
  }

  function setStatus(text) {
    try {
      if (statusEl) {
        statusEl.textContent = text || '';
      }
    } catch (_) {}
  }

  function setTxLink(hash) {
    if (!txLink) return;
    if (!hash) {
      txLink.innerHTML = '';
      return;
    }
    const base = getExplorerUrl();
    txLink.innerHTML = `<a href="${base}/tx/${hash}" target="_blank" rel="noopener noreferrer">View transaction</a>`;
  }

  function updateUiMeta() {
    const info = chainInfo(currentChain);

    // Chain label
    if (chainEl) {
      chainEl.textContent = info.name;
    }

    // Receiver explorer link
    if (receiverLinkEl && RECEIVER) {
      const shortAddr = short(RECEIVER);
      receiverLinkEl.href = `${info.explorer}/address/${RECEIVER}`;
      receiverLinkEl.textContent = shortAddr || RECEIVER;
    }

    // Toggle button label
    if (toggleChainBtn) {
      const to = info.key === 'sepolia' ? 'Mainnet' : 'Sepolia';
      toggleChainBtn.textContent = `Use ${to}`;
      toggleChainBtn.setAttribute('aria-pressed', info.key === 'mainnet' ? 'true' : 'false');
    }

    // Open link
    updateOpenLinkHref();
  }

  // Copy helpers
  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('Copied to clipboard.');
      setTimeout(() => setStatus(''), 1200);
    } catch (e) {
      setStatus('Copy failed');
    }
  }

  function onCopyAddress() {
    if (RECEIVER) copy(RECEIVER);
  }
  function onCopyLink() {
    const v = (amountEl && amountEl.value || '').trim();
    if (!isValidAmount(v)) { setStatus(`Enter at least ${MIN_ETH} ETH`); return; }
    const link = buildEip681(v);
    if (link) copy(link);
  }

  // QR modal
  function showQr() {
    const v = (amountEl && amountEl.value || '').trim();
    if (!isValidAmount(v)) { setStatus(`Enter at least ${MIN_ETH} ETH`); return; }
    const link = buildEip681(v);
    if (!link) return;

    // Build modal
    const overlay = document.createElement('div');
    overlay.style.cssText = [
      'position:fixed','inset:0','background:rgba(0,0,0,.5)','display:flex',
      'align-items:center','justify-content:center','z-index:9999','padding:16px'
    ].join(';');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Scan QR to donate');

    const panel = document.createElement('div');
    panel.style.cssText = [
      'background:#fff','color:#000','border:4px solid #000','border-radius:16px',
      'padding:16px','max-width:360px','width:100%','box-shadow:6px 6px 0 #000',
      'text-align:center'
    ].join(';');

    const title = document.createElement('div');
    title.style.cssText = 'font-weight:900; text-transform:uppercase; margin-bottom:8px;';
    title.textContent = 'Scan to Donate';

    const qrWrap = document.createElement('div');
    qrWrap.id = 'qr-wrap';
    qrWrap.style.cssText = 'display:flex;align-items:center;justify-content:center;margin:8px 0;';

    // Generate QR SVG
    const q = qrcode(0, 'M');
    q.addData(link);
    q.make();
    qrWrap.innerHTML = q.createSvgTag({ scalable: true });

    const linkP = document.createElement('p');
    linkP.style.cssText = 'font-size:12px;word-break:break-all;margin:6px 0;color:#333;';
    linkP.textContent = link;

    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:10px;justify-content:center;margin-top:10px;';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.textContent = 'Close';
    Object.assign(closeBtn.style, {
      border: '4px solid #000',
      borderRadius: '12px',
      background: '#fff',
      padding: '10px 14px',
      fontWeight: '900',
      textTransform: 'uppercase',
      cursor: 'pointer',
      boxShadow: '6px 6px 0 #000'
    });
    closeBtn.addEventListener('click', () => {
      try { document.body.removeChild(overlay); } catch(_) {}
    });

    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.textContent = 'Copy Link';
    Object.assign(copyBtn.style, closeBtn.style);
    copyBtn.addEventListener('click', () => copy(link));

    btnRow.appendChild(copyBtn);
    btnRow.appendChild(closeBtn);

    panel.appendChild(title);
    panel.appendChild(qrWrap);
    panel.appendChild(linkP);
    panel.appendChild(btnRow);

    overlay.appendChild(panel);
    document.body.appendChild(overlay);
  }

  // Provider connections
  async function connectInjected() {
    if (!window.ethereum || !window.ethereum.request) return null;
    try {
      providerInjected = window.ethereum;
      const accounts = await providerInjected.request({ method: 'eth_requestAccounts' });
      currentProvider = providerInjected;
      currentAccount = accounts && accounts[0] || null;
      if (connectBtn && currentAccount) {
        connectBtn.textContent = short(currentAccount);
        connectBtn.disabled = true;
      }
      bindProviderEvents(providerInjected);
      return currentAccount;
    } catch (err) {
      setStatus('Connection rejected');
      return null;
    }
  }

  async function connectWalletConnect() {
    if (!WC_PROJECT_ID) {
      setStatus('WalletConnect Project ID missing');
      return null;
    }
    try {
      const info = chainInfo(currentChain);
      if (!providerWC) {
        providerWC = await EthereumProvider.init({
          projectId: WC_PROJECT_ID,
          chains: [info.id],
          showQrModal: true,
          methods: [
            'eth_sendTransaction',
            'eth_requestAccounts',
            'wallet_switchEthereumChain',
            'wallet_addEthereumChain',
            'personal_sign',
            'eth_sign',
            'eth_signTypedData',
            'eth_signTypedData_v4'
          ],
          events: ['chainChanged','accountsChanged','disconnect'],
          qrModalOptions: { themeMode: 'light' }
        });
        bindProviderEvents(providerWC);
      }
      const accounts = await providerWC.enable();
      currentProvider = providerWC;
      currentAccount = accounts && accounts[0] || null;
      if (connectBtn && currentAccount) {
        connectBtn.textContent = short(currentAccount);
        connectBtn.disabled = true;
      }
      // Optional: set default chain for WC if available
      if (providerWC.setDefaultChain) {
        try { await providerWC.setDefaultChain(info.id); } catch(_) {}
      }
      return currentAccount;
    } catch (err) {
      setStatus('WalletConnect canceled');
      return null;
    }
  }

  function bindProviderEvents(p) {
    if (!p || !p.on) return;
    try {
      p.on('accountsChanged', (accs) => {
        const a = accs && accs[0] || null;
        currentAccount = a;
        if (connectBtn && a) {
          connectBtn.textContent = short(a);
          connectBtn.disabled = true;
        } else if (connectBtn) {
          connectBtn.textContent = 'Connect Wallet';
          connectBtn.disabled = false;
        }
      });
    } catch (_) {}
    try {
      p.on('chainChanged', (cid) => {
        // cid can be hex string like '0x1' or number
        const normalized = typeof cid === 'string' ? cid.toLowerCase() : cid;
        if (normalized === '0x1' || normalized === 1) currentChain = 'mainnet';
        if (normalized === '0xaa36a7' || normalized === 11155111) currentChain = 'sepolia';
        updateUiMeta();
      });
    } catch (_) {}
    try {
      p.on('disconnect', () => {
        currentProvider = null;
        currentAccount = null;
        if (connectBtn) { connectBtn.textContent = 'Connect Wallet'; connectBtn.disabled = false; }
      });
    } catch (_) {}
  }

  async function ensureChain(provider) {
    if (!provider) return false;
    const info = chainInfo(currentChain);
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: info.hexId }]
      });
      return true;
    } catch (err) {
      // Add chain if not found (4902)
      const code = (err && (err.code || err.data)) || 0;
      if (code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [info.addParams]
          });
          return true;
        } catch (err2) {
          setStatus('Unable to add chain');
          return false;
        }
      }
      setStatus('Wrong chain');
      return false;
    }
  }

  async function switchChain(toKey) {
    currentChain = (toKey || '').toLowerCase() === 'mainnet' ? 'mainnet' : 'sepolia';
    updateUiMeta();
    // Try to switch connected provider (non-blocking UX)
    if (currentProvider) {
      try { await ensureChain(currentProvider); } catch(_) {}
      if (providerWC && providerWC.setDefaultChain) {
        try { await providerWC.setDefaultChain(chainInfo(currentChain).id); } catch(_) {}
      }
    }
    return chainInfo(currentChain).id;
  }

  async function connectUnified() {
    // Prefer injected
    const a = await connectInjected();
    if (a) return a;
    // Fallback to WalletConnect
    return await connectWalletConnect();
  }

  async function sendDonation() {
    const v = (amountEl && amountEl.value || '').trim();
    if (!isValidAmount(v)) {
      setStatus(`Enter at least ${MIN_ETH} ETH`);
      return;
    }

    // Ensure connected
    if (!currentProvider || !currentAccount) {
      setStatus('Connecting wallet...');
      const acct = await connectUnified();
      if (!acct) {
        setStatus('Please connect your wallet');
        return;
      }
    }

    // Ensure on correct chain
    setStatus('Checking network...');
    const ok = await ensureChain(currentProvider);
    if (!ok) return;

    // Build transaction
    const valueHex = toHexWeiFromEthStr(v);
    const tx = {
      from: currentAccount,
      to: RECEIVER,
      value: valueHex
    };

    try {
      setStatus('Sending transaction...');
      const hash = await currentProvider.request({
        method: 'eth_sendTransaction',
        params: [tx]
      });
      setStatus('Transaction sent. Waiting for confirmation...');
      setTxLink(hash);
      // We will not poll for receipt here to keep it simple; explorer link provided.
      setStatus('Donation submitted! Open explorer to track status.');
    } catch (err) {
      const msg = (err && (err.message || String(err))) || 'Transaction failed';
      setStatus(msg);
    }
  }

  // Events
  if (amountEl) {
    amountEl.addEventListener('input', function () {
      // Sanitize to a decimal string
      const s = this.value.replace(/[^0-9.]/g, '');
      if (s !== this.value) this.value = s;
      updateOpenLinkHref();
      if (donateBtn) donateBtn.disabled = !isValidAmount(this.value);
    });
  }
  if (donateBtn) donateBtn.addEventListener('click', sendDonation);
  if (connectBtn) connectBtn.addEventListener('click', connectUnified);
  if (openLinkA) openLinkA.addEventListener('click', function (e) {
    // Prevent if invalid
    const v = (amountEl && amountEl.value || '').trim();
    if (!isValidAmount(v)) {
      e.preventDefault();
      setStatus(`Enter at least ${MIN_ETH} ETH`);
    }
  });
  if (showQrBtn) showQrBtn.addEventListener('click', showQr);
  if (copyAddrBtn) copyAddrBtn.addEventListener('click', onCopyAddress);
  if (copyLinkBtn) copyLinkBtn.addEventListener('click', onCopyLink);
  if (toggleChainBtn) {
    toggleChainBtn.addEventListener('click', async function () {
      const next = currentChain === 'sepolia' ? 'mainnet' : 'sepolia';
      await switchChain(next);
    });
  }

  // Init
  try {
    updateUiMeta();
    if (donateBtn && amountEl) donateBtn.disabled = !isValidAmount(amountEl.value);
  } catch (_) {}

  // Public API for header bridge and external hooks
  try {
    window.DONATE_API = Object.freeze({
      get receiver() { return RECEIVER; },
      get chain() { return currentChain; },
      get minEth() { return MIN_ETH; },
      connect: connectUnified,
      connectInjected,
      connectWalletConnect,
      ensureChain,
      sendDonation,
      buildEip681: (amt) => buildEip681(amt),
      getExplorerUrl
    });
  } catch (_) {}
})();
