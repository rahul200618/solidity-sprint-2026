// SPDX-License-Identifier: MIT

pragma solidity >=0.8.2 <0.9.0;

/**
 * @title StudentRegistry
 * @dev Register, update, and fetch student records
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */

 contract StudentRegistry {
    enum Status {
        Active,
        Inactive,
        Graduated
    }

    struct Student{
        string name;
        uint256 enrollmentId;
        Status status;
    }

    mapping(address => Student) students;
    mapping(address => bool) isRegistered;

      function registerStudent(string memory _name, uint256 _enrollmentId) public {
        require(!isRegistered[msg.sender], "Student already registered");

        students[msg.sender] = Student(_name, _enrollmentId, Status.Active);
        isRegistered[msg.sender] = true;
    }
    function getStudent(address _student) public view returns (string memory, uint256, Status) {
        require(isRegistered[_student], "Student not registered");

        Student memory s = students[_student];
        return (s.name, s.enrollmentId, s.status);
    }

    function updateStatus(Status _status) public {
        require(isRegistered[msg.sender], "Student not registered");

        students[msg.sender].status = _status;
    }

}