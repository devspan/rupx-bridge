const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Bridge", function () {
  let Bridge, bridge, Token, token;
  let owner, user;
  const initialSupply = ethers.utils.parseEther("1000000");
  const lockAmount = ethers.utils.parseEther("100");
  const fee = ethers.utils.parseEther("1");

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    Token = await ethers.getContractFactory("ERC20");
    token = await Token.deploy("Test Token", "TST", initialSupply);
    await token.deployed();

    Bridge = await ethers.getContractFactory("Bridge");
    bridge = await Bridge.deploy(token.address, fee);
    await bridge.deployed();

    await token.approve(bridge.address, initialSupply);
  });

  it("should lock tokens", async function () {
    await token.connect(user).mint(lockAmount.add(fee));
    await token.connect(user).approve(bridge.address, lockAmount.add(fee));

    const nonce = await bridge.nonce();
    await bridge.connect(user).lockTokens(lockAmount);
    expect(await token.balanceOf(bridge.address)).to.equal(lockAmount);
    expect(await token.balanceOf(owner.address)).to.equal(fee);
    expect(await bridge.nonce()).to.equal(nonce.add(1));
  });

  it("should unlock tokens", async function () {
    await token.connect(user).mint(lockAmount.add(fee));
    await token.connect(user).approve(bridge.address, lockAmount.add(fee));

    await bridge.connect(user).lockTokens(lockAmount);

    const nonce = (await bridge.nonce()).sub(1);
    const messageHash = ethers.utils.solidityKeccak256(
      ["address", "uint256", "uint256", "address"],
      [user.address, lockAmount, nonce, bridge.address]
    );
    const prefixedHash = ethers.utils.solidityKeccak256(
      ["string", "bytes32"],
      ["\x19Ethereum Signed Message:\n32", messageHash]
    );
    const signature = await owner.signMessage(ethers.utils.arrayify(prefixedHash));

    await bridge.connect(owner).unlockTokens(user.address, lockAmount, nonce, signature);
    expect(await token.balanceOf(user.address)).to.equal(lockAmount);
  });

  it("should update fee", async function () {
    const newFee = ethers.utils.parseEther("2");
    await bridge.connect(owner).updateFee(newFee);
    expect(await bridge.fee()).to.equal(newFee);
  });

  it("should allow emergency withdraw", async function () {
    const withdrawAmount = ethers.utils.parseEther("50");
    await token.connect(user).mint(lockAmount.add(fee));
    await token.connect(user).approve(bridge.address, lockAmount.add(fee));

    await bridge.connect(user).lockTokens(lockAmount);

    await bridge.connect(owner).emergencyWithdraw(withdrawAmount);
    expect(await token.balanceOf(owner.address)).to.equal(withdrawAmount.add(fee));
  });
});
