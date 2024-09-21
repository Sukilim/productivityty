export const AccountabilityManager = {
  contractName: "AccountabilityManager",
  address: "0xd9825A7710EBcba38286C504D10F192F79d16dFA",
  sourceName: "",
  abi: [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "CallerIsNotAManager",
      type: "error",
    },
    {
      inputs: [],
      name: "CallerIsNotAssignee",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "OwnableInvalidOwner",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "OwnableUnauthorizedAccount",
      type: "error",
    },
    {
      inputs: [],
      name: "TaskAssigneeAddressMismatch",
      type: "error",
    },
    {
      inputs: [],
      name: "TaskNotMarkedCompletedYet",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "taskId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "employeeAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "managerAddress",
          type: "address",
        },
      ],
      name: "TaskClaim",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "taskId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "employeeAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "managerAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint64",
          name: "attestationId",
          type: "uint64",
        },
      ],
      name: "TaskCompleted",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "managerAddress",
          type: "address",
        },
      ],
      name: "addManager",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "taskId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "employee",
          type: "address",
        },
      ],
      name: "assignTask",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "taskId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "managerAddress",
          type: "address",
        },
      ],
      name: "claimTaskCompletion",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "taskId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "employeeAddress",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "projectId",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "completed",
          type: "bool",
        },
        {
          internalType: "uint256",
          name: "storypoints",
          type: "uint256",
        },
      ],
      name: "confirmTaskCompletion",
      outputs: [
        {
          internalType: "uint64",
          name: "",
          type: "uint64",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "managers",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "managerAddress",
          type: "address",
        },
      ],
      name: "removeManager",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "schemaId",
      outputs: [
        {
          internalType: "uint64",
          name: "",
          type: "uint64",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "instance",
          type: "address",
        },
      ],
      name: "setSPInstance",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint64",
          name: "schemaId_",
          type: "uint64",
        },
      ],
      name: "setSchemaID",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "spInstance",
      outputs: [
        {
          internalType: "contract ISP",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "taskId",
          type: "uint256",
        },
      ],
      name: "taskList",
      outputs: [
        {
          internalType: "address",
          name: "assignee",
          type: "address",
        },
        {
          internalType: "bool",
          name: "finished",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
};

