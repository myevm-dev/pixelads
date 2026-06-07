import { buyTile } from "@/lib/tiles-store"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const body = (await request.json()) as {
      buyerAddress?: string
    }

    if (!body.buyerAddress) {
      return Response.json(
        { error: "buyerAddress is required" },
        { status: 400 }
      )
    }

    const result = buyTile(id, body.buyerAddress)

    return Response.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"

    return Response.json({ error: message }, { status: 400 })
  }
}