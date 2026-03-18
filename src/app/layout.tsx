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
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}
