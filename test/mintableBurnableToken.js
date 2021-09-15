const MintableBurnableToken = artifacts.require('MintableBurnableToken');

const Reverter = require('./helpers/reverter');
const BigNumber = require('bignumber.js');
const truffleAssert = require('truffle-assertions');

const { assert } = require('chai');

function toBN(num) {
  return new BigNumber(num);
}

contract('TokenFarming', async (accounts) => {
  const reverter = new Reverter(web3);

  const OWNER = accounts[0];
  const USER1 = accounts[1];

  const oneToken = toBN(10).pow(18);

  let testToken;

  before('setup', async () => {
    testToken = await MintableBurnableToken.new('TestToken', 'TT');

    await reverter.snapshot();
  });

  afterEach('revert', reverter.revert);

  describe('creating', async () => {
    it('should set correct values after creation', async () => {
      assert.equal(await testToken.name(), 'TestToken');
      assert.equal(await testToken.symbol(), 'TT');

      assert.equal(await testToken.owner(), OWNER);
    });
  });

  describe('mint', async () => {
    const mintAmount = oneToken.times(100);

    it('should correct mint tokens', async () => {
      await testToken.mint(USER1, mintAmount);

      assert.equal(toBN(await testToken.totalSupply()).toString(), mintAmount.toString());
      assert.equal(toBN(await testToken.balanceOf(USER1)).toString(), mintAmount.toString());

      await testToken.mint(OWNER, mintAmount);

      assert.equal(toBN(await testToken.totalSupply()).toString(), mintAmount.times(2).toString());
      assert.equal(toBN(await testToken.balanceOf(OWNER)).toString(), mintAmount.toString());
    });

    it('should get exception if the function is not called by the owner', async () => {
      const reason = 'Ownable: caller is not the owner';
      await truffleAssert.reverts(testToken.mint(USER1, mintAmount, {from: USER1}), reason);
    });
  });

  describe('burn', async () => {
    const mintAmount = oneToken.times(100);
    const burnAmount = oneToken.times(50);

    beforeEach('setup', async () => {
      await testToken.mint(OWNER, mintAmount);

      assert.equal(toBN(await testToken.totalSupply()).toString(), mintAmount.toString());
      assert.equal(toBN(await testToken.balanceOf(OWNER)).toString(), mintAmount.toString());
    });

    it('should allow the owner to destroy their coins', async () => {
      await testToken.burn(burnAmount);

      assert.equal(toBN(await testToken.totalSupply()).toString(), mintAmount.minus(burnAmount).toString());
      assert.equal(toBN(await testToken.balanceOf(OWNER)).toString(), mintAmount.minus(burnAmount).toString());
    });

    it('should get exception if the function is not called by the owner', async () => {
      const reason = 'Ownable: caller is not the owner';

      await truffleAssert.reverts(testToken.burn(burnAmount, {from: USER1}), reason);
    });

    it('should get exception if you try to burn more than there is on the balance', async () => {
      const reason = 'ERC20: burn amount exceeds balance';

      await truffleAssert.reverts(testToken.burn(burnAmount.times(3)), reason);
    });
  });

  describe('burnFrom', async () => {
    const mintAmount = oneToken.times(100);
    const burnAmount = oneToken.times(50);

    beforeEach('setup', async () => {
      await testToken.mint(OWNER, mintAmount);
      await testToken.mint(USER1, mintAmount);
    });

    it('should allow the owner to burn someone\'s coins, if he has allowance to do so', async () => {
      await testToken.approve(OWNER, burnAmount, {from: USER1});

      await testToken.burnFrom(USER1, burnAmount);

      assert.equal(toBN(await testToken.totalSupply()).toString(), mintAmount.times(2).minus(burnAmount).toString());
      assert.equal(toBN(await testToken.balanceOf(USER1)).toString(), mintAmount.minus(burnAmount).toString());
    });

    it('should get exception if the function is not called by the owner', async () => {
      const reason = 'Ownable: caller is not the owner';

      await truffleAssert.reverts(testToken.burnFrom(OWNER, burnAmount, {from: USER1}), reason);
    });

    it('should get exception if you try to burn more than there allowance', async () => {
      const reason = 'ERC20: burn amount exceeds allowance';

      await truffleAssert.reverts(testToken.burnFrom(USER1, burnAmount), reason);
    });
  });

  describe('renounceOwnership', async () => {
    it('should get exception if try to call this function', async () => {
      const reason = 'MintableBurnableToken: This feature is disabled.';

      await truffleAssert.reverts(testToken.renounceOwnership(), reason);
    });
  });
});
