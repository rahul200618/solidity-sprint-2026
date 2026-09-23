import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("RahulToken", function () {

  it("should transfer tokens between accounts", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const token = await ethers.deployContract("RahulToken", [1000]);

    await token.transfer(addr1.address, ethers.parseUnits("100", 18));
    const balance = await token.balanceOf(addr1.address);
    expect(balance).to.equal(ethers.parseUnits("100", 18));
  });

  it("should revert transfer if balance is insufficient", async function () {
    const [, addr1, addr2] = await ethers.getSigners();
    const token = await ethers.deployContract("RahulToken", [1000]);

    await expect(
      token.connect(addr1).transfer(addr2.address, ethers.parseUnits("100", 18))
    ).to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");
  });

  it("should revert mint if caller is not owner", async function () {
    const [, addr1, addr2] = await ethers.getSigners();
    const token = await ethers.deployContract("RahulToken", [1000]);

    await expect(
      token.connect(addr1).mint(addr2.address, 100)
    ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
  });

  it("should allow owner to mint tokens", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const token = await ethers.deployContract("RahulToken", [1000]);

    await token.mint(addr1.address, 100);
    expect(await token.balanceOf(addr1.address)).to.equal(ethers.parseUnits("100", 18));
  });

});