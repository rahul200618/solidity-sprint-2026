import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("RahulTokenModule", (m) => {
    const token = m.contract("RahulToken", [1000]);
    return { token };
});