import { base } from "thirdweb/chains"
import { settlePayment } from "thirdweb/x402"
import { calculatePixelPurchase } from "@/lib/pixel-market"
import { buyTile, getTiles } from "@/lib/tiles-store"
import { thirdwebX402Facilitator } from "@/lib/thirdweb-server"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

const PLATFORM_WALLET_ADDRESS =
  process.env.PLATFORM_WALLET_ADDRESS ||
  "0x183603E3bF84348c1B7774601D266d4FF7d114c3"

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params

    const body = (await request.json()) as {
      buyerAddress?: string
      imageIpfsUri?: string
      imageGatewayUrl?: string
      metadataIpfsUri?: string
      metadataGatewayUrl?: string
      twitterHandle?: string
      twitterUrl?: string
    }

    if (!body.buyerAddress) {
      return Response.json(
        { error: "buyerAddress is required" },
        { status: 400 }
      )
    }

    const tile = getTiles().find((item) => item.id === id)

    if (!tile) {
      return Response.json({ error: "Territory not found" }, { status: 404 })
    }

    const ownerSnapshot = tile.ownerAddress
    const lastSalePriceSnapshot = tile.lastSalePriceUsd

    const purchaseQuote = calculatePixelPurchase(lastSalePriceSnapshot)

    const payTo = ownerSnapshot || PLATFORM_WALLET_ADDRESS
    const price = `$${purchaseQuote.requiredPaymentUsd.toFixed(2)}`

    const paymentData =
      request.headers.get("x-payment") ||
      request.headers.get("X-PAYMENT") ||
      request.headers.get("PAYMENT-SIGNATURE")

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin

    const result = await settlePayment({
      resourceUrl: `${appUrl}/api/tiles/${id}/buy`,
      method: "POST",
      paymentData,
      payTo,
      network: base,
      price,
      facilitator: thirdwebX402Facilitator,
      routeConfig: {
        description: ownerSnapshot
          ? `Dominate Dominance territory #${id}`
          : `Claim Dominance territory #${id}`,
        mimeType: "application/json",
        maxTimeoutSeconds: 60 * 10,
      },
    })

    if (result.status !== 200) {
      return Response.json(result.responseBody, {
        status: result.status,
        headers: result.responseHeaders,
      })
    }

    const finalTile = getTiles().find((item) => item.id === id)

    if (!finalTile) {
      return Response.json({ error: "Territory not found" }, { status: 404 })
    }

    if (
      finalTile.ownerAddress !== ownerSnapshot ||
      finalTile.lastSalePriceUsd !== lastSalePriceSnapshot
    ) {
      return Response.json(
        { error: "Territory changed while payment was processing. Try again." },
        { status: 409 }
      )
    }

    const buyResult = buyTile(id, body.buyerAddress, {
      imageIpfsUri: body.imageIpfsUri,
      imageGatewayUrl: body.imageGatewayUrl,
      metadataIpfsUri: body.metadataIpfsUri,
      metadataGatewayUrl: body.metadataGatewayUrl,
      twitterHandle: body.twitterHandle,
      twitterUrl: body.twitterUrl,
    })

    return Response.json(buyResult, {
      headers: result.responseHeaders,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"

    return Response.json({ error: message }, { status: 400 })
  }
}