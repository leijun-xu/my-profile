import { NextRequest, NextResponse } from "next/server";
import { fetchWithCredentials } from "@/lib/fetchWithCredentials";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const res = await fetchWithCredentials(`/profile`)
    const data = await (res as NextResponse).json()
    if (data.error) {
        return NextResponse.json({ error: data.error, status: data.status || 500 })
    } else {
        return NextResponse.json(data)
    }
}

export async function PUT(req: NextRequest) {
    const payload = await req.json();
    const res = await fetchWithCredentials(`/profile`, {
        method: 'PUT',
        body: JSON.stringify(payload),
    })
    const data = await (res as NextResponse).json()
    if (data.error) {
        return NextResponse.json({ error: data.error, status: data.status || 500 })
    } else {
        return NextResponse.json(data)
    }
}