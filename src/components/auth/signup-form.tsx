"use client";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/validations";
import type { RegisterFormData } from "@/lib/validations";
import Image from "next/image";
import fetchFun from "@/lib/fetch";

function RegisterFormCom() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [captchaId, setCaptchaId] = useState<string>("");
    const [captchaSrc, setCaptchaSrc] = useState<string>("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loadingCaptcha, setLoadingCaptcha] = useState(false);

    const loadCaptcha = async () => {
        // 防止重复调用
        if (loadingCaptcha) return;

        setLoadingCaptcha(true);
        try {
            const res = await fetch("/api/captcha");
            if (!res.ok) throw new Error("Captcha load failed");
            const data = await (res as NextResponse).json();
            setCaptchaId(data.captchaId);
            setCaptchaSrc(data.captcha);
        } catch (err) {
            console.error(err);
            setErrorMsg("Failed to load captcha, try refresh.");
        } finally {
            setLoadingCaptcha(false);
        }
    };

    useEffect(() => {
        loadCaptcha();
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        console.log("onSubmit called", data);
        setErrorMsg(null);
        setSubmitting(true);
        try {
            // 手动检查密码匹配
            if (data.password !== data.confirmPassword) {
                console.log("Passwords don't match");
                setErrorMsg("Passwords do not match");
                setSubmitting(false);
                return;
            }

            // 移除 confirmPassword，不需要发送到后端
            const { confirmPassword: _, ...payload } = data;

            const res = await fetchFun("/api/register", {
                method: "POST",
                body: JSON.stringify({ ...payload, captchaId }), // 发送 captchaId 到后端
            });

            if (!res.error) {
                // 注册成功后显示成功提示并跳转
                console.log("Registration successful");
                setTimeout(() => {
                    router.push("/auth/signin");
                }, 1500);
            } else {
                // 注册失败或验证码错误，刷新验证码
                setErrorMsg(res.error || "Registration failed");
                loadCaptcha();
            }
        } catch (err) {
            console.error("Registration error:", err);
            setErrorMsg((err as Error).message || "Register failed");
            // 出错时也刷新验证码
            loadCaptcha();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
                <div className="w-full px-3 mb-5">
                    <label className="text-xs font-semibold px-1">Password</label>
                    <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                            <i className="mdi mdi-lock-outline text-gray-400 text-lg"></i>
                        </div>
                        <Input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            className="w-full -ml-10 -mr-8 pl-10 pr-10 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                            placeholder="your password"
                            minLength={6}
                            maxLength={8}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className=" text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                        >
                            <i className={`mdi ${showPassword ? 'mdi-eye-off' : 'mdi-eye'} text-lg`}></i>
                        </button>
                    </div>
                    {errors.password && <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">{errors.password.message}</div>}
                </div>
            </div>

            <div className="flex -mx-3">
                <div className="w-full px-3 mb-5">
                    <label className="text-xs font-semibold px-1">Confirm Password</label>
                    <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                            <i className="mdi mdi-lock-outline text-gray-400 text-lg"></i>
                        </div>
                        <Input
                            {...register("confirmPassword")}
                            type={showConfirmPassword ? "text" : "password"}
                            className="w-full -ml-10 -mr-8 pl-10 pr-10 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                            placeholder="confirm your password"
                            minLength={6}
                            maxLength={8}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                        >
                            <i className={`mdi ${showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'} text-lg`}></i>
                        </button>
                    </div>
                    {errors.confirmPassword && <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">{errors.confirmPassword.message}</div>}
                </div>
            </div>

            <div className="mb-5">
                <label className="text-xs font-semibold px-1">Captcha</label>
                <div className="flex items-center gap-3 mt-2">
                    <Input
                        {...register("captchaCode")}
                        type="text"
                        className="flex-1 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                        placeholder="Enter captcha"
                        maxLength={4}
                    />
                    <div className="flex items-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-2 h-10">
                        <div className="flex items-center justify-center h-full w-24">
                            {captchaSrc ? <Image width={100} height={48} src={captchaSrc} alt="captcha" className="h-full" /> : "Loading..."}
                        </div>
                        <Button
                            variant={'link'}
                            onClick={(e) => {
                                e.preventDefault(); // 防止事件冒泡
                                e.stopPropagation(); // 阻止事件传播
                                loadCaptcha();
                            }}
                            disabled={loadingCaptcha}
                            className="text-xs text-blue-600 hover:underline disabled:opacity-50"
                        >
                            {loadingCaptcha ? "Loading..." : "换一张"}
                        </Button>
                    </div>
                </div>
                {errors.captchaCode && <div className="mt-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">{errors.captchaCode.message}</div>}
            </div>

            {errorMsg && (
                <div className={`mb-5 p-3 rounded-lg text-center text-sm ${errorMsg.includes('successful') ? 'bg-green-50 border border-green-200 text-green-600' : 'bg-red-50 border border-red-200 text-red-600'}`}>
                    {errorMsg}
                </div>
            )}

            <div className="flex -mx-3">
                <div className="w-full px-3 mb-5">
                    <Button
                        type="submit"
                        disabled={submitting}
                        className="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg font-semibold"
                    >
                        {submitting ? "Registering..." : "Register"}
                    </Button>
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
