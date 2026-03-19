import { NextRequest, NextResponse } from "next/server";
import { fetchWithCredentials } from "@/lib/fetchWithCredentials";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const res = await fetchWithCredentials('/api/external/cases?' + searchParams.toString())

    const data = await res.json()
    if (data.error) {
        return NextResponse.json({ error: data.error, status: data.status || 500 })
    } else {
        return NextResponse.json(data)
    }
}