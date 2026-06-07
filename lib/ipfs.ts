export function ipfsUriToGatewayUrl(ipfsUri: string) {
  const gateway =
    process.env.NEXT_PUBLIC_IPFS_GATEWAY || "https://gateway.pinata.cloud/ipfs"

  return ipfsUri.replace("ipfs://", `${gateway}/`)
}

export function cleanTwitterHandle(handle: string) {
  return handle
    .trim()
    .replace(/^@/, "")
    .replace(/^https?:\/\/(www\.)?(x\.com|twitter\.com)\//, "")
    .split(/[/?#]/)[0]
}

export function buildTwitterUrl(handle: string) {
  const cleanHandle = cleanTwitterHandle(handle)

  if (!cleanHandle) return ""

  return `https://x.com/${cleanHandle}`
}