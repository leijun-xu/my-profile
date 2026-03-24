"use client";

import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/validations";
import type { RegisterFormData } from "@/lib/validations";
import fetchFun from "@/lib/fetch";

type SubmitButtonProp = { status: boolean };
function SubmitButton({ status }: SubmitButtonProp) {
    return (
        <Button type="submit" disabled={status} className="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg font-semibold">
            {status ? "Registering..." : "Register"}
        </Button>
    );
}

function RegisterFormCom() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setErrorMsg(null);
        setSubmitting(true);
        try {
            const res = await fetchFun("/api/register", {
                method: "POST",
                body: JSON.stringify(data),
            });

            if (!res.error) {
                // 注册成功后跳转到登录页
                router.push("/auth/signin");
            }
        } catch (err) {
            console.error(err);
            setErrorMsg((err as Error).message || "Register failed");
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex -mx-3">
                <div className="w-1/2 px-3 mb-5">
                    <label className="text-xs font-semibold px-1">First name</label>
                    <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                            <i className="mdi mdi-account-outline text-gray-400 text-lg"></i>
                        </div>
                        <Input
                            type="text"
                            {...register("firstName")}
                            className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                            placeholder="John"
                        />
                    </div>
                    {errors.firstName && <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">{errors.firstName.message}</div>}
                </div>
                <div className="w-1/2 px-3 mb-5">
                    <label className="text-xs font-semibold px-1">Last name</label>
                    <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                            <i className="mdi mdi-account-outline text-gray-400 text-lg"></i>
                        </div>
                        <Input
                            type="text"
                            {...register("lastName")}
                            className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                            placeholder="Smith"
                        />
                    </div>
                    {errors.lastName && <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">{errors.lastName.message}</div>}
                </div>
            </div>

            <div className="flex -mx-3">
                <div className="w-full px-3 mb-5">
                    <label className="text-xs font-semibold px-1">Email</label>
                    <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                            <i className="mdi mdi-email-outline text-gray-400 text-lg"></i>
                        </div>
                        <Input
                            {...register("email")}
                            type="email"
                            className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                            placeholder="your email"
                        />
                    </div>
                    {errors.email && <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">{errors.email.message}</div>}
                </div>
            </div>

            <div className="flex -mx-3">
                <div className="w-full px-3 mb-12">
                    <label className="text-xs font-semibold px-1">Password</label>
                    <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                            <i className="mdi mdi-lock-outline text-gray-400 text-lg"></i>
                        </div>
                        <Input
                            {...register("password")}
                            type="password"
                            className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                            placeholder="your password"
                        />
                    </div>
                    {errors.password && <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">{errors.password.message}</div>}
                </div>
            </div>

            {errorMsg && <p className="mb-5 text-center text-red-600">{errorMsg}</p>}

            <div className="flex -mx-3">
                <div className="w-full px-3 mb-5">
                    <SubmitButton status={submitting} />
                </div>
            </div>
        </form>
    );
}

export const RegisterForm = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RegisterFormCom />
        </Suspense>
    );
};
