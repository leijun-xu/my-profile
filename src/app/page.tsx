'use client';

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Page() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') {
      return;
    }
    if (!session) {
      router.push('/auth/signin')
    } else {
      router.push('/resume')
    }
  }
    , [session, status, router])
  return (
    <>
      {/* 简单的光环背景 */}
      <div className="absolute w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-700" />
      {/* 主要内容 */}
      <div className="relative text-center space-y-6">
        {/* 简历图标 */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 flex items-center justify-center">
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
          <p className="text-sm text-white/40 mt-1">
            Loading Resume
          </p>
        </div>

        {/* 极简进度条 */}
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mx-auto">
          <div className="h-full w-3/4 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-[loading_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
      <style jsx global>{`
  @keyframes loading {
    0% { transform: translateX(-100%); }
    50% { transform: translateX(0); }
    100% { transform: translateX(100%); }
  }
`}</style>
    </>
  )
}

