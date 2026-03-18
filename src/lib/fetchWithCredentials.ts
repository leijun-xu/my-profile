import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { getRequestTokenForRoute } from "@/lib/auth-server";

type FetchOptions = RequestInit & {};

const serverName = '/api/serve';

export async function fetchWithCredentials(url: string, options: FetchOptions) {
    const BACKEND_API_URL = process.env.BACKEND_API_URL || ""

    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({
            error: 'Unauthorized', status: 403
        }, { status: 403 })
    }

    const requestToken = getRequestTokenForRoute()
    if (!requestToken) {
        return NextResponse.json({ error: 'Unable to retrieve authentication token', status: 401 }, { status: 401 })
    }

    const headers = new Headers(options.headers || {})
    headers.set('accept', "*/*")
    headers.set('Content-type', 'application/json')
    headers.set('Authorization', `Bearer ${requestToken}`)
    const res = await fetch(BACKEND_API_URL + serverName + url, { ...options, headers })
    if (!res.ok) {
        const errorText = await res.text().catch(() => '')
        return NextResponse.json({
            error: res.statusText || 'HTTP error',
            status: res.status
        }, {
            status: res.status
        })
    }

    const data = await res.json();
    // success code
    if (data.code === 0) {
        return NextResponse.json({ ...data.data || {} }, { status: 200 })
    } else {
        return NextResponse.json({
            error: data.msg || 'Backend error',
            status: data.code
        }, { status: data.code })
    }
}