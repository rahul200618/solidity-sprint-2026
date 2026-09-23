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
1. `deposit()` with 0 ETH from Account A → reverts with "Zero Amount"
2. `deposit()` with 1 ETH from Account A → succeeds, `Deposited` event logged
3. `getBalance()` from Account A → returns 1 ETH (in wei)
4. `deposit()` with 2 ETH from Account B → succeeds
5. `getContractBalance()` → returns 3 ETH (combined pool)
6. `withdraw()` from Account A → succeeds, `Withdrawn` event logged, A's wallet balance increases by 1 ETH
7. `getBalance()` from Account A → returns 0
8. `withdraw()` again from Account A → reverts with "Nothing to Withdraw"
9. `withdraw()` from Account B → succeeds, B receives 2 ETH
10. `getContractBalance()` → returns 0

## 5. What I found difficult
I also initially had `withdraw()` marked as `payable` by mistake, which
would have allowed Ether to be sent in during a withdrawal — logically wrong
for a function that should only send Ether out.
## 6. Acknowledgements
Extended from my Session 02 `StudentRegistry` contract.
Consulted Claude to understand the working of the contract and to understand Solidity concepts(payable functions, msg.value, the call method, reentrancy, and the Checks-Effects-Interactions pattern)
