import { NextRequest, NextResponse } from "next/server"
import tokens from "@/lib/opensky-token-manager"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    console.log(searchParams.toString())

    const headers = await tokens.getHeaders()
    const response = await fetch(
      "https://opensky-network.org/api/tracks?" + searchParams.toString(),
      {
        headers,
      }
    )
    if (!response.ok) {
      return NextResponse.json({
        error: response.statusText,
        status: response.status,
      })
    }
    const data = await response.json()
    console.log(data)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching data:", error)
    return NextResponse.json({ error: "catch error", status: 500 })
  }
}
