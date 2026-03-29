import { NextRequest, NextResponse } from "next/server";
import { fetchWithCredentials } from "@/lib/fetchWithCredentials";

export const dynamic = 'force-dynamic';

export async function DELETE(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const res = await fetchWithCredentials(`/file/cancel?${searchParams.toString()}`, {
        method: 'DELETE',
    })
    const data = await (res as NextResponse).json()
    if (data.error) {
        return NextResponse.json({ error: data.error, status: data.status || 500 })
    } else {
        return NextResponse.json(data)
    }
}