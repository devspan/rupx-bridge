// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/Bridge.sol";
import "../contracts/BridgeToken.sol";

contract DeployBridge is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address tokenAddress = vm.envAddress("TOKEN_ADDRESS");
        uint256 fee = 1 ether;  // Set your desired fee here

        vm.startBroadcast(deployerPrivateKey);

        // Deploy BridgeToken if TOKEN_ADDRESS is not provided
        if (tokenAddress == address(0)) {
            BridgeToken token = new BridgeToken("Bridge Token", "BT", 1000000 * 10**18);
            tokenAddress = address(token);
            console.log("BridgeToken deployed at:", tokenAddress);
        }

        // Deploy Bridge with fee parameter
        Bridge bridge = new Bridge(tokenAddress, fee);
        console.log("Bridge deployed at:", address(bridge));

        vm.stopBroadcast();
    }
}
