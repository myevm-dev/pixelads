import { createThirdwebClient } from "thirdweb"
import { facilitator } from "thirdweb/x402"

const secretKey = process.env.THIRDWEB_SECRET_KEY
const serverWalletAddress = process.env.THIRDWEB_SERVER_WALLET_ADDRESS

if (!secretKey) {
  throw new Error("Missing THIRDWEB_SECRET_KEY")
}

if (!serverWalletAddress) {
  throw new Error("Missing THIRDWEB_SERVER_WALLET_ADDRESS")
}

export const thirdwebServerClient = createThirdwebClient({
  secretKey,
})

export const thirdwebX402Facilitator = facilitator({
  client: thirdwebServerClient,
  serverWalletAddress,
})