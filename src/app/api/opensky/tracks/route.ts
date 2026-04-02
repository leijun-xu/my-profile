import { NextRequest, NextResponse } from "next/server"
import tokens from "@/lib/opensky-token-manager"

export const dynamic = "force-dynamic"
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const headers = await tokens.getHeaders()
    const response = await fetch(
      "https://opensky-network.org/api/tracks/all?" + searchParams.toString(),
      {
        headers,
        signal: AbortSignal.timeout(30000),
      }
    )

    if (!response.ok) {
      return NextResponse.json({
        error: response.statusText,
        status: response.status,
      })
    }
    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching data:", error)
    return NextResponse.json({ error: "catch error", status: 500 })
  }
}
