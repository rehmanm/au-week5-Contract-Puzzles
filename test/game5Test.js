const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();
    const accounts = await ethers.provider.getSigner(0);

    return { game, accounts };
  }

  async function getAddress() {
    const threshold = 0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf;
    let address = threshold
    while (true) {
      const wallet = ethers.Wallet.createRandom().connect(ethers.provider);
      address = await wallet.getAddress();
      if (address < threshold) {
        return { wallet, address }
      }
    }


  }
  it('should be a winner', async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);
    const { wallet, address } = await getAddress();//get a random address below threshold
    console.log(`get randome address${address}`)

    //the random address does not have gas, send some gas to it:
    const signer = ethers.provider.getSigner(0);
    await signer.sendTransaction({
      to: address,
      value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
    });

    // good luck
    const tx = await game.connect(wallet).win();
    console.log(`Transaction sent from address ${address}...`)
    await tx.wait()
    // await game.win();
    console.log('Transaction completed')

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
