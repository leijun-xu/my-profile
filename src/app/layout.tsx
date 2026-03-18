import { Toaster } from "@/components/ui/sonner"
import "@/globals.css"
import { Providers } from "@/components/jotai/providers";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

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
        <div className="w-screen overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <Providers>
            {children}
          </Providers>
          <Toaster />
        </div>
      </body>
    </html>
  )
}
