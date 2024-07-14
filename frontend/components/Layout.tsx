"use client"

import React from 'react';
import Link from 'next/link';
import { useWeb3 } from '../contexts/Web3Context';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { account, connect, disconnect } = useWeb3();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-900 dark:to-blue-900">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">EVM Bridge</h1>
          </div>
          <nav className="hidden md:flex space-x-4">
            <Link href="/" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Dashboard</Link>
            <Link href="/bridge" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Bridge</Link>
            <Link href="/history" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">History</Link>
          </nav>
          <div>
            {account ? (
              <button onClick={disconnect} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300">
                Disconnect
              </button>
            ) : (
              <button onClick={connect} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300">
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="bg-white dark:bg-gray-800 shadow-md mt-8">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            © 2024 EVM Bridge. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Terms of Service</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;