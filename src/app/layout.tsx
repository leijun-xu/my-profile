import { Toaster } from "@/components/ui/sonner"
import "@/globals.css"
import { Providers } from "@/components/jotai/providers";
import type { Metadata } from "next";
import DevIcons from "@/components/devtool/devtoolIcon";

export const metadata: Metadata = {
  title: 'XU LEIJUN - resume nextjs website',
  description: 'platform for my resume display.'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <div className="w-full overflow-x-hidden min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 ">
          <div className="flex-1">
            <Providers>
              {children}
            </Providers>
          </div>
            
          {/* 底部文字 */}
          <div className=" p-8 text-gray-500 text-sm gap-1 flex flex-col md:flex-row items-center justify-center md:h-3 bg-white/80">
            <p>© 2026 developed by Xuleijun, use</p>
            <DevIcons />
          </div>

        
          <Toaster position="top-center" />
        </div>
      </body>
    </html>
  )
}
