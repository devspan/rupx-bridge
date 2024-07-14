"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../contexts/Web3Context';
import { BRIDGE_ADDRESSES, TOKEN_ADDRESSES, CHAIN_IDS, RPC_URLS } from '../config/bridge';

const BRIDGE_ABI = [
  "function lockTokens(uint256 amount) external",
  "function unlockTokens(address to, uint256 amount, uint256 nonce, bytes memory signature) external"
];

const TOKEN_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)"
];

type TransactionStatus = 'idle' | 'pending' | 'success' | 'error';

const Bridge: React.FC = () => {
  const { account, chainId, connect } = useWeb3();
  const [amount, setAmount] = useState<string>('');
  const [isApproved, setIsApproved] = useState(false);
  const [balance, setBalance] = useState<string>('0');
  const [error, setError] = useState<string | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>('idle');

  const checkAllowanceAndBalance = useCallback(async () => {
    if (!account || !chainId || !amount) return;

    try {
      const provider = new ethers.providers.JsonRpcProvider(RPC_URLS[chainId as keyof typeof RPC_URLS]);
      const tokenContract = new ethers.Contract(TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES], TOKEN_ABI, provider);

      const allowance = await tokenContract.allowance(account, BRIDGE_ADDRESSES[chainId as keyof typeof BRIDGE_ADDRESSES]);
      setIsApproved(allowance.gte(ethers.utils.parseEther(amount)));

      const balanceWei = await tokenContract.balanceOf(account);
      setBalance(ethers.utils.formatEther(balanceWei));
      setError(null);
    } catch (error) {
      console.error('Error checking allowance and balance:', error);
      setError('Failed to fetch account information. Please ensure you are connected to the correct network.');
    }
  }, [account, chainId, amount]);

  useEffect(() => {
    checkAllowanceAndBalance();
  }, [checkAllowanceAndBalance]);

  const handleApprove = async () => {
    if (!account || !chainId) return;

    setTransactionStatus('pending');
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const tokenContract = new ethers.Contract(TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES], TOKEN_ABI, signer);

      const tx = await tokenContract.approve(BRIDGE_ADDRESSES[chainId as keyof typeof BRIDGE_ADDRESSES], ethers.constants.MaxUint256);
      await tx.wait();
      setIsApproved(true);
      setError(null);
      setTransactionStatus('success');
      console.log('Approval successful');
    } catch (error) {
      console.error('Approval failed:', error);
      setError('Approval failed. Please ensure you are connected to the correct network and have sufficient funds.');
      setTransactionStatus('error');
    }
  };

  const handleTransfer = async () => {
    if (!account || !chainId || !isApproved) return;

    setTransactionStatus('pending');
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const bridgeContract = new ethers.Contract(BRIDGE_ADDRESSES[chainId as keyof typeof BRIDGE_ADDRESSES], BRIDGE_ABI, signer);

      const tx = await bridgeContract.lockTokens(ethers.utils.parseEther(amount));
      await tx.wait();
      setError(null);
      setTransactionStatus('success');
      console.log(`Transferred ${amount} tokens`);
    } catch (error) {
      console.error('Transfer failed:', error);
      setError('Transfer failed. Please ensure you are connected to the correct network and have sufficient funds.');
      setTransactionStatus('error');
    }
  };

  const renderTransactionStatus = () => {
    switch (transactionStatus) {
      case 'pending':
        return <div className="text-yellow-500">Transaction pending...</div>;
      case 'success':
        return <div className="text-green-500">Transaction successful!</div>;
      case 'error':
        return <div className="text-red-500">Transaction failed. Please try again.</div>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">Bridge</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {renderTransactionStatus()}
      {account ? (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
          <p className="text-gray-600 dark:text-gray-300">Balance: {balance} tokens</p>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {!isApproved ? (
            <button
              onClick={handleApprove}
              disabled={transactionStatus === 'pending'}
              className="w-full p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300 disabled:opacity-50"
            >
              {transactionStatus === 'pending' ? 'Approving...' : 'Approve'}
            </button>
          ) : (
            <button
              onClick={handleTransfer}
              disabled={transactionStatus === 'pending'}
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 disabled:opacity-50"
            >
              {transactionStatus === 'pending' ? 'Transferring...' : 'Transfer'}
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={connect}
          className="w-full p-3 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 font-semibold"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default Bridge;