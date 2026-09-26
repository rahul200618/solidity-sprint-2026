# Session 09 — Run Slither on NFT Project
**Name:** Rahul A
**Enrolment ID:** AU24UG-046
**Date submitted:** 25/09/2026
## 1. What this contract does
This session is a security review of the RahulNFT contract from Session 06.
Slither was run against the contract to identify potential vulnerabilities.
Each finding was classified as a genuine issue or a false positive, with
reasoning provided for each. All genuine findings were remediated in an
updated version of the contract.
## 2. Slither Findings
Slither produced 7 findings in total. 3 were in my contract and 4 were in OpenZeppelin's library files (false positives).
---

### Finding 1 — reentrancy-benign
**Location:** `RahulNFT.mint()` — my contract  
**Classification:** Genuine issue  
**What Slither reported:**
Reentrancy in RahulNFT.mint(): _safeMint() makes an external call,
then _setTokenURI() writes state after the call.
**Reasoning:** 
_safeMint() triggers an external call to contract recipients (onERC721Received).
_setTokenURI() updates state after this external call.
This violates the Checks-Effects-Interactions pattern. It is labeled "benign" because no funds can be drained, but state changes should always happen before external calls.
**Fix:** Move `_setTokenURI` before `_safeMint` so state is written before
the external call, following the Checks-Effects-Interactions pattern.

---
### Finding 2 — reentrancy-events
**Location:** `RahulNFT.mint()` — my contract  
**Classification:** Genuine issue  
**What Slither reported:**
MetadataUpdate event emitted after external call in _safeMint.
**Reasoning:** Same root cause as Finding 1. The `MetadataUpdate` event
fired by `_setTokenURI` runs after the external call in `_safeMint`. A
re-entrant call could observe a state where the token exists but has no
URI yet. Fixed by the same reorder as Finding 1.  
**Fix:** Same as Finding 1 — set URI before minting.

---
### Finding 3 — naming-convention
**Location:** `RahulNFT.mint(address _to, string _uri)` — my contract  
**Classification:** Genuine issue  
**What Slither reported:**
Parameter RahulNFT.mint()._to is not in mixedCase.
Parameter RahulNFT.mint()._uri is not in mixedCase.
**Reasoning:** The Solidity style guide specifies mixedCase (camelCase)
for parameter names. The underscore prefix `_to` and `_uri` is a common
convention to distinguish parameters from state variables, but it
technically violates the naming standard. Since this is a style issue
with a straightforward fix, I treated it as genuine.  
**Fix:** Renamed parameters to `to` and `uri`.
### Finding 4 — divide-before-multiply
**Location:** `Math.sol` — OpenZeppelin library  
**Classification:** False positive  
**What Slither reported:**
Math.mulDiv() and Math.invMod() perform multiplication on the result
of a division.
**Reasoning:** OpenZeppelin's `mulDiv` is an intentional 512-bit
precision multiplication algorithm. The division-before-multiplication
pattern is deliberate and mathematically correct for this algorithm. It
has been formally verified and audited. Not my code — no fix needed.

---

### Finding 5 — assembly
**Location:** `ERC721Utils.sol`, `Bytes.sol`, `Math.sol`, `Strings.sol`
— OpenZeppelin library  
**Classification:** False positive  
**What Slither reported:**
Multiple functions use inline assembly.
**Reasoning:** Slither flags all inline assembly as a warning by default.
All assembly in OpenZeppelin's utility contracts is intentional, audited,
and necessary for gas efficiency. None of this is in my contract. No fix
needed.

---

### Finding 6 — pragma
**Location:** OpenZeppelin interface files  
**Classification:** False positive  
**What Slither reported:**
6 different versions of Solidity are used across the project.
**Reasoning:** OpenZeppelin's interface files use broad version ranges
like `>=0.4.16` and `>=0.6.2` deliberately for maximum compatibility.
This is expected in any project that uses OpenZeppelin. My own contracts
use the pinned `^0.8.20`. No fix needed.

---

### Finding 7 — solc-version
**Location:** OpenZeppelin interface files  
**Classification:** False positive  
**What Slither reported:**
Version constraints contain known severe issues.
**Reasoning:** Slither warns about broad version constraints in OZ
interface files because those ranges technically include older buggy
compiler versions. In practice the project compiles with `0.8.28` which
does not have those bugs. The warnings are about the constraint range,
not the actual compiler used. No fix needed.

## 3. Remediation

Three genuine issues were fixed in the remediated contract:

**Fix 1 & 2 — Reentrancy ordering (Findings 1 and 2)**  
Moved `_setTokenURI` before `_safeMint` so all state changes happen
before the external call. This follows the Checks-Effects-Interactions
pattern and eliminates the reentrancy window.

**Fix 3 — Naming convention (Finding 3)**  
Renamed `_to` → `to` and `_uri` → `uri` to conform to the Solidity
style guide.

## 4. Deployment

- This session is a security review — no new deployment required.
- Original NFT contract deployed in Session 06:
  `https://sepolia.etherscan.io/tx/0x888be1d8e17b3a73f84d2e0b09d6b8ab10d9dfb52cf7e8c86db277719932e0a4`

## 5. What I found difficult

Distinguishing genuine findings from false positives was the hardest
part. Slither reports everything including findings inside OpenZeppelin's
own library files, so the output is much longer than the number of
actual issues in my code. Learning to check whether a finding is in
`node_modules` or in `contracts/` is the key filter.



## 6. Acknowledgements

- Slither by Trail of Bits — https://github.com/crytic/slither
- OpenZeppelin Contracts v5 — ERC721URIStorage, Ownable
- Pinata (pinata.cloud) used for IPFS uploads
- Consulted Claude to understand the working of the contract and to      understand Solidity concepts and for documentation.
