"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { BrowserProvider } from "ethers"

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
  on?: (event: string, callback: (...args: unknown[]) => void) => void
  removeListener?: (event: string, callback: (...args: unknown[]) => void) => void
}

declare global {
  interface Window {
    ethereum?: EthereumProvider
  }
}

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function Navbar() {
  const [walletAddress, setWalletAddress] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)

  const connectWallet = useCallback(async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask or another Ethereum wallet is required.")
        return
      }

      setIsConnecting(true)

      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()

      setWalletAddress(address)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnectWallet = useCallback(() => {
    setWalletAddress("")
  }, [])

  useEffect(() => {
    if (!window.ethereum?.request) return

    async function checkConnectedWallet() {
      try {
        const accounts = (await window.ethereum?.request({
          method: "eth_accounts",
        })) as string[]

        if (accounts?.[0]) {
          setWalletAddress(accounts[0])
        }
      } catch (error) {
        console.error("Failed to check wallet:", error)
      }
    }

    checkConnectedWallet()

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[]
      setWalletAddress(accounts?.[0] || "")
    }

    window.ethereum.on?.("accountsChanged", handleAccountsChanged)

    return () => {
      window.ethereum?.removeListener?.("accountsChanged", handleAccountsChanged)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-black text-black">
            P
          </div>

          <div className="leading-tight">
            <p className="text-sm font-bold text-white">PixelAds</p>
            <p className="text-xs text-white/50">x402 takeover wall</p>
          </div>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-white/70 transition hover:text-white"
          >
            Wall
          </Link>

          <Link
            href="/how-it-works"
            className="text-sm font-medium text-white/70 transition hover:text-white"
          >
            How it works
          </Link>

          <Link
            href="/leaderboard"
            className="text-sm font-medium text-white/70 transition hover:text-white"
          >
            Leaderboard
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {walletAddress ? (
            <>
              <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 sm:block">
                {shortenAddress(walletAddress)}
              </div>

              <button
                onClick={disconnectWallet}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="rounded-full bg-white px-4 py-2 text-sm font-bold text-black transition hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          )}
        </div>
      </nav>
    </header>
  )
}