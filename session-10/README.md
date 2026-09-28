# Session 10 — Upgrade Without Losing State
**Name:** Rahul A
**Enrolment ID:** AU24UG-046
**Date submitted:** 28/09/2026
## 1. What this contract does
This session demonstrates UUPS upgradeable contracts using OpenZeppelin.
A proxy contract holds the state and a fixed address, while the
implementation contract holds the logic and can be replaced. BoxV1 stores
a uint256 value and allows it to be read and set. BoxV2 extends V1 by
adding a `doubleValue()` function. After upgrading the proxy from V1 to V2,
the original state (value = 42) survived — confirming that state lives in
the proxy, not the implementation.
## 2. Design decisions
**UUPS over Transparent Proxy**: UUPS keeps the upgrade function inside
the implementation contract rather than the proxy. This is cheaper to
deploy and is the current OpenZeppelin recommendation. The tradeoff is
that if you deploy an implementation without `_authorizeUpgrade`, you
lose the ability to upgrade — so the function must always be present.

**`_disableInitializers()` in constructor**: Upgradeable contracts cannot
use constructors for state initialization because the constructor runs on
the implementation, not the proxy. `_disableInitializers()` prevents
anyone from calling `initialize` directly on the implementation contract,
which could be used to take ownership of it.

**`initialize` instead of constructor**: The proxy delegates all calls to
the implementation, including initialization. The `initializer` modifier
ensures `initialize` can only be called once, mimicking constructor
behaviour.

**Storage layout preserved in V2**: `uint256 public value` stays at slot 0
in both V1 and V2. No existing variables were reordered or removed. The
new `doubleValue()` function was added without touching the storage layout,
which is why the value 42 survived the upgrade intact.

**Manual proxy deployment**: The `@openzeppelin/hardhat-upgrades` plugin
does not yet support Hardhat v3. The proxy was deployed manually by
deploying the implementation, encoding the `initialize` call, and passing
both to a custom `MyProxy` wrapper around OZ's `ERC1967Proxy`.

## 3. Deployment
## 3. Deployment

### V1
- Network: Sepolia testnet
- Implementation (V1): `0x48188C7a04f366731a91C3b36AFb9f7a1Fcfff90`
- Proxy address: `0xDE6A8158DF5C7bc24aD0a4C08bdc0D3AE657F36e`
- Block explorer: https://sepolia.etherscan.io/address/0xDE6A8158DF5C7bc24aD0a4C08bdc0D3AE657F36e

### V2
- Implementation (V2): `0x080372C22164D9241dF724C6c6cBc5B9919c6a31`
- Proxy address (unchanged): `0xDE6A8158DF5C7bc24aD0a4C08bdc0D3AE657F36e`
- Block explorer: https://sepolia.etherscan.io/address/0x080372C22164D9241dF724C6c6cBc5B9919c6a31
## 4. How to test it
**Step 1 — Deploy V1 and proxy:**
```bash
$env:PRIVATE_KEY="0x..."
npx hardhat run scripts/deployV1.ts --network sepolia
```
Expected output:
Implementation (V1): 0x48188C7a04f366731a91C3b36AFb9f7a1Fcfff90
Proxy address: 0xDE6A8158DF5C7bc24aD0a4C08bdc0D3AE657F36e

**Step 2 — Set a value through the proxy:**
```bash
npx hardhat run scripts/setValue.ts --network sepolia
```
Expected output:
Value set to 42
Confirmed value: 42

**Step 3 — Deploy V2 and upgrade:**
```bash
npx hardhat run scripts/upgrade.ts --network sepolia
```
Expected output:
Implementation (V2): 0x080372C22164D9241dF724C6c6cBc5B9919c6a31
Proxy upgraded to V2
Value after upgrade: 42 ← state survived
Value after double: 84 ← new V2 function works
**Expected failure — calling doubleValue on V1:**
If you attach BoxV1 to the proxy and call `doubleValue()` it reverts
with a function not found error because V1 has no such function.

## 5. What I found difficult
The `@openzeppelin/hardhat-upgrades` plugin does not support Hardhat v3
yet, which caused repeated errors (`upgrades.deployProxy is not a
function`). The workaround was deploying the proxy manually by creating
a `MyProxy` wrapper contract that inherits `ERC1967Proxy` and deploying
it with the encoded `initialize` calldata.

Understanding that `doubleValue()` needed `await tx.wait()` before
reading the result was also a catch — without waiting for the transaction
to mine, `getValue()` still returned the pre-transaction value.
## 6. Acknowledgements
- OpenZeppelin Contracts v5 — ERC1967Proxy, UUPSUpgradeable,
  OwnableUpgradeable, Initializable
- Consulted Claude (AI assistant) to debug and generate the scripts ignition and test and tried to understand the whole assignment and concepts— all implementation decisions are my own.
