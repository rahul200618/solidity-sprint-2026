// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RahulNFT is ERC721URIStorage, Ownable {

    uint256 public tokenId;

    constructor() ERC721("Rahul Collection", "RNFT") Ownable(msg.sender) {}

    // Fixed: URI set before _safeMint to prevent reentrancy ordering issue
    // Fixed: parameter names without underscore prefix
    function mint(address to, string memory uri) external onlyOwner returns (uint256) {
        tokenId++;
        _setTokenURI(tokenId, uri);  // effect before external call
        _safeMint(to, tokenId);       // external call last
        return tokenId;
    }

    function totalMinted() external view returns (uint256) {
        return tokenId;
    }
}