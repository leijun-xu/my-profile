import { NextRequest, NextResponse } from "next/server";
import { fetchWithCredentials } from "@/lib/fetchWithCredentials";

export const dynamic = 'force-dynamic';


export async function POST(req: NextRequest) {
    const payload = await req.json();
    const res = await fetchWithCredentials(`/file/merge`, {
        method: 'POST',
        body: JSON.stringify(payload)
    })
    const data = await (res as NextResponse).json()
    if (data.error) {
        return NextResponse.json({ error: data.error, status: data.status || 500 })
    } else {
        return NextResponse.json(data)
    }
}

