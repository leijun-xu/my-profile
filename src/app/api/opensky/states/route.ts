import { NextRequest, NextResponse } from "next/server"
import tokens from "@/lib/opensky-token-manager"

export const dynamic = "force-dynamic"
export const runtime = "edge"
export async function GET(req: NextRequest) {
  try {
    const searchParamsStr = req.nextUrl.searchParams.toString()

    const headers = await tokens.getHeaders()
    const response = await fetch(
      `https://opensky-network.org/api/states/all${searchParamsStr ? "?" + searchParamsStr : ""}`,
      {
        headers,
        signal: AbortSignal.timeout(15000),
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
