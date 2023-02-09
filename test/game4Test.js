const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game4', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game4');
    const game = await Game.deploy();

    const signer = ethers.provider.getSigner(0);
    const signer2 = ethers.provider.getSigner(1);

    const address1 = await signer.getAddress();
    const address2 = await signer2.getAddress();

    return { game, address1, address2, signer2 };
  }
  it('should be a winner', async function () {
    const { game, address1, address2, signer2 } = await loadFixture(deployContractAndSetVariables);

    // nested mappings are rough :} 
    await game.connect(signer2).write(address1);

    await game.win(address2);

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
