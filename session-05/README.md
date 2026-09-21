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
- Network: Remix VM
- Contract address: 0xE57Fa53aEA4350F47EBE8f6D6e5B0D8dC85Be71e
- Transaction hash: 0x95d82e744d6cd3f4fd1142ff607a1e71cd10777bcd6f9e49f8324c5b9b159ec3 
- Block explorer link: https://sepolia.etherscan.io/tx/0x95d82e744d6cd3f4fd1142ff607a1e71cd10777bcd6f9e49f8324c5b9b159ec3
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
