import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerAuthContext } from "@/lib/auth-server";

export async function proxy(req: NextRequest) {
    const { pathname, origin } = req.nextUrl
    const isPublicRoute = pathname === '/' ||
        pathname.startsWith('/auth/') ||
        pathname.startsWith('/sso-callback') ||
        pathname === '/health' ||
        pathname === '/resume' ||
        pathname === '/xuleijun-Frontend-resume.pdf'

    if (isPublicRoute) {
        return NextResponse.next()
    }

    const { session, requestToken, isAuthenticated } = await getServerAuthContext(req)
    console.log(isAuthenticated, 'isAuthenticated')
    if (!isAuthenticated) {
        const basePath = process.env.BASE_PATH || ''
        const signInUrl = new URL(`${basePath}/auth/signin`, origin)
        // isAuthenticated ,remember previous url
        const fullpath = `${pathname === '/' ? '' : pathname}`
        signInUrl.searchParams.set('callbackUrl', fullpath)
        return NextResponse.redirect(signInUrl)
    }

    return NextResponse.next()

}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
}