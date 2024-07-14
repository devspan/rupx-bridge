"use client"

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../contexts/Web3Context';
import { CHAIN_NAMES } from '../config/web3';
import { BRIDGE_ABI, BRIDGE_ADDRESSES, TOKEN_ABI, TOKEN_ADDRESSES } from '../config/bridge';
import { Tooltip } from './Tooltip';

const Bridge: React.FC = () => {
  const { account, chainId, connect, disconnect } = useWeb3();
  const [amount, setAmount] = useState<string>('');
  const [targetChain, setTargetChain] = useState<string>('');
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    checkAllowance();
  }, [account, chainId, amount]);

  const checkAllowance = async () => {
    if (!account || !chainId || !amount) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(TOKEN_ADDRESSES[chainId], TOKEN_ABI, signer);

    try {
      const allowance = await tokenContract.allowance(account, BRIDGE_ADDRESSES[chainId]);
      setIsApproved(allowance.gte(ethers.utils.parseEther(amount)));
    } catch (error) {
      console.error('Error checking allowance:', error);
    }
  };

  const handleApprove = async () => {
    if (!account || !chainId) return;
    setIsLoading(true);
    setFeedback(null);

    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(TOKEN_ADDRESSES[chainId], TOKEN_ABI, signer);

    try {
      const tx = await tokenContract.approve(BRIDGE_ADDRESSES[chainId], ethers.constants.MaxUint256);
      await tx.wait();
      setIsApproved(true);
      setFeedback({ type: 'success', message: 'Approval successful!' });
    } catch (error) {
      console.error('Approval failed:', error);
      setFeedback({ type: 'error', message: 'Approval failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!account || !chainId || !isApproved) return;
    setIsLoading(true);
    setFeedback(null);

    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();
    const bridgeContract = new ethers.Contract(BRIDGE_ADDRESSES[chainId], BRIDGE_ABI, signer);

    try {
      const tx = await bridgeContract.lockTokens(ethers.utils.parseEther(amount));
      await tx.wait();
      setFeedback({ type: 'success', message: `Successfully transferred ${amount} to ${targetChain}` });
    } catch (error) {
      console.error('Transfer failed:', error);
      setFeedback({ type: 'error', message: 'Transfer failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">Bridge</h2>
      {account ? (
        <div className="space-y-4">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">Connected Account</p>
            <p className="font-mono text-gray-800 dark:text-white">{account.slice(0, 6)}...{account.slice(-4)}</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">Network</p>
            <p className="font-semibold text-gray-800 dark:text-white">{chainId ? CHAIN_NAMES[chainId] || 'Unknown' : 'Not connected'}</p>
          </div>
          <Tooltip content="Enter the amount of tokens to transfer">
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </Tooltip>
          <Tooltip content="Select the target chain for the transfer">
            <select
              value={targetChain}
              onChange={(e) => setTargetChain(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select Target Chain</option>
              <option value="binance">Binance Testnet</option>
              <option value="rupaya">Rupaya Testnet</option>
            </select>
          </Tooltip>
          {!isApproved ? (
            <button
              onClick={handleApprove}
              disabled={isLoading}
              className="w-full p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Approving...' : 'Approve'}
            </button>
          ) : (
            <button
              onClick={handleTransfer}
              disabled={isLoading}
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Transferring...' : 'Transfer'}
            </button>
          )}
          {feedback && (
            <div className={`p-2 rounded ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {feedback.message}
            </div>
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