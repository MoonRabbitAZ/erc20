# Steps
 - Create file .env according to example .env.example and fill it with your data (we take API keys from etherscan and bscscan)
 - In file deployToken.js, set the desired name and symbol 
 - For deploy to Ethereum Mainnet - `npm run deploy-mainnet`
 - For deploy to BSC - `npm run deploy-bsc`
 - For verify - `truffle run verify MintableBurnableToken@<token-address> --network <mainnet or bsc_mainnet>`