import type { PixelPurchase, PixelTile } from "@/types/pixel"
import { calculatePixelPurchase, PIXEL_MARKET_CONFIG } from "./pixel-market"

const GRID_COLUMNS = 30
const GRID_ROWS = 200

const globalForTiles = globalThis as unknown as {
  pixelTiles?: PixelTile[]
  pixelPurchases?: PixelPurchase[]
}

function createInitialTiles(): PixelTile[] {
  return Array.from({ length: GRID_COLUMNS * GRID_ROWS }, (_, index) => ({
    id: String(index + 1),
    ownerAddress: null,
    lastSalePriceUsd: null,
    nextBuyoutPriceUsd: PIXEL_MARKET_CONFIG.startingPriceUsd,
    title: "",
    targetUrl: "",
    color: "",
    purchaseCount: 0,
    updatedAt: new Date().toISOString(),
  }))
}

export const pixelTiles =
  globalForTiles.pixelTiles ?? (globalForTiles.pixelTiles = createInitialTiles())

export const pixelPurchases =
  globalForTiles.pixelPurchases ?? (globalForTiles.pixelPurchases = [])

export function getTiles() {
  return pixelTiles
}

export function buyTile(tileId: string, buyerAddress: string) {
  const tile = pixelTiles.find((item) => item.id === tileId)

  if (!tile) {
    throw new Error("Tile not found")
  }

  const purchase = calculatePixelPurchase(tile.lastSalePriceUsd)

  const purchaseRecord: PixelPurchase = {
    tileId: tile.id,
    buyerAddress,
    previousOwnerAddress: tile.ownerAddress,
    previousPriceUsd: tile.lastSalePriceUsd,
    paidUsd: purchase.requiredPaymentUsd,
    premiumUsd: purchase.premiumUsd,
    previousOwnerPayoutUsd: purchase.previousOwnerPayoutUsd,
    platformRevenueUsd: purchase.platformRevenueUsd,
    createdAt: new Date().toISOString(),
  }

  tile.ownerAddress = buyerAddress
  tile.lastSalePriceUsd = purchase.requiredPaymentUsd
  tile.nextBuyoutPriceUsd = purchase.nextBuyoutPriceUsd
  tile.purchaseCount += 1
  tile.updatedAt = new Date().toISOString()

  pixelPurchases.unshift(purchaseRecord)

  return {
    tile,
    purchase: purchaseRecord,
  }
}