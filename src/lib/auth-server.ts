/**  
 * Server-side auth utilities
 * 
 */

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function getRequestToken(req: NextRequest): Promise<string | null> {
    try {
        const token = await getToken({
            req, secret: process.env.NEXTAUTH_SECRET
        })
        if (!token?.requestToken) {
            return null
        }
        return token.requestToken
    } catch (error) {
        return null
    }
}

export async function getCurrentSession() {
    return await getServerSession(authOptions)
}

export async function getServerAuthContext(req: NextRequest) {
    const [session, requestToken] = await Promise.all([
        getCurrentSession(),
        getRequestToken(req)
    ])
    return {
        session,
        requestToken,
        isAuthenticated: !!session && !!requestToken
    }
}

export async function getRequestTokenForRoute(): Promise<string | null> {
    try {
        const { cookies } = await import('next/headers')
        const { decode } = await import('next-auth/jwt')
        const cookieStore = await cookies()

        const tokenName = process.env.NODE_ENV === 'production' ?
            '__Secure-next-auth.session-token' : 'next-auth.session-token';

        const sessionToken = cookieStore.get(tokenName)?.value;
        if (!sessionToken) {
            return null;
        }

        const decoded = await decode({
            token: sessionToken,
            secret: process.env.NEXTAUTH_SECRET!
        })
        return decoded?.requestToken as string || null

    } catch (error) {
        return null
    }
}