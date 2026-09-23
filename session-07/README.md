# Session 07 — Build, Deploy & Test Your Own Token
**Name:** Rahul A
**Enrolment ID:** AU24UG-046
**Date submitted:** 22/09/2026
## 1. What this contract does
This session migrates the Session 05 ERC-20 token (RahulToken) from Remix
into a professional Hardhat development environment. The contract is unchanged
— it is an owner-mintable, burnable ERC-20 token built on OpenZeppelin. The
focus this session is on writing automated tests that verify the three core
behaviours — successful transfer, insufficient balance revert, and owner-only
minting — and deploying to Sepolia via a Hardhat Ignition module.
## 2. Design decisions

**Hardhat Ignition over a plain deploy script**: I used an Ignition module
for deployment rather than a manual `scripts/deploy.js`. Ignition tracks
deployment state so if the script is interrupted it resumes rather than
re-deploying, and it records deployed addresses automatically.

**TypeScript for tests**: The project uses TypeScript throughout to match
the Hardhat project template. Type checking catches errors at write time
rather than at runtime.

**Initial supply of 1000**: Passed as a constructor argument so it is easy
to change without touching the contract. The contract multiplies by
`10 ** decimals()` internally so 1000 means 1000 whole tokens.

**No keystore or .env**: The RPC URL is public so it is hardcoded directly
in `hardhat.config.ts`. The private key is passed as a shell environment
variable (`$env:PRIVATE_KEY`) at deploy time and never written to any file,
so nothing sensitive is committed to the repository.

## 3. Deployment
- Network: Sepolia Test
- Contract address: 0xe8035B27933CC23b50621aa64064A0C3757Ba99B
- Transaction hash: Na 
- Block explorer link: https://sepolia.etherscan.io/address/0xe8035B27933CC23b50621aa64064A0C3757Ba99B
## 4. How to test it
**Run the automated test suite:**
```bash
npx hardhat test
```

Expected output:

RahulToken
✔ should transfer tokens between accounts
✔ should revert transfer if balance is insufficient
✔ should revert mint if caller is not owner
✔ should allow owner to mint tokens

4 passing
**Test descriptions:**

1. `should transfer tokens between accounts` — owner transfers 100 RHT to
   addr1; `balanceOf(addr1)` returns `100 × 10^18`. ✔
2. `should revert transfer if balance is insufficient` — addr1 (zero
   balance) tries to transfer 100 RHT → reverts with
   `ERC20InsufficientBalance`. ← expected failure ✔
3. `should revert mint if caller is not owner` — addr1 calls `mint` →
   reverts with `OwnableUnauthorizedAccount`. ← expected failure ✔
4. `should allow owner to mint tokens` — owner mints 100 RHT to addr1;
   balance confirmed correct. ✔

## 5. What I found difficult
The Hardhat keystore was the most confusing part — the keystore requires a
password that must be typed exactly the same every time, and any mismatch
gives `HHE50000: Invalid password or corrupted keystore file` with no way
to recover and other errors too.
## 6. Acknowledgements
- OpenZeppelin Contracts v5 — ERC20, ERC20Burnable, Ownable
- RahulToken contract carried over from Session 05
- Hardhat project template used as the base structure
Consulted Claude to understand the working of the contract and to understand Solidity concepts.(to set up the test file, Ignition module,and config)
