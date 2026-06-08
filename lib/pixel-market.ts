export const PIXEL_MARKET_CONFIG = {
  startingPriceUsd: 2,
  buyoutMultiplier: 1.1,
  premiumSplitToPreviousOwner: 0.5,
  premiumSplitToPlatform: 0.5,
}

export function roundUsd(value: number) {
  return Math.round(value * 100) / 100
}

export function calculatePixelPurchase(lastSalePriceUsd: number | null) {
  const {
    startingPriceUsd,
    buyoutMultiplier,
    premiumSplitToPreviousOwner,
    premiumSplitToPlatform,
  } = PIXEL_MARKET_CONFIG

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

  const previousOwnerPayoutUsd = roundUsd(
    lastSalePriceUsd + premiumUsd * premiumSplitToPreviousOwner
  )

  const platformRevenueUsd = roundUsd(
    premiumUsd * premiumSplitToPlatform
  )

  return {
    type: "takeover" as const,
    requiredPaymentUsd,
    previousOwnerPayoutUsd,
    platformRevenueUsd,
    premiumUsd,
    nextBuyoutPriceUsd: roundUsd(requiredPaymentUsd * buyoutMultiplier),
  }
}