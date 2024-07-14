// config/bridge.ts

import { ethers } from 'ethers';

export const BRIDGE_ABI: ethers.ContractInterface = [
  "function lockTokens(uint256 amount) external",
  "function unlockTokens(address to, uint256 amount, uint256 nonce, bytes memory signature) external",
  "event TokensLocked(address indexed from, uint256 amount, uint256 nonce)",
  "event TokensUnlocked(address indexed to, uint256 amount, uint256 nonce)"
];

export const BRIDGE_ADDRESSES: { [key: number]: string } = {
  799: "0x...", // Replace with actual Rupaya testnet bridge address
  97: "0x..."  // Replace with actual Binance testnet bridge address
};

export const TOKEN_ABI: ethers.ContractInterface = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)"
];

export const TOKEN_ADDRESSES: { [key: number]: string } = {
  799: "0x...", // Replace with actual Rupaya testnet token address
  97: "0x..."  // Replace with actual Binance testnet token address
};
