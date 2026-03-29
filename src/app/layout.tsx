import { Toaster } from "@/components/ui/sonner"
import "@/globals.css"
import { Providers } from "@/components/jotai/providers"
import type { Metadata } from "next"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "XU LEIJUN - resume nextjs website",
  description: "platform for my resume display.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="flex-1">
            <Providers>{children}</Providers>
          </div>

          {/* 底部文字 */}
          <Footer />

          <Toaster position="top-center" />
        </div>
      </body>
    </html>
  )
}
