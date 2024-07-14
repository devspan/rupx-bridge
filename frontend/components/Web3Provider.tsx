"use client"

import React from 'react'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider as EthersWeb3Provider } from '@ethersproject/providers'

function getLibrary(provider: any): EthersWeb3Provider {
  const library = new EthersWeb3Provider(provider)
  library.pollingInterval = 12000
  return library
}

const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      {children}
    </Web3ReactProvider>
  )
}

export default Web3Provider