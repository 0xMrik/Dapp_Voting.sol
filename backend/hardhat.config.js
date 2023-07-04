require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.0",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.SEPOLIA_URL_API}`, 
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      gasPrice: 20000000000, 
    },
  },
};
