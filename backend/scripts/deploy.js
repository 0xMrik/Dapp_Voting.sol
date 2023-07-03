const { ethers, upgrades } = require("hardhat");

async function main() {
  const Voting = await ethers.getContractFactory("Voting");
  console.log("Deploying Voting...");
  const voting = await Voting.deploy();
  await voting.deployed();
  console.log("Voting deployed to:", voting.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
