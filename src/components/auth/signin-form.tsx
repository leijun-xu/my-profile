"use client";

import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/lib/validations";
import type { SignInFormData } from "@/lib/validations";
import { toast } from "sonner";

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

function SignInFormCom() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/resume-auth';
    const router = useRouter()
    const [submitting, setSubmitting] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema), // 前端实时验证
    });

    const onSubmit = async (data: SignInFormData) => {
        try {
            setSubmitting(true);
            const { email, password } = data;

            const result = await signIn("signin-credential", {
                email,
                password,
                redirect: false,
            });

            console.log("signIn result:", result);
            if (result?.ok) {
                router.push(callbackUrl);
                router.refresh();
            } else {
                setSubmitting(false);
                toast.error("Sign in failed");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} >
            <div className="flex -mx-3">
                <div className="w-full px-3 mb-5">
                    <label className="text-xs font-semibold px-1">Email</label>
                    <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><i className="mdi mdi-email-outline text-gray-400 text-lg"></i></div>
                        <Input
                            {...register("email")}
                            type="text"
                            className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                            placeholder="your email" />
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
                            {...register("password")}
                            type="password" className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                            placeholder="your password"
                        />
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

export const SignInForm = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignInFormCom />
        </Suspense>)
}