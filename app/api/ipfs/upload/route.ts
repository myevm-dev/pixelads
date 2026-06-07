import { buildTwitterUrl, cleanTwitterHandle, ipfsUriToGatewayUrl } from "@/lib/ipfs"

export const runtime = "nodejs"

type UploadResponse = {
  imageIpfsUri: string
  imageGatewayUrl: string
  metadataIpfsUri: string
  metadataGatewayUrl: string
  metadata: {
    name: string
    description: string
    image: string
    external_url: string
    attributes: Array<{
      trait_type: string
      value: string | number
    }>
  }
}

async function uploadFileToPinata(file: File, fileName: string) {
  const jwt = process.env.PINATA_JWT

  if (!jwt) {
    throw new Error("Missing PINATA_JWT in .env.local")
  }

  const formData = new FormData()
  formData.append("file", file, fileName)

  const metadata = JSON.stringify({
    name: fileName,
  })

  formData.append("pinataMetadata", metadata)

  const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    body: formData,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error?.details || data.error || "Failed to upload image to IPFS")
  }

  return `ipfs://${data.IpfsHash}`
}

async function uploadJsonToPinata(json: unknown, name: string) {
  const jwt = process.env.PINATA_JWT

  if (!jwt) {
    throw new Error("Missing PINATA_JWT in .env.local")
  }

  const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pinataMetadata: {
        name,
      },
      pinataContent: json,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error?.details || data.error || "Failed to upload metadata to IPFS")
  }

  return `ipfs://${data.IpfsHash}`
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const image = formData.get("image")
    const tileId = String(formData.get("tileId") || "")
    const buyerAddress = String(formData.get("buyerAddress") || "")
    const rawTwitterHandle = String(formData.get("twitterHandle") || "")

    if (!(image instanceof File)) {
      return Response.json({ error: "Image is required" }, { status: 400 })
    }

    if (!tileId) {
      return Response.json({ error: "tileId is required" }, { status: 400 })
    }

    if (!buyerAddress) {
      return Response.json({ error: "buyerAddress is required" }, { status: 400 })
    }

    if (!image.type.startsWith("image/")) {
      return Response.json({ error: "File must be an image" }, { status: 400 })
    }

    const twitterHandle = cleanTwitterHandle(rawTwitterHandle)
    const twitterUrl = buildTwitterUrl(twitterHandle)

    const imageIpfsUri = await uploadFileToPinata(
      image,
      `pixelads-tile-${tileId}-${Date.now()}`
    )

    const metadata = {
      name: `PixelAds Tile #${tileId}`,
      description:
        "A fixed-position PixelAds tile from an x402 forced-buyout advertising wall.",
      image: imageIpfsUri,
      external_url: twitterUrl,
      attributes: [
        {
          trait_type: "Tile ID",
          value: tileId,
        },
        {
          trait_type: "Buyer",
          value: buyerAddress,
        },
        {
          trait_type: "X Handle",
          value: twitterHandle || "None",
        },
      ],
    }

    const metadataIpfsUri = await uploadJsonToPinata(
      metadata,
      `pixelads-tile-${tileId}-metadata`
    )

    const result: UploadResponse = {
      imageIpfsUri,
      imageGatewayUrl: ipfsUriToGatewayUrl(imageIpfsUri),
      metadataIpfsUri,
      metadataGatewayUrl: ipfsUriToGatewayUrl(metadataIpfsUri),
      metadata,
    }

    return Response.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"

    return Response.json({ error: message }, { status: 400 })
  }
}