// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../contracts/Bridge.sol";
import "../contracts/BridgeToken.sol";

contract BridgeTest is Test {
    Bridge public bridge;
    BridgeToken public token;
    address public owner;
    address public user;
    uint256 private ownerPrivateKey;

    function setUp() public {
        ownerPrivateKey = 0xA11CE;  // Replace with a actual private key for testing
        owner = vm.addr(ownerPrivateKey);
        user = address(0x1);
        token = new BridgeToken("Bridge Token", "BT", 1000000 * 10**18);
        vm.prank(owner);
        bridge = new Bridge(address(token));
        token.transfer(user, 1000 * 10**18);
    }

    function testLockTokens() public {
        vm.startPrank(user);
        token.approve(address(bridge), 100 * 10**18);
        bridge.lockTokens(100 * 10**18);
        vm.stopPrank();

        assertEq(token.balanceOf(address(bridge)), 100 * 10**18);
        assertEq(token.balanceOf(user), 900 * 10**18);
    }

    function testUnlockTokens() public {
        uint256 nonce = 0;
        uint256 amount = 100 * 10**18;
        address recipient = address(0x2);

        // Lock tokens first
        vm.startPrank(user);
        token.approve(address(bridge), amount);
        bridge.lockTokens(amount);
        vm.stopPrank();

        // Create the message hash
        bytes32 messageHash = keccak256(abi.encodePacked(recipient, amount, nonce, address(bridge)));
        bytes32 prefixedHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));

        // Sign the message
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerPrivateKey, prefixedHash);
        bytes memory signature = abi.encodePacked(r, s, v);

        // Unlock tokens
        vm.prank(owner);
        bridge.unlockTokens(recipient, amount, nonce, signature);

        assertEq(token.balanceOf(recipient), amount);
    }
}