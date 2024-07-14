// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../contracts/Bridge.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "forge-std/Signature.sol";

contract BridgeTest is Test {
    Bridge bridge;
    ERC20Mock token;
    address owner = address(this);
    address user = address(2);
    uint256 initialBalance = 100 ether;
    uint256 fee = 1 ether;

    function setUp() public {
        token = new ERC20Mock("Mock Token", "MKT");
        token.mint(user, initialBalance);
        bridge = new Bridge(address(token), fee);
    }

    function testLockTokens() public {
        uint256 lockAmount = 100 ether;
        uint256 expectedAmountAfterFee = lockAmount - fee;
        vm.prank(user);
        token.approve(address(bridge), lockAmount);
        vm.prank(user);
        bridge.lockTokens(lockAmount);
        assertEq(token.balanceOf(user), initialBalance - lockAmount);
        assertEq(token.balanceOf(address(bridge)), expectedAmountAfterFee);
        assertEq(token.balanceOf(owner), fee);
    }

    function testUnlockTokens() public {
        uint256 lockAmount = 100 ether;
        uint256 unlockAmount = 50 ether;

        // Lock tokens first
        vm.prank(user);
        token.approve(address(bridge), lockAmount);
        vm.prank(user);
        bridge.lockTokens(lockAmount);

        // Generate a valid signature
        bytes32 messageHash = keccak256(abi.encodePacked(user, unlockAmount, bridge.nonce() - 1, address(bridge)));
        bytes32 prefixedHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(uint256(uint160(owner)), prefixedHash);
        bytes memory signature = abi.encodePacked(r, s, v);

        // Unlock tokens
        vm.prank(owner);
        bridge.unlockTokens(user, unlockAmount, bridge.nonce() - 1, signature);

        assertEq(token.balanceOf(user), initialBalance - lockAmount + unlockAmount);
        assertEq(token.balanceOf(address(bridge)), lockAmount - unlockAmount - fee);
    }
}

// Mock ERC20 token for testing purposes
contract ERC20Mock is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
