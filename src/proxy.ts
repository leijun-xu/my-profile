import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getServerAuthContext } from "@/lib/auth-server"
import Negotiator from "negotiator"
import { match } from "@formatjs/intl-localematcher"
import { locales, defaultLocale } from "@/dictionaries"

export async function proxy(req: NextRequest) {
  const { pathname, origin } = req.nextUrl

  const isPublicRoute =
    pathname === "/" ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/sso-callback") ||
    pathname.startsWith("/assets") ||
    pathname === "/health" ||
    pathname === "/resume" ||
    pathname === "/webgis-public"

  if (isPublicRoute) {
    if (pathname === "/resume") {
      req.nextUrl.pathname = `/zh${pathname}`
      return NextResponse.redirect(req.nextUrl)
    } else {
      return NextResponse.next()
    }
  }

  // 校验token
  const { session, requestToken, isAuthenticated } =
    await getServerAuthContext(req)
  console.log(isAuthenticated, "isAuthenticated")
  if (!isAuthenticated) {
    const basePath = process.env.BASE_PATH || ""
    const signInUrl = new URL(`${basePath}/auth/signin`, origin)
    // isAuthenticated ,remember previous url
    const fullpath = `${pathname === "/" ? "" : pathname}`
    signInUrl.searchParams.set("callbackUrl", fullpath)
    return NextResponse.redirect(signInUrl)
  }
  if (locales.some((locale) => req.nextUrl.pathname.startsWith(`/${locale}`))) {
    return NextResponse.next()
  }
  const headers = {
    "accept-language": req.headers.get("accept-language") || "",
  }
  const negotiator = new Negotiator({ headers })
  const language = negotiator.languages()
  const lang = match(language, locales, defaultLocale)
  req.nextUrl.pathname = `/${lang}${pathname}`

  return NextResponse.redirect(req.nextUrl)
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets).*)"],
}
