"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from "@/lib/validations"
import type { RegisterFormData } from "@/lib/validations"
import Image from "next/image"
import fetchFun from "@/lib/fetch"
import { NextResponse } from "next/server"

function RegisterFormCom() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [captchaId, setCaptchaId] = useState<string>("")
  const [captchaSrc, setCaptchaSrc] = useState<string>("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loadingCaptcha, setLoadingCaptcha] = useState(false)

  const loadCaptcha = async () => {
    // 防止重复调用
    if (loadingCaptcha) return

    setLoadingCaptcha(true)
    try {
      const res = await fetch("/api/captcha")
      if (!res.ok) throw new Error("Captcha load failed")
      const data = await (res as NextResponse).json()
      setCaptchaId(data.captchaId)
      setCaptchaSrc(data.captcha)
    } catch (err) {
      console.error(err)
      setErrorMsg("Failed to load captcha, try refresh.")
    } finally {
      setLoadingCaptcha(false)
    }
  }

  useEffect(() => {
    loadCaptcha()
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    console.log("onSubmit called", data)
    setErrorMsg(null)
    setSubmitting(true)
    try {
      // 手动检查密码匹配
      if (data.password !== data.confirmPassword) {
        console.log("Passwords don't match")
        setErrorMsg("Passwords do not match")
        setSubmitting(false)
        return
      }

      // 移除 confirmPassword，不需要发送到后端
      const { confirmPassword: _, ...payload } = data

      const res = await fetchFun("/api/register", {
        method: "POST",
        body: JSON.stringify({ ...payload, captchaId }), // 发送 captchaId 到后端
      })

      if (!res.error) {
        // 注册成功后显示成功提示并跳转
        console.log("Registration successful")
        setTimeout(() => {
          router.push("/auth/signin")
        }, 1500)
      } else {
        // 注册失败或验证码错误，刷新验证码
        setErrorMsg(res.error || "Registration failed")
        loadCaptcha()
      }
    } catch (err) {
      console.error("Registration error:", err)
      setErrorMsg((err as Error).message || "Register failed")
      // 出错时也刷新验证码
      loadCaptcha()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="-mx-3 flex">
        <div className="mb-5 w-1/2 px-3">
          <label className="px-1 text-xs font-semibold">First name</label>
          <div className="flex">
            <div className="pointer-events-none z-10 flex w-10 items-center justify-center pl-1 text-center">
              <i className="mdi mdi-account-outline text-lg text-gray-400"></i>
            </div>
            <Input
              type="text"
              {...register("firstName")}
              className="-ml-10 w-full rounded-lg border-2 border-gray-200 py-2 pr-3 pl-10 outline-none focus:border-indigo-500"
              placeholder="John"
            />
          </div>
          {errors.firstName && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              {errors.firstName.message}
            </div>
          )}
        </div>
        <div className="mb-5 w-1/2 px-3">
          <label className="px-1 text-xs font-semibold">Last name</label>
          <div className="flex">
            <div className="pointer-events-none z-10 flex w-10 items-center justify-center pl-1 text-center">
              <i className="mdi mdi-account-outline text-lg text-gray-400"></i>
            </div>
            <Input
              type="text"
              {...register("lastName")}
              className="-ml-10 w-full rounded-lg border-2 border-gray-200 py-2 pr-3 pl-10 outline-none focus:border-indigo-500"
              placeholder="Smith"
            />
          </div>
          {errors.lastName && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              {errors.lastName.message}
            </div>
          )}
        </div>
      </div>

      <div className="-mx-3 flex">
        <div className="mb-5 w-full px-3">
          <label className="px-1 text-xs font-semibold">Email</label>
          <div className="flex">
            <div className="pointer-events-none z-10 flex w-10 items-center justify-center pl-1 text-center">
              <i className="mdi mdi-email-outline text-lg text-gray-400"></i>
            </div>
            <Input
              {...register("email")}
              type="email"
              className="-ml-10 w-full rounded-lg border-2 border-gray-200 py-2 pr-3 pl-10 outline-none focus:border-indigo-500"
              placeholder="your email"
            />
          </div>
          {errors.email && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              {errors.email.message}
            </div>
          )}
        </div>
      </div>

      <div className="-mx-3 flex">
        <div className="mb-5 w-full px-3">
          <label className="px-1 text-xs font-semibold">Password</label>
          <div className="flex">
            <div className="pointer-events-none z-10 flex w-10 items-center justify-center pl-1 text-center">
              <i className="mdi mdi-lock-outline text-lg text-gray-400"></i>
            </div>
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              className="-mr-8 -ml-10 w-full rounded-lg border-2 border-gray-200 py-2 pr-10 pl-10 outline-none focus:border-indigo-500"
              placeholder="your password"
              minLength={6}
              maxLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <i
                className={`mdi ${showPassword ? "mdi-eye-off" : "mdi-eye"} text-lg`}
              ></i>
            </button>
          </div>
          {errors.password && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              {errors.password.message}
            </div>
          )}
        </div>
      </div>

      <div className="-mx-3 flex">
        <div className="mb-5 w-full px-3">
          <label className="px-1 text-xs font-semibold">Confirm Password</label>
          <div className="flex">
            <div className="pointer-events-none z-10 flex w-10 items-center justify-center pl-1 text-center">
              <i className="mdi mdi-lock-outline text-lg text-gray-400"></i>
            </div>
            <Input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              className="-mr-8 -ml-10 w-full rounded-lg border-2 border-gray-200 py-2 pr-10 pl-10 outline-none focus:border-indigo-500"
              placeholder="confirm your password"
              minLength={6}
              maxLength={8}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="cursor-pointer text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <i
                className={`mdi ${showConfirmPassword ? "mdi-eye-off" : "mdi-eye"} text-lg`}
              ></i>
            </button>
          </div>
          {errors.confirmPassword && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              {errors.confirmPassword.message}
            </div>
          )}
        </div>
      </div>

      <div className="mb-5">
        <label className="px-1 text-xs font-semibold">Captcha</label>
        <div className="mt-2 flex items-center gap-3">
          <Input
            {...register("captchaCode")}
            type="text"
            className="flex-1 rounded-lg border-2 border-gray-200 py-2 outline-none focus:border-indigo-500"
            placeholder="Enter captcha"
            maxLength={4}
          />
          <div className="flex h-10 items-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-2">
            <div className="flex h-full w-24 items-center justify-center">
              {captchaSrc ? (
                <Image
                  width={100}
                  height={48}
                  src={captchaSrc}
                  alt="captcha"
                  className="h-full"
                />
              ) : (
                "Loading..."
              )}
            </div>
            <Button
              variant={"link"}
              onClick={(e) => {
                e.preventDefault() // 防止事件冒泡
                e.stopPropagation() // 阻止事件传播
                loadCaptcha()
              }}
              disabled={loadingCaptcha}
              className="text-xs text-blue-600 hover:underline disabled:opacity-50"
            >
              {loadingCaptcha ? "Loading..." : "换一张"}
            </Button>
          </div>
        </div>
        {errors.captchaCode && (
          <div className="mt-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
            {errors.captchaCode.message}
          </div>
        )}
      </div>

      {errorMsg && (
        <div
          className={`mb-5 rounded-lg p-3 text-center text-sm ${errorMsg.includes("successful") ? "border border-green-200 bg-green-50 text-green-600" : "border border-red-200 bg-red-50 text-red-600"}`}
        >
          {errorMsg}
        </div>
      )}

      <div className="-mx-3 flex">
        <div className="mb-5 w-full px-3">
          <Button
            type="submit"
            disabled={submitting}
            className="mx-auto block w-full max-w-xs rounded-lg bg-indigo-500 font-semibold text-white hover:bg-indigo-700 focus:bg-indigo-700"
          >
            {submitting ? "Registering..." : "Register"}
          </Button>
        </div>
      </div>
    </form>
  )
}

export const RegisterForm = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterFormCom />
    </Suspense>
  )
}
