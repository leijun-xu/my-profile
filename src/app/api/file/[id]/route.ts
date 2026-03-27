import { NextRequest, NextResponse } from "next/server";
import { fetchWithCredentials } from "@/lib/fetchWithCredentials";

export const dynamic = 'force-dynamic';


export async function DELETE(req: NextRequest, ctx: RouteContext<"/api/file/[id]">) {
    const { id } = await ctx.params;
    const res = await fetchWithCredentials(`/file/delete/${id}`, {
        method: 'DELETE',
    })
    const data = await (res as NextResponse).json()
    if (data.error) {
        return NextResponse.json({ error: data.error, status: data.status || 500 })
    } else {
        return NextResponse.json(data)
    }
}
export async function GET(req: NextRequest, ctx: RouteContext<"/api/file/[id]">) {
    const { id } = await ctx.params;
    const res = await fetchWithCredentials(`/file/download/${id}`, {
        responseType:'blob'
    })
    if (res) {
        return new NextResponse(res as Blob)
    } else {
        return NextResponse.json({error:'Download failed'})
    }
}