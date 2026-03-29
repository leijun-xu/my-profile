"use client"

import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signInSchema } from "@/lib/validations"
import type { SignInFormData } from "@/lib/validations"
import { toast } from "sonner"

type SubmitButtonProp = { status: boolean }
function SubmitButton({ status }: SubmitButtonProp) {
  return (
    <Button
      type="submit"
      disabled={status}
      className="mx-auto block w-full max-w-xs rounded-lg bg-indigo-500 font-semibold text-white hover:bg-indigo-700 focus:bg-indigo-700"
    >
      {status ? "Siging In..." : "Sign In"}
    </Button>
  )
}

function SignInFormCom() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema), // 前端实时验证
  })

  const onSubmit = async (data: SignInFormData) => {
    try {
      setSubmitting(true)
      const { email, password } = data

      const result = await signIn("signin-credential", {
        email,
        password,
        redirect: false,
      })

      console.log("signIn result:", result)
      if (result?.ok) {
        router.push(callbackUrl)
        router.refresh()
      } else {
        setSubmitting(false)
        toast.error("Sign in failed")
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="-mx-3 flex">
        <div className="mb-5 w-full px-3">
          <label className="px-1 text-xs font-semibold">Email</label>
          <div className="flex">
            <div className="pointer-events-none z-10 flex w-10 items-center justify-center pl-1 text-center">
              <i className="mdi mdi-email-outline text-lg text-gray-400"></i>
            </div>
            <Input
              {...register("email")}
              type="text"
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
        <div className="mb-12 w-full px-3">
          <label className="px-1 text-xs font-semibold">Password</label>
          <div className="flex">
            <div className="pointer-events-none z-10 flex w-10 items-center justify-center pl-1 text-center">
              <i className="mdi mdi-lock-outline text-lg text-gray-400"></i>
            </div>
            <Input
              {...register("password")}
              type="password"
              className="-ml-10 w-full rounded-lg border-2 border-gray-200 py-2 pr-3 pl-10 outline-none focus:border-indigo-500"
              placeholder="your password"
            />
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
          <SubmitButton status={submitting} />
        </div>
      </div>
    </form>
  )
}

export const SignInForm = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInFormCom />
    </Suspense>
  )
}
