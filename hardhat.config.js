require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
const SHARDEUM_RPC = process.env.SHARDEUM_RPC;
const privateKey = process.env.PRIVATE_KEY;

module.exports = {
  defaultNetwork: "hardhat",
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Configure each network to the respective Avalanche instances
    hardhat: {
      chainId: 1337,
      allowUnlimitedContractSize: true,
      gas: 2100000,
      gasPrice: 8000000000,
      gasLimit: 8000000,
    },
    // bloxberg: {
    //   url: SHARDEUM_RPC,
    //   accounts: [privateKey],
    //   chainId: 8080,
    // },
  },
};

// require("@nomiclabs/hardhat-waffle");
// module.exports = {
//   solidity: "0.8.3",
//   paths: {
//     artifacts: "./src/artifacts",
//   },
//   networks: {
//     // Configure each network to the respective Avalanche instances
//     hardhat: {
//       chainId: 1337,
//       allowUnlimitedContractSize: true,
//       gas: 2100000,
//       gasPrice: 8000000000,
//       gasLimit: 8000000,
//     },
//   },
// };
