import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("BoxV1Module", (m) => {
  const box = m.contract("BoxV1");
  return { box };
});