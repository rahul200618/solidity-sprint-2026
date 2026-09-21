# Session 04 — Secure Ether Wallet
**Name:** Rahul A
**Enrolment ID:** AU24UG-046
**Date submitted:** 20/09/2026
## 1. What this contract does
This contract is a personal Ether vault. Any address can deposit Ether into
it and the contract tracks each depositor's balance separately. A depositor
can withdraw their full balance at any time. Zero-value deposits are rejected.
Both operations emit events so off-chain tools can track activity.
## 2. Design decisions

I used call instead of transfer or send to move Ether out, since call forwards all available gas and is the currently preferred method — but this means I had to manually check its return value with require(success, ...), since call doesn't automatically revert on failure like transfer does.

The most important decision was ordering inside withdraw(): I clear balances[recepient] = 0 before making the external call, following the Checks-Effects-Interactions pattern. I considered the more "natural-looking" order — send first, then clear the balance — but rejected it, since that's exactly the reentrancy vulnerability covered in the session: a malicious contract's receive() function could call withdraw() again before the balance was cleared, draining the vault repeatedly on one transaction.

I kept balances as a separate mapping rather than relying only on address(this).balance, since the contract balance is a shared pool across all depositors — I need a per-address record to know how much each individual is owed.
## 3. Deployment
- Network: Remix VM
- Contract address: 0x540d7E428D5207B30EE03F2551Cbb5751D3c7569
- Transaction hash: 0xa4eab4c4dcb08878fabe33f0a86f18e146a06e9dc181ec424349ae59a7561a06 
- Block explorer link: N/A (Remix VM)
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
