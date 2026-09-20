// SPDX-License-Identifier: MIT License

pragma solidity >=0.8.2 <0.9.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */

contract Simple_Storage {

    string public message;
    address public lastEditor;

    
    //update the message and store the address of the last editor
    function updateMessage(string memory _newMessage) public {
        message = _newMessage;
        lastEditor = msg.sender;
    }

    //reads the message last sent
    function getMessage() public view returns (string memory) {
        return message;
    }

    //fetches the address of the last message editor
    function getLastEditor() public view returns (address) {
        return lastEditor;
    }
}