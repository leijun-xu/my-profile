"use client"

import { signIn } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

function Page() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    const tempCode = searchParams?.get("code")
    if (tempCode) {
      signIn("sso", { tempCode, redirect: false }).then((res) => {
        if (res?.ok) {
          const sessionStorageCallbackUrl =
            sessionStorage.getItem("sso_callback_url")
          const callbackUrl =
            searchParams.get("callbackUrl") || sessionStorageCallbackUrl || "/"
          sessionStorage.removeItem("sso_callback_url")
          router.push(callbackUrl)
        } else {
          setError("SSO登录失败，请重试")
          router.push("/auth/signin?error=sso_failed") // 跳转到登录页，用户可以重新发起登录流程
        }
      })
    } else {
      // setError('缺少SSO登录所需的code参数')
      router.push("/auth/signin?error=missing_code") // 跳转到登录页，用户可以重新发起登录流程
    }
  }, [searchParams, router])

  return (
    <div className="flex h-screen w-full items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
      <p className="text-muted-foreground">
        {error ? (
          <span className="text-red-500">{error}</span>
        ) : (
          "正在处理SSO登录..."
        )}
      </p>
    </div>
  )
}

export default function SSOCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
          Loading...
        </div>
      }
    >
      <Page />
    </Suspense>
  )
}
