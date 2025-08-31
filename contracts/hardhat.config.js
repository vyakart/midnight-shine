require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");
const path = require("path");

const { INFURA_API_KEY, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

// Normalize PRIVATE_KEY into a valid 32-byte hex (0x-prefixed) or ignore if invalid.
// This prevents HH8 "private key too short" during tasks like compile.
function getAccountsFromEnv() {
  if (!PRIVATE_KEY) return [];
  const pk = PRIVATE_KEY.trim().replace(/^0x/i, "");
  const isHex = /^[0-9a-fA-F]{64}$/.test(pk);
  if (!isHex) {
    console.warn("Hardhat: Ignoring invalid PRIVATE_KEY (must be 32-byte hex). Using read-only mode.");
    return [];
  }
  return [`0x${pk}`];
}

const accounts = getAccountsFromEnv();

module.exports = {
  solidity: "0.8.19",
  paths: {
    // Ensure Hardhat looks for sources under contracts/ when the config file lives in contracts/
    sources: path.resolve(__dirname, "."),
    scripts: path.resolve(__dirname, "scripts"),
    cache: path.resolve(__dirname, "cache"),
    artifacts: path.resolve(__dirname, "artifacts"),
  },
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts,
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
      accounts,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY || "",
  },
};