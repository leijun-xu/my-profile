import { z } from "zod";

export const signInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().regex(/^[a-zA-Z0-9]{6,8}$/, "Password must be 6-8 letters or numbers"),
});

export const registerSchema = z.object({
    firstName: z
        .string()
        .regex(/^[a-zA-Z\u4e00-\u9fa5]+$/, "input English or Chinese characters only")
        .min(1, "can input 1-6 characters only")
        .max(6, "can input 1-6 characters only"),
    lastName: z
        .string()
        .regex(/^[a-zA-Z\u4e00-\u9fa5]+$/, "input English or Chinese characters only")
        .min(1, "can input 1-6 characters only")
        .max(6, "can input 1-6 characters only"),
    email: z.string().email("Invalid email address"),
    password: z.string().regex(/^[a-zA-Z0-9]{6,8}$/, "Password must be 6-8 letters or numbers"),
    confirmPassword: z.string().regex(/^[a-zA-Z0-9]{6,8}$/, "Password must be 6-8 letters or numbers"),
    captchaCode: z
        .string()
        .length(4, "Captcha must be 4 characters")
        .regex(/^[a-zA-Z0-9]{4}$/, "Captcha invalid"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
});

export type SignInFormData = z.infer<typeof signInSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
