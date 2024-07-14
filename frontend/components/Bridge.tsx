"use client"

import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { CHAIN_NAMES } from '../config/web3';

const Bridge: React.FC = () => {
  const { account, chainId, connect, disconnect } = useWeb3();
  const [amount, setAmount] = useState<string>('');
  const [targetChain, setTargetChain] = useState<string>('');

  const handleTransfer = () => {
    // TODO: Implement transfer logic
    console.log(`Transferring ${amount} to ${targetChain}`);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">RupX Bridge</h2>
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
          <button
            onClick={disconnect}
            className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
          >
            Disconnect Wallet
          </button>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <select
            value={targetChain}
            onChange={(e) => setTargetChain(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Select Target Chain</option>
            <option value="binance">Binance Testnet</option>
            <option value="rupaya">Rupaya Testnet</option>
          </select>
          <button
            onClick={handleTransfer}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          >
            Transfer
          </button>
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