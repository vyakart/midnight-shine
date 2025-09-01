import { createPublicClient, http, createWalletClient, custom, parseEther, formatEther, getContract } from 'viem';
import { mainnet, sepolia } from 'viem/chains';

(function () {
  'use strict';

  // Config from window.DONATE_CFG
  const cfg = window.DONATE_CFG || {};
  const chain = cfg.chain || 'sepolia';
  const contractAddress = cfg.contract || '';
  // Initialize goal from localStorage override if present
  let goalEth = (function(){
    try {
      const v = localStorage.getItem('donate-goal');
      if (v && isFinite(parseFloat(v))) return parseFloat(v);
    } catch (_) {}
    return cfg.goalEth || 9;
  })();
  const deploymentBlock = cfg.deploymentBlock || 0;

  // Elements
  const ethAmountEl = document.getElementById('eth-amount');
  const ethDonateBtn = document.getElementById('eth-donate');
  const ethConnectBtn = document.getElementById('eth-connect');
  const ethChainEl = document.getElementById('eth-chain');
  const ethContractLink = document.getElementById('eth-contract-link');
  const ethProgressFill = document.getElementById('eth-progress-fill');
  const ethProgressText = document.getElementById('eth-progress-text');
  const leaderboardBody = document.getElementById('leaderboard-body');
  const ethStatus = document.getElementById('eth-status');
  const txLink = document.getElementById('tx-link');

  // Viem setup

  const chainObj = chain === 'mainnet' ? mainnet : sepolia;
  let publicClient;
  let contract;
  let usedFallback = false;

  function logError(prefix, err) {
    try {
      const msg = err && (err.message || err.toString());
      const stack = err && err.stack ? `\n${err.stack}` : '';
      console.error(prefix + (msg ? `: ${msg}` : ''), err);
      if (stack) console.error(stack);
    } catch (_) {
      // no-op
    }
  }

  let walletClient = null;
  let account = null;

  // Compute a smooth red→amber→green color for progress.
  // Returns a CSS color string. We keep it simple & widely-supported (HSL).
  function progressColor(percent) {
    const p = Math.max(0, Math.min(100, Number(percent) || 0));
    // Hue 0 (red) -> 120 (green)
    const hue = 120 * (p / 100);
    const sat = 85;   // vivid
    const light = 44; // balanced contrast on light/dark
    return `hsl(${hue.toFixed(1)}, ${sat}%, ${light}%)`;
  }

  // Contract ABI
  const abi = [
    { inputs: [{ internalType: "address", name: "_beneficiary", type: "address" }, { internalType: "uint256", name: "_hardCap", type: "uint256" }], stateMutability: "nonpayable", type: "constructor" },
    { inputs: [], name: "beneficiary", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
    { inputs: [], name: "hardCap", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
    { inputs: [], name: "totalReceived", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
    { inputs: [], name: "donate", outputs: [], stateMutability: "payable", type: "function" },
    { inputs: [], name: "withdraw", outputs: [], stateMutability: "nonpayable", type: "function" },
    { anonymous: false, inputs: [{ indexed: true, internalType: "address", name: "donor", type: "address" }, { indexed: false, internalType: "uint256", name: "amount", type: "uint256" }], name: "Donation", type: "event" },
    { stateMutability: "payable", type: "receive" }
  ];

  function initClients(useFallback = false) {
    const url = useFallback
      ? (chain === 'mainnet' ? 'https://cloudflare-eth.com' : 'https://rpc.sepolia.org')
      : `https://${chain}.infura.io/v3/${cfg.infuraKey}`;
    publicClient = createPublicClient({
      chain: chainObj,
      transport: http(url),
    });
    contract = getContract({
      address: contractAddress,
      abi,
      client: { public: publicClient },
    });
  }
  initClients(false);

  // Pre-resolve the Donation event from ABI for log filtering
  const donationEvent = abi.find((x) => x.type === 'event' && x.name === 'Donation');

  // Connect wallet
  async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      walletClient = createWalletClient({
        chain: chain === 'mainnet' ? mainnet : sepolia,
        transport: custom(window.ethereum),
      });
      const accounts = await walletClient.requestAddresses();
      account = accounts[0];
      ethConnectBtn.textContent = `${account.slice(0, 6)}...${account.slice(-4)}`;
      ethConnectBtn.disabled = true;
      updateChain();
      return account;
    } else {
      alert('MetaMask not found. Please install MetaMask.');
      return null;
    }
  }

  // Update chain display
  function updateChain() {
    ethChainEl.textContent = chain === 'mainnet' ? 'Ethereum' : 'Sepolia';
    ethContractLink.href = `https://${chain === 'mainnet' ? '' : 'sepolia.'}etherscan.io/address/${contractAddress}`;
    ethContractLink.textContent = `${contractAddress.slice(0, 6)}...${contractAddress.slice(-4)}`;
  }

  // Donate
  async function donate() {
    if (!walletClient || !account) {
      try { await connectWallet(); } catch (_) {}
      if (!walletClient || !account) {
        alert('Please connect your wallet first.');
        return;
      }
    }
    const amount = ethAmountEl.value.trim();
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    try {
      ethStatus.textContent = 'Sending transaction...';
      const hash = await walletClient.sendTransaction({
        account,
        to: contractAddress,
        value: parseEther(amount),
      });
      ethStatus.textContent = 'Transaction sent. Waiting for confirmation...';
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      if (receipt.status === 'success') {
        ethStatus.textContent = 'Donation successful!';
        txLink.innerHTML = `<a href="https://${chain === 'mainnet' ? '' : 'sepolia.'}etherscan.io/tx/${hash}" target="_blank">View transaction</a>`;
        updateProgress();
        fetchDonations();
      } else {
        ethStatus.textContent = 'Transaction failed.';
      }
    } catch (error) {
      console.error(error);
      ethStatus.textContent = 'Error: ' + error.message;
    }
  }

  // Update progress bar
  async function sumFromLogs() {
    const logs = await publicClient.getLogs({
      address: contractAddress,
      event: donationEvent,
      fromBlock: BigInt(deploymentBlock),
      toBlock: 'latest',
    });
    let totalEth = 0;
    logs.forEach(log => {
      totalEth += parseFloat(formatEther(log.args.amount));
    });
    return totalEth;
  }

  async function updateProgress() {
    try {
      const total = await contract.read.totalReceived();
      const received = parseFloat(formatEther(total));
      const percent = Math.min((received / goalEth) * 100, 100);
      ethProgressFill.style.width = `${percent}%`;
      // Color shift as we approach goal (red→green)
      ethProgressFill.style.background = progressColor(percent);
      ethProgressText.textContent = `${received.toFixed(4)} / ${goalEth} ETH received — ${percent.toFixed(1)}%`;
    } catch (error) {
      logError('Error updating progress (read.totalReceived)', error);

      // Try fallback RPC once
      if (!usedFallback) {
        usedFallback = true;
        try {
          initClients(true);
          const total = await contract.read.totalReceived();
          const received = parseFloat(formatEther(total));
          const percent = Math.min((received / goalEth) * 100, 100);
          ethProgressFill.style.width = `${percent}%`;
          ethProgressFill.style.background = progressColor(percent);
          ethProgressText.textContent = `${received.toFixed(4)} / ${goalEth} ETH received — ${percent.toFixed(1)}%`;
          return;
        } catch (error2) {
          logError('Fallback RPC failed (read.totalReceived)', error2);
        }
      }

      // Final fallback: derive from Donation logs
      try {
        const received = await sumFromLogs();
        const percent = Math.min((received / goalEth) * 100, 100);
        ethProgressFill.style.width = `${percent}%`;
        ethProgressFill.style.background = progressColor(percent);
        ethProgressText.textContent = `${received.toFixed(4)} / ${goalEth} ETH received — ${percent.toFixed(1)}%`;
      } catch (error3) {
        logError('Log-based progress fallback failed', error3);
      }
    }
  }

  // Fetch donations with cache
  async function fetchDonations() {
    const cacheKey = `donations-${chain}-${contractAddress}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < 5 * 60 * 1000) { // 5 min cache
        renderLeaderboard(data);
        return;
      }
    }

    try {
      const logs = await publicClient.getLogs({
        address: contractAddress,
        event: donationEvent,
        fromBlock: BigInt(deploymentBlock),
        toBlock: 'latest',
      });

      const donations = {};
      logs.forEach(log => {
        const donor = log.args.donor;
        const amount = parseFloat(formatEther(log.args.amount));
        donations[donor] = (donations[donor] || 0) + amount;
      });

      const data = Object.entries(donations).map(([address, amount]) => ({ address, amount })).sort((a, b) => b.amount - a.amount);
      localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
      renderLeaderboard(data);
    } catch (error) {
      logError('Error fetching donations', error);
      if (!usedFallback) {
        usedFallback = true;
        try {
          initClients(true);
          const logs = await publicClient.getLogs({
            address: contractAddress,
            event: donationEvent,
            fromBlock: BigInt(deploymentBlock),
            toBlock: 'latest',
          });

          const donations = {};
          logs.forEach(log => {
            const donor = log.args.donor;
            const amount = parseFloat(formatEther(log.args.amount));
            donations[donor] = (donations[donor] || 0) + amount;
          });

          const data = Object.entries(donations).map(([address, amount]) => ({ address, amount })).sort((a, b) => b.amount - a.amount);
          const cacheKey = `donations-${chain}-${contractAddress}`;
          localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
          renderLeaderboard(data);
        } catch (error2) {
          logError('Fallback RPC also failed (fetchDonations)', error2);
        }
      }
    }
  }

  // Render leaderboard
  function renderLeaderboard(donations) {
    leaderboardBody.innerHTML = '';
    donations.slice(0, 10).forEach((donation, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${donation.address.slice(0, 6)}...${donation.address.slice(-4)}</td>
        <td>${donation.amount.toFixed(4)}</td>
      `;
      leaderboardBody.appendChild(row);
    });
  }

  // Event listeners
  ethConnectBtn.addEventListener('click', connectWallet);
  ethDonateBtn.addEventListener('click', donate);

  // Init
  updateChain();
  updateProgress();
  fetchDonations();

  // Public API so UI controls can use the same source of truth
  function setDonateGoal(newGoal) {
    const g = parseFloat(newGoal);
    if (!isFinite(g) || g <= 0) return false;
    goalEth = g;
    try { localStorage.setItem('donate-goal', String(goalEth)); } catch(_){}
    updateProgress();
    return true;
  }

  try {
    window.DONATE_API = Object.freeze({
      get chain() { return chain; },
      get contract() { return contractAddress; },
      get goal() { return goalEth; },
      setGoal: setDonateGoal,
      connect: connectWallet,
      donate: donate,
      updateProgress: updateProgress,
    });
  } catch (_) {}
})();
