const hre = require("hardhat");

async function main() {
    const Voting = await hre.ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();
    await voting.deployed();

    console.log("Voting contract deployed to:", voting.address);

    await voting.addVoter("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
    await voting.addVoter("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    await voting.addVoter("0x90F79bf6EB2c4f870365E785982E1f101E93b906")

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });