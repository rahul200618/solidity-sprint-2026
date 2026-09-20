# Session 02 — Student Registry
**Name:** Rahul A
**Enrolment ID:** AU24UG-046
**Date submitted:** 20/09/2026
## 1. What this contract does
This contract stores student information such as name, enrollment ID, and status (Active, Inactive, Graduated). A registered student can update their own status, and anyone can look up a student's record by address. Attempting to register twice or query an unregistered address reverts with a clear error message.
## 2. Design decisions
I used a `struct` to group the three fields that belong to a student (name,
enrolment ID, status) so they can be stored and retrieved together cleanly.

I used an `enum` for status rather than a plain integer so the code is
self-documenting — `Status.Graduated` is immediately readable, whereas `2`
is not. Enums also prevent invalid values from being stored.

I chose two separate mappings — one for the student record and one for a
boolean registration flag — rather than detecting registration by checking
for an empty name string. An empty-name check is fragile (a student could
legitimately submit a blank name); the boolean flag is unambiguous.

## 3. Deployment
- Network: Remix VM
- Contract address: 0x1c91347f2A44538ce62453BEBd9Aa907C662b4bD
- Transaction hash: 0x8ab6ce3b9ef0ab2f0d50f9e7d5d4be0c344f1dc531b6a5fad88c750a23596e4f 
- Block explorer link: 0x4a7bd87c033a57af23b5df449b338fc07b3749e4a016595dc89b1cf3d47124c1
## 4. How to test it
1. Deploy the contract. Remix gives you multiple test accounts 
2. Switch to **Account 1**. Call `registerStudent("Rahul", 101)` → succeeds.
3. Call `getStudent(<Account 1 address>)` → returns `("Rahul", 101, 0)`.
   Status `0` = `Active`.
4. Call `registerStudent("Rahul", 101)` again from Account 1 → reverts with
   `"Student already registered"`. 
5. Switch to **Account 2**. Call `getStudent(<Account 1 address>)` → same
   result — any address can read any record.
6. Call `getStudent(<Account 2 address>)` from Account 2 → reverts with
   `"Student not registered"` since Account 2 hasn't registered yet. 
7. Call `registerStudent("ABC", 202)` from Account 2 → succeeds.
8. Call `updateStatus(2)` from Account 2 → succeeds. `2` = `Graduated`.
9. Call `getStudent(<Account 2 address>)` → returns `("ABC", 202, 2)`,
   confirming the status update.
## 5. What I found difficult
Deciding how to detect whether a student is already registered — I initially
considered checking whether the name field was empty, but realised a blank
name would break that logic.
## 6. Acknowledgements
Consulted Claude to understand the working of the contract and to understand Solidity Concepts.