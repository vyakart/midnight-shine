/* Deploy DonationVault to Sepolia (EOA deployer via PRIVATE_KEY in .env)
   Usage (from repo root):
   HARDHAT_CONFIG=contracts/hardhat.config.js npx hardhat run contracts/scripts/deploy-sepolia.js --network sepolia
*/
const { ethers, run } = require("hardhat");

async function main() {
  const beneficiary = "0x1E965D8002C4dd60B900A8DA21533a8482acd164";
  const hardCap = ethers.parseEther("9");

  const DonationVault = await ethers.getContractFactory("DonationVault");
  const contract = await DonationVault.deploy(beneficiary, hardCap);
  await contract.waitForDeployment();

  const address = await contract.getAddress();

  // Try to obtain the deployment block number for frontend indexing
  let blockNumber = "unknown";
  try {
    const deployTx = contract.deploymentTransaction();
    if (deployTx && deployTx.wait) {
      const receipt = await deployTx.wait();
      blockNumber = receipt && receipt.blockNumber != null ? receipt.blockNumber : "unknown";
    }
  } catch (e) {
    console.warn("Could not fetch deployment receipt:", e && (e.message || e));
  }

  console.log("Sepolia DonationVault deployed to:", address, "block:", blockNumber);

  // Optional Etherscan verification (requires ETHERSCAN_API_KEY)
  try {
    await run("verify:verify", {
      address,
      constructorArguments: [beneficiary, hardCap],
    });
    console.log("Verified on Etherscan");
  } catch (err) {
    console.warn("Verification skipped or failed:", err && (err.message || err));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});