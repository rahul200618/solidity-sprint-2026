import { network } from "hardhat";

const { ethers } = await network.create();

async function main() {
  const PROXY_ADDRESS = "0xDE6A8158DF5C7bc24aD0a4C08bdc0D3AE657F36e";

  const BoxV1 = await ethers.getContractFactory("BoxV1");
  const box = BoxV1.attach(PROXY_ADDRESS);

  await box.setValue(42);
  console.log("Value set to 42");

  const value = await box.getValue();
  console.log("Confirmed value:", value.toString());
}

main().catch(console.error);