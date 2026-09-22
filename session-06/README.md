# Session 05 — Build & Deploy Your Own Token
**Name:** Rahul A
**Enrolment ID:** AU24UG-046
**Date submitted:** 21/09/2026
## 1. What this contract does
This contract implements a custom ERC-20 token called Rahul Token (RHT)
built on OpenZeppelin's battle-tested ERC20 standard. The deployer receives
the full initial supply on deployment. Only the owner can mint new tokens to
any address. Any token holder can burn their own tokens, permanently reducing
the total supply. The contract was deployed to the Sepolia testnet and the
token imported into MetaMask for a live transfer to a classmate.
## 2. Design decisions

**OpenZeppelin ERC20 + ERC20Burnable**: Rather than implementing the ERC-20
standard from scratch, I inherited OpenZeppelin's audited implementation.
This gives me correct transfer, approval, and allowance logic for free, and
`ERC20Burnable` adds `burn()` and `burnFrom()` without extra code.

**`onlyOwner` modifier**: I wrote a custom modifier to keep the contract 
minimal and because the only owner-gated function is `mint`.

**`* 10 ** decimals()` in mint and constructor**: ERC-20 tokens store
balances in their smallest unit (like paise vs rupees). Multiplying by
`10 ** 18` means when I pass `1000` as the initial supply, users actually
receive 1000 whole tokens. Without this, `1000` would be 0.000000000000001000
tokens — an easy mistake that breaks the user experience.

**Burn overrides with events**: I overrode `burn()` to emit a `TokensBurned`
event. The OZ base `burn()` doesn't emit a custom event, so adding one here
makes the contract easier to monitor off-chain.

## 3. Deployment
- Network: Sepolia Testnet
- Contract address: 0xE57Fa53aEA4350F47EBE8f6D6e5B0D8dC85Be71e
- Transaction hash: 0x95d82e744d6cd3f4fd1142ff607a1e71cd10777bcd6f9e49f8324c5b9b159ec3 
- Block explorer link: https://sepolia.etherscan.io/tx/0x95d82e744d6cd3f4fd1142ff607a1e71cd10777bcd6f9e49f8324c5b9b159ec3
## 4. How to test it
**In Remix (before Sepolia deployment, using Remix VM):**

1. Deploy with `initialSupply = 1000`. Owner (Account 1) receives 1000 RHT.
2. Call `totalSupply()` → returns `1000000000000000000000` (1000 × 10^18).
3. Call `balanceOf(<Account 1>)` → same value.
4. Switch to **Account 2**. Call `mint(<any address>, 100)` → reverts with error
   `"Only owner can mint"`. ← expected failure (access control check)
5. Switch back to **Account 1**. Call `mint(<Account 2 address>, 100)` →
   succeeds. `balanceOf(<Account 2>)` → `100000000000000000000`.
6. From Account 2, call `burn(50)` → succeeds. `balanceOf(<Account 2>)` →
   `50000000000000000000`. `totalSupply()` decreases by 50 tokens.
**On Sepolia (live):**
7. Deployed contract visible at:
   `https://sepolia.etherscan.io/tx/0x95d82e744d6cd3f4fd1142ff607a1e71cd10777bcd6f9e49f8324c5b9b159ec3`
8. Transfer to classmate transaction hash: 0x55b9f8736ce1c79fb0becc525481c594c7cdcf32458a7e6cac1ce23112051ff0
## 5. What I found difficult
Understanding decimals was the trickiest part — ERC-20 tokens don't store
fractional numbers, so `1000` tokens are actually stored as
`1000000000000000000000`. Forgetting to multiply by `10 ** decimals()` in
the constructor would have meant the "initial supply" showed as a fraction
of one token in MetaMask.
## 6. Acknowledgements
OpenZeppelin Contracts v5 — ERC20 and ERC20Burnable used as base contracts. https://docs.openzeppelin.com/contracts/5.x/erc20
Consulted Claude to understand the working of the contract and to understand Solidity concepts.
