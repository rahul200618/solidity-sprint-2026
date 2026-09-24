import { network } from "hardhat";

const { ethers } = await network.create();

async function main() {
  const [owner] = await ethers.getSigners();

  // Connect to your already-deployed contract
  const token = await ethers.getContractAt(
    "RahulToken",
    "0xe8035B27933CC23b50621aa64064A0C3757Ba99B"
  );

  // Check total supply
  const supply = await token.totalSupply();
  console.log("Total supply:", ethers.formatUnits(supply, 18), "RHT");

  // Check your balance
  const balance = await token.balanceOf(owner.address);
  console.log("Your balance:", ethers.formatUnits(balance, 18), "RHT");

  // Mint 100 more tokens to yourself
  const tx = await token.mint(owner.address, 100);
  await tx.wait();
  console.log("Minted 100 RHT");

  // Transfer 50 tokens to another address
  const tx2 = await token.transfer("0xRecipientAddressHere", ethers.parseUnits("50", 18));
  await tx2.wait();
  console.log("Transferred 50 RHT");
}

main().catch(console.error);