"use client"

import { usePathname } from "next/navigation"
import DevIcons from "@/components/devtool/devtoolIcon"

export default function Footer() {
  const pathname = usePathname()
  const isDashboard = pathname.startsWith("/dashboard")
  return (
    <>
      {!isDashboard ? (
        <div className="flex flex-col items-center justify-center gap-1 bg-white/80 p-8 text-sm text-gray-500 md:h-3 md:flex-row">
          <p>© 2026 developed by Xuleijun, use</p>
          <DevIcons />
        </div>
      ) : null}
    </>
  )
}
