import { ethers } from "hardhat";

async function main() {
  const beneficiary = "0x1E965D8002C4dd60B900A8DA21533a8482acd164";
  const hardCap = ethers.parseEther("9");

  const DonationVault = await ethers.getContractFactory("DonationVault");
  const contract = await DonationVault.deploy(beneficiary, hardCap);

  await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log("DonationVault deployed to:", address);

  // Verify on Etherscan
  await hre.run("verify:verify", {
    address: address,
    constructorArguments: [beneficiary, hardCap],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});