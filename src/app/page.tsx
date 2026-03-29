"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useEffect } from "react"

export default function Page() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") {
      return
    }
    if (!session) {
      router.push("/auth/signin")
    } else {
      router.push("/resume")
    }
  }, [session, status, router])
  return (
    <>
      {/* 简单的光环背景 */}
      <div className="absolute h-64 w-64 animate-pulse rounded-full bg-purple-500/20 blur-3xl" />
      <div className="absolute h-96 w-96 animate-pulse rounded-full bg-cyan-500/20 blur-3xl delay-700" />
      {/* 主要内容 */}
      <div className="relative flex h-screen flex-col items-center justify-center space-y-6 text-center">
        {/* 简历图标 */}
        <div className="relative">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <span className="text-5xl">📄</span>
          </div>

          {/* 三个加载点 */}
          {/* <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
          </div> */}
        </div>

        {/* 文字 */}
        <div>
          <p className="mt-1 text-sm text-white/40">Loading Resume</p>
        </div>

        {/* 极简进度条 */}
        <div className="mx-auto h-1 w-48 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-3/4 animate-[loading_1.5s_ease-in-out_infinite] rounded-full bg-linear-to-r from-cyan-400 to-purple-400" />
        </div>
      </div>
      <style jsx global>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </>
  )
}
