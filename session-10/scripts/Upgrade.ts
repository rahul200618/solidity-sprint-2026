import { network } from "hardhat";

const { ethers } = await network.create();

async function main() {
    const PROXY_ADDRESS = "0xDE6A8158DF5C7bc24aD0a4C08bdc0D3AE657F36e";

    // Deploy V2 implementation
    const BoxV2 = await ethers.getContractFactory("BoxV2");
    const implV2 = await BoxV2.deploy();
    await implV2.waitForDeployment();
    const implV2Address = await implV2.getAddress();
    console.log("Implementation (V2):", implV2Address);

    // Upgrade proxy to V2
    const box = BoxV2.attach(PROXY_ADDRESS);
    const tx = await box.upgradeToAndCall(implV2Address, "0x");
    await tx.wait();
    console.log("Proxy upgraded to V2");

    // Confirm state survived
    const value = await box.getValue();
    console.log("Value after upgrade:", value.toString());

    // Call new V2 function
    const tx2 = await box.doubleValue();
    await tx2.wait();
    const doubled = await box.getValue();
    console.log("Value after double:", doubled.toString());
}

main().catch(console.error);