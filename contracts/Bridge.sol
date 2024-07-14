// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract Bridge is ReentrancyGuard, Ownable, Pausable {
    IERC20 public token;
    uint256 public nonce;
    uint256 public fee;
    mapping(uint256 => bool) public processedNonces;

    event TokensLocked(address indexed from, uint256 amount, uint256 nonce, uint256 fee);
    event TokensUnlocked(address indexed to, uint256 amount, uint256 nonce, uint256 fee);
    event FeeUpdated(uint256 newFee);
    event EmergencyWithdrawal(address indexed owner, uint256 amount);

    constructor(address _token, uint256 _fee) Ownable(msg.sender) {
        token = IERC20(_token);
        fee = _fee;
    }

    function lockTokens(uint256 amount) external nonReentrant whenNotPaused {
        uint256 amountAfterFee = amount - fee;
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        require(token.transfer(owner(), fee), "Fee transfer failed");
        emit TokensLocked(msg.sender, amountAfterFee, nonce, fee);
        nonce++;
    }

    function unlockTokens(address to, uint256 amount, uint256 _nonce, bytes memory signature) external onlyOwner nonReentrant whenNotPaused {
        bytes32 messageHash = keccak256(abi.encodePacked(to, amount, _nonce, address(this)));
        bytes32 prefixedHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));
        require(recoverSigner(prefixedHash, signature) == owner(), "Invalid signature");
        require(!processedNonces[_nonce], "Transfer already processed");
        processedNonces[_nonce] = true;
        require(token.transfer(to, amount), "Transfer failed");
        emit TokensUnlocked(to, amount, _nonce, fee);
    }

    function updateFee(uint256 newFee) external onlyOwner {
        fee = newFee;
        emit FeeUpdated(newFee);
    }

    function emergencyWithdraw(uint256 amount) external onlyOwner {
        require(token.transfer(owner(), amount), "Transfer failed");
        emit EmergencyWithdrawal(owner(), amount);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
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
