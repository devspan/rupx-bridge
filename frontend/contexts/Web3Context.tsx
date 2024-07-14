"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'

interface Web3ContextType {
  account: string | null
  chainId: number | null
  connect: () => Promise<void>
  disconnect: () => void
}

const Web3Context = createContext<Web3ContextType | null>(null)

export const Web3ContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { account, chainId, connector } = useWeb3React()
  const [connecting, setConnecting] = useState(false)

  const connect = async () => {
    if (connector instanceof MetaMask) {
      setConnecting(true)
      try {
        await connector.activate()
      } catch (error) {
        console.error('Failed to connect:', error)
      } finally {
        setConnecting(false)
      }
    } else {
      console.error('MetaMask connector not found')
    }
  }

  const disconnect = async () => {
    if (connector) {
      try {
        if (connector.deactivate) {
          await connector.deactivate()
        } else {
          await connector.resetState()
        }
      } catch (error) {
        console.error('Failed to disconnect:', error)
      }
    }
  }

  useEffect(() => {
    if (connector instanceof MetaMask) {
      connector.connectEagerly().catch(() => {
        console.debug('Failed to connect eagerly to metamask')
      })
    }
  }, [connector])

  return (
    <Web3Context.Provider value={{ account: account ?? null, chainId: chainId ?? null, connect, disconnect }}>
      {children}
    </Web3Context.Provider>
  )
}

export const useWeb3 = () => {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3ContextProvider')
  }
  return context
}