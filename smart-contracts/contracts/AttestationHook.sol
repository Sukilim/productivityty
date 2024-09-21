// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IERC20 } from "@openzeppelin/contracts/interfaces/IERC20.sol";
import { ISP } from "@ethsign/sign-protocol-evm/src/interfaces/ISP.sol";
import { ISPHook } from "@ethsign/sign-protocol-evm/src/interfaces/ISPHook.sol";
import { Attestation } from "@ethsign/sign-protocol-evm/src/models/Attestation.sol";

// @dev This contract manages attestation data validation logic.
contract DataValidator is Ownable {
    uint256 public threshold;

    error TaskNotCompleted();
    error InvalidTaskId(uint64 taskId);

    constructor() Ownable(_msgSender()) { }

	// @dev Internal function to validate that the task is marked as "Completed"
    function _checkTaskCompleted(bool completed) internal pure {
        if (!completed) {
            revert TaskNotCompleted();
        }
    }

    // @dev Optional function to validate Task ID (example logic)
    function _validateTaskId(uint64 taskId) internal pure {
		// TODO: check if taskID exists in the contract
        if (taskId == 0) {
            revert InvalidTaskId(taskId);  // Example: task ID cannot be zero
        }
    }

	// TODO: check projectID is valid

}

// @dev This contract implements the actual schema hook.
contract DataValidatorHook is ISPHook, DataValidator {
    error UnsupportedOperation();
	error InsufficientFunds();

	uint256 public paymentPerStoryPoint = 0.001 ether; 

    function didReceiveAttestation(
        address, // attester
        uint64, // schemaId
        uint64 attestationId,
        bytes calldata // extraData
    )
        external
        payable
    {
        Attestation memory attestation = ISP(_msgSender()).getAttestation(attestationId);
        // _checkThreshold(abi.decode(attestation.data, (uint256)));
		( uint64 projectId, uint64 taskId, bool completed, uint64 storyPoints ) = abi.decode(attestation.data, (uint64, uint64, bool, uint64));
		_checkTaskCompleted(completed);
		_validateTaskId(taskId);

		uint256 paymentAmount = storyPoints * paymentPerStoryPoint;
		if (address(this).balance < paymentAmount) {
			revert InsufficientFunds();
		}
		address employee = abi.decode(attestation.recipients[0], ( address ));

		// Transfer the calculated payment to the attester (user who completed the task)
		(bool success, ) = employee.call{value: paymentAmount}("");
		require(success, "Payment transfer failed");
    }

    function didReceiveAttestation(
        address, // attester
        uint64, // schemaId
        uint64, // attestationId
        IERC20, // resolverFeeERC20Token
        uint256, // resolverFeeERC20Amount
        bytes calldata // extraData
    )
        external
        pure
    {
        revert UnsupportedOperation();
    }

    function didReceiveRevocation(
        address, // attester
        uint64, // schemaId
        uint64, // attestationId
        bytes calldata // extraData
    )
        external
        payable
    {
        revert UnsupportedOperation();
    }

    function didReceiveRevocation(
        address, // attester
        uint64, // schemaId
        uint64, // attestationId
        IERC20, // resolverFeeERC20Token
        uint256, // resolverFeeERC20Amount
        bytes calldata // extraData
    )
        external
        pure
    {
        revert UnsupportedOperation();
    }
}
