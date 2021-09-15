const MintableBurnableToken = artifacts.require('MintableBurnableToken');

module.exports = async function (callback) {
  const name = 'MoonRabbit';
  const symbol = 'AAA';

  console.log(`Deploy token...`);

  const token = await MintableBurnableToken.new(name, symbol);

  console.log(`Token deploy complete:`);
  console.log(`Token name - ${await token.name()}, token symbol - ${await token.symbol()}`);
  console.log(`Token address - ${token.address}`);
  console.log(`Owner address - ${await token.owner()}`);

  callback();
};
