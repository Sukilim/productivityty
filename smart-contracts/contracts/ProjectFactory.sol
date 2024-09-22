// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./AccountabilityManager.sol";

contract ProjectFactory is Ownable {
    ISP public spInstance;
    uint64 public schemaId;

    AccountabilityManager[] public deployedProjects;

    event ProjectDeployed(
        address indexed projectAddress,
        address indexed owner
    );

    constructor(address _spInstance, uint64 _schemaId) Ownable(msg.sender) {
        spInstance = ISP(_spInstance);
        schemaId = _schemaId;
    }

    function deployProject() external returns (address) {
        AccountabilityManager newProject = new AccountabilityManager();
        newProject.transferOwnership(msg.sender);
        newProject.setSPInstance(address(spInstance));
        newProject.setSchemaID(schemaId);

        deployedProjects.push(newProject);

        emit ProjectDeployed(address(newProject), msg.sender);
        return address(newProject);
    }

    function updateSPInstance(address _newSpInstance) external onlyOwner {
        spInstance = ISP(_newSpInstance);
    }

    function updateSchemaId(uint64 _newSchemaId) external onlyOwner {
        schemaId = _newSchemaId;
    }
}
