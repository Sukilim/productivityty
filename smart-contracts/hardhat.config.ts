import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
	solidity: {
		version: "0.8.20",  // Match the required version
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
};

export default config;
