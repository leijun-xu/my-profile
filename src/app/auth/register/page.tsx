import { RegisterForm } from "@/components/auth/signup-form";
import DevIcons from "@/components/devtool/devtoolIcon";
import Link from "next/link";

export default function RegisterPage() {
    return (
        <>
            <style>@import url(https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/5.3.45/css/materialdesignicons.min.css)</style>

            <div className="min-w-screen min-h-screen flex items-center justify-center px-5 py-5">
                <div className="group relative ">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                    <div className="relative bg-gray-100 text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden max-w-[1000px]">
                        <div className="md:flex w-full">
                            <div className="hidden md:block w-1/2 bg-indigo-500 py-10 px-10">
                                <div className="text-white font-bold text-xl">Create your account</div>
                                <p className="text-sm text-white/90 mt-3">Already have an account? <Link href="/auth/signin" className="underline">Sign In</Link></p>
                            </div>
                            <div className="w-full md:w-1/2 py-10 px-5 md:px-10">
                                <div className="text-center mb-10">
                                    <h1 className="font-bold text-3xl text-gray-900 uppercase">register</h1>
                                    <p>Start your journey with my Resume</p>
                                </div>
                                <div>
                                    <RegisterForm />
                                </div>
                                <DevIcons />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
