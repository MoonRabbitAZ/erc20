const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config(); // Store environment-specific variable from '.env' to process.env

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
      gasLimit: 10000000, // <-- Use this high gas value
      gasPrice: 50000000000,
      disableConfirmationListener: true,
    },

    ropsten: {
      provider: () =>
        new HDWalletProvider([process.env.PRIVATE_KEY], `wss://ropsten.infura.io/ws/v3/${process.env.PROJECT_ID}`),
      network_id: 3, // Ropsten's id
      gas: 7000000, // Ropsten has a lower block limit than mainnet
      gasPrice: 30000000000, // 30 gwei
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },

    mainnet: {
      provider: () =>
        new HDWalletProvider([process.env.PRIVATE_KEY], `wss://mainnet.infura.io/ws/v3/${process.env.PROJECT_ID}`),
      network_id: 1,
      gas: 8000000,
      gasPrice: 50000000000,
      skipDryRun: true,
    },

    bsc_test: {
      provider: () =>
        new HDWalletProvider([process.env.PRIVATE_KEY], "https://data-seed-prebsc-1-s3.binance.org:8545/"),
      network_id: 97,
      gas: 8000000,
      gasPrice: 10000000000,
      timeout: 10000,
    },

    bsc_mainnet: {
      provider: () => new HDWalletProvider([process.env.PRIVATE_KEY], "https://bsc-dataseed.binance.org/"),
      network_id: 56,
      gas: 8000000,
    },
  },

  // Set default mocha options here, use special reporters etc.
  // mocha: {
  //   color: true,
  //   timeout: 5000000,
  //   reporter: 'eth-gas-reporter',
  //   reporterOptions: {
  //     showTimeSpent: true,
  //     noColors: false,
  //     currency: 'USD',
  //     coinmarketcap: 'd2bcdde7-26e5-4930-ba9d-165ddb85aa23',
  //   },
  // },

  compilers: {
    solc: {
      version: "0.8.3",
      settings: {
        optimizer: {
          enabled: true,
          runs: 1000,
        },
      },
    },
  },

  plugins: ["truffle-plugin-verify"],

  api_keys: {
    etherscan: process.env.ETHERSCAN_KEY,
    bscscan: process.env.BSC_KEY,
  },
};
