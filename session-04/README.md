# Session 04 — Secure Ether Wallet
**Name:** Rahul A
**Enrolment ID:** AU24UG-046
**Date submitted:** 21/09/2026
## 1. What this contract does
This contract extends the Session 3 student registry with two additions:
events emitted on every state change so off-chain tools can observe the
contract; an `onlyOwner` modifier so only the deployer can register students;
and an interface `IStudentRegistry` that formalises the contract's public
read API. The owner registers students by passing their wallet address; the
students themselves can still update their own status.
## 2. Design decisions

I added a hand-written `onlyOwner` modifier instead of using OpenZeppelin's `Ownable`, since the task only asked for a modifier restricting registration and the base contract from Session 2 didn't already import OpenZeppelin — this kept the change minimal rather than pulling in a new dependency.

I used `indexed` on the `student` address in both events, since that's the field most likely to be filtered/searched by an off-chain app (e.g. "show all events for this address"), matching the pattern from the session material.

I declared `IsStudentRegistry` as a separate `interface` rather than an `abstract contract`, since it only needed to expose a read function's signature with no shared logic to inherit — an interface is the stricter, more appropriate fit here.

I also explicitly named the interface `IStudentRegistry` (rather than, say, `IStudentRegistry_v2`) so that the Session 2 contract could keep using the same interface name without any modification.

## 3. Deployment
- Network: Remix VM
- Contract address: 0x5A86858aA3b595FD6663c2296741eF4cd8BC4d01
- Transaction hash: 0x582c909307369032c81e4c6a1bd55e29d85c73dcd34eb719196f4a02e0253396 
- Block explorer link: 0x4aff8efef1a20d66d40254cb4f893a03c724ed0d2f1bb6ee3da7cb84c4dac6f0
## 4. How to test it
1. `owner()` → returns the deploying account's address
2. `registerStudent("Rahul", 1)` from the owner account → succeeds, `StudentRegistered` event logged
3. `registerStudent("ABC", 102)` from a non-owner account → reverts with "Not the owner"
4. `getStudent(owner address)` → returns `("Rahul", 1, 0)`
5. `registerStudent(...)` again from the owner → reverts with "Student already registered"
6. `getStudent(non-owner address)` → reverts with "Student not registered"
7. `updateStatus(2)` from the owner → succeeds, `StatusUpdated` event logged
8. `getStudent(owner address)` → returns `("Rahul", 1, 2)
## 5. What I found difficult
The access control bug was subtle: using `onlyOwner` on `registerStudent`
while still writing to `students[msg.sender]` meant every student was stored
under the owner's address. The fix — passing the student's address as a
parameter
## 6. Acknowledgements
Extended from my Session 02 `StudentRegistry` contract.
Consulted Claude to understand the working of the contract and to understand Solidity concepts(events, modifiers, interfaces, access control).
