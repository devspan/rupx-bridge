// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/BridgeToken.sol";

contract BridgeTokenTest is Test {
    ::BRIDGE_TOKEN:: public bridgeToken;
    address public owner;
    address public user1;
    address public user2;

    function setUp() public {
        owner = address(this);
        user1 = address(0x1);
        user2 = address(0x2);
        bridgeToken = new ::BRIDGE_TOKEN::("Bridge Token", "BT", 1000000 * 10**18);
    }

    function testInitialSupply() public {
        assertEq(bridgeToken.totalSupply(), 1000000 * 10**18);
        assertEq(bridgeToken.balanceOf(owner), 1000000 * 10**18);
    }

    function testTransfer() public {
        bridgeToken.transfer(user1, 100);
        assertEq(bridgeToken.balanceOf(user1), 100);
        
        vm.prank(user1);
        bridgeToken.transfer(user2, 50);
        assertEq(bridgeToken.balanceOf(user1), 50);
        assertEq(bridgeToken.balanceOf(user2), 50);
    }

    function testName() public {
        assertEq(bridgeToken.name(), "Bridge Token");
    }

    function testSymbol() public {
        assertEq(bridgeToken.symbol(), "BT");
    }
}