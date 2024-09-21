// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ISP} from "@ethsign/sign-protocol-evm/src/interfaces/ISP.sol";
import {Attestation} from "@ethsign/sign-protocol-evm/src/models/Attestation.sol";
import {DataLocation} from "@ethsign/sign-protocol-evm/src/models/DataLocation.sol";

contract AccountabilityManager is Ownable {
    ISP public spInstance;
    uint64 public schemaId;

    struct Task {
        address assignee;
        bool finished;
    }

    mapping(address => bool) public managers; // to track addresses of managers, this can be expanded to assign employees to managers in the future
    mapping(uint256 taskId => Task) public taskList; // tracks tasks

    error TaskNotMarkedCompletedYet();
    error TaskAssigneeAddressMismatch();
    error CallerIsNotAssignee();
    error CallerIsNotAManager();

    event TaskClaim(
        uint256 taskId,
        address indexed employeeAddress,
        address indexed managerAddress
    );
    event TaskCompleted(
        uint256 taskId,
        address indexed employeeAddress,
        address indexed managerAddress,
        uint64 attestationId
    );

    modifier onlyManager() {
        if (!managers[_msgSender()]) {
            revert CallerIsNotAManager();
        }
        _;
    }

    constructor() Ownable(_msgSender()) {}

    function setSPInstance(address instance) external onlyOwner {
        spInstance = ISP(instance);
    }

    function setSchemaID(uint64 schemaId_) external onlyOwner {
        schemaId = schemaId_;
    }

    // function for the contract owner to mark an address as manager
    function addManager(address managerAddress) external onlyOwner {
        managers[managerAddress] = true;
    }

    // function for the contract owner to remove an address from managers mapping
    function removeManager(address managerAddress) external onlyOwner {
        managers[managerAddress] = false;
    }

    // function for managers to assign tasks to employees
    function assignTask(uint taskId, address employee) external onlyManager {
        taskList[taskId].assignee = employee;
    }

    function claimTaskCompletion(
        uint256 taskId,
        address managerAddress
    ) external {
        Task memory task = taskList[taskId];
        if (task.assignee == _msgSender()) {
            taskList[taskId].finished = true;
        } else {
            revert CallerIsNotAssignee();
        }
        emit TaskClaim(taskId, _msgSender(), managerAddress);
    }

    function confirmTaskCompletion(
        uint256 taskId,
        address employeeAddress,
        uint256 projectId,
        bool completed,
        uint256 storypoints
    ) external onlyManager returns (uint64) {
        Task memory task = taskList[taskId];
        if (task.assignee == employeeAddress) {
            if (task.finished) {
                bytes[] memory recipient = new bytes[](1);
                recipient[0] = abi.encode(employeeAddress);

                // TODO: Change this to parameter
                bytes memory data = abi.encode(
                    projectId,
                    taskId,
                    completed,
                    storypoints
                );

                Attestation memory a = Attestation({
                    schemaId: schemaId,
                    linkedAttestationId: 0,
                    attestTimestamp: 0,
                    revokeTimestamp: 0,
                    attester: address(this),
                    validUntil: 0,
                    dataLocation: DataLocation.ONCHAIN,
                    revoked: false,
                    recipients: recipient,
                    data: data
                });
                uint64 attestationId = spInstance.attest(a, "", "", "");
                emit TaskCompleted(
                    taskId,
                    employeeAddress,
                    _msgSender(),
                    attestationId
                );
                return attestationId;
            } else {
                revert TaskNotMarkedCompletedYet();
            }
        } else {
            revert TaskAssigneeAddressMismatch();
        }
    }
}
