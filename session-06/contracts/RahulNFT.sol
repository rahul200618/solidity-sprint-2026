// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RahulNFT is ERC721URIStorage, Ownable {

    uint256 public tokenId;

    constructor() ERC721("Rahul Collection", "RNFT") Ownable(msg.sender) {}

    function mint(address _to, string memory _uri) external onlyOwner returns (uint256) {
        tokenId++;
        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, _uri);
        return tokenId;
    }

    function totalMinted() external view returns (uint256) {
        return tokenId;
    }
}