"use client"

import { useEffect, useState } from "react"
import type { PixelTile } from "@/types/pixel"

const GRID_COLUMNS = 30

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function PixelGrid() {
  const [tiles, setTiles] = useState<PixelTile[]>([])
  const [buyerAddress, setBuyerAddress] = useState("")
  const [selectedTile, setSelectedTile] = useState<PixelTile | null>(null)
  const [isBuying, setIsBuying] = useState(false)
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [twitterHandle, setTwitterHandle] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  async function loadTiles() {
    const response = await fetch("/api/tiles")
    const data = (await response.json()) as { tiles: PixelTile[] }
    setTiles(data.tiles)
  }

    async function buySelectedTile() {
    if (!selectedTile || !buyerAddress.trim()) return

    try {
        setIsBuying(true)
        setIsUploading(true)

        let uploadData:
        | {
            imageIpfsUri: string
            imageGatewayUrl: string
            metadataIpfsUri: string
            metadataGatewayUrl: string
            metadata: {
                external_url: string
            }
            }
        | undefined

        if (selectedImage) {
        const formData = new FormData()
        formData.append("image", selectedImage)
        formData.append("tileId", selectedTile.id)
        formData.append("buyerAddress", buyerAddress.trim())
        formData.append("twitterHandle", twitterHandle.trim())

        const uploadResponse = await fetch("/api/ipfs/upload", {
            method: "POST",
            body: formData,
        })

        uploadData = await uploadResponse.json()

        if (!uploadResponse.ok) {
            throw new Error(
            (uploadData as { error?: string }).error || "Failed to upload to IPFS"
            )
        }
        }

        setIsUploading(false)

        const response = await fetch(`/api/tiles/${selectedTile.id}/buy`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            buyerAddress: buyerAddress.trim(),
            imageIpfsUri: uploadData?.imageIpfsUri,
            imageGatewayUrl: uploadData?.imageGatewayUrl,
            metadataIpfsUri: uploadData?.metadataIpfsUri,
            metadataGatewayUrl: uploadData?.metadataGatewayUrl,
            twitterHandle: twitterHandle.trim().replace(/^@/, ""),
            twitterUrl: twitterHandle.trim()
            ? `https://x.com/${twitterHandle.trim().replace(/^@/, "")}`
            : "",
        }),
        })

        const data = await response.json()

        if (!response.ok) {
        throw new Error(data.error || "Failed to buy tile")
        }

        await loadTiles()
        setSelectedTile(data.tile)
        setSelectedImage(null)
    } catch (error) {
        console.error(error)
        alert(error instanceof Error ? error.message : "Failed to buy tile")
    } finally {
        setIsBuying(false)
        setIsUploading(false)
    }
    }
  useEffect(() => {
    loadTiles()
  }, [])

  function BuyPanel() {
    if (!selectedTile) {
      return (
        <div className="flex h-full min-h-[calc(100dvh-120px)] items-center justify-center text-center text-sm text-white/40">
          Select a tile to view price and ownership.
        </div>
      )
    }

    return (
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
          Selected tile
        </p>

        <h2 className="mt-2 text-3xl font-black text-white">
          #{selectedTile.id}
        </h2>

        <div className="mt-5 space-y-4 text-sm">
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-white/40">Owner</p>
            <p className="mt-1 font-semibold text-white">
              {selectedTile.ownerAddress
                ? shortenAddress(selectedTile.ownerAddress)
                : "Unowned"}
            </p>
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-white/40">Price to buy</p>
            <p className="mt-1 text-2xl font-black text-white">
              ${selectedTile.nextBuyoutPriceUsd.toFixed(2)}
            </p>
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-white/40">Times purchased</p>
            <p className="mt-1 font-semibold text-white">
              {selectedTile.purchaseCount}
            </p>
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Demo buyer address
            </label>

            <input
              value={buyerAddress}
              onChange={(event) => setBuyerAddress(event.target.value)}
              placeholder="0x..."
              className="mt-3 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/30"
            />
          </div>
        </div>
        <div className="rounded-2xl bg-white/5 p-4">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                Tile image
            </label>

            <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                setSelectedImage(event.target.files?.[0] || null)
                }}
                className="mt-3 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-3 file:py-1 file:text-xs file:font-bold file:text-black"
            />

            <p className="mt-2 text-xs text-white/40">
                This image will be uploaded to IPFS and saved in the tile metadata.
            </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-4">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                X handle
            </label>

            <div className="mt-3 flex overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                <span className="flex items-center border-r border-white/10 px-3 text-sm text-white/40">
                x.com/
                </span>

                <input
                value={twitterHandle}
                onChange={(event) => setTwitterHandle(event.target.value)}
                placeholder="yourhandle"
                className="w-full bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
                />
            </div>
            </div>

            {selectedTile.imageGatewayUrl ? (
            <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                Current image
                </p>

                <img
                src={selectedTile.imageGatewayUrl}
                alt={`Tile ${selectedTile.id}`}
                className="mt-3 aspect-square w-full rounded-2xl object-cover"
                />

                {selectedTile.metadataGatewayUrl ? (
                <a
                    href={selectedTile.metadataGatewayUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 block text-xs font-semibold text-white/60 underline"
                >
                    View metadata
                </a>
                ) : null}
            </div>
            ) : null}

        <button
          onClick={buySelectedTile}
          disabled={isBuying || !buyerAddress.trim()}
          className="mt-5 w-full rounded-2xl bg-white px-4 py-3 text-sm font-black text-black transition hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isBuying
            ? isUploading
                ? "Uploading to IPFS..."
                : "Buying..."
            : selectedTile.ownerAddress
                ? "Force Buy Tile"
                : "Buy Tile"}
        </button>
      </div>
    )
  }

  return (
    <>
      <section className="w-full px-4 py-6 pb-40 lg:min-h-[calc(100dvh-69px)] lg:pl-[440px] lg:pr-6 lg:pb-6">
        <div className="min-h-[calc(100dvh-117px)] w-full overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-white md:text-5xl">
                PixelAds Wall
              </h1>

              <p className="mt-2 text-sm text-white/50 md:text-base">
                6,000 fixed-position tiles. Buy open tiles for $2 or take over
                owned tiles for 5% more.
              </p>
            </div>
          </div>

          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${GRID_COLUMNS}, minmax(18px, 1fr))`,
              width: "100%",
              minWidth: "780px",
              maxWidth: "100%",
            }}
          >
            {tiles.map((tile) => (
              <button
                key={tile.id}
                onClick={() => {
                  setSelectedTile(tile)
                  setMobilePanelOpen(true)
                }}
                className={[
                  "aspect-square rounded-md border transition hover:scale-110 hover:border-white",
                  tile.ownerAddress
                    ? "border-emerald-400/40 bg-emerald-400/40"
                    : "border-white/10 bg-white/5",
                  selectedTile?.id === tile.id ? "ring-2 ring-white" : "",
                ].join(" ")}
                title={`Tile ${tile.id}`}
              />
            ))}
          </div>
        </div>
      </section>

      <aside className="fixed left-0 top-[69px] z-40 hidden h-[calc(100dvh-69px)] w-[420px] overflow-y-auto border-r border-white/10 bg-black/95 p-5 shadow-2xl backdrop-blur-xl lg:block">
        <BuyPanel />
      </aside>

      <aside
        className={[
          "fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border border-white/10 bg-black/95 p-4 shadow-2xl backdrop-blur-xl transition-transform duration-300 lg:hidden",
          mobilePanelOpen ? "translate-y-0" : "translate-y-[calc(100%-76px)]",
        ].join(" ")}
      >
        <button
          onClick={() => setMobilePanelOpen((current) => !current)}
          className="mb-4 flex w-full items-center justify-between rounded-2xl bg-white/5 px-4 py-3 text-left"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              {selectedTile ? `Tile #${selectedTile.id}` : "Select a tile"}
            </p>

            <p className="mt-1 text-sm font-bold text-white">
              {selectedTile
                ? `$${selectedTile.nextBuyoutPriceUsd.toFixed(2)}`
                : "Tap a tile to buy or preview"}
            </p>
          </div>

          <span className="text-sm font-black text-white/60">
            {mobilePanelOpen ? "Close" : "Open"}
          </span>
        </button>

        <div className="max-h-[65vh] overflow-y-auto pb-2">
          <BuyPanel />
        </div>
      </aside>
    </>
  )
}