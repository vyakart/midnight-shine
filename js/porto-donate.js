import { Porto, Chains } from 'porto'
import { parseEther } from 'viem'

(function () {
  'use strict'

  const cfg = (window.PORTO_DONATE ?? {})
  const RECEIVER = String(cfg.receiver || '0x934c86f8eef94887FddF079A71743920e74201AF')
  const DEFAULT_CHAIN = (cfg.defaultChain || 'mainnet').toLowerCase()
  const MIN_ETH = typeof cfg.minEth === 'number' && cfg.minEth >= 0 ? cfg.minEth : 0.001

  const CHAIN_META = {
    mainnet: {
      porto: Chains.mainnet,
      id: Chains.mainnet.id,
      hexId: `0x${Chains.mainnet.id.toString(16)}`,
      label: 'Ethereum',
      addParams: {
        chainId: '0x1',
        chainName: 'Ethereum Mainnet',
        nativeCurrency: Chains.mainnet.nativeCurrency,
        rpcUrls: ['https://cloudflare-eth.com'],
        blockExplorerUrls: ['https://etherscan.io']
      },
      explorerTx: 'https://etherscan.io/tx/',
      explorerAddress: 'https://etherscan.io/address/'
    },
    sepolia: {
      porto: Chains.sepolia,
      id: Chains.sepolia.id,
      hexId: `0x${Chains.sepolia.id.toString(16)}`,
      label: 'Sepolia',
      addParams: {
        chainId: '0xaa36a7',
        chainName: 'Sepolia',
        nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://rpc.sepolia.org'],
        blockExplorerUrls: ['https://sepolia.etherscan.io']
      },
      explorerTx: 'https://sepolia.etherscan.io/tx/',
      explorerAddress: 'https://sepolia.etherscan.io/address/'
    }
  }

  const supportedChainKeys = Object.keys(CHAIN_META)
  const initialChainKey = supportedChainKeys.includes(DEFAULT_CHAIN) ? DEFAULT_CHAIN : 'mainnet'

  const porto = Porto.create({
    chains: supportedChainKeys.map((key) => CHAIN_META[key].porto)
  })

  const provider = porto.provider

  const connectBtn = document.getElementById('porto-connect')
  const sendBtn = document.getElementById('porto-send')
  const amountInput = document.getElementById('porto-amount')
  const networkRadios = Array.prototype.slice.call(document.querySelectorAll('input[name="porto-network"]'))
  const statusEl = document.getElementById('porto-status')
  const receiptEl = document.getElementById('porto-receipt')
  const txLinkEl = document.getElementById('porto-tx-link')
  const accountEl = document.getElementById('porto-account')
  const accountLabelEl = accountEl ? accountEl.querySelector('.porto-account-label') : null
  const networkLabelEl = document.getElementById('porto-network-label')
  const headerBtn = document.getElementById('header-connect')

  if (!connectBtn || !sendBtn || !amountInput || !networkRadios.length) {
    console.warn('[porto-donate] Required DOM nodes missing; aborting initialisation.')
    return
  }

  let currentChainKey = initialChainKey
  let currentAccount = null
  let connecting = false
  let sending = false

  function short(addr) {
    if (!addr) return ''
    const s = String(addr)
    return s.length <= 12 ? s : `${s.slice(0, 6)}…${s.slice(-4)}`
  }

  function setStatus(message, tone = 'info') {
    if (!statusEl) return
    statusEl.textContent = message || ''
    statusEl.dataset.tone = message ? tone : ''
  }

  function showReceipt(hash, chainKey) {
    if (!receiptEl) return
    if (hash) {
      const meta = CHAIN_META[chainKey] || CHAIN_META[currentChainKey]
      receiptEl.hidden = false
      if (txLinkEl) {
        txLinkEl.href = `${meta.explorerTx}${hash}`
        txLinkEl.textContent = 'View on explorer'
      }
    } else {
      receiptEl.hidden = true
      if (txLinkEl) txLinkEl.removeAttribute('href')
    }
  }

  function updateAccountUI() {
    if (accountEl) {
      accountEl.dataset.state = currentAccount ? 'connected' : 'disconnected'
    }
    if (accountLabelEl) {
      if (currentAccount) {
        accountLabelEl.textContent = `Connected: ${short(currentAccount)}`
        accountLabelEl.title = currentAccount
      } else {
        accountLabelEl.textContent = 'Not connected'
        accountLabelEl.removeAttribute('title')
      }
    }
    if (headerBtn) {
      if (currentAccount) {
        headerBtn.classList.add('is-connected')
        headerBtn.disabled = true
        headerBtn.setAttribute('aria-label', `Connected: ${short(currentAccount)}`)
        headerBtn.setAttribute('title', currentAccount)
      } else {
        headerBtn.classList.remove('is-connected')
        headerBtn.disabled = false
        headerBtn.setAttribute('aria-label', 'Connect Porto')
        headerBtn.setAttribute('title', 'Connect Porto')
      }
    }
  }

  function updateNetworkLabel() {
    if (!networkLabelEl) return
    const meta = CHAIN_META[currentChainKey]
    networkLabelEl.textContent = `Active network: ${meta ? meta.label : currentChainKey}`
  }

  function selectNetworkRadio(chainKey) {
    networkRadios.forEach((radio) => {
      const value = String(radio.value || '').toLowerCase()
      radio.checked = value === chainKey
    })
  }

  function matchChainKey(chainIdLike) {
    if (!chainIdLike) return null
    const normalized = String(chainIdLike).trim().toLowerCase()
    return supportedChainKeys.find((key) => {
      const meta = CHAIN_META[key]
      return meta && (meta.hexId.toLowerCase() === normalized || String(meta.id) === normalized)
    }) || null
  }

  function orderedChainIds(preferredKey) {
    const keys = supportedChainKeys.slice()
    const idx = keys.indexOf(preferredKey)
    if (idx > 0) {
      keys.splice(idx, 1)
      keys.unshift(preferredKey)
    }
    return keys
      .map((key) => CHAIN_META[key])
      .filter(Boolean)
      .map((meta) => meta.id)
  }

  function amountFromInput() {
    const raw = String(amountInput.value || '').trim()
    const value = raw ? Number.parseFloat(raw) : 0
    return Number.isFinite(value) ? value : 0
  }

  function amountIsValid() {
    const value = amountFromInput()
    return value >= MIN_ETH
  }

  function updateSendAvailability() {
    const disabled = sending || !currentAccount || !amountIsValid()
    sendBtn.disabled = disabled
    if (sending) {
      sendBtn.textContent = 'Sending…'
    } else {
      sendBtn.textContent = 'Send support'
    }
  }

  function markConnecting(state) {
    connecting = state
    connectBtn.disabled = state
    if (state) {
      connectBtn.textContent = 'Opening Porto…'
    } else {
      connectBtn.textContent = currentAccount ? 'Connected to Porto' : 'Connect Porto'
      connectBtn.disabled = !!currentAccount
    }
  }

  function sanitizeAddress(addr) {
    if (!addr) return null
    const value = String(addr)
    return /^0x[a-fA-F0-9]{40}$/.test(value) ? value : null
  }

  async function ensureChain(chainKey) {
    const meta = CHAIN_META[chainKey]
    if (!meta) return
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: meta.hexId }]
      })
    } catch (err) {
      const code = err && typeof err === 'object' ? err.code : undefined
      if (code === 4902 || code === '4902') {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [meta.addParams]
        })
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: meta.hexId }]
        })
      } else {
        throw err
      }
    }
  }

  async function connect() {
    if (connecting) return
    markConnecting(true)
    setStatus('Opening Porto…', 'info')
    try {
      const response = await provider.request({
        method: 'wallet_connect',
        params: [
          {
            chainIds: orderedChainIds(currentChainKey),
          }
        ]
      })
      const accounts = Array.isArray(response?.accounts) ? response.accounts : []
      const primaryAccount = accounts.length ? accounts[0] : null
      const primary = primaryAccount
        ? sanitizeAddress(typeof primaryAccount === 'string' ? primaryAccount : primaryAccount.address)
        : null
      if (!primary) {
        setStatus('Porto connection cancelled.', 'warn')
        return
      }
      currentAccount = primary
      const connectedChainHex = Array.isArray(response?.chainIds) && response.chainIds.length
        ? String(response.chainIds[0])
        : null
      const matchedChain = matchChainKey(connectedChainHex)
      if (matchedChain) {
        currentChainKey = matchedChain
        selectNetworkRadio(currentChainKey)
      }
      await ensureChain(currentChainKey)
      updateNetworkLabel()
      setStatus('Connected. Choose an amount to continue.', 'success')
      showReceipt(null)
    } catch (err) {
      console.error('[porto-donate] connect error', err)
      const message = err && err.code === 4001 ? 'Request rejected.' : 'Could not connect to Porto.'
      setStatus(message, 'error')
    } finally {
      markConnecting(false)
      updateAccountUI()
      updateSendAvailability()
    }
  }

  async function sendSupport() {
    if (sending || !currentAccount) {
      if (!currentAccount) connect()
      return
    }
    if (!amountIsValid()) {
      setStatus(`Please enter at least ${MIN_ETH} ETH.`, 'warn')
      return
    }

    const meta = CHAIN_META[currentChainKey]
    const amount = amountFromInput()
    const hexValue = (() => {
      try {
        return `0x${parseEther(amount.toString()).toString(16)}`
      } catch (err) {
        return null
      }
    })()

    if (!hexValue) {
      setStatus('Could not parse the amount. Try a smaller precision.', 'error')
      return
    }

    sending = true
    updateSendAvailability()
    setStatus('Awaiting approval in Porto…', 'info')
    showReceipt(null)

    try {
      await ensureChain(currentChainKey)
      const hash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: currentAccount,
          to: RECEIVER,
          value: hexValue,
          chainId: meta.hexId
        }]
      })
      if (typeof hash === 'string' && hash.trim()) {
        const trimmed = hash.trim()
        setStatus('Support sent — thank you!', 'success')
        showReceipt(trimmed, currentChainKey)
      } else {
        setStatus('Support submitted.', 'success')
        showReceipt(null)
      }
      amountInput.value = ''
    } catch (err) {
      console.error('[porto-donate] transaction error', err)
      if (err && err.code === 4001) {
        setStatus('You rejected the request.', 'warn')
      } else {
        setStatus('Something went wrong while sending support.', 'error')
      }
    } finally {
      sending = false
      updateSendAvailability()
    }
  }

  function handleAccountsChanged(accounts) {
    const primary = Array.isArray(accounts) && accounts.length ? sanitizeAddress(accounts[0]) : null
    currentAccount = primary
    if (!primary) {
      showReceipt(null)
      setStatus('Disconnected.', 'info')
    }
    updateAccountUI()
    updateSendAvailability()
  }

  function handleChainChanged(chainIdHex) {
    const normalized = String(chainIdHex || '').toLowerCase()
    const match = supportedChainKeys.find((key) => CHAIN_META[key].hexId.toLowerCase() === normalized)
    if (match) {
      currentChainKey = match
      selectNetworkRadio(match)
      updateNetworkLabel()
      if (!sending) setStatus(`Now on ${CHAIN_META[match].label}.`, 'info')
    }
    updateSendAvailability()
  }

  // Event wiring
  connectBtn.addEventListener('click', connect)
  sendBtn.addEventListener('click', sendSupport)
  amountInput.addEventListener('input', () => {
    setStatus('', 'info')
    updateSendAvailability()
  })

  networkRadios.forEach((radio) => {
    radio.addEventListener('change', async (event) => {
      if (!event.target.checked) return
      const value = String(event.target.value || '').toLowerCase()
      if (!CHAIN_META[value]) return
      currentChainKey = value
      selectNetworkRadio(currentChainKey)
      updateNetworkLabel()
      if (currentAccount) {
        setStatus(`Switching to ${CHAIN_META[value].label}…`, 'info')
        try {
          await ensureChain(value)
          setStatus(`Ready on ${CHAIN_META[value].label}.`, 'success')
        } catch (err) {
          console.error('[porto-donate] switch error', err)
          setStatus('Could not switch networks.', 'error')
        }
      }
    })
  })

  if (headerBtn) {
    headerBtn.addEventListener('click', (event) => {
      event.preventDefault()
      if (!currentAccount) connect()
    })
  }

  if (typeof provider.on === 'function') {
    provider.on('accountsChanged', handleAccountsChanged)
    provider.on('disconnect', () => handleAccountsChanged([]))
    provider.on('chainChanged', handleChainChanged)
  }

  selectNetworkRadio(currentChainKey)
  updateAccountUI()
  updateNetworkLabel()
  updateSendAvailability()

  window.PORTO_API = {
    connect,
    send: sendSupport,
    get account() {
      return currentAccount
    },
    get chain() {
      return currentChainKey
    }
  }
})()
