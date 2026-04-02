"use client"

import AIChat from "@/components/ai/ai-chat"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogIn } from "lucide-react"
import ResumeContentWrapper from "@/components/resume/ResumeContentWrapper"
import LangSwitcher from "@/components/dashboard/LangSwitcher"

export default function Page() {
  const { lang } = useParams<{ lang: string }>()
  return (
    <div className="relative min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
      <header>
        <nav className="w-full">
          <div className="flex w-full justify-between px-16 py-8">
            <div className="flex items-center gap-2">
              <Avatar size="lg">
                <AvatarImage
                  src="https://avatars.githubusercontent.com/u/243532682?v=4&size=64"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="text-md text-gray-300">徐磊君</span>
            </div>

            <div className="flex items-center">
              {/* 语言切换 */}
              <LangSwitcher lang={lang} />
              <Link
                href="/auth/signin"
                className="ml-10 text-gray-300 transition-colors duration-300 hover:text-white"
              >
                <LogIn className="h-7 w-7" />
              </Link>
            </div>
          </div>
        </nav>
      </header>
      <AIChat />

      <ResumeContentWrapper />
    </div>
  )
}
