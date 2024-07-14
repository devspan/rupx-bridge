"use client"

import React from 'react'
import { Web3ReactProvider, Web3ReactHooks } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { Web3ContextProvider } from '../contexts/Web3Context'
import { hooks, metaMask } from '../connectors/metaMask'

const connectors: [MetaMask, Web3ReactHooks][] = [
  [metaMask, hooks]
]

const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Web3ReactProvider connectors={connectors}>
      <Web3ContextProvider>{children}</Web3ContextProvider>
    </Web3ReactProvider>
  )
}

export default Web3Provider