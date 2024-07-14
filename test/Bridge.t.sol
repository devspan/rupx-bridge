// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../contracts/Bridge.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20 {
    constructor() ERC20("Mock Token", "MTK") {
        _mint(msg.sender, 1000000 * 10**18);
    }
}

contract BridgeTest is Test {
    Bridge public bridge;
    MockToken public token;
    address public owner;
    address public user;

    function setUp() public {
        owner = address(this);
        user = address(0x1);
        token = new MockToken();
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

        bytes32 message = keccak256(abi.encodePacked(recipient, amount, nonce, address(bridge)));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(1, message);
        bytes memory signature = abi.encodePacked(r, s, v);

        bridge.unlockTokens(recipient, amount, nonce, signature);

        assertEq(token.balanceOf(recipient), amount);
    }
}