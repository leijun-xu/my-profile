"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/lib/validations";
import type { UserForm } from "@/lib/validations";

type SubmitButtonProp = { status: boolean }
function SubmitButton({ status }: SubmitButtonProp) {
    return (
        <Button type="submit" disabled={status} className="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg font-semibold">
            {
                status ? 'Siging In...' : 'Sign In'
            }
        </Button>
    )
}

export function SignInForm() {
    const router = useRouter()
    const [submitting, setSubmitting] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<UserForm>({
        resolver: zodResolver(signInSchema), // 前端实时验证
    });

    const onSubmit = async (data: UserForm) => {
        try {
            setSubmitting(true);
            // 数据已经过 Zod 验证，直接发送到后端
            const { email, password, firstName, lastName } = data

            const result = await signIn('signin-credential', {
                email,
                password,
                firstName,
                lastName,
                redirect: false, // 加上，避免自动跳转
            })
            console.log('signIn result:', result); // 调试输出
            if (result?.error) {
                setSubmitting(false);
                console.error('Sign in error:', result.error);
                return;
            }
            if (result?.ok) {
                router.push('/resume')
                router.refresh()
            }
        } catch (error) {
            console.error(error)
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} >
            <div className="flex -mx-3">
                <div className="w-1/2 px-3 mb-5">
                    <label className="text-xs font-semibold px-1">First name</label>
                    <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><i className="mdi mdi-account-outline text-gray-400 text-lg"></i></div>
                        <Input type="text"
                            {...register("firstName")}
                            defaultValue={'徐'}
                            className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="John" />
                    </div>
                    {errors.firstName &&
                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                            {errors.firstName.message}
                        </div>}
                </div>
                <div className="w-1/2 px-3 mb-5">
                    <label className="text-xs font-semibold px-1">Last name</label>
                    <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><i className="mdi mdi-account-outline text-gray-400 text-lg"></i></div>
                        <Input type="text"
                            defaultValue={'磊君'}
                            {...register("lastName")}
                            className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="Smith" />
                    </div>
                    {errors.lastName &&
                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                            {errors.lastName.message}
                        </div>}
                </div>
            </div>
            <div className="flex -mx-3">
                <div className="w-full px-3 mb-5">
                    <label className="text-xs font-semibold px-1">Email</label>
                    <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><i className="mdi mdi-email-outline text-gray-400 text-lg"></i></div>
                        <Input
                            defaultValue={'15221770395@163.com'}
                            {...register("email")}
                            type="email" className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="johnsmith@example.com" />
                    </div>
                    {errors.email &&
                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                            {errors.email.message}
                        </div>}
                </div>
            </div>

            <div className="flex -mx-3">
                <div className="w-full px-3 mb-12">
                    <label className="text-xs font-semibold px-1">Password</label>
                    <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><i className="mdi mdi-lock-outline text-gray-400 text-lg"></i></div>
                        <Input
                            defaultValue={'15221770395@163.com'}
                            {...register("password")}
                            type="password" className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="************" />
                    </div>
                    {errors.password &&
                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                            {errors.password.message}
                        </div>}
                </div>
            </div>
            <div className="flex -mx-3">
                <div className="w-full px-3 mb-5">
                    <SubmitButton status={submitting} />
                </div>
            </div>
        </form>
    )
}