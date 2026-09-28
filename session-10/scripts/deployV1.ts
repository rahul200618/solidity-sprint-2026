import { network } from "hardhat";

const { ethers } = await network.create();

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // Deploy implementation
  const BoxV1 = await ethers.getContractFactory("BoxV1");
  const implementation = await BoxV1.deploy();
  await implementation.waitForDeployment();
  const implAddress = await implementation.getAddress();
  console.log("Implementation (V1):", implAddress);

  // Encode initialize call
  const initData = BoxV1.interface.encodeFunctionData("initialize", [deployer.address]);

  // Deploy proxy
  const Proxy = await ethers.getContractFactory("MyProxy");
  const proxy = await Proxy.deploy(implAddress, initData);
  await proxy.waitForDeployment();
  const proxyAddress = await proxy.getAddress();
  console.log("Proxy address:      ", proxyAddress);
}

main().catch(console.error);