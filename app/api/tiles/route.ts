import { getTiles } from "@/lib/tiles-store"

export async function GET() {
  return Response.json({
    tiles: getTiles(),
  })
}