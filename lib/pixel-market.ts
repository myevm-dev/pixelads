export const PIXEL_MARKET_CONFIG = {
  startingPriceUsd: 2,
  buyoutMultiplier: 1.05,
  premiumSplitToPreviousOwner: 0.5,
  premiumSplitToPlatform: 0.5,
}

export function roundUsd(value: number) {
  return Math.round(value * 100) / 100
}

export function calculatePixelPurchase(lastSalePriceUsd: number | null) {
  const { startingPriceUsd, buyoutMultiplier } = PIXEL_MARKET_CONFIG

  if (lastSalePriceUsd === null) {
    return {
      type: "initial-sale" as const,
      requiredPaymentUsd: startingPriceUsd,
      previousOwnerPayoutUsd: 0,
      platformRevenueUsd: startingPriceUsd,
      premiumUsd: 0,
      nextBuyoutPriceUsd: roundUsd(startingPriceUsd * buyoutMultiplier),
    }
  }

  const requiredPaymentUsd = roundUsd(lastSalePriceUsd * buyoutMultiplier)
  const premiumUsd = roundUsd(requiredPaymentUsd - lastSalePriceUsd)

  const previousOwnerPayoutUsd = roundUsd(lastSalePriceUsd + premiumUsd / 2)
  const platformRevenueUsd = roundUsd(premiumUsd / 2)

  return {
    type: "takeover" as const,
    requiredPaymentUsd,
    previousOwnerPayoutUsd,
    platformRevenueUsd,
    premiumUsd,
    nextBuyoutPriceUsd: roundUsd(requiredPaymentUsd * buyoutMultiplier),
  }
}