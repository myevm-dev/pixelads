"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { BrowserProvider } from "ethers"
import { ThemeToggle } from "@/components/ThemeToggle"

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
  const [theme, setTheme] = useState<"light" | "dark">("light")

  const connectWallet = useCallback(async () => {
    try {
      const ethereumProvider = window.ethereum

      if (!ethereumProvider) {
        alert("MetaMask or another Ethereum wallet is required.")
        return
      }

      setIsConnecting(true)

      const provider = new BrowserProvider(ethereumProvider)
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
    const currentTheme =
      document.documentElement.getAttribute("data-theme") === "light"
        ? "light"
        : "dark"

    setTheme(currentTheme)

    const observer = new MutationObserver(() => {
      const nextTheme =
        document.documentElement.getAttribute("data-theme") === "light"
          ? "light"
          : "dark"

      setTheme(nextTheme)
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const maybeEthereumProvider = window.ethereum

    if (!maybeEthereumProvider) return

    const ethereumProvider: EthereumProvider = maybeEthereumProvider

    async function checkConnectedWallet() {
      try {
        const accounts = (await ethereumProvider.request({
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

    ethereumProvider.on?.("accountsChanged", handleAccountsChanged)

    return () => {
      ethereumProvider.removeListener?.(
        "accountsChanged",
        handleAccountsChanged
      )
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <nav className="relative mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center">
          <Link href="/" className="flex items-center">
            <Image
              src={
                theme === "light"
                  ? "/newlight.png"
                  : "/logo-dark.png"
              }
              alt="Dominance"
              width={300}
              height={80}
              priority
              className="h-32 w-auto object-contain"
            />
          </Link>
        </div>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-semibold tracking-wide text-white/70 transition hover:text-white"
          >
            BATTLE
          </Link>

          <Link
            href="/how-it-works"
            className="text-sm font-semibold tracking-wide text-white/70 transition hover:text-white"
          >
            WTF
          </Link>

          <Link
            href="/leaderboard"
            className="text-sm font-semibold tracking-wide text-white/70 transition hover:text-white"
          >
            LEADERS
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <ThemeToggle />

          {walletAddress ? (
            <>
              <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 sm:block">
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