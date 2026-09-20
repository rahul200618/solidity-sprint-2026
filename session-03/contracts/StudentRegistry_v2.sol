// SPDX-License-Identifier: MIT

pragma solidity >=0.8.2 <0.9.0;

/**
 * @title IStudentRegistry
 * @dev Interface exposing the read functions
 */


/**
 * @title StudentRegistry
 * @dev Register, update, and fetch student records
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */

 


interface IStudentRegistry {
    function getStudent(address _student) external view returns (string memory, uint256, StudentRegistry.Status);
}

contract StudentRegistry is IStudentRegistry {

    enum Status { Active, Inactive, Graduated }

    struct Student {
        string name;
        uint256 enrollmentId;
        Status status;
    }

    address public owner;

    mapping(address => Student) private students;
    mapping(address => bool) private isRegistered;

    event StudentRegistered(address indexed student, uint256 enrollmentId);
    event StatusUpdated(address indexed student, Status newStatus);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Owner registers a student BY their address
    function registerStudent(address _student, string memory _name, uint256 _enrollmentId) public onlyOwner {
        require(!isRegistered[_student], "Student already registered");

        students[_student] = Student(_name, _enrollmentId, Status.Active);
        isRegistered[_student] = true;

        emit StudentRegistered(_student, _enrollmentId);
    }

    // Student updates their own status
    function updateStatus(Status _status) public {
        require(isRegistered[msg.sender], "Student not registered");

        students[msg.sender].status = _status;

        emit StatusUpdated(msg.sender, _status);
    }

    function getStudent(address _student) public view override returns (string memory, uint256, Status) {
        require(isRegistered[_student], "Student not registered");

        Student memory s = students[_student];
        return (s.name, s.enrollmentId, s.status);
    }
}
