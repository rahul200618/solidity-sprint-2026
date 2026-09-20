# Session 01 — Simple Storage
**Name:** Rahul A
**Enrolment ID:** AU24UG-046
**Date submitted:** 21/09/2026
## 1. What this contract does
This contract stores a public string message and the address of whoever last
updated it. Anyone can call `updateMessage` to change the message, and the
contract automatically records the caller's address as the last editor. Two
read functions expose the current message and the last editor's address.
## 2. Design decisions
I used a plain `string` state variable for the message since the content is
arbitrary text of unknown length. For the editor I used `address` — the
smallest type that can hold a wallet or contract address, and exactly what
`msg.sender` returns.

Both `message` and `lastEditor` are marked `public`, which makes Solidity
auto-generate getter functions for them. I also wrote explicit `getMessage()`
and `getLastEditor()` functions to make the interface more self-documenting and
easier to call from the Remix UI during testing.

The update function combines both state changes in a single transaction so the
message and the editor address are always in sync — there is no window where
one is updated and the other is not.
## 3. Deployment
- Network: Remix VM
- Contract address: 0xe2899bddFD890e320e643044c6b95B9B0b84157A
- Transaction hash: 0x592d93cfec55790cc68f9bfc14a4d04aa0e7532c0d0e5ceb3a8acc9c7f1f3cf7 
- Block explorer link: 0xce84506bfd4126b4c3c1fb9ca076ad7003cdd080731e2fd42c76d12b506de60b
## 4. How to test it
1. `getMessage()` → returns `""` (empty string, nothing stored yet)
2. `getLastEditor()` → returns `0x0000000000000000000000000000000000000000`
3. Switch to **Account 1**, call `updateMessage("Hello Atria")` → succeeds;
   no return value
4. `getMessage()` → returns `"Hello Atria"`
5. `getLastEditor()` → returns Account 1's address
6. Switch to **Account 2**, call `updateMessage("Updated by Account 2")` →
   succeeds
7. `getLastEditor()` → returns Account 2's address (previous editor
   overwritten correctly)
## 5. What I found difficult
Using the Remix UI for the first time and understanding how to switch accounts and deploy contracts was a bit confusing, but I figured it out with some trial and error.
## 6. Acknowledgements
Consulted Claude to understand the working of the contract and  to understand Solidity concepts.