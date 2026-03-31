"use client"

import AIChat from "@/components/ai/ai-chat"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import dynamic from "next/dynamic"
import { LogIn } from "lucide-react"

// 动态导入简历组件，避免服务端渲染问题
const ResumeContent = dynamic(
  () => import("@/components/resume/ResumeContent"),
  {
    loading: () => <div className="p-8 text-center">加载中...</div>,
    ssr: false,
  }
)
export default function Page() {
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

            <Link
              href="/auth/signin"
              className="ml-10 text-gray-300 transition-colors duration-300 hover:text-white"
            >
              <LogIn className="h-7 w-7" />
            </Link>
          </div>
        </nav>
      </header>
      <AIChat />

      <ResumeContent />
    </div>
  )
}
