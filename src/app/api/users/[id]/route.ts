import { NextRequest, NextResponse } from "next/server";
import { fetchWithCredentials } from "@/lib/fetchWithCredentials";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, ctx: RouteContext<"/api/users/[id]">) {
    const { id } = await ctx.params;
    const searchParams = req.nextUrl.searchParams;
    const res = await fetchWithCredentials(`/users/${id}?${searchParams.toString()}`)
    const data = await res.json()
    if (data.error) {
        return NextResponse.json({ error: data.error, status: data.status || 500 })
    } else {
        return NextResponse.json(data)
    }
}


export async function PUT(req: NextRequest, ctx: RouteContext<"/api/users/[id]">) {
    const { id } = await ctx.params;
    const payload = await req.json();
    const res = await fetchWithCredentials(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
    })
    const data = await res.json()
    if (data.error) {
        return NextResponse.json({ error: data.error, status: data.status || 500 })
    } else {
        return NextResponse.json(data)
    }
}


export async function DELETE(req: NextRequest, ctx: RouteContext<"/api/users/[id]">) {
    const { id } = await ctx.params;
    const res = await fetchWithCredentials(`/users/${id}`, {
        method: 'DELETE',
    })
    const data = await res.json()
    if (data.error) {
        return NextResponse.json({ error: data.error, status: data.status || 500 })
    } else {
        return NextResponse.json(data)
    }
}