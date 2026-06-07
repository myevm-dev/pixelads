export type PixelTile = {
  id: string
  ownerAddress: string | null
  lastSalePriceUsd: number | null
  nextBuyoutPriceUsd: number
  title: string
  targetUrl: string
  color: string
  purchaseCount: number
  updatedAt: string
}

export type PixelPurchase = {
  tileId: string
  buyerAddress: string
  previousOwnerAddress: string | null
  previousPriceUsd: number | null
  paidUsd: number
  premiumUsd: number
  previousOwnerPayoutUsd: number
  platformRevenueUsd: number
  createdAt: string
}