// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Bridge is ReentrancyGuard, Ownable {
    IERC20 public token;
    uint256 public nonce;
    mapping(bytes32 => bool) public processedNonces;

    event TokensLocked(address indexed from, uint256 amount, uint256 nonce);
    event TokensUnlocked(address indexed to, uint256 amount, uint256 nonce);

    constructor(address _token) Ownable(msg.sender) {
        token = IERC20(_token);
    }

    function lockTokens(uint256 amount) external nonReentrant {
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        emit TokensLocked(msg.sender, amount, nonce);
        nonce++;
    }

    function unlockTokens(address to, uint256 amount, uint256 _nonce, bytes memory signature) external onlyOwner nonReentrant {
        bytes32 messageHash = keccak256(abi.encodePacked(to, amount, _nonce, address(this)));
        bytes32 prefixedHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));
        require(recoverSigner(prefixedHash, signature) == owner(), "Invalid signature");
        require(!processedNonces[prefixedHash], "Transfer already processed");
        processedNonces[prefixedHash] = true;
        require(token.transfer(to, amount), "Transfer failed");
        emit TokensUnlocked(to, amount, _nonce);
    }

    function recoverSigner(bytes32 message, bytes memory sig) internal pure returns (address) {
        require(sig.length == 65, "Invalid signature length");
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
        if (v < 27) {
            v += 27;
        }
        return ecrecover(message, v, r, s);
    }
}